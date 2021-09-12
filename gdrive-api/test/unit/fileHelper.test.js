import { describe, test, expect, jest } from '@jest/globals'
import fs from 'fs'

import FileHelper from '../../src/fileHelper.js'

describe('#FileHelper test suite', () => {
  describe('#getFileStatus', () => {
    test('it should return files statuses in correct format', async () => {
      const statsMock = {
        dev: 2051,
        mode: 33204,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 19139498,
        size: 9709,
        blocks: 24,
        atimeMs: 1631419923593.4937,
        mtimeMs: 1631419923545.4941,
        ctimeMs: 1631419923545.4941,
        birthtimeMs: 1631419923545.4941,
        atime: '2021-09-12T04:12:03.593Z',
        mtime: '2021-09-12T04:12:03.545Z',
        ctime: '2021-09-12T04:12:03.545Z',
        birthtime: '2021-09-12T04:12:03.545Z',
        name: 'file.png'
      }
      const mockUser = 'matheus'
      const fileName = 'file.png'

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([fileName])

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statsMock)

      const result = await FileHelper.getFileStatus("/tmp")

      const expectedResult = [
        {
          size: "9.71 kB",
          lastModified: statsMock.birthtime,
          owner: mockUser,
          file: fileName
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${fileName}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})
