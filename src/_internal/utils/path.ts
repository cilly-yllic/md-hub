import { existsSync } from 'fs'
import { join, parse, relative } from 'path'

import { SETTING_FILE_NAME } from './configs.js'

export const getProjectRootPath = () => {
  let path = process.cwd()
  if (!existsSync(join(path, SETTING_FILE_NAME))) {
    for (const _ in process.cwd().split(/\//g)) {
      path = join(path, '..')
      if (existsSync(join(path, SETTING_FILE_NAME))) {
        break
      }
    }
  }

  return path
}

export const getFullPath = (...path: string[]) => join(getProjectRootPath(), ...path)

export const getDir = (path: string) => {
  return parse(path).dir
}

export const DEPTH_TYPES = {
  ancestor: 'ancestor',
  parent: 'parent',
  parallel: 'parallel',
  child: 'child',
  grandchild: 'grandchild',
  different: 'different',
}
export type DepthType = typeof DEPTH_TYPES[keyof typeof DEPTH_TYPES]
/**
 * A: /hoge, B: /hoge/foo/piyo -> ancestor
 * A: /hoge/foo, B: /hoge/foo/piyo -> parent
 * A: /hoge/foo, B: /hoge/foo -> parallel
 * A: /hoge/foo/piyo, B: /hoge/foo -> child
 * A: /hoge/foo/piyo, B: /hoge -> grandchild
 * A: /foo, B: /hoge -> different
 * @param thisDir
 * @param isTypeFromThisDir
 */
export const getDepthType = (thisDir: string, isTypeFromThisDir: string): DepthType => {
  if (thisDir === isTypeFromThisDir) {
    return DEPTH_TYPES.parallel
  }
  const thisDirSeparators = thisDir.split('/')
  const isTypeFromThisDirSeparators = isTypeFromThisDir.split('/')
  if (thisDir.startsWith(isTypeFromThisDir)) {
    if (thisDirSeparators.length - isTypeFromThisDirSeparators.length === 1) {
      return DEPTH_TYPES.child
    } else {
      return DEPTH_TYPES.grandchild
    }
  } else if (isTypeFromThisDir.startsWith(thisDir)) {
    if (isTypeFromThisDirSeparators.length - thisDirSeparators.length === 1) {
      return DEPTH_TYPES.parent
    } else {
      return DEPTH_TYPES.ancestor
    }
  }
  return DEPTH_TYPES.different
}

export const getRelative = (dir: string, path: string) => relative(dir, path)