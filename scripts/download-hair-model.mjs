// Downloads the hair segmentation model into ./models so the server runs fully offline
// (use in Dockerfile / CI:  pnpm run models:download)
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const REPO = 'Xenova/segformer_b2_clothes'
const FILES = ['config.json', 'preprocessor_config.json', 'onnx/model_quantized.onnx']
const root = join(process.cwd(), 'models', REPO)

for (const f of FILES) {
  const out = join(root, f)
  if (existsSync(out)) { console.log('ok     ', f); continue }
  await mkdir(dirname(out), { recursive: true })
  const res = await fetch(`https://huggingface.co/${REPO}/resolve/main/${f}`)
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${f}`)
  await writeFile(out, Buffer.from(await res.arrayBuffer()))
  console.log('fetched', f)
}
console.log('Hair model ready in', root)
