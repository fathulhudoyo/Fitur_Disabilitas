## Documentation Fitur Disabilitas


## Php 

1. Copy Semua Source Code Yang Berada Di File Index.php Ke File Yang Ingin Anda Letakan
2. Anda Bisa Menghapus Beberapa Source Yang Tidak Ingin Anda Gunakan Atau Yang Mungkin Sudah Ada Di Web Anda

Contoh Source

```php

// --> Ini  Optional  Jika Sudah Ada Tidak Pelu Di Gunakan

<link href="https://ppid.jakarta.go.id/assets/home/ppidNew/css/bootstrap.min.css" rel="stylesheet">
<script src="bootstrap.min.js"></script>
<script src="jquery.min.js"></script>




1. Untuk Fitur Warna Bisa Di Custom 

    -  Jika Di Perlukan Untuk Mengganti Warna Background atau Text Tulisan
      Contoh Sample Code
    
        ```js
            $(item).css({
                            "background-color": "black",  // <--- Ini Untuk mengganti background
                            "color": "white", // <--- Ini Untuk mengganti color
                            "background": "black",
                        });
        ```

    -  Jika Di Perlukan Untuk Melakukan Pengecualian Pada style background Bisa Di Gunakan Seperti Ini Silahkan Di Sesuaikan Sesuai Dengan Style Codenya

   
        ```js
        $('*:not(".btn-color-mode-switch-inner,.mycheckbox")').each(function(i, item));
        ```

    -  Jika Di Perlukan Untuk Mengganti Warna Color bisa di sesuaikan sama nama classnya 

        ```js
        if (!isBlank(links[i].href) || links[i].className == "col-md-12 feature-txt2" ||
        links[i].className == "col-md-12 feature-txt" || links[i].className == "col-md-12 feature-txt" || links[i].className == "text-center") {
            links[i].style.color = "#00f3f7";
        }
        ```
        
2. Untuk Fitur Klise Bisa Di Custom

    -  Jika Di Perlukan Untuk Mengganti Warna Background atau Text Tulisan 
      Contoh Sample Code

        ```js
        var color = $(item).css('color');
        $(item).css({ "background-color": "black","color": "yellow", "background": "black" });
        ```

    - Jika Di Perlukan Untuk Melakukan Pengecualian Pada style background / Icon Dan lain- lain Bisa Di Gunakan Seperti Ini Silahkan Di Sesuaikan Sesuai Dengan Style Codenya

      ```js
          $('*:not(".btn-color-mode-switch-inner,.mycheckbox")').each(function(i, item))
            $("* > a:not('.cameraContent > .camera_link')").hover(function(e))
      ```

3. Garis Bawahi Tautan

 -  Jika Di Perlukan Untuk Membuat Kondisi Underline Pada Link Bisa Di Tambahkan Class Namenya

    ```js
      if (!isBlank(links[i].href) || links[i].className == "hurufawal mylink capitalfont" || links[i].className == "subtitletools" || links[i].className == "subtitletoolsactive" 
      || links[i].className == "mylinkweb" || links[i].className == "hurufawal mylink" || links[i].className == "col-md-12 feature-txt2" ||
      links[i].className == "col-md-12 feature-txt" || links[i].className == "col-md-12 feature-txt" || links[i].className == "text-center") {
      links[i].style.textDecoration = "underline";
      }
    ```
