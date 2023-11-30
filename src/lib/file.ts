/**
 * @file File handling modules file.
 * @description Storage project all file handling tools.
 * @license MIT
 * @author InkSha<git@inksha.com>
 * @created 2023-11-11
 * @updated 2023-11-25
 * @version 1.0.2
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { parsePath } from './path'
import { FileObject } from './../types'
import { asyncExec } from '@inksha/toolsets'

/**
 * 创建文件夹
 * @param dir 文件夹名称
 * @returns 文件夹是否创建成功
 */
export const mkdir = (dir: string): boolean => {
  const parse = path.parse(dir)
  dir = parse.ext ? parse.dir : dir
  for (const _path of parsePath(dir)) {
    if (!fileExist(_path)) fs.mkdirSync(_path)
  }
  return fileExist(dir)
}

/**
 * 读取文件内容
 * @param filePath 文件路径
 * @param binary 是否二进制数据
 * @returns 读取的文件数据
 */
export const readFile = (filePath: string, binary = false): string => {
  return fileExist(filePath)
    ? filePath
      ? fs.readFileSync(filePath, {
        encoding: binary ? 'binary' : 'utf8',
      })
      : ''
    : ''
}

/**
 * 写入文件
 * @param filePath 文件路径
 * @param data 写入的文件内容
 * @param append 是否追加
 * @returns 文件是否存在
 */
export const writeFile = (
  filePath: string,
  data: string | NodeJS.ArrayBufferView,
  append = true,
): boolean => {
  if (mkdir(filePath)) {
    fs.writeFileSync(filePath, data, {
      flag: append ? 'a+' : 'w+',
      encoding: typeof data === 'string' ? 'utf-8' : 'binary',
    })
  }
  return fileExist(filePath)
}

/**
 * 查询文件是否存在
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
export const fileExist = (filePath: string): boolean => fs.existsSync(filePath)

/**
 * 删除文件
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
export const removeFiles = (filePath: string): boolean => {
  if (fileExist(filePath)) fs.rmSync(filePath, { recursive: true, force: true })
  return fileExist(filePath)
}

/**
 * 创建流
 * @param filepath 文件路径
 * @returns 创建的文件流
 */
export const createStream = (filepath: string) => fs.createReadStream(filepath)

/**
 * 生成文件对象
 * @param name 文件名
 * @param path 所在路径
 * @param extname 扩展名
 * @param dir 是否目录
 * @param file 是否文件
 * @returns 文件对象
 */
export const genFileObject = (
  name: string,
  path: string,
  extname = '',
  dir = false,
): FileObject => {
  return { name, path, extname, dir, file: !dir }
}

/**
 * 获取文件信息
 * @param path 文件路径
 * @returns 获取的文件信息
 */
export const getFileInfo = (path: string) => fileExist(path) ? fs.statSync(path) : undefined

/**
 * 判断是否是文件
 * @param path 文件路径
 * @returns 是否是文件
 */
export const isFile = (path: string) => getFileInfo(path)?.isFile() ?? false

/**
 * 搜索文件
 * @param basePath 搜索路径
 * @param keyword 搜索关键字
 * @param hasChild 是否包含子目录
 * @param result 结果集
 * @returns 结果集
 */
export const searchPath = (
  basePath = '/tmp',
  keyword = '',
  hasChild = false,
  result: FileObject[] = [],
): FileObject[] => {
  for (const dirent of fs.readdirSync(basePath)) {
    if (dirent.match(keyword)) {
      const filePath = path.join(basePath, dirent)
      const extname = dirent.split('.').slice(-1)[0]
      const isDir = !isFile(filePath)
      const obj = genFileObject(dirent, filePath, extname, isDir)
      result.push(obj)
      if (isDir) searchPath(filePath, keyword, hasChild, result)
    }
  }
  return result
}

/**
 * 异步创建流
 * @param filepath 文件路径
 * @returns 包含创建文件流的 Promise
 */
export const createSteamSync = (filepath: string) =>
  asyncExec(() => createStream(filepath))

/**
 * 异步创建文件夹
 * @param dir 文件夹名称
 * @returns 包含文件夹是否存在的 Promise
 */
export const mkdirAsync = (dir: string) => asyncExec(() => mkdir(dir))

/**
 * 异步读取文件
 * @param filePath 文件路径
 * @returns 包含文件内容的 Promise
 */
export const readFileAsync = (filePath: string) =>
  asyncExec(() => readFile(filePath))

/**
 * 异步写入文件
 * @param filePath 文件路径
 * @param data 写入数据
 * @param append 是否追加
 * @returns 包含文件是否存在的 Promise
 */
export const writeFileAsync = (
  filePath: string,
  data: string | NodeJS.ArrayBufferView,
  append = true,
) => asyncExec(() => writeFile(filePath, data, append))

/**
 * 异步的判断文件是否存在
 * @param filePath 文件路径
 * @returns 包含文件是否存在的 Promise
 */
export const fileExistAsync = (filePath: string) =>
  asyncExec(() => fileExist(filePath))

/**
 * 异步删除文件
 * @param filePath 文件路径
 * @returns 包含文件是否存在的 Promise
 */
export const removeFilesAsync = (filePath: string) =>
  asyncExec(() => removeFiles(filePath))

/**
 * 计算 hash
 * @param buffer 文件数据 buffer
 * @param hash hash 格式
 * @returns 文件 hash
 */
export const computedHash = (buffer: Buffer, hash?: string): string =>
  crypto
    .createHash(hash ?? 'md5')
    .update(buffer)
    .digest('hex')

/**
 * 计算文件hash
 * @param file 文件路径
 * @returns 计算出的 hash
 */
export const computedFileHash = (file: string): string => {
  let hash = ''
  if (fileExist(file)) {
    hash = computedHash(fs.readFileSync(file))
  }
  return hash
}

/**
 * 获取文件大小
 * @param file 文件路径
 * @returns 文件大小
 */
export const getFileSize = (file: string): number => getFileInfo(file)?.size ?? 0

export const getExtendName = (file: string) => file.replaceAll('\\', '/').split('/').slice(-1)[0].split('.')[1]

export const renameFile = (file: string, name: string) => {
  const _path = parsePath(file).slice(-1)[0]
  const ext = getExtendName(file)
  name = parsePath(name).slice(-1)[0]
  const newFile = path.join(_path, [name, ext].join('.'))
  if (fileExist(newFile)) {
    return ''
  }
  writeFile(newFile, readFile(file))
  return removeFiles(file)
}
