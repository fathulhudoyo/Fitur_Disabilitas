## Documentation Fitur Di Sabilitas


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




Letakan element di bawah ini Di Atas Tag Template 

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

## All Fitur Disabilitas

1. Coming soon



