import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import { rm } from 'node:fs/promises'
// Keep the output next to the test so import.meta.url-relative fixture paths work.
const output=new URL('./.media.test.mjs',import.meta.url)
try {
  await build({entryPoints:[new URL('./media.test.ts',import.meta.url).pathname],outfile:output.pathname,bundle:true,platform:'node',format:'esm',logLevel:'error',define:{'import.meta.env.BASE_URL':JSON.stringify('/')}})
  const result=spawnSync(process.execPath,['--test',output.pathname],{stdio:'inherit'})
  process.exitCode=result.status??1
} finally {await rm(output,{force:true})}
