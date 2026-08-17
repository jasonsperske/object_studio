// Builds what an agent needs from this library, and keeps the per-object docs
// honest about the code they document.
//
//   node tools/agent-bundle.mjs          write dist/agent/ and refresh the docs
//   node tools/agent-bundle.mjs --check  fail if any doc is out of date
//
// Two outputs, from one pass over objects/*.js:
//
//   dist/agent/index.json   every object, its parameters and its presets
//   dist/agent/<id>.js      the generator source, as served
//   dist/agent/<id>.md      the generator's CLAUDE.md, as served
//   dist/agent/runtime.js   the compiler and three.js, so a consumer can build
//
// A static host can serve that directory as it stands, which is the whole
// point: an agent reaching for a generator has no dev server to talk to.
//
// The parameter tables inside objects/<id>.CLAUDE.md are generated from the
// object's own schema and written between the markers below. Everything
// outside them is hand-written and is left alone.

import { execFileSync } from 'node:child_process'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const objectsDir = join(root, 'objects')
const outDir = join(root, 'dist', 'agent')
const check = process.argv.includes('--check')

const BEGIN = '<!-- generated: parameters -->'
const END = '<!-- /generated: parameters -->'

/**
 * The object sources are evaluated with the studio's own compiler, which lives
 * in TypeScript beside the app. Bundling it for Node is cheaper than
 * maintaining a second copy of the injected geometry API.
 */
/**
 * The runtime a consumer needs to turn a generator into geometry: the studio's
 * compiler and the three.js it is evaluated against, bundled together so the
 * module has no imports left to resolve. That is what makes it usable by
 * something that is not a bundler — write it to disk and import it.
 */
async function buildRuntime() {
  const out = join(outDir, 'runtime.js')
  execFileSync(
    join(root, 'node_modules', '.bin', 'esbuild'),
    [
      join(root, 'tools', 'runtime-entry.ts'),
      '--bundle',
      '--format=esm',
      '--platform=neutral',
      '--minify',
      `--outfile=${out}`,
      '--log-level=error',
    ],
    { cwd: root },
  )
}

async function loadCompiler() {
  const bundle = join(root, 'node_modules', '.cache', 'agent-bundle', 'compile.mjs')
  await mkdir(dirname(bundle), { recursive: true })
  execFileSync(
    join(root, 'node_modules', '.bin', 'esbuild'),
    [
      join(root, 'src', 'lib', 'compile.ts'),
      '--bundle',
      '--format=esm',
      '--platform=node',
      `--outfile=${bundle}`,
      '--log-level=error',
    ],
    { cwd: root },
  )
  return import(bundle)
}

function serialiseParam(spec) {
  const out = {
    id: spec.id,
    label: spec.label,
    type: spec.type,
    default: spec.default,
  }
  if (spec.group) out.group = spec.group
  if (spec.help) out.help = spec.help
  if (spec.unit) out.unit = spec.unit
  if (spec.type === 'number' || spec.type === 'int') {
    out.min = spec.min
    out.max = spec.max
    out.step = spec.step
  }
  if (spec.type === 'select') {
    out.options = spec.options.map((option) => ({ value: option.value, label: option.label }))
  }
  // `visibleWhen` is a predicate over the other parameters and cannot be
  // serialised. Setting a hidden parameter is harmless — it is simply unused —
  // so what governs it is written into the object's own doc instead.
  if (spec.visibleWhen) out.conditional = true
  return out
}

function describeRange(spec) {
  if (spec.type === 'select') {
    return spec.options.map((option) => `\`${option.value}\``).join(', ')
  }
  if (spec.type === 'boolean') return '`true`, `false`'
  const unit = spec.unit ? ` ${spec.unit}` : ''
  return `${spec.min}–${spec.max}${unit}, step ${spec.step}`
}

function parameterTable(definition) {
  const groups = new Map()
  for (const spec of definition.params) {
    const group = spec.group ?? 'Parameters'
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(spec)
  }
  const lines = []
  for (const [group, specs] of groups) {
    lines.push(`**${group}**`, '')
    lines.push('| Parameter | Type | Range | Default | Notes |')
    lines.push('| --- | --- | --- | --- | --- |')
    for (const spec of specs) {
      const notes = [spec.help, spec.visibleWhen ? 'Only used in some combinations.' : null]
        .filter(Boolean)
        .join(' ')
        .replace(/\|/g, '\\|')
      lines.push(
        `| \`${spec.id}\` | ${spec.type} | ${describeRange(spec)} | \`${JSON.stringify(spec.default)}\` | ${notes} |`,
      )
    }
    lines.push('')
  }
  if (definition.presets.length) {
    lines.push('**Presets** — worked examples; each lists only what it changes.', '')
    for (const preset of definition.presets) {
      lines.push(`- **${preset.name}** — \`${JSON.stringify(preset.params)}\``)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function scaffold(definition, id) {
  return `# ${definition.name}

_No hand-written guidance yet._ Describe here what this generator makes, when an
agent should reach for it over the others, which parameters matter most for a
typical request, and what it cannot do. The table below is generated from
\`objects/${id}.js\` — do not edit it by hand.

${BEGIN}
${END}
`
}

function splice(existing, table, definition, id) {
  const body = existing ?? scaffold(definition, id)
  const start = body.indexOf(BEGIN)
  const end = body.indexOf(END)
  if (start === -1 || end === -1) {
    return `${body.trimEnd()}\n\n## Parameters\n\n${BEGIN}\n${table}${END}\n`
  }
  return `${body.slice(0, start + BEGIN.length)}\n${table}${body.slice(end)}`
}

/**
 * The worked examples in each doc are what an agent will copy, so they are
 * checked against the schema they claim to drive: every key must be a real
 * parameter, every select value must be one the parameter offers, and every
 * number must be inside its range.
 */
function checkExamples(doc, definition, id) {
  const problems = []
  const byId = new Map(definition.params.map((spec) => [spec.id, spec]))
  const presets = new Set(definition.presets.map((preset) => preset.name))
  for (const [, snippet] of doc.matchAll(/→ `\{([^`]*)\}`/g)) {
    for (const [, key, raw] of snippet.matchAll(/([A-Za-z][A-Za-z0-9]*)\s*:\s*('[^']*'|[^,]+)/g)) {
      const spec = byId.get(key)
      if (!spec) {
        problems.push(`${id}: example sets "${key}", which is not a parameter`)
        continue
      }
      const value = raw.trim().replace(/^'|'$/g, '')
      if (spec.type === 'select' && !spec.options.some((o) => o.value === value)) {
        problems.push(`${id}: ${key}='${value}' is not one of ${spec.options.map((o) => o.value).join(', ')}`)
      }
      if ((spec.type === 'number' || spec.type === 'int') && !Number.isNaN(Number(value))) {
        if (Number(value) < spec.min || Number(value) > spec.max) {
          problems.push(`${id}: ${key}=${value} is outside ${spec.min}–${spec.max}`)
        }
      }
      if (spec.type === 'boolean' && value !== 'true' && value !== 'false') {
        problems.push(`${id}: ${key}=${value} is not a boolean`)
      }
    }
  }
  // Presets referenced by name have to exist too.
  for (const [, name] of doc.matchAll(/the `([^`]+)` preset/g)) {
    if (!presets.has(name)) problems.push(`${id}: no preset called "${name}"`)
  }
  return problems
}

const { compileObject } = await loadCompiler()

const files = (await readdir(objectsDir)).filter((name) => name.endsWith('.js')).sort()
const stale = []
const wrong = []
const objects = []

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

for (const file of files) {
  const id = file.replace(/\.js$/, '')
  const source = await readFile(join(objectsDir, file), 'utf8')
  const definition = compileObject(id, source)
  const docPath = join(objectsDir, `${id}.CLAUDE.md`)
  const existing = existsSync(docPath) ? await readFile(docPath, 'utf8') : null
  const wanted = splice(existing, parameterTable(definition), definition, id)

  if (existing !== wanted) {
    stale.push(`objects/${id}.CLAUDE.md`)
    if (!check) await writeFile(docPath, wanted)
  }
  wrong.push(...checkExamples(existing ?? wanted, definition, id))

  objects.push({
    id,
    name: definition.name,
    description: definition.description,
    doc: `${id}.md`,
    source: `${id}.js`,
    params: definition.params.map(serialiseParam),
    presets: definition.presets,
  })

  await writeFile(join(outDir, `${id}.js`), source)
  await writeFile(join(outDir, `${id}.md`), check ? (existing ?? wanted) : wanted)
}

const index = {
  /** Bump when the shape of this file changes, so a consumer can refuse politely. */
  format: 1,
  library: 'Object Studio',
  /** Everything here is the studio's own work, released CC0. */
  license: 'CC0-1.0',
  guide: 'CLAUDE.md',
  /** Self-contained: `createStudioRuntime()` returns { THREE, compileObject }. */
  runtime: 'runtime.js',
  objects,
}
await writeFile(join(outDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`)
await writeFile(join(outDir, 'CLAUDE.md'), await readFile(join(root, 'CLAUDE.md'), 'utf8'))
await buildRuntime()

if (wrong.length) {
  console.error(`Worked examples that do not match the schema:\n${wrong.map((w) => `  ${w}`).join('\n')}`)
  process.exit(1)
}
if (check && stale.length) {
  console.error(`Out of date with the object sources:\n${stale.map((s) => `  ${s}`).join('\n')}`)
  console.error('Run: npm run agent-bundle')
  process.exit(1)
}
console.log(
  `agent bundle: ${objects.length} objects → dist/agent${stale.length && !check ? `, refreshed ${stale.length} doc(s)` : ''}`,
)
