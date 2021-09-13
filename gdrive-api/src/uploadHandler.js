import BusBoy from 'busboy'
import { pipeline } from 'stream/promises'
import fs from 'fs'

import { logger } from './logger.js'

export default class UploadHandler {
  constructor({ io, socketId, downloadsFolder, messageTimeDelay = 200 }) {
    this.io = io
    this.socketId = socketId
    this.downloadsFolder = downloadsFolder
    this.ON_UPLOAD_EVENT = 'file-upload'
    this.messageTimeDelay = messageTimeDelay
  }

  canExecute(lastExecution) {
    return (Date.now() - lastExecution) > this.messageTimeDelay
  }

  async handleFileBuffer(filename) {
    this.lastMessageSent = Date.now()

    async function* handleData(source) {
      let processedAlready = 0
      for await (const chunk of source) {
        yield chunk
        processedAlready += chunk.length

        if (!this.canExecute(this.lastMessageSent)) {
          continue
        }
        this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, { processedAlready, filename })
        logger.info(`File [${filename}] got ${processedAlready} bytes to ${this.socketId}`)
      }
    }

    return handleData.bind(this)
  }

  async onFile(fieldName, file, filename) {
    const saveTo = `${this.downloadsFolder}/${filename}`
    await pipeline(
      file,
      this.handleFileBuffer.apply(this, [filename]),
      // async function* (source) {
      //   for await (const chunk of data) {
      //     yield chunk
      //   }
      // },
      fs.createWriteStream(saveTo)
    )

    logger.info(`File [${filename}] finished`)
  }

  registerEvents(headers, onFinish) {
    const busBoy = new BusBoy({ headers })

    busBoy.on('file', this.onFile.bind(this))
    busBoy.on('finish', onFinish)

    return busBoy
  }
}