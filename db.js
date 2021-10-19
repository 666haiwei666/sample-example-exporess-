const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const dbPath = path.join(__dirname, './db.json')

exports.readFile = async () => {
  try {
    let res = await readFile(dbPath, 'utf8')
    return JSON.parse(res)
  } catch {
    return {}
  }
}

exports.writeFile = async (content) => {
  await writeFile(dbPath, JSON.stringify(content, null, '  '))
}
