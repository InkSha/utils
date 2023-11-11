/**
 * @file Path module.
 * @description Some Math operations.
 * @license MIT
 * @author InkSha<git@inksha.com>
 * @created 2023-11-11
 * @updated 2023-11-11
 * @version 1.0.0
 */

import path from 'node:path'

/**
 * 解析路径
 * @param _path 路径
 * @returns 路径数组
 */
export function parsePath(_path: string): string[] {
  const result: string[] = []
  if (_path) {
    const root = getRoot(_path)
    let tmpPath = path.parse(_path)
    if (root) _path = _path.slice(1)
    result.push(tmpPath.ext ? tmpPath.dir : _path)
    while (tmpPath.dir) {
      if (!tmpPath.ext) {
        result.push(`${root}${tmpPath.dir}`)
      }
      tmpPath = path.parse(tmpPath.dir)
    }
  }
  return result.reverse()
}

/**
 * 获取根路径
 * @param filepath 文件路径
 * @returns 获取的可能存在的根
 */
export function getRoot(filepath: string) {
  const char = filepath.charAt(0)
  return isRoot(char) ? char : ''
}

/**
 * 判断字符是否属于根字符
 * @param char 判断的字符
 * @returns 是否属于根字符
 */
export function isRoot(char: string) {
  return ['/', '\\'].includes(char)
}
