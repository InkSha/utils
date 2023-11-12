import { getIPAddress, usePort } from './../../src/lib/os'
import net from 'node:net'

describe('test os module', () => {

  test('test get ip address is match', () => {
    expect(getIPAddress()).toBe(getIPAddress())
  })

  test('test use port', async () => {
    const server: net.Server[] = []
    const port = 3000
    const max = 2

    for (let i = 0; i < max; i++) {
      server.push(net.createServer().listen(port + i))
    }
    new Promise((resolve, reject) => {
      usePort(p => {
        expect(p).toBe(port + max)
        resolve(true)
      })
    })
      .then(() => {
        server.forEach(s => s.close())
        return true
      })
      .then(() => {
        usePort(p => {
          expect(p).toBe(port)
        })
      })
      .finally(() => {
        expect.assertions(2)
      })
  })
})
