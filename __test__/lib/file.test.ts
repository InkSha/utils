import fs from 'node:fs'
import crypto from 'node:crypto'
import { generatorRandom } from '@inksha/toolsets'
import { mkdir, readFile, writeFile, removeFiles, searchPath, isFile, computedFileHash, fileExist } from './../../src/lib/file'

describe('test file module', () => {
  const baseDir = './tmp_test'
  const content = 'awdadawdawdadawdaw'
  const fileList: string[] = []
  const max = Math.max(generatorRandom(), 20)

  beforeAll(() => {
    for (let i = 0; i < max; i++) {
      const tmp: string[] = []
      for (let j = 0; j < generatorRandom(0, 5); j++) {
        tmp.push(generatorRandom(0, 36).toString(36))
      }
      fileList.push(baseDir + '/' + tmp.join('') + '.txt')
    }
  })

  test('test mkdir', () => {
    expect(mkdir(baseDir)).toBe(true)
  })

  test('test write and read file', () => {
    for (const file of fileList) {
      expect(writeFile(file, content, false)).toBe(true)
      expect(readFile(file)).toEqual(content)
    }
    expect.assertions(fileList.length * 2)
  })

  test('test search file', () => {
    const name = fileList[generatorRandom(0, fileList.length - 1)]
    const keyword = name.slice(baseDir.length + 1).split('.')[0].slice(0, generatorRandom(0, 5))
    const result = searchPath(baseDir, keyword, true)
    const filter = fileList.filter(v => v.slice(baseDir.length + 1).split('.')[0].match(keyword))
    expect(result.length).toEqual(filter.length)
  })

  test('test judge file', () => {
    const name = fileList[generatorRandom(0, fileList.length - 1)]
    expect(isFile(name)).toBe(true)
  })

  test('test computed hash', () => {
    const name = fileList[generatorRandom(0, fileList.length - 1)]
    const hash = crypto
      .createHash('md5')
      .update(fs.readFileSync(name))
      .digest('hex')
    expect(computedFileHash(name)).toBe(hash)
  })

  test('test file exists', () => {
    const name = fileList[generatorRandom(0, fileList.length - 1)]
    expect(fileExist(name)).toBe(true)
  })

  test('test remove dir', () => {
    expect(removeFiles(baseDir)).toBe(false)
  })
})
