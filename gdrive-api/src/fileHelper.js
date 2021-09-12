import fs from 'fs'
import prettyBytyes from 'pretty-bytes'

export default class FileHelper {
  static async getFileStatus(downloadsFolder) {
    const currentFiles = await fs.promises.readdir(downloadsFolder)
    const statuses = await Promise.all(
      currentFiles.map(file => fs.promises.stat(`${downloadsFolder}/${file}`))
    )

    const fileStatuses = []
    for (const fileIndex in currentFiles) {
      const { birthtime, size } = statuses[fileIndex]
      fileStatuses.push({
        size: prettyBytyes(size),
        file: currentFiles[fileIndex],
        lastModified: birthtime,
        owner: process.env.USER
      })
    }

    return fileStatuses
  }
}