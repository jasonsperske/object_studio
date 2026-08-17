// The entry point for dist/agent/runtime.js — see tools/agent-bundle.mjs.
//
// A consumer that wants to turn a generator into geometry needs two things:
// the compiler that evaluates an object source, and the three.js it is
// evaluated against. Both are bundled in here so that the module is
// self-contained: it has no imports to resolve, which is what lets it be
// fetched and evaluated somewhere that is not a bundler.
import * as THREE from 'three'
import { compileObject, ObjectSourceError, setDisplayUnits } from '../src/lib/compile'

export function createStudioRuntime() {
  return { THREE, compileObject, ObjectSourceError, setDisplayUnits }
}
