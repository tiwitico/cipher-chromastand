import sharp from 'sharp'

export interface RawImage {
  data: Uint8Array // RGB, 3 channels
  width: number
  height: number
}

export async function decodeDataUrl(input: string, maxDim = 768): Promise<RawImage> {
  const m = /^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/s.exec(input)
  if (!m) {
    throw createError({ statusCode: 400, statusMessage: 'image must be a base64 data URL' })
  }
  try {
    const { data, info } = await sharp(Buffer.from(m[1], 'base64'))
      .rotate() // honour EXIF orientation
      .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    return { data: new Uint8Array(data), width: info.width, height: info.height }
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Could not decode the uploaded image' })
  }
}

export async function encodeJpegDataUrl(rgb: Uint8Array, width: number, height: number, quality = 90) {
  const buf = await sharp(Buffer.from(rgb.buffer, rgb.byteOffset, rgb.byteLength), {
    raw: { width, height, channels: 3 }
  })
    .jpeg({ quality })
    .toBuffer()
  return 'data:image/jpeg;base64,' + buf.toString('base64')
}
