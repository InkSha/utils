import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { parsePath } from './path'
import { FileObject } from './../types'

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
 * @param file 文件路径
 * @returns 获取的文件信息
 */
export const getFileInfo = (file: string) => {
  const status = fs.statSync(file)
  const _path = path.parse(file)
  return {
    root: _path.root ?? '',
    dir: _path.dir ?? '',
    base: _path.base ?? '',
    ext: _path.ext ?? '',
    name: _path.name ?? '',
    origin: _path.name + _path.ext,
    dev: status.dev ?? 0,
    mode: status.mode ?? 0,
    nlink: status.nlink ?? 0,
    uid: status.uid ?? 0,
    gid: status.gid ?? 0,
    rdev: status.rdev ?? 0,
    blksize: status.blksize ?? 0,
    ino: status.ino ?? 0,
    size: status.size ?? 0,
    blocks: status.blocks ?? 0,
    atimeMs: status.atimeMs ?? +new Date(),
    mtimeMs: status.mtimeMs ?? +new Date(),
    ctimeMs: status.ctimeMs ?? +new Date(),
    birthtimeMs: status.birthtimeMs ?? +new Date(),
    atime: status.atime ?? new Date(),
    mtime: status.mtime ?? new Date(),
    ctime: status.ctime ?? new Date(),
    birthtime: status.birthtime ?? new Date(),
  }
}

/**
 * 判断是否是文件
 * @param path 文件路径
 * @returns 是否是文件
 */
export const isFile = (file: string) => fs.statSync(file).isFile()

/**
 * 判断是否是块设备
 * @param file 文件路径
 * @returns 是否块设备
 */
export const isBlockDevice = (file: string) => fs.statSync(file).isBlockDevice()

/**
 * 判断是否是字符设备
 * @param file 文件路径
 * @returns 是否是字符设备
 */
export const isCharacterDevice = (file: string) =>
  fs.statSync(file).isCharacterDevice()

/**
 * 判断是否是目录
 * @param file 文件路径
 * @returns 是否是目录
 */
export const isDirectory = (file: string) => fs.statSync(file).isDirectory()

/**
 * 判断是否是管道设备
 * @param file 文件路径
 * @returns 是否是管道设备
 */
export const isFIFO = (file: string) => fs.statSync(file).isFIFO()

/**
 * 判断是否是套接字
 * @param file 文件路径
 * @returns 是否是套接字
 */
export const isSocket = (file: string) => fs.statSync(file).isSocket()

/**
 * 判断是否是符号链接
 * @param file 文件路径
 * @returns 是否是符号链接
 */
export const isSymbolicLink = (file: string) =>
  fs.statSync(file).isSymbolicLink()

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
 * 计算 hash
 * @param buffer 文件数据 buffer
 * @param hash hash 格式
 * @returns 文件 hash
 */
export const computedHash = (buffer: Buffer, hash = 'md5'): string =>
  crypto.createHash(hash).update(buffer).digest('hex')

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
export const getFileSize = (file: string): number =>
  getFileInfo(file)?.size ?? 0

/**
 * 获取文件扩展名
 * @param file 获取文件扩展名
 * @returns 文件扩展名
 */
export const getExtendName = (file: string) => getFileInfo(file)?.ext ?? ''

/**
 * 移动源文件到指定位置 可用于重命名
 * @param file 源文件路径
 * @param position 移动位置
 * @param copy 是否是复制
 * @return 是否移动完毕
 */
export const moveFile = (file: string, position: string, copy = false) => {
  if (fileExist(file)) {
    if (fileExist(position) && isDirectory(position)) {
      position = path.join(position, getFileInfo(file).origin)
    }
    if (!fileExist(position)) {
      fs.renameSync(file, position)
      if (copy) {
        writeFile(file, readFile(position))
      }
      return fileExist(position)
    }
  }
  return false
}
