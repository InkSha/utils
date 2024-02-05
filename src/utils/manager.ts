/**
 * 管理器
 */
export class Manager {

  private id: number[] = []
  private values: Map<number, any> = new Map()

  /**
   * 管理器
   * @param idMax id最大值
   */
  constructor (private idMax = 2 ** 7) {}

  /**
   * 加载成员
   * @param initialization 成员列表
   * @param callback 可选的回调函数
   */
  load<T = any> (initialization: T[], callback?: (id: number, val: T) => void) {
    for (const member of initialization) {
      const id = this.add(member)
      if (callback) callback(id, member)
    }
  }

  /**
   * 在管理器内查找成员
   * @param id 查找的成员 id
   * @returns 获取的成员
   */
  get<T = any> (id: number) {
    return this.has(id)
      ? this.values.get(id) as T
      : null
  }

  /**
   * 增加成员到管理器内
   * @param val 增加的成员
   * @returns 对应 id
   */
  add<T = any> (val: T) {
    const id = this.generatorId()
    this.id.push(id)
    this.values.set(id, val)
    return id
  }

  /**
   * 从管理器内删除指定成员
   * @param id 删除的成员 id
   * @returns 删除的成员
   */
  del<T = any> (id: number) {
    if (this.values.has(id)) {
      const val = this.values.get(id)
      const index = this.id.indexOf(id)
      if (index >= 0) this.id.splice(index, 1)
      this.values.delete(id)
      return val as T
    }
    return null
  }

  /**
   * 查询成员是否存在于管理器内
   * @param id 查询的成员 id
   * @returns 成员是否存在于管理器内
   */
  has (id: number) {
    return this.values.has(id)
  }

  /**
   * 更改管理器内指定 id 的成员
   * @param id 更改的成员 id
   * @param val 更改的成员
   * @returns 更改的成员 id
   */
  update<T = any> (id: number, val: T) {
    this.values.set(id, val)
    return id
  }

  /** 清空管理器 */
  clear () {
    this.values.clear()
    this.id.length = 0
  }

  /**
   * 查询所有 id
   * @returns 一个包含当前管理器的所有成员 id 的数组副本
   */
  queryAllId () {
    return JSON.parse(JSON.stringify(this.id))
  }

  /**
   * 生成成员 id
   * 如果 id 超过最大 id 限制则抛出一个错误
   * @returns 生成的成员 id
   */
  private generatorId () {
    if (this.id.length < this.idMax) {
      for (let i = 0; i < this.idMax; i++) {
        if (!this.id.includes(i)) {
          if (this.has(i)) continue
          this.id.push(i)
          return i
        }
      }
    }
    throw new Error(`The maximum ID can only be ${this.idMax - 1}!`)
  }
}
