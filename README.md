## Documentation Source Code Widget Aksesbilitas Version 2.1.2 (info.go.id)

  Widget Ini Sudah Di Gunakan Di Beberapa Domain Dan Sub Domain Pemerintah.

  Personal Web [Fathul-Hudoyo](https://fathulhudoyo.info/).

  Web Streaming Msc [Anime Msc](https://animemusic.us/).

  Di Sarankan Menggunakan Url [Widget-Aksesbilitas](https://web.animemusic.us/widget_disabilitas.js) ( https://web.animemusic.us/widget_disabilitas.js ) 
  Agar Mendapatkan Pembaharuan Otomatis Dan Jika Ada Error Bisa Saya Resolve Langsung Estimasi Paling Lama 4 - 9 Hari

## Download Source Code
Untuk Source Code Dapat Di Download Di Link [github.com/fathulhudoyo](https://github.com/fathulhudoyo/Fitur_Disabilitas) atau 

Bisa Di Download Di Link [Git Kominfo](https://git2.layanan.go.id/fathulhudoyo/widget-aksesbilitas)


## Catatan Error
Jika Ada Salah Satu Fungsi Dari Widget Ini Tidak Berfungsi, Mohon Untuk Di Inspect Element Jika Di Temukan Error Seperti Gambar Di Bawah Ini

<p align="center">
 <img width="90%" height="250" src="https://github.com/fathulhudoyo/Fitur_Disabilitas/blob/2.1/ScreenShot%20Widget/SS6.jpg" alt="widget_ss5">&emsp;&emsp;
</p> <br>


Silahkan Di Allow Terlebih Dahulu Dari Sisi Server, Contoh Seperti Di Bawah Ini Jika Menggunakan Nginx

```html
<!-- 
add_header Content-Security-Policy "script-src 'self' 'unsafe-inline' 'unsafe-eval'  *.githubusercontent.com *.responsivevoice.org  *.googleapis.com *.animemusic.us script-src 'self'";
 -->
 
```



## Contoh Pemasangan Widget Menggunakan Responsive Voice

```html
  <!-- Matikan semua pengaturan yang ada di responsive voice seperti gambar di bawah ini -->
```
<p align="center">
 <img width="90%" height="375" src="https://raw.githubusercontent.com/fathulhudoyo/Fitur_Disabilitas/2.1/ScreenShot%20Widget/SS5.jpg" alt="widget_ss5">&emsp;&emsp;
</p> <br>



# Cara 1


```html
<body>
  <!-- Notes Menyesuaikan Dengan Code Anda Yang Di Dapat Dari Web responsivevoice -->
<script src="https://code.responsivevoice.org/responsivevoice.js?key=bzbTAKXD"></script> 
<script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js"></script>
```

# Atau Bisa Menggunakan Cara 2
```html
<body>
  <!-- Atau Bisa Seperti Di Bawah Ini -->
<script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js" api-key-resvoice="bzbTAKXD"></script>
<!-- ganti key api-key-resvoice dengan key yang ada di responsive voice-->
```


## Catatan Tambahan Jika Ingin Menggunakan Google Cloud Voice

```js
//tambahkan variable di bawah ini
var api_key_google_cloud = "apikey";
//tambahkan sebelum script di samping kanan <script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js"></script>
// 


```
# Atau Bisa Cara Seperti Di Bawah Ini Untuk Menggunakan Google Cloud Voice
```html

<script type="text/javascript" src="https://web.animemusic.us/widget_disabilitas.js" api-key-google="apikey"></script>

```


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
  

