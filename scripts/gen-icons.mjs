// Generates PWA icons as PNG files using only Node.js built-ins (zlib + fs).
// Run once: node scripts/gen-icons.mjs
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dir, '../public/icons')
mkdirSync(OUT, { recursive: true })

// ── CRC32 table ────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[i] = c
}
function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

// ── PNG builder ────────────────────────────────────────────────────────────
function makePNG(width, height, drawFn) {
  // RGBA pixel buffer
  const pixels = new Uint8Array(width * height * 4)
  drawFn(pixels, width, height)

  // Raw scanlines with filter byte 0 (None)
  const raw = Buffer.allocUnsafe(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    const off = y * (1 + width * 4)
    raw[off] = 0
    raw.set(pixels.subarray(y * width * 4, (y + 1) * width * 4), off + 1)
  }
  const idat = deflateSync(raw, { level: 6 })

  function chunk(type, data) {
    const typeB = Buffer.from(type, 'ascii')
    const lenB = Buffer.allocUnsafe(4)
    lenB.writeUInt32BE(data.length)
    const crcB = Buffer.allocUnsafe(4)
    crcB.writeUInt32BE(crc32(Buffer.concat([typeB, data])))
    return Buffer.concat([lenB, typeB, data, crcB])
  }

  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6 // RGBA
  ihdr.fill(0, 10)

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Drawing helpers ────────────────────────────────────────────────────────
function setPixel(pixels, w, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= w || y >= Math.floor(pixels.length / w / 4)) return
  const i = (y * w + x) * 4
  pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = a
}

// Anti-aliased circle fill (returns 0‥1 coverage)
function circleCoverage(cx, cy, r, px, py) {
  const dx = px - cx, dy = py - cy
  const d = Math.sqrt(dx * dx + dy * dy)
  return Math.min(1, Math.max(0, r - d + 0.5))
}

// Rounded rectangle: returns true if (px,py) is inside with corner radius cr
function inRRect(x0, y0, x1, y1, cr, px, py) {
  if (px < x0 || px > x1 || py < y0 || py > y1) return false
  const corners = [
    [x0 + cr, y0 + cr], [x1 - cr, y0 + cr],
    [x0 + cr, y1 - cr], [x1 - cr, y1 - cr],
  ]
  if (px < x0 + cr && py < y0 + cr) return circleCoverage(...corners[0], cr, px, py) > 0.5
  if (px > x1 - cr && py < y0 + cr) return circleCoverage(...corners[1], cr, px, py) > 0.5
  if (px < x0 + cr && py > y1 - cr) return circleCoverage(...corners[2], cr, px, py) > 0.5
  if (px > x1 - cr && py > y1 - cr) return circleCoverage(...corners[3], cr, px, py) > 0.5
  return true
}

// ── Icon draw function ─────────────────────────────────────────────────────
// Design: blue rounded square bg (#4F8CFF), white inner card, blue "D" initial
function drawIcon(pixels, w, h) {
  const PRIMARY   = [0x4F, 0x8C, 0xFF]
  const WHITE     = [0xFF, 0xFF, 0xFF]
  const LIGHT_BG  = [0xEB, 0xF1, 0xFF]

  const pad = Math.round(w * 0.04)
  const cr  = Math.round(w * 0.22)  // outer corner radius

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Outer rounded square (blue)
      if (inRRect(pad, pad, w - pad - 1, h - pad - 1, cr, x, y)) {
        setPixel(pixels, w, x, y, ...PRIMARY)
      }

      // Inner white card (slightly inset, smaller radius)
      const ip = Math.round(w * 0.14)
      const icr = Math.round(w * 0.14)
      if (inRRect(ip, ip, w - ip - 1, h - ip - 1, icr, x, y)) {
        setPixel(pixels, w, x, y, ...WHITE)
      }
    }
  }

  // Draw "D" letter (simple pixel font scaled to icon)
  const cx = Math.round(w * 0.5)
  const cy = Math.round(h * 0.5)
  const lh = Math.round(h * 0.38)  // letter height
  const lw = Math.round(w * 0.26)  // letter width
  const thick = Math.max(2, Math.round(w * 0.065))

  // Vertical stroke of D
  for (let row = cy - lh / 2; row <= cy + lh / 2; row++) {
    for (let col = cx - lw / 2; col <= cx - lw / 2 + thick; col++) {
      setPixel(pixels, w, Math.round(col), Math.round(row), ...PRIMARY)
    }
  }
  // Rounded right bump (arc)
  const arcCX = cx - lw / 2 + thick / 2
  const arcR  = lh / 2
  for (let row = cy - lh / 2; row <= cy + lh / 2; row++) {
    for (let col = cx - lw / 2; col <= cx + lw / 2; col++) {
      const dy = row - cy
      // right half of ellipse
      const rw2 = (lw / 2) * (lw / 2)
      const rh2 = arcR * arcR
      const inEllipse = ((col - arcCX) * (col - arcCX)) / rw2 + (dy * dy) / rh2 <= 1
      const inInner = ((col - arcCX) * (col - arcCX)) / ((lw / 2 - thick) * (lw / 2 - thick)) +
                      (dy * dy) / ((arcR - thick) * (arcR - thick)) <= 1
      if (inEllipse && !inInner && col >= arcCX) {
        setPixel(pixels, w, Math.round(col), Math.round(row), ...PRIMARY)
      }
    }
  }
  // Top and bottom horizontal bars
  for (let col = cx - lw / 2; col <= cx; col++) {
    for (let t = 0; t < thick; t++) {
      setPixel(pixels, w, Math.round(col), Math.round(cy - lh / 2) + t, ...PRIMARY)
      setPixel(pixels, w, Math.round(col), Math.round(cy + lh / 2) - t, ...PRIMARY)
    }
  }

  // Small accent dots (top-right area) — decorative
  const dotR = Math.max(1, Math.round(w * 0.04))
  const d1x = Math.round(cx + lw * 0.9)
  const d1y = Math.round(cy - lh * 0.55)
  for (let dy = -dotR; dy <= dotR; dy++) {
    for (let dx2 = -dotR; dx2 <= dotR; dx2++) {
      if (dx2 * dx2 + dy * dy <= dotR * dotR) {
        setPixel(pixels, w, d1x + dx2, d1y + dy, ...LIGHT_BG)
      }
    }
  }
}

// ── Generate all sizes ─────────────────────────────────────────────────────
const sizes = [
  { name: 'icon-192.png',        size: 192 },
  { name: 'icon-512.png',        size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png',      size: 32  },
]

for (const { name, size } of sizes) {
  const buf = makePNG(size, size, drawIcon)
  const out = join(OUT, name)
  writeFileSync(out, buf)
  console.log(`✓ ${out}  (${buf.length} bytes)`)
}

// ── Minimal ICO (16×16 + 32×32 embedded) ──────────────────────────────────
function makeICO(pngBufs) {
  const count = pngBufs.length
  const headerSize = 6 + count * 16
  let offset = headerSize
  const entries = pngBufs.map((buf, i) => {
    const size = [32, 16][i] ?? 32
    const e = { size, offset, len: buf.length }
    offset += buf.length
    return e
  })

  const header = Buffer.allocUnsafe(6)
  header.writeUInt16LE(0, 0)    // reserved
  header.writeUInt16LE(1, 2)    // type: ICO
  header.writeUInt16LE(count, 4)

  const entryBufs = entries.map(({ size, offset: off, len }) => {
    const e = Buffer.allocUnsafe(16)
    e[0] = size >= 256 ? 0 : size   // width
    e[1] = size >= 256 ? 0 : size   // height
    e[2] = 0; e[3] = 0              // color count, reserved
    e.writeUInt16LE(1, 4)           // planes
    e.writeUInt16LE(32, 6)          // bit count
    e.writeUInt32LE(len, 8)
    e.writeUInt32LE(off, 12)
    return e
  })

  return Buffer.concat([header, ...entryBufs, ...pngBufs])
}

const png32 = makePNG(32, 32, drawIcon)
const png16 = makePNG(16, 16, drawIcon)
const ico = makeICO([png32, png16])
writeFileSync(join(OUT, 'favicon.ico'), ico)
console.log(`✓ ${join(OUT, 'favicon.ico')}  (${ico.length} bytes)`)

console.log('\nAll icons generated successfully!')
