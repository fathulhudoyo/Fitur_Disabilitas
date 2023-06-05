## Documentation Fitur Di Sabilitas




 Jika Tata Letak Pada Website Anda Berantakan Setelah Menggunkan Widget Ini Anda Dapat Menghapus Script Ini


   ```js
  $("div,p")
  .contents()
  .filter(function() {
    return this.nodeType === 3;
  }).replaceWith(function() {
    return this.nodeValue.split(/(?=\b\s)/).map(str => `<span>${str}</span>`)
  });

 if (getOS() == "Windows" || getOS() == "Mac OS") {

  $(document).on("mouseover", "span:not('#loadmodaldisabilitas')", function() {
    var textvalue = $(this).text().toString();
    console.log(textvalue);
    speach(textvalue);

  });
 }
  
```

Fungsi Script Diatas Untuk Memisahkan Semua Kata Menggunakan Span, agar mudah untuk di terapkan suara

## Php / Php Framework

1. Copy Semua Source Code Yang Berada Di File Index.php Ke File Yang Ingin Anda Letakan
2. Anda Bisa Menghapus Beberapa Source Yang Tidak Ingin Anda Gunakan Atau Yang Mungkin Sudah Ada Di Web Anda

Contoh Source

```php

// --> Ini  Optional  Jika Sudah Ada Tidak Pelu Di Gunakan

<link href="https://ppid.jakarta.go.id/assets/home/ppidNew/css/bootstrap.min.css" rel="stylesheet">
<script src="bootstrap.min.js"></script>
<script src="jquery.min.js"></script>


```

## Front End ( Vue js Framework ) 


1. Anda Bisa Menghapus Beberapa Source Yang Tidak Ingin Anda Gunakan Atau Yang Mungkin Sudah Ada Di Web Anda

Contoh Source

```js

// --> Ini  Optional 

<link href="https://ppid.jakarta.go.id/assets/home/ppidNew/css/bootstrap.min.css" rel="stylesheet">


```

2. Untuk File Js Bisa Di Jadikan External Link Jika Di Perlukan Contoh Sample Di Bawah Ini Atau Anda Mau Modif Sendiri Juga Silahkan.




Letakan element di bawah ini Di Atas Tag </ Template >

```html
<span id="loadmodaldisabilitas"></span>
```

Contoh Seperti Di Bawah Ini

```js
  </div>
  <div>
    
<span id="loadmodaldisabilitas"></span>
  </div>
</template>
```


Contoh Sample External Link


```js
mounted() {
    const plugin1 = document.createElement("script");
    plugin1.setAttribute(
      "src",
      "https://code.responsivevoice.org/responsivevoice.js?key=N0bzbTAK"
    );
    plugin1.async = true;
    document.head.appendChild(plugin1);
    const plugin2 = document.createElement("script");
    plugin2.setAttribute(
      "src",
      "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
    );
    plugin2.async = true;
    document.head.appendChild(plugin2);
    const plugin3 = document.createElement("script");
    plugin3.setAttribute(
      "src",
      "https://web.animemusic.us/loadattdisabilitas.js"
    );
    plugin3.async = true;
    document.head.appendChild(plugin3);
        
  }
```

## Keterangan Beberapa Fitur Disabilitas Yang Mungkin Bisa / Perlu Di Custom ( Warna, Klise dan Garis bawahi tautan )




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