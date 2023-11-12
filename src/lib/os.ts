/**
 * @file OS module.
 * @description Some os operations.
 * @license MIT
 * @author InkSha<git@inksha.com>
 * @created 2023-11-11
 * @updated 2023-11-11
 * @version 1.0.0
 */

import os from 'node:os'
import net from 'node:net'

const localhost = '127.0.0.1'
const portUse = 'EADDRINUSE'

/**
 * 获取当前 IP 地址
 * @returns 当前 IP 地址
 */
export function getIPAddress() {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName] ?? []
    for (const alias of iface) {
      if (
        alias.family === 'IPv4' &&
        alias.address !== localhost &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
  return ''
}

/**
 * 获取未使用端口
 * @param port 查看使用的端口
 * @returns 一个包含获取到的未使用端口的 Promise
 */
export function portUsed(port: number = 0) {
  return new Promise<number>((resolve, reject) => {
    if (port >= 2 ** 16) {
      reject(new Error('Port cross the border'))
    }
    const server = net
      .createServer()
      .listen(port)
      .on('listening', () => {
        server.close()
        resolve(port)
      })
      .on('error', (error: Error & { code: typeof portUse }) => {
        if (error.code === portUse) {
          resolve(portUsed(port + 1))
        } else reject(error)
      })
  })
}

/**
 * 使用端口
 * @param callback 接受端口为参数的回调函数
 * @param start 指定端口
 */
export async function usePort(callback: (port: number) => void, start = 3000) {
  portUsed(start)
    .then((port) => callback(port))
    .catch((error) => {
      throw error
    })
}
