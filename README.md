## Documentation Source Code Widget Aksesibilitas Versi 2.3.0

  Widget Ini Sudah Di Gunakan Di Beberapa Domain Dan Sub Domain Pemerintah.

  Personal Web [Fathul-Hudoyo](https://fathulhudoyo.info/).

  Web Streaming Msc [Anime Msc](https://animemusic.us/).

  Di Sarankan Menggunakan Url [Widget-Aksesbilitas](https://web.animemusic.us/widget_disabilitas.js) ( https://web.animemusic.us/widget_disabilitas.js )
  Agar Mendapatkan Pembaharuan Otomatis Dan Jika Ada Error Bisa Saya Resolve Langsung Estimasi Paling Lama 4 - 9 Hari

## Yang Baru di Versi 2.3.0

Cara pasang tidak berubah. URL skrip, atribut `api-key-resvoice` / `api-key-google`, variabel `api_key_google_cloud`, dan pengaturan yang sudah tersimpan di peramban pengguna tetap berlaku.

- Tampilan menu baru: baris menu (Bahasa, Profil Aksesibilitas, Struktur Halaman, Pengaturan Warna, Pindahkan Widget) dan petak yang dikelompokkan menjadi Suara &amp; Gerak, Teks &amp; Bacaan, Warna &amp; Gambar, serta Navigasi &amp; Fokus.
- Fitur baru: Bahasa Isyarat SIBI dan BISINDO dengan avatar 3D (data masih draf, lihat bagian Bahasa Isyarat), Struktur Halaman, Pengaturan Warna, Baca Halaman, Bisukan Media, Deskripsi Gambar, Teks Tebal, Sorot Judul, dan Sorot Fokus. Spasi Teks dipecah menjadi Spasi Huruf dan Spasi Kata.
- Urutan suara baru yang sama untuk ponsel dan desktop: Google Cloud Text-to-Speech → ResponsiveVoice → suara bawaan perangkat. Bila satu mesin gagal, widget otomatis pindah ke mesin berikutnya, dan menampilkan pesan bila tidak ada suara sama sekali, tidak lagi diam (lihat bagian Urutan Suara). Perilaku yang berubah: di desktop, situs yang mengisi `api-key-resvoice` / `api-key-google` kini memakai ResponsiveVoice / Google, bukan lagi langsung suara bawaan peramban.
- Penyesuaian iPhone, iPad, dan Safari:
  - **suara**: izin audio dibuka saat petak diketuk; iPad dengan iPadOS 13 ke atas dikenali sebagai iOS; trik jaga-suara khusus Chrome tidak dijalankan di Safari.
  - **tampilan**:
    - nonce CSP dipasang lewat properti dan atribut sekaligus, karena Safari < 15.4 hanya mengenali atribut (sebelumnya, di situs ber-CSP nonce, CSS widget bisa diblokir di Safari lama);
    - teks widget memakai `-webkit-text-size-adjust: 100%`, agar iOS tidak membesarkannya sendiri saat landscape;
    - tinggi maksimum panel Bahasa Isyarat memakai `dvh` (iOS 15.4+, dengan cadangan `vh`);
    - cadangan `:focus` untuk cincin fokus dan Sorot Fokus di Safari yang belum mengenal `:focus-visible`;
    - cadangan warna untuk Safari yang belum mengenal `color-mix()`.
- Elemen yang muncul belakangan ikut berubah. Contohnya halaman baru di Next.js / Nuxt / Vue / React tanpa muat ulang, komponen yang di-render ulang, atau konten "muat lagi". Efek yang sedang aktif diterapkan ke elemen baru tersebut (lihat Pemasangan di Berbagai Platform).
- Perbesar Teks dan Perkecil Teks kini menambah / mengurangi ukuran yang sama di setiap elemen (2, 4, 6, atau 8 px dari ukuran aslinya). Sebelumnya ukurannya bertumpuk mengikuti kedalaman elemen. Contohnya di tingkat 2, teks di dalam `<span>` di dalam `<p>` di dalam `<div>` menjadi 28 px, padahal teks biasa 20 px. Mematikan Ramah Disleksia juga tidak lagi menghapus Perbesar / Perkecil Teks yang masih aktif.
- Lebih aman dipasang di situs mana pun (lihat Kompatibilitas dengan Situs):
  - tampilan widget tidak lagi berubah oleh CSS tema situs (Tailwind, Bootstrap, tema WordPress);
  - gaya inline milik situs (dari editor CMS) dikembalikan saat fitur teks dimatikan, tidak dihapus;
  - widget tidak lagi memuat GSAP (sebelumnya menimpa `gsap` / `TweenMax` milik situs), tidak lagi menyembunyikan Google Translate milik situs atau menggeser `body`, dan tidak lagi mengambil Ctrl+U di kolom isian / editor teks;
  - kelas `<html>` milik widget dipasang kembali bila situs menimpanya;
  - kunci penyimpanan widget berawalan `dsb:`. Pengaturan lama dipindahkan otomatis, hanya bila nilainya berformat widget;
  - fitur tetap berjalan di situs yang memakai `!important`, termasuk pada elemen bertumpuk;
  - lebih ringan di halaman besar: Kontras+, Rata Tulisan, dan Animasi Dijeda bekerja lewat satu kelas di `<html>`. Animasi Dijeda tidak lagi memeriksa seluruh halaman setiap 10 ms;
  - mematikan Animasi Dijeda atau Kontras+ tidak lagi menghapus `transform`, `transition`, `opacity`, atau `border-color` inline milik situs.
- Garis Bawahi Tautan tingkat 1 kini benar-benar menggarisbawahi tautan. Sebelumnya garis bawahnya langsung terhapus lagi pada tautan tanpa atribut `style`.
- Jembatan Pengaturan: widget mengabarkan pengaturan aktif ke kode situs (event `widget-aksesibilitas`) dan ke aplikasi iOS, Android, React Native, atau Flutter (`webview_flutter` / `flutter_inappwebview`) yang membuka situs lewat WebView. Dengan begitu, aplikasi bisa ikut menyesuaikan tampilan native-nya, misalnya Perbesar Teks juga membesarkan teks native aplikasi.
- Perbaikan aksesibilitas tampilan widget sendiri (lihat Kesesuaian dengan WCAG dan ADA):
  - cincin fokus dua warna, kontras ≥ 3:1 (WCAG 1.4.11);
  - jarak baris petak tidak lagi dikunci `!important` inline, sehingga spasi teks pengguna bisa diterapkan (1.4.12);
  - tautan "Lewati ke konten utama" boleh turun baris di layar sempit (1.4.10);
  - tooltip Keterangan Alat bisa ditutup dengan Escape (1.4.13);
  - `<html lang>` mengikuti bahasa terjemahan halaman (3.1.1);
  - menu tertutup otomatis bila fokus keyboard pindah ke luar menu, agar elemen yang difokus tidak tertutup panel (2.4.11);
  - tingkat petak bertingkat ikut dibacakan pembaca layar, misalnya "Perbesar Teks, tingkat 2 dari 4" (1.3.1, 4.1.2);
  - di ponsel dan saat halaman diperbesar, panel menu kini selalu setinggi layar. Sebelumnya tingginya mengikuti panjang halaman, sehingga di halaman panjang tombol Atur Ulang dan Pindahkan Widget berada di luar layar dan tidak terjangkau. Header menu juga tidak lagi terpotong saat diperbesar 200% (1.4.4, 1.4.10, 2.1.1);
  - tombol widget yang melayang disembunyikan sementara bila menutupi elemen halaman yang sedang difokus, misalnya tombol "kembali ke atas" situs di pojok yang sama (2.4.11);
  - bulatan pilihan warna terang (Putih, Krem, dan sebagainya) diberi tepi yang lebih gelap agar terlihat (1.4.11);
  - di mode kontras tinggi Windows, petak / profil / warna yang aktif ditandai bingkai warna sistem, dan contoh warna tetap tampil.
- Pengaturan Warna kini punya 12 pilihan per kelompok (sebelumnya 6). Warna teks / judul baru: Abu Tua, Biru, Cokelat Tua, Oranye Tua, serta Kuning dan Biru Muda untuk latar gelap. Warna latar baru: Merah Muda, Ungu Muda, Abu Muda, Biru Gelap, Hijau Gelap, dan Abu Gelap. Pilihan yang sudah tersimpan di peramban pengunjung tidak berubah.
- Warna tema widget bisa dipilih instansi lewat atribut `warna-widget`: 10 pilihan siap pakai atau kode warna sendiri (lihat Atribut Tambahan). Warna sorot (Sorot Judul, Deskripsi Gambar, hover tombol) kini ikut warna tema. Sebelumnya warna ini selalu biru, termasuk di situs bertema merah.
- Atribut baru pada tag skrip: `warna-widget`, `pernyataan-aksesibilitas`, `isyarat-uji`, `isyarat-3d`, `isyarat-3d-folder`, dan `nonce`.
- Mendukung situs dengan CSP ber-nonce, tanpa perlu `'unsafe-inline'` / `'unsafe-eval'` (lihat Catatan Error).
- Tautan "Lewati ke konten utama" dan label pembaca layar (ARIA) yang lebih lengkap.
- Seluruh kode widget kini berada di dalam satu fungsi, hanya berjalan sekali walau skripnya terpasang dua kali, boleh dipasang di `<head>`, dan tetap berjalan bila localStorage diblokir (mode privat / iframe sandbox).
- Halaman demo `index.php` diperbarui untuk mencoba seluruh fitur.

## Tangkapan Layar

<p align="center">
 <img width="45%" src="ScreenShot%20Widget/SS2.jpg" alt="Kartu Profil Aksesibilitas dua kolom">&emsp;
 <img width="45%" src="ScreenShot%20Widget/SS7.jpg" alt="Navigasi dan Fokus, Atur Ulang, serta kartu Pindahkan Widget">
 <br><em>Profil Aksesibilitas &amp; Pindahkan Widget</em>
</p>

<p align="center">
 <img width="45%" src="ScreenShot%20Widget/SS3.jpg" alt="Halaman dengan efek Kontras+ (Balikan Warna)">&emsp;
 <img width="45%" src="ScreenShot%20Widget/SS4.jpg" alt="Halaman dengan Ramah Disleksia, Perbesar Teks, dan Sorot Judul">
 <br><em>Contoh efek pada halaman: Kontras+ dan Ramah Disleksia + Perbesar Teks + Sorot Judul</em>
</p>

<p align="center">
 <img width="45%" src="ScreenShot%20Widget/SS8.jpg" alt="Panel Bahasa Isyarat SIBI dengan avatar 3D mengeja huruf S">&emsp;
 <img width="45%" src="ScreenShot%20Widget/SS9.jpg" alt="Panel Bahasa Isyarat BISINDO dengan avatar 3D mengeja huruf S dua tangan">
 <br><em>Bahasa Isyarat SIBI dan BISINDO (mode uji di localhost, data masih draf)</em>
</p>

<p align="center">
 <img width="30%" src="ScreenShot%20Widget/SS10.jpg" alt="Menu Aksesibilitas di layar ponsel">
 <br><em>Tampilan ponsel</em>
</p>

## Fitur

| Bagian | Isi |
|---|---|
| Baris menu | Bahasa (terjemahan halaman, 10 bahasa), Profil Aksesibilitas (8 profil), Struktur Halaman (lompat ke judul / bagian), Pengaturan Warna (warna teks, judul, latar; 12 pilihan masing-masing), Pindahkan Widget (4 posisi) |
| Suara & Gerak | Moda Suara, Baca Halaman, SIBI (Abjad 1 Tangan), BISINDO (Abjad 1 dan 2 Tangan), Bisukan Media, Animasi Dijeda |
| Teks & Bacaan | Perbesar Teks, Perkecil Teks, Ramah Disleksia, Teks Tebal, Tinggi Garis, Spasi Huruf, Spasi Kata, Rata Tulisan |
| Warna & Gambar | Kontras+, Kejenuhan, Sembunyikan Gambar, Deskripsi Gambar |
| Navigasi & Fokus | Garis Bawahi Tautan, Sorot Judul, Sorot Fokus, Kursor, Keterangan Alat (tiga terakhir khusus desktop) |

- Profil: Gangguan Motorik, Netra Total, Buta Warna, Disleksia, Gangguan Penglihatan, Kognitif &amp; Pembelajaran, Kejang dan Epilepsi, ADHD.
- Bisa dipakai dengan keyboard dan pembaca layar: Ctrl+U membuka/menutup menu, Tab / Enter / Spasi untuk memilih, Escape untuk menutup, serta tautan "Lewati ke konten utama" dan "Buka menu aksesibilitas (Ctrl+U)" di awal halaman.
- Pengaturan yang dipilih tersimpan di peramban (localStorage) dan dipulihkan saat halaman dibuka lagi; tombol "Atur Ulang Semua Pengaturan Aksesibilitas" mengembalikan semuanya.
- Aman dipasang di situs mana pun: seluruh kode di dalam satu fungsi (tidak menambah variabel global), hanya berjalan sekali walau skripnya terpasang dua kali, boleh diletakkan di `<head>` atau `<body>`, tidak bergantung pada `$` milik situs (jQuery noConflict, Prototype, MooTools), dan memuat jQuery sendiri bila halaman tidak punya.

## Isi Folder `Widget-Aksesbilitas`

| Berkas | Keterangan |
|---|---|
| `widget_disabilitas.js` | Widget utama (satu-satunya berkas yang perlu dipasang). |
| `index.php` | Halaman demo untuk mencoba seluruh fitur (HTML biasa, tanpa kode PHP). |

Avatar 3D Bahasa Isyarat **tidak disertakan di repo ini**. Dua berkasnya (`widget_disabilitas_3d.js` ~0,8 MB berisi three.js dan @pixiv/three-vrm berlisensi MIT, dan model `widget_disabilitas_avatar.vrm` ~8,4 MB) dimuat dari server pusat `https://web.animemusic.us/avatar-3d-anime/`, dan baru diunduh saat panel Bahasa Isyarat dibuka, bukan saat halaman dimuat. Bila server pusat tidak terjangkau atau diblokir CSP, avatar memakai gambar SVG bawaan tanpa pesan galat.

## Contoh Pemasangan Widget Menggunakan Responsive Voice

```html
  <!-- Matikan semua pengaturan yang ada di responsive voice seperti gambar di bawah ini -->
```
<p align="center">
 <img width="90%" src="ScreenShot%20Widget/SS5.jpg" alt="Pengaturan ResponsiveVoice yang dimatikan">
</p> <br>

## Cara 1

```html
<body>
  <!-- Notes Menyesuaikan Dengan Code Anda Yang Di Dapat Dari Web responsivevoice -->
<script src="https://code.responsivevoice.org/responsivevoice.js?key=bzbTAKXD"></script>
<script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js"></script>
```

## Atau Bisa Menggunakan Cara 2
```html
<body>
  <!-- Atau Bisa Seperti Di Bawah Ini -->
<script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js" api-key-resvoice="bzbTAKXD"></script>
<!-- ganti key api-key-resvoice dengan key yang ada di responsive voice-->
```

## Atribut Tambahan Pada Tag Skrip

Semua atribut opsional dan dibaca dari tag `<script>` widget itu sendiri.

| Atribut | Contoh | Fungsi |
|---|---|---|
| `api-key-resvoice` | `api-key-resvoice="bzbTAKXD"` | Kunci ResponsiveVoice. Widget memuat skrip ResponsiveVoice dan memakainya sebagai mesin suara kedua untuk Moda Suara dan Baca Halaman, di ponsel maupun desktop (lihat Urutan Suara). |
| `api-key-google` | `api-key-google="apikey"` | Kunci Google Cloud Text-to-Speech. Bila diisi, menjadi mesin suara pertama untuk Moda Suara dan Baca Halaman, di ponsel maupun desktop. Berbayar per karakter (lihat Urutan Suara). |
| `warna-widget` | `warna-widget="hijau"` atau `warna-widget="#145A32"` | Warna tema widget (tombol, menu, petak aktif, garis sorot). Pilihan siap pakai: `biru` (bawaan), `merah`, `hijau`, `oranye`, `ungu`, `teal`, `magenta`, `cokelat`, `biru-tua`, `abu-gelap`. Bisa juga kode warna `#RGB` / `#RRGGBB`, asalkan kontrasnya minimal 4,5:1 terhadap latar abu menu (`#E8ECF2`) agar teks putih di tombol dan teks berwarna tema di menu tetap terbaca (WCAG 1.4.3). Nilai yang tidak dikenali atau kontrasnya kurang akan diabaikan, dan widget memakai warna bawaan. |
| `pernyataan-aksesibilitas` | `pernyataan-aksesibilitas="https://situs.go.id/aksesibilitas"` | Menampilkan tautan "Pernyataan Aksesibilitas" di menu. Tanpa atribut ini tautannya tidak muncul. |
| `isyarat-uji` | `isyarat-uji="1"` atau `"0"` | Memaksa mode uji Bahasa Isyarat menyala / mati (lihat bagian Bahasa Isyarat). |
| `isyarat-3d` | `isyarat-3d="0"` | Mematikan avatar 3D; Bahasa Isyarat memakai avatar SVG saja. |
| `isyarat-3d-folder` | `isyarat-3d-folder="./"` | Memuat berkas avatar 3D dari folder sendiri, bukan dari server pusat. Alamat relatif dihitung dari alamat `widget_disabilitas.js` (`"./"` = folder widget itu sendiri). Hanya `http(s)`. |
| `nonce` | `nonce="NONCE-HALAMAN"` | Untuk situs dengan CSP ber-nonce: widget memakai nonce ini untuk `<style>` miliknya (bila tidak ada, widget memakai nonce yang sudah dipakai halaman). |

```html
<script src="https://web.animemusic.us/widget_disabilitas.js"
        api-key-resvoice="bzbTAKXD"
        warna-widget="hijau"
        pernyataan-aksesibilitas="https://situs.go.id/aksesibilitas"></script>
```

## Pemasangan di Berbagai Platform

Widget ini adalah skrip untuk halaman web. Ada dua kelompok cara pakai:

| Platform | Yang diubah widget |
|---|---|
| Situs web, termasuk Next.js, React, Vue / Nuxt, Angular, SvelteKit, Laravel, WordPress, serta aplikasi berbasis web (Ionic / Capacitor, Cordova, Electron) | Seluruh halaman, termasuk elemen yang muncul belakangan |
| Aplikasi native: iOS / iPadOS (Swift), Android (Kotlin / Java), React Native, Flutter | Hanya halaman web yang dibuka di dalam WebView. Tampilan native aplikasi (SwiftUI `Text` / `UILabel`, `TextView` / Compose, `<Text>` React Native, widget Flutter) **tidak bisa diubah langsung oleh widget**. Agar ikut berubah, aplikasi memasang penerima [Jembatan Pengaturan](#jembatan-pengaturan) lalu menerapkan nilainya sendiri, seperti pada contoh di bawah. |

Pasang widget **sekali saja di layout utama**, jangan per halaman. Kalau terpasang dua kali, widget tetap hanya berjalan sekali.

### Elemen yang Muncul Belakangan

Banyak efek ditulis langsung ke elemen yang ada di halaman. Untuk situs SPA, konten "muat lagi", atau komponen yang di-render ulang, widget memantau elemen yang baru ditambahkan dan menerapkan efek yang sedang aktif ke elemen itu saja (bukan ke seluruh halaman, dan dengan jeda 300 ms agar perubahan beruntun digabung).

| Efek | Elemen baru ikut berubah? |
|---|---|
| Perbesar Teks, Perkecil Teks, Ramah Disleksia, Tinggi Garis, Spasi Huruf, Garis Bawahi Tautan, Sembunyikan Gambar, Kursor (kursor besar) | Ya, lewat pemantauan elemen baru |
| Kontras+ (semua tingkat), Rata Tulisan, Animasi Dijeda, Kejenuhan, Teks Tebal, Spasi Kata, Sorot Judul, Sorot Fokus, Deskripsi Gambar, Bisukan Media, Kursor (Masker Bacaan, Baca Panduan), Keterangan Alat | Ya, otomatis, karena bekerja lewat kelas atau filter di `<html>`, lewat event di halaman, atau lewat pemantauannya sendiri. Elemen yang bertumpuk (lapisan `position: absolute`, modal, slider) ikut berubah. |

Catatan:

- Bila situs menimpa seluruh kelas `<html>`, misalnya `document.documentElement.className = "dark"` saat mengganti tema, kelas milik widget (`dsb-...`) dipasang kembali secara otomatis. Tetap disarankan memakai `classList.add()` / `classList.remove()`.
- Di halaman yang elemennya sangat sering berganti (misalnya slider otomatis atau data live), penerapan ke elemen baru menambah sedikit kerja setiap kali ada elemen baru. Pemantauan ini hanya bekerja selama ada efek per elemen yang aktif.
- Yang dipantau adalah elemen yang **ditambahkan atau diganti**. Bila React / Vue mengatur prop `style` sebuah elemen dan memperbaruinya di tempat (elemennya tidak diganti), gaya dari widget pada elemen itu bisa tertimpa. Untuk elemen seperti itu, pakai kelas CSS alih-alih prop `style`.

### HTML, PHP, Laravel, CodeIgniter, WordPress

Letakkan tag skrip sebelum `</body>` di template utama: `resources/views/layouts/app.blade.php` (Laravel), view footer / template induk (CodeIgniter), atau `footer.php` tema sebelum `wp_footer()` (WordPress). Untuk WordPress juga bisa memakai plugin penyisip skrip header / footer.

```html
<script src="https://web.animemusic.us/widget_disabilitas.js"
        api-key-resvoice="KUNCI-RESPONSIVEVOICE"></script>
```

### Next.js (App Router dan Pages Router)

Pakai `next/script` dengan `strategy="afterInteractive"`, jangan `beforeInteractive`, agar widget berjalan setelah hidrasi React selesai. Atribut tambahan seperti `api-key-resvoice` diteruskan apa adanya ke tag `<script>`.

```tsx
// app/layout.tsx (App Router). Untuk Pages Router, letakkan <Script> yang sama di pages/_app.tsx.
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Script
          src="https://web.animemusic.us/widget_disabilitas.js"
          strategy="afterInteractive"
          api-key-resvoice="KUNCI-RESPONSIVEVOICE"
        />
      </body>
    </html>
  );
}
```

Bila situs memakai CSP ber-nonce, tambahkan juga prop `nonce={nonce}` pada `<Script>`.

Komponen yang perlu tahu pengaturan aktif, misalnya grafik `<canvas>` yang ukuran hurufnya tidak terjangkau CSS, bisa membaca [Jembatan Pengaturan](#jembatan-pengaturan):

```tsx
"use client";
import { useEffect, useState } from "react";

export function usePengaturanAksesibilitas() {
  const [pengaturan, setPengaturan] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    const terima = (e: Event) => setPengaturan((e as CustomEvent).detail.pengaturan);
    window.addEventListener("widget-aksesibilitas", terima);
    // Minta ringkasan terbaru, karena widget mungkin sudah mengirimnya sebelum komponen ini dipasang.
    window.dispatchEvent(new Event("widget-aksesibilitas:minta"));
    return () => window.removeEventListener("widget-aksesibilitas", terima);
  }, []);
  return pengaturan;
}
```

### React (Vite / Create React App), Angular, SvelteKit

Letakkan tag skrip di HTML induk: `index.html` (React Vite / Angular `src/index.html`), `public/index.html` (Create React App), atau `src/app.html` (SvelteKit), sebelum `</body>`. Contoh tag skripnya sama dengan contoh HTML di atas.

### Vue 3 dan Nuxt 3

Vue 3 (Vite): letakkan tag skrip di `index.html` sebelum `</body>`.

Nuxt 3: buat plugin yang hanya berjalan di peramban.

```ts
// plugins/widget-aksesibilitas.client.ts
export default defineNuxtPlugin(() => {
  const skrip = document.createElement("script");
  skrip.src = "https://web.animemusic.us/widget_disabilitas.js";
  skrip.setAttribute("api-key-resvoice", "KUNCI-RESPONSIVEVOICE");
  document.body.appendChild(skrip);
});
```

Membaca pengaturan aktif di komponen Vue:

```ts
// composables/usePengaturanAksesibilitas.ts
import { onBeforeUnmount, onMounted, ref } from "vue";

export function usePengaturanAksesibilitas() {
  const pengaturan = ref<Record<string, unknown> | null>(null);
  const terima = (e: Event) => (pengaturan.value = (e as CustomEvent).detail.pengaturan);
  onMounted(() => {
    window.addEventListener("widget-aksesibilitas", terima);
    window.dispatchEvent(new Event("widget-aksesibilitas:minta"));
  });
  onBeforeUnmount(() => window.removeEventListener("widget-aksesibilitas", terima));
  return pengaturan;
}
```

### Ionic / Capacitor, Cordova, Electron

Aplikasi seperti ini sebenarnya halaman web, jadi pasang tag skrip di `index.html` seperti situs biasa. Semua fitur berlaku untuk seluruh tampilan aplikasi.

### Jembatan Pengaturan

Setiap kali pengaturan berubah, widget mengirim ringkasan pengaturan aktif ke kanal berikut. Ringkasan juga dikirim sekali setelah widget selesai memulihkan pengaturan saat halaman dimuat, dan setiap kali situs mengirim event `widget-aksesibilitas:minta`. Kanal yang tidak tersedia dilewati. Widget tidak menambah variabel global.

| Kanal | Dipakai oleh | Bentuk data |
|---|---|---|
| Event `widget-aksesibilitas` di `window` | Kode situs (Next.js, Vue, dll.) | `event.detail` berupa objek |
| `window.webkit.messageHandlers.widgetAksesibilitas` | iOS / iPadOS `WKWebView` | objek (diterima sebagai dictionary) |
| `window.WidgetAksesibilitasAndroid.terima(json)` atau `.postMessage(json)` | Android `WebView` (`addJavascriptInterface` / `WebViewCompat.addWebMessageListener`) | teks JSON |
| `window.ReactNativeWebView.postMessage(json)` | `react-native-webview` | teks JSON |
| `window.WidgetAksesibilitasFlutter.postMessage(json)` | Flutter `webview_flutter` (`JavaScriptChannel`) | teks JSON |
| `window.flutter_inappwebview.callHandler("widgetAksesibilitas", json)` | Flutter `flutter_inappwebview` (`addJavaScriptHandler`) | teks JSON |

Contoh isi (Perbesar Teks tingkat 2, tanpa profil):

```json
{
  "sumber": "widget-aksesibilitas",
  "versi": 1,
  "pengaturan": {
    "perbesarTeks": 2, "perkecilTeks": 0, "skalaTeks": 1.25,
    "ramahDisleksia": 0, "teksTebal": 0, "tinggiGaris": 0, "spasiHuruf": 0, "spasiKata": 0, "rataTulisan": 0,
    "kontras": 0, "kejenuhan": 0, "sembunyikanGambar": 0, "deskripsiGambar": 0,
    "garisBawahiTautan": 0, "sorotJudul": 0, "sorotFokus": 0, "kursor": 0, "keteranganAlat": 0,
    "animasiDijeda": 0, "bisukanMedia": 0, "modaSuara": 0, "bacaHalaman": 0,
    "bahasaIsyarat": null, "bahasa": "id"
  }
}
```

- Semua angka adalah tingkat fitur: `0` = mati, `1`, `2`, dan seterusnya = tingkat yang dipilih (Perbesar / Perkecil Teks 1–4, Kontras 1–4, Kejenuhan 1–3, Tinggi Garis 1–3, Spasi Huruf 1–3, Spasi Kata 1–3, Rata Tulisan 1–4, Kursor 1–3, Ramah Disleksia 1–2, Garis Bawahi Tautan 1–2, fitur lain 1 = nyala).
- `skalaTeks` adalah **perkiraan** skala teks untuk tampilan native: 1,125 / 1,25 / 1,375 / 1,5 untuk Perbesar Teks tingkat 1–4, dan 0,875 / 0,75 / 0,625 / 0,5 untuk Perkecil Teks. Di halaman web, efek sebenarnya menambah / mengurangi 2, 4, 6, atau 8 px per elemen.
- `bahasaIsyarat`: `null`, `"SIBI"`, atau `"BISINDO"`. `bahasa`: kode bahasa terjemahan halaman (`"id"`, `"en"`, dst.).
- Nama profil (mis. "Netra Total", "ADHD") **sengaja tidak dikirim**. Itu informasi kesehatan, sedangkan event di `window` bisa dibaca skrip pihak ketiga di situs. Efek profil tetap terlihat lewat tingkat masing-masing fitur.
- Saring pesan dengan `sumber === "widget-aksesibilitas"`, karena halaman bisa mengirim pesan lain lewat kanal yang sama.

Saran penerapan di tampilan native:

| Pengaturan | Saran penerapan |
|---|---|
| `skalaTeks` | Kalikan ukuran huruf teks native (contoh di bawah) |
| `teksTebal` | Pakai huruf tebal |
| `tinggiGaris`, `spasiHuruf` | Perbesar jarak baris / huruf |
| `kontras` | Pakai tema kontras tinggi aplikasi |
| `animasiDijeda` | Matikan animasi aplikasi |
| `sembunyikanGambar` | Sembunyikan gambar dekoratif |

### Aplikasi Native: Ketentuan Umum

Contoh kode di bawah adalah titik awal yang perlu disesuaikan dengan proyek Anda. Contoh-contoh ini **belum dikompilasi maupun dijalankan di perangkat** saat dokumen ini ditulis.

- Halaman yang dibuka di WebView harus memuat widget, atau aplikasi menyisipkannya (lihat bagian Menyisipkan Widget). Bila situs memakai CSP, pastikan host widget diizinkan (lihat Catatan Error).
- Aktifkan JavaScript dan penyimpanan DOM (localStorage), karena pengaturan widget disimpan di sana.
- Izinkan audio diputar tanpa ketukan tambahan, karena suara Google / ResponsiveVoice datang sesudah permintaan jaringan.
- **Tampilan yang dibuat belakangan.** SwiftUI, Jetpack Compose (`LocalDensity`), Flutter (`TextScaler`), dan komponen `<Teks>` React Native di bawah bersifat reaktif, jadi layar baru otomatis memakai skala terakhir. Sebaliknya, `terapkanSkalaTeks` untuk View Android biasa dan `label.font` di UIKit hanya mengubah tampilan yang sudah ada. Untuk baris `RecyclerView` / `UITableView` yang diisi belakangan atau layar yang dibuka belakangan, simpan `skalaTeks` terakhir dan terapkan saat tampilan dibuat atau diisi (`onBindViewHolder`, `viewDidLoad`, `cellForRowAt`).
- **Simpan nilai terakhir** di `SharedPreferences` / `UserDefaults` / `AsyncStorage` / `shared_preferences`, lalu pakai saat aplikasi dibuka. Ringkasan pertama dari widget baru tiba beberapa detik setelah halaman dimuat; tanpa nilai tersimpan, teks native akan "melompat" setiap kali aplikasi dibuka.
- Suara bawaan peramban (`speechSynthesis`) di dalam WebView, terutama Android WebView, belum tentu tersedia; perlu diuji di perangkat. Bila tidak tersedia, widget memakai ResponsiveVoice / Google bila kuncinya diisi, atau menampilkan pesan bahwa suara tidak tersedia (lihat Urutan Suara).

### iOS / iPadOS (Swift, SwiftUI)

```swift
import SwiftUI
import WebKit

/// Pengaturan dari widget yang dipakai tampilan native.
final class PengaturanAksesibilitas: ObservableObject {
    @Published var skalaTeks: CGFloat = 1
    @Published var kontras = 0
}

/// Penerima pesan widget. WKUserContentController menyimpan handler ini secara kuat, jadi
/// handler hanya memegang referensi lemah ke pengaturan, dan dilepas di dismantleUIView.
final class PenerimaWidget: NSObject, WKScriptMessageHandler {
    weak var pengaturan: PengaturanAksesibilitas?

    init(pengaturan: PengaturanAksesibilitas) {
        self.pengaturan = pengaturan
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "widgetAksesibilitas",
              let isi = message.body as? [String: Any],
              isi["sumber"] as? String == "widget-aksesibilitas",
              let p = isi["pengaturan"] as? [String: Any] else { return }
        DispatchQueue.main.async {
            self.pengaturan?.skalaTeks = CGFloat((p["skalaTeks"] as? NSNumber)?.doubleValue ?? 1)
            self.pengaturan?.kontras = (p["kontras"] as? NSNumber)?.intValue ?? 0
        }
    }
}

struct HalamanWeb: UIViewRepresentable {
    let url: URL
    let pengaturan: PengaturanAksesibilitas

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.userContentController.add(PenerimaWidget(pengaturan: pengaturan), name: "widgetAksesibilitas")
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []   // suara Google / ResponsiveVoice
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    static func dismantleUIView(_ uiView: WKWebView, coordinator: ()) {
        uiView.configuration.userContentController.removeScriptMessageHandler(forName: "widgetAksesibilitas")
    }
}

struct LayarUtama: View {
    @StateObject private var pengaturan = PengaturanAksesibilitas()

    var body: some View {
        VStack(spacing: 0) {
            // Teks native ikut membesar saat Perbesar Teks dipilih di widget.
            Text("Layanan Informasi Publik")
                .font(.system(size: 22 * pengaturan.skalaTeks, weight: .bold))
                .padding()
            HalamanWeb(url: URL(string: "https://situs.go.id")!, pengaturan: pengaturan)
        }
    }
}
```

UIKit: di tempat yang sama, simpan `skalaTeks` lalu atur ulang huruf label, misalnya `label.font = UIFont.systemFont(ofSize: 17 * skalaTeks)`. Bila aplikasi memakai Dynamic Type, kalikan di dalam `UIFontMetrics.default.scaledFont(for:)` agar pengaturan ukuran teks iOS tetap berlaku.

### Android (Kotlin)

```kotlin
// res/values/ids.xml: <resources><item name="ukuran_teks_dasar" type="id" /></resources>

class PenerimaWidget(
    private val activity: Activity,
    private val saatBerubah: (JSONObject) -> Unit,
) {
    @JavascriptInterface
    fun terima(json: String) {
        val data = try { JSONObject(json) } catch (e: JSONException) { return }
        if (data.optString("sumber") != "widget-aksesibilitas") return
        val pengaturan = data.optJSONObject("pengaturan") ?: return
        // Method @JavascriptInterface berjalan di thread latar, bukan thread UI.
        activity.runOnUiThread { saatBerubah(pengaturan) }
    }
}

/** Mengalikan ukuran semua TextView (termasuk Button / EditText) di dalam [view] dari ukuran aslinya. */
fun terapkanSkalaTeks(view: View, skala: Float) {
    if (view is TextView) {
        val dasar = view.getTag(R.id.ukuran_teks_dasar) as? Float
            ?: view.textSize.also { view.setTag(R.id.ukuran_teks_dasar, it) }
        view.setTextSize(TypedValue.COMPLEX_UNIT_PX, dasar * skala)
    }
    if (view is ViewGroup && view !is WebView) {
        for (i in 0 until view.childCount) terapkanSkalaTeks(view.getChildAt(i), skala)
    }
}

class MainActivity : AppCompatActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val akar = findViewById<ViewGroup>(R.id.akar)
        val webView = findViewById<WebView>(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true                  // pengaturan widget (localStorage)
        webView.settings.mediaPlaybackRequiresUserGesture = false  // suara Google / ResponsiveVoice

        val terapkan = { p: JSONObject -> terapkanSkalaTeks(akar, p.optDouble("skalaTeks", 1.0).toFloat()) }
        // Pasang SALAH SATU saja, sebelum loadUrl. Keduanya memakai nama objek yang sama.
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            // Lebih aman: hanya menerima pesan dari domain yang didaftarkan (androidx.webkit).
            WebViewCompat.addWebMessageListener(
                webView, "WidgetAksesibilitasAndroid", setOf("https://situs.go.id"),
            ) { _, pesan, _, _, _ ->
                val data = try {
                    JSONObject(pesan.data ?: return@addWebMessageListener)
                } catch (e: JSONException) {
                    return@addWebMessageListener
                }
                if (data.optString("sumber") == "widget-aksesibilitas") {
                    data.optJSONObject("pengaturan")?.let(terapkan)
                }
            }
        } else {
            // Cadangan untuk WebView lama.
            webView.addJavascriptInterface(PenerimaWidget(this, terapkan), "WidgetAksesibilitasAndroid")
        }

        webView.webViewClient = WebViewClient()
        webView.loadUrl("https://situs.go.id")
    }
}
```

Jetpack Compose: bungkus konten dengan `fontScale` yang dikalikan, agar semua teks `sp` ikut membesar.

```kotlin
var skalaTeks by remember { mutableFloatStateOf(1f) }   // diisi dari PenerimaWidget
val kepadatan = LocalDensity.current
CompositionLocalProvider(
    LocalDensity provides Density(kepadatan.density, kepadatan.fontScale * skalaTeks),
) {
    KontenAplikasi()
}
```

**`addWebMessageListener` atau `addJavascriptInterface`: pasang salah satu saja.** Widget mendukung keduanya lewat nama objek yang sama, `WidgetAksesibilitasAndroid`. Widget memanggil `terima()` lebih dulu bila tersedia, dan baru memakai `postMessage()` bila `terima()` tidak ada. Jadi bila keduanya dipasang, pesan bisa lewat jalur `addJavascriptInterface` sehingga batasan domain dari `addWebMessageListener` tidak berlaku. Contoh di atas memakai pola yang disarankan:

| Kondisi | Yang dipasang | Alasan |
|---|---|---|
| `WebViewFeature.WEB_MESSAGE_LISTENER` didukung (WebView modern) | `WebViewCompat.addWebMessageListener` | Hanya menerima pesan dari domain yang didaftarkan di `setOf(...)` / `Collections.singleton(...)`. Callback berjalan di thread UI. |
| Tidak didukung (WebView lama) | `addJavascriptInterface` dengan `PenerimaWidget` | Objeknya bisa dipanggil oleh **semua** halaman yang terbuka di WebView itu, jadi batasi navigasi hanya ke domain Anda, misalnya lewat `shouldOverrideUrlLoading`. |

- Perlu dependensi `androidx.webkit:webkit`.
- Pasang sebelum `loadUrl(...)`. Objek baru tersedia di halaman yang dimuat sesudah dipasang.
- Ganti `https://situs.go.id` dengan domain situs Anda, tanpa garis miring di akhir. Subdomain bisa ditulis `https://*.situs.go.id`.

### Android (Java)

```java
public class PenerimaWidget {
    public interface Pendengar { void saatBerubah(JSONObject pengaturan); }

    private final Activity activity;
    private final Pendengar pendengar;

    public PenerimaWidget(Activity activity, Pendengar pendengar) {
        this.activity = activity;
        this.pendengar = pendengar;
    }

    @JavascriptInterface
    public void terima(String json) {
        final JSONObject pengaturan;
        try {
            JSONObject data = new JSONObject(json);
            if (!"widget-aksesibilitas".equals(data.optString("sumber"))) return;
            pengaturan = data.getJSONObject("pengaturan");
        } catch (JSONException e) {
            return;
        }
        // Method @JavascriptInterface berjalan di thread latar, bukan thread UI.
        activity.runOnUiThread(() -> pendengar.saatBerubah(pengaturan));
    }

    /** Mengalikan ukuran semua TextView di dalam view dari ukuran aslinya (perlu R.id.ukuran_teks_dasar). */
    public static void terapkanSkalaTeks(View view, float skala) {
        if (view instanceof TextView) {
            TextView teks = (TextView) view;
            Object tag = teks.getTag(R.id.ukuran_teks_dasar);
            float dasar = tag instanceof Float ? (Float) tag : teks.getTextSize();
            if (!(tag instanceof Float)) teks.setTag(R.id.ukuran_teks_dasar, dasar);
            teks.setTextSize(TypedValue.COMPLEX_UNIT_PX, dasar * skala);
        }
        if (view instanceof ViewGroup && !(view instanceof WebView)) {
            ViewGroup grup = (ViewGroup) view;
            for (int i = 0; i < grup.getChildCount(); i++) terapkanSkalaTeks(grup.getChildAt(i), skala);
        }
    }
}
```

```java
// Di MainActivity.onCreate, setelah setContentView:
ViewGroup akar = findViewById(R.id.akar);
WebView webView = findViewById(R.id.webview);
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setDomStorageEnabled(true);
webView.getSettings().setMediaPlaybackRequiresUserGesture(false);

// Pasang SALAH SATU saja, sebelum loadUrl (lihat tabel di bagian Kotlin). Keduanya memakai nama objek yang sama.
if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
    // Lebih aman: hanya menerima pesan dari domain yang didaftarkan (androidx.webkit).
    WebViewCompat.addWebMessageListener(webView, "WidgetAksesibilitasAndroid",
            Collections.singleton("https://situs.go.id"),
            (view, pesan, asal, frameUtama, balasan) -> {
                String isi = pesan.getData();
                if (isi == null) return;
                try {
                    JSONObject data = new JSONObject(isi);
                    if (!"widget-aksesibilitas".equals(data.optString("sumber"))) return;
                    PenerimaWidget.terapkanSkalaTeks(akar,
                            (float) data.getJSONObject("pengaturan").optDouble("skalaTeks", 1.0));
                } catch (JSONException e) {
                    // Bukan pesan dari widget.
                }
            });
} else {
    // Cadangan untuk WebView lama.
    webView.addJavascriptInterface(new PenerimaWidget(this, p ->
            PenerimaWidget.terapkanSkalaTeks(akar, (float) p.optDouble("skalaTeks", 1.0))),
            "WidgetAksesibilitasAndroid");
}

webView.setWebViewClient(new WebViewClient());
webView.loadUrl("https://situs.go.id");
```

### React Native (TSX / JS)

Pakai paket `react-native-webview`. Teks native dibungkus komponen yang mengalikan `fontSize` dengan `skalaTeks`.

```tsx
// App.tsx
import React, { createContext, useContext, useState } from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

type Pengaturan = { skalaTeks: number; kontras: number };
const AWAL: Pengaturan = { skalaTeks: 1, kontras: 0 };
const KonteksAksesibilitas = createContext<Pengaturan>(AWAL);

/** Pengganti <Text> yang ikut membesar / mengecil mengikuti widget. */
export function Teks({ style, ...props }: TextProps) {
  const { skalaTeks } = useContext(KonteksAksesibilitas);
  const datar = StyleSheet.flatten(style) ?? {};
  const fontSize = (datar.fontSize ?? 14) * skalaTeks;
  const lineHeight = datar.lineHeight ? datar.lineHeight * skalaTeks : undefined;
  return <Text {...props} style={[style, { fontSize, lineHeight }]} />;
}

export default function App() {
  const [pengaturan, setPengaturan] = useState<Pengaturan>(AWAL);

  const saatPesan = (e: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      if (data?.sumber !== "widget-aksesibilitas") return;
      setPengaturan({ ...AWAL, ...data.pengaturan });
    } catch {
      // Pesan lain dari halaman, bukan dari widget.
    }
  };

  return (
    <KonteksAksesibilitas.Provider value={pengaturan}>
      <View style={{ flex: 1 }}>
        <Teks style={{ fontSize: 22, fontWeight: "bold", padding: 16 }}>Layanan Informasi Publik</Teks>
        <WebView
          source={{ uri: "https://situs.go.id" }}
          onMessage={saatPesan}
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
        />
      </View>
    </KonteksAksesibilitas.Provider>
  );
}
```

Untuk JavaScript biasa (`App.js`), pakai kode yang sama tanpa anotasi tipe: hapus `type Pengaturan`, `<Pengaturan>`, `: TextProps`, dan `: WebViewMessageEvent`.

### Flutter (Dart)

Widget mendukung dua paket WebView Flutter: `webview_flutter` dan `flutter_inappwebview`. Untuk `webview_flutter`, pakai `JavaScriptChannel` bernama `WidgetAksesibilitasFlutter`.

```dart
double skalaTeks = 1;

late final WebViewController controller = WebViewController()
  ..setJavaScriptMode(JavaScriptMode.unrestricted)
  ..addJavaScriptChannel(
    'WidgetAksesibilitasFlutter',
    onMessageReceived: (JavaScriptMessage pesan) {
      final data = jsonDecode(pesan.message);
      if (data['sumber'] != 'widget-aksesibilitas') return;
      setState(() => skalaTeks = (data['pengaturan']['skalaTeks'] as num).toDouble());
    },
  )
  ..loadRequest(Uri.parse('https://situs.go.id'));

// Di build(): semua teks Flutter ikut membesar (Flutter 3.16 ke atas).
MediaQuery(
  data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(skalaTeks)),
  child: KontenAplikasi(controller: controller),
);
```

Bila memakai paket `flutter_inappwebview`, daftarkan handler bernama `widgetAksesibilitas`:

```dart
InAppWebView(
  initialUrlRequest: URLRequest(url: WebUri('https://situs.go.id')),
  initialSettings: InAppWebViewSettings(
    javaScriptEnabled: true,
    domStorageEnabled: true,
    mediaPlaybackRequiresUserGesture: false,   // suara Google / ResponsiveVoice
    allowsInlineMediaPlayback: true,
  ),
  onWebViewCreated: (controller) {
    controller.addJavaScriptHandler(
      handlerName: 'widgetAksesibilitas',
      callback: (args) {
        final data = jsonDecode(args.first as String);
        if (data['sumber'] != 'widget-aksesibilitas') return null;
        setState(() => skalaTeks = (data['pengaturan']['skalaTeks'] as num).toDouble());
        return null;
      },
    );
  },
);
```

### Menyisipkan Widget ke Halaman yang Belum Memuatnya

Bila situs yang dibuka di WebView belum memasang widget, aplikasi bisa menyisipkannya setelah halaman dimuat. CSP situs tetap berlaku.

```js
// Kode JavaScript yang disisipkan
var s = document.createElement("script");
s.src = "https://web.animemusic.us/widget_disabilitas.js";
s.setAttribute("api-key-resvoice", "KUNCI-RESPONSIVEVOICE");
document.body.appendChild(s);
```

- iOS: `config.userContentController.addUserScript(WKUserScript(source: kode, injectionTime: .atDocumentEnd, forMainFrameOnly: true))`
- Android: di `WebViewClient.onPageFinished`, panggil `view.evaluateJavascript(kode, null)`
- React Native: prop `injectedJavaScript={kode + "; true;"}`
- Flutter: `controller.runJavaScript(kode)` di `NavigationDelegate(onPageFinished: ...)` (`webview_flutter`), atau `controller.evaluateJavascript(source: kode)` di `onLoadStop` (`flutter_inappwebview`)

## Urutan Suara (Moda Suara &amp; Baca Halaman)

Moda Suara dan Baca Halaman memilih mesin suara dengan urutan yang sama, di ponsel maupun desktop:

| Urutan | Mesin | Dipakai bila |
|---|---|---|
| 1 | Google Cloud Text-to-Speech | `api-key-google` (atau variabel `api_key_google_cloud`) diisi |
| 2 | ResponsiveVoice | `api-key-resvoice` diisi, atau situs memuat sendiri `responsivevoice.js` (Cara 1), dan skripnya sudah termuat |
| 3 | Suara bawaan perangkat / peramban | peramban mendukung Web Speech API |

### Cara Pakai

```html
<!-- Hanya suara bawaan perangkat (tanpa kunci apa pun) -->
<script src="https://web.animemusic.us/widget_disabilitas.js"></script>

<!-- ResponsiveVoice, lalu suara bawaan -->
<script src="https://web.animemusic.us/widget_disabilitas.js"
        api-key-resvoice="KUNCI-RESPONSIVEVOICE"></script>

<!-- Urutan lengkap: Google, lalu ResponsiveVoice, lalu suara bawaan -->
<script src="https://web.animemusic.us/widget_disabilitas.js"
        api-key-google="KUNCI-GOOGLE-CLOUD"
        api-key-resvoice="KUNCI-RESPONSIVEVOICE"></script>
```

### Bila Satu Mesin Gagal

Kalimat yang sama langsung diulang dengan mesin berikutnya:

- **Google**: bila permintaannya gagal (kunci salah, kuota habis, diblokir CSP, tanpa internet), Google dilewati sampai halaman dimuat ulang. Bila hanya pemutarannya yang ditolak peramban, hanya kalimat itu yang pindah mesin.
- **ResponsiveVoice**: bila tidak mulai bicara dalam 5 detik (mis. server audionya diblokir CSP; ResponsiveVoice sendiri tidak memberi tanda galat), ResponsiveVoice dilewati sampai halaman dimuat ulang.
- **Suara bawaan**: bila gagal juga, atau peramban tidak mendukung suara, muncul pesan "Suara tidak dapat diputar di peramban atau perangkat ini." (sekali per halaman) dan Baca Halaman dijeda.

### Catatan

- ResponsiveVoice sendiri mendahulukan suara bahasa Indonesia yang ada di perangkat (Google Bahasa Indonesia, Damayanti di iPhone / Mac, suara Indonesia di Android), dan baru memakai audio dari server ResponsiveVoice bila tidak ada.
- Suara bawaan: widget memilih suara yang bahasanya sama dengan halaman (mis. `id-ID`) dan mengutamakan suara yang terpasang di perangkat. Bila perangkat tidak punya suara bahasa Indonesia, peramban memakai suara default-nya (di Windows biasanya bahasa Inggris). Suara Indonesia bisa ditambahkan di Windows lewat Settings → Time &amp; language → Speech → Add voices → Indonesian, dan di Android lewat pengaturan Text-to-speech (unduh data suara bahasa Indonesia).
- **Biaya Google**: Google Cloud Text-to-Speech berbayar per karakter setelah kuota gratis. Karena menjadi mesin pertama, teks yang dibacakan Moda Suara (termasuk saat kursor diarahkan ke tautan di desktop) dan seluruh isi halaman pada Baca Halaman dikirim ke Google. Widget menunda permintaan 200 ms agar kursor yang hanya lewat tidak ikut diminta, dan menyimpan 40 hasil terakhir agar teks yang sama tidak diminta ulang. Bila tidak ingin berbayar, cukup isi `api-key-resvoice`.
- Kunci Google terlihat oleh siapa pun yang membuka sumber halaman. Batasi kunci tersebut di Google Cloud Console: hanya untuk domain situs Anda (HTTP referrer) dan hanya untuk Text-to-Speech API.
- iPhone, iPad, dan Safari hanya mengizinkan suara yang dimulai dari ketukan pengguna. Widget membuka izin audio saat petak Moda Suara atau Baca Halaman diketuk, agar suara yang datang belakangan (setelah menunggu Google, atau dari mesin cadangan) tetap boleh diputar. iPad dengan iPadOS 13 ke atas, yang mengaku sebagai Mac, tetap dikenali sebagai perangkat iOS. Bila suara tetap tidak terdengar di iPhone, periksa volume dan coba matikan mode senyap.
- Tautan yang dibuka dari dalam aplikasi (WhatsApp, Instagram, Facebook) memakai peramban bawaan aplikasi yang sering tidak mendukung suara bawaan; bila ResponsiveVoice / Google juga tidak tersedia, pengguna akan melihat pesan di atas. Sarankan membuka situs di Chrome atau Safari.

## Bahasa Isyarat (SIBI &amp; BISINDO)

- Dua petak di kelompok Suara &amp; Gerak, hanya satu yang bisa menyala:
  - **SIBI (Abjad 1 Tangan)**: semua huruf abjad jari SIBI memakai satu tangan, sama seperti acuan resmi abjad SIBI Kemendikdasmen.
  - **BISINDO (Abjad 1 dan 2 Tangan)**: sebagian besar huruf abjad jari BISINDO memakai dua tangan, sebagian satu tangan (di data saat ini: C, E, I, J, L, O, R, U, V, Z; jumlah tangan J, R, dan Z belum pasti karena hurufnya bergerak sedangkan acuannya hanya satu bingkai video).
  - Pembeda 1 / 2 tangan hanya berlaku untuk abjad jari; isyarat kata (mis. "baca", "buku", "rumah" di kosakata SIBI resmi) bisa memakai dua tangan.
- Cara pakai: nyalakan petak, lalu klik teks di halaman (atau tekan Putar) untuk dieja oleh avatar. Kata yang hurufnya tidak lengkap di kamus dilewati utuh, tidak dieja sebagian.
- Panel peraga selalu di **bawah** layar, di sisi yang berseberangan dengan tombol widget (tombol di kanan → panel kiri bawah, tombol di kiri → panel kanan bawah), dan ikut pindah saat widget dipindah. Seperti petak lain, pilihan ini tersimpan: sesudah halaman dimuat ulang panel langsung tampil lagi sampai ditutup.
- **Isi kamus masih draf**: 26 huruf SIBI dan 26 huruf BISINDO, semuanya belum diperiksa juru bahasa isyarat (`terverifikasi: false`). Isyarat tidak boleh dikarang, jadi entri yang belum diperiksa **hanya diputar pada mode uji**:
  - otomatis di `localhost`, `127.0.0.1`, dan `[::1]`, atau dengan atribut `isyarat-uji="1"`;
  - di domain publik panel menampilkan "belum tersedia" dan tombol putar dimatikan, sampai entri ditandai `terverifikasi: true` sesudah diperiksa juru bahasa isyarat / komunitas Tuli.
- Acuan data: abjad SIBI dibandingkan dengan acuan abjad SIBI Kemendikdasmen (pkplk.kemendikdasmen.go.id/sibi); abjad BISINDO disusun dari video "A dalam BISINDO" sampai "Z dalam BISINDO" di Wikimedia Commons (pengunggah angphotorion, proyek Wikibility, CC BY-SA 4.0). Tidak ada aset dari sumber tersebut yang disalin ke widget.
- Avatar 3D otomatis tidak dipakai bila peramban tidak mendukung WebGL2 atau pengguna meminta gerak dikurangi (`prefers-reduced-motion`); avatar SVG dipakai sebagai gantinya.
- Model avatar `widget_disabilitas_avatar.vrm` ("Rinia", © 2026 fathul hudoyo). Lisensi pada metadata model: pemakaian avatar hanya oleh pembuat, nonkomersial pribadi, wajib mencantumkan kredit, tidak boleh disebarkan ulang maupun diubah.

## Kesesuaian dengan WCAG dan ADA

**Penting:** widget ini membantu pengunjung menyesuaikan tampilan, tetapi **tidak membuat sebuah situs otomatis patuh WCAG maupun ADA**. Kepatuhan dinilai dari HTML dan konten situs itu sendiri, misalnya teks alternatif gambar, label formulir, struktur judul, teks / transkrip video, kontras warna bawaan, dan semua fungsi bisa dipakai dengan keyboard. Jangan mencantumkan klaim "situs patuh WCAG / ADA" hanya karena memasang widget ini. Pada April 2025, FTC Amerika Serikat menetapkan perintah final terhadap penyedia widget overlay accessiBe, termasuk denda US$1 juta, karena mengklaim widget-nya bisa membuat situs mana pun patuh WCAG.

- **ADA** adalah undang-undang Amerika Serikat. Aturan Departemen Kehakiman AS (April 2024) untuk ADA Title II menetapkan WCAG 2.1 level AA sebagai standar situs dan aplikasi pemerintah negara bagian / lokal di AS.
- Untuk situs pemerintah Indonesia, dasar hukumnya adalah UU No. 8 Tahun 2016 tentang Penyandang Disabilitas, dengan WCAG 2.1 / 2.2 level AA sebagai standar teknis yang lazim dipakai.

### Hasil Pemeriksaan Tampilan Widget (Versi 2.3.0)

Yang diperiksa adalah tampilan widget itu sendiri (tombol, menu, semua panel, pemutar Baca Halaman, panel Bahasa Isyarat) pada halaman demo, di Chrome desktop dan layar 320 px. Pemeriksaan mencakup aturan otomatis axe-core untuk WCAG 2.0–2.2 level A / AA, ditambah kriteria yang dicek manual di tabel berikut. Kriteria di luar tabel belum dinilai.

| Pemeriksaan | Kriteria WCAG | Hasil |
|---|---|---|
| axe-core 4.10.2 untuk semua aturan WCAG 2.0–2.2 A / AA | berbagai | 0 pelanggaran (setelah perbaikan di versi ini) |
| Ctrl+U membuka menu dan memindahkan fokus ke dalamnya, Tab berurutan logis, Escape menutup dan fokus kembali ke tombol widget | 2.1.1, 2.1.2, 2.4.3 | Lolos |
| Cincin fokus terlihat, kontras ≥ 3:1 terhadap latar | 2.4.7, 1.4.11 | Lolos setelah perbaikan (sebelumnya 1,3–1,6:1) |
| Kontras teks, untuk kesepuluh warna tema `warna-widget` dan contoh kode warna sendiri | 1.4.3 | Lolos setelah perbaikan (tombol pintasan Ctrl / U sebelumnya hanya 4,1:1 di tema hijau) |
| Tampil tanpa geser horizontal di lebar 320 px | 1.4.10 | Lolos |
| Spasi teks pengguna (jarak baris 1,5, huruf 0,12em, kata 0,16em) tanpa teks terpotong | 1.4.12 | Lolos setelah perbaikan |
| Ukuran target sentuh minimal 24 × 24 px | 2.5.8 | Lolos |
| Tooltip Keterangan Alat bisa ditutup dengan Escape | 1.4.13 | Lolos setelah perbaikan |
| Bahasa halaman (`<html lang>`) mengikuti terjemahan | 3.1.1 | Lolos setelah perbaikan |
| Fokus keyboard yang keluar dari menu tidak tertutup panel menu (Tab dan Shift+Tab, di 1366 px dan 320 px) | 2.4.11 | Lolos setelah perbaikan (sebelumnya fokus pindah ke tautan di balik panel) |
| Peran dan status kontrol (`role="button"`, `aria-pressed`, `aria-expanded`), termasuk tingkat petak bertingkat | 1.3.1, 4.1.2 | Lolos setelah perbaikan (sebelumnya tingkat hanya terlihat dari garis strip) |
| Tidak ada animasi widget yang berjalan terus-menerus tanpa bisa dihentikan | 2.2.2 | Lolos |
| Semua isi menu terjangkau di ponsel 320 × 640 pada halaman panjang dan saat diperbesar 200% (setara 683 × 384), header tidak terpotong | 1.4.4, 1.4.10, 2.1.1 | Lolos setelah perbaikan (sebelumnya Atur Ulang dan Pindahkan Widget berada di luar layar) |
| Tombol widget yang melayang tidak menutupi elemen halaman yang difokus, di keempat posisi widget | 2.4.11 | Lolos setelah perbaikan (sebelumnya tombol "kembali ke atas" situs tertutup penuh) |
| Bulatan pilihan warna (36 buah) berkontras ≥ 3:1 terhadap latarnya | 1.4.11 | Lolos setelah perbaikan (sebelumnya 14 bulatan terang hanya 1,0–1,8:1) |
| 99 kontrol di menu: punya nama dan cincin fokus yang terlihat | 2.4.7, 4.1.2 | Lolos |
| Bahasa tiap pilihan di panel Bahasa ditandai (`lang`), kelompok petak berlabel (`role="group"`), pintasan hanya Ctrl+U (bukan tombol tunggal) | 3.1.2, 1.3.1, 2.1.4 | Lolos |

Belum diperiksa:

- pesan status yang diumumkan otomatis (4.1.3);
- pembaca layar sungguhan (NVDA, JAWS, VoiceOver, TalkBack);
- iPhone, iPad, dan Android asli;
- tampilan widget bersama CSS situs instansi lain;
- isi kamus Bahasa Isyarat, yang masih draf dan belum diperiksa juru bahasa isyarat.

Pemeriksaan otomatis hanya menemukan sebagian masalah aksesibilitas. Uji manual, terutama oleh pengguna disabilitas, tetap diperlukan.

Catatan untuk instansi:

- Bila situs punya tombol tetap di pojok (kembali ke atas, obrolan), pengguna **mouse** tidak bisa mengklik tombol situs yang tertutup tombol widget. Pengguna keyboard tidak terdampak karena tombol widget menepi saat elemen itu difokus. Pilih posisi widget yang tidak bertabrakan lewat Pindahkan Widget.
- Di mode kontras tinggi Windows, ikon petak yang tidak aktif bisa tidak terlihat. Nama petak tetap tampil, jadi petak masih bisa dikenali.

## Kompatibilitas dengan Situs

Widget dipasang di situs yang CSS dan JavaScript-nya berbeda-beda. Widget menjaga dua arah: tidak merusak situs, dan tampilannya sendiri tidak berubah karena situs.

### Yang Ditangani Widget

| Kondisi di situs | Penanganan widget |
|---|---|
| CSS tema mengenai elemen widget, misalnya `* { box-sizing: border-box }`, `body { font-size; letter-spacing; color }`, `div { line-height }`, `button { min-height; text-transform }`, `svg { max-width }` (Tailwind preflight, Bootstrap reboot, tema WordPress) | Akar widget memakai ukuran, warna, dan jarak teksnya sendiri. Tombol dan isian widget kembali ke gaya bawaan peramban. Spesifisitas aturan ini rendah, sehingga aturan widget sendiri tetap menang. Hasil uji: tampilan menu di halaman dengan CSS seperti itu sama dengan di halaman demo. |
| Gaya inline dari editor CMS, misalnya `<span style="font-size:14pt">`, `<p style="line-height:2">`, `font-family`, `letter-spacing` | Nilainya dicatat sebelum diubah, lalu dikembalikan saat Perbesar / Perkecil Teks, Ramah Disleksia, Tinggi Garis, Spasi Huruf, atau Atur Ulang Semua dimatikan. Kontras+ tidak menyentuh warna inline biasa (warnanya ditimpa lewat CSS). Hanya warna inline `!important` yang ditimpa sementara, lalu dikembalikan. |
| Induk elemen inline-block memakai `font-size: 0` untuk menghapus celah (grid / menu) | Tidak diubah oleh Perbesar / Perkecil Teks, agar susunan tidak turun baris. |
| CSS situs memakai `!important` pada properti yang diubah fitur, misalnya `#konten .kartu { background: #fff !important }`, `#konten p { text-align: left !important; font-weight: 400 !important }`, `*:focus { outline: none !important }`, `html { filter: none !important }` | Aturan fitur widget berspesifisitas setara dua ID (Kontras+ setara tiga ID) dan memakai `!important`, sehingga tetap menang. Fitur yang menulis gaya ke elemen memakai `!important` inline, yang selalu menang atas CSS situs. Hasil uji pada halaman seperti itu: 18 dari 18 pemeriksaan fitur berhasil (versi sebelumnya 8 dari 18). |
| Elemen dengan gaya inline `!important` milik situs, misalnya `style="background-color:#ff0 !important"` | Kontras+ menimpanya secara inline (nilai asli dicatat), lalu dikembalikan persis seperti semula saat Kontras+ dimatikan. |
| Halaman besar / elemen bertumpuk banyak (ribuan elemen, lapisan absolut, animasi, data live) | Kontras+, Rata Tulisan, dan Animasi Dijeda bekerja lewat satu kelas di `<html>`, bukan menulis ke setiap elemen. Hasil uji di halaman sekitar 12 ribu elemen: Kontras+ 134 → 70 ms dan Rata Tulisan 168 → 87 ms per klik. Di 45 ribu elemen, Animasi Dijeda yang sebelumnya membuat halaman macet terus-menerus (sekitar 10 frame per detik) kini tanpa beban sama sekali. Sisa waktu per klik adalah waktu peramban sendiri untuk menghitung ulang gaya seluruh halaman. |
| Slider / carousel / animasi situs yang memakai `transform`, `transition`, atau `opacity` inline | Tidak lagi dihapus saat Animasi Dijeda atau Kontras+ dimatikan (versi sebelumnya menghapus `transform` / `transition` / `animation` / `opacity` / `border-color` inline milik situs). |
| Situs menimpa seluruh kelas `<html>` (`className = "dark"`, hidrasi Next.js / Nuxt) | Kelas milik widget dipasang kembali. Kelas milik situs tidak disentuh. |
| Elemen yang muncul belakangan (SPA, "muat lagi") | Lihat [Elemen yang Muncul Belakangan](#elemen-yang-muncul-belakangan). |
| Situs sudah memakai jQuery | Widget memakai jQuery situs. Bila tidak ada, widget memuat jQuery sendiri dengan `noConflict`, sehingga `$` / `jQuery` situs tidak tertimpa. Nilai `jQuery.fx.off` milik situs dikembalikan setelah Animasi Dijeda dimatikan. |
| Situs memakai GSAP | Widget tidak memuat GSAP, sehingga `gsap` / `TweenMax` milik situs tidak tertimpa. |
| Situs memakai Google Translate sendiri | CSS widget tidak menyembunyikan banner / iframe Google Translate dan tidak menggeser `body`. |
| Editor teks di situs (textarea, `contenteditable`, CKEditor, dll.) | Ctrl+U di kolom isian tetap berfungsi sebagai garis bawah. Pintasan widget hanya berlaku di luar kolom isian, tanpa Shift / Alt / Meta, dan bila situs belum menangani Ctrl+U sendiri. |
| Situs menyimpan data di localStorage dengan nama umum (`text_besar`, `tooltip_active`, `position_widget`, ...) | Kunci widget berawalan `dsb:`, sehingga kunci situs tidak terbaca, tertimpa, atau terhapus (termasuk oleh Atur Ulang Semua). Pengaturan lama pengunjung disalin sekali ke kunci baru, dan hanya bila nilainya sesuai format yang ditulis widget (misalnya `text_besar` bernilai `1`–`4`, `position_widget` bernilai `left_top` / `right_top` / `left_bottom` / `right_bottom`). Nilai lain dianggap milik situs dan tidak disalin. Kunci lama tidak pernah dihapus. |

### Yang Belum Bisa Diubah Widget

- **Shadow DOM** (Web Components, misalnya komponen Ionic, Shoelace, Salesforce Lightning). Elemen di dalam shadow root tidak terjangkau efek per elemen maupun CSS widget.
- **iframe**, misalnya YouTube, Google Maps, atau formulir pihak ketiga. Bila iframe satu domain dengan situs, pasang widget juga di halaman iframe tersebut.
- **Teks di dalam gambar, `<canvas>`, atau video**. Gunakan teks HTML biasa, atau sediakan teks alternatif.
- **Gaya yang diperbarui framework di tempat**: React / Vue yang memperbarui prop `style` sebuah elemen tanpa mengganti elemennya bisa menimpa gaya dari widget. Lihat [Elemen yang Muncul Belakangan](#elemen-yang-muncul-belakangan).
- **CSS situs yang sangat spesifik**, misalnya selektor ID atau `!important` pada elemen seperti `#header button { ... !important }`, masih bisa mengenai tampilan widget. Ini karena widget tidak berada di Shadow DOM.
- **Aturan `!important` situs dengan tiga ID atau lebih** (misalnya `#a #b #c p { ... !important }`) bisa mengalahkan aturan fitur yang bekerja lewat CSS. Aturan seperti ini sangat jarang.
- **JavaScript situs yang menulis ulang seluruh atribut `style`** (misalnya `el.style.cssText = ...` atau `el.setAttribute("style", ...)` di setiap frame) bisa menghapus gaya yang ditulis widget pada elemen itu. Penulisan per properti (`el.style.transform = ...`, cara yang dipakai React, Vue, dan jQuery) tidak masalah.

### Saran Pemasangan

- Tambahkan penanda versi pada URL skrip, misalnya `widget_disabilitas.js?v=2.3.0`. Dengan begitu pengunjung langsung mendapat versi baru, tidak memakai versi lama dari cache peramban. Selama masa peralihan, salinan lama di cache masih memakai kunci penyimpanan tanpa awalan.
- Bila situs memakai Content Security Policy, lihat [Catatan Error](#catatan-error-content-security-policy).
- Setelah memasang, coba minimal: buka menu dengan keyboard (Tab / Enter), nyalakan lalu matikan Perbesar Teks dan Kontras+, lalu pastikan tampilan situs kembali seperti semula.

## Catatan Error (Content Security Policy)
Jika Ada Salah Satu Fungsi Dari Widget Ini Tidak Berfungsi, Mohon Untuk Di Inspect Element Jika Di Temukan Error Seperti Gambar Di Bawah Ini

<p align="center">
 <img width="90%" src="ScreenShot%20Widget/SS6.jpg" alt="Contoh error Content Security Policy di konsol peramban">
</p> <br>

Silahkan Di Allow Terlebih Dahulu Dari Sisi Server. Daftar host di bawah disarikan dari CSP ppid.jakarta.go.id, dan contoh Nginx di bawahnya sudah diuji pada halaman demo repo ini tanpa `'unsafe-inline'` / `'unsafe-eval'`: menu, huruf, terjemahan, Google Analytics, dan avatar 3D Bahasa Isyarat berjalan tanpa satu pun pelanggaran CSP. `https://web.animemusic.us` pada `script-src` dan `connect-src` dibutuhkan untuk memuat widget dari server pusat dan untuk avatar 3D (`/avatar-3d-anime/`); bila widget di-host sendiri, cukup izinkan `https://web.animemusic.us/avatar-3d-anime/` pada `script-src`.

| Direktif | Host yang dibutuhkan widget | Untuk |
|---|---|---|
| `script-src` | `https://cdnjs.cloudflare.com/ajax/libs/` `https://ajax.googleapis.com/ajax/libs/` `https://code.responsivevoice.org` `https://www.googletagmanager.com/gtag/` | GSAP (animasi), jQuery cadangan (bila halaman tidak memuat jQuery), ResponsiveVoice, Google Analytics |
| `style-src` | nonce halaman (lihat atribut `nonce`) | `<style>` milik widget |
| `font-src` | `https://fonts.gstatic.com` `https://raw.githubusercontent.com` | huruf menu dan huruf ramah disleksia |
| `connect-src` | `https://web.animemusic.us` `https://www.googletagmanager.com` `https://www.google-analytics.com` `https://region1.google-analytics.com` `https://analytics.google.com` `https://stats.g.doubleclick.net` `https://www.google.com` `https://api.mymemory.translated.net` `https://code.responsivevoice.org` `https://texttospeech.responsivevoice.org` | statistik pemakaian widget dan Google Analytics, terjemahan halaman (MyMemory), suara ResponsiveVoice |
| `img-src` | `data:` `blob:` `https://*.google-analytics.com` `https://*.googletagmanager.com` `https://*.g.doubleclick.net` `https://*.google.com` `https://www.google.co.id` | ikon, tekstur avatar 3D, piksel Google Analytics |
| `media-src` | `data:` `blob:` `https://*.responsivevoice.org` | suara ResponsiveVoice |

Bila memakai `api-key-google`, tambahkan juga `https://texttospeech.googleapis.com` pada `connect-src`. Host suara ResponsiveVoice dan Google kini dipakai di desktop juga, tidak hanya di ponsel. Host suara yang diblokir CSP tidak membuat suara hilang: mesinnya dilewati dan widget pindah ke mesin berikutnya (lihat Urutan Suara).

Contoh untuk Nginx (ganti `NONCE-ACAK` dengan nonce acak per permintaan yang juga dipasang pada tag skrip widget):

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-NONCE-ACAK' https://web.animemusic.us https://cdnjs.cloudflare.com/ajax/libs/ https://ajax.googleapis.com/ajax/libs/ https://code.responsivevoice.org https://www.googletagmanager.com/gtag/; style-src 'self' 'nonce-NONCE-ACAK'; font-src 'self' data: https://fonts.gstatic.com https://raw.githubusercontent.com; img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com https://www.google.co.id; media-src 'self' data: blob: https://*.responsivevoice.org; connect-src 'self' https://web.animemusic.us https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.google.com https://api.mymemory.translated.net https://code.responsivevoice.org https://texttospeech.responsivevoice.org";
```

## Catatan Tambahan Jika Ingin Menggunakan Google Cloud Voice

```js
//tambahkan variable di bawah ini
var api_key_google_cloud = "apikey";
//tambahkan sebelum script di samping kanan <script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js"></script>
```

## Atau Bisa Cara Seperti Di Bawah Ini Untuk Menggunakan Google Cloud Voice
```html
<script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js" api-key-google="apikey"></script>
```

Biaya, urutan pemakaian, dan cara membatasi kunci Google dijelaskan di bagian Urutan Suara.

## Download Source Code
Untuk Source Code Dapat Di Download Di Link [github.com/fathulhudoyo](https://github.com/fathulhudoyo/Fitur_Disabilitas) atau

Bisa Di Download Di Link [Git KEMKOMDIGI](https://git2.layanan.go.id/fathulhudoyo/widget-aksesbilitas)


## Daftar Beberapa Instansi Pemerintah Yang Sudah Pernah Menggunakan Widget Version 2 Ini

  - [info.go.id](https://info.go.id).

  - [lapor.go.id](https://lapor.go.id).

  - [www.jakarta.go.id](https://www.jakarta.go.id).

  - [slemankab.go.id](https://slemankab.go.id).

  - [ppid.bnpt.go.id](https://ppid.bnpt.go.id).

  - [ppid.jakarta.go.id](https://ppid.jakarta.go.id).

  - [ppid.jabarprov.go.id](https://ppid.jabarprov.go.id).

  - [ppid.slemankab.go.id](https://ppid.slemankab.go.id).

  - [ppid.lombokbaratkab.go.id](https://ppid.lombokbaratkab.go.id).

  - [bkd.jabarprov.go.id](https://bkd.jabarprov.go.id).

  - [jdih.bnpt.go.id](https://jdih.bnpt.go.id).

  - [info-dev.layanan.go.id](https://info-dev.layanan.go.id).

  - [jayapura.info.go.id](https://jayapura.info.go.id).

  - [kpu.info.go.id](https://kpu.info.go.id).

  - [lombokbarat.info.go.id](https://lombokbarat.info.go.id).

  - [dasangeres.lombokbaratkab.go.id](https://dasangeres.lombokbaratkab.go.id).

  - [gerungselatan.lombokbaratkab.go.id](https://gerungselatan.lombokbaratkab.go.id).

  - [sidemele.lombokbaratkab.go.id](https://sidemele.lombokbaratkab.go.id).

  - [dcktrp.jakarta.go.id](https://dcktrp.jakarta.go.id).

  - [ppid-dinkes.jakarta.go.id](https://ppid-dinkes.jakarta.go.id).

  - [km-bpsdm.jakarta.go.id](https://km-bpsdm.jakarta.go.id).

  - [bpsdm.jakarta.go.id](https://bpsdm.jakarta.go.id).

  - [kominfo.slemankab.go.id](https://kominfo.slemankab.go.id).

  - [bengkuluutara.info.go.id](https://bengkuluutara.info.go.id).

  - [bpbumd.jakarta.go.id](https://bpbumd.jakarta.go.id).
