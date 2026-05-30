import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const HOST = 'patchwindow.serverdigital.net'
const KEY = '6eb6b3625ab64accb883d079131c9630'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const FORMATS = ['hot-take', 'deep-dive', 'brief', 'guides']

function getPublishedUrls() {
  const urls = []
  for (const format of FORMATS) {
    const dir = path.join(ROOT, 'content', 'articles', format)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data } = matter(raw)
      if (data.draft === true) continue
      if (new Date(data.publishedAt) > new Date()) continue
      urls.push(`https://${HOST}/${format}/${data.slug}`)
    }
  }
  return urls
}

async function pingIndexNow(urls) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  })

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  })

  return res
}

const cliUrls = process.argv.slice(2)
const urls = cliUrls.length > 0 ? cliUrls : getPublishedUrls()

if (urls.length === 0) {
  console.log('Inga publicerade artiklar hittades.')
  process.exit(0)
}

console.log(`Skickar ${urls.length} URL(er) till IndexNow:`)
urls.forEach((u) => console.log(`  ${u}`))

const response = await pingIndexNow(urls)

if (response.ok || response.status === 202) {
  console.log(`IndexNow: OK (HTTP ${response.status})`)
} else {
  const text = await response.text()
  console.error(`IndexNow misslyckades: HTTP ${response.status}`)
  console.error(text)
  process.exit(1)
}
