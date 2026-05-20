import http from 'node:http'
import csvParser from 'csv-parser'
import fs from 'node:fs'
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

const server = http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', '*')
  response.setHeader('Access-Control-Allow-Headers', '*')

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    return response.end()
  }

  if (request.url == '/data' && request.method === 'GET') {
    const readStream = fs.createReadStream('./global_movies_dataset_1950_2026.csv')
    const transform = csvParser({ mapHeaders: ({header}) => header.trim()})

    response.setHeader('Content-Type', 'application/x-ndjson')

    // TRANSFORMAÇÃO
    const toNdjson = async function*(data: AsyncIterable<any>) {
      for await (const item of data) {
        if (item) {
          const obj = JSON.stringify(item).concat('\n')
          yield obj
        }
      }
    }

    request.on('close', () => {
      if (!response.writableEnded) readStream.destroy()
    })

    try {
      await pipeline(readStream, transform, toNdjson, response)
    } catch (err: any) {
      if (err?.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
        console.error('pipeline error:', err)
      }
      console.error({err})
    }
    return
  }
})

server.listen(3333, 'localhost', () => {
  console.log('server is running')
})
