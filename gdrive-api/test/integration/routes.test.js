import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  beforeAll,
  afterAll
} from '@jest/globals'
import fs from 'fs'
import FormData from 'form-data'
import { tmpdir } from 'os'
import { join } from 'path'

import Routes from '../../src/routes.js'
import FileHelper from '../../src/fileHelper.js'
import TestUtil from '../_util/testUtil.js'
import { logger } from '../../src/logger.js'

describe('#Routes integration test', () => {
  let defaultDownloadsFolder = ''
  beforeAll(async () => {
    defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
  })
  afterAll(async () => {
    await fs.promises.rm(defaultDownloadsFolder, { recursive: true })
  })
  beforeEach(() => {
    jest.spyOn(logger, 'info')
      .mockImplementation()
  })

  const ioObject = {
    to: (id) => ioObject,
    emit: (event, message) => { }
  }

  test('should upload file to the folder', async () => {
    const filename = 'image-mock.jpg'
    const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
    const response = TestUtil.generateWriteableStream(() => { })

    const form = new FormData()
    form.append('photo', fileStream)

    const defaultParams = {
      request: Object.assign(form, {
        headers: form.getHeaders(),
        method: 'POST',
        url: '?socketId=10'
      }),
      response: Object.assign(response, {
        setHeader: jest.fn(),
        writeHead: jest.fn(),
        end: jest.fn()
      }),
      values: () => Object.values(defaultParams)
    }
    const route = new Routes(defaultDownloadsFolder)

    route.setSocketInstance(ioObject)

    const dirBeforeRun = await fs.promises.readdir(defaultDownloadsFolder)
    expect(dirBeforeRun).toEqual([])

    await route.handler(...defaultParams.values())

    const dirAfterRun = await fs.promises.readdir(defaultDownloadsFolder)
    expect(dirAfterRun).toEqual([filename])

    expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200)
    const expectedResult = JSON.stringify({ result: 'Files Uploaded' })
    expect(defaultParams.response.end).toHaveBeenCalledWith(expectedResult)
  })
})
