/** 获取文件的选项 */
export interface requestFileOptions {
  /** 文件网络路径列表 */
  files: string[]
  /** 保存路径 */
  dir: string
  /** 保存扩展名 */
  ext: string
  /** 请求方法 默认 GET */
  method: string
  /**
   * 重命名图片
   * @param name 旧的图片名称
   * @returns 新的图片名称
   */
  rename: (name: string) => string
}

export interface FileObject {
  dir: boolean
  file: boolean
  name: string
  extname: string
  path: string
}
