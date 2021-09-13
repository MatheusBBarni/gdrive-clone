import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import fs from 'fs'
import { resolve } from 'path'
import { pipeline } from 'stream/promises'
import { logger } from '../../src/logger.js'
import UploadHanlder from '../../src/uploadHandler.js'
import TestUtil from '../_util/testUtil.js'

describe('#UploadHanlder test suite', () => {
  const ioObject = {
    to: (id) => ioObject,
    emit: (event, message) => { }
  }
  beforeEach(() => {
    jest.spyOn(logger, 'info')
      .mockImplementation()
  })

  describe('#registerEvents', () => {
    test('should call onFile and onFinish functions on Busboy instance', () => {
      const uploadHandler = new UploadHanlder({ io: ioObject, socketId: '0' })

      jest.spyOn(uploadHandler, uploadHandler.onFile.name)
        .mockResolvedValue()

      const headers = {
        'content-type': 'multipart/form-data; boundary='
      }
      const onFinish = jest.fn()
      const busboyInstance = uploadHandler.registerEvents(headers, onFinish)

      const fileStream = TestUtil.generateReadableStream(['chunk', 'of', 'data'])
      busboyInstance.emit('file', 'fieldname', fileStream, 'filename.txt')

      busboyInstance.listeners('finish')[0].call()

      expect(uploadHandler.onFile).toHaveBeenCalled()
      expect(onFinish).toHaveBeenCalled()
    })
  })

  describe('#onFile', () => {
    test('given a stream file it should save it on disk', async () => {
      const chunks = ['hello', 'world', 'filestream']
      const downloadsFolder = '/tmp'
      const handler = new UploadHanlder({
        io: ioObject,
        socketId: '0',
        downloadsFolder
      })

      const onWrite = jest.fn()
      const onTransform = jest.fn()

      jest.spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtil.generateWriteableStream(onWrite))
      jest.spyOn(handler, handler.handleFileBuffer.name)
        .mockImplementation(() => TestUtil.generateTransformStream(onTransform))

      const params = {
        fieldname: 'video',
        file: TestUtil.generateReadableStream(chunks),
        filename: 'mockfile.png'
      }
      await handler.onFile(...Object.values(params))

      expect(onWrite.mock.calls.join()).toEqual(chunks.join())
      expect(onTransform.mock.calls.join()).toEqual(chunks.join())

      const expectedFilename = resolve(handler.downloadsFolder, params.filename)
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFilename)
    })
  })

  describe('#handleFileBuffer', () => {
    test('should call emit function and it is a transform stream', async () => {
      jest.spyOn(ioObject, ioObject.to.name)
      jest.spyOn(ioObject, ioObject.emit.name)

      const handler = new UploadHanlder({
        io: ioObject,
        socketId: '1'
      })

      jest.spyOn(handler, handler.canExecute.name)
        .mockReturnValueOnce(true)

      const messages = ['messages', 'test']
      const source = TestUtil.generateReadableStream(messages)
      const onWrite = jest.fn()
      const target = TestUtil.generateWriteableStream(onWrite)

      await pipeline(
        source,
        handler.handleFileBuffer('filename.txt'),
        target
      )

      expect(ioObject.to).toHaveBeenCalledTimes(messages.length)
      expect(ioObject.emit).toHaveBeenCalledTimes(messages.length)
      expect(onWrite).toHaveBeenCalledTimes(messages.length)
      expect(onWrite.mock.calls.join()).toEqual(messages.join())
    })

    // TODO: stopped the lesson on 1:37:48
    test.todo('')
  })

  describe('#canExecute', () => {
    test('should retrun true when time is later than specified delay', () => {
      const timerDelay = 1000
      const uploadHandler = new UploadHanlder({
        io: {},
        socketId: '',
        messageTimeDelay: timerDelay
      })

      const tickNow = TestUtil.getTimeFromDate('2021-09-12 22:30:03')
      TestUtil.mockDateNow([tickNow])

      const lastExecution = TestUtil.getTimeFromDate('2021-09-12 22:30:00')

      const result = uploadHandler.canExecute(lastExecution)

      expect(result).toBeTruthy()
    })
    test('should retrun false when time isn`t later than specified delay', () => {
      const timerDelay = 3000
      const uploadHandler = new UploadHanlder({
        io: {},
        socketId: '',
        messageTimeDelay: timerDelay
      })

      const now = TestUtil.getTimeFromDate('2021-09-12 22:30:02')
      TestUtil.mockDateNow([now])

      const lastExecution = TestUtil.getTimeFromDate('2021-09-12 22:30:01')

      const result = uploadHandler.canExecute(lastExecution)

      expect(result).toBeFalsy()
    })
  })
});