# Panduan Favicon untuk Project Pilkada Dashboard

## File Favicon yang Tersedia

Project ini sudah dikonfigurasi dengan favicon modern yang mendukung berbagai browser dan device:

### File yang Sudah Ada:

- `public/favicon.ico` - Favicon klasik untuk browser lama
- `public/favicon.svg` - Favicon SVG modern (scalable)
- `public/apple-touch-icon.png` - Icon untuk iOS devices
- `public/manifest.json` - Web app manifest untuk PWA

## Cara Mengganti Favicon

### 1. Mengganti favicon.ico

Ganti file `public/favicon.ico` dengan file .ico Anda sendiri. Ukuran yang direkomendasikan:

- 16x16 pixel (untuk browser lama)
- 32x32 pixel (standar)
- 48x48 pixel (untuk resolusi tinggi)

### 2. Mengganti favicon.svg

Ganti file `public/favicon.svg` dengan SVG icon Anda. SVG lebih fleksibel karena scalable.

### 3. Mengganti apple-touch-icon.png

Ganti file `public/apple-touch-icon.png` dengan PNG 180x180 pixel untuk iOS devices.

### 4. Mengganti manifest.json

Update file `public/manifest.json` sesuai dengan icon dan branding Anda.

## Tools untuk Membuat Favicon

1. **Favicon.io** - https://favicon.io/

   - Upload gambar dan dapatkan semua ukuran favicon
   - Mendukung SVG, PNG, dan ICO

2. **RealFaviconGenerator** - https://realfavicongenerator.net/

   - Tool lengkap untuk semua platform
   - Menghasilkan semua ukuran yang diperlukan

3. **Favicon Generator** - https://www.favicon-generator.org/
   - Tool sederhana untuk membuat favicon dari gambar

## Konfigurasi Metadata

Favicon sudah dikonfigurasi di `app/layout.tsx` dengan metadata yang mendukung:

- Browser modern (SVG)
- Browser lama (ICO)
- iOS devices (apple-touch-icon)
- PWA support (manifest.json)

## Testing

Setelah mengganti favicon, test di:

1. Browser desktop (Chrome, Firefox, Safari, Edge)
2. Mobile browser
3. iOS Safari (untuk apple-touch-icon)
4. PWA installation (untuk manifest)

## Catatan

- Pastikan file favicon berada di folder `public/`
- Nama file harus sesuai dengan yang dikonfigurasi di metadata
- Untuk production, gunakan favicon yang berkualitas tinggi
- SVG favicon memberikan hasil terbaik di browser modern
