<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo Widget Aksesibilitas</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
      background: #f3f4f6;
      line-height: 1.6;
    }

    header {
      padding: 32px 24px;
      background: #1e3a8a;
      color: #ffffff;
    }

    main {
      max-width: 860px;
      margin: 0 auto;
      padding: 24px;
    }

    section {
      margin-bottom: 24px;
      padding: 20px 24px;
      border-radius: 12px;
      background: #ffffff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 8px;
      border: 1px solid #d1d5db;
      text-align: left;
    }

    label {
      display: block;
      margin-top: 12px;
    }

    input,
    textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
    }

    .gambar {
      display: flex;
      gap: 16px;
    }
  </style>
</head>

<body>
  <!--
    Pemasangan widget cukup satu tag skrip. Atribut opsionalnya dijelaskan di README bagian Atribut Tambahan:
    kunci ResponsiveVoice, kunci Google Cloud Text-to-Speech, alamat Pernyataan Aksesibilitas, mode uji Bahasa
    Isyarat, mematikan avatar 3D, dan folder avatar 3D sendiri. Tanpa atribut itu, avatar 3D dimuat dari server pusat
    web.animemusic.us/avatar-3d-anime/.
  -->
  <script src="widget_disabilitas.js" api-key-resvoice="N0bzbTAK"></script>

  <header>
    <h1>Demo Widget Aksesibilitas</h1>
    <p>Halaman contoh untuk mencoba seluruh fitur widget. Tekan Ctrl+U atau klik tombol widget untuk membuka menu.</p>
  </header>

  <main id="konten-utama">
    <section>
      <h2>Tentang Layanan Informasi Publik</h2>
      <p>Setiap orang berhak memperoleh informasi publik sesuai ketentuan peraturan perundang-undangan. Pemohon dapat
        mengajukan permohonan informasi secara daring maupun datang langsung ke meja layanan.</p>
      <p>Baca juga <a href="#formulir">formulir permohonan informasi</a> dan <a href="#jadwal">jadwal layanan</a>.</p>
    </section>

    <section>
      <h2>Langkah Permohonan</h2>
      <ol>
        <li>Isi formulir permohonan dengan data yang benar.</li>
        <li>Unggah dokumen pendukung bila diperlukan.</li>
        <li>Pantau status permohonan melalui nomor registrasi.</li>
      </ol>
    </section>

    <section>
      <h2>Gambar</h2>
      <div class="gambar">
        <img width="160" height="100" alt="Ilustrasi gedung layanan"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%2393c5fd'/%3E%3Crect x='50' y='30' width='60' height='70' fill='%231e3a8a'/%3E%3C/svg%3E">
        <img width="160" height="100" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23fde68a'/%3E%3Ccircle cx='80' cy='50' r='30' fill='%23b45309'/%3E%3C/svg%3E"> <!-- NOSONAR -->
      </div>
      <p>Gambar kedua sengaja tanpa teks alternatif untuk mencoba fitur Deskripsi Gambar.</p>
    </section>

    <section id="jadwal">
      <h2>Jadwal Layanan</h2>
      <table>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Jam</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Senin - Kamis</td>
            <td>08.00 - 16.00</td>
          </tr>
          <tr>
            <td>Jumat</td>
            <td>08.00 - 16.30</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="formulir">
      <h2>Formulir Permohonan</h2>
      <form action="#">
        <label for="nama">Nama lengkap</label>
        <input id="nama" type="text" autocomplete="name">
        <label for="surel">Surel</label>
        <input id="surel" type="email" autocomplete="email">
        <label for="isi">Rincian informasi yang dimohon</label>
        <textarea id="isi" rows="3"></textarea>
      </form>
    </section>
  </main>
</body>

</html>
