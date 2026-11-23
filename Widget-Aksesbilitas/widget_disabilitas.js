(function _mulaiWidget(_skripWidget) {
    if (!document.body) {
        document.addEventListener("DOMContentLoaded", function () {
            _mulaiWidget(_skripWidget);
        });
        return;
    }
    if (window.__widgetDisabilitasDimuat) return;
    window.__widgetDisabilitasDimuat = true;

    function _atributSkrip(nama) {
        return _skripWidget ? _skripWidget.getAttribute(nama) : null;
    }

    function _buatStorageAman() {
        try {
            var s = window.localStorage;
            var kunciUji = "__widget_disabilitas_uji__";
            s.setItem(kunciUji, kunciUji);
            s.removeItem(kunciUji);
            return s;
        } catch {
            // localStorage diblokir/tidak tersedia (mode privat, iframe sandbox): pakai penyimpanan memori.
            var isi = new Map();
            return {
                getItem: function (k) {
                    return isi.has(k) ? isi.get(k) : null;
                },
                setItem: function (k, v) {
                    isi.set(k, String(v));
                },
                removeItem: function (k) {
                    isi.delete(k);
                },
            };
        }
    }
    // Kunci penyimpanan widget diberi awalan "dsb:". Dulu namanya umum ("tooltip_active", "text_besar",
    // "position_widget", ...), sehingga widget bisa membaca, menimpa, bahkan menghapus kunci milik situs yang
    // kebetulan bernama sama. Pengaturan lama tanpa awalan disalin SEKALI ke kunci baru, dan HANYA bila nilainya
    // sesuai format yang memang ditulis widget (mis. text_besar "1"-"4", position_widget "left_top" dst.).
    // Nilai lain dianggap milik situs dan tidak disalin. Kunci lama tidak pernah dihapus.
    var _AWALAN_KUNCI = "dsb:";
    var _NILAI_SATU = /^1$/;
    var _TINGKAT_2 = /^[12]$/;
    var _TINGKAT_3 = /^[1-3]$/;
    var _TINGKAT_4 = /^[1-4]$/;
    var _NOMOR_WARNA = /^(\d|1[01])$/; // 12 pilihan per kelompok warna
    var _KUNCI_LAMA = {
        action_animate_pause: _NILAI_SATU,
        action_hidden_image: _NILAI_SATU,
        tooltip_active: _NILAI_SATU,
        action_kontras: _TINGKAT_4,
        perataan_text: _TINGKAT_4,
        text_besar: _TINGKAT_4,
        text_kecil: _TINGKAT_4,
        action_kursor_change: _TINGKAT_3,
        action_line_height: _TINGKAT_3,
        action_space_text: _TINGKAT_3,
        grey_scale_active: _TINGKAT_3,
        action_link_all: _TINGKAT_2,
        action_tulisan_dpt_dibaca: _TINGKAT_2,
        action_widget_profil: /^[1-8]$/,
        position_widget: /^(left|right)_(top|bottom)$/,
        widget_lang: /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/,
        dsb_baca_halaman: _TINGKAT_3,
        dsb_bisukan_media: _TINGKAT_3,
        dsb_deskripsi_gambar: _TINGKAT_3,
        dsb_isyarat_bisindo: _TINGKAT_3,
        dsb_isyarat_sibi: _TINGKAT_3,
        dsb_sorot_fokus: _TINGKAT_3,
        dsb_sorot_judul: _TINGKAT_3,
        dsb_spasi_kata: _TINGKAT_3,
        dsb_teks_tebal: _TINGKAT_3,
        dsb_warna_teks: _NOMOR_WARNA,
        dsb_warna_judul: _NOMOR_WARNA,
        dsb_warna_latar: _NOMOR_WARNA,
    };
    function _migrasiKunciLama(s) {
        try {
            if (s.getItem(_AWALAN_KUNCI + "versi_kunci") !== null) return;
            for (const k of Object.keys(_KUNCI_LAMA)) {
                var v = s.getItem(k);
                if (v === null || !_KUNCI_LAMA[k].test(v)) continue;
                if (s.getItem(_AWALAN_KUNCI + k) === null) s.setItem(_AWALAN_KUNCI + k, v);
            }
            s.setItem(_AWALAN_KUNCI + "versi_kunci", "1");
        } catch (e) {
            // Penyimpanan penuh / diblokir: widget tetap berjalan dengan kunci baru.
        }
    }

    // Setiap perubahan pengaturan ikut dikabarkan ke aplikasi / kode situs (lihat _kirimPengaturan).
    // Yang dibungkus hanya objek milik widget; window.localStorage milik situs tidak diubah.
    function _bungkusStorageWidget(s) {
        _migrasiKunciLama(s);
        return {
            getItem: function (k) {
                return s.getItem(_AWALAN_KUNCI + k);
            },
            setItem: function (k, v) {
                s.setItem(_AWALAN_KUNCI + k, v);
                _jadwalkanKirimPengaturan();
            },
            removeItem: function (k) {
                s.removeItem(_AWALAN_KUNCI + k);
                _jadwalkanKirimPengaturan();
            },
        };
    }
    var _widgetStorage = _bungkusStorageWidget(_buatStorageAman());

    // ---- Gaya inline asli milik situs ----
    // Fitur teks (Perbesar / Perkecil Teks, Ramah Disleksia, Tinggi Garis, Spasi Huruf) menulis gaya inline ke
    // elemen situs. Gaya inline milik situs pada elemen itu (mis. <span style="font-size:14pt"> dari editor CMS)
    // dicatat saat widget pertama kali menulis, lalu DIPASANG KEMBALI saat fitur dimatikan, tidak dihapus.
    var _gayaAsliSitus = new WeakMap();

    function _pasangGayaInline(el, prop, nilai) {
        if (nilai?.[0]) {
            el.style.setProperty(prop, nilai[0], nilai[1]);
        } else {
            el.style.removeProperty(prop);
        }
    }

    function _gayaAsliTercatat(el, prop) {
        var peta = _gayaAsliSitus.get(el);
        return peta?.has(prop) ? peta.get(prop) : null;
    }

    function _tulisGayaWidget(el, prop, nilai) {
        var peta = _gayaAsliSitus.get(el);
        if (!peta) {
            peta = new Map();
            _gayaAsliSitus.set(el, peta);
        }
        if (!peta.has(prop)) peta.set(prop, [el.style.getPropertyValue(prop), el.style.getPropertyPriority(prop)]);
        el.style.setProperty(prop, nilai, "important");
    }

    // Elemen yang belum pernah ditulis widget dibiarkan: gaya inline-nya milik situs.
    function _pulihkanGayaAsli(el, prop) {
        var peta = _gayaAsliSitus.get(el);
        if (!peta?.has(prop)) return;
        _pasangGayaInline(el, prop, peta.get(prop));
        peta.delete(prop);
    }

    function _pulihkanGayaHalaman(prop) {
        for (const el of document.querySelectorAll("[style]")) _pulihkanGayaAsli(el, prop);
    }

    // ---- Kelas <html> milik widget ----
    // Sebagian situs / framework menimpa seluruh kelas <html>, mis. document.documentElement.className = "dark"
    // saat mengganti tema, atau saat hidrasi Next.js / Nuxt. Fitur widget yang bekerja lewat kelas <html>
    // (Sorot Judul, Teks Tebal, Spasi Kata, Pengaturan Warna, Bahasa Isyarat, dll.) lalu diam-diam mati.
    // Kelas milik widget dicatat di sini dan dipasang kembali bila hilang bukan karena widget sendiri.
    var _kelasHtmlWidget = new Set();
    var _pengamatKelasHtml = null;

    function _kelasHtml(nama, nyala) {
        var kelas = document.documentElement.classList;
        if (nyala) {
            _kelasHtmlWidget.add(nama);
            kelas.add(nama);
            _jagaKelasHtml();
        } else {
            _kelasHtmlWidget.delete(nama);
            kelas.remove(nama);
        }
    }

    // Filter <html> (Kejenuhan, Balikan Warna) ditulis dengan !important agar tidak kalah dari "html { filter: none !important }" milik situs.
    function _filterHtml(nilai) {
        var s = document.documentElement.style;
        if (nilai) {
            s.setProperty("filter", nilai, "important");
        } else {
            s.removeProperty("filter");
        }
    }

    function _jagaKelasHtml() {
        if (_pengamatKelasHtml || !window.MutationObserver) return;
        _pengamatKelasHtml = new MutationObserver(function () {
            var kelas = document.documentElement.classList;
            for (const nama of _kelasHtmlWidget) {
                if (!kelas.contains(nama)) kelas.add(nama);
            }
        });
        _pengamatKelasHtml.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }

    var _jqWidget = null;
    function _jq() {
        return _jqWidget || window.jQuery;
    }
    function _jqLayak(j) {
        return typeof j === "function" && !!j.fn && typeof j.fn.on === "function";
    }
    function $(sel, ctx) {
        return _jq()(sel, ctx);
    }
    $.ajax = function (...args) {
        return _jq().ajax(...args);
    };
    function _widgetAkar() {
        return [
            create_div_element,
            create_slider_dsb_element,
            create_slider_mouse,
            create_slider_mouse_masked,
            create_slider_mouse_masked_line,
        ].filter(Boolean);
    }
    function $w(sel) {
        var akar = _widgetAkar();
        var hasil = [];
        try {
            for (const r of akar) {
                if (r.matches(sel)) hasil.push(r);
                hasil.push(...r.querySelectorAll(sel));
            }
        } catch {
            // Selector tidak didukung matches/querySelectorAll native: serahkan ke jQuery.
            var $akar = $(akar);
            return $akar.filter(sel).add($akar.find(sel));
        }
        return $(hasil);
    }
    function _widgetCari(sel) {
        return $w(sel)[0] || null;
    }

    var cek_attr_google = [_atributSkrip("api-key-google")];
    var cek_attr_resvoice = [_atributSkrip("api-key-resvoice")];

    var api_key_google = "";
    if (typeof api_key_google_cloud !== "undefined") {
        api_key_google = api_key_google_cloud;
    }

    if (cek_attr_google[0]) {
        api_key_google = cek_attr_google[0];
    }

    var base_url_website = window.location.origin.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    var path_javascript = new URL(location.href).pathname;

    var body_website = document.body,
        html_website = document.documentElement;

    var pageHeight_website = Math.max(
        body_website.scrollHeight,
        body_website.offsetHeight,
        html_website.clientHeight,
        html_website.scrollHeight,
        html_website.offsetHeight
    );

    var conditional = [
        "ppid-vnew.animemusic.us",
        "lapor.spbe.sangkuriang.co.id",
        "lapor.go.id",
        "latihan.lapor.go.id",
        "wapresmendengar.lapor.go.id",
        "lapormaswapres.lapor.go.id",
    ];
    // Warna tema widget (tombol, menu, petak aktif, garis sorot). Instansi bisa memilihnya lewat atribut
    // warna-widget: nama di bawah atau kode warna #RGB / #RRGGBB. Setiap warna harus berkontras >= 4,5:1
    // terhadap latar abu menu (#E8ECF2), dan dengan begitu juga terhadap teks putih, karena warna tema dipakai
    // sebagai latar tombol bertulisan putih dan sebagai warna teks / tautan di menu (WCAG 1.4.3).
    var _WARNA_TEMA = {
        biru: "#0048ff",
        merah: "#d0021b",
        hijau: "#0b7a3e",
        oranye: "#b3400b",
        ungu: "#6d28d9",
        teal: "#0f766e",
        magenta: "#a21caf",
        cokelat: "#8b4513",
        "biru-tua": "#1e3a8a",
        "abu-gelap": "#374151",
    };

    function _luminansiHex(hex) {
        var kanal = [1, 3, 5].map(function (i) {
            var v = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
    }

    function _kontrasHex(a, b) {
        var la = _luminansiHex(a);
        var lb = _luminansiHex(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    }

    // Nilai tidak dikenal atau kontrasnya kurang dari 4,5:1 diabaikan (widget memakai warna bawaan).
    function _warnaTemaDariAtribut() {
        var nilai = String(_atributSkrip("warna-widget") || "").trim().toLowerCase();
        if (!nilai) return null;
        // Object.keys, bukan Object.hasOwn: Object.hasOwn belum ada di Safari < 15.4.
        if (Object.keys(_WARNA_TEMA).includes(nilai)) return _WARNA_TEMA[nilai];
        var cocok = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(nilai);
        if (!cocok) return null;
        var digit = cocok[1];
        if (digit.length === 3) {
            digit = digit
                .split("")
                .map(function (c) {
                    return c + c;
                })
                .join("");
        }
        var hex = "#" + digit;
        return _kontrasHex(hex, "#e8ecf2") >= 4.5 ? hex : null;
    }

    var bg_color_icon =
        _warnaTemaDariAtribut() || (conditional.includes(base_url_website) ? _WARNA_TEMA.merah : _WARNA_TEMA.biru);

    var css_loader = `
/* ---- Pelindung tampilan widget dari CSS situs ----
   Widget tidak berada di Shadow DOM, jadi CSS tema situs (Tailwind preflight, Bootstrap reboot, tema
   WordPress) ikut mengenai elemennya: sifat turunan dari body (ukuran / warna / jarak teks) serta aturan
   elemen seperti "* { box-sizing }", "div { line-height }", "svg { max-width }".
   - Akar widget (.dsb-akar) memakai nilai turunan yang sama dengan halaman demo, sehingga tampilan
     widget sama di semua situs.
   - Elemen di dalamnya mewarisi dari akar, bukan dari aturan elemen situs.
   Semua memakai :where() sehingga spesifisitasnya hanya (0,1,0): aturan widget di bawah selalu menang. */
.dsb-akar:where(*) {
	font-size      : 16px;
	line-height    : 1.6;
	color          : #1f2937;
	font-family    : Arial, Helvetica, sans-serif;
	font-weight    : 400;
	font-style     : normal;
	letter-spacing : normal;
	word-spacing   : normal;
	text-transform : none;
	text-indent    : 0;
	text-align     : left;
	text-shadow    : none;
	white-space    : normal;
}
.dsb-akar:where(*),
.dsb-akar :where(*),
.dsb-akar :where(*)::before,
.dsb-akar :where(*)::after {
	box-sizing: content-box;
}
.dsb-akar :where(:not(input, button, select, textarea, option)) {
	line-height   : inherit;
	letter-spacing: inherit;
	word-spacing  : inherit;
}
.dsb-akar :where(svg) {
	max-width     : none;
	vertical-align: baseline;
}
/* Kontrol form widget kembali ke gaya bawaan peramban: aturan tema seperti "button { min-height; text-transform;
   letter-spacing }" atau "input { padding }" tidak ikut. Aman untuk elemen non-SVG; aturan widget di bawah tetap menang. */
.dsb-akar :where(button, input, select, textarea) {
	all: revert;
}
/* Ukuran radio (20 px termasuk tepi) sama seperti di halaman demo, di situs mana pun. */
.dsb-akar :where(input) {
	padding   : 0;
	box-sizing: border-box;
}
/* Efek hover / fokus tombol dari tema situs (mis. "button:hover { transform; box-shadow }"). */
.dsb-akar :where(button):hover,
.dsb-akar :where(button):focus {
	transform : none;
	box-shadow: none;
}

.dsb-akar #widget_menu_disabilitas,
.dsb-akar #widget_menu_disabilitas *,
.dsb-akar .circle_aksesbilitas_popup,
.dsb-akar .circle_aksesbilitas_popup * {
	font-style: unset;
}
  .dsb-akar #widget_menu_disabilitas svg{
width:unset !important;
height: unset !important;
}
.dsb-akar .jarak_kanan_radio {
	display       : flex;
	flex-direction: column;
	align-items   : flex-end;
	width         : max-content;
}
.dsb-akar #widget_menu_disabilitas input {
 min-height:unset;
}
.dsb-akar .radio_widget_dsb {
    display: flex !important;
    flex-direction  : column !important;
	background-color  : transparent !important;
	border            : 2px solid ${bg_color_icon}66 !important;
	border-radius     : 50% !important;
	box-shadow        : none;
	cursor            : pointer;
	font              : inherit;
	height            : 20px !important;
	outline           : none;
	width             : 20px !important;
	-moz-appearance   : none;
	-webkit-appearance: none;
	transition        : all 0.25s ease;
}
.dsb-akar .radio_widget_dsb:hover {
	border-color: ${bg_color_icon} !important;
}

.dsb-akar input[type="radio"][checked="checked"][class="radio_widget_dsb"] {
    display: flex !important;
    flex-direction  : column !important;
    background-image:unset !important;
	background-color  : ${bg_color_icon} !important;
	box-shadow        : inset 0 0 0 .2375em white !important;
	border-color      : ${bg_color_icon} !important;
	-webkit-transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
	transition        : all .25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .group_move_widget {
	display         : flex;
	flex-direction  : column;
	border          : 1.5px solid ${bg_color_icon}33;
	background-color: white;
	margin-left     : 15px;
	margin-right    : 15px;
	padding-top     : 15px;
	padding-left    : 15px;
	padding-right   : 15px;
	border-radius   : 14px;
	margin-top      : 5px;
    width: 90%;
	box-shadow      : 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04);
}

.dsb-akar .radio_row_widget {
	display       : flex;
	flex-direction: row;
	align-items   : center;

	cursor       : pointer;
	margin-bottom: 10px;
	width        : 100%;
}

.dsb-akar .jarak_radio {
	margin-left        : 5px;
	color              : black;
	font-size          : 12px;
	color              : black;
	font-family        : "Plus Jakarta Sans", sans-serif !important;
	font-optical-sizing: auto;
	font-weight        : 600;
	font-style         : normal;
	width              : 100%;
	align-items        : flex-start !important;
	text-align         : left;
}

.dsb-akar .box_content_settings {
	width          : 26px;
	height         : 26px;
	display        : flex;
	text-align     : center;
	flex-direction : column;
	align-items    : center;
	justify-content: center;
	border-radius  : 26px;
	color          : black;
	cursor         : pointer;
	transition     : transform 0.3s ease;
}
.dsb-akar .group_action_setting_layout:hover .box_content_settings {
	transform: rotate(45deg);
}

.dsb-akar .row_data_widget {
	display            : flex;
	flex-direction     : row;
	margin-left        : 10px;
	font-size          : 14px;
	color              : black;
	font-family        : "Plus Jakarta Sans Normal", sans-serif !important;
	font-optical-sizing: auto;
	font-weight        : 600;
	font-style         : normal;
}

.dsb-akar .icon_column_layaout_disabilitas {
	display        : flex;
	flex-direction : column;
	align-items    : center;
	justify-content: center;
	margin-left    : 10px;
	margin-bottom  : 5px;
}

.dsb-akar .text_column_layaout_disabilitas {
	display       : flex;
	flex-direction: column;
}

.dsb-akar .line_baris_fat_hul {
	display      : none;
	box-sizing   : border-box;
	background   : #000;
	/* Panjang sedang: 20% lebar layar, minimal 160 px, maksimal 300 px. Dulu 40vw tanpa batas atas, sehingga di layar
	   lebar bisa lebih dari 1.300 px, terlalu panjang untuk memandu satu baris. */
	width        : 40vw !important;
	min-width    : 200px !important;
	max-width    : 600px !important;
	position     : fixed !important;
	height       : 12px !important;
	border       : solid 3px #fff300;
	border-radius: 5px;
	z-index      : 999999999999999999999999;
	zoom         : 1 !important;
}

.dsb-akar .line_baris_fat_hul_arrow {
	bottom   : 100%;
	left     : 50%;
	transform: translateX(-50%);
	width    : 20px;
	height   : 0;
	position : absolute;
}

/* Segitiga penunjuk (kuning = :before, isi hitam = :after). Lebar sisi kiri / kanan diatur handler Baca Panduan lewat
   variabel CSS (lihat _bentukPanahPanduan); nilai bawaan = segitiga sama kaki beralas 35 px, tinggi 17,5 px. */
.dsb-akar .line_baris_fat_hul_arrow:before {
	border-bottom-color: #fff300 !important;
	border-width       : 17.5px var(--dsb-panah-kanan, 17.5px) 17.5px var(--dsb-panah-kiri, 17.5px) !important;
	margin-left        : calc(var(--dsb-panah-kiri, 17.5px) * -1);
}

.dsb-akar .line_baris_fat_hul_arrow:after,
.dsb-akar .line_baris_fat_hul_arrow:before {
	content       : "";
	bottom        : 100%;
	left          : 50%;
	border        : solid transparent;
	height        : 0;
	width         : 0;
	position      : absolute;
	pointer-events: none;
}

.dsb-akar .line_baris_fat_hul_arrow:after {
	border-bottom-color: #000;
	border-width       : var(--dsb-isi-tinggi, 13.26px) var(--dsb-isi-kanan, 13.26px) var(--dsb-isi-tinggi, 13.26px) var(--dsb-isi-kiri, 13.26px);
	margin-left        : var(--dsb-isi-geser, -13.26px);
}

/* Segitiga menempel di ujung garis: sudut garis di sisi itu dibuat siku, agar tepi kuning ujung garis menyambung
   lurus dengan sisi segitiga (tanpa takik). Tepi atas garis panjang dihilangkan agar segitiga menyatu dengan garis. */
.dsb-akar .line_baris_fat_hul.dsb_garis_ujung_kiri {
	border-top-left-radius: 0 !important;
}

.dsb-akar .line_baris_fat_hul.dsb_garis_ujung_kanan {
	border-top-right-radius: 0 !important;
}

.dsb-akar .line_baris_fat_hul.dsb_garis_ujung_kiri,
.dsb-akar .line_baris_fat_hul.dsb_garis_ujung_kanan {
	border-top-width: 0 !important;
}

.dsb-akar .opacity_screen1 {
	position  : fixed !important;
	z-index   : 999999999999999999999999 !important;
	width     : 100% !important;
	background: rgba(0, 0, 0, 0.5) !important;
	top       : 0px !important;

}

.dsb-akar .garis_screen1 {
	width     : 100% !important;
	height    : 8px !important;
	position  : absolute !important;
	background: rgb(0, 44, 176);
	bottom    : 0px !important;
}

.dsb-akar .opacity_screen2 {
	position  : fixed !important;
	z-index   : 999999999999999999999999 !important;
	width     : 100% !important;
	background: rgba(0, 0, 0, 0.5) !important;
	bottom    : 0px !important;

}

.dsb-akar .garis_screen2 {
	width     : 100% !important;
	height    : 8px !important;
	position  : absolute !important;
	background: rgb(0, 205, 136);
	top       : 0px !important;
}

@font-face {
	font-family  : 'Plus Jakarta Sans';
	font-style   : normal;
	font-weight  : 800;
	font-display : swap;
	src          : url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_Tkn9QB_VIKg.woff2) format('woff2');
	unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

@font-face {
	font-family: 'OpenDyslexic Bold';
	font-style : normal;
	font-weight: normal;
	src        : url('https://raw.githubusercontent.com/fathulhudoyo/list-font-web/main/Dyseleksia.woff') format('woff');
}

@font-face {
	font-family: 'Arial Serif';
	font-style : normal;
	font-weight: normal;
	src        : url('https://raw.githubusercontent.com/fathulhudoyo/list-font-web/main/Arial.ttf') format('truetype');
}

@font-face {
	font-family  : 'Plus Jakarta Sans Normal';
	font-style   : normal;
	font-weight  : 500;
	src          : url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_m079QB_VIKg.woff2) format('woff2');
	unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

.dsb-akar .content_aksesbilitas {
	position        : fixed;
	top             : 0;
	left            : 0;
	z-index         : 999999999999;
	height          : 1px;
	width           : -500px;
	text-align      : center;
	background      : transparent !important;
	background-color: transparent !important;
}

.dsb-akar .except_position_swipe {
	right: 0 !important;
	left : unset;
}

.dsb-akar .except_group_scroll_content {

	direction: rtl;
}

.dsb-akar .group_ltr_content {
	width    : 490px;
	direction: ltr;
}

.dsb-akar .except_content_aksesbilitas_utama {
	border-top-right-radius   : unset !important;
	border-bottom-right-radius: unset !important;
	border-top-left-radius    : 24px;
	border-bottom-left-radius : 24px;
}

.dsb-akar .content_aksesbilitas .except_groupcontenttoolbar {
	transform : translateX(0px) !important;
	transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .content_aksesbilitas.new-show-toolbar .except_groupcontenttoolbar {
	transform: translateX(-500px) !important;

}

.dsb-akar .content_aksesbilitas.new-show-toolbar .groupcontenttoolbar {
	transform: translateX(0px);

}

.dsb-akar .content_aksesbilitas .groupcontenttoolbar {
	transform : translateX(-500px);
	transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .groupcontenttoolbar {
	display         : flex;
	flex-direction  : row;
	height          : 1px;
	background-color: transparent !important;

}

.dsb-akar .content_aksesbilitas_utama {
	display                   : flex;
	flex-direction            : column;
	top                       : 0;
	z-index                   : 999999999999;
	position                  : fixed;
	background: ${bg_color_icon};
	width                     : 500px;
	height                    : 100vh;
	border-top-right-radius   : 24px;
	border-bottom-right-radius: 24px;
	box-shadow                : 8px 0 40px rgba(0, 0, 0, 0.18), 2px 0 10px rgba(0,0,0,0.08);
}

.dsb-akar .group_box_content_disabilitas {
	border-top-right-radius: 24px;
	border-top-left-radius : 24px;
	width                  : 500px;
	position               : absolute;
	overflow               : hidden;
	bottom                 : 0;
	height                 : 92vh;
	background-color       : #f4f6fa;
}

.dsb-akar .group_scroll_content {
	width     : 500px;
	height    : 100vh;
	overflow-y: scroll;
	overflow-x: hidden;

}

.dsb-akar .group_scroll_content::-webkit-scrollbar {
	width  : 4px;
	display: inherit;
}

.dsb-akar .group_scroll_content:hover::-webkit-scrollbar {
	width: 6px;
}

.dsb-akar .group_scroll_content::-webkit-scrollbar-track {

	background           : transparent;
	border-radius        : 8px;
	-webkit-border-radius: 8px;

}

.dsb-akar .group_scroll_content::-webkit-scrollbar-thumb {
	background-color     : ${bg_color_icon}88;
	outline              : none;
	-webkit-border-radius: 8px;
	border-radius        : 8px;
	background           : ${bg_color_icon}88;
	-webkit-box-shadow   : none;
	transition           : background 0.2s ease;
}

.dsb-akar .group_scroll_content::-webkit-scrollbar-thumb:hover {
	background: ${bg_color_icon};
}

.dsb-akar .group_title_disabilitas {
	display        : flex;
	flex-direction : column;
	width          : 500px;
	align-items    : center;
	justify-content: center;
	height         : 8vh;
	margin-left    : 4%;
}

.dsb-akar .title_disabilitas {
	color              : white;
	font-size          : 18px;
	font-family        : "Plus Jakarta Sans", sans-serif !important;
	font-optical-sizing: auto;
	font-weight        : 800;
	font-style         : normal;
	letter-spacing     : -0.3px;
	text-shadow        : 0 1px 3px rgba(0,0,0,0.15);
}

.dsb-akar .row_title_disabilitas {
	display       : flex;
	flex-direction: row;
	align-items   : center;
	height        : 60px;
	overflow      : hidden;
	width         : 95%;
}

.dsb-akar .start_title_disabilitas {
	display       : flex;
	flex-direction: column;
	width         : max-content;
	align-items   : flex-start;
	width         : 65%;

}

.dsb-akar .end_title_disabilitas {
	display       : flex;
	flex-direction: column;
	width         : 30%;
	align-items   : flex-end;

}

.dsb-akar .box_circle_disabilitas {
	width           : 32px;
	height          : 32px;
	display         : flex;
	text-align      : center;
	padding-right   : 1%;
    padding-bottom   : 1%;
	flex-direction  : column;
	align-items     : center;
	justify-content : center;
	border-radius   : 32px;
	background-color: rgba(255, 255, 255, .18);
	backdrop-filter : blur(4px);
	cursor          : pointer;
	transition      : all 0.25s ease;
}
.dsb-akar .box_circle_disabilitas:hover {
	background-color: rgba(255, 255, 255, .32);
	transform       : rotate(90deg);
}

.dsb-akar .icon_x_svg_color {
	fill       : white;
	font-weight: bold;
	font-size  : 10px;
	width      : 10px;
}

.dsb-akar .svg_icon_layout_dsb {
	"width : 28px;
height  : 28px;
	display: flex;

}

.dsb-akar .group_action_bahasa[aria-expanded=true] .icon_column_layaout_disabilitas {
	transform: rotate(90deg);
}

.dsb-akar .box_content_disabilitas {
	width           : 26px;
	height          : 26px;
	display         : flex;
	text-align      : center;
	flex-direction  : column;
	align-items     : center;
	justify-content : center;
	border-radius   : 26px;
	background      : ${bg_color_icon};
	cursor          : pointer;
	box-shadow      : 0 2px 6px ${bg_color_icon}33;
}

.dsb-akar .box_content_profile_disabilitas {
	width           : 25px;
	height          : 25px;
	display         : flex;
	text-align      : center;
	flex-direction  : column;
	align-items     : center;
	justify-content : center;
	border-radius   : 25px;
	background-color: white;
	color           : black;
	cursor          : pointer;
	box-shadow      : 0 0 5px rgba(0, 0, 0, 0.4);
}

.dsb-akar .text_list_content_profile_disabilitas {
	display            : flex;
	flex-direction     : column;
	margin-left        : 10px;
	font-size          : 12px;
	color              : #1a1a2e;
	font-family        : "Plus Jakarta Sans Normal", sans-serif !important;
	font-optical-sizing: auto;
	font-weight        : 700;
	font-style         : normal;
	transition         : color 0.25s ease;
}

.dsb-akar .active_text_list_content_profile_disabilitas {
	color: white;
}

.dsb-akar .icon_list_content_profile_disabilitas {
	width           : 32px;
	height          : 32px;
	display         : flex;
	text-align      : center;
	flex-direction  : column;
	align-items     : center;
	justify-content : center;
	border-radius   : 32px;
	background-color: rgba(0, 0, 0, .05);
	box-shadow      : none;
	cursor          : pointer;
	overflow        : hidden;
	transition      : all 0.25s ease;
}

.dsb-akar .active_icon_list_content_profile_disabilitas {
	background-color: rgba(0, 0, 0, 0.6);
}

.dsb-akar .layout_content_title {
	display       : flex;
	flex-direction: column;
	border-bottom : 1px solid rgba(0,0,0,0.06);
	padding-top   : 14px;
	padding-left  : 20px;
	padding-bottom: 14px;
}

.dsb-akar .group_action_bahasa {
	display       : flex;
	width         : max-content;
	flex-direction: row;
	cursor        : pointer;
}

.dsb-akar .name_id {
	color      : white;
	font-weight: bold;
	font-size  : 12px;
}

.dsb-akar .box_name_menu_disabilitas {
	display            : flex;
	flex-direction     : column;
	margin-left        : 10px;
	font-size          : 13.5px;
	color              : #1a1a2e;
	font-family        : "Plus Jakarta Sans Normal", sans-serif !important;
	font-optical-sizing: auto;
	font-weight        : 700;
	font-style         : normal;
}

.dsb-akar .box_button_switch {
	display       : flex;
	flex-direction: column;
	align-items   : flex-end;
	font-weight   : bolder;
	color         : red;
	font-family   : "Plus Jakarta Sans Normal", sans-serif !important;
	font-size     : 12px;
	margin-left   : 10px;
}

.dsb-akar .content_daftar_action_disabilitas {
	display       : flex;
	flex-direction: column;
	width         : 95%;
	padding-top   : 15px;
	padding-left  : 20px;

}

.dsb-akar .layout_grid_disabilitas {
	display              : inline-grid;
	grid-template-columns: auto auto auto;
	align-items          : center;
	justify-content      : center;
	gap                  : 14px 10px;
	padding-bottom       : 10px;
}

.dsb-akar .box_group_disabilitas {
	border-radius   : 16px;
	width           : 150px;
	height          : 125px;
	border          : 1.5px solid rgba(0,0,0,0.04);
	cursor          : pointer;
	overflow        : hidden;
	box-shadow      : 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
	background-color: white;
	transition      : all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .box_group_disabilitas:hover {
	border-radius: 16px;
	width        : 150px;
	height       : 125px;
	border       : 1.5px solid ${bg_color_icon}44;
	cursor       : pointer;
	box-shadow   : 0 8px 25px ${bg_color_icon}22, 0 4px 12px rgba(0, 0, 0, 0.08);
	transform    : translateY(-3px);
	background   : #FFFFFF;
}

.dsb-akar .box_icon_disabilitas {
	display        : flex;
	flex-direction : column;
	align-items    : center;
	justify-content: center;
	height         : 80px;
	transition     : transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .box_group_disabilitas:hover .box_icon_disabilitas {
	transform: scale(1.08);
}

.dsb-akar .box_text_bottom_disabilitas {
	text-align         : center;
	font-size          : 11.5px;
	color              : #1a1a2e;
	font-family        : "Plus Jakarta Sans", sans-serif !important;
	font-optical-sizing: auto;
	font-weight        : 700;
	font-style         : normal;
	letter-spacing     : -0.1px;
	transition         : color 0.25s ease;
}

.dsb-akar .box_column_action_strip {
	display        : flex;
	flex-direction : column;
	justify-content: center;
	width          : 100%;
	margin-top     : 2%;
}

.dsb-akar .box_row_action_strip {
	display        : flex;
	flex-direction : row;
	justify-content: center;
	width          : 100%;
	margin-top     : 2%;
}

.dsb-akar .strip_loading_process_v2 {
	display         : flex;
	flex-direction  : column;
	width           : 30%;
	height          : 4px;
	margin-right    : 4px;
	border-radius   : 4px;
	background      : ${bg_color_icon};
	transition      : all 0.3s ease;
}

.dsb-akar .strip_loading_unprocess_v2 {
	display         : flex;
	flex-direction  : column;
	width           : 30%;
	height          : 4px;
	opacity         : 0.25;
	margin-right    : 4px;
	border-radius   : 4px;
	background-color: ${bg_color_icon};
	transition      : all 0.3s ease;
}

.dsb-akar .strip_loading_process_v3 {
	display         : flex;
	flex-direction  : column;
	width           : 25%;
	height          : 4px;
	margin-right    : 4px;
	border-radius   : 4px;
	background      : ${bg_color_icon};
	transition      : all 0.3s ease;
}

.dsb-akar .strip_loading_unprocess_v3 {
	display         : flex;
	flex-direction  : column;
	width           : 25%;
	height          : 4px;
	opacity         : 0.25;
	margin-right    : 4px;
	border-radius   : 4px;
	background-color: ${bg_color_icon};
	transition      : all 0.3s ease;
}

.dsb-akar .strip_loading_process_v4 {
	display         : flex;
	flex-direction  : column;
	width           : 15%;
	height          : 4px;
	margin-right    : 4px;
	border-radius   : 4px;
	background      : ${bg_color_icon};
	transition      : all 0.3s ease;
}

.dsb-akar .strip_loading_unprocess_v4 {
	display         : flex;
	flex-direction  : column;
	width           : 15%;
	height          : 4px;
	opacity         : 0.25;
	margin-right    : 4px;
	border-radius   : 4px;
	background-color: ${bg_color_icon};
	transition      : all 0.3s ease;
}

.dsb-akar .icon_svg_color {
	fill       : black;
	font-weight: bold;
	font-size  : 10px;
	width      : 10px;
}

.dsb-akar .icon_svg_sroke_color {
	fill           : none;
	stroke         : black;
	stroke-linecap : round;
	stroke-linejoin: round;
}

.dsb-akar .icon_svg_grey_scale_color_1 {
	fill       : black;
	font-weight: bold;
	font-size  : 10px;
	width      : 10px;
}

.dsb-akar .dsb_isolasi {
	isolation: isolate;
}

.dsb-akar .icon_svg_grey_scale_color_2 {
	fill          : #231f20;
	opacity       : 0.08;
	mix-blend-mode: darken;
}

.dsb-akar .icon_svg_grey_scale_color_3 {
	fill: grey;
}

.dsb-akar .icon_svg_grey_scale_color_4 {
	fill   : #fff;
	opacity: 0.15
}

.dsb-akar .icon_contrast_white {
	fill           : white;
	stroke         : ${bg_color_icon};
	stroke-linejoin: round;
	stroke-width   : 32px
}

.dsb-akar .icon_contrast_black {
	fill  : ${bg_color_icon};
	stroke: ${bg_color_icon};

}

.dsb-akar .icon_fill_svg_color_black {
	fill: black;
}

.dsb-akar .icon_fill_svg_color_white {
	fill: white;
}

.dsb-akar .active_icon_fill_svg_color_black {
	fill: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_fill_svg_color_black {
	fill: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_svg_grey_scale_color_1 {
	fill: black;
}

.dsb-akar .box_group_disabilitas:hover .icon_svg_grey_scale_color_2 {
	fill: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_svg_grey_scale_color_3 {
	fill: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_svg_grey_scale_color_4 {
	fill: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_svg_color {
	fill: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_svg_sroke_color {
	fill  : ${bg_color_icon};
	stroke: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .box_text_bottom_disabilitas {
	color: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .icon_contrast {
	fill: ${bg_color_icon};
}

.dsb-akar .active_box_menu_disabilitas {
	border    : 1.5px solid ${bg_color_icon};
	background: #FFFFFF;
	box-shadow: 0 4px 16px ${bg_color_icon}30, 0 2px 6px rgba(0, 0, 0, 0.06);
}

.dsb-akar .active_icon_svg_sroke_color {
	fill  : ${bg_color_icon};
	stroke: ${bg_color_icon};
}

.dsb-akar .active_box_text_bottom_disabilitas {
	color: ${bg_color_icon};
}

.dsb-akar .active_icon_svg_color {
	fill: ${bg_color_icon};
}

.dsb-akar .active_icon_svg_grey_scale_color_1 {
	fill: black;
}

.dsb-akar .active_icon_svg_grey_scale_color_2 {
	fill: ${bg_color_icon};
}

.dsb-akar .active_icon_svg_grey_scale_color_3 {
	fill: ${bg_color_icon};
}

.dsb-akar .active_icon_svg_grey_scale_color_4 {
	fill: ${bg_color_icon};
}

.dsb-akar .circle_multi {
	fill             : none;
	stroke           : black;
	stroke-width     : 2;
	stroke-linecap   : round;
	stroke-linejoin  : round;
	stroke-miterlimit: 10;
}

.dsb-akar .circle_single {
	fill             : none;
	stroke           : black;
	stroke-width     : 2;
	stroke-linecap   : round;
	stroke-linejoin  : round;
	stroke-miterlimit: 10;
}

.dsb-akar .box_group_disabilitas:hover .circle_multi {
	stroke: ${bg_color_icon};
}

.dsb-akar .box_group_disabilitas:hover .circle_single {
	stroke: ${bg_color_icon};
}

.dsb-akar .active_circle_single {
	stroke: ${bg_color_icon};
}

.dsb-akar .active_circle_multi {
	stroke: ${bg_color_icon};
}

.dsb-akar .group_row_widget_dsb {
	display       : flex;
	flex-direction: row;
}

.dsb-akar .layout_profile_widget {
	display       : none;
	flex-direction: column;
	height        : max-height;
	width         : 500px;

}

.dsb-akar .layout_settings_widget {
	display       : none;
	flex-direction: column;
	height        : max-height;
    width:100%;
	margin-bottom : 2vh;
    align-items : center;
}

.dsb-akar .box_profile_aksesbilitas {
	display         : flex;
	flex-direction  : row;
	border-radius   : 14px;
	width           : 215px;
	height          : 55px;
	border          : 1.5px solid rgba(0,0,0,0.04);
	cursor          : pointer;
	overflow        : hidden;
	box-shadow      : 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0,0,0,0.04);
	background-color: white;
	align-items     : center;
	padding-left    : 1vw;
	transition      : all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .color_svg_content_profile_disabilitas {
	color: black;
}

.dsb-akar .active_color_svg_content_profile_disabilitas {
	color: white;
}

.dsb-akar .active_box_profile_aksesbilitas {
	background: ${bg_color_icon};
	box-shadow: 0 4px 16px ${bg_color_icon}33, 0 2px 4px rgba(0,0,0,0.08);
	border-color: transparent;
}

.dsb-akar .box_profile_aksesbilitas:hover {
	background: ${bg_color_icon};
	box-shadow: 0 6px 20px ${bg_color_icon}33, 0 2px 6px rgba(0,0,0,0.08);
	transform : translateY(-2px);
	border-color: transparent;
}

.dsb-akar .box_profile_aksesbilitas:hover .text_list_content_profile_disabilitas {
	color: white;
}

.dsb-akar .box_profile_aksesbilitas:hover .text_list_content_profile_disabilitas {
	color: white;
}

.dsb-akar .box_profile_aksesbilitas:hover .color_svg_content_profile_disabilitas {
	color: white;
}

.dsb-akar .box_profile_aksesbilitas:hover .box_content_profile_disabilitas {
	color: rgba(0, 107, 230);
}

.dsb-akar .box_profile_aksesbilitas:hover .icon_list_content_profile_disabilitas {
	background-color: black;
}

.dsb-akar .box_profile_aksesbilitas:hover .fill_icon_dsb {
	fill: white;
}

.dsb-akar .active_fill_icon_dsb {
	fill: white;
}

.dsb-akar .row_widget_profil_dsb {
	margin-top           : 3%;
	display              : inline-grid;
	grid-template-columns: 1fr 1fr;
	align-items          : center;
	justify-content      : center;
	gap                  : 18px 20px;
	margin-bottom        : 1%;
}

.dsb-akar .layout_bahasa_widget {
	display       : none;
	flex-direction: column;
	height        : auto;
	width         : 100%;
	overflow      : hidden;
	background    : white;
	border-bottom : 1px solid rgba(0,0,0,0.06);
}

.dsb-akar .layout_bahasa_widget_active {
	display       : flex;
	flex-direction: column;

}

.dsb-akar .group_title_bahasa {
	display       : flex;
	flex-direction: column;
	width         : 100%;
	border-bottom : 1px solid rgba(0,0,0,0.06);
}

.dsb-akar .title_daftar_bahasa {
	display       : flex;
	flex-direction: column;
	text-align    : center;
	font-size     : 17px;
	padding-top   : 15px;
	padding-bottom: 15px;
	font-family   : 'Plus Jakarta Sans' !important;
	font-weight   : 800;
	color         : #1a1a2e;
	letter-spacing: -0.2px;
}

.dsb-akar .hidden_svg {
	display: none;
}

.dsb-akar .list_bahasa_item {
	display         : flex;
	flex-direction  : row;
	align-items     : center;
	padding         : 8px 14px;
	cursor          : pointer;
	transition      : all 0.2s ease;
	border-bottom   : 1px solid rgba(0,0,0,0.04);
	gap             : 8px;
}
.dsb-akar .list_bahasa_item:hover {
	background-color: ${bg_color_icon}0a;
}
.dsb-akar .list_bahasa_item:last-child {
	border-bottom: none;
}
.dsb-akar .list_bahasa_flag {
	width          : 22px;
	height         : 22px;
	border-radius  : 22px;
	display        : flex;
	align-items    : center;
	justify-content: center;
	font-size      : 10px;
	font-weight    : 700;
	background     : ${bg_color_icon}12;
	flex-shrink    : 0;
	letter-spacing : 0.5px;
}
.dsb-akar .list_bahasa_text {
	display            : flex;
	flex-direction     : column;
	font-family        : "Plus Jakarta Sans Normal", sans-serif !important;
	font-weight        : 600;
	font-size          : 11px;
	color              : #1a1a2e;
	line-height        : 1.3;
}
.dsb-akar .list_bahasa_text_sub {
	font-size  : 9px;
	color      : #8c8c9e;
	font-weight: 400;
	margin-top : 0px;
}
.dsb-akar .active_bahasa_item {
	background-color: ${bg_color_icon}10;
	border-left     : 2px solid ${bg_color_icon};
}
.dsb-akar .active_bahasa_item .list_bahasa_flag {
	background: ${bg_color_icon};
	color     : white;
}
.dsb-akar .active_bahasa_item .list_bahasa_text {
	color      : ${bg_color_icon};
	font-weight: 700;
}
.dsb-akar .bahasa_check_icon {
	margin-left: auto;
	fill       : ${bg_color_icon};
	display    : none;
}
.dsb-akar .active_bahasa_item .bahasa_check_icon {
	display: flex;
}
/* Aturan Google Translate (body top, .skiptranslate iframe, .goog-te-banner-frame, #goog-gt-tt) dihapus:
   terjemahan widget tidak lagi memakai elemen Google Translate, dan aturan itu menyembunyikan
   Google Translate milik situs serta menggeser body situs. */

.dsb-akar .group_action_setting_layout[aria-expanded=true] .icon_column_layaout_disabilitas {
	transform: rotate(90deg);
}

.dsb-akar .row_data_setting_layout {
	display       : flex;
	flex-direction: column;
    width:100%;
	border-bottom : 1px solid rgba(0,0,0,0.06);
	padding-bottom: 1vh;
	margin-bottom : 6vh;
	direction     : ltr !important;
}

.dsb-akar .group_action_setting_layout {
	width         : max-content;
	display       : flex;
	flex-direction: row;
	padding-bottom: 1vh;
	padding-left  : 15px;
	cursor        : pointer;
}
.dsb-akar .except_group_action_setting_layout{
   margin-left: 2%;
}
.dsb-akar .column_reset_disabilitas_menu {
	display        : flex;
	flex-direction : column;
	align-items    : center;
	justify-content: center;
	width          : 100%;
	height         : 100px;
	margin-bottom  : 2vh;
}

.dsb-akar .column_cek_version_dsb {
	display        : flex;
	flex-direction : column;
	align-items    : center;
	justify-content: center;
	width          : 100%;
	height         : 50px;
	margin-top     : -5vh;
	margin-bottom  : 20vh;
}

.dsb-akar .column_cek_creator {
	display       : flex;
	flex-direction: column;
	font-family   : 'Plus Jakarta Sans' !important;
	font-weight   : bolder;
	font-size     : 8px;
	color         : black;
	margin-left   : 5px;
	height        : max-content;

}

.dsb-akar .row_column_creator {
	display        : flex;
	flex-direction : row;
	width          : 100%;
	overflow       : hidden;
	height         : 20px;
	margin-top     : 7vh;
	margin-bottom  : 6vh;
	justify-content: flex-end;
}

.dsb-akar .creator_widget {
	display       : flex;
	flex-direction: column;
	font-family   : 'Plus Jakarta Sans' !important;
	font-weight   : bold;
	font-size     : 8px;
	color         : grey;
}

.dsb-akar .column_text_cek_version_dsb {
	display       : flex;
	flex-direction: column;
	width         : 90%;
	font-family   : 'Plus Jakarta Sans' !important;
	font-weight   : 600;
	font-size     : 12px;
	color         : #8c8c9e;
	text-align    : center;
	letter-spacing: 0.3px;
}

.dsb-akar .row_persegi_reset {
	display         : flex;
	flex-direction  : row;
	background      : ${bg_color_icon};
	height          : 52px;
	width           : 440px;
	justify-content : center;
	align-items     : center;
	border-radius   : 14px;
	box-shadow      : 0 4px 16px ${bg_color_icon}33, 0 2px 6px rgba(0, 0, 0, 0.08);
	cursor          : pointer;
	transition      : all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dsb-akar .row_persegi_reset:hover {
	transform : translateY(-2px);
	box-shadow: 0 6px 24px ${bg_color_icon}44, 0 4px 10px rgba(0, 0, 0, 0.12);
}
.dsb-akar .row_persegi_reset:active {
	transform: translateY(0px);
}

.dsb-akar .icon_persegi_riset {
	display        : flex;
	flex-direction : column;
	width          : max-content;
	justify-content: flex-start;
	margin-left    : 10px
}

.dsb-akar .column_text_persegi_riset {
	display       : flex;
	flex-direction: column;
	width         : 90%;
	font-family   : 'Plus Jakarta Sans' !important;
	font-weight   : 700;
	font-size     : 14px;
	color         : white;
	letter-spacing: -0.1px;
}

.dsb-akar .circle_aksesbilitas_popup {
	display         : flex;
	flex-direction  : column;
	bottom          : 0;
	z-index         : 999999999999;
	position        : fixed;
	left            : 0;
	background: ${bg_color_icon};
    width: 72px;
    height: 72px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 72px;
    margin-top:0px;
    margin-bottom: 24px;
    margin-left: 24px;
    box-shadow: 0 4px 20px ${bg_color_icon}66, 0 2px 8px rgba(0,0,0,0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: widget_pulse_ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes widget_pulse_ring {
    0%, 100% { box-shadow: 0 4px 20px ${bg_color_icon}66, 0 2px 8px rgba(0,0,0,0.15), 0 0 0 0px ${bg_color_icon}40; }
    50% { box-shadow: 0 4px 20px ${bg_color_icon}66, 0 2px 8px rgba(0,0,0,0.15), 0 0 0 12px ${bg_color_icon}00; }
}

.dsb-akar .circle_right_top_sidebar {
	right        : 0;
	top          : 0;
	margin-left  : 0px !important;
	left         : unset;
	bottom       : unset;
	margin-top   : 20px !important;
	margin-left  : 0px !important;
	margin-bottom: 0px !important;
	margin-right : 20px !important;
}

.dsb-akar .circle_left_top_sidebar {
	top          : 0;
	left         : 0;
	right        : unset;
	bottom       : unset;
	margin-top   : 20px !important;
	margin-left  : 20px !important;
	margin-bottom: 0px !important;
	margin-right : 0px !important;
}

.dsb-akar .circle_right_sidebar {
	right        : 0;
	bottom       : 0;
	left         : unset;
	margin-top   : 0px !important;
	margin-left  : 0px !important;
	margin-bottom: 20px !important;
	margin-right : 20px !important;
}

.dsb-akar .circle_aksesbilitas_2 {
	display         : flex;
	flex-direction  : column;
	background-color: white;
	align-items     : center;
	justify-content : center;
	width           : 58px;
	height          : 58px;
	border-radius   : 58px;
	transition      : all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .circle_aksesbilitas_3 {
	display         : flex;
	flex-direction  : column;
	background: ${bg_color_icon};
	width           : 50px;
	height          : 50px;
	border-radius   : 50px;
	align-items     : center;
	justify-content : center;
	transition      : all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dsb-akar .circle_aksesbilitas_popup:hover {
	width        : 78px;
	height       : 78px;
	border-radius: 78px;
	box-shadow   : 0 6px 28px ${bg_color_icon}88, 0 4px 12px rgba(0,0,0,0.2);
	animation    : none;
	transform    : scale(1.05);
}

.dsb-akar .circle_aksesbilitas_popup:hover .circle_aksesbilitas_2 {
	width        : 64px;
	height       : 64px;
	border-radius: 64px;
}

.dsb-akar .circle_aksesbilitas_popup:hover .circle_aksesbilitas_3 {
	width        : 56px;
	height       : 56px;
	border-radius: 56px;
}

.dsb-akar .svg_icon_popoup_dsb {
	fill: white;
}

:root:not(#dsb_0):not(#dsb_1) .cursor_website_all {
	cursor: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --%3E%3Csvg width='60px' height='60px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath style=' stroke: black; stroke-width: 2;' d='M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z' fill='%23ffffff'/%3E%3C/svg%3E"), pointer !important;

}

.dsb-akar .group_body_bahasa {
	display       : flex;
	flex-direction: column;
}


.change-navbar-website {
	background-color: rgb(0, 0, 0) !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_2_bg_black_yellow {
	background-color: black !important;
	background      : black !important;
	color           : yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_2_bg_href {
	color: #00f3f7 !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_2_bg_black_green {
	background-color: black !important;
	background      : black !important;
	color           : #40C090 !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_2_underline_1 {
	text-decoration      : underline !important;
	text-decoration-color: black !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_2_underline_2 {
	text-decoration      : underline !important;
	background-color     : black !important;
	background           : black !important;
	color                : yellow !important;
	text-decoration-color: yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_2_border {
	border-color: white !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_3_bg_black_yellow {
	background-color: black !important;
	background      : black !important;
	color           : yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_3_underline_1 {
	text-decoration      : underline !important;
	text-decoration-color: yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_3_underline_2 {
	text-decoration      : underline !important;
	text-decoration-color: yellow !important;
	background-color     : black !important;
	background           : black !important;
	color                : yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_4_bg_black_white {
	background-color: white !important;
	background      : white !important;
	color           : black !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_4_underline_1 {
	text-decoration      : underline !important;
	text-decoration-color: yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_4_underline_2 {
	text-decoration      : underline !important;
	text-decoration-color: yellow !important;
	background-color     : black !important;
	background           : black !important;
	color                : yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .kontras_4_border {
	border-color: black !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_column_kiri_widget {
	justify-content: flex-start !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_column_tengah_widget {
	justify-content: center !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_column_kanan_widget {
	justify-content: flex-end !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_text_kiri_widget {
	text-align: left !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_text_tengah_widget {
	text-align: center !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_text_kanan_widget {
	text-align: right !important;
}

:root:not(#dsb_0):not(#dsb_1) .rata_column_kanan_kiri_text_widget {
	text-align     : justify !important;
	text-justify   : inter-word !important;
	justify-content: "" !important;
}

:root:not(#dsb_0):not(#dsb_1) .underline_link_1 {
	text-decoration      : underline !important;
	text-decoration-color: black !important;
}

:root:not(#dsb_0):not(#dsb_1) .underline_link_1_kontras {
	text-decoration      : underline !important;
	text-decoration-color: yellow !important;
}

:root:not(#dsb_0):not(#dsb_1) .underline_link_2 {
	text-decoration      : underline !important;
	text-decoration-color: yellow !important;
	background-color     : black !important;
	background           : black !important;
	color                : yellow !important;
}







.dsb-akar .tooltip_data_move_mouse_new {
	display       : flex;
	visibility    : hidden;
	position      : absolute;
	flex-direction: column;
	z-index       : 999999999999999999999999999;
	text-align    : center !important;
	font-weight   : bold;
	min-width     : 50px !important;
	max-width     : 500px !important;

	border-radius   : 6px !important;
	font-size       : 14px !important;
	background-color: rgba(59, 72, 80, 0.9) !important;
	background-image: linear-gradient(30deg,
			rgba(59, 72, 80, 0.44),
			rgba(59, 68, 75, 0.44),
			rgba(60, 82, 88, 0.44)) !important;
	box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.2) !important;
	color     : #fff !important;
	padding   : 10px 18px;
}

.main_web_ppid_jogja {
	animation-duration: 1.5s !important;
	opacity           : 1 !important;
}

@media screen and (min-device-width: 1200px) and (max-device-width: 1600px) {

	.dsb-akar .group_title_disabilitas {
		height     : 12vh;
		margin-left: 4%;
	}

	.dsb-akar .group_box_content_disabilitas {
		width : 500px;
		height: 88vh;
	}

	.dsb-akar .group_scroll_content {
		width : 500px;
		height: 88vh;
	}
}

@media only screen and (max-width: 900px) {
.dsb-akar .except_group_move_widget {
    background-color: white;
    margin-left: 5px  !important;
    margin-right: 0px;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 14px;
    margin-top: 5px;
    width: 90%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04);
}
.dsb-akar .except_group_action_setting_layout{
   margin-left: 1%  !important;
}

	.dsb-akar .group_action_setting_layout {
		padding-bottom: 2vh;

	}
.dsb-akar .column_cek_version_dsb{
    margin-top: -2vh;
    margin-bottom: 20vh;
}
	.dsb-akar .box_profile_aksesbilitas {
		padding-left   : 2vw;
		justify-content: flex-start;
		width          : 45vw;
	}

	.dsb-akar .except_layout_profile_widget {
		width: 100vw !important;

	}

	.dsb-akar .except_group_scroll_content {
		width: max-content !important;
	}

	.dsb-akar .text_list_content_profile_disabilitas {

		text-align: left;
	}

	.dsb-akar .row_widget_profil_dsb {

		gap: 20px 10px;

	}

	.dsb-akar .layout_settings_widget {

		width: 98vw !important;

	}

	.dsb-akar .layout_profile_widget {

		width: 100vw !important;

	}

	.dsb-akar .display_none_mobile {
		display: none;
	}

	.dsb-akar .circle_aksesbilitas_popup {
		margin-top: 20%;
		width     : 64px;
		height    : 64px;
	}

	.dsb-akar .column_reset_disabilitas_menu {
		width        : 100vw;
		margin-bottom: 1vh;
	}

	.dsb-akar .row_persegi_reset {
		width        : 88vw;
		padding-left : 5%;
		padding-right: 5%;
		border-radius: 14px;
	}

	.dsb-akar .column_text_persegi_riset {
		font-size: 13px;
		width    : 100%;
	}

	.dsb-akar .content_aksesbilitas {
		width: -100vw;
	}

	.dsb-akar .content_daftar_action_disabilitas {
		width       : 98vw;
		padding-left: 0px;
	}

	.dsb-akar .except_content_daftar_action_disabilitas {
		width: 98vw;
	}

	.dsb-akar .box_text_bottom_disabilitas {
		font-size  : 12px;
		line-height: 1.5em;
	}

	.dsb-akar .box_group_disabilitas {
		width: 45vw !important;

	}

	.dsb-akar .active_box_menu_disabilitas {
		width: 45vw !important;
	}

	.dsb-akar .content_aksesbilitas .groupcontenttoolbar {
		transform : translateX(-100vw);
		transition: transform 0.6s;
	}

	.dsb-akar .content_aksesbilitas.new-show-toolbar .groupcontenttoolbar {
		transform: translateX(0vw);

	}

	.dsb-akar .content_aksesbilitas .except_groupcontenttoolbar {
		transform : translateX(0vw) !important;
		transition: transform 0.6s;
	}

	.dsb-akar .content_aksesbilitas.new-show-toolbar .except_groupcontenttoolbar {
		transform: translateX(-100vw) !important;

	}

	.dsb-akar .content_aksesbilitas_utama {
		width                     : 100vw;
		height                    : calc(${pageHeight_website}px + 20vh);
		border-top-right-radius   : 0 !important;
		border-bottom-right-radius: 0 !important;
		border-top-left-radius    : 0 !important;
		border-bottom-left-radius : 0 !important;
	}

	.dsb-akar .layout_bahasa_widget {
		width: 100vw;
		height: auto;
	}

	.dsb-akar .end_title_disabilitas {
		align-items : flex-end;
		width       : 30vw;
		margin-right: 10px;

	}

	.dsb-akar .layout_grid_disabilitas {
		display              : inline-grid;
		grid-template-columns: 1fr 1fr;
		align-items          : center;
		justify-content      : center;
		gap                  : 12px 10px;
	}

	.dsb-akar .group_box_content_disabilitas {
		width        : 100vw;
		height       : calc(${pageHeight_website}px + 10vh);
		border-radius: 0 !important;
	}

	.dsb-akar .group_scroll_content {
		width : 100vw;
		height: 100vh;
	}

	.dsb-akar .box_name_menu_disabilitas {
		text-align : left;
		margin-left: 10px;
		font-size  : 14px;

	}

	.dsb-akar .layout_content_title {

		width: 100%;
	}

	.dsb-akar .row_title_disabilitas {
		width: 100vw;
	}

	.dsb-akar .title_disabilitas {
		width    : max-content;
		font-size: 16px;
	}

	.dsb-akar .start_title_disabilitas {

		width: 60vw;

	}

	.dsb-akar .group_title_disabilitas {
		width      : 100vw;
		height     : 10vh;
		margin-left: 4%;
	}
}

@font-face {
	font-family : 'Atkinson Hyperlegible';
	font-style  : normal;
	font-weight : 400;
	font-display: swap;
	src         : url(https://fonts.gstatic.com/s/atkinsonhyperlegible/v12/9Bt23C1KxNDXMspQ1lPyU89-1h6ONRlW45G04pIo.woff2) format('woff2');
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
	font-family : 'Atkinson Hyperlegible';
	font-style  : normal;
	font-weight : 700;
	font-display: swap;
	src         : url(https://fonts.gstatic.com/s/atkinsonhyperlegible/v12/9Bt73C1KxNDXMspQ1lPyU89-1h6ONRlW45G8Wbc9dCWP.woff2) format('woff2');
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

.dsb-akar #widget_menu_disabilitas,
.dsb-akar #show_menu_dsb_web {
	--dsb-aksen   : ${bg_color_icon};
	--dsb-tinta   : #16203A;
	--dsb-bidang  : #E8ECF2;
	--dsb-pelat   : #FFFFFF;
	--dsb-bingkai : #C9D1DE;
	--dsb-sekunder: #4A5468;
	--dsb-fokus   : #FFC400;
	--dsb-hover      : ${bg_color_icon};
	--dsb-hover-latar: ${bg_color_icon}14;
}

/* Mode kontras tinggi Windows (forced colors) mengganti semua warna latar, sehingga petak / profil / warna yang
   aktif tampak sama dengan yang mati. Bingkai warna sistem Highlight menjadi penanda status aktif di mode itu. */
@media (forced-colors: active) {
	.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas,
	.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas,
	.dsb-akar #widget_menu_disabilitas .dsb_warna_pilih[aria-pressed="true"],
	.dsb-akar #widget_menu_disabilitas .active_bahasa_item,
	.dsb-akar #widget_menu_disabilitas .dsb_posisi_aktif {
		border      : 4px solid Highlight !important;
		outline     : 2px solid Highlight;
		outline-offset: -8px;
	}
}

/* Tombol widget disembunyikan sementara saat menutupi elemen halaman yang sedang difokus (WCAG 2.4.11). */
.dsb-akar #show_menu_dsb_web.dsb_tombol_menepi {
	opacity       : 0 !important;
	pointer-events: none !important;
}

/* Tata letak panel menu: selalu setinggi layar, header tumbuh mengikuti isinya, dan sisa ruang dipakai kotak isi
   yang bisa digulir. Sebelumnya, di layar <= 900 px tinggi panel dihitung dari panjang halaman (mis. 1.858 px di
   halaman panjang), sehingga petak dan tombol bawah (Atur Ulang, Pindahkan Widget) berada di luar layar dan tidak
   terjangkau; header juga terpotong saat diperbesar 200% (WCAG 1.4.4, 1.4.10, 2.1.1). Tinggi minimum header sama
   dengan nilai lama agar tampilan desktop tidak berubah. */
.dsb-akar #widget_menu_disabilitas .content_aksesbilitas_utama {
	height: 100vh !important;
	height: 100dvh !important;
}

.dsb-akar #widget_menu_disabilitas .group_title_disabilitas {
	flex      : 0 0 auto;
	height    : auto !important;
	min-height: 8vh;
}

.dsb-akar #widget_menu_disabilitas .row_title_disabilitas {
	height    : auto !important;
	min-height: 60px;
	overflow  : visible !important;
}

.dsb-akar #widget_menu_disabilitas .group_box_content_disabilitas {
	position      : relative !important;
	display       : flex;
	flex-direction: column;
	flex          : 1 1 auto;
	min-height    : 0;
	height        : auto !important;
	bottom        : auto !important;
}

.dsb-akar #widget_menu_disabilitas .group_scroll_content {
	flex      : 1 1 auto;
	min-height: 0;
	height    : auto !important;
}

@media screen and (min-device-width: 1200px) and (max-device-width: 1600px) {
	.dsb-akar #widget_menu_disabilitas .group_title_disabilitas {
		min-height: 12vh;
	}
}

@media only screen and (max-width: 900px) {
	.dsb-akar #widget_menu_disabilitas .group_title_disabilitas {
		min-height: 10vh;
	}
}

/* Teks khusus pembaca layar (tingkat petak), tidak tampil di layar. */
.dsb-akar .dsb-sr-tingkat {
	position   : absolute !important;
	width      : 1px !important;
	height     : 1px !important;
	margin     : -1px !important;
	padding    : 0 !important;
	border     : 0 !important;
	overflow   : hidden !important;
	clip       : rect(0 0 0 0) !important;
	clip-path  : inset(50%) !important;
	white-space: nowrap !important;
}

/* Sebelumnya dipasang inline dengan !important; sebagai aturan biasa, spasi teks pengguna bisa menimpanya (WCAG 1.4.12). */
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas {
	line-height: 20px;
}

/* iOS Safari (dan Chrome Android) membesarkan teks sendiri saat layar landscape; ukuran teks widget dikunci. */
.dsb-akar {
	-webkit-text-size-adjust: 100%;
	text-size-adjust        : 100%;
}

.dsb-akar #widget_menu_disabilitas,
.dsb-akar #widget_menu_disabilitas * {
	font-family: 'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif !important;
}

.dsb-akar #widget_menu_disabilitas .content_aksesbilitas_utama {
	background: var(--dsb-aksen);
	box-shadow: 0 0 0 1px rgba(22, 32, 58, 0.25), 12px 0 32px rgba(22, 32, 58, 0.22);
}

.dsb-akar #widget_menu_disabilitas .title_disabilitas {
	color         : #FFFFFF;
	font-size     : 20px;
	font-weight   : 700;
	letter-spacing: 0;
	text-shadow   : none;
}

.dsb-akar #widget_menu_disabilitas .box_circle_disabilitas {
	width          : 36px;
	height         : 36px;
	padding        : 0;
	border-radius  : 10px;
	background     : var(--dsb-pelat);
	backdrop-filter: none;
	transition     : background-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .box_circle_disabilitas:hover {
	background: var(--dsb-hover);
	transform : none;
}

.dsb-akar #widget_menu_disabilitas .box_circle_disabilitas .icon_x_svg_color {
	fill: var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .box_circle_disabilitas:hover .icon_x_svg_color {
	fill: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .group_box_content_disabilitas {
	background-color: var(--dsb-bidang);
	background-image: none;
}

.dsb-akar #widget_menu_disabilitas .layout_content_title {
	padding      : 0;
	background   : var(--dsb-pelat);
	border-bottom: 1px solid var(--dsb-bingkai);
}

.dsb-akar #widget_menu_disabilitas .group_row_widget_dsb {
	width: 100%;
}

.dsb-akar #widget_menu_disabilitas .box_button_switch {
	display: none;
}

.dsb-akar #widget_menu_disabilitas .group_action_bahasa,
.dsb-akar #widget_menu_disabilitas .group_action_setting_layout {
	box-sizing : border-box;
	width      : 100%;
	min-height : 64px;
	padding    : 10px 16px 10px 18px;
	align-items: center;
	gap        : 14px;
	transition : background-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .group_action_bahasa:hover,
.dsb-akar #widget_menu_disabilitas .group_action_setting_layout:hover {
	background-color: var(--dsb-hover-latar);
}

.dsb-akar #widget_menu_disabilitas .group_action_bahasa[aria-expanded="true"],
.dsb-akar #widget_menu_disabilitas .group_action_setting_layout[aria-expanded="true"] {
	background-color: var(--dsb-bidang);
	box-shadow      : inset 4px 0 0 var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .row_data_widget {
	flex           : 1;
	min-width      : 0;
	margin-left    : 0;
	align-items    : center;
	justify-content: space-between;
	gap            : 10px;
	color          : var(--dsb-tinta);
}

.dsb-akar #widget_menu_disabilitas .text_column_layaout_disabilitas {
	min-width : 0;
	text-align: left;
}

.dsb-akar #widget_menu_disabilitas .dsb_baris_judul {
	color      : var(--dsb-tinta);
	font-size  : 15px;
	font-weight: 700;
	line-height: 1.3;
}

.dsb-akar #widget_menu_disabilitas .dsb_baris_nilai {
	margin-top : 2px;
	color      : var(--dsb-sekunder);
	font-size  : 13px;
	font-weight: 400;
	line-height: 1.35;
}

.dsb-akar #widget_menu_disabilitas .icon_column_layaout_disabilitas {
	flex-shrink  : 0;
	width        : 28px;
	height       : 28px;
	margin       : 0;
	border-radius: 8px;
	color        : var(--dsb-sekunder);
	transition   : transform 0.2s ease;
}

.dsb-akar #widget_menu_disabilitas .icon_column_layaout_disabilitas svg {
	width : 12px !important;
	height: 12px !important;
}

.dsb-akar #widget_menu_disabilitas .box_content_settings {
	flex-shrink: 0;
	width      : 36px;
	height     : 36px;
}

.dsb-akar #widget_menu_disabilitas .box_content_disabilitas,
.dsb-akar #widget_menu_disabilitas .box_content_profile_disabilitas {
	flex-shrink  : 0;
	width        : 36px;
	height       : 36px;
	border-radius: 10px;
	background   : var(--dsb-aksen);
	color        : #FFFFFF;
	box-shadow   : none;
}

.dsb-akar #widget_menu_disabilitas .box_content_disabilitas svg,
.dsb-akar #widget_menu_disabilitas .box_content_profile_disabilitas svg {
	width : 20px !important;
	height: 20px !important;
}

.dsb-akar #widget_menu_disabilitas .layout_bahasa_widget {
	background   : var(--dsb-pelat);
	border-bottom: 1px solid var(--dsb-bingkai);
}

.dsb-akar #widget_menu_disabilitas .group_body_bahasa {
	max-height         : 280px;
	overflow-y         : auto;
	overscroll-behavior: contain;
	scrollbar-width    : thin;
	scrollbar-color    : var(--dsb-aksen) var(--dsb-bidang);
}

.dsb-akar #widget_menu_disabilitas .group_body_bahasa::-webkit-scrollbar {
	width: 8px;
}

.dsb-akar #widget_menu_disabilitas .group_body_bahasa::-webkit-scrollbar-track {
	background: var(--dsb-bidang);
}

.dsb-akar #widget_menu_disabilitas .group_body_bahasa::-webkit-scrollbar-thumb {
	background   : var(--dsb-aksen);
	border-radius: 8px;
}

.dsb-akar #widget_menu_disabilitas .list_bahasa_item {
	padding      : 10px 18px;
	border-bottom: 1px solid var(--dsb-bidang);
	border-left  : 4px solid transparent;
	gap          : 12px;
	transition   : background-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .list_bahasa_item:hover {
	background-color : var(--dsb-hover-latar);
	border-left-color: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .list_bahasa_flag {
	width         : 30px;
	height        : 30px;
	border-radius : 8px;
	background    : var(--dsb-bidang);
	color         : var(--dsb-tinta);
	font-size     : 12px;
	letter-spacing: 0;
}

.dsb-akar #widget_menu_disabilitas .list_bahasa_text {
	align-items: flex-start;
	color      : var(--dsb-tinta);
	font-size  : 15px;
	font-weight: 700;
	text-align : left;
}

.dsb-akar #widget_menu_disabilitas .list_bahasa_text_sub {
	color      : var(--dsb-sekunder);
	font-size  : 13px;
	font-weight: 400;
}

.dsb-akar #widget_menu_disabilitas .active_bahasa_item {
	background-color: var(--dsb-pelat);
	border-left     : 4px solid var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .active_bahasa_item .list_bahasa_flag {
	background: var(--dsb-aksen);
	color     : #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .active_bahasa_item .list_bahasa_text {
	color: var(--dsb-tinta);
}

.dsb-akar #widget_menu_disabilitas .bahasa_check_icon {
	fill: var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:hover {
	background   : var(--dsb-pelat);
	border       : 2px solid var(--dsb-bingkai);
	border-radius: 12px;
	box-shadow   : none;
	transform    : none;
	transition   : background-color 0.15s ease, border-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:hover {
	border-color: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_fill_svg_color_black,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_svg_grey_scale_color_2,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_svg_grey_scale_color_3,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_svg_grey_scale_color_4,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_svg_color,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_contrast {
	fill: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .icon_svg_sroke_color {
	fill  : var(--dsb-hover);
	stroke: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .circle_multi,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:not(.active_box_menu_disabilitas):hover .circle_single {
	stroke: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:hover .box_icon_disabilitas {
	transform: none;
}

.dsb-akar #widget_menu_disabilitas .box_text_bottom_disabilitas,
.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:hover .box_text_bottom_disabilitas {
	color         : var(--dsb-tinta);
	font-size     : 13px;
	font-weight   : 700;
	letter-spacing: 0;
	line-height   : 1.25;
	padding       : 0 6px;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas:hover {
	background  : var(--dsb-aksen);
	border-color: var(--dsb-aksen);
	box-shadow  : inset 0 0 0 2px var(--dsb-aksen), inset 0 0 0 4px rgba(255, 255, 255, 0.9);
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .box_text_bottom_disabilitas,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas:hover .box_text_bottom_disabilitas {
	color: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .box_icon_disabilitas svg {
	filter: invert(1);
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .icon_svg_color,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_svg_color,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .icon_fill_svg_color_black,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_fill_svg_color_black,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .icon_svg_grey_scale_color_1,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_svg_grey_scale_color_1 {
	fill: #000000;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .icon_svg_sroke_color {
	stroke: #000000;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_svg_sroke_color {
	fill  : #000000;
	stroke: #000000;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_svg_grey_scale_color_2 {
	fill: #231F20;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_svg_grey_scale_color_3 {
	fill: #808080;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_icon_svg_grey_scale_color_4 {
	fill: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .circle_multi,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .circle_single,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_circle_multi,
.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .active_circle_single {
	stroke: #000000;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .icon_contrast_black {
	fill  : #000000;
	stroke: #000000;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas .icon_contrast_white {
	fill  : #FFFFFF;
	stroke: #000000;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas [class*="strip_loading_process_v"] {
	background: #FFFFFF;
	opacity   : 1;
	height    : 5px;
}

.dsb-akar #widget_menu_disabilitas .active_box_menu_disabilitas [class*="strip_loading_unprocess_v"] {
	background: #FFFFFF;
	opacity   : 0.35;
	height    : 5px;
}

.dsb-akar #widget_menu_disabilitas .layout_profile_widget {
	box-sizing   : border-box;
	width        : 100% !important;
	background   : var(--dsb-pelat);
	border-bottom: 1px solid var(--dsb-bingkai);
}

.dsb-akar #widget_menu_disabilitas .row_widget_profil_dsb {
	box-sizing           : border-box;
	display              : grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items          : stretch;
	justify-content      : stretch;
	gap                  : 10px;
	width                : 100%;
	margin               : 0;
	padding              : 12px 16px 16px;
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas {
	position       : relative;
	box-sizing     : border-box;
	flex-direction : column;
	align-items    : flex-start;
	justify-content: flex-start;
	gap            : 10px;
	width          : auto;
	min-width      : 0;
	height         : auto;
	min-height     : 0;
	padding        : 12px;
	border         : 1px solid var(--dsb-bingkai);
	border-radius  : 12px;
	background     : var(--dsb-pelat);
	box-shadow     : none;
	transform      : none;
	transition     : background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .icon_list_content_profile_disabilitas {
	flex-shrink     : 0;
	width           : 36px;
	height          : 36px;
	border-radius   : 10px;
	background-color: var(--dsb-bidang);
}

.dsb-akar #widget_menu_disabilitas .icon_list_content_profile_disabilitas svg {
	width : 18px !important;
	height: 18px !important;
}

.dsb-akar #widget_menu_disabilitas .text_list_content_profile_disabilitas {
	box-sizing : border-box;
	width      : 100%;
	min-width  : 0;
	margin-left: 0;
	padding    : 0;
	text-align : left;
}

.dsb-akar #widget_menu_disabilitas .dsb_profil_nama {
	color      : var(--dsb-tinta);
	font-size  : 14px;
	font-weight: 700;
	line-height: 1.3;
}

.dsb-akar #widget_menu_disabilitas .dsb_profil_ket {
	margin-top : 3px;
	color      : var(--dsb-sekunder);
	font-size  : 12px;
	font-weight: 400;
	line-height: 1.4;
}

.dsb-akar #widget_menu_disabilitas .dsb_profil_centang {
	display      : none;
	position     : absolute;
	top          : 10px;
	right        : 10px;
	box-sizing   : border-box;
	width        : 22px !important;
	height       : 22px !important;
	padding      : 3px;
	border-radius: 50%;
	background   : var(--dsb-aksen);
	fill         : #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas:not(.active_box_profile_aksesbilitas):hover {
	background  : var(--dsb-hover-latar);
	border-color: var(--dsb-hover);
	box-shadow  : none;
	transform   : none;
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas:not(.active_box_profile_aksesbilitas):hover .text_list_content_profile_disabilitas {
	color: var(--dsb-tinta);
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas:not(.active_box_profile_aksesbilitas):hover .color_svg_content_profile_disabilitas {
	color: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas:not(.active_box_profile_aksesbilitas):hover .icon_list_content_profile_disabilitas {
	background-color: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas:not(.active_box_profile_aksesbilitas):hover .fill_icon_dsb {
	fill: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas .fill_icon_dsb[fill="none"] {
	fill: none !important;
}

.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas:not(.active_box_profile_aksesbilitas):hover .fill_icon_dsb[fill="none"] {
	color: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas .fill_icon_dsb[fill="none"] {
	color: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas,
.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas:hover {
	background  : var(--dsb-bidang);
	background  : color-mix(in srgb, var(--dsb-aksen) 8%, #FFFFFF);
	border-color: var(--dsb-aksen);
	box-shadow  : inset 0 0 0 1px var(--dsb-aksen);
	transform   : none;
}

.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas .text_list_content_profile_disabilitas,
.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas .dsb_profil_nama {
	color: var(--dsb-tinta);
}

.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas .icon_list_content_profile_disabilitas {
	background-color: var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .active_box_profile_aksesbilitas .dsb_profil_centang {
	display: block;
}

.dsb-akar #widget_menu_disabilitas .row_persegi_reset {
	box-sizing   : border-box;
	max-width    : calc(100% - 32px);
	background   : var(--dsb-pelat);
	border       : 2px solid var(--dsb-tinta);
	border-radius: 12px;
	box-shadow   : none;
	transition   : background-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .row_persegi_reset:hover {
	background  : var(--dsb-hover);
	border-color: var(--dsb-hover);
	box-shadow  : none;
	transform   : none;
}

.dsb-akar #widget_menu_disabilitas .row_persegi_reset .icon_x_svg_color {
	fill: var(--dsb-tinta);
}

.dsb-akar #widget_menu_disabilitas .row_persegi_reset:hover .icon_x_svg_color {
	fill: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .column_text_persegi_riset {
	color      : var(--dsb-tinta);
	font-size  : 15px;
	font-weight: 700;
}

.dsb-akar #widget_menu_disabilitas .row_persegi_reset:hover .column_text_persegi_riset {
	color: #FFFFFF;
}

.dsb-akar #widget_menu_disabilitas .row_data_setting_layout {
	padding-bottom: 0;
	border-top    : 1px solid var(--dsb-bingkai);
	border-bottom : 1px solid var(--dsb-bingkai);
	background    : var(--dsb-pelat);
}

.dsb-akar #widget_menu_disabilitas .group_action_setting_layout:hover .box_content_settings {
	transform: none;
}

.dsb-akar #widget_menu_disabilitas .group_move_widget {
	background   : var(--dsb-pelat);
	border       : 2px solid var(--dsb-bingkai);
	border-radius: 12px;
	box-shadow   : none;
}

.dsb-akar #widget_menu_disabilitas .jarak_radio {
	color      : var(--dsb-tinta);
	font-size  : 14px;
	font-weight: 400;
}

.dsb-akar #widget_menu_disabilitas .radio_widget_dsb {
	border: 2px solid var(--dsb-tinta) !important;
}

.dsb-akar #widget_menu_disabilitas input[checked="checked"].radio_widget_dsb {
	background-color: var(--dsb-aksen) !important;
	border-color    : var(--dsb-aksen) !important;
}

.dsb-akar #widget_menu_disabilitas .column_text_cek_version_dsb {
	color         : var(--dsb-sekunder);
	font-size     : 12px;
	font-weight   : 400;
	letter-spacing: 0;
}

.dsb-akar #show_menu_dsb_web.circle_aksesbilitas_popup,
.dsb-akar #show_menu_dsb_web.circle_aksesbilitas_popup:hover {
	background: var(--dsb-aksen);
	box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px var(--dsb-tinta), 0 6px 18px rgba(22, 32, 58, 0.3);
	animation : none;
	transform : none;
}

.dsb-akar #show_menu_dsb_web .circle_aksesbilitas_3 {
	background: var(--dsb-aksen);
}

/* Cincin fokus dua warna: kuning diapit biru gelap, agar kontrasnya >= 3:1 di latar terang maupun gelap
   (WCAG 1.4.11). Kuning saja hanya ~1,3:1 di atas petak putih. */
.dsb-akar #widget_menu_disabilitas :focus-visible,
.dsb-akar #show_menu_dsb_web:focus-visible {
	outline       : 3px solid var(--dsb-fokus) !important;
	outline-offset: 2px;
	box-shadow    : 0 0 0 2px var(--dsb-tinta), 0 0 0 7px var(--dsb-tinta) !important;
}

@media (prefers-reduced-motion: reduce) {
	.dsb-akar #widget_menu_disabilitas *,
	.dsb-akar #widget_menu_disabilitas .groupcontenttoolbar,
	.dsb-akar #show_menu_dsb_web,
	.dsb-akar #show_menu_dsb_web * {
		transition: none !important;
		animation : none !important;
	}
}

.dsb-akar #widget_menu_disabilitas .group_ltr_content {
	width: 100% !important;
}

.dsb-akar #widget_menu_disabilitas .group_scroll_content {
	height: 100%;
}

.dsb-akar #widget_menu_disabilitas .group_scroll_content.except_group_scroll_content {
	width: 100% !important;
}

.dsb-akar #widget_menu_disabilitas .group_title_disabilitas {
	box-sizing : border-box;
	width      : 100%;
	margin-left: 0;
	padding    : 0 16px 0 22px;
}

.dsb-akar #widget_menu_disabilitas .row_title_disabilitas {
	width: 100%;
	gap  : 12px;
}

.dsb-akar #widget_menu_disabilitas .start_title_disabilitas {
	flex     : 1;
	width    : auto;
	min-width: 0;
}

.dsb-akar #widget_menu_disabilitas .end_title_disabilitas {
	flex        : 0 0 auto;
	width       : auto;
	margin-right: 0;
}

.dsb-akar #widget_menu_disabilitas .dsb_pintasan {
	margin-top : 4px;
	color      : rgba(255, 255, 255, 0.92);
	font-size  : 13px;
	font-weight: 400;
	line-height: 1.4;
}

.dsb-akar #widget_menu_disabilitas .dsb_pintasan kbd {
	display      : inline-block;
	padding      : 0 6px;
	border       : 1px solid rgba(255, 255, 255, 0.6);
	border-radius: 4px;
	/* Lapisan gelap, bukan putih: menggelapkan warna tema menaikkan kontras teks putih untuk semua warna-widget. */
	background   : rgba(0, 0, 0, 0.22);
	box-shadow   : none;
	color        : #FFFFFF;
	font-size    : 12px;
	font-weight  : 700;
	line-height  : 1.6;
}

.dsb-akar #widget_menu_disabilitas .dsb_baris_nilai.dsb_baris_nilai_aktif {
	color      : var(--dsb-aksen);
	font-weight: 700;
}

.dsb-akar #widget_menu_disabilitas .group_action_setting_layout {
	margin-left: 0 !important;
}

.dsb-akar #widget_menu_disabilitas .content_daftar_action_disabilitas {
	box-sizing: border-box;
	width     : 100%;
	padding   : 6px 16px 8px;
}

.dsb-akar #widget_menu_disabilitas .dsb_kelompok_fitur {
	margin-top: 16px;
}

.dsb-akar #widget_menu_disabilitas .dsb_kelompok_judul {
	margin        : 0 2px 8px;
	color         : var(--dsb-sekunder);
	font-size     : 12px;
	font-weight   : 700;
	letter-spacing: 0.06em;
	line-height   : 1.3;
	text-align    : left;
	text-transform: uppercase;
}

.dsb-akar #widget_menu_disabilitas .layout_grid_disabilitas {
	display              : grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	align-items          : stretch;
	justify-content      : stretch;
	gap                  : 10px;
	width                : 100%;
	padding-bottom       : 0;
}

.dsb-akar #widget_menu_disabilitas .box_group_disabilitas {
	box-sizing     : border-box;
	display        : flex;
	flex-direction : column;
	align-items    : stretch;
	justify-content: center;
	width          : auto !important;
	height         : auto;
	min-height     : 104px;
	padding        : 10px 4px 8px;
}

.dsb-akar #widget_menu_disabilitas .box_icon_disabilitas {
	height       : 46px;
	margin-bottom: 6px;
}

.dsb-akar #widget_menu_disabilitas .box_icon_disabilitas svg {
	width : 40px !important;
	height: 40px !important;
}

.dsb-akar #widget_menu_disabilitas .column_reset_disabilitas_menu {
	width : 100%;
	height: auto;
	margin: 20px 0 6px;
}

.dsb-akar #widget_menu_disabilitas .row_persegi_reset {
	box-sizing     : border-box;
	justify-content: center;
	align-items    : center;
	gap            : 10px;
	width          : 100%;
	max-width      : none;
	min-height     : 52px;
	padding        : 10px 16px;
}

.dsb-akar #widget_menu_disabilitas .icon_persegi_riset {
	margin-left: 0;
}

.dsb-akar #widget_menu_disabilitas .column_text_persegi_riset {
	width     : auto;
	text-align: center;
}

.dsb-akar #widget_menu_disabilitas .row_data_setting_layout {
	margin-bottom: 0;
}

.dsb-akar #widget_menu_disabilitas .layout_settings_widget {
	box-sizing : border-box;
	width      : 100% !important;
	margin     : 0;
	padding    : 12px 16px 16px;
	align-items: stretch;
}

.dsb-akar #widget_menu_disabilitas .group_move_widget {
	box-sizing           : border-box;
	display              : grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap                  : 10px;
	width                : 100% !important;
	margin               : 0 !important;
	padding              : 0;
	border               : 0;
	border-radius        : 0;
	background           : transparent;
	box-shadow           : none;
}

.dsb-akar #widget_menu_disabilitas .radio_row_widget {
	box-sizing    : border-box;
	display       : flex;
	flex-direction: column;
	align-items   : center;
	gap           : 10px;
	width         : auto;
	min-width     : 0;
	margin        : 0;
	padding       : 12px 8px 10px;
	border        : 1px solid var(--dsb-bingkai);
	border-radius : 12px;
	background    : var(--dsb-pelat);
	cursor        : pointer;
	transition    : background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .radio_row_widget:hover {
	border-color: var(--dsb-hover);
	background  : var(--dsb-hover-latar);
}

.dsb-akar #widget_menu_disabilitas .radio_row_widget.dsb_posisi_aktif {
	border-color: var(--dsb-aksen);
	background  : var(--dsb-bidang);
	background  : color-mix(in srgb, var(--dsb-aksen) 8%, #FFFFFF);
	box-shadow  : inset 0 0 0 1px var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .dsb_posisi_layar {
	position     : relative;
	box-sizing   : border-box;
	width        : 88px;
	max-width    : 100%;
	height       : 58px;
	border       : 1px solid var(--dsb-bingkai);
	border-radius: 8px;
	background   : var(--dsb-pelat);
	overflow     : hidden;
}

.dsb-akar #widget_menu_disabilitas .dsb_posisi_layar::before {
	content      : "";
	position     : absolute;
	top          : 0;
	right        : 0;
	left         : 0;
	height       : 9px;
	border-bottom: 1px solid var(--dsb-bingkai);
	background   : var(--dsb-bidang);
}

.dsb-akar #widget_menu_disabilitas .dsb_posisi_layar::after {
	content      : "";
	position     : absolute;
	top          : 18px;
	right        : 24px;
	left         : 24px;
	height       : 4px;
	border-radius: 2px;
	background   : var(--dsb-bidang);
	box-shadow   : 0 9px 0 var(--dsb-bidang), 0 18px 0 var(--dsb-bidang);
}

.dsb-akar #widget_menu_disabilitas .dsb_posisi_titik {
	position     : absolute;
	width        : 12px;
	height       : 12px;
	border-radius: 50%;
	background   : var(--dsb-sekunder);
	transition   : background-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .dsb_titik_kiri_atas {
	top : 15px;
	left: 6px;
}

.dsb-akar #widget_menu_disabilitas .dsb_titik_kanan_atas {
	top  : 15px;
	right: 6px;
}

.dsb-akar #widget_menu_disabilitas .dsb_titik_kiri_bawah {
	bottom: 6px;
	left  : 6px;
}

.dsb-akar #widget_menu_disabilitas .dsb_titik_kanan_bawah {
	right : 6px;
	bottom: 6px;
}

.dsb-akar #widget_menu_disabilitas .radio_row_widget:hover .dsb_posisi_titik {
	background: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .radio_row_widget.dsb_posisi_aktif .dsb_posisi_titik {
	background: var(--dsb-aksen);
	/* Cadangan untuk Safari < 16.2 (belum mengenal color-mix). */
	box-shadow: 0 0 0 3px ${bg_color_icon}40;
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsb-aksen) 25%, transparent);
}

.dsb-akar #widget_menu_disabilitas .dsb_posisi_pilihan {
	display        : flex;
	flex-direction : row;
	align-items    : center;
	justify-content: center;
	gap            : 8px;
	max-width      : 100%;
}

.dsb-akar #widget_menu_disabilitas .jarak_kanan_radio {
	flex       : 0 0 auto;
	width      : auto;
	align-items: center;
}

.dsb-akar #widget_menu_disabilitas .radio_widget_dsb {
	flex-shrink: 0;
	margin     : 0;
}

.dsb-akar #widget_menu_disabilitas .jarak_radio {
	width      : auto;
	min-width  : 0;
	margin-left: 0;
	color      : var(--dsb-tinta);
	font-size  : 14px;
	font-weight: 600;
	line-height: 1.3;
	text-align : left;
}

.dsb-akar #widget_menu_disabilitas .column_cek_version_dsb {
	box-sizing: border-box;
	height    : auto;
	margin    : 0 0 28px;
	padding   : 16px 16px 0;
}

.dsb-akar #widget_menu_disabilitas .column_text_cek_version_dsb {
	width         : auto;
	color         : var(--dsb-sekunder);
	font-size     : 12px;
	font-weight   : 500;
	letter-spacing: 0.02em;
}

@media only screen and (max-width: 900px) {
	.dsb-akar #widget_menu_disabilitas .title_disabilitas {
		font-size: 18px;
	}

	.dsb-akar #widget_menu_disabilitas .content_daftar_action_disabilitas {
		width        : 100%;
		padding-left : 12px;
		padding-right: 12px;
	}

	.dsb-akar #widget_menu_disabilitas .layout_grid_disabilitas {
		gap: 8px;
	}

	.dsb-akar #widget_menu_disabilitas .box_group_disabilitas {
		min-height: 98px;
	}

	.dsb-akar #widget_menu_disabilitas .box_group_disabilitas.display_none_mobile {
		display: none;
	}

	.dsb-akar #widget_menu_disabilitas .box_text_bottom_disabilitas,
	.dsb-akar #widget_menu_disabilitas .box_group_disabilitas:hover .box_text_bottom_disabilitas {
		font-size  : 12.5px;
		line-height: 1.25;
	}

	.dsb-akar #widget_menu_disabilitas .row_widget_profil_dsb {
		gap    : 8px;
		padding: 12px;
	}

	.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas {
		padding: 10px;
	}

	.dsb-akar #widget_menu_disabilitas .box_profile_aksesbilitas.display_none_mobile {
		display: none;
	}

	.dsb-akar #widget_menu_disabilitas .layout_settings_widget {
		padding-right: 12px;
		padding-left : 12px;
	}

	.dsb-akar #widget_menu_disabilitas .group_move_widget {
		gap: 8px;
	}

	.dsb-akar #widget_menu_disabilitas .column_cek_version_dsb {
		margin-bottom: calc(28px + 8vh);
	}
}

@media only screen and (min-width: 600px) and (max-width: 900px) {
	.dsb-akar #widget_menu_disabilitas .layout_grid_disabilitas {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.dsb-akar #widget_menu_disabilitas .group_move_widget {
		max-width: 440px;
		margin   : 0 auto !important;
	}
}

@media only screen and (max-width: 359px) {
	.dsb-akar #widget_menu_disabilitas .layout_grid_disabilitas {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (hover: none) and (pointer: coarse) {
	.dsb-akar #widget_menu_disabilitas .dsb_pintasan {
		display: none;
	}
}

html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) h1:not(.dsb-akar *),
html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) h2:not(.dsb-akar *),
html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) h3:not(.dsb-akar *),
html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) h4:not(.dsb-akar *),
html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) h5:not(.dsb-akar *),
html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) h6:not(.dsb-akar *),
html.dsb-sorot-judul:not(#dsb_0):not(#dsb_1) [role="heading"]:not(.dsb-akar *) {
	outline         : 3px solid ${bg_color_icon} !important;
	outline-offset  : 3px !important;
	background-color: ${bg_color_icon}14 !important;
}

html.dsb-sorot-fokus:not(#dsb_0):not(#dsb_1) *:focus-visible:not(.dsb-akar *) {
	outline       : 4px solid #FFC400 !important;
	outline-offset: 2px !important;
	box-shadow    : 0 0 0 7px #16203A !important;
}

html.dsb-teks-tebal:not(#dsb_0):not(#dsb_1) body *:not(i):not(svg):not(svg *):not([class*="fa-"]):not([class*="icon"]):not(.dsb-akar):not(.dsb-akar *) {
	font-weight: 700 !important;
}

html.dsb-spasi-kata-1:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	word-spacing: 0.16em !important;
}

html.dsb-spasi-kata-2:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	word-spacing: 0.32em !important;
}

html.dsb-spasi-kata-3:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	word-spacing: 0.5em !important;
}

/* Animasi Dijeda: satu kelas di <html>; berlaku juga untuk elemen yang muncul belakangan dan ::before / ::after. */
html.dsb-animasi-dijeda:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *),
html.dsb-animasi-dijeda:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *)::before,
html.dsb-animasi-dijeda:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *)::after {
	animation         : none !important;
	animation-duration: 0s !important;
	transition        : none !important;
}

/* ---- Kontras+ (lihat _kontrasCssAktif). Setara tiga ID: menang dari aturan !important situs dan dari
   Pengaturan Warna / Sorot Judul (dua ID), sama seperti dulu ketika warnanya ditulis inline. Daftar :not()
   = elemen widget dan daftar pengecualian _kontrasExclude (hanya elemen itu sendiri, bukan isinya). ---- */
/* Kontras Tinggi: latar hitam, teks hijau, tautan kuning, tepi putih */
html.dsb-kontras-2:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator):not(.border) {
	background-color: black !important;
	background      : black !important;
}
html.dsb-kontras-2:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator) {
	color: #40C090 !important;
}
html.dsb-kontras-2:not(#dsb_0):not(#dsb_1):not(#dsb_2) body a:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator) {
	color: yellow !important;
}
/* .border tanpa atribut style memakai latarnya sendiri; .border ber-style tetap hitam (sama seperti versi sebelumnya). */
html.dsb-kontras-2:not(#dsb_0):not(#dsb_1):not(#dsb_2) body .border[style]:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator) {
	background-color: black !important;
	background      : black !important;
}
/* Latar Gelap: latar hitam, teks kuning, tepi putih */
html.dsb-kontras-3:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator) {
	background-color: black !important;
	background      : black !important;
	color           : yellow !important;
}
html.dsb-kontras-2:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator):not(.fa-search):not(.titletools):not(svg),
html.dsb-kontras-3:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator):not(.fa-search):not(.titletools):not(svg) {
	border-color: white !important;
}
html.dsb-kontras-2:not(#dsb_0):not(#dsb_1):not(#dsb_2) body .close_layout_banner_background,
html.dsb-kontras-3:not(#dsb_0):not(#dsb_1):not(#dsb_2) body .close_layout_banner_background {
	opacity: 1 !important;
}
/* Latar Terang: latar putih, teks hitam; <svg> tanpa latar */
html.dsb-kontras-4:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator):not(svg) {
	background-color: white !important;
	background      : white !important;
}
html.dsb-kontras-4:not(#dsb_0):not(#dsb_1):not(#dsb_2) body *:not(.dsb-akar):not(.dsb-akar *):not(.btn-color-mode-switch-inner):not(.mycheckbox):not(.Vue-Toastification__container):not(.slider-navigation):not(.box_data_permohonan):not(.columncopyright):not(.slick-next):not(.slick-prev):not(.form_all_daftar_menu_permohonan):not(.row_column_creator) {
	color: black !important;
}

/* ---- Rata Tulisan (lihat _perataanAktif). Kontainer flex berarah kolom / terbalik ditandai data-dsb-kolom. ---- */
html.dsb-rata-kiri:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	text-align: left !important;
}
html.dsb-rata-kiri:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *):not([data-dsb-kolom]) {
	justify-content: flex-start !important;
}
html.dsb-rata-tengah:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	text-align: center !important;
}
html.dsb-rata-tengah:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *):not([data-dsb-kolom]) {
	justify-content: center !important;
}
html.dsb-rata-kanan:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	text-align: right !important;
}
html.dsb-rata-kanan:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *):not([data-dsb-kolom]) {
	justify-content: flex-end !important;
}
html.dsb-rata-kanan-kiri:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	text-align  : justify !important;
	text-justify: inter-word !important;
}

html.dsb-deskripsi-gambar:not(#dsb_0):not(#dsb_1) img:not(.dsb-akar *) {
	outline       : 3px solid ${bg_color_icon} !important;
	outline-offset: 2px !important;
}

html.dsb-deskripsi-gambar:not(#dsb_0):not(#dsb_1) img:not([alt]):not([aria-label]):not([aria-labelledby]):not(.dsb-akar *) {
	outline: 3px dashed #d0021b !important;
}

.dsb-akar .dsb_label_gambar {
	position     : fixed;
	z-index      : 2147483647;
	display      : none;
	max-width    : 320px;
	padding      : 8px 10px;
	border-radius: 8px;
	background   : #16203A;
	color        : #FFFFFF;
	font         : 600 14px/1.4 'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif;
	text-align   : left;
	box-shadow   : 0 4px 14px rgba(0, 0, 0, 0.3);
	pointer-events: none;
	word-wrap    : break-word;
}

.dsb-akar .dsb_label_gambar.dsb_label_gambar_kosong {
	background: #B00016;
}

html.dsb-warna-teks:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	color: var(--dsb-warna-teks) !important;
}

html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h1:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h2:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h3:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h4:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h5:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h6:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body [role="heading"]:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h1 *:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h2 *:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h3 *:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h4 *:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h5 *:not(.dsb-akar):not(.dsb-akar *),
html.dsb-warna-judul:not(#dsb_0):not(#dsb_1) body h6 *:not(.dsb-akar):not(.dsb-akar *) {
	color: var(--dsb-warna-judul) !important;
}

html.dsb-warna-latar:not(#dsb_0):not(#dsb_1) body,
html.dsb-warna-latar:not(#dsb_0):not(#dsb_1) body *:not(.dsb-akar):not(.dsb-akar *) {
	background-color: var(--dsb-warna-latar) !important;
}

.dsb-akar .dsb_warna_isi {
	display       : flex;
	flex-direction: column;
	padding       : 4px 0 10px;
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_kelompok {
	padding: 8px 18px;
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_judul {
	margin-bottom: 8px;
	color        : var(--dsb-tinta);
	font-size    : 13px;
	font-weight  : 700;
	text-align   : left;
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_baris {
	display    : flex;
	flex-wrap  : wrap;
	align-items: center;
	gap        : 8px;
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_pilih {
	display        : flex;
	align-items    : center;
	justify-content: center;
	min-width      : 36px;
	height         : 36px;
	margin         : 0;
	padding        : 3px;
	border         : 2px solid var(--dsb-bingkai);
	border-radius  : 999px;
	background     : var(--dsb-pelat);
	color          : var(--dsb-tinta);
	font-size      : 12px;
	font-weight    : 700;
	cursor         : pointer;
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_pilih:hover {
	border-color: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_pilih[aria-pressed="true"] {
	border-color: var(--dsb-aksen);
	box-shadow  : 0 0 0 2px var(--dsb-aksen);
}

.dsb-akar #widget_menu_disabilitas .dsb_warna_bawaan {
	padding: 0 12px;
}

/* Tepi bulatan cukup gelap (~4,7:1 di atas putih) agar pilihan warna terang seperti Putih / Krem tetap
   terlihat (WCAG 1.4.11). forced-color-adjust: none menjaga contoh warna tetap tampil di mode kontras
   tinggi Windows, yang biasanya mengganti semua warna latar. */
.dsb-akar #widget_menu_disabilitas .dsb_warna_bulat {
	display            : block;
	width              : 26px;
	height             : 26px;
	border             : 1px solid rgba(0, 0, 0, 0.55);
	border-radius      : 999px;
	forced-color-adjust: none;
}

.dsb-akar #widget_menu_disabilitas .dsb_pernyataan {
	display        : block;
	margin         : 12px auto 0;
	color          : var(--dsb-aksen);
	font-size      : 14px;
	font-weight    : 700;
	text-align     : center;
	text-decoration: underline;
}

a.dsb-lewati.dsb-lewati {
	position       : fixed !important;
	top            : -200px !important;
	left           : 50% !important;
	z-index        : 2147483647 !important;
	transform      : translateX(-50%) !important;
	/* Boleh turun baris: di layar 320 px dengan spasi huruf pengguna, teks satu baris akan terpotong (WCAG 1.4.10 / 1.4.12). */
	white-space    : normal !important;
	width          : max-content !important;
	max-width      : calc(100vw - 32px) !important;
	text-align     : center !important;
	padding        : 10px 16px !important;
	border-radius  : 8px !important;
	background     : #16203A !important;
	color          : #FFFFFF !important;
	font           : 700 16px/1.3 'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif !important;
	text-decoration: none !important;
	box-shadow     : 0 4px 14px rgba(0, 0, 0, 0.3) !important;
}

a.dsb-lewati.dsb-lewati:focus {
	top           : 8px !important;
	outline       : 3px solid #FFC400 !important;
	outline-offset: 2px !important;
}

.dsb-baca-sorot:not(.dsb-akar *) {
	outline         : 3px solid #FFC400 !important;
	outline-offset  : 3px !important;
	background-color: rgba(255, 196, 0, 0.2) !important;
}

.dsb-akar .dsb_pemutar {
	position     : fixed;
	left         : 50%;
	bottom       : 16px;
	z-index      : 2147483646;
	display      : none;
	align-items  : center;
	gap          : 6px;
	padding      : 8px 10px;
	border-radius: 14px;
	background   : #16203A;
	color        : #FFFFFF;
	box-shadow   : 0 6px 20px rgba(0, 0, 0, 0.35);
	font         : 600 14px/1.3 'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif;
	transform    : translateX(-50%);
}

.dsb-akar .dsb_pemutar.dsb_pemutar_tampil {
	display: flex;
}

.dsb-akar .dsb_pemutar_status {
	padding    : 0 8px;
	white-space: nowrap;
}

.dsb-akar .dsb_pemutar .dsb_pemutar_tombol {
	display        : flex;
	align-items    : center;
	justify-content: center;
	width          : 40px;
	height         : 40px;
	margin         : 0;
	padding        : 0;
	border         : 0;
	border-radius  : 10px;
	background     : rgba(255, 255, 255, 0.14);
	color          : #FFFFFF;
	cursor         : pointer;
}

.dsb-akar .dsb_pemutar .dsb_pemutar_tombol:hover {
	background: ${bg_color_icon};
}

.dsb-akar .dsb_pemutar .dsb_pemutar_tombol svg {
	fill: currentColor;
}

.dsb-akar .dsb_pemutar .dsb_pemutar_tombol:focus-visible {
	outline       : 3px solid #FFC400;
	outline-offset: 2px;
}

/* Safari < 15.4 belum mengenal :focus-visible; tanpa cadangan ini cincin fokus dan Sorot Fokus tidak tampil. */
@supports not selector(:focus-visible) {
	.dsb-akar #widget_menu_disabilitas :focus,
	.dsb-akar #show_menu_dsb_web:focus {
		outline       : 3px solid var(--dsb-fokus) !important;
		outline-offset: 2px;
		box-shadow    : 0 0 0 2px var(--dsb-tinta), 0 0 0 7px var(--dsb-tinta) !important;
	}

	html.dsb-sorot-fokus:not(#dsb_0):not(#dsb_1) *:focus:not(.dsb-akar *) {
		outline       : 4px solid #FFC400 !important;
		outline-offset: 2px !important;
		box-shadow    : 0 0 0 7px #16203A !important;
	}

	.dsb-akar .dsb_pemutar .dsb_pemutar_tombol:focus {
		outline       : 3px solid #FFC400;
		outline-offset: 2px;
	}
}

@media only screen and (max-width: 900px) {
	.dsb-akar .dsb_pemutar {
		bottom: 96px;
	}
}

.dsb-struktur-sasaran:not(.dsb-akar *) {
	outline       : 4px solid #FFC400 !important;
	outline-offset: 4px !important;
}

.dsb-akar .dsb_struktur_isi {
	display       : flex;
	flex-direction: column;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_kelompok {
	padding       : 10px 18px 6px;
	color         : var(--dsb-sekunder);
	font-size     : 12px;
	font-weight   : 700;
	letter-spacing: 0.04em;
	text-align    : left;
	text-transform: uppercase;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_item {
	display      : flex;
	align-items  : center;
	gap          : 10px;
	padding      : 8px 18px;
	border-bottom: 1px solid var(--dsb-bidang);
	border-left  : 4px solid transparent;
	cursor       : pointer;
	transition   : background-color 0.15s ease;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_item:hover {
	background-color : var(--dsb-hover-latar);
	border-left-color: var(--dsb-hover);
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_item[data-tingkat="3"] {
	padding-left: 30px;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_item[data-tingkat="4"] {
	padding-left: 42px;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_item[data-tingkat="5"],
.dsb-akar #widget_menu_disabilitas .dsb_struktur_item[data-tingkat="6"] {
	padding-left: 54px;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_tanda {
	display        : flex;
	flex-shrink    : 0;
	align-items    : center;
	justify-content: center;
	min-width      : 32px;
	height         : 24px;
	padding        : 0 6px;
	border-radius  : 6px;
	background     : var(--dsb-bidang);
	color          : var(--dsb-tinta);
	font-size      : 12px;
	font-weight    : 700;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_teks {
	display           : -webkit-box;
	overflow          : hidden;
	color             : var(--dsb-tinta);
	font-size         : 14px;
	line-height       : 1.3;
	text-align        : left;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.dsb-akar #widget_menu_disabilitas .dsb_struktur_kosong {
	padding    : 14px 18px;
	color      : var(--dsb-sekunder);
	font-size  : 14px;
	text-align : left;
}
`;

    _widgetStorage.removeItem("permismobile");
    _widgetStorage.removeItem("permisvoice");

    var audio;
    var action_text_besar = [];
    var action_text_kecil = [];
    var action_contrash_widget = [];
    var action_tooltip_widget = [];
    var action_perataan_text_widget = [];
    var action_line_height_text_widget = [];
    var action_space_text_widget = [];
    var action_kursor_widget = [];
    var action_garis_bawahi_tautan_widget = [];
    var cek_action_sound_search = [];
    var funky = null;

    var _widgetFunkyDomBerubah = false;
    var _widgetFunkyObserver = null;

    function _widgetFunkyMilikWidget(node) {
        var el = null;
        if (node) {
            el = node.nodeType === 1 ? node : node.parentElement;
        }
        return (
            !!el &&
            _widgetAkar().some(function (akar) {
                return akar.contains(el);
            })
        );
    }

    function _widgetFunkyAmati(aktif) {
        if (!window.MutationObserver || !document.body) return;
        if (!aktif) {
            if (_widgetFunkyObserver) _widgetFunkyObserver.disconnect();
            return;
        }
        if (!_widgetFunkyObserver) {
            _widgetFunkyObserver = new MutationObserver(function (mutations) {
                if (_widgetFunkyDomBerubah) return;
                for (const mutation of mutations) {
                    var added = mutation.addedNodes;
                    if (!added?.length) continue;
                    if (_widgetFunkyMilikWidget(mutation.target)) continue;
                    for (const addedItem of added) {
                        if (addedItem.nodeType === 1) {
                            _widgetFunkyDomBerubah = true;
                            return;
                        }
                    }
                }
            });
        }
        try {
            _widgetFunkyObserver.observe(document.body, { childList: true, subtree: true });
        } catch (e) {
        }
    }

    function _widgetFunkyPerluJalan() {
        if (!window.MutationObserver) return true;
        if (_widgetFunkyDomBerubah) {
            _widgetFunkyDomBerubah = false;
            return true;
        }
        return false;
    }
    var action_tulisan_dibaca = [];
    var action_grey_scale_widget = [];

    var head = document.head || document.getElementsByTagName("head")[0];

    if (!_jqLayak(window.jQuery)) {
        var script_jquery = document.createElement("script");
        script_jquery.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
        script_jquery.type = "text/javascript";
        script_jquery.integrity = "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=";
        script_jquery.crossOrigin = "anonymous";
        script_jquery.onload = function () {
            try {
                var _jqFallback = window.jQuery;
                if (_jqFallback && typeof _jqFallback.noConflict === "function") {
                    _jqWidget = _jqFallback;
                    _jqFallback.noConflict(true);
                    if (typeof window.jQuery !== "function") {
                        window.jQuery = _jqFallback;
                    }
                }
            } catch (e) {
                // Gagal noConflict tidak fatal: widget tetap memakai jQuery global yang ada.
            }
        };
        document.body.appendChild(script_jquery);
    }

    var api_key_revoice = "";
    if (cek_attr_resvoice[0]) {
        api_key_revoice = cek_attr_resvoice[0];
        var script_voice = document.createElement("script");
        script_voice.src =
            "https://code.responsivevoice.org/responsivevoice.js?key=" + encodeURIComponent(api_key_revoice);
        script_voice.type = "text/javascript";
        document.body.appendChild(script_voice);
    }

    // GSAP tidak lagi dimuat: dulu hanya dipakai untuk menggeser garis Baca Panduan, padahal memuatnya menimpa
    // window.gsap / TweenMax / TweenLite milik situs (plugin GSAP situs yang sudah didaftarkan ikut hilang).

    function _bungkamGagalFetchAnalitik(e) {
        var alasan = e.reason;
        if (!(alasan instanceof TypeError)) return;
        if (!/Failed to fetch|NetworkError when attempting to fetch resource|Load failed/.test(alasan.message)) return;
        if (String(alasan.stack).includes("googletagmanager.com/gtag/js")) e.preventDefault();
    }
    window.addEventListener("unhandledrejection", _bungkamGagalFetchAnalitik);

    var script_google_anal = document.createElement("script");
    script_google_anal.src = "https://www.googletagmanager.com/gtag/js?id=UA-96355266-1";
    script_google_anal.type = "text/javascript";
    document.body.appendChild(script_google_anal);

    var script_google_anal_v2 = document.createElement("script");
    script_google_anal_v2.src = "https://www.googletagmanager.com/gtag/js?id=G-SJLG49CX7N";
    script_google_anal_v2.type = "text/javascript";
    document.body.appendChild(script_google_anal_v2);

    var _DAFTAR_BAHASA_WIDGET = [
        { kode: "id", label: "ID", nama: "Bahasa Indonesia", sub: "Indonesian" },
        { kode: "en", label: "EN", nama: "English", sub: "Inggris" },
        { kode: "zh-CN", label: "ZH", nama: "\u4e2d\u6587 (\u7b80\u4f53)", sub: "Mandarin" },
        { kode: "ja", label: "JA", nama: "\u65e5\u672c\u8a9e", sub: "Jepang" },
        { kode: "ko", label: "KO", nama: "\ud55c\uad6d\uc5b4", sub: "Korea" },
        { kode: "ar", label: "AR", nama: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", sub: "Arab" },
        { kode: "es", label: "ES", nama: "Espa\u00f1ol", sub: "Spanyol" },
        { kode: "fr", label: "FR", nama: "Fran\u00e7ais", sub: "Prancis" },
        { kode: "de", label: "DE", nama: "Deutsch", sub: "Jerman" },
        { kode: "ru", label: "RU", nama: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", sub: "Rusia" },
    ];
    for (const _bahasa of _DAFTAR_BAHASA_WIDGET) {
        _bahasa.idElemen = "bahasa_item_" + _bahasa.label.toLowerCase();
    }

    var _SUARA_BAHASA = {
        id: ["id-ID", "Indonesian Female"],
        en: ["en-US", "US English Female"],
        "zh-CN": ["zh-CN", "Chinese Female"],
        ja: ["ja-JP", "Japanese Female"],
        ko: ["ko-KR", "Korean Female"],
        ar: ["ar-SA", "Arabic Female"],
        es: ["es-ES", "Spanish Female"],
        fr: ["fr-FR", "French Female"],
        de: ["de-DE", "Deutsch Female"],
        ru: ["ru-RU", "Russian Female"],
    };

    function _bahasaSuaraHalaman() {
        return _SUARA_BAHASA[widget_current_lang] ? widget_current_lang : "id";
    }

    function _suaraBahasa(kode) {
        return _SUARA_BAHASA[kode] || _SUARA_BAHASA.id;
    }

    function _bahasaWidget(kode) {
        return (
            _DAFTAR_BAHASA_WIDGET.find(function (b) {
                return b.kode === kode;
            }) || null
        );
    }

    function _tampilkanNilaiBaris(id, teks, aktif) {
        var el = _widgetCari("#" + id);
        if (!el) return;
        el.textContent = teks;
        el.classList.toggle("dsb_baris_nilai_aktif", !!aktif);
    }

    function _tampilkanNilaiBahasa(kode) {
        var b = _bahasaWidget(kode) || _bahasaWidget("id");
        _tampilkanNilaiBaris("text_name_bahasa_widget", b.nama, b.kode !== "id");
    }

    function _tampilkanNilaiProfil(nama) {
        _tampilkanNilaiBaris(
            "text_name_profile_widget",
            nama ? "Aktif: " + nama : "Pilih profil sesuai kebutuhan",
            !!nama
        );
    }

    function _htmlDaftarBahasa() {
        return _DAFTAR_BAHASA_WIDGET
            .map(function (b) {
                var aktif = b.kode === "id" ? " active_bahasa_item" : "";
                var langSub = b.kode === "id" ? "en" : "id";
                return `<div class="list_bahasa_item${aktif}" id="${b.idElemen}" data-lang="${b.kode}" lang="${b.kode}">
                            <div class="list_bahasa_flag">${b.label}</div>
                            <div class="list_bahasa_text">
                                ${b.nama}
                                <span class="list_bahasa_text_sub" lang="${langSub}">${b.sub}</span>
                            </div>
                            <svg class="bahasa_check_icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>`;
            })
            .join("\n                        ");
    }

    var widget_current_lang = _bahasaWidget(_widgetStorage.getItem("widget_lang"))
        ? _widgetStorage.getItem("widget_lang")
        : "id";
    var _widgetTranslateObserver = null;
    var _widgetTranslateObserverDebounce = null;
    var _widgetTranslateCache = {};
    var _widgetTranslatePendingNodes = {};
    var _widgetTranslateQueue = [];
    var _widgetTranslateInFlight = 0;
    var _widgetTrackedTextNodes = [];
    var _widgetTranslateSession = 0;
    var _widgetTranslateMaxConcurrent = 3;

    function _widgetNormalizeText(value) {
        return (value || "").replace(/\s+/g, " ").trim();
    }

    function _widgetGetTextEdges(value = "") {
        var source = value;
        var leading = source.slice(0, source.length - source.trimStart().length);
        var trailing = source.slice(source.trimEnd().length);
        return {
            leading: leading,
            trailing: trailing,
        };
    }

    var _WIDGET_TRANSLATE_SKIP_SELECTOR =
        '.dsb-akar #widget_menu_disabilitas, .dsb-akar .circle_aksesbilitas_popup, #google_translate_element_dsb, .skiptranslate, .goog-te-banner-frame, [translate="no"], .notranslate';
    var _WIDGET_TRANSLATE_SKIP_TAG =
        /^(SCRIPT|STYLE|NOSCRIPT|IFRAME|SVG|PATH|TEXTAREA|INPUT|SELECT|OPTION|META|LINK|HEAD)$/i;

    function _widgetShouldSkipTranslateElement(el) {
        if (!el?.tagName) return true;
        if (el.closest(_WIDGET_TRANSLATE_SKIP_SELECTOR)) {
            return true;
        }
        if (el.isContentEditable) return true;
        return _WIDGET_TRANSLATE_SKIP_TAG.test(el.tagName);
    }

    function _widgetTeksLayakDiterjemahkan(value) {
        var normalized = _widgetNormalizeText(value);
        if (!normalized || normalized.length < 2) return false;
        if (!/[A-Za-z]/.test(normalized)) return false;
        return true;
    }

    function _widgetShouldTranslateTextNode(node) {
        if (node?.nodeType !== 3 || !node.parentElement) return false;
        if (_widgetShouldSkipTranslateElement(node.parentElement)) return false;
        return _widgetTeksLayakDiterjemahkan(node.nodeValue);
    }

    function _widgetShouldTranslateTextNodeTersaring(node) {
        var el = node.parentElement;
        if (!el?.tagName) return false;
        if (el.isContentEditable) return false;
        if (_WIDGET_TRANSLATE_SKIP_TAG.test(el.tagName)) return false;
        return _widgetTeksLayakDiterjemahkan(node.nodeValue);
    }

    var _widgetPakaiWeakRef = typeof WeakRef === "function";

    function _widgetTrackedNode(entri) {
        return _widgetPakaiWeakRef ? entri.deref() : entri;
    }

    function _widgetRememberTextNode(node) {
        if (!node.__widgetOriginalTextCaptured) {
            node.__widgetOriginalTextCaptured = true;
            node.__widgetOriginalText = node.nodeValue;
            _widgetTrackedTextNodes.push(_widgetPakaiWeakRef ? new WeakRef(node) : node);
        }
        return node.__widgetOriginalText || node.nodeValue;
    }

    function _widgetPruneTrackedTextNodes() {
        if (!_widgetPakaiWeakRef) return;
        var hidup = [];
        for (const _widgetTrackedTextNode of _widgetTrackedTextNodes) {
            if (_widgetTrackedTextNode.deref()) hidup.push(_widgetTrackedTextNode);
        }
        _widgetTrackedTextNodes = hidup;
    }

    function _widgetIsNodeInsideRoot(node, root) {
        if (!root || !node) return true;
        if (root.nodeType === 3) return node === root;
        if (!root.contains || !node.parentNode) return false;
        return root === node.parentNode || root.contains(node.parentNode);
    }

    function _widgetRestoreOriginalText(root) {
        var tersisa = [];
        for (const entri of _widgetTrackedTextNodes) {
            var node = _widgetTrackedNode(entri);
            if (!node?.isConnected) continue;
            tersisa.push(entri);
            if (!_widgetIsNodeInsideRoot(node, root)) continue;
            if (node.__widgetOriginalTextCaptured) {
                node.nodeValue = node.__widgetOriginalText;
            }
        }
        _widgetTrackedTextNodes = tersisa;
    }

    function _widgetDecodeHtmlEntities(value) {
        var textarea = document.createElement("textarea");
        textarea.innerHTML = value || "";
        return textarea.value;
    }

    function _widgetGetTranslateContact() {
        var host = "";
        try {
            host = (window.location?.hostname || "").toLowerCase();
        } catch (e) {
        }

        host = host.replace(/[^a-z0-9.-]/g, "");
        if (!host?.includes(".")) {
            host = "example.com";
        }

        return "widget-translate@" + host;
    }

    function _widgetCacheBahasa(lang) {
        if (!_widgetTranslateCache[lang]) _widgetTranslateCache[lang] = {};
        return _widgetTranslateCache[lang];
    }

    async function _widgetRequestTranslation(text, lang) {
        var cache = _widgetCacheBahasa(lang);
        if (cache[text] !== undefined) return cache[text];

        var translatedText = text;
        try {
            var response = await fetch(
                "https://api.mymemory.translated.net/get?q=" +
                    encodeURIComponent(text) +
                    "&langpair=id|" +
                    encodeURIComponent(lang) +
                    "&de=" +
                    encodeURIComponent(_widgetGetTranslateContact()),
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                var data = await response.json();
                if (typeof data?.responseData?.translatedText === "string" && data.responseData.translatedText) {
                    translatedText = _widgetDecodeHtmlEntities(data.responseData.translatedText);
                }
            }
        } catch (e) {
            // Layanan terjemahan gagal/offline: biarkan teks asli (translatedText) apa adanya.
        }

        cache[text] = translatedText;
        return translatedText;
    }

    function _widgetApplyTranslatedValue(node, translatedText) {
        if (!node?.isConnected || !node.__widgetOriginalTextCaptured) return;
        var edges = _widgetGetTextEdges(node.__widgetOriginalText);
        var nilaiBaru = edges.leading + translatedText + edges.trailing;
        node.__widgetNilaiTerjemahan = nilaiBaru;
        node.__widgetBahasaTerjemahan = widget_current_lang;
        if (node.nodeValue !== nilaiBaru) {
            node.nodeValue = nilaiBaru;
        }
    }

    function _widgetAmbilNodeMenunggu(kunci) {
        var nodes = _widgetTranslatePendingNodes[kunci] || [];
        delete _widgetTranslatePendingNodes[kunci];
        return nodes;
    }

    function _widgetTerapkanKeNode(nodes, translatedText) {
        for (const node of nodes) {
            if (_widgetShouldTranslateTextNode(node)) {
                _widgetApplyTranslatedValue(node, translatedText);
            }
        }
    }

    function _widgetMintaTerjemahan(item, activeSessionId) {
        _widgetTranslateInFlight++;
        void _widgetRequestTranslation(item.teks, item.lang)
            .then(function (translatedText) {
                var pendingNodes = _widgetAmbilNodeMenunggu(item.kunci);

                if (widget_current_lang !== item.lang || activeSessionId !== _widgetTranslateSession) {
                    return;
                }

                _widgetTerapkanKeNode(pendingNodes, translatedText);
            })
            .finally(function () {
                _widgetTranslateInFlight--;
                _widgetFlushTranslateQueue();
            });
    }

    function _widgetFlushTranslateQueue() {
        while (_widgetTranslateInFlight < _widgetTranslateMaxConcurrent && _widgetTranslateQueue.length > 0) {
            var item = _widgetTranslateQueue.shift();
            var sessionId = _widgetTranslateSession;
            var cache = _widgetCacheBahasa(item.lang);

            if (cache[item.teks] !== undefined) {
                var cachedNodes = _widgetAmbilNodeMenunggu(item.kunci);
                if (widget_current_lang === item.lang && sessionId === _widgetTranslateSession) {
                    _widgetTerapkanKeNode(cachedNodes, cache[item.teks]);
                }
                continue;
            }

            _widgetMintaTerjemahan(item, sessionId);
        }
    }

    function _widgetQueueTranslateNode(node, cabangSudahDisaring) {
        if (
            node?.__widgetNilaiTerjemahan !== undefined &&
            node.nodeValue === node.__widgetNilaiTerjemahan &&
            node.__widgetBahasaTerjemahan === widget_current_lang
        ) {
            return;
        }

        if (cabangSudahDisaring) {
            if (!_widgetShouldTranslateTextNodeTersaring(node)) return;
        } else if (!_widgetShouldTranslateTextNode(node)) return;

        var originalText = _widgetRememberTextNode(node);
        var normalizedText = _widgetNormalizeText(originalText);
        if (!normalizedText) return;

        var lang = widget_current_lang;
        var cache = _widgetCacheBahasa(lang);
        if (cache[normalizedText] !== undefined) {
            _widgetApplyTranslatedValue(node, cache[normalizedText]);
            return;
        }

        var kunci = lang + "|" + normalizedText;
        if (!_widgetTranslatePendingNodes[kunci]) {
            _widgetTranslatePendingNodes[kunci] = [];
            _widgetTranslateQueue.push({ kunci: kunci, lang: lang, teks: normalizedText });
        }
        _widgetTranslatePendingNodes[kunci].push(node);
        _widgetFlushTranslateQueue();
    }

    function _widgetTranslateRoot(root) {
        if (!root) return;

        if (root.nodeType === 3) {
            _widgetQueueTranslateNode(root);
            return;
        }

        if (root.nodeType === 1 && root.closest(_WIDGET_TRANSLATE_SKIP_SELECTOR)) return;

        var walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (node.nodeType === 3) return NodeFilter.FILTER_ACCEPT;
                    return node.matches(_WIDGET_TRANSLATE_SKIP_SELECTOR)
                        ? NodeFilter.FILTER_REJECT
                        : NodeFilter.FILTER_SKIP;
                },
            },
            false
        );
        var currentNode;
        while ((currentNode = walker.nextNode())) {
            _widgetQueueTranslateNode(currentNode, true);
        }
    }

    function _ensureWidgetTranslateObserver() {
        if (_widgetTranslateObserver || !window.MutationObserver || !document.body) return;

        _widgetTranslateObserver = new MutationObserver(function (mutations) {
            if (widget_current_lang === "id") return;

            var hasAddedNodes = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    hasAddedNodes = true;
                    break;
                }
            }
            if (!hasAddedNodes) return;

            if (_widgetTranslateObserverDebounce) {
                clearTimeout(_widgetTranslateObserverDebounce);
            }
            _widgetTranslateObserverDebounce = setTimeout(function () {
                _widgetPruneTrackedTextNodes();
                _widgetTranslateRoot(document.body);
            }, 250);
        });

        try {
            _widgetTranslateObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        } catch (e) {
        }
    }

    // <html lang> mengikuti bahasa terjemahan agar pembaca layar memakai logat yang benar (WCAG 3.1.1),
    // lalu dikembalikan ke nilai asli situs saat kembali ke Bahasa Indonesia.
    var _langHalamanAsli = null;

    function _aturLangHalaman(langCode) {
        var html = document.documentElement;
        if (_langHalamanAsli === null) _langHalamanAsli = html.getAttribute("lang") || "";
        if (langCode !== "id") {
            html.setAttribute("lang", langCode);
        } else if (_langHalamanAsli) {
            html.setAttribute("lang", _langHalamanAsli);
        } else {
            html.removeAttribute("lang");
        }
    }

    function triggerGoogleTranslate(langCode) {
        var bahasaSebelumnya = widget_current_lang;
        _widgetStorage.setItem("widget_lang", langCode);
        widget_current_lang = langCode;
        _aturLangHalaman(langCode);
        _widgetTranslateSession++;
        _ensureWidgetTranslateObserver();

        if (langCode === "id" || (bahasaSebelumnya !== langCode && bahasaSebelumnya !== "id")) {
            _widgetTranslatePendingNodes = {};
            _widgetTranslateQueue = [];
            _widgetRestoreOriginalText(document.body);
            if (langCode === "id") return;
        }

        _widgetTranslateRoot(document.body);
    }

    function _scheduleWidgetTranslateBootstrap(langCode) {
        if (!langCode || langCode === "id") return;

        var delays = [150, 800, 1800, 3200];
        delays.forEach(function (delay) {
            setTimeout(function () {
                if (_widgetStorage.getItem("widget_lang") === langCode) {
                    triggerGoogleTranslate(langCode);
                }
            }, delay);
        });

        if (document.readyState !== "complete") {
            window.addEventListener(
                "load",
                function () {
                    setTimeout(function () {
                        if (_widgetStorage.getItem("widget_lang") === langCode) {
                            triggerGoogleTranslate(langCode);
                        }
                    }, 500);
                },
                { once: true }
            );
        }
    }

    // Safari < 15.4 belum punya properti .nonce: nilainya hanya bisa dibaca dari atribut. Sebaliknya
    // Chrome / Firefox menyembunyikan atribut nonce (kosong) dan hanya mengisi propertinya.
    function _nonceElemen(el) {
        return (el && (el.nonce || el.getAttribute("nonce"))) || "";
    }

    // Memasang nonce lewat properti dan atribut sekaligus: di Safari < 15.4 "el.nonce = ..." hanya membuat
    // properti JavaScript biasa, sehingga tanpa atribut <style> widget diblokir CSP dan tampilan tidak jalan.
    function _pasangNonce(el, nonce) {
        if (!nonce) return;
        el.nonce = nonce;
        el.setAttribute("nonce", nonce);
    }

    function _ambilNonceHalaman() {
        var dariSkrip = _nonceElemen(_skripWidget);
        if (dariSkrip) return dariSkrip;
        return _nonceElemen(document.querySelector("style[nonce], script[nonce], link[nonce]"));
    }

    function _pasangGayaWidget() {
        var style = document.createElement("style");
        _pasangNonce(style, _nonceHalaman);

        head.appendChild(style);

        if (style.styleSheet) {
            style.styleSheet.cssText = css_loader;
        } else {
            style.appendChild(document.createTextNode(css_loader));
        }
    }

    var _nonceHalaman = _ambilNonceHalaman();
    _pasangGayaWidget();

    var create_div_element = document.createElement("div");
    create_div_element.setAttribute("id", "new_load_disabilitas");
    create_div_element.classList.add("dsb-akar");
    document.body.appendChild(create_div_element);

    if (base_url_website == "ppid.slemankab.go.id") {
        document.getElementById("wrapper")?.classList.add("main_web_ppid_jogja");
    }

    var create_slider_dsb_element = document.createElement("div");
    create_slider_dsb_element.setAttribute("id", "slider_dsb_element");
    create_slider_dsb_element.classList.add("dsb-akar");
    document.body.appendChild(create_slider_dsb_element);

    var create_slider_mouse = document.createElement("div");
    create_slider_mouse.setAttribute("id", "slider_mouse_over");
    create_slider_mouse.classList.add("dsb-akar");
    document.body.appendChild(create_slider_mouse);

    var create_slider_mouse_masked = document.createElement("div");
    create_slider_mouse_masked.setAttribute("id", "slider_mouse_masked");
    create_slider_mouse_masked.classList.add("dsb-akar");
    document.body.appendChild(create_slider_mouse_masked);

    var create_slider_mouse_masked_line = document.createElement("div");
    create_slider_mouse_masked_line.setAttribute("id", "slider_mouse_masked_line");
    create_slider_mouse_masked_line.classList.add("dsb-akar");
    document.body.appendChild(create_slider_mouse_masked_line);

    var interval_cek_element = 0;
    var _cekJqKe = 0;

    if (document.readyState == "complete") {
        setTimeout(() => {
            interval_cek_element = setInterval(cek_fungsi_jquery, 100);
        }, 200);
    } else {
        window.addEventListener(
            "load",
            function () {
                setTimeout(() => {
                    interval_cek_element = setInterval(cek_fungsi_jquery, 100);
                }, 2000);
            },
            false
        );
    }

    function cek_fungsi_jquery() {
        if (!_jqLayak(_jq())) {
            _cekJqKe++;
            if (_cekJqKe >= 300) {
                clearInterval(interval_cek_element);
                console.warn("Widget aksesibilitas: jQuery tidak tersedia, widget tidak dijalankan.");
            }
            return;
        }
        if (!_jqWidget) _jqWidget = _jq();
        var get_id_dsb = create_div_element;
        const except_website = ["www.google.com"];
        var string = base_url_website;
        if (new RegExp(String.raw`\b` + except_website.join(String.raw`\b|\b`) + String.raw`\b`).test(string)) {
            clearInterval(interval_cek_element);
        } else {
            var find_id_dsb = document.body.contains(get_id_dsb);
            if (find_id_dsb) {
                jquery_cek_all();

                clearInterval(interval_cek_element);

                setTimeout(() => {
                    cek_local_function();
                    _mulaiJembatanDanPengamat();

                    hit_api_tracking(base_url_website, "no_data");

                    load_html_dsb();
                }, 900);
            }
        }
    }

    function _namaCssBergaris(n) {
        return n.replace(/(.)([A-Z])(.)/g, (_cocok, m1, upper, m2) => {
            return m1 + "-" + upper.toLowerCase() + m2;
        });
    }

    function jquery_cek_all() {
        $(document).ready(function () {
            _jq().fn.cssImportant = function (name, value) {
                const applyStyles = (n, v) => {
                    const dashedName = _namaCssBergaris(n);
                    for (let k = 0; k < this.length; k++) {
                        this[k].style.setProperty(dashedName, v, "important");
                    }
                };
                if (_jq().isPlainObject(name)) {
                    for (const [n, v] of Object.entries(name)) {
                        applyStyles(n, v);
                    }
                } else {
                    applyStyles(name, value);
                }
                return this;
            };
        });
    }

    function _daftarPengaturanTersimpan() {
        return [
            {
                kunci: "text_besar",
                daftar: action_text_besar,
                resetSuara: true,
                muat: load_active_text_besar,
                tingkat: [text_besar_1, text_besar_2, text_besar_3, text_besar_4],
            },
            {
                kunci: "action_tulisan_dpt_dibaca",
                daftar: action_tulisan_dibaca,
                resetSuara: true,
                muat: load_active_tulisan_dpt_dibaca,
                tingkat: [active_action_ramah_dyseleksia, active_action_tulisan_dapat_dibaca],
            },
            {
                kunci: "text_kecil",
                daftar: action_text_kecil,
                resetSuara: true,
                muat: load_active_text_kecil,
                tingkat: [text_kecil_1, text_kecil_2, text_kecil_3, text_kecil_4],
            },
            {
                kunci: "tooltip_active",
                daftar: action_tooltip_widget,
                resetSuara: false,
                muat: null,
                tingkat: [load_active_tooltip_teks_action],
            },
            {
                kunci: "grey_scale_active",
                daftar: action_grey_scale_widget,
                resetSuara: false,
                muat: null,
                tingkat: [load_active_grey_scale, load_active_grey_scale_v2, load_active_grey_scale_v3],
            },
            {
                kunci: "action_kontras",
                daftar: action_contrash_widget,
                resetSuara: true,
                muat: load_active_kontras,
                tingkat: [action_kontras_1, action_kontras_2, action_kontras_3, action_kontras_4],
            },
            {
                kunci: "action_hidden_image",
                daftar: null,
                resetSuara: true,
                muat: null,
                tingkat: [load_active_hidden_image],
            },
            {
                kunci: "perataan_text",
                daftar: action_perataan_text_widget,
                resetSuara: true,
                muat: load_active_perataan_text,
                tingkat: [
                    action_perataan_text_1,
                    action_perataan_text_2,
                    action_perataan_text_3,
                    action_perataan_text_4,
                ],
            },
            {
                kunci: "action_line_height",
                daftar: action_line_height_text_widget,
                resetSuara: true,
                muat: load_active_tulisan_line_height,
                tingkat: [action_line_height_1, action_line_height_2, action_line_height_3],
            },
            {
                kunci: "action_animate_pause",
                daftar: null,
                resetSuara: true,
                muat: null,
                tingkat: [load_active_animate_pause],
            },
            {
                kunci: "action_kursor_change",
                daftar: action_kursor_widget,
                resetSuara: true,
                muat: null,
                tingkat: [action_kursor_widget_1, action_kursor_widget_2, action_kursor_widget_3],
            },
            {
                kunci: "action_space_text",
                daftar: action_space_text_widget,
                resetSuara: true,
                muat: load_active_space_text,
                tingkat: [action_space_text_1, action_space_text_2, action_space_text_3],
            },
            {
                kunci: "action_link_all",
                daftar: action_garis_bawahi_tautan_widget,
                resetSuara: true,
                muat: load_active_link_all,
                tingkat: [action_garis_link_1, action_garis_link_2],
            },
        ].concat(
            _FITUR_KELAS
                .filter(function (f) {
                    return f.simpan !== false;
                })
                .map(_pulihFiturKelas)
        );
    }

    function _pulihkanPengaturan(cfg) {
        var nilai = _widgetStorage.getItem(cfg.kunci);
        if (nilai === null) return;
        if (cfg.daftar) cfg.daftar.length = 0;
        if (cfg.resetSuara) cek_action_sound_search.length = 0;
        if (cfg.muat) {
            setTimeout(() => {
                cfg.muat();
            }, 100);
        }
        var tingkat = Number(nilai);
        var fungsiTingkat = Number.isInteger(tingkat) && tingkat >= 1 ? cfg.tingkat[tingkat - 1] : undefined;
        if (!fungsiTingkat) return;
        if (cfg.daftar) {
            for (var k = 0; k < tingkat; k++) cfg.daftar.push(1);
        }
        setTimeout(() => {
            fungsiTingkat();
        }, 100);
    }

    function _daftarProfilTersimpan() {
        return [
            null,
            ["Gangguan Motorik", action_gangguna_motorik_process],
            null,
            ["Buta Warna", action_buta_warna_process],
            ["Disleksia", action_disleksia_process],
            ["Gangguan Penglihatan", action_gangguan_pengelihatan_process],
            ["Kognitif & Pembelajaran", action_kognitif_pembelajaran_process],
            ["Kejang dan Epilepsi", action_kejang_dan_epilepsi_process],
            ["ADHD", action_adhd_process],
        ];
    }

    function _pulihkanProfil() {
        var number_data_widget = _widgetStorage.getItem("action_widget_profil");
        if (number_data_widget === null) return;
        var nomor = Number(number_data_widget);
        if (nomor !== 2) {
            setTimeout(() => {
                $w("#dropdown_profile_widget").attr("aria-expanded", "true");
                $w("#show_profile_widget_dsb").show();
            }, 200);
        }
        var daftarProfil = _daftarProfilTersimpan();
        var profil = Number.isInteger(nomor) && nomor >= 0 ? daftarProfil[nomor] : null;
        if (!profil) return;
        var label = profil[0];
        var proses = profil[1];
        setTimeout(() => {
            _tampilkanNilaiProfil(label);
            active_button_link_profile(nomor);
        }, 100);
        proses();
    }

    // ---- Jembatan pengaturan: mengabarkan pengaturan aktif ke kode situs dan ke aplikasi ----
    // Widget hanya bisa mengubah halaman web (DOM). Agar tampilan native ikut menyesuaikan (mis. Perbesar Teks
    // membesarkan teks UILabel / TextView / <Text> React Native), aplikasi yang membuka halaman lewat WebView
    // menerima ringkasan pengaturan ini lalu menerapkannya sendiri. Kanal yang dipakai (bila ada):
    //   - event "widget-aksesibilitas" di window (detail = objek)           : kode situs (Next.js, Vue, dll.)
    //   - window.webkit.messageHandlers.widgetAksesibilitas.postMessage(obj): iOS / iPadOS WKWebView
    //   - window.WidgetAksesibilitasAndroid.terima(json) / .postMessage(json): Android WebView (@JavascriptInterface /
    //                                                                          WebViewCompat.addWebMessageListener)
    //   - window.ReactNativeWebView.postMessage(json)                       : react-native-webview
    //   - window.WidgetAksesibilitasFlutter.postMessage(json)               : Flutter webview_flutter (JavaScriptChannel)
    //   - window.flutter_inappwebview.callHandler("widgetAksesibilitas", json): Flutter flutter_inappwebview
    // Ringkasan dikirim saat widget selesai memulihkan pengaturan, setiap kali pengaturan berubah, dan saat situs
    // mengirim event "widget-aksesibilitas:minta". Tidak ada variabel global baru.
    var _JEMBATAN_VERSI = 1;
    var _jembatanSiap = false;
    var _jembatanTerakhir = "";
    var _timerJembatan = null;

    function _tingkatFiturKelasId(id) {
        var f = _FITUR_KELAS.find(function (x) {
            return x.id === id;
        });
        if (!f) return 0;
        var kelas = document.documentElement.classList;
        for (var i = f.tingkat.length - 1; i >= 0; i--) {
            if (kelas.contains(f.tingkat[i][0])) return i + 1;
        }
        return 0;
    }

    function _petakAktif(id) {
        var el = _widgetCari("#" + id);
        return el?.classList.contains("active_box_menu_disabilitas") ? 1 : 0;
    }

    // Perkiraan skala teks untuk tampilan native: di web, Perbesar / Perkecil Teks menambah / mengurangi
    // 2, 4, 6, atau 8 px per elemen (sekitar 12,5% per tingkat dari teks 16 px).
    function _skalaTeksNative(perbesar, perkecil) {
        if (perbesar) return 1 + 0.125 * perbesar;
        if (perkecil) return Math.max(0.5, 1 - 0.125 * perkecil);
        return 1;
    }

    // Dibaca dari keadaan widget di memori, bukan dari localStorage: sebagian profil mengubah tingkat
    // tanpa menuliskannya ke penyimpanan. Nama profil (mis. "Netra Total", "ADHD") sengaja TIDAK dikirim:
    // itu informasi kesehatan, sedangkan event di window bisa dibaca skrip pihak ketiga di situs.
    function _ringkasPengaturan() {
        var perbesar = action_text_besar.length;
        var perkecil = action_text_kecil.length;
        var isyarat = null;
        if (_tingkatFiturKelasId("action_isyarat_sibi")) isyarat = "SIBI";
        if (_tingkatFiturKelasId("action_isyarat_bisindo")) isyarat = "BISINDO";
        return {
            sumber: "widget-aksesibilitas",
            versi: _JEMBATAN_VERSI,
            pengaturan: {
                perbesarTeks: perbesar,
                perkecilTeks: perkecil,
                skalaTeks: _skalaTeksNative(perbesar, perkecil),
                ramahDisleksia: action_tulisan_dibaca.length,
                teksTebal: _tingkatFiturKelasId("action_teks_tebal"),
                tinggiGaris: action_line_height_text_widget.length,
                spasiHuruf: action_space_text_widget.length,
                spasiKata: _tingkatFiturKelasId("action_spasi_kata"),
                rataTulisan: action_perataan_text_widget.length,
                kontras: action_contrash_widget.length,
                kejenuhan: action_grey_scale_widget.length,
                sembunyikanGambar: _petakAktif("action_hidden_image"),
                deskripsiGambar: _tingkatFiturKelasId("action_deskripsi_gambar"),
                garisBawahiTautan: action_garis_bawahi_tautan_widget.length,
                sorotJudul: _tingkatFiturKelasId("action_sorot_judul"),
                sorotFokus: _tingkatFiturKelasId("action_sorot_fokus"),
                kursor: action_kursor_widget.length,
                // Profil menyalakan Keterangan Alat lewat penyimpanan + petak, tanpa mengisi action_tooltip_widget.
                keteranganAlat: _petakAktif("action_tooltip"),
                animasiDijeda: _petakAktif("action_animate_pause"),
                bisukanMedia: _tingkatFiturKelasId("action_bisukan_media"),
                modaSuara: _widgetSuaraAktif() ? 1 : 0,
                bacaHalaman: _tingkatFiturKelasId("action_baca_halaman"),
                bahasaIsyarat: isyarat,
                bahasa: widget_current_lang || "id",
            },
        };
    }

    function _kirimPengaturan(paksa) {
        var data;
        try {
            data = _ringkasPengaturan();
        } catch (e) {
            return;
        }
        var json = JSON.stringify(data);
        if (!paksa && json === _jembatanTerakhir) return;
        _jembatanTerakhir = json;
        // Setiap kanal dicoba sendiri-sendiri: satu kanal yang galat tidak menghentikan yang lain.
        try {
            window.dispatchEvent(new CustomEvent("widget-aksesibilitas", { detail: data }));
        } catch (e) {
            // CustomEvent tidak tersedia.
        }
        try {
            window.webkit?.messageHandlers?.widgetAksesibilitas?.postMessage(data);
        } catch (e) {
            // Bukan WKWebView atau handler belum dipasang aplikasi.
        }
        try {
            // terima(): addJavascriptInterface. postMessage(): WebViewCompat.addWebMessageListener (androidx.webkit),
            // yang bisa dibatasi ke domain tertentu sehingga lebih aman.
            var android = window.WidgetAksesibilitasAndroid;
            if (typeof android?.terima === "function") {
                android.terima(json);
            } else if (typeof android?.postMessage === "function") {
                android.postMessage(json);
            }
        } catch (e) {
            // Bukan Android WebView atau antarmuka belum dipasang aplikasi.
        }
        try {
            window.ReactNativeWebView?.postMessage?.(json);
        } catch (e) {
            // Bukan react-native-webview.
        }
        try {
            window.WidgetAksesibilitasFlutter?.postMessage?.(json);
        } catch (e) {
            // Bukan Flutter webview atau kanal belum dipasang aplikasi.
        }
        try {
            // Flutter flutter_inappwebview: addJavaScriptHandler(handlerName: "widgetAksesibilitas").
            var hasilInApp = window.flutter_inappwebview?.callHandler?.("widgetAksesibilitas", json);
            hasilInApp?.catch?.(function () {
                // Handler belum dipasang aplikasi.
            });
        } catch (e) {
            // Bukan flutter_inappwebview.
        }
    }

    function _jadwalkanKirimPengaturan() {
        if (!_jembatanSiap) return;
        clearTimeout(_timerJembatan);
        _timerJembatan = setTimeout(function () {
            _kirimPengaturan(false);
        }, 150);
    }

    // ---- Menerapkan efek ke elemen yang muncul belakangan ----
    // Banyak efek (Perbesar Teks, Kontras, Tinggi Garis, dll.) ditulis langsung ke elemen yang ada saat
    // petak diklik. Di situs SPA (Next.js, Nuxt / Vue, React, Angular), konten "muat lagi", atau halaman
    // yang di-render ulang, elemen baru tidak ikut berubah. Pengamat ini menerapkan efek yang sedang aktif
    // hanya ke elemen yang baru ditambahkan (bukan ke seluruh halaman), dengan urutan yang sama seperti
    // saat pengaturan dipulihkan ketika halaman dimuat.
    var _pengamatElemenBaru = null;
    var _elemenBaruTertunda = [];
    var _timerElemenBaru = null;
    var _LEWATI_ELEMEN_BARU = /^(SCRIPT|STYLE|LINK|META|NOSCRIPT|TEMPLATE|BR|HEAD|TITLE)$/;

    function _adaEfekPerElemen() {
        return !!(
            action_text_besar.length ||
            action_text_kecil.length ||
            action_tulisan_dibaca.length ||
            action_contrash_widget.length > 1 ||
            action_perataan_text_widget.length ||
            action_line_height_text_widget.length ||
            action_space_text_widget.length ||
            action_garis_bawahi_tautan_widget.length ||
            action_kursor_widget.length === 1 ||
            _petakAktif("action_hidden_image")
        );
    }

    function _kelasElemen(el) {
        return el.getAttribute("class") || "";
    }

    function _elemenCocokDiAkar(akarList, selektor) {
        var hasil = [];
        for (const akar of akarList) {
            if (akar.matches(selektor)) hasil.push(akar);
            for (const el of akar.querySelectorAll(selektor)) hasil.push(el);
        }
        return hasil;
    }

    function _setGayaElemen(daftarEl, properti, nilai) {
        for (const el of daftarEl) el.style.setProperty(properti, nilai, "important");
    }

    // Satu fungsi per fitur. Urutannya sama dengan urutan pemulihan saat halaman dimuat
    // (_daftarPengaturanTersimpan), agar elemen baru mendapat hasil yang sama dengan elemen lama.
    function _efekBaruPerbesarTeks(akarList) {
        var besar = action_text_besar.length;
        if (!besar) return;
        _ubahUkuranFontHalaman(function (ukuran) {
            return ukuran + 2 * besar;
        }, akarList);
    }

    function _efekBaruDisleksia(akarList) {
        var tingkat = action_tulisan_dibaca.length;
        if (tingkat !== 1 && tingkat !== 2) return;
        var els = _getWebElements("i,.fa,.fa-search,.fa-angle-down,.fa-chevron-down", akarList);
        var huruf = tingkat === 1 ? "OpenDyslexic Bold" : "Arial, serif";
        for (const el of els) _tulisGayaWidget(el, "font-family", huruf);
    }

    function _efekBaruPerkecilTeks(akarList) {
        var kecil = action_text_kecil.length;
        if (!kecil) return;
        _ubahUkuranFontHalaman(function (ukuran) {
            var baru = ukuran - 2 * kecil;
            return baru >= 4 ? baru : 5;
        }, akarList);
    }

    // Kontras+ bekerja lewat CSS, jadi elemen baru otomatis ikut. Yang perlu ditangani hanya elemen baru
    // dengan gaya inline !important milik situs (tidak bisa dikalahkan CSS).
    function _efekBaruKontras(akarList) {
        var mode = action_contrash_widget.length;
        if (mode < 2 || mode > 4) return;
        _kontrasTimpaInlinePenting(mode, akarList);
    }

    function _efekBaruSembunyikanGambar(akarList) {
        if (!_petakAktif("action_hidden_image")) return;
        _setGayaElemen(_elemenCocokDiAkar(akarList, "img"), "visibility", "hidden");
    }

    function _efekBaruRataTulisan(akarList) {
        // text-align otomatis lewat CSS; elemen baru cukup diperiksa arah flex-nya (Rata Kanan - Kiri tidak perlu).
        var rata = action_perataan_text_widget.length;
        if (rata < 1 || rata > 3) return;
        _perataanAktif(_konfigPerataan(["kiri", "tengah", "kanan"][rata - 1]), _getWebElements(null, akarList));
    }

    function _efekBaruTinggiGaris(akarList) {
        var garis = action_line_height_text_widget.length;
        if (garis >= 1 && garis <= 3) _applyLineHeight(["1.75em", "2em", "2.5em"][garis - 1], akarList);
    }

    // Kursor tingkat 1 (kursor besar) memasang kelas ke setiap elemen; tingkat 2-3 berupa lapisan, berlaku otomatis.
    function _efekBaruKursor(akarList) {
        if (action_kursor_widget.length !== 1) return;
        for (const el of _turunanAkar(akarList)) el.classList.add("cursor_website_all");
    }

    function _efekBaruSpasiHuruf(akarList) {
        var spasi = action_space_text_widget.length;
        if (spasi >= 1 && spasi <= 3) _applyLetterSpacing(["1px", "4px", "7px"][spasi - 1], akarList);
    }

    function _efekBaruGarisTautan(akarList) {
        var versi = action_garis_bawahi_tautan_widget.length;
        if (versi !== 1 && versi !== 2) return;
        var tautanBaru = _elemenCocokDiAkar(akarList, _SELECTOR_TAUTAN_WIDGET).filter(function (el) {
            return !/underline_(tanda_code|link_)/.test(_kelasElemen(el));
        });
        _garisTautanAktif(versi, tautanBaru);
    }

    function _terapkanKeElemenBaru(akarList) {
        _efekBaruPerbesarTeks(akarList);
        _efekBaruDisleksia(akarList);
        _efekBaruPerkecilTeks(akarList);
        _efekBaruKontras(akarList);
        _efekBaruSembunyikanGambar(akarList);
        _efekBaruRataTulisan(akarList);
        _efekBaruTinggiGaris(akarList);
        _efekBaruKursor(akarList);
        _efekBaruSpasiHuruf(akarList);
        _efekBaruGarisTautan(akarList);
    }

    function _prosesElemenBaru() {
        _timerElemenBaru = null;
        var calon = _elemenBaruTertunda;
        _elemenBaruTertunda = [];
        if (!_adaEfekPerElemen()) return;
        var akarList = calon.filter(function (el) {
            return el.isConnected && !el.closest(".dsb-akar") && !_widgetFunkyMilikWidget(el);
        });
        // Buang elemen yang sudah tercakup oleh elemen baru lain (induknya juga baru).
        akarList = akarList.filter(function (el, i) {
            return !akarList.some(function (lain, j) {
                return j !== i && lain !== el && lain.contains(el);
            });
        });
        if (!akarList.length) return;
        try {
            _terapkanKeElemenBaru(akarList);
        } catch (e) {
            // Elemen berubah saat diproses: dicoba lagi pada perubahan berikutnya.
        }
    }

    function _pantauElemenBaru() {
        if (_pengamatElemenBaru || !window.MutationObserver || !document.body) return;
        // Hanya childList: efek widget sendiri hanya mengubah atribut style / class, jadi tidak memicu ulang.
        _pengamatElemenBaru = new MutationObserver(function (mutasi) {
            if (!_adaEfekPerElemen()) return;
            for (const m of mutasi) {
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1 && !_LEWATI_ELEMEN_BARU.test(n.tagName)) _elemenBaruTertunda.push(n);
                }
            }
            if (_elemenBaruTertunda.length && !_timerElemenBaru) {
                _timerElemenBaru = setTimeout(_prosesElemenBaru, 300);
            }
        });
        _pengamatElemenBaru.observe(document.body, { childList: true, subtree: true });
    }

    var _jembatanDimulai = false;

    function _mulaiJembatanDanPengamat() {
        if (_jembatanDimulai) return;
        _jembatanDimulai = true;
        window.addEventListener("widget-aksesibilitas:minta", function () {
            _kirimPengaturan(true);
        });
        // Pemulihan pengaturan berjalan dengan jeda 100-200 ms; ringkasan pertama dikirim sesudahnya.
        setTimeout(function () {
            _jembatanSiap = true;
            _kirimPengaturan(true);
            _pantauElemenBaru();
        }, 800);
    }

    function cek_local_function() {
        $(document).ready(function () {
            if (getOS() == "Android") {
                $w(".column_text_persegi_riset").cssImportant("font-size", "12px");
            }

            for (const cfg of _daftarPengaturanTersimpan()) {
                _pulihkanPengaturan(cfg);
            }

            _pulihkanProfil();
        });
    }

    function _widgetGtag() {
        window.dataLayer.push(arguments);
    }

    function load_html_dsb() {
        var popup_dsb = `<div class="circle_aksesbilitas_popup notranslate ${name_class_widget}" id="show_menu_dsb_web" translate="no">
<div class="circle_aksesbilitas_2">
    <div class="circle_aksesbilitas_3">
        <svg width="35px" height="35px" class="svg_icon_popoup_dsb" version="1.1" viewBox="0 0 301.673 226.145" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g>
                <ellipse cx="45.196" cy="22.5" rx="22.494" ry="22.495" transform="matrix(0.2268 -0.9739 0.9739 0.2268 13.0329 61.4156)" />
                <path d="M25.518,87.641c-6.569-10.341-8.717-20.2-9.335-23.958l-0.023-0.135c-0.79-5.549,3.022-10.62,8.479-11.394   c0.469-0.066,0.946-0.102,1.417-0.102c4.942,0,9.192,3.696,9.891,8.597l0.092,0.513c0.086,0.438,0.24,1.17,0.486,2.134   c0.444,1.738,1.259,4.451,2.607,7.505c0.572,1.303,1.27,2.727,2.11,4.201c0.352-1.732,0.692-3.408,1.003-4.996   c2.871-9.953-0.883-21.865-9.42-23.992c-8.535-2.129-20.912,2.508-25.945,17.149C0.075,83.338-1.386,96.468,1.2,118.683   c2.098,10.796,7.752,15.092,14.012,16.719c1.948,6.953,3.773,16.638,3.769,28.496c-0.005,12.573-2.024,27.624-8.192,44.751   c-2.341,6.495,1.026,13.656,7.522,15.998c1.399,0.504,2.831,0.743,4.237,0.743c5.12,0.001,9.924-3.17,11.761-8.264   c7.177-19.906,9.676-37.955,9.671-53.229c-0.012-18.935-3.787-33.531-7.021-42.576c-0.001-0.018-0.002-0.034-0.003-0.053   c-0.89-6.631-0.707-13.69,0.003-20.665C32.59,97.025,28.751,92.695,25.518,87.641z" />
                <path d="M301.673,199.25v-2.012l-12.697,12.697c-2.77,2.761-6.338,4.113-9.971,4.121c-0.094,0-0.166,0.002-0.215,0.006h-0.022   h-0.037H219.19c-7.783-0.014-14.079-6.312-14.093-14.095v-18.122v-2.012c0.014-7.779,6.31-14.082,14.093-14.094h45.639   l36.844-36.844v-3.644v-13.445l-41.85,41.849H219.19c-14.459,0.004-26.168,11.718-26.177,26.178l0.003,20.134   c0.006,14.46,11.715,26.175,26.174,26.178h59.818l0.193-0.009c6.611-0.041,13.266-2.609,18.311-7.655l4.16-4.16v-9.413V199.25z" />
                <ellipse cx="139.053" cy="52.879" rx="22.494" ry="22.495" transform="matrix(0.3311 -0.9436 0.9436 0.3311 43.1203 166.5847)" />
                <path d="M171.842,172.468c-3.729-6.532-8.044-11.721-12.75-15.668c-0.423,1.287-1.109,2.509-2.076,3.575   c-1.894,2.086-4.595,3.282-7.411,3.282c-2.488,0-4.873-0.92-6.716-2.59c-5.719-5.154-10.333-10.328-14.067-15.373   c-0.035-0.002-0.07-0.004-0.106-0.006c0.004-0.041,0.007-0.08,0.011-0.121c-13.695-18.569-15.359-35.351-15.297-42.786   c0.002-4.614,0.579-7.541,0.756-8.329c1.042-4.59,5.049-7.795,9.747-7.795c0.743,0,1.49,0.084,2.221,0.25   c5.322,1.205,8.716,6.527,7.56,11.865c-0.024,0.155-0.061,0.381-0.103,0.708c-0.082,0.69-0.182,1.832-0.182,3.318   c0.053,4.265,0.758,8.537,2.053,12.781c1.303-4.206,2.599-8.163,3.706-11.718c3.932-9.582,1.492-21.831-6.764-24.873   c-8.254-3.04-21.06,0.227-27.652,14.236c-8.953,19.316-11.832,32.213-11.67,54.577c1.365,16.345,12.156,19.185,21.279,20.062   c1.149,0.11,2.218,0.198,3.212,0.24c0.514,0.099,1.035,0.177,1.572,0.205c4.485,0.218,8.575,0.195,12.331,0.732   c2.814,0.392,5.379,1.046,7.821,2.177c3.633,1.73,7.272,4.421,11.246,10.506c3.93,6.071,7.926,15.664,10.953,30.274   c1.128,5.429,5.911,9.161,11.247,9.162c0.776,0,1.563-0.079,2.354-0.244c6.218-1.291,10.212-7.38,8.921-13.598   C180.977,192.633,176.899,181.334,171.842,172.468z" />
                <path d="M131.626,99.238c0.045-0.379,0.089-0.642,0.113-0.778c0.01-0.062,0.018-0.099,0.02-0.109   c0.927-4.283-1.768-8.521-6.049-9.492c-4.311-0.977-8.596,1.724-9.571,6.032h-0.002c-0.108,0.483-0.707,3.319-0.709,7.908   c-0.072,8.594,2.26,23.545,13.639,39.802c0.767,1.096,1.579,2.196,2.431,3.302c3.48,4.524,7.672,9.12,12.736,13.685   c1.532,1.388,3.455,2.072,5.371,2.072c2.179,0,4.35-0.885,5.928-2.627c0.957-1.056,1.575-2.299,1.869-3.596   c0.619-2.725-0.206-5.694-2.424-7.705c-11.58-10.559-17.5-20.577-20.511-28.817c-2.496-6.832-2.994-12.443-3.039-16.115   C131.427,101.205,131.533,99.994,131.626,99.238z" />
                <path d="M133.17,194.928c-8.023,8.016-18.482,12.001-28.992,12.006c-10.514-0.005-20.973-3.99-28.991-12.006   c-8.018-8.022-12.004-18.482-12.008-28.991c0.004-10.002,3.619-19.946,10.871-27.797c6.871-1.829,11.766-6.07,14.315-10.742   c2.838-5.084,3.372-10.271,3.39-14.087c-0.004-3.579-0.516-6.047-0.573-6.331c-0.589-2.783-3.026-4.76-5.871-4.76h-1.352   c0.108,5.475-4.229,10.04-9.714,10.193c-0.73,0.021-1.477,0.035-2.235,0.035h-0.104c-7.196,0-14.063-1.188-20.291-3.467   c0.374,2.953,2.891,5.238,5.947,5.238h22.179c-0.091,2.397-0.61,5.172-1.825,7.275c-1.429,2.355-3.267,4.259-8.151,5.324   c-0.042,0.009-0.079,0.027-0.121,0.036c-0.307,0.068-0.61,0.155-0.906,0.272c-0.024,0.009-0.049,0.017-0.072,0.025   c-0.343,0.141-0.675,0.315-0.992,0.522c-0.014,0.009-0.029,0.018-0.043,0.026c-0.309,0.204-0.589,0.44-0.85,0.695   c-0.025,0.023-0.054,0.039-0.078,0.063c-0.027,0.027-0.052,0.056-0.078,0.082c-10.285,10.322-15.453,23.885-15.446,37.394   c-0.007,13.542,5.186,27.142,15.524,37.477c10.333,10.335,23.933,15.529,37.477,15.523c0.008,0,0.018,0,0.025,0   c13.534,0,27.124-5.191,37.452-15.523c2.342-2.344,2.342-6.143,0-8.485C139.309,192.585,135.513,192.585,133.17,194.928z" />
                <path d="M72.008,110.448c0.739,0,1.465-0.013,2.181-0.035c4.408-0.123,7.879-3.788,7.77-8.192c0-0.009,0.001-0.018,0.001-0.026   c-0.124-4.416-3.804-7.896-8.22-7.772c-0.611,0.015-1.189,0.026-1.732,0.026c-8.725-0.021-15.016-2.124-19.981-5.138   c-4.952-3.012-8.648-7.155-11.369-11.415c-1.346-2.108-2.457-4.245-3.354-6.287c-1.352-3.062-2.211-5.852-2.715-7.816   c-0.252-0.983-0.417-1.759-0.514-2.26c-0.047-0.248-0.079-0.431-0.097-0.534c-0.005-0.029-0.009-0.052-0.012-0.068   c-0.622-4.377-4.671-7.417-9.045-6.795c-4.375,0.62-7.417,4.669-6.795,9.044c0.121,0.64,1.638,11.679,9.076,23.385   c2.541,3.974,5.837,8.021,10.017,11.643c1.957,1.695,4.089,3.306,6.461,4.756c2.451,1.506,5.135,2.829,8.032,3.935   c5.856,2.231,12.604,3.552,20.194,3.552C71.941,110.448,71.975,110.448,72.008,110.448z" />
            </g>
        </svg>
    </div>
</div>
</div>`;
        slider_popup_disabilitas();

        setTimeout(() => {
            $w("#new_load_disabilitas").html(popup_dsb);

            // Ctrl+U membuka / menutup widget. Tidak dipakai di kolom isian / editor (di sana Ctrl+U = garis bawah),
            // bila situs sudah menangani tombol itu sendiri, atau bila ada tombol pengubah lain (Ctrl+Shift+U, dll.).
            function _ctrlUMilikSitus(e) {
                if (e.defaultPrevented || e.isComposing || e.shiftKey || e.altKey || e.metaKey) return true;
                var t = e.target;
                if (!(t instanceof Element) || _widgetFunkyMilikWidget(t)) return false;
                return !!(t.isContentEditable || t.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])"));
            }
            document.addEventListener("keydown", function (e) {
                if (!(e.ctrlKey && (e.code === "KeyU" || e.key === "u" || e.key === "U"))) return;
                if (_ctrlUMilikSitus(e)) return;
                e.preventDefault();
                var stickyToolbarContainer = _widgetCari(".content_aksesbilitas");
                if ($w(".content_aksesbilitas").hasClass("new-show-toolbar")) {
                    stickyToolbarContainer.classList.remove("new-show-toolbar");
                    $w("#show_menu_dsb_web").css("display", "flex");
                    _jalankanDariKeyboard(_fokusSesudahTutup);
                } else {
                    stickyToolbarContainer.classList.toggle("new-show-toolbar");
                    $w("#show_menu_dsb_web").css("display", "none");
                    _jalankanDariKeyboard(_fokusSesudahBuka);
                }
            });

            $w("#circle_close_popup_dsb").click(function (event) {
                event.preventDefault();
                var stickyToolbarContainer = _widgetCari(".content_aksesbilitas");
                stickyToolbarContainer.classList.remove("new-show-toolbar");
                $w("#show_menu_dsb_web").css("display", "flex");
                _fokusSesudahTutup();
            });

            $w("#show_menu_dsb_web").click(function (event) {
                event.preventDefault();
                var stickyToolbarContainer = _widgetCari(".content_aksesbilitas");

                stickyToolbarContainer.classList.toggle("new-show-toolbar");
                $w("#show_menu_dsb_web").css("display", "none");
                _fokusSesudahBuka();
            });

            _pasangAksesKeyboard();

            $("input[autocomplete]").on("input", function () {
                var dInput = this.value;
                cek_action_sound_search.length = 0;
                if (funky) {
                    clearInterval(funky);
                    funky = null;
                }
                _widgetFunkyAmati(false);
                if (dInput.length > 2) {
                    _widgetFunkyDomBerubah = true;
                    _widgetFunkyAmati(true);
                    funky = setInterval(function () {
                        if (_widgetFunkyPerluJalan()) {
                            cek_local_function();
                        }
                    }, 250);
                    cek_action_sound_search.push(1);
                }
            });

            window.dataLayer = window.dataLayer || [];

            _widgetGtag("js", new Date());

            _widgetGtag("config", "G-SJLG49CX7N");
        }, 1200);
    }
    var except_url = ["www.jakarta.go.id", "jakarta.go.id", "ppid.jakarta.go.id"];
    var my_website_jkt = new RegExp(String.raw`\b` + except_url.join(String.raw`\b|\b`) + String.raw`\b`).test(base_url_website)
        ? "Mode Suara"
        : "Moda Suara";

    var except_url_jquery_v3 = new Set([
        "slemankab.go.id",
        "ppid-vnew.animemusic.us",
        "lapor.spbe.sangkuriang.co.id",
        "lapor.go.id",
        "latihan.lapor.go.id",
        "wapresmendengar.lapor.go.id",
        "lapormaswapres.lapor.go.id",
    ]);
    var name_class_widget = "";
    var name_class_widget1 = "";
    var name_class_widget2 = "";
    var name_class_widget3 = "";
    var name_class_widget4 = "";
    var name_class_widget5 = "";
    var name_class_widget6 = "";
    var name_class_widget7 = "except_group_move_widget";
    var name_class_widget8 = "except_group_action_setting_layout";

    var position_daftar_web = "";
    var position_default = "";

    function _aturPosisiBawaan() {
        if (except_url_jquery_v3.has(base_url_website)) {
            name_class_widget = "circle_right_sidebar";
            name_class_widget1 = "except_position_swipe";
            name_class_widget2 = "except_content_aksesbilitas_utama";
            name_class_widget3 = "except_groupcontenttoolbar";
            name_class_widget4 = "except_group_scroll_content";
            name_class_widget5 = "except_content_daftar_action_disabilitas";
            name_class_widget6 = "except_layout_profile_widget";
            name_class_widget7 = "except_group_move_widget";
            name_class_widget8 = "except_group_action_setting_layout";
            position_daftar_web = "right_bottom";
            position_default = "right_bottom";
        } else {
            position_daftar_web = "left_bottom";
            position_default = "left_bottom";
        }
    }

    function _aturPosisiTersimpan(cek_position_widget) {
        if (cek_position_widget == "left_top") {
            name_class_widget = "circle_left_top_sidebar";
            name_class_widget1 = "";
            name_class_widget2 = "";
            name_class_widget3 = "";
            name_class_widget4 = "";
            name_class_widget5 = "";
            name_class_widget6 = "";
            name_class_widget7 = "except_group_move_widget";
            name_class_widget8 = "except_group_action_setting_layout";
            position_daftar_web = "left_top";
        } else if (cek_position_widget == "right_top") {
            name_class_widget = "circle_right_top_sidebar";
            name_class_widget1 = "except_position_swipe";
            name_class_widget2 = "except_content_aksesbilitas_utama";
            name_class_widget3 = "except_groupcontenttoolbar";
            name_class_widget4 = "except_group_scroll_content";
            name_class_widget5 = "except_content_daftar_action_disabilitas";
            name_class_widget6 = "except_layout_profile_widget";
            name_class_widget7 = "except_group_move_widget";
            name_class_widget8 = "except_group_action_setting_layout";
            position_daftar_web = "right_top";
        } else if (cek_position_widget == "right_bottom") {
            name_class_widget = "circle_right_sidebar";
            name_class_widget1 = "except_position_swipe";
            name_class_widget2 = "except_content_aksesbilitas_utama";
            name_class_widget3 = "except_groupcontenttoolbar";
            name_class_widget4 = "except_group_scroll_content";
            name_class_widget5 = "except_content_daftar_action_disabilitas";
            name_class_widget6 = "except_layout_profile_widget";
            name_class_widget7 = "except_group_move_widget";
            name_class_widget8 = "except_group_action_setting_layout";
            position_daftar_web = "right_bottom";
        } else if (cek_position_widget == "left_bottom") {
            position_daftar_web = "left_bottom";
            name_class_widget = "";
            name_class_widget1 = "";
            name_class_widget2 = "";
            name_class_widget3 = "";
            name_class_widget4 = "";
            name_class_widget5 = "";
            name_class_widget6 = "";
            name_class_widget7 = "except_group_move_widget";
            name_class_widget8 = "except_group_action_setting_layout";
        }
    }

    _aturPosisiBawaan();
    _aturPosisiTersimpan(_widgetStorage.getItem("position_widget"));

    function _tampilkanBahasaAktif() {
        var daftar = _widgetCari("#show_bahasa_widget_dsb .group_body_bahasa");
        var aktif = _widgetCari("#show_bahasa_widget_dsb .active_bahasa_item");
        if (!daftar || !aktif) return;
        var jarak = aktif.getBoundingClientRect().top - daftar.getBoundingClientRect().top;
        daftar.scrollTop += jarak - (daftar.clientHeight - aktif.offsetHeight) / 2;
    }

    function _bacaSeleksiMobile() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const text = selection.toString();
        if (!isBlank(text) && text != undefined && text != "") {
            speachmobile(text, _bahasaSuaraHalaman());
        }
    }

    function _hapusStorageWidget(dariProfil) {
        var _widgetStorageKeys = [
            "action_animate_pause",
            "action_hidden_image",
            "action_kontras",
            "action_kursor_change",
            "action_line_height",
            "action_link_all",
            "action_space_text",
            "action_tulisan_dpt_dibaca",
            "action_widget_profil",
            "grey_scale_active",
            "perataan_text",
            "permismobile",
            "permisvoice",
            "position_widget",
            "text_besar",
            "text_kecil",
            "tooltip_active",
            "widget_lang",
        ];
        var _kunciPilihanPengguna = new Set(["position_widget", "widget_lang"]);
        for (const _widgetStorageKey of _widgetStorageKeys) {
            if (dariProfil && _kunciPilihanPengguna.has(_widgetStorageKey)) continue;
            _widgetStorage.removeItem(_widgetStorageKey);
        }
    }

    function slider_popup_disabilitas() {
        $(document).ready(function () {
            var slider_popup = `<div class="content_aksesbilitas notranslate ${name_class_widget1}" id="widget_menu_disabilitas" translate="no">
<div class="groupcontenttoolbar ${name_class_widget3}" id="checklangmenu">
    <div class="content_aksesbilitas_utama ${name_class_widget2}">
        <div class="group_title_disabilitas">
            <div class="row_title_disabilitas">
                <div class="start_title_disabilitas">
                    <div class="title_disabilitas">Menu Aksesibilitas</div>
                    <div class="dsb_pintasan">Buka/tutup cepat: <kbd>Ctrl</kbd> + <kbd>U</kbd></div>
                </div>
                <div class="end_title_disabilitas">
                    <div class="box_circle_disabilitas" id="circle_close_popup_dsb">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 448 448" fill="none">
                            <path class="icon_x_svg_color" d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="group_box_content_disabilitas">
            <div class="group_scroll_content ">
            <div class="group_ltr_content ${name_class_widget4}">
                <div class="layout_content_title">
                    <div class="group_row_widget_dsb">
                        <div class="group_action_bahasa" id="dropdown_bahasa_widget" aria-expanded="false">
                            <div class="box_content_disabilitas">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            </div>
                            <div class="row_data_widget">
                                <div class="text_column_layaout_disabilitas">
                                    <span class="dsb_baris_judul">Bahasa</span>
                                    <span class="dsb_baris_nilai" id="text_name_bahasa_widget">Bahasa Indonesia</span>
                                </div>
                                <div class="icon_column_layaout_disabilitas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 6 11" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="m.5 10.5 5-5-5-5"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div class="box_button_switch">

                        </div>
                    </div>

                </div>

                <div class="layout_bahasa_widget" id="show_bahasa_widget_dsb">
                    <div class="group_body_bahasa">
                        ${_htmlDaftarBahasa()}
                    </div>
                </div>

                   <div class="layout_content_title">
                    <div class="group_row_widget_dsb">
                        <div class="group_action_bahasa" id="dropdown_profile_widget" aria-expanded="false">
                            <div class="box_content_profile_disabilitas">
                            <span class="svg_icon_layout_dsb">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22px" height="22px" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"></path></svg>
                            </span>

                            </div>
                            <div class="row_data_widget">
                            <div class="text_column_layaout_disabilitas">
                                <span class="dsb_baris_judul">Profil Aksesibilitas</span>
                                <span class="dsb_baris_nilai" id="text_name_profile_widget">Pilih profil sesuai kebutuhan</span>
                            </div>
<div class="icon_column_layaout_disabilitas">
<svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 6 11" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="m.5 10.5 5-5-5-5"></path></svg>
</div>
                            </div>
                        </div>
                        <div class="box_button_switch">
                        </div>
                    </div>

                </div>

                <div class="layout_profile_widget ${name_class_widget6}" id="show_profile_widget_dsb">
              <div class="row_widget_profil_dsb">
            <div class="box_profile_aksesbilitas display_none_mobile" id="action_gangguan_motorik">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 15" width="17" height="17">
                            <g fill="currentColor" fill-rule="evenodd">
                                <path class="color_svg_content_profile_disabilitas"
                                    d="M4.50345823 7.64209974c0-.41467465-.00120904-.82930278.00023251-1.24397742.00330162-.94907699.63060841-1.71912059 1.56450035-1.87294326 1.06084135-.17466105 1.98041079.53189058 2.15428033 1.5192023.02134424.1213092.02938902.24629302.02976103.36969535.00255759.81767421.00306911 1.63539493-.00083703 2.45306913-.00051152.10121504.0259014.13396108.1296.13261216.42223467-.00530262.84465534.00372115 1.26684351-.00390719.39121807-.00702366.65548677.15847409.82912377.5137035.4690153.95972879.9528646 1.91224779 1.4295062 2.86825539.2241843.4495139.0312956.9351228-.4283264 1.0852708-.3444375.112518-.7322609-.04884-.8960396-.3759283-.4054476-.8098598-.81201122-1.6191614-1.2114601-2.4319516-.05738299-.1167043-.12122971-.1600091-.25427083-.1592183-1.00731799.0063724-2.01463598.0042328-3.02200047.0031164-.3655492-.0004186-.70914964-.083121-.99987774-.3150876-.37010635-.2951795-.58592035-.67631736-.59103553-1.15839117-.00483616-.46114239-.00102303-.92233129-.00102303-1.38352019h.00102303Z">
                                </path>
                                <path class="color_svg_content_profile_disabilitas"
                                    d="M0 10.4944147c.0432465-1.47519978.63781615-2.67424442 1.80826181-3.58029572.33137051-.25652615.77625147-.19196436 1.04665836.13693799.24250592.29494693.20521163.7335299-.08714403 1.00801056-.17219548.16154403-.36145705.30778487-.51667945.48416695-.62149408.70622604-.86107041 1.53431942-.69868677 2.45860432.19865491 1.1307617.85655976 1.9065266 1.92414384 2.3144566 1.22108592.4665846 2.6397107.0301878 3.41335807-1.0244301.24445899-.3332746.69464113-.4168608 1.03284738-.1918248.34136835.2270827.44478795.674922.20958278 1.0230812-.3568069.5280299-.8289378.9372159-1.37658732 1.2613272-.82763575.4897487-1.72548894.6831085-2.67616796.5948709-1.89731241-.176103-3.35304547-1.5186441-3.85307734-3.0891516C.08184284 11.4358169.00237158 10.9732325 0 10.4944147m6.75159277-7.49842122c-.83851712-.00177087-1.50167666-.67036687-1.49880292-1.51101912C5.25563581.66460233 5.93023474-.00241218 6.75470838 0c.83884264.00251833 1.50149066.6706957 1.49875555 1.51134795-.00265908.81986037-.676886 1.48636323-1.50187116 1.48464553">
                                </path>
                            </g>
                        </svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Gangguan Motorik</span><span class="dsb_profil_ket">Jeda animasi dan keterangan alat</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

            <div class="box_profile_aksesbilitas" id="action_netra_total">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 13" width="17" height="17">
    <path fill="none"  class="color_svg_content_profile_disabilitas" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M1 7.3823532h3.6V5.5211767c0-.5964675.48353247-1.08 1.08-1.08.5964675 0 1.08.4835325 1.08 1.08v5.4169853c0 .60268073.4885693 1.09125 1.09125 1.09125.6026807 0 1.09125-.48856927 1.09125-1.09125V2.5687502c0-.5902543.4784957-1.06875 1.06875-1.06875s1.06875.4784957 1.06875 1.06875v6.85125c0 .5964676.4835325 1.08 1.08 1.08.5964675 0 1.08-.4835324 1.08-1.08V5.5211767c0-.5964675.4835325-1.08 1.08-1.08.5964675 0 1.08.4835325 1.08 1.08v1.8611765H19">
    </path>
</svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Netra Total</span><span class="dsb_profil_ket">Mode suara: teks dibacakan saat disorot</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

                   <div class="box_profile_aksesbilitas" id="action_buta_warna">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" width="17" height="17">
    <g fill="none" fill-rule="evenodd">
        <path class="color_svg_content_profile_disabilitas" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"
            d="M10.18462518 7.77262463 6 1 1.749375 7.8845C1.2775 8.59733333 1 9.43383333 1 10.33333333 1 12.9105 3.23875 15 6 15s5-2.0895 5-4.66666667c0-.88617554-.74237577-2.438274-.749375-2.44883333l-.06599982-.11187537Z">
        </path>
        <path class="color_svg_content_profile_disabilitas" fill="currentColor"
            d="M6 15c2.76125 0 5-2.0895 5-4.66666667 0-.88617554-.74237577-2.438274-.749375-2.44883333l-.06599982-.11187537L6 1">
        </path>
    </g>
</svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Buta Warna</span><span class="dsb_profil_ket">Saturasi warna tinggi</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

                    <div class="box_profile_aksesbilitas" id="action_disleksia">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 11" width="17" height="17">
    <path fill="currentColor" class="color_svg_content_profile_disabilitas"  fill-rule="evenodd" stroke="currentColor" stroke-width="0.5"
        d="M1 10V1.4125h2.8968759c2.7220645 0 4.6449908 1.775 4.6449908 4.2875 0 2.5125-1.9229263 4.3-4.6449908 4.3H1Zm.97395-1.7631818h1.9229263c2.1476839 0 3.6585545-1.1706833 3.6585545-2.9740909C7.5554308 3.470591 6.0445602 2.3 3.8968763 2.3H1.97395v5.9368182ZM11.809437 2.65l.004584.8875h1.605048v.8375h-1.600688L12.008 10h-1.414166L10.812 4.375h-.969534v-.8375h1.023692l.030044-.8875c.0320746-.9625.6440977-1.65 1.482911-1.65.396736 0 .7919618.15 1.120887.4125l-.385091.6875c-.1391915-.15-.3806405-.2625-.651108-.2625-.3527837 0-.6568024.3375-.654364.8125Z">
    </path>
</svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Disleksia</span><span class="dsb_profil_ket">Huruf ramah disleksia</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

                     <div class="box_profile_aksesbilitas display_none_mobile" id="action_gangguan_pengelihatan">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10" width="17" height="17">
    <g fill="none" fill-rule="evenodd" stroke="currentColor">
        <path stroke-linecap="round" class="color_svg_content_profile_disabilitas"  stroke-linejoin="round" stroke-width="1.25"
            d="m1 4.99999994 2.20371699-2.57100316C5.00082774.33236757 8.15732765.08955988 10.25395687 1.88667064a4.99999938 4.99999938 0 0 1 .54232614.54232614L13 4.99999994h0l-2.20371699 2.57100315c-1.79711075 2.09662921-4.95361066 2.3394369-7.05023988.54232614a4.99999938 4.99999938 0 0 1-.54232614-.54232614L1 4.99999994h0Z">
        </path>
        <path stroke-width="1.75" class="color_svg_content_profile_disabilitas"
            d="M7 3.37499994c.44873136 0 .85498136.18188432 1.14904852.47595148S8.625 4.55126858 8.625 4.99999994c0 .44873135-.18188432.85498135-.47595148 1.14904851C7.85498136 6.44311561 7.44873136 6.62499994 7 6.62499994s-.85498136-.18188433-1.14904852-.47595149S5.375 5.44873129 5.375 4.99999994c0-.44873136.18188432-.85498136.47595148-1.14904852S6.55126864 3.37499994 7 3.37499994Z">
        </path>
    </g>
</svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Gangguan Penglihatan</span><span class="dsb_profil_ket">Teks besar, huruf jelas, kursor besar, saturasi tinggi</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

                     <div class="box_profile_aksesbilitas display_none_mobile" id="action_kognitif_pembelajaran">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="17" height="17"><path fill="currentColor" class="color_svg_content_profile_disabilitas"  fill-rule="evenodd" d="M3.4305674 2.28495811c0-.29900421-.0035071-.5816392.0006908-.86416789.0100965-.6746462.4400452-1.21600009 1.0909996-1.37910779.8740855-.2190182 1.7499778.45334269 1.7616153 1.35434135.0037729.29124478.0005845.58259585.0005845.88893433h.1520311c.6906493 0 1.3812986-.00031888 2.0719479.00015944.3570418.00021259.6691279.10900421.91208.38255108.1933733.21779582.2903522.47321957.2909368.76340147.0015941.7084476.0005313 1.4168952.0005313 2.1252896v.1565707c.2715941 0 .5314976-.0022853.7912949.0006378.254377.0028699.5002517.0418797.7295471.1649146.5329323.2859833.8426803.8785176.751281 1.448996-.1033024.6442993-.5548788 1.129849-1.1788385 1.2169567-.3001298.0418797-.6095589.0175916-.9148432.0229594-.0562744.0010098-.112655.0001063-.1784413.0001063v.161407c0 .6995721.0006377 1.3991442-.0002125 2.0987163-.000744.6465315-.4531174 1.1385651-1.0996612 1.159877-.5881439.0193986-1.1774569.0128615-1.766079.0028699-.3425349-.005793-.556101-.251172-.5632217-.5945007-.0040386-.1982378.0014348-.4022686-.0430958-.5930127-.1534127-.6571609-.7408127-1.1027973-1.4051581-1.0894574-.6564808.0132867-1.21763.4804476-1.3617434 1.1497791-.0368254.1711329-.0409171.3509819-.04469.5271637-.0077051.3596979-.2220153.5979553-.5828831.6018881-.6019069.006484-1.204239.0084504-1.8058802-.0078657-.51922249-.0140839-1.00156639-.4718909-1.02255635-.9932616-.0256662-.6364868-.01626057-1.2747805-.00797087-1.9120645.00334777-.2564336.23147406-.4753455.48739212-.4978266.16287144-.0143496.32717763-.0114266.49047418-.0220559.61556372-.0402854 1.12729352-.495063 1.26736832-1.1232589.1313599-.5889203-.1487896-1.2059553-.6753453-1.5050127-.2987482-.1696979-.61923025-.2269902-.95714199-.2183804-.23540635.0060056-.42771687-.0807301-.54106264-.2924671-.04410548-.0823777-.073332-.1834098-.07434164-.2763637-.00653612-.5755273-.00919307-1.1512672-.00138162-1.7267414.00903365-.65971191.50338699-1.12788258 1.18728759-1.13123083.6906493-.00334825 1.3812455-.00074406 2.0718948-.00074406h.1665911Z"></path></svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Kognitif &amp; Pembelajaran</span><span class="dsb_profil_ket">Teks besar, panduan baca, jeda animasi</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

                     <div class="box_profile_aksesbilitas " id="action_kejang_dan_epilepsi">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15" width="17" height="17">
                    <g fill="currentColor" fill-rule="evenodd">
                    <path  class="color_svg_content_profile_disabilitas"  d="M12.6685391 7.05850295c.0618316-.19052057.1261678-.37674459.1827945-.56531581.1901517-.63298661.0691105-1.20892447-.3105667-1.73811736-.2320249-.32343543-.5267033-.57804635-.8488928-.80063199-.4551274-.31444449-.949193-.54968111-1.4690478-.73240423-.0926691-.03258224-.1837338-.08716445-.25828386-.15209024-.11458409-.09985522-.15238745-.24005036-.15485288-.3932943-.00579182-.36170664-.02320641-.72257784-.15453982-1.06550692-.08781649-.22926918-.22419817-.41752213-.47082008-.47986202-.45430556-.11477383-.8951882-.08736337-1.29388448.1876562-.21590179.14894739-.35893623.34408279-.35870172.63298662.00293533 3.74608251.00187872 7.49216503.00273966 11.2382475.00003914.0758264.00113489.1539999.01823641.2270414.07020623.2999635.29510882.4285022.56403705.4781115.36421931.0671935.72820381.0273309 1.08487027-.065244.32899879-.0853742.51555014-.3113812.5669721-.6475074.02547618-.166253.03349863-.3357682.04156021-.5042092.01267939-.2651932.16279707-.4605275.41751974-.5162236.3201153-.070018.627747-.1711463.91589-.3323071.5559363-.3109436.9714602-.7461293 1.1581681-1.3741431.1915213-.64412581.1881558-1.2948954.0078268-1.94057279-.1229979-.44071558-.3600711-.80739509-.7503928-1.05416877-.4400217-.27820221-1.0393575-.32439023-1.4937022.10045196-.12542419.11728016-.22764196.26272665-.32821611.40431419-.10284392.14469061-.2257244.24852413-.40440984.26395991-.21410162.0184593-.38531248-.06810842-.49837035-.2509111-.11153164-.18041571-.10660077-.37018041-.00183929-.55588725.15594863-.27633241.35686213-.51300122.60242742-.71112034.83977457-.67758331 2.11737937-.75225592 2.98399987.105027.0788156.0779746.1591184.15427831.2494786.24172124M1.33117128 7.04079954c.2056487-.17345369.3867213-.36715691.60340577-.50166308.82568638-.51248404 1.65254678-.45718573 2.46034896.05283177.3388214.21395273.60047072.5097788.78749168.86702974.12812443.24466519.03557273.54371367-.19386939.68546034-.23312071.14405409-.53531276.08270877-.69713148-.14230363-.04418219-.06150445-.08515539-.1253561-.12922018-.18694012-.39161304-.54713499-.99051841-.71609321-1.57995337-.43383313-.40660133.194658-.67102917.52911332-.83085206.94894285-.22920731.60215483-.24004741 1.22260982-.12436757 1.84911182.10319612.5589903.37071554 1.022422.81320267 1.3731883.37259396.2953884.79117027.4946215 1.25623766.5918113.35564898.0743145.48698239.2434319.49559185.6144477.00273937.1157684.00994001.2318551.02344121.346788.04844778.413345.23711236.6374026.62892108.73686.3122886.0792874.63224746.1071752.95118883.068546.36985459-.0447558.67678185-.2368677.67549449-.7603319-.00931793-3.71962682-.00622635-7.43925366-.00227383-11.15884073.00031308-.26666515-.099361-.46725082-.29733945-.62618373-.3210546-.25775377-.69364857-.32208281-1.08866626-.28401052-.4610366.04443756-.66746798.22584784-.79148334.67869723-.08030279.29320039-.10080896.5928854-.10190471.89551435-.00105661.29439387-.12922017.46991628-.4022966.56519646-.1015525.03540683-.20314413.07121149-.30285733.11143206-.60665388.24446626-1.17757851.55011872-1.65943435 1.00730445-.30461836.28898339-.54990971.61906258-.6827302 1.02592288-.19367373.59320366-.01592751 1.14105475.18905592 1.67502159m5.66741207 7.44816506c-.28849519.2665458-.62625997.4362997-1.00632851.4715474-.33205123.0307522-.66985515.014481-1.00413701-.0017505-.2780073-.0135659-.5421612-.0983434-.79664902-.218289-.37952067-.1789438-.63486944-.472542-.77594718-.8643245-.07787649-.2162204-.12526765-.4441768-.17895938-.668672-.01487088-.0624194-.03592493-.093291-.09916533-.1123073-.86133737-.2591064-1.56739139-.7393264-2.05715228-1.5177993-.43810413-.6964007-.59831836-1.4663998-.5677939-2.28429758.01267938-.33958731.07337608-.67097934.17246314-.99477282.02034963-.06643753.01224891-.11620601-.02230633-.17500522C.36299833 7.6132365.14005244 7.0728646.04429176 6.48300271c-.1419387-.87446916.0588574-1.66336519.57718605-2.37030832.39568297-.53961602.89871026-.95666075 1.46685637-1.29473631.32939013-.19605041.67298586-.36305926 1.03728344-.48189095.05596149-.01826038.07294561-.04726215.07791561-.10454961.03197241-.36747517.09885226-.72751092.22916818-1.07370221.24924388-.6619486.72327294-1.04068235 1.4098774-1.1297564.48404734-.06281728.96347688-.02558043 1.4213045.16661103.27652022.11608667.5238074.27903765.73587406.49637195.51198895-.51646234 1.14141877-.69472977 1.83925467-.68800645.34484802.00334177.67232058.0711717.97768249.23861817.41622827.22823482.65948467.59913132.78897877 1.04342738.0864077.29654215.1285158.60684921.1819335.91250167.0133056.07658219.0311506.11811559.1103577.14663997.8877919.31965606 1.66957.80938425 2.2922688 1.53494581.7690596.89599174.9932969 1.9198459.6599934 3.06519721-.1189671.40873009-.2932304.79239693-.5023229 1.16015057-.0401514.07069432-.0512654.12985157-.0279025.21144642.2663454.92925029.2396952 1.84990746-.1370078 2.74152306-.4371258 1.0346354-1.217182 1.6900198-2.2678884 2.0190248-.1016699.0318662-.1391993.0773381-.1626014.1813307-.0513045.2279962-.1091053.4573051-.1935954.6742814-.2175454.558672-.66077611.8470189-1.21393393.9716589-.46424558.1046292-.93663102.1289763-1.40842945.0479782-.33056414-.0567702-.62716005-.195573-.88403504-.4174823-.01682758-.0146003-.03412477-.0287233-.05392653-.0453128"></path><path d="M5.58862769 11.5399893c.01952782.1658154-.02504571.3549436-.19958295.494343-.16369715.1307268-.34711779.1524881-.5335126.0699783-.18248143-.0807992-.29084323-.2281155-.31072325-.4353051-.0243413-.253497-.04473006-.5075112-.07713294-.7599341-.01068356-.0833055-.04586494-.1660143-.08261169-.2426362-.11892795-.2480865-.334908-.3621045-.60309269-.3153993-.18979947.0330198-.36069726-.0008752-.49653106-.1398769-.14557815-.1489872-.19891767-.33019852-.13364231-.53802468.06895395-.21944279.22693755-.33206834.43974776-.3743974.6623023-.1316418 1.30765962.17520414 1.64788984.78197378.24525222.4373738.33060328.9156047.34919189 1.4592786M3.93288758 5.72742491c-.24458694.01965278-.45172273-.05553701-.57213777-.29662172-.16788448-.33616598.06222291-.73984364.43199924-.76474777.14624342-.00982639.29260425-.01929473.43845633-.03349725.40832322-.03974317.53734773-.30246982.50290989-.70944946-.00880513-.10375395-.01643625-.21443013.00888339-.31305208.06124457-.23798165.25945783-.37801765.50091406-.37809725.230577-.00007953.4363431.1438552.49441783.37702311.16694526.67070086-.00770938 1.46699651-.80960235 1.87349876-.31154506.15793834-.64167873.23523662-.99584062.24494366m4.48415915 5.69321559c.02066271-.5199235.12409363-1.0172105.41470205-1.45800561.34958323-.53034659.97153847-.78957233 1.58488422-.66286362.2862646.05915726.4635803.27903766.451801.5602236-.0108401.25823113-.2097969.47222373-.4707809.50062873-.0541222.0059276-.1106707-.0005968-.1650277-.0087523-.30289649-.0454719-.52138111.074235-.64199182.362383-.11607118.2772076-.12953325.5723574-.12972892.8677856-.0001174.1843144-.059327.3371606-.20224405.4523322-.15994029.1288968-.34003455.1508968-.52431613.0735985-.18068127-.0757468-.29397394-.2174934-.31569326-.4197102-.0094704-.0881988-.00160449-.178347-.00160449-.2676199m1.65053917-5.69259498c-.49437865-.01698732-.95506305-.14266168-1.33779269-.47461066-.49919217-.43295792-.61088035-.99672219-.47567269-1.62183178.06230119-.28778991.35048331-.4521333.62449895-.3891171.27773336.06389143.43892594.33791643.40006597.63752188-.0177668.13673402-.00277851.28281703.02387168.41927257.03467265.17731264.16706267.27748612.33506454.3064879.18541647.03202528.37439414.04459669.56231514.0592766.2284638.01786255.4087146.1603651.4714462.38167769.0620664.21904495-.0144012.44739912-.1947694.58154725-.1053094.07833264-.2178585.10562375-.4090277.09977565"></path></g></svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">Kejang dan Epilepsi</span><span class="dsb_profil_ket">Saturasi rendah dan jeda animasi</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
           <div class="box_profile_aksesbilitas display_none_mobile" id="action_adhd">
                <div class="icon_list_content_profile_disabilitas">
                    <span class="svg_icon_layout_dsb">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="17" height="17">
    <g fill="none" fill-rule="evenodd" class="fill_icon_dsb"  stroke="currentColor" transform="translate(1 1)">
        <circle cx="7" cy="7" r="7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle>
        <circle cx="7" cy="7" r="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle>
        <circle cx="7" cy="7" r="1" fill="currentColor"></circle>
    </g>
</svg>
                    </span>

                </div>
                <div class="text_list_content_profile_disabilitas"><span class="dsb_profil_nama">ADHD</span><span class="dsb_profil_ket">Saturasi rendah dan masker bacaan</span></div>
                <svg class="dsb_profil_centang" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>

              </div>

                </div>

                <div class="layout_content_title">
                    <div class="group_row_widget_dsb">
                        <div class="group_action_bahasa" id="dropdown_struktur_widget" aria-expanded="false">
                            <div class="box_content_disabilitas">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path></svg>
                            </div>
                            <div class="row_data_widget">
                                <div class="text_column_layaout_disabilitas" id="text_name_struktur_widget">
                                    <span class="dsb_baris_judul">Struktur Halaman</span>
                                    <span class="dsb_baris_nilai">Lompat ke judul atau bagian halaman</span>
                                </div>
                                <div class="icon_column_layaout_disabilitas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 6 11" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="m.5 10.5 5-5-5-5"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div class="box_button_switch">

                        </div>
                    </div>
                </div>

                <div class="layout_bahasa_widget" id="show_struktur_widget_dsb">
                    <div class="dsb_struktur_isi" id="dsb_struktur_daftar"></div>
                </div>

                <div class="layout_content_title">
                    <div class="group_row_widget_dsb">
                        <div class="group_action_bahasa" id="dropdown_warna_widget" aria-expanded="false">
                            <div class="box_content_disabilitas">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                            </div>
                            <div class="row_data_widget">
                                <div class="text_column_layaout_disabilitas" id="text_name_warna_widget">
                                    <span class="dsb_baris_judul">Pengaturan Warna</span>
                                    <span class="dsb_baris_nilai" id="text_nilai_warna_widget">Warna teks, judul, dan latar</span>
                                </div>
                                <div class="icon_column_layaout_disabilitas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 6 11" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="m.5 10.5 5-5-5-5"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div class="box_button_switch">

                        </div>
                    </div>
                </div>

                <div class="layout_bahasa_widget" id="show_warna_widget_dsb">
                    <div class="dsb_warna_isi" id="dsb_warna_isi"></div>
                </div>

                <div class="content_daftar_action_disabilitas ${name_class_widget5}">
                    <div class="dsb_kelompok_fitur" role="group" aria-label="Suara &amp; Gerak">
                        <div class="dsb_kelompok_judul">Suara &amp; Gerak</div>
                        <div class="layout_grid_disabilitas">
                            <div class="box_group_disabilitas" id="action_moda_suara">
                            <div class="box_icon_disabilitas">
                                <svg data-name="Layer 1" width="55px" height="55px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                    </defs>
                                    <line class="icon_svg_sroke_color" x1="2.5" x2="2.5" y1="10.5" y2="13.5" />
                                    <line class="icon_svg_sroke_color" x1="4.875" x2="4.875" y1="8" y2="16" />
                                    <line class="icon_svg_sroke_color" x1="7.25" x2="7.25" y1="5.045" y2="18.955" />
                                    <line class="icon_svg_sroke_color" x1="9.625" x2="9.625" y1="8.909" y2="15.091" />
                                    <line class="icon_svg_sroke_color" x1="12" x2="12" y1="10" y2="14" />
                                    <line class="icon_svg_sroke_color" x1="14.375" x2="14.375" y1="6.5" y2="17.5" />
                                    <line class="icon_svg_sroke_color" x1="16.75" x2="16.75" y1="3.5" y2="20.5" />
                                    <line class="icon_svg_sroke_color" x1="19.125" x2="19.125" y1="8.136" y2="15.864" />
                                    <line class="icon_svg_sroke_color" x1="21.5" x2="21.5" y1="10.455" y2="13.545" />
                                </svg>
                            </div>
                           <div class="box_text_bottom_disabilitas">${my_website_jkt}
                            </div>
                            <div class="box_column_action_strip">

                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_baca_halaman">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6.08-7.95c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27l-1.68 1.69zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_baca_halaman">Baca Halaman</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas" id="action_isyarat_sibi">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(2.7 2) scale(1.18)">
                                        <path class="icon_svg_color" d="M2 4.25a.85.85 0 0 1 1.7 0V10H2ZM4.1 2.65a.85.85 0 0 1 1.7 0V10H4.1ZM6.2 3.25a.85.85 0 0 1 1.7 0V10H6.2ZM8.3 5.05a.85.85 0 0 1 1.7 0V10H8.3ZM2 8.6h8v2.6a4 4 0 0 1-8 0ZM9.4 10.4l3-3a.95.95 0 0 1 1.35 1.35l-3.4 3.6Z" />
                                    </g>
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_isyarat_sibi">SIBI (Abjad 1&nbsp;Tangan)</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas" id="action_isyarat_bisindo">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(0.4 0.6) scale(.94) rotate(-10 7 8)">
                                        <path class="icon_svg_color" d="M2 4.25a.85.85 0 0 1 1.7 0V10H2ZM4.1 2.65a.85.85 0 0 1 1.7 0V10H4.1ZM6.2 3.25a.85.85 0 0 1 1.7 0V10H6.2ZM8.3 5.05a.85.85 0 0 1 1.7 0V10H8.3ZM2 8.6h8v2.6a4 4 0 0 1-8 0ZM9.4 10.4l3-3a.95.95 0 0 1 1.35 1.35l-3.4 3.6Z" />
                                    </g>
                                    <g transform="translate(23.6 7.4) scale(-.94 .94) rotate(-10 7 8)">
                                        <path class="icon_svg_color" d="M2 4.25a.85.85 0 0 1 1.7 0V10H2ZM4.1 2.65a.85.85 0 0 1 1.7 0V10H4.1ZM6.2 3.25a.85.85 0 0 1 1.7 0V10H6.2ZM8.3 5.05a.85.85 0 0 1 1.7 0V10H8.3ZM2 8.6h8v2.6a4 4 0 0 1-8 0ZM9.4 10.4l3-3a.95.95 0 0 1 1.35 1.35l-3.4 3.6Z" />
                                    </g>
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_isyarat_bisindo">BISINDO (Abjad 1&nbsp;dan 2&nbsp;Tangan)</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas" id="action_bisukan_media">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_bisukan_media">Bisukan Media</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas" id="action_animate_pause">
                            <div class="box_icon_disabilitas">

                                <svg height="40" width="40" id="svg_animasi_pause" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg">
                                    <defs />
                                    <g transform="matrix(10.666667,0,0,10.666667,-13434.667,-10410.667)">
                                        <g>
                                            <path class="icon_svg_color" d="m 1293,987 c 0,2.812 -3.311,5.562 -5.973,7.771 -1.203,0.998 -2.48,1.995 -3.527,3.229 -1.046,-1.233 -2.324,-2.23 -3.527,-3.229 -2.658,-2.209 -5.973,-4.959 -5.973,-7.771 0,0 7.436,3.399 9.5,3.399 2.064,0 9.5,-3.399 9.5,-3.399 z" />
                                            <path class="icon_svg_color" d="m 1283.5,1006 c 1.051,0.927 2.322,1.684 3.526,2.436 2.663,1.658 5.974,3.728 5.974,5.839 V 1018 h -19 v -3.727 c 0,-2.111 3.311,-4.181 5.973,-5.839 1.205,-0.75 2.481,-1.507 3.527,-2.434" />
                                            <g>
                                                <path class="icon_svg_color" d="m 1294,981 v 6.517 c 0,3.725 -3.01,6.452 -5.208,8.444 -1.621,1.469 -2.792,2.53 -2.792,4.039 0,1.509 1.172,2.57 2.793,4.04 2.197,1.991 5.207,4.72 5.207,8.442 V 1019 h -21 v -6.518 c 0,-3.724 3.01,-6.451 5.207,-8.442 1.621,-1.47 2.793,-2.531 2.793,-4.04 0,-1.509 -1.171,-2.57 -2.792,-4.039 -2.198,-1.992 -5.208,-4.72 -5.208,-8.444 V 981 h 21 m 2,-2 h -25 c 0,0 0,1.542 0,8.517 0,6.977 8,10.647 8,12.483 0,1.836 -8,5.508 -8,12.482 0,6.976 0,8.518 0,8.518 h 25 c 0,0 0,-1.542 0,-8.518 0,-6.976 -8,-10.646 -8,-12.482 0,-1.835 8,-5.507 8,-12.483 0,-6.975 0,-8.517 0,-8.517 l 0,0 z" />
                                            </g>
                                            <rect class="icon_svg_sroke_color" height="2" width="29" x="1269" y="976" />
                                            <rect class="icon_svg_sroke_color" height="2" width="29" x="1269" y="1022" />
                                        </g>
                                    </g>
                                </svg>

                                <svg class="hidden_svg" id="svg_animasi_play" version="1.1" height="50" width="50" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g>
                                        <g>
                                            <path class="active_icon_svg_color" d="M224.6,366C224.6,366,224.6,366,224.6,366c-18.8,0-33.6-14-33.6-31.9V215.8c0-18,15-32.6,33.8-32.6    c7.2,0,13.9,2.2,19.6,6.5l81.1,59c8.2,6.1,12.8,15.4,12.8,25.5c0,10.5-5.1,20.5-13.6,26.9l-80.5,58.9    C238.6,364.1,231.8,366,224.6,366z M225,217.4v115.1l78.7-57.8L225,217.4z" />
                                        </g>
                                        <g>
                                            <path class="active_icon_svg_color" d="M262,65c12.4,0,22.4,10.1,22.4,22.4s-10.1,22.4-22.4,22.4s-22.4-10.1-22.4-22.4S249.6,65,262,65 M262,31    c-31.2,0-56.4,25.3-56.4,56.4s25.3,56.4,56.4,56.4s56.4-25.3,56.4-56.4S293.2,31,262,31L262,31z" />
                                        </g>
                                        <g>
                                            <path class="active_icon_svg_color" d="M256.1,481c-9.4,0-17-7.6-17-17s7.6-17,17-17c6.6,0,13.2-0.4,19.7-1.1c9.3-1.1,17.8,5.7,18.8,15c1.1,9.3-5.7,17.8-15,18.8    C271.9,480.6,263.9,481,256.1,481z M342.5,460.3c-6.2,0-12.2-3.4-15.2-9.3c-4.3-8.4-1-18.6,7.4-22.9c5.8-3,11.5-6.3,17-10    c7.8-5.2,18.4-3.1,23.6,4.8c5.2,7.8,3.1,18.4-4.8,23.6c-6.5,4.3-13.4,8.3-20.3,11.9C347.7,459.7,345.1,460.3,342.5,460.3z     M410,402.5c-3.5,0-7-1.1-10-3.2c-7.6-5.5-9.3-16.2-3.8-23.8c3.9-5.3,7.4-10.9,10.6-16.6c4.6-8.2,15-11.1,23.2-6.4    c8.2,4.6,11.1,15,6.4,23.2c-3.8,6.8-8.1,13.5-12.7,19.8C420.4,400.1,415.2,402.5,410,402.5z M443.9,320.4c-0.9,0-1.8-0.1-2.6-0.2    c-9.3-1.4-15.6-10.1-14.2-19.4c1-6.5,1.7-13.1,1.9-19.6c0.4-9.4,8.4-16.7,17.7-16.3c9.4,0.4,16.7,8.3,16.3,17.7    c-0.3,7.8-1.1,15.7-2.3,23.4C459.4,314.4,452.2,320.4,443.9,320.4z M436.8,231.8c-7.2,0-13.8-4.6-16.2-11.7    c-2-6.2-4.4-12.4-7.2-18.3c-3.9-8.5-0.2-18.6,8.4-22.6c8.6-3.9,18.6-0.2,22.6,8.4c3.3,7.1,6.2,14.5,8.6,22    c2.9,8.9-2,18.5-10.9,21.5C440.4,231.6,438.6,231.8,436.8,231.8z M390.2,156.2c-4.3,0-8.7-1.7-12-5c-4.6-4.6-9.6-9-14.7-13.1    c-7.4-5.8-8.6-16.5-2.8-23.9c5.8-7.4,16.5-8.6,23.9-2.8c6.1,4.9,12.1,10.1,17.6,15.7c6.7,6.6,6.7,17.4,0.1,24.1    C398.9,154.5,394.6,156.2,390.2,156.2z M314.4,109.9c-1.7,0-3.5-0.3-5.2-0.8c-3.1-1-6.2-1.9-9.3-2.7c-9.1-2.4-14.5-11.7-12.2-20.8    c2.4-9.1,11.7-14.5,20.8-12.2c3.7,1,7.5,2.1,11.1,3.2c8.9,2.9,13.9,12.5,11,21.4C328.3,105.3,321.6,109.9,314.4,109.9z" />
                                        </g>
                                        <g>
                                            <path class="active_icon_svg_color" d="M256.1,481C141.9,481,49,388.1,49,273.9C49,176.9,114.8,94,209.2,72.1c9.1-2.1,18.3,3.6,20.4,12.7    c2.1,9.2-3.6,18.3-12.7,20.4C138,123.5,83,192.9,83,273.9C83,369.3,160.6,447,256.1,447c9.4,0,17,7.6,17,17S265.5,481,256.1,481z" />
                                        </g>
                                    </g>
                                </svg>

                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_id_animasi">
                                Animasi Dijeda
                            </div>
                            <div class="box_column_action_strip">

                            </div>
                        </div>
                        </div>
                    </div>

                    <div class="dsb_kelompok_fitur" role="group" aria-label="Teks &amp; Bacaan">
                        <div class="dsb_kelompok_judul">Teks &amp; Bacaan</div>
                        <div class="layout_grid_disabilitas">
                            <div class="box_group_disabilitas" id="action_perbesar_text">
                            <div class="box_icon_disabilitas">

                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="55px" height="55px"  viewBox="0 0 234.000000 174.000000" preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,174.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                        <path class="icon_svg_color" d="M900 1470 l0 -100 250 0 250 0 0 -590 0 -590 95 0 95 0 0 590 0 590
                                            248 2 247 3 3 98 3 97 -596 0 -595 0 0 -100z" />
                                        <path class="icon_svg_color" d="M117 1173 c-4 -3 -7 -48 -7 -100 l0 -93 200 0 200 0 0 -395 0 -395 100 0 100 0 0 395 0 395 195 0 195 0 0 100 0 100 -488 0 c-269 0 -492 -3 -495-7z" />
                                    </g>
                                </svg>

                            </div>
                            <div class="box_text_bottom_disabilitas">
                                Perbesar Teks
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_perbesar_text">
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_3"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_4"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_perkecil_text">
                            <div class="box_icon_disabilitas">
                                <svg version="1.1" width="45px" height="45px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path class="icon_svg_color" d="M16 9v8h-2V9h-4V7h10v2h-4zM8 5v12H6V5H0V3h15v2H8z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="id_perkecil_text">
                                Perkecil Teks
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_perkecil_text">
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_3"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_4"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_tulisan_dapat_di_baca">
                            <div class="box_icon_disabilitas">

<svg version="1.0" id="svg_dy_seleksia" xmlns="http://www.w3.org/2000/svg"
 height="50" width="50"  viewBox="0 0 100.000000 74.000000">

<g transform="translate(0.000000,74.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path  class="icon_svg_color" d="M795 682 c-37 -23 -53 -54 -57 -112 -3 -44 -4 -45 -41 -48 -34 -3
-37 -6 -37 -33 0 -27 3 -29 35 -29 l36 0 -6 -173 c-3 -94 -8 -184 -10 -199 -4
-28 -4 -28 49 -28 l54 0 -4 108 c-2 59 -6 149 -9 200 l-4 92 59 0 c60 0 60 0
60 30 l0 30 -60 0 -60 0 0 38 c0 21 7 48 16 61 14 20 22 22 54 17 29 -5 39 -2
44 10 10 26 7 32 -25 43 -44 15 -59 14 -94 -7z"/>
<path  class="icon_svg_color" d="M55 365 l0 -305 111 0 c180 0 263 23 342 95 54 48 86 117 90 195 8
142 -74 256 -219 301 -47 15 -91 19 -192 19 l-132 0 0 -305z m304 234 c200
-46 233 -291 51 -385 -27 -13 -65 -19 -160 -22 l-126 -4 -3 191 c-1 105 0 200
4 211 6 18 15 20 98 20 51 0 112 -5 136 -11z"/>
</g>
</svg>

        <svg  id="svg_font_di_perbesar"  version="1.1" xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 448 448">
                                    <path class="active_icon_svg_color" d="M181.25 139.75l-42.5 112.5c24.75 0.25 49.5 1 74.25 1 4.75 0 9.5-0.25 14.25-0.5-13-38-28.25-76.75-46-113zM0 416l0.5-19.75c23.5-7.25 49-2.25 59.5-29.25l59.25-154 70-181h32c1 1.75 2 3.5 2.75 5.25l51.25 120c18.75 44.25 36 89 55 133 11.25 26 20 52.75 32.5 78.25 1.75 4 5.25 11.5 8.75 14.25 8.25 6.5 31.25 8 43 12.5 0.75 4.75 1.5 9.5 1.5 14.25 0 2.25-0.25 4.25-0.25 6.5-31.75 0-63.5-4-95.25-4-32.75 0-65.5 2.75-98.25 3.75 0-6.5 0.25-13 1-19.5l32.75-7c6.75-1.5 20-3.25 20-12.5 0-9-32.25-83.25-36.25-93.5l-112.5-0.5c-6.5 14.5-31.75 80-31.75 89.5 0 19.25 36.75 20 51 22 0.25 4.75 0.25 9.5 0.25 14.5 0 2.25-0.25 4.5-0.5 6.75-29 0-58.25-5-87.25-5-3.5 0-8.5 1.5-12 2-15.75 2.75-31.25 3.5-47 3.5z"></path>
                                </svg>

                            </div>
                            <div class="box_text_bottom_disabilitas"  id="text_tulisan_dapat_di_baca">
                                Ramah Disleksia
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_tulisan_dapat_dibaca">
                                    <div class="strip_loading_unprocess_v2" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v2" id="strip_loading_2"></div>

                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_teks_tebal">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_teks_tebal">Teks Tebal</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas" id="action_tulisan_line_height">
                            <div class="box_icon_disabilitas">
                                <svg fill="none" height="50" width="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M5.09668 6.99707H7.17358L4.17358 3.99707L1.17358 6.99707H3.09668V17.0031H1.15881L4.15881 20.0031L7.15881 17.0031H5.09668V6.99707Z" fill="currentColor" />
                                    <path class="icon_svg_color" d="M22.8412 7H8.84119V5H22.8412V7Z" fill="currentColor" />
                                    <path class="icon_svg_color" d="M22.8412 11H8.84119V9H22.8412V11Z" fill="currentColor" />
                                    <path class="icon_svg_color" d="M8.84119 15H22.8412V13H8.84119V15Z" fill="currentColor" />
                                    <path class="icon_svg_color" d="M22.8412 19H8.84119V17H22.8412V19Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_id_tinggi_garis">
                                Tinggi Garis
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_tulisan_line_height">
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_3"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_space_text">
                            <div class="box_icon_disabilitas">
                                <svg version="1.0" width="50" height="50" xmlns="http://www.w3.org/2000/svg" width="208.000000pt" height="207.000000pt" viewBox="0 0 208.000000 207.000000" preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0.000000,207.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                        <path class="icon_svg_color" d="M270 1825 l0 -105 320 0 320 0 0 -480 0 -480 110 0 110 0 0 480 0
480 320 0 320 0 0 105 0 105 -750 0 -750 0 0 -105z" />
                                        <path class="icon_svg_color" d="M300 625 l-185 -185 188 -188 187 -187 0 133 0 132 530 0 530 0 0
-132 0 -133 187 188 188 187 -188 187 -187 188 0 -133 0 -132 -530 0 -529 0
-3 130 -3 130 -185 -185z" />
                                    </g>
                                </svg>

                            </div>
                            <div class="box_text_bottom_disabilitas" id="id_space_text">
                                Spasi Huruf
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_space_text">
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_3"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_spasi_kata">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M1 4h8v2.5H1zM1 9h6v2.5H1zM15 4h8v2.5h-8zM17 9h6v2.5h-6zM6 18l3.5-3.5v2.25h5V14.5L18 18l-3.5 3.5v-2.25h-5v2.25z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_spasi_kata">Spasi Kata</div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_spasi_kata">
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_3"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_perataan_text">
                            <div class="box_icon_disabilitas">

                                <svg id="svg_left_text_icon"  height="55px" width="55px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="68" y2="68" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="168" y1="108" y2="108" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="148" y2="148" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="168" y1="188" y2="188" />
                                </svg>

                                <svg class="hidden_svg"  height="55px" width="55px" id="svg_center_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <path class="active_icon_svg_color" d="M40,76H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Z" />
                                    <path class="active_icon_svg_color" d="M64,100a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z" />
                                    <path class="active_icon_svg_color" d="M216,140H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                                    <path class="active_icon_svg_color" d="M192,180H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z" />
                                </svg>

                                <svg class="hidden_svg"  height="55px" width="55px" id="svg_right_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="68" y2="68" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="88" x2="216" y1="108" y2="108" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="148" y2="148" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="88" x2="216" y1="188" y2="188" />
                                </svg>

                                <svg class="hidden_svg" height="55px" width="55px" id="svg_right_left_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="68" y2="68" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="108" y2="108" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="148" y2="148" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="188" y2="188" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_rata_tulisan">
                                Rata Tulisan
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_perataan_text">
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_3"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_4"></div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div class="dsb_kelompok_fitur" role="group" aria-label="Warna &amp; Gambar">
                        <div class="dsb_kelompok_judul">Warna &amp; Gambar</div>
                        <div class="layout_grid_disabilitas">
                            <div class="box_group_disabilitas" id="action_kontras">
                            <div class="box_icon_disabilitas">
                                <svg id="svg_kontras_multi" width="45px" height="45px" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path class="circle_multi" d="M27,15.1c1.2,1.5,2,3.4,2,5.4c0,4.7-3.8,8.5-8.5,8.5S12,25.2,12,20.5s3.8-8.5,8.5-8.5c0.5,0,1,0,1.4,0.1" />
                                    <path class="circle_multi" d="M19.7,22.6c-0.9,3.7-4.3,6.4-8.2,6.4C6.8,29,3,25.2,3,20.5c0-2.2,0.8-4.2,2.2-5.7" />
                                    <path class="circle_multi" d="M10.5,12.1c0.3,0,0.7-0.1,1-0.1c3.5,0,6.4,2.1,7.8,5" />
                                    <path class="circle_single" d="M9.7,17.5C8.4,16,7.7,14.1,7.7,12c0-4.7,3.8-8.5,8.5-8.5s8.5,3.8,8.5,8.5s-3.8,8.5-8.5,8.5c-0.3,0-0.6,0-0.9,0" />
                                </svg>

    <svg id="svg_balikan_warna" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="50px" height="50px">

    <path class="active_icon_svg_color" fill-rule="nonzero"
        d="m14.1 33.9-7.805 7.805a1 1 0 0 0 .708.295h33.994c.551 0 1.003-.451 1.003-1.003V7.003a1 1 0 0 0-.295-.708L33.9 14.1A13.956 13.956 0 0 1 38 24c0 7.732-6.268 14-14 14a13.956 13.956 0 0 1-9.9-4.1ZM4 7.002A3.006 3.006 0 0 1 7.003 4h33.994A3.006 3.006 0 0 1 44 7.003v33.994A3.006 3.006 0 0 1 40.997 44H7.003A3.006 3.006 0 0 1 4 40.997V7.003ZM33.9 14.1A13.956 13.956 0 0 0 24 10c-7.732 0-14 6.268-14 14 0 3.866 1.567 7.366 4.1 9.9l19.8-19.8Z"
        class="color000 svgShape"></path>

</svg>

                                <svg id="svg_kontras_warna" viewBox="0 0 512 512" width="50px" height="50px" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="icon_contrast_white" cx="256" cy="256" r="208" />
                                    <path class="icon_contrast_black" d="M256,464C141.12,464,48,370.88,48,256S141.12,48,256,48Z" />
                                </svg>

                                <svg width="60px" height="60px" id="svg_kontras_klise" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g>
                                        <path class="active_icon_svg_color" d="M256,128c-81.9,0-145.7,48.8-224,128c67.4,67.7,124,128,224,128c99.9,0,173.4-76.4,224-126.6   C428.2,198.6,354.8,128,256,128z M256,347.3c-49.4,0-89.6-41-89.6-91.3c0-50.4,40.2-91.3,89.6-91.3s89.6,41,89.6,91.3   C345.6,306.4,305.4,347.3,256,347.3z" />
                                        <g>
                                            <path class="active_icon_svg_color" d="M256,224c0-7.9,2.9-15.1,7.6-20.7c-2.5-0.4-5-0.6-7.6-0.6c-28.8,0-52.3,23.9-52.3,53.3c0,29.4,23.5,53.3,52.3,53.3    s52.3-23.9,52.3-53.3c0-2.3-0.2-4.6-0.4-6.9c-5.5,4.3-12.3,6.9-19.8,6.9C270.3,256,256,241.7,256,224z" />
                                        </g>
                                    </g>
                                </svg>

                                <svg id="svg_kontras_light" preserveAspectRatio="xMidYMid" width="50px" height="50px" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
                                        <path class="active_icon_svg_sroke_color" d="M14.958 16.63l2.452-4.791v0c1.53-2.99.35-6.66-2.64-8.19 -2.99-1.54-6.66-.36-8.19 2.63 -.9 1.74-.9 3.8 0 5.54l2.452 4.79" />
                                        <path class="active_icon_svg_sroke_color" d="M9.05 16.63v1.72 0c0 1.62 1.32 2.95 2.95 2.95v0h0c1.63-.001 2.95-1.33 2.95-2.96v-1.73" />
                                        <line class="active_icon_svg_sroke_color" x1="3.71" x2="1.5" y1="9.08" y2="9.08" />
                                        <line class="active_icon_svg_sroke_color" x1="22.5" x2="20.29" y1="9.08" y2="9.08" />
                                        <line class="active_icon_svg_sroke_color" x1="5.01" x2="3.14" y1="4.62" y2="3.44" />
                                        <line class="active_icon_svg_sroke_color" x1="20.86" x2="18.99" y1="14.72" y2="13.53" />
                                        <line class="active_icon_svg_sroke_color" x1="5.01" x2="3.14" y1="13.53" y2="14.72" />
                                        <line class="active_icon_svg_sroke_color" x1="20.86" x2="18.99" y1="3.44" y2="4.62" />
                                        <line class="active_icon_svg_sroke_color" x1="11.25" x2="14.96" y1="16.63" y2="16.63" />
                                    </g>
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_name_kontras">
                                Kontras+
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_kontras">
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_3"></div>
                                    <div class="strip_loading_unprocess_v4" id="strip_loading_4"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_grey_scale">
                            <div class="box_icon_disabilitas">
                                <svg version="1.1" width="50px" height="50px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <g class="dsb_isolasi">
                                        <g data-name="Layer 1">
                                            <path class="icon_svg_grey_scale_color_1" d="M36.64843,0S4.58051,35.08224,4.58051,68.3789c0,18.46444,14.35732,32.8026,32.06792,32.8026S68.71635,86.84334,68.71635,68.3789C68.71635,35.08224,36.64843,0,36.64843,0Z" />
                                            <path class="icon_svg_grey_scale_color_2" d="M36.64842,0s-.04336.04776-.11442.12681c7.72737,10.25554,23.909,34.51028,23.909,57.82942,0,16.9843-12.50526,30.1731-27.93125,30.1731-13.987,0-25.57232-10.84318-27.61209-25.527a55.61064,55.61064,0,0,0-.31916,5.77655c0,18.46443,14.35732,32.80255,32.06791,32.80255S68.71632,86.84334,68.71632,68.3789C68.71632,35.08225,36.64842,0,36.64842,0Z" />
                                            <circle class="icon_svg_grey_scale_color_4" cx="22.88945" cy="58.6888" r="6.85099" />
                                            <path class="icon_svg_grey_scale_color_3" d="M91.35157,26.81852S59.28365,61.90075,59.28365,95.1974C59.28365,113.66184,73.641,128,91.35157,128s32.06792-14.33816,32.06792-32.8026C123.41949,61.90075,91.35157,26.81852,91.35157,26.81852Z" />
                                            <path class="icon_svg_grey_scale_color_2" d="M91.35156,26.8185s-.04336.04776-.11442.12681c7.72737,10.25554,23.909,34.51028,23.909,57.82942,0,16.9843-12.50526,30.1731-27.93125,30.1731-13.987,0-25.57232-10.84318-27.61209-25.527a55.61064,55.61064,0,0,0-.31916,5.77655C59.28365,113.66184,73.641,128,91.35156,128s32.06791-14.33812,32.06791-32.80255C123.41946,61.90075,91.35156,26.8185,91.35156,26.8185Z" />
                                            <circle class="icon_svg_grey_scale_color_4" cx="77.59259" cy="85.5073" r="6.85099" />
                                        </g>
                                    </g>
                                </svg>

                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_tulisan_grey_scale">
                                Kejenuhan
                            </div>
                            <div class="box_column_action_strip">
                        <div class="box_row_action_strip" id="list_strip_loading_action_grey_scale">
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_3"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_hidden_image">
                            <div class="box_icon_disabilitas">
                                <svg fill="none" height="50px" width="50px" viewBox="0 0 64 64"  xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" clip-rule="evenodd" d="M5.41421 2.58579C4.63316 1.80474 3.36683 1.80474 2.58579 2.58579C1.80474 3.36683 1.80474 4.63316 2.58579 5.41421L5.36029 8.18871C3.25416 10.8981 2 14.3026 2 18V46C2 54.8366 9.16344 62 18 62H46C49.6974 62 53.1019 60.7458 55.8113 58.6397L58.5858 61.4142C59.3668 62.1953 60.6332 62.1953 61.4142 61.4142C62.1953 60.6332 62.1953 59.3668 61.4142 58.5858L5.41421 2.58579ZM52.9531 55.7815L8.2185 11.0469C6.82158 13.0086 6 15.4083 6 18V46C6 46.3848 6.01811 46.7653 6.05352 47.1408L10.589 39.8841C15.6167 31.8397 27.0207 31.0191 33.1483 38.2609L49.4299 57.5027C50.7062 57.1227 51.8935 56.536 52.9531 55.7815Z" fill="black" fill-rule="evenodd" />
                                    <path class="icon_svg_color" d="M58 46C58 47.2605 57.8057 48.4755 57.4453 49.6169L60.5322 52.7037C61.4743 50.6647 62 48.3937 62 46V18C62 9.16344 54.8366 2 46 2H18C15.6063 2 13.3353 2.52566 11.2963 3.46785L14.3831 6.55468C15.5245 6.19434 16.7395 6 18 6H46C52.6274 6 58 11.3726 58 18V46Z" fill="black" />
                                    <path class="icon_svg_color" d="M43 17C39.6863 17 37 19.6863 37 23C37 26.3137 39.6863 29 43 29C46.3137 29 49 26.3137 49 23C49 19.6863 46.3137 17 43 17Z" fill="black" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas">
                                Sembunyikan Gambar
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip">

                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_deskripsi_gambar">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM6 17h12l-3.75-5-3 4-2.25-3zM8.5 10A1.5 1.5 0 1 0 8.5 7a1.5 1.5 0 0 0 0 3z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_deskripsi_gambar">Deskripsi Gambar</div>
                            <div class="box_column_action_strip"></div>
                        </div>
                        </div>
                    </div>

                    <div class="dsb_kelompok_fitur" role="group" aria-label="Navigasi &amp; Fokus">
                        <div class="dsb_kelompok_judul">Navigasi &amp; Fokus</div>
                        <div class="layout_grid_disabilitas">
                            <div class="box_group_disabilitas" id="action_garis_bawahi_tautan">
                            <div class="box_icon_disabilitas">

                                <svg fill="#000000" id="svg_decoration_link" width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect class="icon_fill_svg_color_black" x="2" y="2" width="20" height="20" rx="2"></rect>
                                    <path class="icon_fill_svg_color_white" d="M7,6A1,1,0,0,1,8,5h2a1,1,0,0,1,0,2v4a2,2,0,0,0,4,0V7a1,1,0,0,1,0-2h2a1,1,0,0,1,0,2v4a4,4,0,0,1-8,0V7A1,1,0,0,1,7,6Zm9,11H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"></path>
                                </svg>

                                <svg version="1.0" id="svg_block_decoration_link" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 231.000000 129.000000" preserveAspectRatio="xMidYMid meet">
                                    <g class='active_icon_svg_color' transform="translate(0.000000,129.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path class='active_icon_svg_color' d="M435 1136 c-495 -161 -489 -863 9 -1015 61 -19 93 -21 293 -21 l225
0 29 29 c31 32 38 79 18 124 -22 48 -40 52 -274 57 -216 5 -221 6 -277 33 -62
30 -115 83 -150 149 -19 36 -23 58 -23 138 0 80 4 102 23 138 35 66 88 119
150 149 56 27 61 28 277 33 234 5 252 9 274 57 20 45 13 92 -18 124 l-29 29
-229 0 c-209 -1 -234 -3 -298 -24z" />
                                        <path class='active_icon_svg_color' d="M1269 1131 c-31 -32 -38 -79 -18 -124 22 -48 40 -52 274 -57 216 -5
221 -6 277 -33 62 -30 115 -83 150 -149 19 -36 23 -58 23 -138 0 -80 -4 -102
-23 -138 -35 -66 -88 -119 -150 -149 -56 -27 -61 -28 -277 -33 -234 -5 -252
-9 -274 -57 -20 -45 -13 -92 18 -124 l29 -29 225 0 c253 0 310 10 417 75 338
205 338 705 0 910 -107 65 -164 75 -417 75 l-225 0 -29 -29z" />
                                        <path class='active_icon_svg_color' d="M763 724 c-29 -15 -63 -65 -63 -94 0 -30 34 -80 65 -94 49 -24 681
-24 730 0 31 14 65 64 65 94 0 30 -34 80 -65 94 -49 24 -684 23 -732 0z" />
                                    </g>
                                </svg>

                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_garis_bawahi_tautan">
                                Garis Bawahi Tautan
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_garis_bawahi_tautan">
                                    <div class="strip_loading_unprocess_v2" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v2" id="strip_loading_2"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas" id="action_sorot_judul">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M5 2h3v6.5h8V2h3v15h-3v-5.5H8V17H5zM3 19.5h18V22H3z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_sorot_judul">Sorot Judul</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas display_none_mobile" id="action_sorot_fokus">
                            <div class="box_icon_disabilitas">
                                <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_sorot_fokus">Sorot Fokus</div>
                            <div class="box_column_action_strip"></div>
                        </div>

                            <div class="box_group_disabilitas display_none_mobile" id="action_kursor">
                            <div class="box_icon_disabilitas">

                                <svg width="50" height="50" id="svg_kursor_web" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z" />
                                </svg>

<svg version="1.1"
    xmlns="http://www.w3.org/2000/svg" width="50" height="50" id="svg_kursor_masker"  viewBox="15 -10 80 100">
    <path d="M0 0 C1.22237869 -0.01029488 1.22237869 -0.01029488 2.4694519 -0.02079773 C5.16600921 -0.03911514 7.86198752 -0.03522165 10.55859375 -0.02954102 C12.43042186 -0.03410014 14.30224829 -0.0394049 16.17407227 -0.04542542 C20.09821368 -0.05436598 24.02215169 -0.05192229 27.94628906 -0.04199219 C32.98059567 -0.03049555 38.01420161 -0.05071973 43.04841614 -0.07990932 C46.91398596 -0.09823438 50.77938668 -0.09798637 54.64498901 -0.0922718 C56.5013833 -0.09211817 58.35778874 -0.09819742 60.21414185 -0.11056328 C62.8072742 -0.12540376 65.39909679 -0.11484867 67.9921875 -0.09765625 C69.14713211 -0.1121582 69.14713211 -0.1121582 70.32540894 -0.12695312 C75.49496442 -0.05500331 75.49496442 -0.05500331 77.97802734 2.21958923 C79.46734992 5.41522637 79.28081963 8.15392112 79.18359375 11.65405273 C79.14298828 13.54897461 79.14298828 13.54897461 79.1015625 15.48217773 C79.06675781 16.44639648 79.03195313 17.41061523 78.99609375 18.40405273 C80.97609375 18.89905273 80.97609375 18.89905273 82.99609375 19.40405273 C82.99609375 30.95405273 82.99609375 42.50405273 82.99609375 54.40405273 C81.67609375 54.40405273 80.35609375 54.40405273 78.99609375 54.40405273 C79.04830078 55.85038086 79.04830078 55.85038086 79.1015625 57.32592773 C79.12863281 58.58920898 79.15570313 59.85249023 79.18359375 61.15405273 C79.23580078 63.03350586 79.23580078 63.03350586 79.2890625 64.95092773 C78.96661321 68.75153009 78.77036524 69.86270061 75.99609375 72.40405273 C73.19833853 72.80134239 70.79138179 72.94090954 67.9921875 72.90576172 C67.17726837 72.9111647 66.36234924 72.91656769 65.5227356 72.9221344 C62.82598679 72.93465324 60.13029905 72.91811024 57.43359375 72.90014648 C55.56176701 72.9003014 53.68993994 72.90178913 51.81811523 72.90455627 C47.89389884 72.90594168 43.97004732 72.89335863 40.04589844 72.87060547 C35.01166889 72.8422204 29.97804579 72.84495626 24.94377136 72.85769558 C21.07819423 72.86464519 17.21275767 72.8568717 13.34719849 72.84443855 C11.49081969 72.83991706 9.63442584 72.83959332 7.77804565 72.84350395 C5.18504824 72.84640916 2.59289131 72.82994281 0 72.80810547 C-1.15494461 72.81485794 -1.15494461 72.81485794 -2.33322144 72.82174683 C-7.4778041 72.74963131 -7.4778041 72.74963131 -9.98583984 71.10218811 C-11.72773447 68.19670682 -11.31076421 64.99430598 -11.19140625 61.71655273 C-11.17110352 60.66371094 -11.17110352 60.66371094 -11.15039062 59.58959961 C-11.11510807 57.86075445 -11.06130208 56.13230508 -11.00390625 54.40405273 C-12.32390625 54.40405273 -13.64390625 54.40405273 -15.00390625 54.40405273 C-15.00390625 42.85405273 -15.00390625 31.30405273 -15.00390625 19.40405273 C-13.68390625 19.07405273 -12.36390625 18.74405273 -11.00390625 18.40405273 C-11.05611328 16.83204102 -11.05611328 16.83204102 -11.109375 15.22827148 C-11.13751562 13.84938127 -11.16481549 12.47047371 -11.19140625 11.09155273 C-11.21654297 10.40125977 -11.24167969 9.7109668 -11.26757812 8.99975586 C-11.34053757 3.96555398 -11.34053757 3.96555398 -9.98583984 1.70591736 C-6.87212761 -0.33937408 -3.60483981 -0.02107597 0 0 Z M-7.00390625 30.40405273 C-7.00390625 34.36405273 -7.00390625 38.32405273 -7.00390625 42.40405273 C20.05609375 42.40405273 47.11609375 42.40405273 74.99609375 42.40405273 C74.99609375 38.44405273 74.99609375 34.48405273 74.99609375 30.40405273 C47.93609375 30.40405273 20.87609375 30.40405273 -7.00390625 30.40405273 Z " fill="${bg_color_icon}" transform="translate(22.00390625,6.595947265625)"/>
    <path d="M0 0 C1.22237869 -0.01029488 1.22237869 -0.01029488 2.4694519 -0.02079773 C5.16600921 -0.03911514 7.86198752 -0.03522165 10.55859375 -0.02954102 C12.43042186 -0.03410014 14.30224829 -0.0394049 16.17407227 -0.04542542 C20.09821368 -0.05436598 24.02215169 -0.05192229 27.94628906 -0.04199219 C32.98059567 -0.03049555 38.01420161 -0.05071973 43.04841614 -0.07990932 C46.91398596 -0.09823438 50.77938668 -0.09798637 54.64498901 -0.0922718 C56.5013833 -0.09211817 58.35778874 -0.09819742 60.21414185 -0.11056328 C62.8072742 -0.12540376 65.39909679 -0.11484867 67.9921875 -0.09765625 C69.14713211 -0.1121582 69.14713211 -0.1121582 70.32540894 -0.12695312 C75.49496442 -0.05500331 75.49496442 -0.05500331 77.97802734 2.21958923 C79.46734992 5.41522637 79.28081963 8.15392112 79.18359375 11.65405273 C79.14298828 13.54897461 79.14298828 13.54897461 79.1015625 15.48217773 C79.06675781 16.44639648 79.03195313 17.41061523 78.99609375 18.40405273 C80.97609375 18.89905273 80.97609375 18.89905273 82.99609375 19.40405273 C82.99609375 30.95405273 82.99609375 42.50405273 82.99609375 54.40405273 C81.67609375 54.40405273 80.35609375 54.40405273 78.99609375 54.40405273 C79.04830078 55.85038086 79.04830078 55.85038086 79.1015625 57.32592773 C79.12863281 58.58920898 79.15570313 59.85249023 79.18359375 61.15405273 C79.23580078 63.03350586 79.23580078 63.03350586 79.2890625 64.95092773 C78.96661321 68.75153009 78.77036524 69.86270061 75.99609375 72.40405273 C73.19833853 72.80134239 70.79138179 72.94090954 67.9921875 72.90576172 C67.17726837 72.9111647 66.36234924 72.91656769 65.5227356 72.9221344 C62.82598679 72.93465324 60.13029905 72.91811024 57.43359375 72.90014648 C55.56176701 72.9003014 53.68993994 72.90178913 51.81811523 72.90455627 C47.89389884 72.90594168 43.97004732 72.89335863 40.04589844 72.87060547 C35.01166889 72.8422204 29.97804579 72.84495626 24.94377136 72.85769558 C21.07819423 72.86464519 17.21275767 72.8568717 13.34719849 72.84443855 C11.49081969 72.83991706 9.63442584 72.83959332 7.77804565 72.84350395 C5.18504824 72.84640916 2.59289131 72.82994281 0 72.80810547 C-1.15494461 72.81485794 -1.15494461 72.81485794 -2.33322144 72.82174683 C-7.4778041 72.74963131 -7.4778041 72.74963131 -9.98583984 71.10218811 C-11.72773447 68.19670682 -11.31076421 64.99430598 -11.19140625 61.71655273 C-11.17110352 60.66371094 -11.17110352 60.66371094 -11.15039062 59.58959961 C-11.11510807 57.86075445 -11.06130208 56.13230508 -11.00390625 54.40405273 C-12.32390625 54.40405273 -13.64390625 54.40405273 -15.00390625 54.40405273 C-15.00390625 42.85405273 -15.00390625 31.30405273 -15.00390625 19.40405273 C-13.68390625 19.07405273 -12.36390625 18.74405273 -11.00390625 18.40405273 C-11.05611328 16.83204102 -11.05611328 16.83204102 -11.109375 15.22827148 C-11.13751562 13.84938127 -11.16481549 12.47047371 -11.19140625 11.09155273 C-11.21654297 10.40125977 -11.24167969 9.7109668 -11.26757812 8.99975586 C-11.34053757 3.96555398 -11.34053757 3.96555398 -9.98583984 1.70591736 C-6.87212761 -0.33937408 -3.60483981 -0.02107597 0 0 Z M-7.96289062 2.69125366 C-9.80054001 5.71476655 -9.30804382 9.16719344 -9.19140625 12.59155273 C-9.17787109 13.34114258 -9.16433594 14.09073242 -9.15039062 14.86303711 C-9.11509164 16.7103504 -9.06128542 18.5572934 -9.00390625 20.40405273 C-10.65390625 20.73405273 -12.30390625 21.06405273 -14.00390625 21.40405273 C-14.00390625 31.63405273 -14.00390625 41.86405273 -14.00390625 52.40405273 C-12.35390625 52.40405273 -10.70390625 52.40405273 -9.00390625 52.40405273 C-9.03871094 53.52424805 -9.07351562 54.64444336 -9.109375 55.79858398 C-9.13751464 57.27122524 -9.16481462 58.74388271 -9.19140625 60.21655273 C-9.21654297 60.95454102 -9.24167969 61.6925293 -9.26757812 62.45288086 C-9.38280491 66.46256713 -9.38280491 66.46256713 -7.96289062 70.11685181 C-4.94629495 72.09898336 -1.85856613 71.82117876 1.6328125 71.79223633 C2.40871735 71.79749329 3.18462219 71.80275024 3.98403931 71.8081665 C6.55076177 71.82137858 9.11686489 71.8126244 11.68359375 71.80249023 C13.46574015 71.80451063 15.24788574 71.80742178 17.0300293 71.81118774 C20.7658678 71.81561272 24.50149118 71.80917449 28.23730469 71.79516602 C33.02938459 71.77807397 37.82096045 71.78791423 42.61302185 71.80588341 C46.29329231 71.81671658 49.973443 71.81327706 53.65371704 71.80550003 C55.42078714 71.80349673 57.18786807 71.80596185 58.95492554 71.81293869 C61.42336899 71.82054559 63.8909927 71.80896026 66.359375 71.79223633 C67.09193512 71.79830902 67.82449524 71.80438171 68.57925415 71.81063843 C71.46095257 71.77441181 73.50949494 71.72378496 75.95507812 70.11685181 C77.79272751 67.09333892 77.30023132 63.64091203 77.18359375 60.21655273 C77.17005859 59.46696289 77.15652344 58.71737305 77.14257812 57.94506836 C77.10727914 56.09775507 77.05347292 54.25081207 76.99609375 52.40405273 C78.64609375 52.40405273 80.29609375 52.40405273 81.99609375 52.40405273 C81.99609375 42.17405273 81.99609375 31.94405273 81.99609375 21.40405273 C80.34609375 21.07405273 78.69609375 20.74405273 76.99609375 20.40405273 C77.03089844 19.28385742 77.06570312 18.16366211 77.1015625 17.00952148 C77.12970214 15.53688023 77.15700212 14.06422276 77.18359375 12.59155273 C77.20873047 11.85356445 77.23386719 11.11557617 77.25976562 10.35522461 C77.37499241 6.34553834 77.37499241 6.34553834 75.95507812 2.69125366 C72.93848245 0.70912211 69.85075363 0.98692671 66.359375 1.01586914 C65.58347015 1.01061218 64.80756531 1.00535522 64.00814819 0.99993896 C61.44142573 0.98672689 58.87532261 0.99548107 56.30859375 1.00561523 C54.52644735 1.00359484 52.74430176 1.00068369 50.9621582 0.99691772 C47.2263197 0.99249274 43.49069632 0.99893098 39.75488281 1.01293945 C34.96280291 1.0300315 30.17122705 1.02019124 25.37916565 1.00222206 C21.69889519 0.99138889 18.0187445 0.9948284 14.33847046 1.00260544 C12.57140036 1.00460874 10.80431943 1.00214361 9.03726196 0.99516678 C6.56881851 0.98755988 4.1011948 0.99914521 1.6328125 1.01586914 C0.90025238 1.00979645 0.16769226 1.00372375 -0.58706665 0.99746704 C-3.46876507 1.03369366 -5.51730744 1.08432051 -7.96289062 2.69125366 Z " fill="${bg_color_icon}" transform="translate(22.00390625,6.595947265625)"/>
    <path d="M0 0 C28.38 0 56.76 0 86 0 C86 5.28 86 10.56 86 16 C57.62 16 29.24 16 0 16 C0 10.72 0 5.44 0 0 Z M2 2 C2 5.96 2 9.92 2 14 C29.06 14 56.12 14 84 14 C84 10.04 84 6.08 84 2 C56.94 2 29.88 2 2 2 Z " fill="#FEFEFE" transform="translate(13,35)"/>
    <path d="M0 0 C0.99 0 1.98 0 3 0 C3.33 3.3 3.66 6.6 4 10 C26.44 10 48.88 10 72 10 C72.33 6.7 72.66 3.4 73 0 C73.99 0 74.98 0 76 0 C76 4.62 76 9.24 76 14 C50.92 14 25.84 14 0 14 C0 9.38 0 4.76 0 0 Z " fill="#FDFDFE" transform="translate(18,59)"/>
    <path d="M0 0 C25.08 0 50.16 0 76 0 C76 4.62 76 9.24 76 14 C75.01 14 74.02 14 73 14 C72.67 10.7 72.34 7.4 72 4 C63.28155997 3.97687389 54.56313044 3.95908354 45.84466648 3.94818783 C41.79674258 3.94295959 37.74883959 3.93586301 33.70092773 3.92456055 C29.79764029 3.91372957 25.89437301 3.90772272 21.9910717 3.90512276 C20.49866353 3.90326889 19.00625652 3.899649 17.51385689 3.89426994 C15.43051861 3.88705669 13.34726469 3.88600917 11.26391602 3.88647461 C9.48187523 3.88314369 9.48187523 3.88314369 7.66383362 3.87974548 C5.07879307 3.69637405 5.07879307 3.69637405 4 5 C3.76807135 6.51469448 3.58784762 8.03754562 3.4375 9.5625 C3.35371094 10.38878906 3.26992188 11.21507812 3.18359375 12.06640625 C3.12300781 12.70449219 3.06242187 13.34257812 3 14 C2.01 14 1.02 14 0 14 C0 9.38 0 4.76 0 0 Z " fill="#F6FAFE" transform="translate(18,13)"/>
    <path d="M0 0 C1.22237869 -0.01029488 1.22237869 -0.01029488 2.4694519 -0.02079773 C5.16600921 -0.03911514 7.86198752 -0.03522165 10.55859375 -0.02954102 C12.43042186 -0.03410014 14.30224829 -0.0394049 16.17407227 -0.04542542 C20.09821368 -0.05436598 24.02215169 -0.05192229 27.94628906 -0.04199219 C32.98059567 -0.03049555 38.01420161 -0.05071973 43.04841614 -0.07990932 C46.91398596 -0.09823438 50.77938668 -0.09798637 54.64498901 -0.0922718 C56.5013833 -0.09211817 58.35778874 -0.09819742 60.21414185 -0.11056328 C62.8072742 -0.12540376 65.39909679 -0.11484867 67.9921875 -0.09765625 C69.14713211 -0.1121582 69.14713211 -0.1121582 70.32540894 -0.12695312 C75.49496442 -0.05500331 75.49496442 -0.05500331 77.97802734 2.21958923 C79.46734992 5.41522637 79.28081963 8.15392112 79.18359375 11.65405273 C79.14298828 13.54897461 79.14298828 13.54897461 79.1015625 15.48217773 C79.06675781 16.44639648 79.03195313 17.41061523 78.99609375 18.40405273 C80.97609375 18.89905273 80.97609375 18.89905273 82.99609375 19.40405273 C82.50109375 20.88905273 82.50109375 20.88905273 81.99609375 22.40405273 C80.34609375 21.74405273 78.69609375 21.08405273 76.99609375 20.40405273 C76.94710937 19.27225586 76.898125 18.14045898 76.84765625 16.97436523 C76.77262861 15.49256935 76.69708078 14.01079973 76.62109375 12.52905273 C76.59015625 11.78268555 76.55921875 11.03631836 76.52734375 10.26733398 C76.43965544 5.86932085 76.43965544 5.86932085 73.99609375 2.40405273 C71.44721251 2.20573757 69.00699154 2.13127011 66.45703125 2.14526367 C65.67966614 2.14175903 64.90230103 2.13825439 64.10137939 2.13464355 C61.52452743 2.12582068 58.94794865 2.13167728 56.37109375 2.13842773 C54.58512316 2.13708124 52.79915293 2.13514084 51.01318359 2.13262939 C47.26721716 2.12967738 43.521346 2.13397824 39.77539062 2.14331055 C34.96646542 2.15470514 30.15776344 2.14814608 25.34884644 2.13616562 C21.66005767 2.1289491 17.97132208 2.13123399 14.28253174 2.1364212 C12.50905328 2.13775828 10.73557004 2.13610797 8.96209717 2.1314621 C6.4863195 2.12640024 4.01090665 2.13410211 1.53515625 2.14526367 C0.42856659 2.13919098 0.42856659 2.13919098 -0.70037842 2.13299561 C-4.80460381 2.04236221 -4.80460381 2.04236221 -8.00390625 4.40405273 C-8.31029215 7.13840235 -8.51523985 9.78685094 -8.62890625 12.52905273 C-8.66757813 13.2831543 -8.70625 14.03725586 -8.74609375 14.81420898 C-8.84041656 16.67708458 -8.92325287 18.54053528 -9.00390625 20.40405273 C-10.98390625 21.06405273 -12.96390625 21.72405273 -15.00390625 22.40405273 C-14.67390625 21.08405273 -14.34390625 19.76405273 -14.00390625 18.40405273 C-13.01390625 18.40405273 -12.02390625 18.40405273 -11.00390625 18.40405273 C-11.05611328 16.83204102 -11.05611328 16.83204102 -11.109375 15.22827148 C-11.13751562 13.84938127 -11.16481549 12.47047371 -11.19140625 11.09155273 C-11.21654297 10.40125977 -11.24167969 9.7109668 -11.26757812 8.99975586 C-11.34053757 3.96555398 -11.34053757 3.96555398 -9.98583984 1.70591736 C-6.87212761 -0.33937408 -3.60483981 -0.02107597 0 0 Z " fill="${bg_color_icon}" transform="translate(22.00390625,6.595947265625)"/>
</svg>

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="10 0 100 95" id="svg_kursor_masker_v2">
<path d="M0 0 C0.81491913 -0.00525696 1.62983826 -0.01051392 2.4694519 -0.01593018 C5.16602689 -0.02914542 7.86201265 -0.02038684 10.55859375 -0.01025391 C12.43042108 -0.01227421 14.30224764 -0.01518528 16.17407227 -0.01895142 C20.09822072 -0.02337683 24.0221644 -0.01693673 27.94628906 -0.00292969 C32.98049722 0.01416233 38.01422559 0.0043223 43.04841614 -0.01364708 C46.91397731 -0.02447905 50.77942443 -0.02104128 54.64498901 -0.0132637 C56.50137387 -0.01126007 58.35776902 -0.01372668 60.21414185 -0.02070236 C62.80710344 -0.02830722 65.39928418 -0.01672655 67.9921875 0 C68.76215057 -0.00607269 69.53211365 -0.01214539 70.32540894 -0.0184021 C75.50634229 0.04362644 75.50634229 0.04362644 77.96931458 1.77641296 C79.34314242 3.93295785 79.42665084 5.50767635 79.5078125 8.05615234 C79.54326172 8.94882812 79.57871094 9.84150391 79.61523438 10.76123047 C79.63779297 11.69 79.66035156 12.61876953 79.68359375 13.57568359 C79.71775391 14.51605469 79.75191406 15.45642578 79.78710938 16.42529297 C79.86957593 18.74613752 79.93872778 21.06660508 79.99609375 23.38818359 C81.48109375 23.88318359 81.48109375 23.88318359 82.99609375 24.38818359 C82.99609375 32.30818359 82.99609375 40.22818359 82.99609375 48.38818359 C81.67609375 48.71818359 80.35609375 49.04818359 78.99609375 49.38818359 C79.0118042 49.97833252 79.02751465 50.56848145 79.04370117 51.17651367 C79.10607314 53.85113945 79.14509032 56.52561224 79.18359375 59.20068359 C79.20873047 60.12945312 79.23386719 61.05822266 79.25976562 62.01513672 C79.26943359 62.9078125 79.27910156 63.80048828 79.2890625 64.72021484 C79.30477295 65.54239502 79.3204834 66.3645752 79.33666992 67.21166992 C78.99609375 69.38818359 78.99609375 69.38818359 77.97505188 70.99995422 C74.88762376 73.16576983 71.62954075 72.80505496 67.9921875 72.77636719 C66.76980881 72.78425262 66.76980881 72.78425262 65.5227356 72.79229736 C62.82616061 72.80551261 60.13017485 72.79675403 57.43359375 72.78662109 C55.56176642 72.78864139 53.68993986 72.79155246 51.81811523 72.7953186 C47.89396678 72.79974402 43.9700231 72.79330391 40.04589844 72.77929688 C35.01169028 72.76220486 29.97796191 72.77204488 24.94377136 72.79001427 C21.07821019 72.80084624 17.21276307 72.79740847 13.34719849 72.78963089 C11.49081363 72.78762726 9.63441848 72.79009386 7.77804565 72.79706955 C5.18508406 72.80467441 2.59290332 72.79309374 0 72.77636719 C-0.76996307 72.78243988 -1.53992615 72.78851257 -2.33322144 72.79476929 C-7.51270607 72.7327581 -7.51270607 72.7327581 -9.98286438 70.99995422 C-11.36961046 68.81089942 -11.34617734 67.3003708 -11.296875 64.72021484 C-11.28720703 63.82753906 -11.27753906 62.93486328 -11.26757812 62.01513672 C-11.24244141 61.08636719 -11.21730469 60.15759766 -11.19140625 59.20068359 C-11.17110352 57.79012695 -11.17110352 57.79012695 -11.15039062 56.35107422 C-11.11503721 54.02953321 -11.06569299 51.70914706 -11.00390625 49.38818359 C-12.32390625 49.05818359 -13.64390625 48.72818359 -15.00390625 48.38818359 C-15.00390625 40.46818359 -15.00390625 32.54818359 -15.00390625 24.38818359 C-13.68390625 24.05818359 -12.36390625 23.72818359 -11.00390625 23.38818359 C-11.0196167 22.79803467 -11.03532715 22.20788574 -11.05151367 21.59985352 C-11.11388564 18.92522774 -11.15290282 16.25075495 -11.19140625 13.57568359 C-11.22911133 12.1825293 -11.22911133 12.1825293 -11.26757812 10.76123047 C-11.27724609 9.86855469 -11.28691406 8.97587891 -11.296875 8.05615234 C-11.31258545 7.23397217 -11.3282959 6.41179199 -11.34448242 5.56469727 C-11.00390625 3.38818359 -11.00390625 3.38818359 -9.98286438 1.77641296 C-6.89543626 -0.38940264 -3.63735325 -0.02868778 0 0 Z M-2.00390625 8.38818359 C-2.00390625 13.66818359 -2.00390625 18.94818359 -2.00390625 24.38818359 C21.75609375 24.38818359 45.51609375 24.38818359 69.99609375 24.38818359 C69.99609375 19.10818359 69.99609375 13.82818359 69.99609375 8.38818359 C46.23609375 8.38818359 22.47609375 8.38818359 -2.00390625 8.38818359 Z M-6.00390625 35.38818359 C-6.33390625 36.04818359 -6.66390625 36.70818359 -7.00390625 37.38818359 C20.05609375 37.38818359 47.11609375 37.38818359 74.99609375 37.38818359 C74.99609375 36.72818359 74.99609375 36.06818359 74.99609375 35.38818359 C48.26609375 35.38818359 21.53609375 35.38818359 -6.00390625 35.38818359 Z M-2.00390625 49.38818359 C-2.00390625 54.33818359 -2.00390625 59.28818359 -2.00390625 64.38818359 C21.75609375 64.38818359 45.51609375 64.38818359 69.99609375 64.38818359 C69.99609375 59.43818359 69.99609375 54.48818359 69.99609375 49.38818359 C46.23609375 49.38818359 22.47609375 49.38818359 -2.00390625 49.38818359 Z " fill="${bg_color_icon}" transform="translate(27.00390625,16.61181640625)"/>
<path d="M0 0 C0.81491913 -0.00525696 1.62983826 -0.01051392 2.4694519 -0.01593018 C5.16602689 -0.02914542 7.86201265 -0.02038684 10.55859375 -0.01025391 C12.43042108 -0.01227421 14.30224764 -0.01518528 16.17407227 -0.01895142 C20.09822072 -0.02337683 24.0221644 -0.01693673 27.94628906 -0.00292969 C32.98049722 0.01416233 38.01422559 0.0043223 43.04841614 -0.01364708 C46.91397731 -0.02447905 50.77942443 -0.02104128 54.64498901 -0.0132637 C56.50137387 -0.01126007 58.35776902 -0.01372668 60.21414185 -0.02070236 C62.80710344 -0.02830722 65.39928418 -0.01672655 67.9921875 0 C68.76215057 -0.00607269 69.53211365 -0.01214539 70.32540894 -0.0184021 C75.50634229 0.04362644 75.50634229 0.04362644 77.96931458 1.77641296 C79.34314242 3.93295785 79.42665084 5.50767635 79.5078125 8.05615234 C79.54326172 8.94882812 79.57871094 9.84150391 79.61523438 10.76123047 C79.63779297 11.69 79.66035156 12.61876953 79.68359375 13.57568359 C79.71775391 14.51605469 79.75191406 15.45642578 79.78710938 16.42529297 C79.86957593 18.74613752 79.93872778 21.06660508 79.99609375 23.38818359 C81.48109375 23.88318359 81.48109375 23.88318359 82.99609375 24.38818359 C82.99609375 32.30818359 82.99609375 40.22818359 82.99609375 48.38818359 C81.67609375 48.71818359 80.35609375 49.04818359 78.99609375 49.38818359 C79.0118042 49.97833252 79.02751465 50.56848145 79.04370117 51.17651367 C79.10607314 53.85113945 79.14509032 56.52561224 79.18359375 59.20068359 C79.20873047 60.12945312 79.23386719 61.05822266 79.25976562 62.01513672 C79.26943359 62.9078125 79.27910156 63.80048828 79.2890625 64.72021484 C79.30477295 65.54239502 79.3204834 66.3645752 79.33666992 67.21166992 C78.99609375 69.38818359 78.99609375 69.38818359 77.97505188 70.99995422 C74.88762376 73.16576983 71.62954075 72.80505496 67.9921875 72.77636719 C66.76980881 72.78425262 66.76980881 72.78425262 65.5227356 72.79229736 C62.82616061 72.80551261 60.13017485 72.79675403 57.43359375 72.78662109 C55.56176642 72.78864139 53.68993986 72.79155246 51.81811523 72.7953186 C47.89396678 72.79974402 43.9700231 72.79330391 40.04589844 72.77929688 C35.01169028 72.76220486 29.97796191 72.77204488 24.94377136 72.79001427 C21.07821019 72.80084624 17.21276307 72.79740847 13.34719849 72.78963089 C11.49081363 72.78762726 9.63441848 72.79009386 7.77804565 72.79706955 C5.18508406 72.80467441 2.59290332 72.79309374 0 72.77636719 C-0.76996307 72.78243988 -1.53992615 72.78851257 -2.33322144 72.79476929 C-7.51270607 72.7327581 -7.51270607 72.7327581 -9.98286438 70.99995422 C-11.36961046 68.81089942 -11.34617734 67.3003708 -11.296875 64.72021484 C-11.28720703 63.82753906 -11.27753906 62.93486328 -11.26757812 62.01513672 C-11.24244141 61.08636719 -11.21730469 60.15759766 -11.19140625 59.20068359 C-11.17110352 57.79012695 -11.17110352 57.79012695 -11.15039062 56.35107422 C-11.11503721 54.02953321 -11.06569299 51.70914706 -11.00390625 49.38818359 C-12.32390625 49.05818359 -13.64390625 48.72818359 -15.00390625 48.38818359 C-15.00390625 40.46818359 -15.00390625 32.54818359 -15.00390625 24.38818359 C-13.68390625 24.05818359 -12.36390625 23.72818359 -11.00390625 23.38818359 C-11.0196167 22.79803467 -11.03532715 22.20788574 -11.05151367 21.59985352 C-11.11388564 18.92522774 -11.15290282 16.25075495 -11.19140625 13.57568359 C-11.22911133 12.1825293 -11.22911133 12.1825293 -11.26757812 10.76123047 C-11.27724609 9.86855469 -11.28691406 8.97587891 -11.296875 8.05615234 C-11.31258545 7.23397217 -11.3282959 6.41179199 -11.34448242 5.56469727 C-11.00390625 3.38818359 -11.00390625 3.38818359 -9.98286438 1.77641296 C-6.89543626 -0.38940264 -3.63735325 -0.02868778 0 0 Z M-7.95991516 2.76493835 C-9.44105525 5.06788292 -9.34407382 6.77185398 -9.296875 9.49365234 C-9.28720703 10.4765625 -9.27753906 11.45947266 -9.26757812 12.47216797 C-9.22987305 14.0084082 -9.22987305 14.0084082 -9.19140625 15.57568359 C-9.17787109 16.61144531 -9.16433594 17.64720703 -9.15039062 18.71435547 C-9.11502014 21.27282058 -9.06566169 23.83024139 -9.00390625 26.38818359 C-10.65390625 26.38818359 -12.30390625 26.38818359 -14.00390625 26.38818359 C-14.00390625 32.98818359 -14.00390625 39.58818359 -14.00390625 46.38818359 C-12.35390625 46.71818359 -10.70390625 47.04818359 -9.00390625 47.38818359 C-9.0196167 48.00862549 -9.03532715 48.62906738 -9.05151367 49.26831055 C-9.11386839 52.07900887 -9.15289773 54.88956171 -9.19140625 57.70068359 C-9.21654297 58.67714844 -9.24167969 59.65361328 -9.26757812 60.65966797 C-9.27724609 61.59746094 -9.28691406 62.53525391 -9.296875 63.50146484 C-9.31258545 64.36553955 -9.3282959 65.22961426 -9.34448242 66.11987305 C-9.16357526 68.38429044 -9.16357526 68.38429044 -7.95991516 70.00569153 C-4.97043749 72.11863137 -1.89609672 71.80562073 1.6328125 71.77636719 C2.40871735 71.78162415 3.18462219 71.7868811 3.98403931 71.79229736 C6.55076177 71.80550944 9.11686489 71.79675526 11.68359375 71.78662109 C13.46574015 71.78864149 15.24788574 71.79155264 17.0300293 71.7953186 C20.7658678 71.79974358 24.50149118 71.79330535 28.23730469 71.77929688 C33.02938459 71.76220483 37.82096045 71.77204509 42.61302185 71.79001427 C46.29329231 71.80084744 49.973443 71.79740792 53.65371704 71.78963089 C55.42078714 71.78762759 57.18786807 71.79009271 58.95492554 71.79706955 C61.42336899 71.80467645 63.8909927 71.79309112 66.359375 71.77636719 C67.09193512 71.78243988 67.82449524 71.78851257 68.57925415 71.79476929 C71.51919 71.75781055 73.50921681 71.73230447 75.95210266 70.00569153 C77.40157015 67.75995859 77.33740547 66.16032836 77.2890625 63.50146484 C77.27939453 62.56367187 77.26972656 61.62587891 77.25976562 60.65966797 C77.23462891 59.68320313 77.20949219 58.70673828 77.18359375 57.70068359 C77.17005859 56.71261719 77.15652344 55.72455078 77.14257812 54.70654297 C77.10721578 52.26654129 77.05786408 49.82763641 76.99609375 47.38818359 C78.64609375 47.05818359 80.29609375 46.72818359 81.99609375 46.38818359 C81.99609375 39.78818359 81.99609375 33.18818359 81.99609375 26.38818359 C80.34609375 26.38818359 78.69609375 26.38818359 76.99609375 26.38818359 C77.0118042 25.73744873 77.02751465 25.08671387 77.04370117 24.41625977 C77.10604024 21.46948935 77.14508059 18.52285762 77.18359375 15.57568359 C77.20873047 14.55152344 77.23386719 13.52736328 77.25976562 12.47216797 C77.26943359 11.48925781 77.27910156 10.50634766 77.2890625 9.49365234 C77.30477295 8.58768311 77.3204834 7.68171387 77.33666992 6.74829102 C77.16513213 4.4040785 77.16513213 4.4040785 75.95210266 2.76493835 C72.96115168 0.65973015 69.88585727 0.97076657 66.359375 1 C65.58347015 0.99474304 64.80756531 0.98948608 64.00814819 0.98406982 C61.44142573 0.97085775 58.87532261 0.97961193 56.30859375 0.98974609 C54.52644735 0.9877257 52.74430176 0.98481455 50.9621582 0.98104858 C47.2263197 0.9766236 43.49069632 0.98306183 39.75488281 0.99707031 C34.96280291 1.01416236 30.17122705 1.0043221 25.37916565 0.98635292 C21.69889519 0.97551975 18.0187445 0.97895926 14.33847046 0.9867363 C12.57140036 0.9887396 10.80431943 0.98627447 9.03726196 0.97929764 C6.56881851 0.97169074 4.1011948 0.98327607 1.6328125 1 C0.90025238 0.99392731 0.16769226 0.98785461 -0.58706665 0.9815979 C-3.52336227 1.01851088 -5.51696705 1.04544699 -7.95991516 2.76493835 Z " fill="${bg_color_icon}" transform="translate(27.00390625,16.61181640625)"/>
<path d="M0 0 C25.08 0 50.16 0 76 0 C76 6.6 76 13.2 76 20 C50.92 20 25.84 20 0 20 C0 13.4 0 6.8 0 0 Z M2 2 C2 7.28 2 12.56 2 18 C25.76 18 49.52 18 74 18 C74 12.72 74 7.44 74 2 C50.24 2 26.48 2 2 2 Z " fill="#E1EEFB" transform="translate(23,23)"/>
<path d="M0 0 C25.08 0 50.16 0 76 0 C76 6.27 76 12.54 76 19 C50.92 19 25.84 19 0 19 C0 12.73 0 6.46 0 0 Z M2 2 C2 6.95 2 11.9 2 17 C25.76 17 49.52 17 74 17 C74 12.05 74 7.1 74 2 C50.24 2 26.48 2 2 2 Z " fill="#FFFFFF" transform="translate(23,64)"/>
<path d="M0 0 C28.38 0 56.76 0 86 0 C86 1.65 86 3.3 86 5 C57.62 5 29.24 5 0 5 C0 3.35 0 1.7 0 0 Z M3 1 C2.67 1.66 2.34 2.32 2 3 C29.06 3 56.12 3 84 3 C84 2.34 84 1.68 84 1 C57.27 1 30.54 1 3 1 Z " fill="#E8F2FC" transform="translate(18,51)"/>
<path d="M0 0 C0.81462708 -0.0049649 1.62925415 -0.00992981 2.46856689 -0.01504517 C5.17583039 -0.02970515 7.88303529 -0.03647521 10.59033203 -0.04199219 C12.46501671 -0.04774058 14.33970136 -0.05349835 16.21438599 -0.05926514 C20.15041377 -0.06978612 24.08642106 -0.07562156 28.02246094 -0.07910156 C33.07237281 -0.08458795 38.12201526 -0.10861441 43.17184258 -0.13707352 C47.04595741 -0.15567405 50.92000703 -0.16090412 54.79416275 -0.16243744 C56.65614418 -0.16547047 58.5181243 -0.17352076 60.3800621 -0.18662262 C62.98275129 -0.20362901 65.5847782 -0.20181626 68.1875 -0.1953125 C68.96060516 -0.20452728 69.73371033 -0.21374207 70.53024292 -0.22323608 C75.73367244 -0.1823904 75.73367244 -0.1823904 78.198349 1.54737854 C79.56867849 3.70524809 79.65372068 5.28122395 79.73486328 7.82910156 C79.7703125 8.72177734 79.80576172 9.61445313 79.84228516 10.53417969 C79.86484375 11.46294922 79.88740234 12.39171875 79.91064453 13.34863281 C79.94480469 14.28900391 79.97896484 15.229375 80.01416016 16.19824219 C80.09662671 18.51908674 80.16577856 20.83955429 80.22314453 23.16113281 C81.70814453 23.65613281 81.70814453 23.65613281 83.22314453 24.16113281 C82.72814453 25.64613281 82.72814453 25.64613281 82.22314453 27.16113281 C80.57314453 26.83113281 78.92314453 26.50113281 77.22314453 26.16113281 C77.19341553 25.17717529 77.19341553 25.17717529 77.16308594 24.17333984 C77.06801946 21.21052212 76.95826701 18.24842749 76.84814453 15.28613281 C76.81720703 14.25359375 76.78626953 13.22105469 76.75439453 12.15722656 C76.71572266 11.17109375 76.67705078 10.18496094 76.63720703 9.16894531 C76.60578613 8.25773926 76.57436523 7.3465332 76.54199219 6.40771484 C76.42431942 3.96182095 76.42431942 3.96182095 74.22314453 2.16113281 C71.67947854 1.96281459 69.24469695 1.88834901 66.69995117 1.90234375 C65.53631294 1.89708679 65.53631294 1.89708679 64.34916687 1.89172363 C61.77712127 1.88289971 59.20534933 1.88875829 56.63330078 1.89550781 C54.84972582 1.89416121 53.06615122 1.89222072 51.28257751 1.88970947 C47.54080721 1.8867572 43.79913228 1.89105863 40.05737305 1.90039062 C35.2575142 1.91177698 30.4578792 1.90523154 25.6580286 1.8932457 C21.97348846 1.88602282 18.28900149 1.88831714 14.60445976 1.89350128 C12.83459891 1.89483702 11.06473325 1.8931927 9.29487801 1.88854218 C6.82169924 1.88347084 4.34888407 1.891196 1.87573242 1.90234375 C0.77453568 1.89627106 0.77453568 1.89627106 -0.34890747 1.89007568 C-4.04694363 1.92100195 -5.61438779 2.05282102 -8.77685547 4.16113281 C-8.77685547 -1.61620755 -4.6512735 0.0066904 0 0 Z " fill="#F9FBFE" transform="translate(26.77685546875,16.8388671875)"/>
<path d="M0 0 C0.33 0 0.66 0 1 0 C1 7.59 1 15.18 1 23 C-0.65 23 -2.3 23 -4 23 C-3.67 29.93 -3.34 36.86 -3 44 C-3.66 44 -4.32 44 -5 44 C-5 36.41 -5 28.82 -5 21 C-3.68 20.67 -2.36 20.34 -1 20 C-1.00523682 19.42967041 -1.01047363 18.85934082 -1.01586914 18.27172852 C-1.03658221 15.70199677 -1.0496419 13.13228253 -1.0625 10.5625 C-1.07087891 9.66466797 -1.07925781 8.76683594 -1.08789062 7.84179688 C-1.09111328 6.98779297 -1.09433594 6.13378906 -1.09765625 5.25390625 C-1.10289307 4.46314697 -1.10812988 3.6723877 -1.11352539 2.85766602 C-1 1 -1 1 0 0 Z " fill="#E3EEFB" transform="translate(17,20)"/>
<path d="M0 0 C0.33 0 0.66 0 1 0 C1 6.93 1 13.86 1 21 C-0.65 21.33 -2.3 21.66 -4 22 C-4 27.61 -4 33.22 -4 39 C-4.33 39 -4.66 39 -5 39 C-5 32.73 -5 26.46 -5 20 C-3.68 19.67 -2.36 19.34 -1 19 C-0.67 12.73 -0.34 6.46 0 0 Z " fill="#E6F2FC" transform="translate(109,44)"/>
</svg>

                            </div>
                            <div class="box_text_bottom_disabilitas" id="text_id_kursor">
                                Kursor
                            </div>
                            <div class="box_column_action_strip">
    <div class="box_row_action_strip" id="list_strip_loading_action_kursor">
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_3"></div>
                                </div>
                            </div>
                        </div>

                            <div class="box_group_disabilitas display_none_mobile" id="action_tooltip">
                            <div class="box_icon_disabilitas">

     <svg fill="none"  width="50px" height="50px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path  class="icon_svg_color" clip-rule="evenodd" d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19ZM10 7C10.8284 7 11.5 6.32843 11.5 5.5C11.5 4.67157 10.8284 4 10 4C9.17157 4 8.5 4.67157 8.5 5.5C8.5 6.32843 9.17157 7 10 7ZM11 15V9H9V15H11Z" fill="black" fill-rule="evenodd"/>
</svg>
                            </div>
                            <div class="box_text_bottom_disabilitas">
                              Keterangan Alat
                            </div>
                            <div class="box_column_action_strip">

                            </div>
                        </div>
                        </div>
                    </div>

                    <div class="column_reset_disabilitas_menu">
                        <div class="row_persegi_reset" id="reset_pengaturan_all_dsb">
                            <div class="icon_persegi_riset">
                                <svg height="20px" width="20px" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path class="icon_x_svg_color" d="M29,2c-0.452,0-0.952,0.144-1.415,0.582l-1.941,1.941C22.981,2.273,19.593,1,16,1C9.473,1,3.738,5.173,1.73,11.385  c-0.34,1.051,0.237,2.179,1.288,2.518C3.224,13.969,3.431,14,3.634,14c0.845,0,1.63-0.539,1.903-1.385C7.009,8.06,11.214,5,16,5  c2.513,0,4.88,0.864,6.791,2.377l-3.209,3.209C19.144,11.048,19,11.548,19,12c0,1.021,0.809,2,2,2h8c1.024,0,2-0.812,2-2V4  C31,2.809,30.021,2,29,2z M28.981,18.097C28.776,18.031,28.569,18,28.366,18c-0.845,0-1.63,0.539-1.903,1.385  C24.991,23.94,20.786,27,16,27c-2.513,0-4.88-0.864-6.791-2.377l3.209-3.209C12.856,20.952,13,20.452,13,20c0-1.021-0.809-2-2-2H3  c-1.024,0-2,0.812-2,2v8c0,1.191,0.979,2,2,2c0.452,0,0.952-0.144,1.415-0.582l1.941-1.941C9.019,29.727,12.407,31,16,31  c6.527,0,12.262-4.173,14.27-10.385C30.609,19.564,30.032,18.437,28.981,18.097z" />
                                </svg>
                            </div>
                            <div class="column_text_persegi_riset">
                                Atur Ulang Semua Pengaturan Aksesibilitas
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="row_data_setting_layout ">
<div class="group_action_setting_layout ${name_class_widget8}" id="dropdown_setting_widget" aria-expanded="false">

    <div class="box_content_settings">
        <span class="svg_icon_layout_dsb">
        <div class="box_content_disabilitas">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="15px" height="15px"><path fill="#FFFFFF" fill-rule="evenodd" d="M3.81818182 6c0-1.2049091.97690908-2.18181818 2.18181818-2.18181818S8.1818182 4.7950909 8.1818182 6 7.2049091 8.1818182 6 8.1818182 3.81818182 7.2049091 3.81818182 6ZM12 7.0909091V4.9090909l-1.5763636-.2956364c-.0823637-.264-.1903637-.5170909-.3169091-.75872723l.9070909-1.326L9.4712727.98618182l-1.326.90709091c-.2416363-.12654546-.4947272-.23454546-.7587272-.31690909L7.0909091 0H4.9090909l-.2956364 1.57636364c-.264.08236363-.5170909.19036363-.75872723.31690909l-1.326-.90709091L.98618182 2.52872727l.90709091 1.326c-.12654546.24163633-.23454546.49472723-.31690909.75872723L0 4.9090909v2.1818182l1.57636364.2956364c.08236363.264.19036363.5170909.31690909.7587272l-.90709091 1.326 1.54254545 1.5425455 1.326-.9070909c.24163633.1265454.49472723.2345454.75872723.3169091L4.9090909 12h2.1818182l.2956364-1.5763636c.264-.0823637.5170909-.1903637.7587272-.3169091l1.326.9070909 1.5425455-1.5425455-.9070909-1.326c.1265454-.2416363.2345454-.4947272.3169091-.7587272L12 7.0909091Z"></path></svg>
</div>
</span>

    </div>
    <div class="row_data_widget">
        <div class="text_column_layaout_disabilitas">
            <span class="dsb_baris_judul">Pindahkan Widget</span>
            <span class="dsb_baris_nilai">Atur posisi tombol widget di layar</span>
        </div>
        <div class="icon_column_layaout_disabilitas">
            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 6 11" aria-hidden="true"
                focusable="false">
                <path fill="currentColor" fill-rule="evenodd" d="m.5 10.5 5-5-5-5"></path>
            </svg>
        </div>
    </div>
        </div>

        <div class="layout_settings_widget" id="show_setting_widget">

        <div class="group_move_widget ${name_class_widget7}" role="radiogroup" aria-label="Posisi tombol widget">

		<div class="radio_row_widget radio_row_widget_item">
			<div class="dsb_posisi_layar" aria-hidden="true"><span class="dsb_posisi_titik dsb_titik_kiri_atas"></span></div>
			<div class="dsb_posisi_pilihan">
				<div class="jarak_kanan_radio">
					<input type="radio" name="dsb_posisi_widget" id="enable_radion_1" class="radio_widget_dsb" aria-label="Kiri Atas" />
				</div>
				<div class="jarak_radio" data-move-wg="left_top">Kiri Atas</div>
			</div>
		</div>

		<div class="radio_row_widget radio_row_widget_item">
			<div class="dsb_posisi_layar" aria-hidden="true"><span class="dsb_posisi_titik dsb_titik_kanan_atas"></span></div>
			<div class="dsb_posisi_pilihan">
				<div class="jarak_kanan_radio">
					<input type="radio" name="dsb_posisi_widget" id="enable_radion_2" class="radio_widget_dsb" aria-label="Kanan Atas" />
				</div>
				<div class="jarak_radio" data-move-wg="right_top">Kanan Atas</div>
			</div>
		</div>

		<div class="radio_row_widget radio_row_widget_item">
			<div class="dsb_posisi_layar" aria-hidden="true"><span class="dsb_posisi_titik dsb_titik_kiri_bawah"></span></div>
			<div class="dsb_posisi_pilihan">
				<div class="jarak_kanan_radio">
					<input type="radio" name="dsb_posisi_widget" id="enable_radion_3" class="radio_widget_dsb" aria-label="Kiri Bawah" />
				</div>
				<div class="jarak_radio" data-move-wg="left_bottom">Kiri Bawah</div>
			</div>
		</div>

		<div class="radio_row_widget radio_row_widget_item">
			<div class="dsb_posisi_layar" aria-hidden="true"><span class="dsb_posisi_titik dsb_titik_kanan_bawah"></span></div>
			<div class="dsb_posisi_pilihan">
				<div class="jarak_kanan_radio">
					<input type="radio" name="dsb_posisi_widget" id="enable_radion_4" class="radio_widget_dsb" aria-label="Kanan Bawah" />
				</div>
				<div class="jarak_radio" data-move-wg="right_bottom">Kanan Bawah</div>
			</div>
		</div>
	</div>

         </div>
</div>

     <div class="column_cek_version_dsb">
                    <div class="column_text_cek_version_dsb">
                    Widget Aksesibilitas &middot; Versi 2.3.0
                </div>

                    </div>
            </div>
        </div>
    </div>
</div>
</div>`;
            $w("#slider_dsb_element").html(slider_popup);

            create_slider_dsb_element.querySelectorAll(".radio_row_widget_item").forEach((element) => {
                element.addEventListener("click", () => {
                    var sumber = element.querySelector("[data-move-wg]");
                    var posisi = sumber ? sumber.dataset.moveWg : "";
                    if (!_nomorRadioPosisi(posisi)) return;
                    action_navigate_widget(posisi, "click");
                    _widgetStorage.setItem("position_widget", posisi);
                    _isyaratIkutiPosisiWidget();
                });
            });

            var mouse_move_data = `<div class="tooltip_data_move_mouse_new" id="move_tooltip_data"></div>`;
            $w("#slider_mouse_over").html(mouse_move_data);

            $w("#dropdown_setting_widget").attr("aria-expanded", "true");
            $w("#show_setting_widget").css("display", "flex");

            var _nomorPosisiAwal = _nomorRadioPosisi(position_daftar_web);
            if (_nomorPosisiAwal) _pilihRadioPosisi(_nomorPosisiAwal);

            function _pilihRadioPosisi(nomor) {
                for (var k = 4; k >= 1; k--) {
                    const $radio = $w("#enable_radion_" + k);
                    if (k === nomor) {
                        $radio.attr("checked", "checked");
                    } else {
                        $radio.removeAttr("checked");
                    }
                    $radio.prop("checked", k === nomor);
                    $radio.closest(".radio_row_widget_item").toggleClass("dsb_posisi_aktif", k === nomor);
                }
            }

            function action_navigate_widget(value, action) {
                clear_navigate_widget();
                var nomor = _nomorRadioPosisi(value);
                if (!nomor) return;
                _pilihRadioPosisi(nomor);
                var kelas = _kelasPosisiWidget(value);
                var kanan = value == "right_top" || value == "right_bottom";
                if (action == "click") {
                    if (kelas && !$w("#show_menu_dsb_web").hasClass(kelas)) {
                        $w("#show_menu_dsb_web").addClass(kelas);
                        if (kanan) right_navigate_widget();
                    }
                } else if (kanan) {
                    right_navigate_widget();
                }
            }

            function right_navigate_widget() {
                $w("#widget_menu_disabilitas").addClass("except_position_swipe");
                $w(".content_aksesbilitas_utama").addClass("except_content_aksesbilitas_utama");
                $w("#checklangmenu").addClass("except_groupcontenttoolbar");
                $w(".group_scroll_content").addClass("except_group_scroll_content");
                $w(".content_daftar_action_disabilitas").addClass("except_content_daftar_action_disabilitas");
                $w("#show_profile_widget_dsb").addClass("except_layout_profile_widget");
            }
            function clear_navigate_widget() {
                $w("#show_menu_dsb_web").removeClass("circle_left_top_sidebar");
                $w("#show_menu_dsb_web").removeClass("circle_right_sidebar");
                $w("#show_menu_dsb_web").removeClass("circle_right_top_sidebar");
                $w("#widget_menu_disabilitas").removeClass("except_position_swipe");
                $w(".content_aksesbilitas_utama").removeClass("except_content_aksesbilitas_utama");
                $w("#checklangmenu").removeClass("except_groupcontenttoolbar");
                $w(".group_scroll_content").removeClass("except_group_scroll_content");
                $w(".content_daftar_action_disabilitas").removeClass("except_content_daftar_action_disabilitas");
                $w("#show_profile_widget_dsb").removeClass("except_layout_profile_widget");
            }

            $w("#dropdown_setting_widget").click(function (event) {
                event.preventDefault();
                var get_attr = $w("#dropdown_setting_widget").attr("aria-expanded");

                if (get_attr == "true") {
                    $w("#dropdown_setting_widget").attr("aria-expanded", "false");
                    $w("#show_setting_widget").hide();
                } else {
                    $w("#dropdown_setting_widget").attr("aria-expanded", "true");
                    $w("#show_setting_widget").show();
                }
            });

            $w("#list_strip_loading_perbesar_text").hide();
            $w("#list_strip_loading_perkecil_text").hide();
            $w("#list_strip_loading_action_kontras").hide();
            $w("#list_strip_loading_action_grey_scale").hide();

            $w("#svg_kontras_warna,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
            $w("#list_strip_loading_perataan_text").hide();
            $w("#list_strip_loading_action_tulisan_line_height").hide();
            $w("#svg_kursor_masker_v2,#svg_kursor_masker,#list_strip_loading_action_kursor").hide();

            $w("#list_strip_loading_action_space_text").hide();
            $w("#svg_block_decoration_link,#list_strip_loading_action_garis_bawahi_tautan").hide();

            $w("#svg_font_di_perbesar,#list_strip_loading_action_tulisan_dapat_dibaca").hide();

            // line-height petak diatur di CSS widget (tanpa !important), bukan inline !important, agar pengguna
            // yang memakai pengaturan spasi teks sendiri tetap bisa menimpanya (WCAG 1.4.12).

            var $el = {};
            var _elIds = [
                "action_moda_suara",
                "action_perbesar_text",
                "action_perkecil_text",
                "action_grey_scale",
                "action_kontras",
                "action_hidden_image",
                "action_perataan_text",
                "action_tulisan_dapat_di_baca",
                "action_tulisan_line_height",
                "action_animate_pause",
                "action_kursor",
                "action_space_text",
                "action_garis_bawahi_tautan",
                "action_tooltip",
                "reset_pengaturan_all_dsb",
                "action_gangguan_motorik",
                "action_netra_total",
                "action_buta_warna",
                "action_disleksia",
                "action_gangguan_pengelihatan",
                "action_kognitif_pembelajaran",
                "action_kejang_dan_epilepsi",
                "action_adhd",
            ];
            for (const _elId of _elIds) {
                $el[_elId] = $w("#" + _elId);
            }

            $w("#action_moda_suara").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "moda-suara");
                if ($w("#action_moda_suara").hasClass("active_box_menu_disabilitas")) {
                    $w("#action_moda_suara").removeClass("active_box_menu_disabilitas");
                    $w("#action_moda_suara .box_icon_disabilitas .active_icon_svg_sroke_color").each(
                        function (_i, item) {
                            var name_class = item.classList.value;
                            if (name_class.includes("active_icon_svg_sroke_color")) {
                                item.classList = "icon_svg_sroke_color";
                            }
                        }
                    );
                    $w("#action_moda_suara")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    _widgetStorage.setItem("permismobile", "off");
                    _widgetStorage.setItem("permisvoice", "off");
                    _hentikanSuaraModa();
                } else {
                    _bukaKunciSuara();
                    action_moda_suara_on();
                }
            });

            function action_moda_suara_on() {
                if (getOS() == "iOS" || getOS() == "Android") {
                    _widgetStorage.setItem("permismobile", "on");
                    speachmobile("Selamat Datang Di Website " + base_url_website);
                } else {
                    _widgetStorage.setItem("permisvoice", "on");
                    speach("Selamat Datang Di Website " + base_url_website);
                }

                $w("#action_moda_suara").addClass("active_box_menu_disabilitas");
                $w("#action_moda_suara .box_icon_disabilitas .icon_svg_sroke_color").each(function (_i, item) {
                    var name_class = item.classList.value;
                    if (name_class.includes("icon_svg_sroke_color")) {
                        item.classList = "icon_svg_sroke_color active_icon_svg_sroke_color";
                    }
                });
                $w("#action_moda_suara")
                    .find(".box_text_bottom_disabilitas")
                    .addClass("active_box_text_bottom_disabilitas");
            }

            $w("#action_perbesar_text").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "perbesar-teks");
                if (
                    $w("#action_perbesar_text").hasClass("active_box_menu_disabilitas") &&
                    action_text_besar.length == 4
                ) {
                    clear_set_text_besar();
                } else {
                    clear_set_text_kecil();
                    load_active_text_besar();
                    if (action_text_besar.length == 0) {
                        _widgetStorage.setItem("text_besar", "1");
                        text_besar_1();
                    } else if (action_text_besar.length == 1) {
                        _widgetStorage.setItem("text_besar", "2");
                        text_besar_2();
                    } else if (action_text_besar.length == 2) {
                        _widgetStorage.setItem("text_besar", "3");
                        text_besar_3();
                    } else if (action_text_besar.length == 3) {
                        _widgetStorage.setItem("text_besar", "4");
                        text_besar_4();
                    }

                    action_text_besar.push(1);
                    $w("#action_perbesar_text")
                        .find(".box_text_bottom_disabilitas")
                        .addClass("active_box_text_bottom_disabilitas");
                }
            });

            $w("#action_grey_scale").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "skala-abu-abu");
                if (
                    $w("#action_grey_scale").hasClass("active_box_menu_disabilitas") &&
                    action_grey_scale_widget.length == 3
                ) {
                    action_grey_scale_widget.length = 0;
                    $w("#action_grey_scale .box_icon_disabilitas path").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_grey_scale_color_1")) {
                            item.classList = "icon_svg_grey_scale_color_1";
                        }
                        if (name_class.includes("active_icon_svg_grey_scale_color_2")) {
                            item.classList = "icon_svg_grey_scale_color_2";
                        }
                        if (name_class.includes("active_icon_svg_grey_scale_color_3")) {
                            item.classList = "icon_svg_grey_scale_color_3";
                        }
                        if (name_class.includes("active_icon_svg_grey_scale_color_4")) {
                            item.classList = "icon_svg_grey_scale_color_4";
                        }
                    });
                    $w("#action_grey_scale").removeClass("active_box_menu_disabilitas");
                    $w("#action_grey_scale")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");

                    _widgetStorage.removeItem("grey_scale_active");

                    if (action_contrash_widget.length == 1) {
                        action_warna_kode_1("aktif");
                    }

                    $w("#text_tulisan_grey_scale").text("Kejenuhan");
                    $w("#list_strip_loading_action_grey_scale").hide();
                    strip_batch_reset(3, "#list_strip_loading_action_grey_scale", 3);
                    _filterHtml("");
                } else if (action_grey_scale_widget.length == 0) {
                    _widgetStorage.setItem("grey_scale_active", "1");
                    load_active_grey_scale();
                    action_grey_scale_widget.push(1);
                } else if (action_grey_scale_widget.length == 1) {
                    _widgetStorage.setItem("grey_scale_active", "2");
                    load_active_grey_scale_v2();
                    action_grey_scale_widget.push(1);
                } else if (action_grey_scale_widget.length == 2) {
                    _widgetStorage.setItem("grey_scale_active", "3");
                    load_active_grey_scale_v3();
                    action_grey_scale_widget.push(1);
                }
            });

            $w("#action_kontras").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "kontras");
                if (
                    $w("#action_kontras").hasClass("active_box_menu_disabilitas") &&
                    action_contrash_widget.length == 4
                ) {
                    _matikanKontrasPenuh();
                } else {
                    _naikkanTingkatKontras();
                }
            });

            $w("#action_hidden_image").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "sembunyikan-gambar");
                if ($w("#action_hidden_image").hasClass("active_box_menu_disabilitas")) {
                    action_text_besar.length = 0;
                    $w("#action_hidden_image").removeClass("active_box_menu_disabilitas");
                    $w("#action_hidden_image .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }
                    });
                    $w("#action_hidden_image")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");

                    var _imgs = document.querySelectorAll("img:not(.dsb-akar #widget_menu_disabilitas img)");
                    for (const _img of _imgs) _img.style.removeProperty("visibility");
                    _widgetStorage.removeItem("action_hidden_image");
                } else {
                    _widgetStorage.setItem("action_hidden_image", "1");
                    load_active_hidden_image();
                }
            });

            $w("#action_perataan_text").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "rata-tulisan");
                if (
                    $w("#action_perataan_text").hasClass("active_box_menu_disabilitas") &&
                    action_perataan_text_widget.length == 4
                ) {
                    action_perataan_text_widget.length = 0;
                    $w("#action_perataan_text").removeClass("active_box_menu_disabilitas");
                    $w("#action_perataan_text .box_icon_disabilitas .icon_svg_sroke_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_sroke_color")) {
                            item.classList = "icon_svg_sroke_color";
                        }
                    });
                    $w("#action_perataan_text")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    strip_batch_reset(4, "#list_strip_loading_perataan_text", 4);
                    $w("#text_rata_tulisan").text("Rata Tulisan");
                    setTimeout(() => {
                        callfunction("Rata Tulisan");
                    }, 100);
                    $w("#svg_left_text_icon").show();
                    $w("#list_strip_loading_perataan_text").hide();
                    $w("#svg_center_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();

                    perataan_all_text("kiri", "noaktif");
                    perataan_all_text("tengah", "noaktif");
                    perataan_all_text("kanan", "noaktif");
                    perataan_all_text("kanan-kiri", "noaktif");

                    _widgetStorage.removeItem("perataan_text");
                } else {
                    load_active_perataan_text();

                    if (action_perataan_text_widget.length == 0) {
                        action_perataan_text_1();
                        _widgetStorage.setItem("perataan_text", "1");
                    } else if (action_perataan_text_widget.length == 1) {
                        _widgetStorage.setItem("perataan_text", "2");
                        action_perataan_text_2();
                    } else if (action_perataan_text_widget.length == 2) {
                        _widgetStorage.setItem("perataan_text", "3");
                        action_perataan_text_3();
                    } else if (action_perataan_text_widget.length == 3) {
                        _widgetStorage.setItem("perataan_text", "4");
                        action_perataan_text_4();
                    }

                    action_perataan_text_widget.push(1);
                    $w("#action_perataan_text")
                        .find(".box_text_bottom_disabilitas")
                        .addClass("active_box_text_bottom_disabilitas");
                }
            });

            $w("#action_tulisan_dapat_di_baca").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "tulisan-dapat-dibaca");
                if (
                    $w("#action_tulisan_dapat_di_baca").hasClass("active_box_menu_disabilitas") &&
                    action_tulisan_dibaca.length == 2
                ) {
                    action_tulisan_dibaca.length = 0;

                    $w("#action_tulisan_dapat_di_baca").removeClass("active_box_menu_disabilitas");
                    $w("#action_tulisan_dapat_di_baca .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }
                    });

                    $w("#list_strip_loading_action_tulisan_dapat_dibaca").hide();
                    $w("#action_tulisan_dapat_di_baca")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    strip_batch_reset(2, "#list_strip_loading_action_tulisan_dapat_dibaca", 2);
                    $w("#svg_font_di_perbesar").hide();
                    $w("#svg_dy_seleksia").show();

                    $w("#text_tulisan_dapat_di_baca").text("Ramah Disleksia");
                    _widgetStorage.removeItem("action_tulisan_dpt_dibaca");
                    no_active_action_tulisan_dapat_dibaca();
                    setTimeout(() => {
                        callfunction("Ramah Disleksia");
                    }, 100);
                } else {
                    load_active_tulisan_dpt_dibaca();
                    if (action_tulisan_dibaca.length == 0) {
                        _widgetStorage.setItem("action_tulisan_dpt_dibaca", "1");
                        active_action_ramah_dyseleksia();
                    } else if (action_tulisan_dibaca.length == 1) {
                        _widgetStorage.setItem("action_tulisan_dpt_dibaca", "2");
                        active_action_tulisan_dapat_dibaca();
                    }
                    action_tulisan_dibaca.push(1);
                }
            });

            $w("#action_tulisan_line_height").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "tinggi-garis");
                if (
                    $w("#action_tulisan_line_height").hasClass("active_box_menu_disabilitas") &&
                    action_line_height_text_widget.length == 3
                ) {
                    action_line_height_text_widget.length = 0;
                    $w("#action_tulisan_line_height").removeClass("active_box_menu_disabilitas");
                    $w("#action_tulisan_line_height .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }
                    });
                    $w("#list_strip_loading_action_tulisan_line_height").hide();
                    $w("#action_tulisan_line_height")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    strip_batch_reset(3, "#list_strip_loading_action_tulisan_line_height", 3);
                    _pulihkanGayaHalaman("line-height");

                    $w("#text_id_tinggi_garis").text("Tinggi Garis");
                    _widgetStorage.removeItem("action_line_height");

                    setTimeout(() => {
                        callfunction("Tinggi Garis");
                    }, 100);
                } else {
                    load_active_tulisan_line_height();

                    if (action_line_height_text_widget.length == 0) {
                        _widgetStorage.setItem("action_line_height", "1");
                        action_line_height_1();
                    } else if (action_line_height_text_widget.length == 1) {
                        _widgetStorage.setItem("action_line_height", "2");
                        action_line_height_2();
                    } else if (action_line_height_text_widget.length == 2) {
                        _widgetStorage.setItem("action_line_height", "3");
                        action_line_height_3();
                    }

                    action_line_height_text_widget.push(1);
                    $w("#action_tulisan_line_height")
                        .find(".box_text_bottom_disabilitas")
                        .addClass("active_box_text_bottom_disabilitas");
                }
            });

            $w("#action_animate_pause").click(function (event) {
                event.preventDefault();
                reset_profile_all("no");
                hit_api_tracking(base_url_website, "animasi-dijeda");
                if ($w("#action_animate_pause").hasClass("active_box_menu_disabilitas")) {
                    $w("#action_animate_pause .box_icon_disabilitas svg *").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }

                        if (name_class.includes("active_icon_svg_sroke_color")) {
                            item.classList = "icon_svg_sroke_color";
                        }
                    });
                    $w("#action_animate_pause").removeClass("active_box_menu_disabilitas");
                    $w("#action_animate_pause")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    $w("#svg_animasi_play").hide();
                    $w("#svg_animasi_pause").show();

                    _animasiDijedaMati();
                    event.cancelBubble = false;
                    $w("#text_id_animasi").text("Animasi Dijeda");

                    setTimeout(() => {
                        callfunction("Animasi Dijeda");
                    }, 100);
                    _widgetStorage.removeItem("action_animate_pause");
                } else {
                    load_active_animate_pause();
                    _widgetStorage.setItem("action_animate_pause", "1");
                    event.cancelBubble = true;
                }
            });

            $w("#action_kursor").click(function (event) {
                event.preventDefault();

                reset_profile_all("no");
                hit_api_tracking(base_url_website, "kursor");

                if ($w("#action_kursor").hasClass("active_box_menu_disabilitas") && action_kursor_widget.length == 3) {
                    action_kursor_widget.length = 0;
                    $w("#action_kursor").removeClass("active_box_menu_disabilitas");
                    $w("#action_kursor .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }
                    });
                    $w("#action_kursor")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    $(".cursor_website_all").removeClass("cursor_website_all");
                    _widgetStorage.removeItem("action_kursor_change");

                    $w("#list_strip_loading_action_kursor").hide();
                    $w("#text_id_kursor").text("Kursor");
                    strip_batch_reset(3, "#list_strip_loading_action_kursor", 3);
                    $w("#svg_kursor_web").show();
                    $w(
                        "#svg_kursor_masker,#svg_kursor_masker_v2,#slider_mouse_masked,#slider_mouse_masked_line"
                    ).hide();
                } else {
                    if (action_kursor_widget.length == 0) {
                        _widgetStorage.setItem("action_kursor_change", "1");
                        action_kursor_widget_1();
                    } else if (action_kursor_widget.length == 1) {
                        _widgetStorage.setItem("action_kursor_change", "2");
                        action_kursor_widget_2();
                    } else if (action_kursor_widget.length == 2) {
                        _widgetStorage.setItem("action_kursor_change", "3");
                        action_kursor_widget_3();
                    }

                    action_kursor_widget.push(1);
                }
            });

            $w("#action_space_text").click(function (event) {
                event.preventDefault();

                reset_profile_all("no");
                hit_api_tracking(base_url_website, "spasi-teks");
                if (
                    $w("#action_space_text").hasClass("active_box_menu_disabilitas") &&
                    action_space_text_widget.length == 3
                ) {
                    action_space_text_widget.length = 0;
                    $w("#action_space_text").removeClass("active_box_menu_disabilitas");
                    $w("#action_space_text .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("active_icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }
                    });
                    $w("#list_strip_loading_action_space_text").hide();
                    $w("#action_space_text")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    strip_batch_reset(3, "#list_strip_loading_action_space_text", 3);

                    _pulihkanGayaHalaman("letter-spacing");
                    $w("#id_space_text").text("Spasi Huruf");

                    setTimeout(() => {
                        callfunction("Spasi Huruf");
                    }, 100);
                    _widgetStorage.removeItem("action_space_text");
                } else {
                    load_active_space_text();

                    if (action_space_text_widget.length == 0) {
                        _widgetStorage.setItem("action_space_text", "1");
                        action_space_text_1();
                    } else if (action_space_text_widget.length == 1) {
                        _widgetStorage.setItem("action_space_text", "2");
                        action_space_text_2();
                    } else if (action_space_text_widget.length == 2) {
                        _widgetStorage.setItem("action_space_text", "3");
                        action_space_text_3();
                    }

                    action_space_text_widget.push(1);
                    $w("#action_space_text")
                        .find(".box_text_bottom_disabilitas")
                        .addClass("active_box_text_bottom_disabilitas");
                }
            });

            $w("#action_perkecil_text").click(function (event) {
                event.preventDefault();

                reset_profile_all("no");
                hit_api_tracking(base_url_website, "perkecil-teks");
                if (
                    $w("#action_perkecil_text").hasClass("active_box_menu_disabilitas") &&
                    action_text_kecil.length == 4
                ) {
                    clear_set_text_kecil();
                } else {
                    clear_set_text_besar();
                    load_active_text_kecil();
                    if (action_text_kecil.length == 0) {
                        _widgetStorage.setItem("text_kecil", "1");
                        text_kecil_1();
                    } else if (action_text_kecil.length == 1) {
                        _widgetStorage.setItem("text_kecil", "2");
                        text_kecil_2();
                    } else if (action_text_kecil.length == 2) {
                        _widgetStorage.setItem("text_kecil", "3");
                        text_kecil_3();
                    } else if (action_text_kecil.length == 3) {
                        _widgetStorage.setItem("text_kecil", "4");
                        text_kecil_4();
                    }

                    action_text_kecil.push(1);
                    $w("#action_perkecil_text")
                        .find(".box_text_bottom_disabilitas")
                        .addClass("active_box_text_bottom_disabilitas");
                }
            });

            $w("#action_garis_bawahi_tautan").click(function (event) {
                event.preventDefault();

                reset_profile_all("no");
                hit_api_tracking(base_url_website, "garis-bawahi-tautan");
                if (
                    $w("#action_garis_bawahi_tautan").hasClass("active_box_menu_disabilitas") &&
                    action_garis_bawahi_tautan_widget.length == 2
                ) {
                    action_garis_bawahi_tautan_widget.length = 0;
                    $w("#action_garis_bawahi_tautan").removeClass("active_box_menu_disabilitas");
                    $w("#action_garis_bawahi_tautan .box_icon_disabilitas .icon_fill_svg_color_black").each(
                        function (_i, item) {
                            var name_class = item.classList.value;
                            if (name_class.includes("active_icon_fill_svg_color_black")) {
                                item.classList = "icon_fill_svg_color_black";
                            }
                        }
                    );

                    $w("#list_strip_loading_action_garis_bawahi_tautan").hide();
                    $w("#action_garis_bawahi_tautan")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    strip_batch_reset(2, "#list_strip_loading_action_garis_bawahi_tautan", 3);

                    $w("#svg_decoration_link").show();
                    $w("#svg_block_decoration_link").hide();

                    action_perataan_text_1_2("rata1", "noaktif");
                    action_perataan_text_1_2("rata2", "noaktif");

                    $w("#text_garis_bawahi_tautan").text("Garis Bawahi Tautan");

                    setTimeout(() => {
                        callfunction("Garis Bawahi Tautan");
                    }, 100);
                    _widgetStorage.removeItem("action_link_all");
                } else {
                    load_active_link_all();
                    if (action_garis_bawahi_tautan_widget.length == 0) {
                        _widgetStorage.setItem("action_link_all", "1");
                        action_garis_link_1();
                    } else if (action_garis_bawahi_tautan_widget.length == 1) {
                        _widgetStorage.setItem("action_link_all", "2");
                        action_garis_link_2();
                    }
                    action_garis_bawahi_tautan_widget.push(1);
                    $w("#action_garis_bawahi_tautan")
                        .find(".box_text_bottom_disabilitas")
                        .addClass("active_box_text_bottom_disabilitas");
                }
            });

            var _savedLang = _widgetStorage.getItem("widget_lang");
            var _bahasaTersimpan = _bahasaWidget(_savedLang);
            _ensureWidgetTranslateObserver();
            if (_bahasaTersimpan && _savedLang !== "id") {
                $w(".list_bahasa_item").removeClass("active_bahasa_item");
                $w("#" + _bahasaTersimpan.idElemen).addClass("active_bahasa_item");
                _tampilkanNilaiBahasa(_savedLang);
                widget_current_lang = _savedLang;
                _scheduleWidgetTranslateBootstrap(_savedLang);
            }

            $w("#dropdown_bahasa_widget").click(function (event) {
                event.preventDefault();
                var get_attr = $w("#dropdown_bahasa_widget").attr("aria-expanded");
                if (get_attr == "true") {
                    $w("#dropdown_bahasa_widget").attr("aria-expanded", "false");
                    $w("#show_bahasa_widget_dsb").hide();
                } else {
                    $w("#dropdown_bahasa_widget").attr("aria-expanded", "true");
                    $w("#show_bahasa_widget_dsb").css("display", "flex");
                    _tampilkanBahasaAktif();
                }
            });

            $w(".list_bahasa_item").click(function (event) {
                event.preventDefault();
                var lang = $(this).attr("data-lang");
                $w(".list_bahasa_item").removeClass("active_bahasa_item");
                $(this).addClass("active_bahasa_item");

                _widgetStorage.setItem("widget_lang", lang);

                var _bahasaDipilih = _bahasaWidget(lang);
                if (_bahasaDipilih) {
                    _tampilkanNilaiBahasa(lang);
                }

                $w("#dropdown_bahasa_widget").attr("aria-expanded", "false");
                $w("#show_bahasa_widget_dsb").hide();
                _fokusKeJudulPanel("#dropdown_bahasa_widget");

                triggerGoogleTranslate(lang);
                setTimeout(function () {
                    if (_widgetStorage.getItem("widget_lang") === lang) {
                        triggerGoogleTranslate(lang);
                    }
                }, 1200);
            });

            $w("#dropdown_profile_widget").click(function (event) {
                event.preventDefault();
                var get_attr = $w("#dropdown_profile_widget").attr("aria-expanded");

                if (get_attr == "true") {
                    $w("#dropdown_profile_widget").attr("aria-expanded", "false");
                    $w("#show_profile_widget_dsb").hide();
                } else {
                    $w("#dropdown_profile_widget").attr("aria-expanded", "true");
                    $w("#show_profile_widget_dsb").show();
                }
            });

            var _profileTrackMap = {
                action_gangguan_motorik: "gangguan-motorik",
                action_netra_total: "netra-total",
                action_buta_warna: "buta-warna",
                action_disleksia: "diseleksia",
                action_gangguan_pengelihatan: "gangguan-pengelihatan",
                action_kognitif_pembelajaran: "kognitif-pembelajaran",
                action_kejang_dan_epilepsi: "kejang-dan-epilepsi",
                action_adhd: "adhd",
            };
            $w("#show_profile_widget_dsb").on("click", ".box_profile_aksesbilitas", function () {
                var _id = this.id;
                if (_profileTrackMap[_id]) {
                    hit_api_tracking(base_url_website, _profileTrackMap[_id]);
                    action_find_id_profile_aksesbilitas("#" + _id);
                }
            });

            $w("#action_tooltip").click(function (event) {
                event.preventDefault();
                setTimeout(() => {
                    reset_profile_all("no");
                }, 100);

                hit_api_tracking(base_url_website, "tooltip");

                if (
                    $w("#action_tooltip").hasClass("active_box_menu_disabilitas") &&
                    action_tooltip_widget.length == 1
                ) {
                    action_tooltip_widget.length = 0;
                    $w("#action_tooltip").removeClass("active_box_menu_disabilitas");
                    $w("#action_tooltip")
                        .find(".box_text_bottom_disabilitas")
                        .removeClass("active_box_text_bottom_disabilitas");
                    $w("#action_tooltip .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("icon_svg_color")) {
                            item.classList = "icon_svg_color";
                        }
                    });
                    $w("#move_tooltip_data").css("display", "none");
                    _widgetStorage.removeItem("tooltip_active");
                    setTimeout(() => {
                        $w(".tooltip_data_move_mouse_new").css({
                            left: "",
                            top: "",
                        });
                    }, 125);
                } else {
                    action_tooltip_widget.length = 0;
                    _widgetStorage.setItem("tooltip_active", "1");
                    action_tooltip_widget.push(1);
                    $w("#move_tooltip_data").css("display", "none");
                    setTimeout(() => {
                        load_active_tooltip_teks_action();
                    }, 125);
                }
            });

            $w("#reset_pengaturan_all_dsb").click(function (event) {
                event.preventDefault();
                reset_all_perngaturan_widget();
            });

            for (const _fitur of _FITUR_KELAS) {
                $w("#" + _fitur.id).click(function (event) {
                    event.preventDefault();
                    reset_profile_all("no");
                    hit_api_tracking(base_url_website, _fitur.lacak);
                    var berikut = _tingkatFiturKelas(_fitur) + 1;
                    if (berikut > _fitur.tingkat.length) berikut = 0;
                    _terapkanFiturKelas(_fitur, berikut);
                    if (_fitur.diam) return;
                    var ucapan = berikut > 0 ? _fitur.tingkat[berikut - 1][1] : _fitur.nama + " Nonaktif";
                    setTimeout(function () {
                        callfunction(ucapan);
                    }, 100);
                });
                _tampilkanFiturKelas(_fitur, _tingkatFiturKelas(_fitur));
            }

            _pasangStrukturHalaman();
            _pasangPengaturanWarna(reset_profile_all);
            _pasangAksesKeyboard();

            function reset_all_perngaturan_widget(dariProfil) {
                if (!dariProfil) {
                    if (position_default == "left_bottom") {
                        action_navigate_widget("left_bottom", "click");
                    } else if (position_default == "right_bottom") {
                        action_navigate_widget("right_bottom", "click");
                    }

                    _widgetStorage.removeItem("position_widget");
                    hit_api_tracking(base_url_website, "reset-pengaturan-disabilitas");
                }

                $w("#svg_kontras_multi").show();
                $w("#svg_kontras_warna,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
                $w("#svg_left_text_icon").show();
                $w("#svg_center_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();
                $w("#svg_font_di_perbesar").hide();
                $w("#svg_dy_seleksia").show();
                $w("#svg_animasi_play").hide();
                $w("#svg_animasi_pause").show();
                $w("#svg_kursor_web").show();
                $w("#svg_kursor_masker").hide();
                $w("#svg_kursor_masker_v2").hide();
                $w("#svg_decoration_link").show();
                $w("#svg_block_decoration_link").hide();

                for (const _fitur of _FITUR_KELAS) _terapkanFiturKelas(_fitur, 0);
                _aturUlangWarna();

                var _resetEls = document.querySelectorAll("[style]");
                for (const _resetEl of _resetEls) {
                    _resetEl.style.opacity = "";
                    _resetEl.style.borderColor = "";
                }

                $(
                    "[style]:not(.fa-search):not(.titletools):not(svg):not(.btn-color-mode-switch-inner):not(.Vue-Toastification__container)"
                ).cssImportant("border-color", "");

                $w("#action_moda_suara").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_moda_suara .box_icon_disabilitas .active_icon_svg_sroke_color", [
                    ["active_icon_svg_sroke_color", "icon_svg_sroke_color"],
                ]);
                $w("#action_moda_suara")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");

                _widgetStorage.setItem("permisvoice", "off");
                _widgetStorage.setItem("permismobile", "off");
                _hentikanSuaraModa();


                action_text_besar.length = 0;
                $w("#action_perbesar_text").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_perbesar_text .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);
                $w("#action_perbesar_text")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(4, "#list_strip_loading_perbesar_text", 4);

                _resetFontSizeHalaman();

                action_grey_scale_widget.length = 0;
                _resetKelasIkon("#action_grey_scale .box_icon_disabilitas path", [
                    ["active_icon_svg_grey_scale_color_1", "icon_svg_grey_scale_color_1"],
                    ["active_icon_svg_grey_scale_color_2", "icon_svg_grey_scale_color_2"],
                    ["active_icon_svg_grey_scale_color_3", "icon_svg_grey_scale_color_3"],
                    ["active_icon_svg_grey_scale_color_4", "icon_svg_grey_scale_color_4"],
                ]);
                $w("#action_grey_scale").removeClass("active_box_menu_disabilitas");
                $w("#action_grey_scale")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");

                $w("#text_tulisan_grey_scale").text("Kejenuhan");
                $w("#list_strip_loading_action_grey_scale").hide();
                strip_batch_reset(3, "#list_strip_loading_action_grey_scale", 3);
                _filterHtml("");


                action_contrash_widget.length = 0;
                $w("#action_kontras").removeClass("active_box_menu_disabilitas");
                $w("#action_kontras")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");

                _resetKelasIkon("#action_kontras .box_icon_disabilitas path", [
                    ["active_circle_multi", "circle_multi"],
                    ["active_circle_single", "circle_single"],
                ]);

                strip_batch_reset(4, "#list_strip_loading_action_kontras", 4);
                $w("#text_name_kontras").text(" Kontras+");
                action_warna_kode_1("noaktif");
                action_warna_kode_2("noaktif");
                action_warna_kode_3("noaktif");
                action_warna_kode_4("noaktif");


                action_perataan_text_widget.length = 0;
                $w("#action_perataan_text").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_perataan_text .box_icon_disabilitas .icon_svg_sroke_color", [
                    ["active_icon_svg_sroke_color", "icon_svg_sroke_color"],
                ]);
                $w("#action_perataan_text")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(4, "#list_strip_loading_perataan_text", 4);
                $w("#text_rata_tulisan").text("Rata Tulisan");

                perataan_all_text("kiri", "noaktif");
                perataan_all_text("tengah", "noaktif");
                perataan_all_text("kanan", "noaktif");
                perataan_all_text("kanan-kiri", "noaktif");


                $w("#action_hidden_image").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_hidden_image .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);
                $w("#action_hidden_image")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");

                var _rimgs = document.querySelectorAll("img:not(.dsb-akar #widget_menu_disabilitas img)");
                for (const _rimg of _rimgs) _rimg.style.removeProperty("visibility");


                action_tulisan_dibaca.length = 0;

                $w("#action_tulisan_dapat_di_baca").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_tulisan_dapat_di_baca .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);

                $w("#list_strip_loading_action_tulisan_dapat_dibaca").hide();
                $w("#action_tulisan_dapat_di_baca")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(2, "#list_strip_loading_action_tulisan_dapat_dibaca", 2);

                $w("#text_tulisan_dapat_di_baca").text("Ramah Disleksia");

                setTimeout(() => {
                    no_active_action_tulisan_dapat_dibaca();
                }, 90);


                action_line_height_text_widget.length = 0;
                $w("#action_tulisan_line_height").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_tulisan_line_height .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);

                $w("#action_tulisan_line_height")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(3, "#list_strip_loading_action_tulisan_line_height", 3);
                _resetLineHeightHalaman();
                $w("#text_id_tinggi_garis").text("Tinggi Garis");

                _resetKelasIkon("#action_animate_pause .box_icon_disabilitas svg *", [
                    ["active_icon_svg_color", "icon_svg_color"],
                    ["active_icon_svg_sroke_color", "icon_svg_sroke_color"],
                ]);
                $w("#action_animate_pause").removeClass("active_box_menu_disabilitas");
                $w("#action_animate_pause")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                _animasiDijedaMati();

                $w("#text_id_animasi").text("Animasi Dijeda");


                action_kursor_widget.length = 0;
                $w("#action_kursor").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_kursor .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);
                $w("#action_kursor")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                $(".cursor_website_all").removeClass("cursor_website_all");

                $w("#list_strip_loading_action_kursor").hide();

                strip_batch_reset(3, "#list_strip_loading_action_kursor", 3);

                action_kursor_widget.length = 0;
                $w("#action_kursor").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_kursor .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);
                $w("#action_kursor")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                $w("#list_strip_loading_action_kursor").hide();
                strip_batch_reset(3, "#list_strip_loading_action_kursor", 3);
                setTimeout(() => {
                    data_move_mouse();
                    $w("#text_id_kursor").text("Kursor");
                }, 100);

                action_space_text_widget.length = 0;
                $w("#action_space_text").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_space_text .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);
                $w("#list_strip_loading_action_space_text").hide();
                $w("#action_space_text")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(3, "#list_strip_loading_action_space_text", 3);

                _pulihkanGayaHalaman("letter-spacing");
                $w("#id_space_text").text("Spasi Huruf");


                action_text_kecil.length = 0;
                $w("#action_perkecil_text").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_perkecil_text .box_icon_disabilitas .icon_svg_color", [
                    ["active_icon_svg_color", "icon_svg_color"],
                ]);

                $w("#action_perkecil_text")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(4, "#list_strip_loading_perkecil_text", 4);

                _resetFontSizeHalaman();

                action_garis_bawahi_tautan_widget.length = 0;
                $w("#action_garis_bawahi_tautan").removeClass("active_box_menu_disabilitas");
                _resetKelasIkon("#action_garis_bawahi_tautan .box_icon_disabilitas .icon_fill_svg_color_black", [
                    ["active_icon_fill_svg_color_black", "icon_fill_svg_color_black"],
                ]);

                $w("#list_strip_loading_action_garis_bawahi_tautan").hide();
                $w("#action_garis_bawahi_tautan")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                strip_batch_reset(2, "#list_strip_loading_action_garis_bawahi_tautan", 3);

                action_perataan_text_1_2("rata1", "noaktif");
                action_perataan_text_1_2("rata2", "noaktif");

                $w("#action_tooltip").removeClass("active_box_menu_disabilitas");
                $w("#action_tooltip")
                    .find(".box_text_bottom_disabilitas")
                    .removeClass("active_box_text_bottom_disabilitas");
                _resetKelasIkon("#action_tooltip .box_icon_disabilitas .icon_svg_color", [
                    ["icon_svg_color", "icon_svg_color"],
                ]);
                $w(".tooltip_data_move_mouse_new").css({
                    left: "",
                    top: "",
                });
                $w("#move_tooltip_data").css("display", "none");

                if (!dariProfil) {
                    if (widget_current_lang !== "id") {
                        triggerGoogleTranslate("id");
                    }
                    widget_current_lang = "id";
                    $w(".list_bahasa_item").removeClass("active_bahasa_item");
                    $w("#bahasa_item_id").addClass("active_bahasa_item");
                    _tampilkanNilaiBahasa("id");
                    $w("#dropdown_bahasa_widget").attr("aria-expanded", "false");
                    $w("#show_bahasa_widget_dsb").hide();
                }

                _hapusStorageWidget(dariProfil);

                if (getOS() == "Android") {
                    $w(".column_text_persegi_riset").cssImportant("font-size", "12px");
                }
                reset_profile_all("no");

                _tampilkanNilaiProfil(null);
            }

            function action_only_one_profil_aksesbilitas(id, status) {
                if ($w(id).hasClass("active_box_profile_aksesbilitas") || status == "noactive") {
                    $w(id).removeClass("active_box_profile_aksesbilitas");
                    $w(id + " *").each(function (_i, item) {
                        var name_class = item.classList.value;

                        if (name_class.includes("active_color_svg_content_profile_disabilitas")) {
                            item.classList = "color_svg_content_profile_disabilitas";
                        }

                        if (name_class.includes("active_text_list_content_profile_disabilitas")) {
                            item.classList = "text_list_content_profile_disabilitas";
                        }

                        if (name_class.includes("active_fill_icon_dsb")) {
                            item.classList = "fill_icon_dsb";
                        }

                        if (name_class.includes("active_icon_list_content_profile_disabilitas")) {
                            item.classList = "icon_list_content_profile_disabilitas";
                        }
                    });
                } else if (status == "active") {
                    reset_all_perngaturan_widget(true);
                    $w(id).addClass("active_box_profile_aksesbilitas");
                    $w(id + " *").each(function (_i, item) {
                        var name_class = item.classList.value;
                        if (name_class.includes("color_svg_content_profile_disabilitas")) {
                            item.classList = "active_color_svg_content_profile_disabilitas";
                        }

                        if (name_class.includes("fill_icon_dsb")) {
                            item.classList = "fill_icon_dsb active_fill_icon_dsb";
                        }

                        if (name_class.includes("text_list_content_profile_disabilitas")) {
                            item.classList =
                                "text_list_content_profile_disabilitas active_text_list_content_profile_disabilitas";
                        }

                        if (name_class.includes("icon_list_content_profile_disabilitas")) {
                            item.classList =
                                "icon_list_content_profile_disabilitas active_icon_list_content_profile_disabilitas";
                        }
                    });

                    if (id == "#action_gangguan_motorik") {
                        _widgetStorage.setItem("action_widget_profil", "1");
                        _widgetStorage.setItem("action_animate_pause", "1");
                        _widgetStorage.setItem("tooltip_active", "1");

                        action_gangguna_motorik_process();

                        _tampilkanNilaiProfil("Gangguan Motorik");
                    } else if (id == "#action_netra_total") {
                        _widgetStorage.setItem("action_widget_profil", "2");
                        action_moda_suara_process();
                        _tampilkanNilaiProfil("Netra Total");
                    } else if (id == "#action_buta_warna") {
                        _widgetStorage.setItem("action_widget_profil", "3");
                        _widgetStorage.setItem("grey_scale_active", "2");
                        action_buta_warna_process();
                        _tampilkanNilaiProfil("Buta Warna");
                    } else if (id == "#action_disleksia") {
                        _widgetStorage.setItem("action_widget_profil", "4");
                        _widgetStorage.setItem("action_tulisan_dpt_dibaca", "1");
                        action_disleksia_process();
                        _tampilkanNilaiProfil("Disleksia");
                    } else if (id == "#action_gangguan_pengelihatan") {
                        _widgetStorage.setItem("action_widget_profil", "5");
                        _widgetStorage.setItem("grey_scale_active", "2");
                        _widgetStorage.setItem("text_besar", "1");
                        _widgetStorage.setItem("action_tulisan_dpt_dibaca", "2");
                        _widgetStorage.setItem("action_kursor_change", "1");
                        _widgetStorage.setItem("action_animate_pause", "1");
                        _widgetStorage.setItem("tooltip_active", "1");
                        action_gangguan_pengelihatan_process();
                        _tampilkanNilaiProfil("Gangguan Penglihatan");
                    } else if (id == "#action_kognitif_pembelajaran") {
                        _widgetStorage.setItem("action_widget_profil", "6");
                        _widgetStorage.setItem("text_besar", "1");
                        _widgetStorage.setItem("action_animate_pause", "1");
                        _widgetStorage.setItem("action_kursor_change", "3");
                        _widgetStorage.setItem("tooltip_active", "1");
                        action_kognitif_pembelajaran_process();
                        _tampilkanNilaiProfil("Kognitif & Pembelajaran");
                    } else if (id == "#action_kejang_dan_epilepsi") {
                        _widgetStorage.setItem("action_widget_profil", "7");
                        _widgetStorage.setItem("grey_scale_active", "1");
                        _widgetStorage.setItem("action_animate_pause", "1");

                        action_kejang_dan_epilepsi_process();

                        _tampilkanNilaiProfil("Kejang dan Epilepsi");
                    } else if (id == "#action_adhd") {
                        _widgetStorage.setItem("action_widget_profil", "8");
                        _widgetStorage.setItem("grey_scale_active", "1");
                        _widgetStorage.setItem("action_kursor_change", "2");

                        action_adhd_process();
                        _tampilkanNilaiProfil("ADHD");
                    }
                }
            }

            function action_moda_suara_process() {
                _bukaKunciSuara();
                setTimeout(() => {
                    action_moda_suara_on();
                }, 100);
            }

            var _kelasAnakProfil = [
                ["active_color_svg_content_profile_disabilitas", "color_svg_content_profile_disabilitas"],
                ["active_text_list_content_profile_disabilitas", "text_list_content_profile_disabilitas"],
                ["active_fill_icon_dsb", "fill_icon_dsb"],
                ["active_icon_list_content_profile_disabilitas", "icon_list_content_profile_disabilitas"],
            ];

            function no_active_button_link(id) {
                var _el = _widgetCari(id);
                if (_el?.classList.contains("active_box_profile_aksesbilitas")) {
                    _el.classList.remove("active_box_profile_aksesbilitas");
                    for (const [aktif, biasa] of _kelasAnakProfil) {
                        for (const anak of _el.querySelectorAll("." + aktif)) anak.setAttribute("class", biasa);
                    }
                }
            }

            var _allProfileIds = [
                "action_gangguan_motorik",
                "action_netra_total",
                "action_buta_warna",
                "action_disleksia",
                "action_gangguan_pengelihatan",
                "action_kognitif_pembelajaran",
                "action_kejang_dan_epilepsi",
                "action_adhd",
            ];

            function reset_profile_all(action_reset) {
                for (const _allProfileId of _allProfileIds) {
                    var _$el = _widgetCari("#" + _allProfileId);
                    if (_$el?.classList.contains("active_box_profile_aksesbilitas")) {
                        no_active_button_link("#" + _allProfileId);
                    }
                }
                if (action_reset == "all") {
                    reset_all_perngaturan_widget(true);
                }
                _widgetStorage.removeItem("action_widget_profil");
                _tampilkanNilaiProfil(null);
            }

            function action_find_id_profile_aksesbilitas(id) {
                var replce_id = id.replace("#", "");
                if ($w(id).hasClass("active_box_profile_aksesbilitas")) {
                    reset_profile_all("all");
                } else {
                    action_only_one_profil_aksesbilitas(id, "active");
                }

                var id_profile = [
                    "action_gangguan_motorik",
                    "action_netra_total",
                    "action_buta_warna",
                    "action_disleksia",
                    "action_gangguan_pengelihatan",
                    "action_kognitif_pembelajaran",
                    "action_kejang_dan_epilepsi",
                    "action_adhd",
                ];
                var num_array = id_profile.indexOf(replce_id);
                id_profile.splice(num_array, 1);

                for (const id_profileItem of id_profile) {
                    var id_more = "#" + id_profileItem;
                    action_only_one_profil_aksesbilitas(id_more, "noactive");
                }
            }

            $(document).on("mouseover", "a > *", function () {
                if (!_widgetSuaraAktif()) return;
                var textvalue = $(this).text().toString();
                speach(textvalue, _bahasaSuaraHalaman());
                speachmobile(textvalue, _bahasaSuaraHalaman());
            });

            $(document).on("mouseover", "a", function () {
                if (!_widgetSuaraAktif()) return;
                var textvalue = $(this).text().toString();
                speach(textvalue, _bahasaSuaraHalaman());
                speachmobile(textvalue, _bahasaSuaraHalaman());
            });

            var _seleksiTeks = {};
            _seleksiTeks.mouseup = function () {
                if (_widgetStorage.getItem("permisvoice") != "on") return;
                var userSelection;
                if (window.getSelection) {
                    userSelection = window.getSelection();
                } else if (document.selection) {
                    userSelection = document.selection.createRange();
                }
                var selectedText = userSelection;
                if (userSelection.text) selectedText = userSelection.text;
                if (selectedText != "") {
                    var textvalue = window.getSelection().toString();
                    speach(textvalue, _bahasaSuaraHalaman());
                }
            };
            $(document).ready(function () {
                $(document).on("mouseup", _seleksiTeks.mouseup);
            });
            $(document).ready(function () {
                var _timerPilihTeks = null;
                document.addEventListener("selectionchange", function () {
                    var voicecek = _widgetStorage.getItem("permismobile");
                    if (voicecek != null && voicecek == "on") {
                        clearTimeout(_timerPilihTeks);
                        _timerPilihTeks = setTimeout(_bacaSeleksiMobile, 250);
                    }
                });
            });

            $(document).on("mouseover", ".box_group_disabilitas", function () {
                if (!_widgetSuaraAktif()) return;
                var textvalue = $(this).text().toString();
                callfunction(textvalue);
            });

            $(document).on("mouseover", ".row_persegi_reset", function () {
                if (!_widgetSuaraAktif()) return;
                var textvalue = $(this).text().toString();
                callfunction(textvalue);
            });
        });

        if (base_url_website == "dprd.cilegon.go.id") {
            $w("#move_tooltip_data").css("display", "none");
        }
    }

    function _terapkanUlangGreyScale() {
        if (action_grey_scale_widget.length == 1) {
            load_active_grey_scale();
        } else if (action_grey_scale_widget.length == 2) {
            load_active_grey_scale_v2();
        } else if (action_grey_scale_widget.length == 3) {
            load_active_grey_scale_v3();
        }
    }

    function _matikanKontrasPenuh() {
        action_contrash_widget.length = 0;
        $w("#action_kontras").removeClass("active_box_menu_disabilitas");
        $w("#action_kontras").find(".box_text_bottom_disabilitas").removeClass("active_box_text_bottom_disabilitas");
        _resetKelasIkon("#action_kontras .box_icon_disabilitas path", [
            ["active_circle_multi", "circle_multi"],
            ["active_circle_single", "circle_single"],
        ]);

        strip_batch_reset(4, "#list_strip_loading_action_kontras", 4);
        $w("#svg_kontras_multi").show();
        $w("#svg_kontras_warna,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
        $w("#text_name_kontras").text("Kontras+");
        action_warna_kode_1("noaktif");
        action_warna_kode_2("noaktif");
        action_warna_kode_3("noaktif");
        action_warna_kode_4("noaktif");

        var _styledEls = document.querySelectorAll(
            "[style]:not(.dsb-akar #widget_menu_disabilitas):not(.dsb-akar #widget_menu_disabilitas *)"
        );
        for (const _styledEl of _styledEls) {
            var _sty = _styledEl.style[0];
            if (_sty == undefined || _sty == null || _sty == "") {
                _styledEl.removeAttribute("style");
            }
        }

        _widgetStorage.removeItem("action_kontras");
        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Kontras+");
            }, 100);
        }

        _terapkanUlangGreyScale();
        _terapkanUlangGarisTautan();
    }

    function _naikkanTingkatKontras() {
        load_active_kontras();
        var langkah = [action_kontras_1, action_kontras_2, action_kontras_3, action_kontras_4];
        var tingkatSekarang = action_contrash_widget.length;
        if (tingkatSekarang < langkah.length) {
            _widgetStorage.setItem("action_kontras", String(tingkatSekarang + 1));
            langkah[tingkatSekarang]();
        }
        action_contrash_widget.push(1);
    }

    function _nomorRadioPosisi(value) {
        return ["left_top", "right_top", "left_bottom", "right_bottom"].indexOf(value) + 1;
    }

    function _kelasPosisiWidget(value) {
        if (value == "left_top") return "circle_left_top_sidebar";
        if (value == "right_top") return "circle_right_top_sidebar";
        if (value == "right_bottom") return "circle_right_sidebar";
        return "";
    }

    function _resetFontSizeHalaman() {
        _pulihkanGayaHalaman("font-size");
    }

    function _resetLineHeightHalaman() {
        _pulihkanGayaHalaman("line-height");
    }

    function _resetKelasIkon(selector, pasangan) {
        $w(selector).each(function (_i, item) {
            var name_class = item.classList.value;
            for (const p of pasangan) {
                if (name_class.includes(p[0])) {
                    item.classList = p[1];
                }
            }
        });
    }

    function cek_grey_scale_active_no_active() {
        if (action_grey_scale_widget.length == 1 && action_contrash_widget.length > 0) {
            load_active_grey_scale();
        } else if (action_grey_scale_widget.length == 2 && action_contrash_widget.length > 0) {
            load_active_grey_scale_v2();
        } else if (action_grey_scale_widget.length == 3 && action_contrash_widget.length > 0) {
            load_active_grey_scale_v3();
        }
    }

    function _widgetSuaraAktif() {
        return _widgetStorage.getItem("permisvoice") == "on" || _widgetStorage.getItem("permismobile") == "on";
    }

    var _widgetTtsCache = new Map();
    var _WIDGET_TTS_CACHE_MAKS = 40;

    function _widgetTtsAmbil(valueText, kodeBahasa) {
        var bahasa = _SUARA_BAHASA[kodeBahasa] ? kodeBahasa : "id";
        var kunciCache = bahasa + "|" + valueText;
        var tersimpan = _widgetTtsCache.get(kunciCache);
        if (tersimpan) return tersimpan;

        var suara =
            bahasa === "id"
                ? { languageCode: "id-ID", name: "id-ID-Wavenet-D", ssmlGender: "FEMALE" }
                : { languageCode: _suaraBahasa(bahasa)[0], ssmlGender: "FEMALE" };

        var permintaan = fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(api_key_google)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: {
                        text: valueText,
                    },
                    voice: suara,
                    audioConfig: {
                        audioEncoding: "MP3",
                    },
                }),
            }
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (!data?.audioContent) {
                    throw new Error("Respons text-to-speech tanpa audioContent");
                }
                return `data:audio/mp3;base64,${data.audioContent}`;
            });

        _widgetTtsCache.set(kunciCache, permintaan);
        if (_widgetTtsCache.size > _WIDGET_TTS_CACHE_MAKS) {
            _widgetTtsCache.delete(_widgetTtsCache.keys().next().value);
        }
        void permintaan.catch(function () {
            if (_widgetTtsCache.get(kunciCache) === permintaan) {
                _widgetTtsCache.delete(kunciCache);
            }
        });
        return permintaan;
    }

    // ---- Mesin suara (Moda Suara dan Baca Halaman, ponsel maupun desktop) ----
    // Urutan pilihan:
    //   1. "google": Google Cloud Text-to-Speech, bila api-key-google diisi;
    //   2. "rv"    : ResponsiveVoice, bila api-key-resvoice diisi dan skripnya sudah termuat
    //                (ResponsiveVoice sendiri mendahulukan suara bahasa Indonesia bawaan perangkat,
    //                lalu audio dari servernya);
    //   3. "web"   : suara bawaan perangkat / peramban (Web Speech API).
    // Bila satu mesin gagal saat dipakai, ucapan yang sama langsung dicoba dengan mesin berikutnya.
    // Mesin yang terbukti rusak (permintaan Google gagal, ResponsiveVoice tidak mulai bicara)
    // dilewati sampai halaman dimuat ulang, agar tidak menunggu batas waktu di setiap ucapan.
    var _MESIN_SUARA = ["google", "rv", "web"];
    var _mesinSuaraRusak = {};
    // ResponsiveVoice tidak memanggil onstart/onend/onerror sama sekali bila audio servernya tidak
    // terjangkau (mis. diblokir CSP), jadi kegagalannya hanya bisa dikenali dari batas waktu.
    var _RV_BATAS_MULAI = 5000;
    // Jeda sebelum meminta Google: arahan kursor yang lewat cepat (dan pasangan event "a" / "a > *")
    // tidak menjadi permintaan berbayar.
    var _GOOGLE_JEDA = 200;
    var _suaraUrutan = 0;
    var _ucapanBawaanAktif = null;
    var _ucapanKunci = null;
    var _kunciSuaraTerbuka = false;

    function _mesinSuaraTersedia(mesin) {
        if (_mesinSuaraRusak[mesin]) return false;
        if (mesin === "google") return !!api_key_google;
        if (mesin === "rv") {
            return (
                typeof responsiveVoice !== "undefined" &&
                typeof responsiveVoice.voiceSupport === "function" &&
                !!responsiveVoice.voiceSupport()
            );
        }
        if (mesin === "web") return !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function";
        return false;
    }

    function _mesinSuaraBerikut(setelah) {
        for (var i = setelah ? _MESIN_SUARA.indexOf(setelah) + 1 : 0; i < _MESIN_SUARA.length; i++) {
            if (_mesinSuaraTersedia(_MESIN_SUARA[i])) return _MESIN_SUARA[i];
        }
        return null;
    }

    function _audioWidget() {
        if (!audio) audio = new Audio();
        return audio;
    }

    function pauseAudio() {
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    // Di Safari / iOS, speak() tepat setelah cancel() kadang diabaikan: cancel() hanya bila memang ada suara.
    // Ucapan hening pembuka kunci (lihat _bukaKunciSuara) dibiarkan selesai sendiri, tidak dibatalkan.
    function _batalkanSuaraBawaan() {
        var ss = window.speechSynthesis;
        if (!ss || !(ss.speaking || ss.pending)) return;
        if (_ucapanKunci && !_ucapanBawaanAktif) return;
        ss.cancel();
    }

    function _hentikanMesinSuara() {
        _batalkanSuaraBawaan();
        if (typeof responsiveVoice !== "undefined" && typeof responsiveVoice.cancel === "function") {
            try {
                responsiveVoice.cancel();
            } catch (e) {
                // ResponsiveVoice belum siap: tidak ada yang perlu dihentikan.
            }
        }
        pauseAudio();
    }

    // Membatalkan ucapan Moda Suara yang sedang berjalan atau masih menunggu (mis. saat Moda Suara dimatikan).
    function _hentikanSuaraModa() {
        _suaraUrutan++;
        _hentikanMesinSuara();
    }

    // iOS / Safari hanya mengizinkan audio dan speechSynthesis yang pertama kali diputar dari ketukan
    // pengguna. Dipanggil langsung di handler klik (Moda Suara / Baca Halaman) agar suara yang datang
    // belakangan (setelah permintaan Google, atau dari mesin cadangan) tidak ditolak.
    function _bukaKunciSuara() {
        if (_kunciSuaraTerbuka) return;
        try {
            // WAV 8 kHz, 1 sampel hening.
            var bunyiSenyap = [
                82, 73, 70, 70, 37, 0, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 64, 31, 0, 0,
                64, 31, 0, 0, 1, 0, 8, 0, 100, 97, 116, 97, 1, 0, 0, 0, 128,
            ];
            var el = _audioWidget();
            el.muted = true;
            el.onended = null;
            el.onerror = null;
            el.src = "data:audio/wav;base64," + btoa(String.fromCodePoint.apply(null, bunyiSenyap));
            Promise.resolve(el.play()).then(
                function () {
                    _kunciSuaraTerbuka = true;
                },
                function (e) {
                    // AbortError: pemutaran sudah diizinkan, hanya dipotong oleh suara yang langsung menyusul.
                    // NotAllowedError (bukan dari ketukan pengguna): dicoba lagi pada ketukan berikutnya.
                    if (e?.name === "AbortError") _kunciSuaraTerbuka = true;
                }
            );
        } catch (e) {
            // Audio tidak tersedia.
        }
        if (_mesinSuaraTersedia("web") && !_ucapanKunci) {
            var kosong = new SpeechSynthesisUtterance(" ");
            kosong.volume = 0;
            var lepas = function () {
                if (_ucapanKunci === kosong) _ucapanKunci = null;
            };
            kosong.onend = lepas;
            kosong.onerror = lepas;
            _ucapanKunci = kosong;
            setTimeout(lepas, 1500);
            window.speechSynthesis.speak(kosong);
        }
    }

    // Memilih suara bawaan yang cocok dengan bahasa: bahasa yang persis sama dulu, lalu suara lokal
    // (terpasang di perangkat) sebelum suara online. Android lama memakai kode "in" untuk Indonesia.
    function _normKodeBahasa(l) {
        return String(l || "").replaceAll("_", "-").toLowerCase();
    }

    function _suaraBawaanCocok(lang) {
        var norm = _normKodeBahasa;
        var target = norm(lang);
        var awal = target.split("-")[0];
        var awalan = awal === "id" ? ["id", "in"] : [awal];
        var daftar = (window.speechSynthesis.getVoices() || []).filter(function (v) {
            return awalan.includes(norm(v.lang).split("-")[0]);
        });
        daftar.sort(function (a, b) {
            return (
                (norm(b.lang) === target ? 1 : 0) - (norm(a.lang) === target ? 1 : 0) ||
                (b.localService ? 1 : 0) - (a.localService ? 1 : 0)
            );
        });
        return daftar[0] || null;
    }

    // kb: { berlaku(), selesai(), gagal(rusak), terputus() }
    function _ucapkanGoogle(teks, kodeBahasa, kb) {
        _widgetTtsAmbil(teks, kodeBahasa).then(
            function (sumber) {
                if (!kb.berlaku()) return;
                var el = _audioWidget();
                pauseAudio();
                el.muted = false;
                el.onended = kb.selesai;
                el.onerror = function () {
                    kb.gagal(false);
                };
                el.src = sumber;
                // Penolakan play() (kebijakan autoplay) bukan berarti Google rusak: cukup pindah mesin untuk ucapan ini.
                Promise.resolve(el.play()).catch(function () {
                    kb.gagal(false);
                });
            },
            function () {
                kb.gagal(true);
            }
        );
    }

    function _ucapkanRV(teks, kodeBahasa, kb) {
        var mulai = false;
        var beres = false;
        var batas = setTimeout(function () {
            if (mulai || beres || !kb.berlaku()) return;
            beres = true;
            try {
                responsiveVoice.cancel();
            } catch (e) {
                // abaikan
            }
            kb.gagal(true);
        }, _RV_BATAS_MULAI);
        var akhiri = function (berhasil) {
            if (beres) return;
            beres = true;
            clearTimeout(batas);
            if (berhasil) {
                kb.selesai();
            } else {
                kb.gagal(true);
            }
        };
        responsiveVoice.speak(teks, _suaraBahasa(kodeBahasa)[1], {
            onstart: function () {
                mulai = true;
                clearTimeout(batas);
            },
            onend: function () {
                akhiri(mulai);
            },
            onerror: function () {
                akhiri(false);
            },
        });
    }

    function _ucapkanBawaan(teks, kodeBahasa, kb) {
        var lang = _suaraBahasa(kodeBahasa)[0];
        var ucapan = new SpeechSynthesisUtterance(teks);
        ucapan.lang = lang;
        var suara = _suaraBawaanCocok(lang);
        if (suara) ucapan.voice = suara;
        ucapan.onend = function () {
            if (_ucapanBawaanAktif === ucapan) _ucapanBawaanAktif = null;
            kb.selesai();
        };
        ucapan.onerror = function (e) {
            if (_ucapanBawaanAktif === ucapan) _ucapanBawaanAktif = null;
            if (e && (e.error === "interrupted" || e.error === "canceled")) {
                kb.terputus();
                return;
            }
            kb.gagal(false);
        };
        _batalkanSuaraBawaan();
        // Simpan rujukan: Chrome bisa membuang ucapan dari memori sebelum onend terpanggil.
        // Diisi sesudah _batalkanSuaraBawaan agar ucapan hening pembuka kunci tidak ikut dibatalkan.
        _ucapanBawaanAktif = ucapan;
        window.speechSynthesis.speak(ucapan);
    }

    function _jalankanMesinSuara(mesin, teks, kodeBahasa, kb) {
        if (mesin === "google") {
            _ucapkanGoogle(teks, kodeBahasa, kb);
        } else if (mesin === "rv") {
            _ucapkanRV(teks, kodeBahasa, kb);
        } else {
            _ucapkanBawaan(teks, kodeBahasa, kb);
        }
    }

    // Ucapan Moda Suara: ucapan baru selalu menggantikan yang lama.
    function _ucapkan(teks, kodeBahasa) {
        var urutan = ++_suaraUrutan;
        _hentikanMesinSuara();
        if (isBlank(teks)) return;
        var berlaku = function () {
            return urutan === _suaraUrutan;
        };
        var coba = function (mesin) {
            if (!berlaku()) return;
            if (!mesin) {
                _beritahuSuaraTidakDidukung();
                return;
            }
            var kb = {
                berlaku: berlaku,
                selesai: function () {},
                terputus: function () {},
                gagal: function (rusak) {
                    if (!berlaku()) return;
                    if (rusak) _mesinSuaraRusak[mesin] = true;
                    coba(_mesinSuaraBerikut(mesin));
                },
            };
            if (mesin === "google") {
                setTimeout(function () {
                    if (berlaku()) _ucapkanGoogle(teks, kodeBahasa, kb);
                }, _GOOGLE_JEDA);
                return;
            }
            _jalankanMesinSuara(mesin, teks, kodeBahasa, kb);
        };
        coba(_mesinSuaraBerikut(null));
    }

    var _suaraTidakDidukungDiberitahu = false;

    function _beritahuSuaraTidakDidukung() {
        if (_suaraTidakDidukungDiberitahu) return;
        _suaraTidakDidukungDiberitahu = true;
        alert("Suara tidak dapat diputar di peramban atau perangkat ini.");
    }

    function speachmobile(value, kodeBahasa) {
        if (_widgetStorage.getItem("permismobile") !== "on") return;
        _ucapkan(value, kodeBahasa);
    }

    function speach(value, kodeBahasa) {
        if (_widgetStorage.getItem("permisvoice") !== "on") return;
        _ucapkan(value, kodeBahasa);
    }

    (function () {
        if (!("speechSynthesis" in window) || !window.speechSynthesis) return;
        var _timerJagaSuara = setInterval(function () {
            if (!window.speechSynthesis.speaking) {
                clearInterval(_timerJagaSuara);
            } else {
                window.speechSynthesis.resume();
            }
        }, 1000);
    })();

    function callfunction(value, kodeBahasa) {
        var voicecek = _widgetStorage.getItem("permismobile");
        if (voicecek != null && voicecek == "on") {
            setTimeout(() => {
                speachmobile(value, kodeBahasa);
            }, 50);
        } else {
            speach(value, kodeBahasa);
        }
    }

    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
            macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
            windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
            iosPlatforms = ["iPhone", "iPad", "iPod"],
            os = null;
        if (iosPlatforms.includes(platform) || /iPhone|iPad|iPod/.test(userAgent)) {
            os = "iOS";
        } else if (macosPlatforms.includes(platform)) {
            // iPadOS 13+ mengaku "MacIntel"; bedanya, iPad punya layar sentuh.
            os = (window.navigator.maxTouchPoints || 0) > 1 ? "iOS" : "Mac OS";
        } else if (windowsPlatforms.includes(platform)) {
            os = "Windows";
        } else if (/Android/.test(userAgent)) {
            os = "Android";
        } else if (/Linux/.test(platform)) {
            os = "Linux";
        }
        return os;
    }

    var _FITUR_KELAS = [
        {
            id: "action_sorot_judul",
            kunci: "dsb_sorot_judul",
            nama: "Sorot Judul",
            lacak: "sorot-judul",
            tingkat: [["dsb-sorot-judul", "Sorot Judul"]],
        },
        {
            id: "action_sorot_fokus",
            kunci: "dsb_sorot_fokus",
            nama: "Sorot Fokus",
            lacak: "sorot-fokus",
            tingkat: [["dsb-sorot-fokus", "Sorot Fokus"]],
        },
        {
            id: "action_teks_tebal",
            kunci: "dsb_teks_tebal",
            nama: "Teks Tebal",
            lacak: "teks-tebal",
            tingkat: [["dsb-teks-tebal", "Teks Tebal"]],
        },
        {
            id: "action_spasi_kata",
            kunci: "dsb_spasi_kata",
            nama: "Spasi Kata",
            lacak: "spasi-kata",
            tingkat: [
                ["dsb-spasi-kata-1", "Spasi Kata Ringan"],
                ["dsb-spasi-kata-2", "Spasi Kata Sedang"],
                ["dsb-spasi-kata-3", "Spasi Kata Lebar"],
            ],
        },
        {
            id: "action_bisukan_media",
            kunci: "dsb_bisukan_media",
            nama: "Bisukan Media",
            lacak: "bisukan-media",
            tingkat: [["dsb-bisukan-media", "Media Dibisukan"]],
            efek: _efekBisukanMedia,
        },
        {
            id: "action_deskripsi_gambar",
            kunci: "dsb_deskripsi_gambar",
            nama: "Deskripsi Gambar",
            lacak: "deskripsi-gambar",
            tingkat: [["dsb-deskripsi-gambar", "Deskripsi Gambar"]],
            efek: _efekDeskripsiGambar,
        },
        {
            id: "action_baca_halaman",
            kunci: "dsb_baca_halaman",
            nama: "Baca Halaman",
            lacak: "baca-halaman",
            tingkat: [["dsb-baca-halaman", "Sedang Membaca"]],
            efek: _efekBacaHalaman,
            simpan: false,
            diam: true,
        },
        {
            id: "action_isyarat_sibi",
            kunci: "dsb_isyarat_sibi",
            nama: "SIBI (Abjad 1\u00a0Tangan)",
            lacak: "isyarat-sibi",
            tingkat: [["dsb-isyarat-sibi", "SIBI (Abjad 1\u00a0Tangan)"]],
            efek: _efekIsyaratSibi,
        },
        {
            id: "action_isyarat_bisindo",
            kunci: "dsb_isyarat_bisindo",
            nama: "BISINDO (Abjad 1\u00a0dan 2\u00a0Tangan)",
            lacak: "isyarat-bisindo",
            tingkat: [["dsb-isyarat-bisindo", "BISINDO (Abjad 1\u00a0dan 2\u00a0Tangan)"]],
            efek: _efekIsyaratBisindo,
        },
    ];

    function _tingkatFiturKelas(f) {
        var kelasAkar = document.documentElement.classList;
        for (var i = 0; i < f.tingkat.length; i++) {
            if (kelasAkar.contains(f.tingkat[i][0])) return i + 1;
        }
        return 0;
    }

    function _terapkanFiturKelas(f, tingkat) {
        _tampilkanFiturKelas(f, tingkat);
        for (const t of f.tingkat) _kelasHtml(t[0], false);
        if (tingkat > 0) _kelasHtml(f.tingkat[tingkat - 1][0], true);
        _jadwalkanKirimPengaturan();
        if (f.simpan !== false) {
            if (tingkat > 0) {
                _widgetStorage.setItem(f.kunci, String(tingkat));
            } else {
                _widgetStorage.removeItem(f.kunci);
            }
        }
        if (f.efek) f.efek(tingkat);
    }

    var _baca = {
        aktif: false,
        jeda: false,
        potongan: [],
        indeks: 0,
        mesin: null,
        urutan: 0,
        sorot: null,
        pemutar: null,
        status: null,
        tombolJeda: null,
        jaga: null,
    };
    var _BACA_MAKS_HURUF = 280;
    var _IKON_PEMUTAR = {
        mundur: "M6 6h2v12H6zm3.5 6l8.5 6V6z",
        jeda: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
        putar: "M8 5v14l11-7z",
        maju: "M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z",
        henti: "M6 6h12v12H6z",
    };

    function _fiturBaca() {
        return _FITUR_KELAS.find(function (f) {
            return f.id === "action_baca_halaman";
        });
    }

    function _bacaMesin() {
        return _mesinSuaraBerikut(null);
    }

    function _bacaBlok(el, akar, cacheDisplay) {
        var kini = el;
        while (kini && kini !== akar) {
            var d = cacheDisplay.get(kini);
            if (d === undefined) {
                d = window.getComputedStyle(kini).display;
                cacheDisplay.set(kini, d);
            }
            if (!/^(inline|contents|ruby)/.test(d)) return kini;
            kini = kini.parentElement;
        }
        return akar;
    }

    function _bacaPecah(teks) {
        if (teks.length <= _BACA_MAKS_HURUF) return [teks];
        var hasil = [];
        var kini = "";
        var simpan = function () {
            if (kini.trim()) hasil.push(kini.trim());
            kini = "";
        };
        var tambahKata = function (kata) {
            if (kini && (kini + " " + kata).length > _BACA_MAKS_HURUF) simpan();
            kini += (kini ? " " : "") + kata;
        };
        for (const kalimat of teks.match(/[^.!?;:]+[.!?;:]*\s*/g) || [teks]) {
            if (kini && (kini + kalimat).length > _BACA_MAKS_HURUF) simpan();
            if (kalimat.length <= _BACA_MAKS_HURUF) {
                kini += kalimat;
                continue;
            }
            for (const kata of kalimat.split(" ")) tambahKata(kata);
        }
        simpan();
        return hasil;
    }

    var _BACA_LEWATI_TAG =
        /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|TEXTAREA|SELECT|OPTION|SVG|IFRAME|CANVAS|VIDEO|AUDIO|BUTTON)$/i;

    function _bacaKumpulkan() {
        var akar = document.querySelector("main, [role='main']");
        if (!akar || _widgetFunkyMilikWidget(akar) || !_elemenTerlihat(akar)) akar = document.body;
        var cacheDisplay = new Map();
        var cacheTampak = new Map();
        var potongan = [];
        var blokKini = null;
        var teksKini = "";
        var tutupBlok = function () {
            var teks = teksKini.replace(/\s+/g, " ").trim();
            if (blokKini && teks) {
                for (const t of _bacaPecah(teks)) potongan.push({ el: blokKini, teks: t });
            }
            teksKini = "";
        };
        var walker = document.createTreeWalker(akar, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                if (n.nodeType === 3) return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                if (_BACA_LEWATI_TAG.test(n.tagName) || n.classList.contains("dsb-akar"))
                    return NodeFilter.FILTER_REJECT;
                if (n.getAttribute("aria-hidden") === "true") return NodeFilter.FILTER_REJECT;
                if (n.getClientRects().length === 0 && window.getComputedStyle(n).display !== "contents") {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_SKIP;
            },
        });
        for (var n = walker.nextNode(); n && potongan.length < 2000; n = walker.nextNode()) {
            var induk = n.parentElement;
            var tampak = cacheTampak.get(induk);
            if (tampak === undefined) {
                tampak = window.getComputedStyle(induk).visibility !== "hidden";
                cacheTampak.set(induk, tampak);
            }
            if (!tampak) continue;
            var blok = _bacaBlok(induk, akar, cacheDisplay);
            if (blok !== blokKini) {
                tutupBlok();
                blokKini = blok;
            }
            teksKini += " " + n.nodeValue;
        }
        tutupBlok();
        return potongan;
    }

    function _bacaSorot(el) {
        if (_baca.sorot && _baca.sorot !== el) _baca.sorot.classList.remove("dsb-baca-sorot");
        _baca.sorot = el;
        if (!el || el === document.body) return;
        el.classList.add("dsb-baca-sorot");
        var r = el.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ block: "center" });
    }

    function _bacaTombol(label, ikon, aksi) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "dsb_pemutar_tombol";
        b.setAttribute("aria-label", label);
        b.title = label;
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "22");
        svg.setAttribute("height", "22");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", ikon);
        svg.appendChild(path);
        b.appendChild(svg);
        b.addEventListener("click", function (e) {
            e.preventDefault();
            aksi();
        });
        return b;
    }

    function _bacaPemutar() {
        if (_baca.pemutar) return _baca.pemutar;
        var bar = document.createElement("div");
        bar.className = "dsb_pemutar notranslate";
        bar.setAttribute("translate", "no");
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Pemutar Baca Halaman");
        bar.setAttribute("lang", "id");
        _baca.tombolJeda = _bacaTombol("Jeda", _IKON_PEMUTAR.jeda, function () {
            if (_baca.jeda) {
                _bacaLanjut();
            } else {
                _bacaJeda();
            }
        });
        _baca.status = document.createElement("div");
        _baca.status.className = "dsb_pemutar_status";
        bar.appendChild(
            _bacaTombol("Bagian sebelumnya", _IKON_PEMUTAR.mundur, function () {
                _bacaGeser(-1);
            })
        );
        bar.appendChild(_baca.tombolJeda);
        bar.appendChild(
            _bacaTombol("Bagian berikutnya", _IKON_PEMUTAR.maju, function () {
                _bacaGeser(1);
            })
        );
        bar.appendChild(
            _bacaTombol("Berhenti membaca", _IKON_PEMUTAR.henti, function () {
                _terapkanFiturKelas(_fiturBaca(), 0);
            })
        );
        bar.appendChild(_baca.status);
        create_slider_mouse.appendChild(bar);
        _baca.pemutar = bar;
        return bar;
    }

    function _bacaPerbaruiPemutar() {
        if (!_baca.pemutar) return;
        _baca.status.textContent =
            (_baca.jeda ? "Dijeda " : "Membaca ") + (_baca.indeks + 1) + " / " + _baca.potongan.length;
        var label = _baca.jeda ? "Lanjutkan" : "Jeda";
        _baca.tombolJeda.setAttribute("aria-label", label);
        _baca.tombolJeda.title = label;
        _baca.tombolJeda.querySelector("path").setAttribute("d", _baca.jeda ? _IKON_PEMUTAR.putar : _IKON_PEMUTAR.jeda);
    }

    function _bacaHentikanSuara() {
        _baca.urutan++;
        _hentikanMesinSuara();
    }

    function _bacaUcapkan() {
        var p = _baca.potongan[_baca.indeks];
        if (!p) {
            _terapkanFiturKelas(_fiturBaca(), 0);
            return;
        }
        _bacaSorot(p.el);
        _bacaPerbaruiPemutar();
        var urutan = ++_baca.urutan;
        var kodeBahasa = _bahasaSuaraHalaman();
        var berlaku = function () {
            return urutan === _baca.urutan && _baca.aktif && !_baca.jeda;
        };
        var tertahan = function () {
            if (urutan !== _baca.urutan || !_baca.aktif) return;
            _baca.jeda = true;
            _baca.urutan++;
            _bacaPerbaruiPemutar();
        };
        _jalankanMesinSuara(_baca.mesin, p.teks, kodeBahasa, {
            berlaku: berlaku,
            selesai: function () {
                if (!berlaku()) return;
                _baca.indeks++;
                _bacaUcapkan();
            },
            terputus: tertahan,
            gagal: function (rusak) {
                if (!berlaku()) return;
                if (rusak) _mesinSuaraRusak[_baca.mesin] = true;
                var berikut = _mesinSuaraBerikut(_baca.mesin);
                if (!berikut) {
                    tertahan();
                    _beritahuSuaraTidakDidukung();
                    return;
                }
                // Bagian yang sama diulang dengan mesin berikutnya.
                _baca.mesin = berikut;
                _bacaJagaChrome(true);
                _bacaUcapkan();
            },
        });
    }

    function _bacaJeda() {
        if (!_baca.aktif || _baca.jeda) return;
        _baca.jeda = true;
        _bacaHentikanSuara();
        _bacaPerbaruiPemutar();
    }

    function _bacaLanjut() {
        if (!_baca.aktif) return;
        _baca.jeda = false;
        _bacaUcapkan();
    }

    function _bacaGeser(langkah) {
        if (!_baca.aktif) return;
        _baca.indeks = Math.max(0, Math.min(_baca.potongan.length - 1, _baca.indeks + langkah));
        _baca.jeda = false;
        _bacaUcapkan();
    }

    function _bacaJagaChrome(nyala) {
        clearInterval(_baca.jaga);
        _baca.jaga = null;
        var os = getOS();
        if (!nyala || _baca.mesin !== "web" || os === "Android" || os === "iOS") return;
        // Hanya untuk bug Chrome/Edge desktop (suara berhenti setelah ~15 detik); Safari dan Firefox
        // tidak membutuhkannya, dan jeda-lanjut paksa di sana justru bisa memotong suara.
        if (!/Chrome\/|Chromium\//.test(window.navigator.userAgent)) return;
        _baca.jaga = setInterval(function () {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            }
        }, 10000);
    }

    function _bacaMulai() {
        _bukaKunciSuara();
        _baca.mesin = _bacaMesin();
        if (!_baca.mesin) {
            _beritahuSuaraTidakDidukung();
            return false;
        }
        _baca.potongan = _bacaKumpulkan();
        if (!_baca.potongan.length) return false;
        _baca.indeks = 0;
        for (var i = 0; i < _baca.potongan.length; i++) {
            if (_baca.potongan[i].el.getBoundingClientRect().bottom > 0) {
                _baca.indeks = i;
                break;
            }
        }
        _baca.aktif = true;
        _baca.jeda = false;
        _bacaPemutar().classList.add("dsb_pemutar_tampil");
        _bacaJagaChrome(true);
        _bacaUcapkan();
        return true;
    }

    function _bacaBerhenti() {
        if (_baca.pemutar) _baca.pemutar.classList.remove("dsb_pemutar_tampil");
        if (!_baca.aktif) return;
        _baca.aktif = false;
        _baca.jeda = false;
        _bacaHentikanSuara();
        _bacaSorot(null);
        _bacaJagaChrome(false);
        _baca.potongan = [];
    }

    function _efekBacaHalaman(tingkat) {
        if (tingkat === 0) {
            _bacaBerhenti();
            return;
        }
        if (_baca.aktif) return;
        var dariKeyboard = _aksiDariKeyboard;
        if (!_bacaMulai()) {
            setTimeout(function () {
                _terapkanFiturKelas(_fiturBaca(), 0);
            }, 0);
            return;
        }
        var tutup = _widgetCari("#circle_close_popup_dsb");
        if (_menuWidgetTerbuka() && tutup) tutup.click();
        if (dariKeyboard) _baca.tombolJeda.focus({ preventScroll: true });
    }

    var _isyarat = { panel: null, sistem: null };
    var _ISYARAT_PETAK = { action_isyarat_sibi: "SIBI", action_isyarat_bisindo: "BISINDO" };
    var _ISYARAT_BERKAS_3D = "widget_disabilitas_3d.js";
    var _ISYARAT_BERKAS_MODEL = "widget_disabilitas_avatar.vrm";
    var _ISYARAT_FOLDER_3D = "https://web.animemusic.us/avatar-3d-anime/";

    function _fiturIsyarat(sistem) {
        return _FITUR_KELAS.find(function (f) {
            return _ISYARAT_PETAK[f.id] === sistem;
        });
    }

    function _isyaratModeUji() {
        var atribut = _atributSkrip("isyarat-uji");
        if (atribut === "1" || atribut === "0") return atribut === "1";
        return ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
    }

    function _isyaratAlamat3D() {
        if (_atributSkrip("isyarat-3d") === "0") return null;
        if (!window.WebGL2RenderingContext) return null;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return null;
        try {
            var dasar = _skripWidget?.src || document.baseURI;
            var folder = new URL(_atributSkrip("isyarat-3d-folder") || _ISYARAT_FOLDER_3D, dasar);
            if (folder.protocol !== "https:" && folder.protocol !== "http:") return null;
            if (!folder.pathname.endsWith("/")) folder.pathname += "/";
            return {
                modul: new URL(_ISYARAT_BERKAS_3D, folder).href,
                model: new URL(_ISYARAT_BERKAS_MODEL, folder).href,
            };
        } catch {
            // URL folder avatar 3D tidak valid: anggap avatar 3D tidak tersedia.
            return null;
        }
    }

    function _isyaratMuat3D(rangka) {
        var alamat = _isyaratAlamat3D();
        if (!alamat) return Promise.reject(new Error("avatar 3D tidak dipakai"));
        return import(alamat.modul).then(function (modul) {
            return modul.buatPelukis({
                rangka: rangka,
                model: alamat.model,
                kotak: [47.5, 50, 305, 420],
            });
        });
    }

    function _isyaratSisiPanel() {
        var tombol = _widgetCari("#show_menu_dsb_web");
        var kelas = tombol ? tombol.className : name_class_widget;
        return /\bcircle_right(_top)?_sidebar\b/.test(String(kelas)) ? "kiri" : "kanan";
    }

    function _isyaratIkutiPosisiWidget() {
        if (_isyarat.panel) _isyarat.panel.aturSisi(_isyaratSisiPanel());
    }

    function _isyaratBuatPanel(sistem) {
        return _isyBuatPanel({
            akar: create_slider_mouse,
            nonce: _nonceHalaman,
            kamus: _isyKamus(),
            uji: _isyaratModeUji(),
            sistem: sistem,
            sisi: _isyaratSisiPanel(),
            ambilBlok: _bacaKumpulkan,
            milikWidget: _widgetFunkyMilikWidget,
            muat3d: _isyaratAlamat3D() ? _isyaratMuat3D : null,
            saatTutup: function () {
                _terapkanFiturKelas(_fiturIsyarat(sistem), 0);
            },
        });
    }

    function _isyaratBuka(sistem) {
        if (_isyarat.panel && _isyarat.sistem !== sistem) {
            _isyarat.panel.hancur();
            _isyarat.panel = null;
        }
        if (!_isyarat.panel) _isyarat.panel = _isyaratBuatPanel(sistem);
        _isyarat.sistem = sistem;
        _isyarat.panel.aturSisi(_isyaratSisiPanel());
        _isyarat.panel.buka(false);
    }

    function _efekIsyarat(sistem, tingkat) {
        if (tingkat === 0) {
            if (_isyarat.panel && _isyarat.sistem === sistem) _isyarat.panel.tutup(true);
            return;
        }
        for (const lain of Object.values(_ISYARAT_PETAK)) {
            if (lain !== sistem && _tingkatFiturKelas(_fiturIsyarat(lain)) > 0)
                _terapkanFiturKelas(_fiturIsyarat(lain), 0);
        }
        _isyaratBuka(sistem);
    }

    function _efekIsyaratSibi(tingkat) {
        _efekIsyarat("SIBI", tingkat);
    }

    function _efekIsyaratBisindo(tingkat) {
        _efekIsyarat("BISINDO", tingkat);
    }

    const _ISY_NS = "http://www.w3.org/2000/svg";
    const _ISY_RAD = Math.PI / 180;
    const _ISY_TENGAH_X = 200;
    const _ISY_PUSAT_Y = 250;
    const _ISY_ASAL_Y = 222;
    const _ISY_BAHU = [127, 249, 0];
    const _ISY_L_ATAS = 96;
    const _ISY_L_BAWAH = 88;
    const _ISY_U = 33;
    const _ISY_FOKUS = 900;
    const _ISY_TEPI = 1.15;
    const _ISY_WARNA = {
        kulit: "#f9dac6",
        garisKulit: "#9a6251",
        lengan: "#1a2442",
        garisLengan: "#28355e",
        manset: "#2f3f6c",
    };

    const _ISY_JARI = [
        { n: "telunjuk", b: [0.36, -1.02], r: [0.44, 0.27, 0.22], w: 0.215, a: 1, s: -14, z: 0.13 },
        { n: "tengah", b: [0.12, -1.08], r: [0.48, 0.3, 0.23], w: 0.22, a: 0.3, s: 12, z: 0 },
        { n: "manis", b: [-0.12, -1.04], r: [0.44, 0.28, 0.22], w: 0.21, a: -0.4, s: 0, z: 0 },
        { n: "kelingking", b: [-0.35, -0.94], r: [0.34, 0.21, 0.19], w: 0.185, a: -1.1, s: 0, z: 0 },
    ];
    const _ISY_JEMPOL = { b: [0.34, -0.22, 0.04], r: [0.42, 0.32, 0.26], w: 0.25 };
    const _ISY_TELAPAK = [
        [-0.26, -0.02],
        [-0.38, -0.42],
        [-0.38, -0.86],
        [-0.24, -0.96],
        [0, -1],
        [0.24, -0.97],
        [0.38, -0.9],
        [0.4, -0.52],
        [0.36, -0.2],
        [0.26, -0.02],
    ];
    const _ISY_TEBAL_TELAPAK = 0.2;

    const _ISY_N_TANGAN = 21;
    const _ISY_N_POSE = 50;
    const _ISY_SUDUT_PUTAR = [3, 5, 24, 26];
    const _ISY_BENTUK_SANTAI = {
        jempol: [28, 22, 12, 12],
        telunjuk: [18, 24],
        tengah: [22, 28],
        manis: [26, 30],
        kelingking: [30, 32],
        renggang: 3,
        silang: 0,
    };
    const _ISY_TANGAN_ISTIRAHAT = { pos: [27, 168, 44], arah: [180, 12, 150], siku: 0, bentuk: "santai" };
    const _ISY_WAJAH_NETRAL = { alis: 0, mata: 1, mulut: "netral", kepala: [0, 0, 0] };
    const _ISY_MULUT = {
        netral: [0, 0.5, 1],
        senyum: [0, 0.95, 1.08],
        datar: [0, 0, 1],
        sedih: [0, -0.6, 0.95],
        a: [0.6, 0.25, 0.95],
        i: [0.22, 0.6, 1.12],
        u: [0.22, 0.1, 0.6],
        e: [0.36, 0.35, 1.05],
        o: [0.45, 0.1, 0.7],
        m: [0, 0.2, 0.92],
        f: [0.1, 0.15, 0.9],
        konsonan: [0.16, 0.3, 0.96],
    };
    const _ISY_MULUT_EJA = { a: "a", i: "i", u: "u", e: "e", o: "o", b: "m", m: "m", p: "m", f: "f", v: "f", w: "u" };

    const _isyTambah = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const _isyKurang = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const _isySkala = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
    const _isyTitik = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const _isySilangVektor = (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
    const _isyB1 = (n) => Math.round(n * 10) / 10;
    const _isyT2 = (p) => _isyB1(p[0]) + " " + _isyB1(p[1]);
    const _isyJepit = (n, a, b) => Math.min(b, Math.max(a, n));
    const _isyHalus = (t) => t * t * t * (t * (6 * t - 15) + 10);

    function _isySatuan(a, cadangan) {
        const p = Math.hypot(a[0], a[1], a[2]);
        return p > 1e-6 ? _isySkala(a, 1 / p) : cadangan;
    }

    function _isyEl(nama, atribut, induk) {
        const e = document.createElementNS(_ISY_NS, nama);
        if (atribut) {
            for (const k of Object.keys(atribut)) e.setAttribute(k, atribut[k]);
        }
        if (induk) induk.appendChild(e);
        return e;
    }

    function _isyUraiBentuk(bentuk, pustaka) {
        if (typeof bentuk === "string") return pustaka?.[bentuk] || _ISY_BENTUK_SANTAI;
        return { ..._ISY_BENTUK_SANTAI, ...bentuk };
    }

    function _isyIsiTangan(v, o, tangan, pustaka, geser) {
        const d = tangan || _ISY_TANGAN_ISTIRAHAT;
        const b = _isyUraiBentuk(d.bentuk, pustaka);
        const pos = d.pos || _ISY_TANGAN_ISTIRAHAT.pos;
        const arah = d.arah || [0, 0, 0];
        v[o] = pos[0] + geser;
        v[o + 1] = pos[1];
        v[o + 2] = pos[2];
        for (let i = 0; i < 3; i++) v[o + 3 + i] = arah[i] || 0;
        v[o + 6] = d.siku || 0;
        _ISY_JARI.forEach(function (j, i) {
            const f = b[j.n] || [0, 0];
            v[o + 7 + i * 2] = f[0] || 0;
            v[o + 8 + i * 2] = f[1] || 0;
        });
        const jempol = b.jempol || _ISY_BENTUK_SANTAI.jempol;
        for (let i = 0; i < 4; i++) v[o + 15 + i] = jempol[i] || 0;
        v[o + 19] = b.renggang || 0;
        v[o + 20] = b.silang || 0;
    }

    function _isyPoseDari(kunci, pustaka, geser) {
        const v = new Array(_ISY_N_POSE).fill(0);
        const k = kunci || {};
        _isyIsiTangan(v, 0, k.kanan, pustaka, geser || 0);
        _isyIsiTangan(v, _ISY_N_TANGAN, k.kiri, pustaka, k.kiri ? -(geser || 0) : 0);
        const w = { ..._ISY_WAJAH_NETRAL, ...k.wajah };
        const m = Array.isArray(w.mulut) ? w.mulut : _ISY_MULUT[w.mulut] || _ISY_MULUT.netral;
        const kepala = w.kepala || [0, 0, 0];
        v[42] = Number(w.alis) || 0;
        v[43] = w.mata === undefined ? 1 : Number(w.mata);
        for (let i = 0; i < 3; i++) {
            v[44 + i] = m[i] || 0;
            v[47 + i] = kepala[i] || 0;
        }
        return v;
    }

    function _isyCampurPose(a, b, t, keluar) {
        for (let i = 0; i < _ISY_N_POSE; i++) keluar[i] = a[i] + (b[i] - a[i]) * t;
        for (const i of _ISY_SUDUT_PUTAR) keluar[i] = a[i] + (((((b[i] - a[i]) % 360) + 540) % 360) - 180) * t;
        return keluar;
    }


    function _isyMatriksTangan(hadap, condong, miring) {
        const h = hadap * _ISY_RAD;
        const c = -condong * _ISY_RAD;
        const m = miring * _ISY_RAD;
        const a = [Math.cos(h), 0, Math.sin(h)];
        const b = [Math.sin(c) * Math.sin(h), Math.cos(c), -Math.sin(c) * Math.cos(h)];
        const d = [-Math.cos(c) * Math.sin(h), Math.sin(c), Math.cos(c) * Math.cos(h)];
        const cm = Math.cos(m);
        const sm = Math.sin(m);
        return [
            [cm * a[0] - sm * b[0], cm * a[1] - sm * b[1], cm * a[2] - sm * b[2]],
            [sm * a[0] + cm * b[0], sm * a[1] + cm * b[1], sm * a[2] + cm * b[2]],
            d,
        ];
    }

    function _isyTitikJari(def, pangkal, tengah, abduksi, geserZ) {
        const a = abduksi * _ISY_RAD;
        const u = [Math.sin(a), -Math.cos(a)];
        const s1 = pangkal * _ISY_RAD;
        const s2 = s1 + tengah * _ISY_RAD;
        const s3 = s2 + Math.min(80, tengah * 0.7) * _ISY_RAD;
        const arah = (s) => [u[0] * Math.cos(s), u[1] * Math.cos(s), Math.sin(s)];
        const p0 = [def.b[0], def.b[1], geserZ];
        const p1 = _isyTambah(p0, _isySkala(arah(s1), def.r[0]));
        const p2 = _isyTambah(p1, _isySkala(arah(s2), def.r[1]));
        const p3 = _isyTambah(p2, _isySkala(arah(s3), def.r[2]));
        return [[p0[0] - u[0] * 0.16, p0[1] - u[1] * 0.16, geserZ], p0, p1, p2, p3];
    }

    function _isyTitikJempol(buka, maju, tekuk1, tekuk2) {
        const b = buka * _ISY_RAD;
        const m = maju * _ISY_RAD;
        const u = [Math.sin(b) * Math.cos(m), -Math.cos(b) * Math.cos(m), Math.sin(m)];
        const sasaran = [-1, -0.45, 0.3];
        const c = _isySatuan(_isyKurang(sasaran, _isySkala(u, _isyTitik(sasaran, u))), [0, 0, 1]);
        const arah = (s) => _isyTambah(_isySkala(u, Math.cos(s)), _isySkala(c, Math.sin(s)));
        const s1 = tekuk1 * _ISY_RAD;
        const p1 = _isyTambah(_ISY_JEMPOL.b, _isySkala(u, _ISY_JEMPOL.r[0]));
        const p2 = _isyTambah(p1, _isySkala(arah(s1), _ISY_JEMPOL.r[1]));
        const p3 = _isyTambah(p2, _isySkala(arah(s1 + tekuk2 * _ISY_RAD), _ISY_JEMPOL.r[2]));
        return [_ISY_JEMPOL.b, p1, p2, p3];
    }

    function _isyRantaiLengan(bahu, sasaran, putar) {
        const arah = _isyKurang(sasaran, bahu);
        const sumbu = _isySatuan(arah, [0, 1, 0]);
        const d = _isyJepit(
            Math.hypot(arah[0], arah[1], arah[2]),
            Math.abs(_ISY_L_ATAS - _ISY_L_BAWAH) + 1,
            _ISY_L_ATAS + _ISY_L_BAWAH - 0.5
        );
        const a = (_ISY_L_ATAS * _ISY_L_ATAS - _ISY_L_BAWAH * _ISY_L_BAWAH + d * d) / (2 * d);
        const tinggi = Math.sqrt(Math.max(0, _ISY_L_ATAS * _ISY_L_ATAS - a * a));
        const kutub = [-0.6, 1, -0.3];
        let tegak = _isySatuan(_isyKurang(kutub, _isySkala(sumbu, _isyTitik(kutub, sumbu))), [-1, 0, 0]);
        if (putar) {
            const s = putar * _ISY_RAD;
            tegak = _isyTambah(_isySkala(tegak, Math.cos(s)), _isySkala(_isySilangVektor(sumbu, tegak), Math.sin(s)));
        }
        return {
            siku: _isyTambah(_isyTambah(bahu, _isySkala(sumbu, a)), _isySkala(tegak, tinggi)),
            pergelangan: _isyTambah(bahu, _isySkala(sumbu, d)),
        };
    }

    const _isyRataZ = (daftar, mulai) => {
        let jumlah = 0;
        for (let i = mulai; i < daftar.length; i++) jumlah += daftar[i][2];
        return jumlah / (daftar.length - mulai);
    };

    function _isyHitungSisi(v, o, cermin, naik) {
        const bahu = [_ISY_BAHU[0], _ISY_BAHU[1] + naik, 0];
        const sasaran = [_ISY_TENGAH_X - v[o], _ISY_ASAL_Y + v[o + 1] + naik, v[o + 2]];
        const rantai = _isyRantaiLengan(bahu, sasaran, v[o + 6]);
        const R = _isyMatriksTangan(v[o + 3], v[o + 4], v[o + 5]);
        const W = rantai.pergelangan;
        const keDunia = function (p) {
            const x = p[0] * _ISY_U;
            const y = p[1] * _ISY_U;
            const z = (p[2] || 0) * _ISY_U;
            return [
                W[0] + R[0][0] * x + R[0][1] * y + R[0][2] * z,
                W[1] + R[1][0] * x + R[1][1] * y + R[1][2] * z,
                W[2] + R[2][0] * x + R[2][1] * y + R[2][2] * z,
            ];
        };
        const layar = function (p) {
            const k = _ISY_FOKUS / (_ISY_FOKUS - p[2]);
            const x = _ISY_TENGAH_X + (p[0] - _ISY_TENGAH_X) * k;
            return [cermin ? 2 * _ISY_TENGAH_X - x : x, _ISY_PUSAT_Y + (p[1] - _ISY_PUSAT_Y) * k, k];
        };
        const jari = _ISY_JARI.map(function (def, i) {
            const abduksi = v[o + 19] * def.a + def.s * v[o + 20];
            const dunia = _isyTitikJari(def, v[o + 7 + i * 2], v[o + 8 + i * 2], abduksi, def.z * v[o + 20]).map(
                keDunia
            );
            return { p: dunia.map(layar), z: _isyRataZ(dunia, 2) };
        });
        const jempolDunia = _isyTitikJempol(v[o + 15], v[o + 16], v[o + 17], v[o + 18]).map(keDunia);
        const telapakDunia = _ISY_TELAPAK.map(keDunia);
        const selaput = [keDunia([0.3, -0.1, 0]), jempolDunia[1], keDunia([0.38, -0.8, 0])];
        return {
            bahu: layar(bahu),
            siku: layar(rantai.siku),
            pergelangan: layar(W),
            jari: jari,
            jempol: { p: jempolDunia.map(layar), z: _isyRataZ(jempolDunia, 1) },
            telapak: { p: telapakDunia.map(layar), z: _isyRataZ(telapakDunia, 0) - 0.6 },
            selaput: selaput.map(layar),
            z: W[2],
        };
    }


    function _isyBuatSisi(induk) {
        const gl = _isyEl("g", null, induk);
        const gt = _isyEl("g", null, induk);
        const garisKulit = { fill: "none", stroke: _ISY_WARNA.garisKulit, "stroke-linejoin": "round" };
        const isiKulit = {
            fill: "none",
            stroke: _ISY_WARNA.kulit,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
        };
        const padat = (warna) => ({ fill: warna, stroke: warna, "stroke-linejoin": "round" });
        const lengan = (warna, ujung) => ({ fill: "none", stroke: warna, "stroke-linecap": ujung });
        const s = { gl: gl, gt: gt, urut: "" };
        s.atasGaris = _isyEl("path", lengan(_ISY_WARNA.garisLengan, "round"), gl);
        s.bawahGaris = _isyEl("path", lengan(_ISY_WARNA.garisLengan, "butt"), gl);
        s.atasIsi = _isyEl("path", lengan(_ISY_WARNA.lengan, "round"), gl);
        s.pgGaris = _isyEl("path", { "stroke-linecap": "round", ...garisKulit }, gl);
        s.pgIsi = _isyEl("path", isiKulit, gl);
        s.bawahIsi = _isyEl("path", lengan(_ISY_WARNA.lengan, "butt"), gl);
        s.manset = _isyEl("path", lengan(_ISY_WARNA.manset, "butt"), gl);
        const gp = _isyEl("g", null, gt);
        s.telapak = {
            g: gp,
            z: 0,
            garis: _isyEl("path", padat(_ISY_WARNA.garisKulit), gp),
            selaputGaris: _isyEl("path", padat(_ISY_WARNA.garisKulit), gp),
            isi: _isyEl("path", padat(_ISY_WARNA.kulit), gp),
            selaputIsi: _isyEl("path", padat(_ISY_WARNA.kulit), gp),
        };
        const buatJari = function () {
            const g = _isyEl("g", null, gt);
            return {
                g: g,
                z: 0,
                garis: _isyEl("path", { "stroke-linecap": "butt", ...garisKulit }, g),
                ujung: _isyEl("circle", { fill: _ISY_WARNA.garisKulit }, g),
                isi: _isyEl("path", isiKulit, g),
            };
        };
        s.jari = _ISY_JARI.map(buatJari);
        s.jempol = buatJari();
        return s;
    }

    function _isyGaris(e, d, lebar) {
        e.setAttribute("d", d);
        e.setAttribute("stroke-width", _isyB1(lebar));
    }

    function _isyGambarJari(bagian, p, tebal) {
        const ujung = p[p.length - 1];
        const lebar = tebal * _ISY_U * ujung[2];
        const d = "M" + p.map(_isyT2).join("L");
        _isyGaris(bagian.garis, d, lebar + _ISY_TEPI * 2);
        _isyGaris(bagian.isi, d, lebar);
        bagian.ujung.setAttribute("cx", _isyB1(ujung[0]));
        bagian.ujung.setAttribute("cy", _isyB1(ujung[1]));
        bagian.ujung.setAttribute("r", _isyB1(lebar / 2 + _ISY_TEPI));
    }

    function _isyGambarSisi(s, d) {
        const B = d.bahu;
        const E = d.siku;
        const W = d.pergelangan;
        const antara = (t) => [E[0] + (W[0] - E[0]) * t, E[1] + (W[1] - E[1]) * t];
        const kLengan = (B[2] + E[2]) / 2;
        const kBawah = (E[2] + W[2]) / 2;
        const lenganBawah = "M" + _isyT2(E) + "L" + _isyT2(antara(0.86));
        const lenganAtas = "M" + _isyT2(B) + "L" + _isyT2(E);
        const kulit = "M" + _isyT2(antara(0.7)) + "L" + _isyT2(W);
        _isyGaris(s.pgGaris, kulit, 0.5 * _ISY_U * W[2] + _ISY_TEPI * 2);
        _isyGaris(s.pgIsi, kulit, 0.5 * _ISY_U * W[2]);
        _isyGaris(s.bawahGaris, lenganBawah, 21.5 * kBawah + 2.2);
        _isyGaris(s.atasGaris, lenganAtas, 25.5 * kLengan + 2.2);
        _isyGaris(s.bawahIsi, lenganBawah, 21.5 * kBawah);
        _isyGaris(s.atasIsi, lenganAtas, 25.5 * kLengan);
        _isyGaris(s.manset, "M" + _isyT2(antara(0.79)) + "L" + _isyT2(antara(0.86)), 21.5 * kBawah + 2.2);

        const tebal = _ISY_TEBAL_TELAPAK * _ISY_U * W[2];
        const telapak = "M" + d.telapak.p.map(_isyT2).join("L") + "Z";
        const selaput = "M" + d.selaput.map(_isyT2).join("L") + "Z";
        _isyGaris(s.telapak.garis, telapak, tebal + _ISY_TEPI * 2);
        _isyGaris(s.telapak.selaputGaris, selaput, tebal * 0.7 + _ISY_TEPI * 2);
        _isyGaris(s.telapak.isi, telapak, tebal);
        _isyGaris(s.telapak.selaputIsi, selaput, tebal * 0.7);
        s.telapak.z = d.telapak.z;
        d.jari.forEach(function (j, i) {
            _isyGambarJari(s.jari[i], j.p, _ISY_JARI[i].w);
            s.jari[i].z = j.z;
        });
        _isyGambarJari(s.jempol, d.jempol.p, _ISY_JEMPOL.w);
        s.jempol.z = d.jempol.z;

        const bagian = [s.telapak].concat(s.jari, [s.jempol]);
        const urutan = Array.from(bagian.keys()).sort((a, b) => bagian[a].z - bagian[b].z);
        const kunci = urutan.join("");
        if (kunci !== s.urut) {
            s.urut = kunci;
            for (const i of urutan) s.gt.appendChild(bagian[i].g);
        }
    }


    const _ISY_JALUR = {
        wajah: "M150.4 110C150.2 118 151.2 126 153.4 134 156.8 147 162.6 158.6 170.4 168.6 178.4 179 189 190.6 200 190.6 211 190.6 221.6 179 229.6 168.6 237.4 158.6 243.2 147 246.6 134 248.8 126 249.8 118 249.6 110 249.6 82 232 60 200 60 168 60 150.4 82 150.4 110Z",
        poni: "M141 128C132 76 162 34 200 34 238 34 268 76 259 128 258 136 255 143 250 150C251 136 250.4 120 248 104Q246.6 106.4 244 107.5Q240.4 104.6 237 98.5Q235.6 104.4 232.5 107Q228.6 103.6 225 97Q223.6 103 220.5 106Q216.6 102.6 213 95.5Q211.8 102.6 209 106.5Q206.6 104 205 99Q204.4 108.6 201 115.5Q198.6 108 197 99.2Q194.6 104 191 106.2Q188.6 102.6 187 96.4Q183.4 103 179.5 107.4Q176.4 104 175 98Q171.4 104.4 167.5 106.6Q164.4 104.6 163 99.2Q159.6 105 156 108Q153.4 106.6 152 104C150.8 120 150.4 136 150 150C145 143 142 136 141 128Z",
        rambutBelakang:
            "M200 36C162 36 141 76 141 128 139 184 128 250 116 316 126 330 144 334 158 325 163 317 166 309 168 300L232 300C234 309 237 317 242 325 256 334 274 330 284 316 272 250 261 184 259 128 259 76 238 36 200 36Z",
        ikalSisi:
            "M143 114C137 150 137 198 141 246 144.6 250.8 151.8 251 155.8 246.8 158 214 160 176 154.8 136 152.2 128 148 120 143 114Z",
        badan: "M185 205C178 216 156 224 138 229 126 232 118 240 118 254L123 300C128 328 140 356 142 388 143 416 138 444 134 470L266 470C262 444 257 416 258 388 260 356 272 328 277 300L282 254C282 240 274 232 262 229 244 224 222 216 215 205Z",
        kelopakBawah: "M159.8 127.2C161.6 135.6 168.6 140.4 177 140.2 184.6 140 189.8 135.6 190.8 129",
    };
    const _ISY_GARIS_RAMBUT = "#0e0c12";
    const _ISY_KILAP_RAMBUT = "#8a90b6";
    const _ISY_SKALA_KEPALA = 1.06;
    const _ISY_SUDUT_MATA = 128.1;

    function _isyJalurKelopak(s) {
        const y = (n, naik) => _isyB1(_ISY_SUDUT_MATA + s * (n - _ISY_SUDUT_MATA) - (naik || 0));
        const lengkung = `M159.8 127.2C161.8 ${y(118.4)} 168.4 ${y(113.4)} 176.4 ${y(113.4)} 184.4 ${y(113.4)} 189.4 ${y(119.6)} 190.8 129`;
        const sayap = _isyB1(126.2 - 3 * Math.max(0, s));
        return {
            lengkung: lengkung,
            bulu:
                `M190.8 129L191.5 128C189.6 ${y(119.6, 1.6)} 184.6 ${y(113.4, 2.6)} 176.4 ${y(113.4, 3.2)} 168.2 ${y(113.4, 3.6)} 161 ${y(118.4, 4.2)} 155.2 ${sayap}L` +
                lengkung.slice(1) +
                "Z",
        };
    }

    function _isyGambarMata(id, sisi) {
        const cermin = (isi) => (sisi === "R" ? '<g transform="translate(400 0) scale(-1 1)">' + isi + "</g>" : isi);
        const kilau = sisi === "R" ? 179.8 : 171.8;
        const dekat = sisi === "R" ? 1.4 : -1.4;
        return cermin(
            '<g transform="translate(-1.6 0)">' +
                `<g clip-path="url(#${id}m)"><g clip-path="url(#${id}n)">` +
                '<rect x="152" y="96" width="46" height="50" fill="#fffaf7"/>' +
                '<ellipse cx="189.6" cy="129.4" rx="2" ry="1.3" fill="#eeb1a8"/>' +
                `<path data-dsb="bayang${sisi}" fill="none" stroke="#a593ad" stroke-width="7.5" opacity=".42"/>` +
                `<g data-dsb="iris${sisi}">` +
                `<ellipse cx="175.8" cy="127.6" rx="9.6" ry="12.2" fill="url(#${id}i)" stroke="#140c09" stroke-width="1.3"/>` +
                '<ellipse cx="175.8" cy="128.4" rx="6.4" ry="8.4" fill="none" stroke="#b9803f" stroke-width=".8" opacity=".45"/>' +
                '<ellipse cx="175.8" cy="135.6" rx="6" ry="3.4" fill="#f3cc8c" opacity=".55"/>' +
                '<ellipse cx="175.8" cy="126.4" rx="3.9" ry="5.3" fill="#0f0806"/>' +
                `<ellipse cx="${kilau}" cy="120.4" rx="3.3" ry="4" fill="#fff"/>` +
                `<circle cx="${_isyB1(351.6 - kilau)}" cy="134.6" r="1.7" fill="#fff" opacity=".9"/>` +
                `<circle cx="${_isyB1(kilau + dekat)}" cy="131.2" r=".8" fill="#fff" opacity=".6"/>` +
                "</g></g></g>" +
                `<path data-dsb="bulu${sisi}" fill="#15111a"/>` +
                `<path data-dsb="helai${sisi}" d="M158.4 119.6C156.6 118.2 154.8 117.6 153 117.8 155.2 116.4 158 116.2 160.2 117.2ZM156.6 123.8C154.8 123 153.2 122.8 151.8 123.2 153.6 121.8 155.8 121.6 157.6 122.2Z" fill="#15111a"/>` +
                `<path data-dsb="lipat${sisi}" d="M160 117.2C165.4 109.4 178 106.4 189.4 111.6" fill="none" stroke="#c08a78" stroke-width=".9" stroke-linecap="round" opacity=".5"/>` +
                '<path d="M161 133C164.6 138.4 170.6 141.2 177 141.3" fill="none" stroke="#5e3830" stroke-width="1" stroke-linecap="round" opacity=".55"/>' +
                '<path d="M184 139.6C187 138 189.2 135.6 190.2 132.6" fill="none" stroke="#5e3830" stroke-width=".8" stroke-linecap="round" opacity=".22"/>' +
                "</g>"
        );
    }

    function _isyLukisan(id) {
        const cermin = (isi) => '<g transform="translate(400 0) scale(-1 1)">' + isi + "</g>";
        const besarkan = (isi) =>
            `<g transform="translate(200 190) scale(${_ISY_SKALA_KEPALA}) translate(-200 -190)">` + isi + "</g>";
        const helai = (d, tebal, pudar, warna) =>
            `<path d="${d}" fill="none" stroke="${warna || _ISY_GARIS_RAMBUT}" stroke-width="${tebal}" stroke-linecap="round" opacity="${pudar}"/>`;
        const henti = (posisi, warna, pudar) =>
            `<stop offset="${posisi}" stop-color="${warna}"` +
            (pudar === undefined ? "" : ` stop-opacity="${pudar}"`) +
            "/>";
        const noda = (jenis, cx, cy, rx, ry, pudar) =>
            `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}${jenis})" opacity="${pudar}"/>`;
        const ikal =
            `<path d="${_ISY_JALUR.ikalSisi}" fill="url(#${id}r)" stroke="${_ISY_GARIS_RAMBUT}" stroke-width=".9"/>` +
            `<path d="M148.4 148C147.2 176 147.4 206 149 232 150.6 206 150.8 176 150.4 148Z" fill="${_ISY_KILAP_RAMBUT}" opacity=".34"/>` +
            helai("M146.4 134C143.6 170 143.6 210 146 244", 1, 0.5) +
            helai("M153.4 142C153.6 176 154 210 152.8 242", 0.8, 0.4);
        const lipatBahu =
            '<path d="M138 229C126 232 118 240 118 254" fill="none" stroke="#3a4b7c" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
            '<path d="M153 302C163 317 188 318 198 306" fill="none" stroke="#0c1224" stroke-width="2" stroke-linecap="round" opacity=".3"/>';
        const hidung =
            '<path d="M201.2 148.2 203.4 152.8 200.4 152.4Z" fill="#e3a58c" opacity=".9"/>' +
            '<path d="M199 153.4C199.8 153.9 200.8 153.9 201.6 153.5" fill="none" stroke="#b9796a" stroke-width=".85" stroke-linecap="round" opacity=".8"/>';
        const mulut =
            '<path d="M197.6 170.2C199.2 170.9 200.8 170.9 202.4 170.2" fill="none" stroke="#e3a58c" stroke-width="1" stroke-linecap="round" opacity=".5"/>' +
            '<path data-dsb="mulutDalam" fill="#5a1f2a"/><path data-dsb="gigi" fill="#fbf4ef"/><path data-dsb="lidah" fill="#d0626a"/>' +
            `<path data-dsb="bibirAtas" fill="#dc8f90"/><path data-dsb="bibirBawah" fill="url(#${id}l)"/>` +
            '<path data-dsb="mulutGaris" fill="none" stroke="#a9525b" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path data-dsb="kilauBibir" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".45"/>';
        const pipi =
            noda("u", 167, 147.6, 10.5, 5.6, 1) +
            '<path d="M163.2 149.6 165.2 146M167.4 150 169.4 146.4M171.6 149.6 173.6 146" fill="none" stroke="#e9807d" stroke-width=".8" stroke-linecap="round" opacity=".4"/>';
        return (
            "<defs>" +
            `<linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">${henti(0, "#4a6cab")}${henti(1, "#20355f")}</linearGradient>` +
            `<radialGradient id="${id}s" cx=".5" cy=".32" r=".62">${henti(0, "#fff", 0.24)}${henti(1, "#fff", 0)}</radialGradient>` +
            `<linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1">${henti(0, "#2b2733")}${henti(1, "#131118")}</linearGradient>` +
            `<linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1">${henti(0, "#150d0a")}${henti(0.38, "#3d2314")}${henti(0.72, "#7a4d24")}${henti(1, "#c08a48")}</linearGradient>` +
            `<linearGradient id="${id}j" x1="0" y1="0" x2="0" y2="1">${henti(0, "#1d2746")}${henti(1, "#121930")}</linearGradient>` +
            `<linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1">${henti(0, "#e79c98")}${henti(1, "#f2b8ae")}</linearGradient>` +
            `<radialGradient id="${id}k" cx=".5" cy=".44" r=".62">${henti(0.72, "#e2a188", 0)}${henti(1, "#e2a188", 0.32)}</radialGradient>` +
            `<radialGradient id="${id}u">${henti(0, "#f58f8d", 0.36)}${henti(1, "#f58f8d", 0)}</radialGradient>` +
            `<clipPath id="${id}m"><path d="${_ISY_JALUR.kelopakBawah}L197 96H153Z"/></clipPath>` +
            `<clipPath id="${id}n"><path data-dsb="klipKelopak"/></clipPath>` +
            `<clipPath id="${id}w"><path d="${_ISY_JALUR.wajah}"/></clipPath>` +
            "</defs>" +
            `<rect width="400" height="470" fill="url(#${id}b)"/><rect width="400" height="470" fill="url(#${id}s)"/>` +
            '<g data-dsb="rambutBelakang">' +
            besarkan(
                `<path d="${_ISY_JALUR.rambutBelakang}" fill="#17151c" stroke="${_ISY_GARIS_RAMBUT}" stroke-width=".9"/>` +
                    helai(
                        "M146 150C144 210 138 262 128 318M254 150C256 210 262 262 272 318M164 170C164 220 162 262 157 304M236 170C236 220 238 262 243 304",
                        1.1,
                        0.55
                    ) +
                    helai(
                        "M152 160C150 216 146 268 138 318M248 160C250 216 254 268 262 318",
                        0.9,
                        0.2,
                        _ISY_KILAP_RAMBUT
                    )
            ) +
            "</g>" +
            `<g data-dsb="leher"><path d="M187.5 164 187 204C195 210 205 210 213 204L212.5 164Z" fill="${_ISY_WARNA.kulit}"/>` +
            '<path d="M187.4 170C195 186 205 186 212.6 170L212.8 183C205 198 195 198 187.2 183Z" fill="#e3a58c" opacity=".85"/></g>' +
            `<g data-dsb="badan"><path d="${_ISY_JALUR.badan}" fill="url(#${id}j)" stroke="#0b1020" stroke-width="1.1"/>` +
            lipatBahu +
            cermin(lipatBahu) +
            '<path d="M183 198C192 205 208 205 217 198L219.5 213C210 222 190 222 180.5 213Z" fill="#26335a" stroke="#0b1020" stroke-width=".9"/></g>' +
            '<g data-dsb="kepala">' +
            besarkan(
                '<g data-dsb="muka">' +
                    `<path d="${_ISY_JALUR.wajah}" fill="${_ISY_WARNA.kulit}"/><path d="${_ISY_JALUR.wajah}" fill="url(#${id}k)"/>` +
                    `<path d="${_ISY_JALUR.poni}" transform="translate(0 6)" fill="#e9a98f" opacity=".55" clip-path="url(#${id}w)"/>` +
                    `<path d="${_ISY_JALUR.wajah}" fill="none" stroke="#9a6251" stroke-width="1"/>` +
                    "</g>" +
                    '<g data-dsb="raut">' +
                    pipi +
                    cermin(pipi) +
                    _isyGambarMata(id, "L") +
                    _isyGambarMata(id, "R") +
                    `<g data-dsb="hidung">${hidung}</g>` +
                    mulut +
                    "</g>" +
                    `<g data-dsb="ikalL">${ikal}</g><g data-dsb="ikalR">${cermin(ikal)}</g>` +
                    `<g data-dsb="poni"><path d="${_ISY_JALUR.poni}" fill="url(#${id}r)" stroke="${_ISY_GARIS_RAMBUT}" stroke-width=".9" stroke-linejoin="round"/>` +
                    `<path d="M157 80C168 66 184 59.4 203 58.6 222 58.6 237 64.6 247 77.6L243.6 79.4 240.6 73.4 236.6 78.6 231.4 70.6 226.6 76.4 220.6 68.2 214.6 74.6 208 66.8 201.6 73.6 195 66.8 188.6 74.2 182.4 68 176.4 75.4 171 70.6 166 77.6 162.4 74.6Z" fill="${_ISY_KILAP_RAMBUT}" opacity=".5"/>` +
                    helai(
                        "M237 98.5C238.6 86 239 73 237.4 60M225 97C226.4 84 226.6 70 225 56M213 95.5C214 82 214 68 212.6 54M187 96.4C185.6 82 185.6 68 187.4 54M175 98C173 85 173 72 175.6 59M163 99.2C160.4 87 160.6 75 163.6 64M201 104C201.4 88 201.4 70 201 54",
                        0.9,
                        0.55
                    ) +
                    helai(
                        "M231 100C232 88 232.4 76 231.4 64M219 99C220 87 220.2 75 219.4 63M207 101C207.4 89 207.6 77 207.2 65M194 101C193.6 89 193.6 77 194.4 65M181 100C179.6 88 179.6 76 181.2 65M169 100.6C167 89 167 78 169 68M243 101C244.6 90 245 79 243.8 69M157.4 102C155.2 91.6 155.4 80.6 158 70.6",
                        0.8,
                        0.22,
                        _ISY_KILAP_RAMBUT
                    ) +
                    "</g>" +
                    '<g data-dsb="alis">' +
                    '<path data-dsb="alisL" d="M188.4 102.4C181.2 99.2 171 99.4 160.2 104.6 170.8 101.6 180.2 101.8 188.2 104.2Z" fill="#4d4959" opacity=".92"/>' +
                    '<path data-dsb="alisR" d="M211.6 102.4C218.8 99.2 229 99.4 239.8 104.6 229.2 101.6 219.8 101.8 211.8 104.2Z" fill="#4d4959" opacity=".92"/>' +
                    "</g>"
            ) +
            "</g>" +
            '<g data-dsb="lengan"></g>'
        );
    }

    function _isyJalurMulut(buka, senyum, lebar) {
        const w = 7.6 * lebar;
        const ys = 163 - 2.3 * senyum;
        const atas = 163 + 2.1 * senyum * (1 - buka * 0.5) - buka * 1.1;
        const bawah = atas + buka * 13;
        const tAtas = (ys + atas) / 2;
        const tBawah = (ys + bawah) / 2;
        const kiri = _isyB1(200 - w) + " " + _isyB1(ys);
        const kanan = _isyB1(200 + w) + " " + _isyB1(ys);
        const tepi = (y) => `Q200 ${_isyB1(y)} `;
        const gigi = Math.min(2.4, (tBawah - tAtas) * 0.55);
        const lidah = Math.max(0, tBawah - tAtas - 3.6) * 0.5;
        const p = 2.1 * Math.min(1, lebar);
        const puncak = _isyB1(tAtas - 1.9);
        const dasar = _isyB1((tBawah + 3.1 - 0.25 * ys) / 0.75);
        const kilau = _isyB1(tBawah + 1.3);
        return {
            mulutDalam: `M${kiri}${tepi(atas)}${kanan}${tepi(bawah)}${kiri}Z`,
            gigi: `M${kiri}${tepi(atas)}${kanan}${tepi(atas + gigi * 2)}${kiri}Z`,
            lidah: `M${kiri}${tepi(bawah)}${kanan}${tepi(bawah - lidah * 2)}${kiri}Z`,
            bibirAtas:
                `M${kiri}C${_isyB1(200 - w * 0.6)} ${_isyB1(ys - 1.2)} ${_isyB1(198.6 - p)} ${puncak} ${_isyB1(200 - p)} ${puncak}` +
                `Q${_isyB1(200 - p * 0.37)} ${puncak} 200 ${_isyB1(tAtas - 1.3)}Q${_isyB1(200 + p * 0.37)} ${puncak} ${_isyB1(200 + p)} ${puncak}` +
                `C${_isyB1(201.4 + p)} ${puncak} ${_isyB1(200 + w * 0.6)} ${_isyB1(ys - 1.2)} ${kanan}${tepi(atas)}${kiri}Z`,
            bibirBawah: `M${kiri}${tepi(bawah)}${kanan}C${_isyB1(200 + w * 0.62)} ${dasar} ${_isyB1(200 - w * 0.62)} ${dasar} ${kiri}Z`,
            mulutGaris: `M${kiri}${tepi(atas)}${kanan}`,
            kilauBibir: `M${_isyB1(200 - p)} ${kilau}Q200 ${_isyB1(tBawah + 2)} ${_isyB1(200 + p)} ${kilau}`,
        };
    }


    const _ISY_RANGKA = {
        kotak: [30, 2, 340, 468],
        tengahX: _ISY_TENGAH_X,
        asalY: _ISY_ASAL_Y,
        bahuY: _ISY_BAHU[1],
        panjangTangan:
            _ISY_U * (Math.abs(_ISY_JARI[1].b[1]) + _ISY_JARI[1].r[0] + _ISY_JARI[1].r[1] + _ISY_JARI[1].r[2]),
        panjangLengan: _ISY_L_ATAS + _ISY_L_BAWAH,
        nTangan: _ISY_N_TANGAN,
        u: _ISY_U,
        jari: _ISY_JARI.map((j) => ({ a: j.a, s: j.s })),
        jempol: { b: _ISY_JEMPOL.b, r: _ISY_JEMPOL.r },
    };

    function _isyBuatAvatar() {
        const id = "dsbi" + Math.random().toString(36).slice(2, 8);
        const wadah = document.createElement("div");
        wadah.className = "dsb_isyarat_avatar";
        wadah.innerHTML =
            '<svg xmlns="' +
            _ISY_NS +
            '" viewBox="30 2 340 468" role="img" aria-label="Avatar peraga bahasa isyarat" focusable="false">' +
            _isyLukisan(id) +
            "</svg>";
        const bagian = {};
        wadah.querySelectorAll("[data-dsb]").forEach(function (e) {
            bagian[e.dataset.dsb] = e;
        });
        const sisi = [_isyBuatSisi(bagian.lengan), _isyBuatSisi(bagian.lengan)];
        const tenang = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const v = _isyPoseDari(null, null, 0);
        const antrean = [];
        let gerak = null;
        let dijeda = false;
        let saatJeda = 0;
        let laju = 1;
        let hidup = false;
        let raf = 0;
        let urutSisi = "";
        let kedipMulai = -1;
        let kedipBerikut = 1500;
        let mulutLama = "";
        let kelopakLama = null;
        let lirikBerikut = 0;
        let lirikTuju = [0, 0];
        const lirik = [0, 0];
        let sikapBerikut = 0;
        let sikapTuju = [0, 0, 0];
        const sikap = [0, 0, 0];
        let ayun = 0;
        let ayunLaju = 0;
        let tolehLama = 0;
        let bingkaiLama = 0;
        let p3 = null;
        let tunjuk = null;
        let ikut = 0;
        let ikutLama = 0;
        let acuanTatap = [0, 0];

        function nilaiKedip(now) {
            if (now >= kedipBerikut) {
                kedipMulai = now;
                kedipBerikut = now + (Math.random() < 0.18 ? 340 : 2200 + Math.random() * 3600);
            }
            const p = now - kedipMulai;
            if (kedipMulai < 0 || p > 260) return 1;
            if (p < 80) return 1 - p / 80;
            return p < 130 ? 0 : (p - 130) / 130;
        }

        const dekati = (nilai, sasaran, laju, f) => nilai + (sasaran - nilai) * (1 - Math.pow(1 - laju, f));

        function bobotTatap(now, k) {
            const f = _isyJepit((now - ikutLama) / 16.7, 0.2, 3);
            ikutLama = now;
            const mau = k > 0 && !!tunjuk && tunjuk.ada && !gerak && !antrean.length && now - tunjuk.t < 2500;
            ikut = dekati(ikut, mau ? 1 : 0, mau ? 0.06 : 0.035, f);
            if (ikut < 0.002) ikut = 0;
            return ikut > 0 && tunjuk ? { x: tunjuk.x, y: tunjuk.y, w: ikut } : null;
        }

        function arahTatap(now, tatapan) {
            const arah = _isyArahTatapSvg(wadah.firstChild, tatapan.x, tatapan.y);
            if (!arah) return null;
            const [a, b] = arah;
            if (Math.abs(a - acuanTatap[0]) + Math.abs(b - acuanTatap[1]) > 0.5) {
                if (now - kedipMulai > 900) kedipBerikut = now;
                acuanTatap = [a, b];
            }
            acuanTatap = [dekati(acuanTatap[0], a, 0.05, 1), dekati(acuanTatap[1], b, 0.05, 1)];
            return {
                sikap: [0, _isyJepit(9 * a, -5.5, 5.5), _isyJepit(4 * b, -2.2, 2.8)],
                lirik: [_isyJepit(4.2 * a, -2.3, 2.3), _isyJepit(3 * b, -1.3, 1.5)],
            };
        }

        function gerakWajah(now, k, f, tatapan) {
            const t = now / 1000;
            const angkat = (o) => _isyJepit((120 - v[o + 1]) / 90, 0, 1);
            const condong = angkat(0) - angkat(_ISY_N_TANGAN);
            if (now >= sikapBerikut) {
                sikapBerikut = now + 2600 + Math.random() * 4200;
                sikapTuju = [Math.random() * 5 - 2.5, Math.random() * 7 - 3.5, Math.random() * 3.2 - 1.6];
            }
            if (now >= lirikBerikut) {
                lirikBerikut = now + 1400 + Math.random() * 3200;
                lirikTuju = Math.random() < 0.55 ? [0, 0] : [Math.random() * 3.4 - 1.7, Math.random() * 1.6 - 0.8];
            }
            const tujuSikap = sikapTuju.map((n) => n * k);
            const tujuLirik = [(lirikTuju[0] - 1.1 * condong) * k, lirikTuju[1] * k];
            const kursor = tatapan ? arahTatap(now, tatapan) : null;
            const w = kursor ? tatapan.w : 0;
            if (kursor) _isyCampurKe(tujuSikap, kursor.sikap, w);
            if (kursor) _isyCampurKe(tujuLirik, kursor.lirik, w);
            for (let i = 0; i < 3; i++) sikap[i] = dekati(sikap[i], tujuSikap[i], 0.03 + 0.05 * w, f);
            lirik[0] = dekati(lirik[0], tujuLirik[0], 0.16, f);
            lirik[1] = dekati(lirik[1], tujuLirik[1], 0.16, f);
            return {
                miring: sikap[0] + 0.5 * Math.sin(t * 0.9 + 1) * k - 2 * condong,
                toleh: sikap[1] + 0.8 * Math.sin(t * 0.63) * k - 3.4 * condong,
                angguk: sikap[2] + 0.9 * Math.sin(t * 0.71 + 0.4) * k,
                alis: 0.08 * Math.sin(t * 0.7 + 2) * k,
                senyum: 0.16 * Math.sin(t * 0.45 + 1.2) * k,
            };
        }

        function ayunRambut(miring, toleh, f) {
            const sasaran = -0.85 * miring - 2.1 * (toleh - tolehLama);
            tolehLama = toleh;
            for (let i = _isyJepit(Math.round(f), 1, 3); i > 0; i--) {
                ayunLaju += (sasaran - ayun) * 0.07 - ayunLaju * 0.17;
                ayun += ayunLaju;
            }
            return _isyB1(ayun);
        }

        function pasangKelopak(s) {
            const kelopak = _isyJalurKelopak(s);
            const balik = Math.abs(s) < 0.04 ? 0.04 : s;
            bagian.klipKelopak.setAttribute("d", kelopak.lengkung + "V154H159.8Z");
            for (const nama of ["L", "R"]) {
                bagian["bayang" + nama].setAttribute("d", kelopak.lengkung);
                bagian["bulu" + nama].setAttribute("d", kelopak.bulu);
                bagian["helai" + nama].setAttribute(
                    "transform",
                    `translate(0 ${_ISY_SUDUT_MATA}) scale(1 ${balik}) translate(0 -${_ISY_SUDUT_MATA})`
                );
                bagian["lipat" + nama].setAttribute("opacity", _isyB1(0.5 * _isyJepit(s, 0, 1)));
            }
        }

        function gambarWajah(now, napas, k, tatapan) {
            const f = _isyJepit((now - bingkaiLama) / 16.7, 0.2, 3);
            bingkaiLama = now;
            const g = gerakWajah(now, k, f, tatapan);
            const miring = v[47] + g.miring;
            const angguk = v[48] + g.angguk;
            const toleh = v[49] + g.toleh;
            const sudutAyun = ayunRambut(miring, toleh, f);
            const lapis = (kx, ky) => `translate(${_isyB1(toleh * kx)} ${_isyB1(angguk * ky)})`;
            const kepala = `translate(0 ${_isyB1(napas * 0.6 + angguk * 0.2)}) rotate(${_isyB1(miring)} 200 194)`;
            bagian.kepala.setAttribute("transform", kepala);
            bagian.rambutBelakang.setAttribute(
                "transform",
                `${kepala} translate(${_isyB1(-toleh * 0.22)} 0) rotate(${_isyB1(sudutAyun * 0.35)} 200 90)`
            );
            bagian.muka.setAttribute("transform", lapis(0.2, 0.12));
            bagian.raut.setAttribute("transform", lapis(0.62, 0.5));
            bagian.alis.setAttribute("transform", lapis(0.62, 0.5));
            bagian.hidung.setAttribute("transform", lapis(0.24, 0.1));
            bagian.poni.setAttribute("transform", lapis(0.32, 0.2));
            bagian.ikalL.setAttribute("transform", `rotate(${sudutAyun} 146 118)`);
            bagian.ikalR.setAttribute("transform", `rotate(${sudutAyun} 254 118)`);
            bagian.irisL.setAttribute("transform", `translate(${_isyB1(lirik[0])} ${_isyB1(lirik[1])})`);
            bagian.irisR.setAttribute("transform", `translate(${_isyB1(-lirik[0])} ${_isyB1(lirik[1])})`);

            const buka = _isyJepit(v[43], 0, 1.25) * nilaiKedip(now);
            const kelopak = Math.round((buka > 1 ? 1 + (buka - 1) * 0.5 : -0.85 + 1.85 * buka) * 50) / 50;
            if (kelopak !== kelopakLama) {
                kelopakLama = kelopak;
                pasangKelopak(kelopak);
            }
            const alis = v[42] + g.alis;
            const naik = Math.max(0, alis);
            const kerut = Math.max(0, -alis);
            const geserAlis = _isyB1(2.2 * kerut - 3.6 * naik);
            bagian.alisL.setAttribute("transform", `translate(0 ${geserAlis}) rotate(${_isyB1(8 * kerut)} 174 102.4)`);
            bagian.alisR.setAttribute("transform", `translate(0 ${geserAlis}) rotate(${_isyB1(-8 * kerut)} 226 102.4)`);

            const m = [_isyJepit(v[44], 0, 1), _isyJepit(v[45] + g.senyum, -1, 1), _isyJepit(v[46], 0.4, 1.3)].map(
                (n) => Math.round(n * 50) / 50
            );
            const kunciMulut = m.join(" ");
            if (kunciMulut === mulutLama) return;
            mulutLama = kunciMulut;
            const mulut = _isyJalurMulut(m[0], m[1], m[2]);
            for (const nama of Object.keys(mulut)) bagian[nama].setAttribute("d", mulut[nama]);
        }

        function gambar(now) {
            const t = now / 1000;
            const k = tenang || !hidup ? 0 : 1;
            const tatapan = bobotTatap(now, k);
            if (p3) {
                p3.gambar(v, now, k, tatapan);
                return;
            }
            const napas = Math.sin(t * 1.5) * 1.3 * k;
            bagian.badan.setAttribute("transform", `translate(0 ${_isyB1(napas)})`);
            bagian.leher.setAttribute("transform", `translate(0 ${_isyB1(napas * 0.7)})`);
            gambarWajah(now, napas, k, tatapan);
            const hasil = [_isyHitungSisi(v, 0, false, napas), _isyHitungSisi(v, _ISY_N_TANGAN, true, napas)];
            _isyGambarSisi(sisi[0], hasil[0]);
            _isyGambarSisi(sisi[1], hasil[1]);
            const urut = hasil[0].z <= hasil[1].z ? "01" : "10";
            if (urut !== urutSisi) {
                urutSisi = urut;
                for (const i of urut) {
                    bagian.lengan.appendChild(sisi[i].gl);
                    bagian.lengan.appendChild(sisi[i].gt);
                }
            }
        }

        function maju(now) {
            if (dijeda) return;
            for (let i = 0; i < 12; i++) {
                if (!gerak) {
                    const l = antrean.shift();
                    if (!l) return;
                    gerak = {
                        dari: v.slice(),
                        ke: l.ke || v.slice(),
                        t0: now,
                        durasi: Math.max(1, l.durasi / laju),
                        selesai: l.selesai,
                    };
                    if (l.mulai) l.mulai();
                }
                const p = Math.min(1, (now - gerak.t0) / gerak.durasi);
                _isyCampurPose(gerak.dari, gerak.ke, _isyHalus(p), v);
                if (p < 1) return;
                const usai = gerak.selesai;
                gerak = null;
                if (usai) usai();
            }
        }

        function bingkai(now) {
            raf = 0;
            maju(now);
            gambar(now);
            if (hidup || gerak || antrean.length) raf = window.requestAnimationFrame(bingkai);
        }

        function jalan() {
            if (!raf) raf = window.requestAnimationFrame(bingkai);
        }

        gambar(0);
        return {
            el: wadah,
            pose: () => v.slice(),
            pasang: function (pose) {
                antrean.length = 0;
                gerak = null;
                for (let i = 0; i < _ISY_N_POSE; i++) v[i] = pose[i];
                gambar(window.performance.now());
            },
            antre: function (langkah) {
                for (const l of langkah) antrean.push(l);
                jalan();
            },
            kosongkan: function () {
                antrean.length = 0;
                gerak = null;
                dijeda = false;
            },
            jeda: function (ya) {
                const now = window.performance.now();
                if (ya && !dijeda) saatJeda = now;
                if (!ya && dijeda && gerak) gerak.t0 += now - saatJeda;
                dijeda = !!ya;
                jalan();
            },
            kedip: function () {
                if (window.performance.now() - kedipMulai > 900) kedipBerikut = 0;
                if (p3) p3.kedip();
            },
            pakai3d: function (p) {
                p3 = p;
                wadah.classList.add("dsb_isyarat_3d");
                wadah.appendChild(p.el);
                gambar(window.performance.now());
            },
            lepas3d: function () {
                if (!p3) return;
                p3.hancur();
                p3 = null;
                wadah.classList.remove("dsb_isyarat_3d");
            },
            laju: function (x) {
                laju = x;
            },
            hidup: function (ya) {
                hidup = !!ya;
                if (hidup) jalan();
            },
            tatap: function (x, y) {
                if (x === null || !Number.isFinite(x) || !Number.isFinite(y)) {
                    if (tunjuk) tunjuk.ada = false;
                    return;
                }
                tunjuk = { x: x, y: y, t: window.performance.now(), ada: true };
                jalan();
            },
            tunggu3d: function (ya) {
                wadah.classList.toggle("dsb_isyarat_muat", !!ya);
                if (ya) wadah.setAttribute("aria-busy", "true");
                else wadah.removeAttribute("aria-busy");
            },
        };
    }

    function _isyArahTatapSvg(svg, x, y) {
        const ctm = svg?.getScreenCTM ? svg.getScreenCTM() : null;
        if (!ctm) return null;
        const p = svg.createSVGPoint();
        p.x = x;
        p.y = y;
        const q = p.matrixTransform(ctm.inverse());
        const a = Math.atan2(q.x - 200, 270);
        const b = Math.atan2(q.y - 132, 270);
        return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
    }

    function _isyCampurKe(tuju, ke, w) {
        for (let i = 0; i < tuju.length; i++) tuju[i] += (ke[i] - tuju[i]) * w;
    }


    const _isyNormal = (k) =>
        String(k === undefined || k === null ? "" : k)
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

    function _isySiapkanKamus(mentah, opsi) {
        const data = mentah || {};
        const uji = !!opsi?.uji;
        const semua = Array.isArray(data.isyarat) ? data.isyarat : [];
        const boleh = semua.filter(
            (e) => e && Array.isArray(e.kunci) && e.kunci.length && (e.terverifikasi === true || uji)
        );
        const hitung = {};
        for (const e of boleh) hitung[e.sistem] = (hitung[e.sistem] || 0) + 1;
        const sistem = hitung[opsi?.sistem] ? opsi.sistem : null;
        const kamus = {
            pustaka: { santai: _ISY_BENTUK_SANTAI, ...data.bentuk },
            sistem: sistem,
            nama: opsi?.sistem || "",
            huruf: new Map(),
            kata: new Map(),
        };
        for (const e of boleh) {
            if (e.sistem !== sistem) continue;
            const peta = e.jenis === "huruf" || e.jenis === "angka" ? kamus.huruf : kamus.kata;
            for (const k of [e.kata].concat(e.sinonim || [])) {
                const n = _isyNormal(k);
                if (n && !peta.has(n)) peta.set(n, e);
            }
        }
        return kamus;
    }

    function _isyCariKata(kamus, kata, i) {
        for (let n = Math.min(3, kata.length - i); n >= 1; n--) {
            const entri = kamus.kata.get(kata.slice(i, i + n).join(" "));
            if (entri) return { entri: entri, jumlah: n };
        }
        return null;
    }

    function _isySusunUrutan(kamus, teks) {
        const token = String(teks || "").match(/[\p{L}\p{N}]+|[.!?;:,]/gu) || [];
        const kata = token.map(_isyNormal);
        const urutan = [];
        let bisa = 0;
        for (let i = 0; i < token.length; i++) {
            if (/^[.!?;:,]$/.test(token[i])) {
                urutan.push({ jenis: "jeda", teks: token[i], ms: token[i] === "," ? 220 : 420 });
                continue;
            }
            const cocok = _isyCariKata(kamus, kata, i);
            if (cocok) {
                urutan.push({ jenis: "isyarat", teks: token.slice(i, i + cocok.jumlah).join(" "), entri: cocok.entri });
                i += cocok.jumlah - 1;
                bisa++;
                continue;
            }
            const huruf = Array.from(kata[i]).map((h) => kamus.huruf.get(h));
            const lengkap = huruf.every(Boolean);
            urutan.push(lengkap ? { jenis: "eja", teks: token[i], huruf: huruf } : { jenis: "lewati", teks: token[i] });
            if (lengkap) bisa++;
        }
        return { urutan: urutan, bisa: bisa };
    }

    function _isyLangkahEntri(kamus, entri, geser, mulai) {
        const langkah = [];
        const bibir = entri.jenis === "huruf" ? _ISY_MULUT_EJA[_isyNormal(entri.kata)] || "konsonan" : null;
        entri.kunci.forEach(function (k, i) {
            const kunci = bibir && !k.wajah ? { ...k, wajah: { mulut: bibir } } : k;
            langkah.push({
                ke: _isyPoseDari(kunci, kamus.pustaka, geser),
                durasi: k.t || 380,
                mulai: i === 0 ? mulai : null,
            });
            if (k.tahan) langkah.push({ ke: null, durasi: k.tahan });
        });
        return langkah;
    }


    const _ISY_IKON = {
        mundur: "M6 6h2v12H6zm3.5 6l8.5 6V6z",
        jeda: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
        putar: "M8 5v14l11-7z",
        maju: "M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z",
        besar: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
        tutup: "M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z",
    };
    const _ISY_LAJU = [1, 1.5, 0.5, 0.75];
    const _ISY_PESAN = {
        siap: "Klik teks di halaman untuk diisyaratkan, atau tekan Putar untuk mulai dari bagian yang terlihat.",
        kosong: " belum tersedia: kamus masih menunggu pengisian dan pemeriksaan juru bahasa isyarat.",
        tanpaTeks: "Tidak ada teks yang bisa diisyaratkan di halaman ini.",
        tanpaIsyarat: "Belum ada isyarat untuk teks ini.",
    };
    const _ISY_BLOK_TEKS = "p,li,h1,h2,h3,h4,h5,h6,td,th,blockquote,figcaption,dd,dt,caption";
    const _ISY_BUKAN_TEKS =
        "a,button,input,select,textarea,label,summary,video,audio,iframe,[role='button'],[role='link'],[contenteditable='true']";

    const _ISY_GAYA = `
.dsb-akar .dsb_isyarat{position:fixed;bottom:16px;z-index:2147483645;display:none;flex-direction:column;box-sizing:border-box;width:300px;max-width:calc(100vw - 24px);margin:0;padding:0;border-radius:16px;overflow:hidden;background:#16203A;color:#FFFFFF;box-shadow:0 10px 28px rgba(0,0,0,.42);font:600 13px/1.35 'Atkinson Hyperlegible','Segoe UI',Arial,sans-serif;text-align:left}
.dsb-akar .dsb_isyarat.dsb_isyarat_tampil{display:flex}
.dsb-akar .dsb_isyarat.dsb_isyarat_kanan{right:16px}
.dsb-akar .dsb_isyarat.dsb_isyarat_kiri{left:16px}
.dsb-akar .dsb_isyarat.dsb_isyarat_besar{width:430px}
.dsb-akar .dsb_isyarat_kepala{display:flex;align-items:center;gap:5px;padding:8px 8px 8px 12px}
.dsb-akar .dsb_isyarat_judul{flex:1;min-width:0;overflow:hidden;font-size:14px;font-weight:700;color:#FFFFFF;white-space:nowrap;text-overflow:ellipsis}
.dsb-akar .dsb_isyarat .dsb_isyarat_kepala .dsb_isyarat_tombol{flex:none;min-width:30px;height:30px;padding:0 4px;border-radius:8px}
.dsb-akar .dsb_isyarat_lencana{flex:none;padding:2px 7px;border-radius:999px;background:#FFC400;color:#16203A;font-size:11px;font-weight:700;letter-spacing:.04em}
.dsb-akar .dsb_isyarat_layar{position:relative;background:#20355f;line-height:0}
.dsb-akar .dsb_isyarat_avatar svg{display:block;width:100%;height:auto;max-width:none;max-height:calc(100vh - 190px);max-height:calc(100dvh - 190px)}
.dsb-akar .dsb_isyarat_avatar.dsb_isyarat_3d svg{display:none}
.dsb-akar .dsb_isyarat_avatar.dsb_isyarat_muat svg{visibility:hidden}
.dsb-akar .dsb_isyarat_avatar.dsb_isyarat_muat::before{content:"";position:absolute;top:50%;left:50%;width:34px;height:34px;margin:-30px 0 0 -17px;box-sizing:border-box;border:4px solid rgba(255,255,255,.25);border-top-color:#FFC400;border-radius:50%;animation:dsb_isyarat_putar .9s linear infinite}
.dsb-akar .dsb_isyarat_avatar.dsb_isyarat_muat::after{content:"Memuat avatar...";position:absolute;top:50%;left:0;right:0;margin-top:14px;color:#FFFFFF;font-size:13px;font-weight:600;line-height:1.3;text-align:center}
@keyframes dsb_isyarat_putar{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.dsb-akar .dsb_isyarat_avatar.dsb_isyarat_muat::before{animation:none}}
.dsb-akar .dsb_isyarat_kanvas{display:block;width:100%;height:auto;max-width:none;max-height:calc(100vh - 190px);max-height:calc(100dvh - 190px)}
.dsb-akar .dsb_isyarat_huruf{position:absolute;top:8px;right:8px;display:none;align-items:center;justify-content:center;min-width:38px;height:38px;padding:0 6px;border-radius:10px;background:#FFC400;color:#16203A;font-size:24px;font-weight:700;line-height:1;text-transform:uppercase}
.dsb-akar .dsb_isyarat_huruf.dsb_isyarat_tampil{display:flex}
.dsb-akar .dsb_isyarat_teks{padding:9px 12px 8px;color:#FFFFFF;font-weight:400;font-size:13px;line-height:1.45}
.dsb-akar .dsb_isyarat_kini{padding:0 3px;border-radius:4px;background:#FFC400;color:#16203A;font-weight:700}
.dsb-akar .dsb_isyarat_lewat{opacity:.6;text-decoration:underline dotted}
.dsb-akar .dsb_isyarat_kontrol{display:flex;align-items:center;gap:6px;padding:0 10px 10px}
.dsb-akar .dsb_isyarat .dsb_isyarat_tombol{display:flex;align-items:center;justify-content:center;min-width:36px;height:36px;margin:0;padding:0 6px;border:0;border-radius:10px;background:rgba(255,255,255,.14);color:#FFFFFF;font:700 13px/1 'Atkinson Hyperlegible','Segoe UI',Arial,sans-serif;cursor:pointer}
.dsb-akar .dsb_isyarat .dsb_isyarat_tombol:hover{background:${bg_color_icon}}
.dsb-akar .dsb_isyarat .dsb_isyarat_tombol:focus-visible{outline:3px solid #FFC400;outline-offset:2px}
@supports not selector(:focus-visible){.dsb-akar .dsb_isyarat .dsb_isyarat_tombol:focus{outline:3px solid #FFC400;outline-offset:2px}}
.dsb-akar .dsb_isyarat .dsb_isyarat_tombol[disabled]{opacity:.45;cursor:not-allowed}
.dsb-akar .dsb_isyarat .dsb_isyarat_tombol svg{width:20px;height:20px;fill:currentColor}
.dsb-akar .dsb_isyarat .dsb_isyarat_utama{flex:1;background:#FFC400;color:#16203A}
.dsb-akar .dsb_isyarat .dsb_isyarat_utama:hover{background:#FFD84D;color:#16203A}
@media only screen and (max-width:600px){.dsb-akar .dsb_isyarat{bottom:88px;width:62vw}.dsb-akar .dsb_isyarat.dsb_isyarat_besar{width:92vw}.dsb-akar .dsb_isyarat.dsb_isyarat_kanan{right:8px}.dsb-akar .dsb_isyarat.dsb_isyarat_kiri{left:8px}}
.dsb-isyarat-sorot:not(.dsb-akar *){outline:3px solid #FFC400 !important;outline-offset:3px !important;background-color:rgba(255,196,0,.2) !important}
html.dsb-bahasa-isyarat:not(#dsb_0):not(#dsb_1) :is(${_ISY_BLOK_TEKS}):not(.dsb-akar *):hover{outline:2px dashed #FFC400 !important;outline-offset:2px !important;cursor:pointer !important}
`;
    let _isyGayaTerpasang = false;

    function _isyPasangGaya(nonce) {
        if (_isyGayaTerpasang) return;
        _isyGayaTerpasang = true;
        const gaya = document.createElement("style");
        _pasangNonce(gaya, nonce);
        gaya.appendChild(document.createTextNode(_ISY_GAYA));
        (document.head || document.documentElement).appendChild(gaya);
    }

    function _isyBuat(nama, kelas, induk, teks) {
        const e = document.createElement(nama);
        if (kelas) e.className = kelas;
        if (teks) e.textContent = teks;
        if (induk) induk.appendChild(e);
        return e;
    }

    function _isyTombol(induk, label, ikon, aksi) {
        const b = _isyBuat("button", "dsb_isyarat_tombol", induk);
        b.type = "button";
        b.setAttribute("aria-label", label);
        b.title = label;
        if (ikon) {
            const svg = _isyEl("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" }, b);
            _isyEl("path", { d: ikon }, svg);
        }
        b.addEventListener("click", function (e) {
            e.preventDefault();
            aksi();
        });
        return b;
    }

    function _isyBlokDari(elemen) {
        if (elemen?.nodeType !== 1 || elemen.closest(_ISY_BUKAN_TEKS)) return null;
        const blok = elemen.closest(_ISY_BLOK_TEKS);
        if (blok) return blok;
        for (const n of elemen.childNodes) {
            if (n.nodeType === 3 && /\S/.test(n.nodeValue)) return elemen;
        }
        return null;
    }

    function _isyBuatPanel(opsi) {
        _isyPasangGaya(opsi.nonce);
        const kamus = _isySiapkanKamus(opsi.kamus, { uji: opsi.uji, sistem: opsi.sistem });
        const pesanAwal = kamus.sistem ? _ISY_PESAN.siap : "Isyarat " + kamus.nama + _ISY_PESAN.kosong;
        const istirahat = _isyPoseDari(null, kamus.pustaka, 0);
        const istirahatSenyum = _isyPoseDari({ wajah: { mulut: "senyum", alis: 0.25 } }, kamus.pustaka, 0);
        const avatar = _isyBuatAvatar();
        let muat3d = null;
        let dibuang = false;
        let daftar = [];
        let indeks = 0;
        let main = false;
        let dijeda = false;
        let otomatis = false;
        let terbuka = false;
        let sorotKini = null;
        let putaran = 0;
        let iLaju = 0;

        const akar = _isyBuat("div", "dsb_isyarat notranslate");
        function aturSisi(sisi) {
            const kiri = sisi === "kiri";
            akar.classList.toggle("dsb_isyarat_kiri", kiri);
            akar.classList.toggle("dsb_isyarat_kanan", !kiri);
        }
        aturSisi(opsi.sisi);
        akar.setAttribute("translate", "no");
        akar.setAttribute("role", "region");
        akar.setAttribute("aria-label", "Bahasa Isyarat");
        akar.setAttribute("lang", "id");
        const kepala = _isyBuat("div", "dsb_isyarat_kepala", akar);
        _isyBuat("span", "dsb_isyarat_judul", kepala, "Bahasa Isyarat");
        if (kamus.nama) _isyBuat("span", "dsb_isyarat_lencana", kepala, kamus.nama);
        _isyTombol(kepala, "Perbesar atau perkecil peraga", _ISY_IKON.besar, function () {
            akar.classList.toggle("dsb_isyarat_besar");
        });
        _isyTombol(kepala, "Tutup bahasa isyarat", _ISY_IKON.tutup, function () {
            tutup(false);
        });
        const layar = _isyBuat("div", "dsb_isyarat_layar", akar);
        layar.appendChild(avatar.el);
        const huruf = _isyBuat("div", "dsb_isyarat_huruf", layar);
        huruf.setAttribute("aria-hidden", "true");
        const teks = _isyBuat("div", "dsb_isyarat_teks", akar, pesanAwal);
        const kontrol = _isyBuat("div", "dsb_isyarat_kontrol", akar);
        const tMundur = _isyTombol(kontrol, "Bagian sebelumnya", _ISY_IKON.mundur, function () {
            geser(-1);
        });
        const tPutar = _isyTombol(kontrol, "Putar", _ISY_IKON.putar, tekanPutar);
        tPutar.classList.add("dsb_isyarat_utama");
        const tMaju = _isyTombol(kontrol, "Bagian berikutnya", _ISY_IKON.maju, function () {
            geser(1);
        });
        const tLaju = _isyTombol(kontrol, "Kecepatan", null, function () {
            iLaju = (iLaju + 1) % _ISY_LAJU.length;
            avatar.laju(_ISY_LAJU[iLaju]);
            tLaju.textContent = _ISY_LAJU[iLaju] + "\u00d7";
        });
        tLaju.textContent = "1\u00d7";
        if (!kamus.sistem) {
            for (const t of [tMundur, tPutar, tMaju, tLaju]) t.disabled = true;
        }
        opsi.akar.appendChild(akar);

        function perbaruiTombol() {
            const label = main && !dijeda ? "Jeda" : "Putar";
            tPutar.setAttribute("aria-label", label);
            tPutar.title = label;
            tPutar.querySelector("path").setAttribute("d", main && !dijeda ? _ISY_IKON.jeda : _ISY_IKON.putar);
        }

        function sorot(elemen) {
            if (sorotKini && sorotKini !== elemen) sorotKini.classList.remove("dsb-isyarat-sorot");
            sorotKini = elemen || null;
            if (!elemen || elemen === document.body) return;
            elemen.classList.add("dsb-isyarat-sorot");
            const r = elemen.getBoundingClientRect();
            if (r.top < 0 || r.bottom > window.innerHeight) elemen.scrollIntoView({ block: "center" });
        }

        function tampilHuruf(h) {
            huruf.textContent = h || "";
            huruf.classList.toggle("dsb_isyarat_tampil", !!h);
        }

        function tampilTeks(urutan, kini) {
            teks.textContent = "";
            const awal = Math.max(0, kini - 4);
            const akhir = Math.min(urutan.length, kini + 14);
            for (let i = awal; i < akhir; i++) {
                const item = urutan[i];
                if (item.jenis === "jeda") {
                    teks.appendChild(document.createTextNode(item.teks));
                    continue;
                }
                if (i > awal) teks.appendChild(document.createTextNode(" "));
                let kelas = "";
                if (i === kini) kelas = "dsb_isyarat_kini";
                else if (item.jenis === "lewati") kelas = "dsb_isyarat_lewat";
                _isyBuat("span", kelas, teks, item.teks);
            }
        }

        function saatHuruf(urutan, n, entri, pertama, hidupkan) {
            return function () {
                if (!hidupkan()) return;
                if (pertama) {
                    tampilTeks(urutan, n);
                    avatar.kedip();
                }
                tampilHuruf(entri.kata);
            };
        }

        function langkahItem(urutan, n, hidupkan) {
            const item = urutan[n];
            const tampil = function () {
                if (!hidupkan()) return;
                tampilTeks(urutan, n);
                tampilHuruf("");
            };
            if (item.jenis === "isyarat") return _isyLangkahEntri(kamus, item.entri, 0, tampil);
            if (item.jenis === "jeda") return [{ ke: null, durasi: item.ms }];
            if (item.jenis === "lewati") return [];
            let langkah = [];
            for (let i = 0; i < item.huruf.length; i++) {
                const kembar = i > 0 && item.huruf[i - 1] === item.huruf[i];
                const mulai = saatHuruf(urutan, n, item.huruf[i], i === 0, hidupkan);
                langkah = langkah.concat(_isyLangkahEntri(kamus, item.huruf[i], kembar ? 13 : 0, mulai));
            }
            langkah.push({ ke: null, durasi: 140 });
            return langkah;
        }

        function akhirBlok() {
            tampilHuruf("");
            if (otomatis && indeks + 1 < daftar.length) {
                mainkanBlok(indeks + 1, true);
                return;
            }
            main = false;
            perbaruiTombol();
        }

        function mainkanBlok(i, lanjut) {
            putaran++;
            const ini = putaran;
            const hidupkan = () => ini === putaran && terbuka;
            avatar.kosongkan();
            tampilHuruf("");
            let susunan = null;
            for (indeks = i; indeks < daftar.length; indeks++) {
                susunan = _isySusunUrutan(kamus, daftar[indeks].teks);
                if (susunan.bisa || !lanjut) break;
            }
            otomatis = lanjut;
            if (!susunan?.bisa || indeks >= daftar.length) {
                main = false;
                perbaruiTombol();
                avatar.antre([{ ke: istirahat, durasi: 380 }]);
                teks.textContent = _ISY_PESAN.tanpaIsyarat;
                return;
            }
            sorot(daftar[indeks].el);
            main = true;
            dijeda = false;
            perbaruiTombol();
            let langkah = [];
            for (let n = 0; n < susunan.urutan.length; n++)
                langkah = langkah.concat(langkahItem(susunan.urutan, n, hidupkan));
            langkah.push(
                {
                    ke: istirahatSenyum,
                    durasi: 420,
                    selesai: function () {
                        if (hidupkan()) akhirBlok();
                    },
                },
                { ke: null, durasi: 520 },
                { ke: istirahat, durasi: 480 }
            );
            avatar.antre(langkah);
        }

        function tekanPutar() {
            if (main) {
                dijeda = !dijeda;
                avatar.jeda(dijeda);
                perbaruiTombol();
                return;
            }
            daftar = opsi.ambilBlok ? opsi.ambilBlok() : [];
            if (!daftar.length) {
                teks.textContent = _ISY_PESAN.tanpaTeks;
                return;
            }
            let mulai = 0;
            for (let i = 0; i < daftar.length; i++) {
                if (daftar[i].el.getBoundingClientRect().bottom > 0) {
                    mulai = i;
                    break;
                }
            }
            mainkanBlok(mulai, true);
        }

        function geser(arah) {
            if (!daftar.length) return;
            mainkanBlok(_isyJepit(indeks + arah, 0, daftar.length - 1), otomatis);
        }

        function klikHalaman(e) {
            if (!terbuka || !kamus.sistem || e.button) return;
            if (opsi.milikWidget?.(e.target)) return;
            const blok = _isyBlokDari(e.target);
            if (!blok) return;
            const pilihan = window.getSelection ? String(window.getSelection()) : "";
            const isi = (pilihan.trim() ? pilihan : blok.innerText || blok.textContent || "")
                .replace(/\s+/g, " ")
                .trim();
            if (!isi) return;
            daftar = [{ el: blok, teks: isi.slice(0, 700) }];
            mainkanBlok(0, false);
        }

        function pasang3d(p) {
            if (dibuang) p.hancur();
            else avatar.pakai3d(p);
        }

        function siapkan3d() {
            if (muat3d || !opsi.muat3d) return;
            avatar.tunggu3d(true);
            const batas = window.setTimeout(() => avatar.tunggu3d(false), 30000);
            const selesai = function () {
                window.clearTimeout(batas);
                avatar.tunggu3d(false);
            };
            muat3d = Promise.resolve()
                .then(() => opsi.muat3d(_ISY_RANGKA))
                .then(pasang3d)
                .catch(() => null)
                .then(selesai);
        }

        function buka(fokus) {
            terbuka = true;
            akar.classList.add("dsb_isyarat_tampil");
            if (kamus.sistem) _kelasHtml("dsb-bahasa-isyarat", true);
            avatar.hidup(true);
            siapkan3d();
            if (fokus) tPutar.focus({ preventScroll: true });
        }

        function tutup(dariWidget) {
            if (!terbuka) return;
            terbuka = false;
            putaran++;
            main = false;
            dijeda = false;
            avatar.kosongkan();
            avatar.pasang(istirahat);
            avatar.hidup(false);
            sorot(null);
            tampilHuruf("");
            perbaruiTombol();
            teks.textContent = pesanAwal;
            akar.classList.remove("dsb_isyarat_tampil");
            _kelasHtml("dsb-bahasa-isyarat", false);
            if (!dariWidget && opsi.saatTutup) opsi.saatTutup();
        }

        document.addEventListener("click", klikHalaman, true);
        akar.addEventListener("keydown", function (e) {
            if (e.key === "Escape") tutup(false);
        });
        akar.addEventListener(
            "pointermove",
            function (e) {
                avatar.tatap(e.clientX, e.clientY);
            },
            { passive: true }
        );
        akar.addEventListener("pointerleave", function () {
            avatar.tatap(null);
        });
        function hancur() {
            tutup(true);
            dibuang = true;
            avatar.lepas3d();
            document.removeEventListener("click", klikHalaman, true);
            akar.remove();
        }

        return { el: akar, buka: buka, tutup: tutup, hancur: hancur, aturSisi: aturSisi };
    }

    function _isyKamus() {
        // prettier-ignore
        return {
            "versi": 1,
            "diperbarui": "2026-11-16",
            "keterangan": "Kamus isyarat widget aksesibilitas. Entri hanya diputar untuk pengunjung bila terverifikasi:true (sudah diperiksa juru bahasa isyarat).",
            "sistem": ["SIBI","BISINDO"],
            "bentuk": {
                "A": {"jempol":[16,10,6,8],"telunjuk":[85,100],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "B": {"jempol":[12,55,70,50],"telunjuk":[0,0],"tengah":[0,0],"manis":[0,0],"kelingking":[0,0],"renggang":0},
                "C": {"jempol":[40,50,10,20],"telunjuk":[45,40],"tengah":[45,42],"manis":[45,42],"kelingking":[45,40],"renggang":1},
                "D": {"jempol":[26,60,30,30],"telunjuk":[0,0],"tengah":[70,55],"manis":[70,55],"kelingking":[70,55],"renggang":0},
                "E": {"jempol":[8,48,72,55],"telunjuk":[40,105],"tengah":[40,105],"manis":[40,105],"kelingking":[40,105],"renggang":0},
                "F": {"jempol":[32,58,18,24],"telunjuk":[62,60],"tengah":[0,0],"manis":[0,0],"kelingking":[0,0],"renggang":11},
                "G": {"jempol":[12,28,0,0],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "H": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[0,0],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "I": {"jempol":[10,55,64,46],"telunjuk":[85,100],"tengah":[85,100],"manis":[85,100],"kelingking":[0,0],"renggang":0},
                "K": {"jempol":[18,42,8,8],"telunjuk":[0,0],"tengah":[48,8],"manis":[85,100],"kelingking":[85,100],"renggang":12},
                "L": {"jempol":[82,0,0,0],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "M": {"jempol":[12,38,58,14],"telunjuk":[78,80],"tengah":[78,80],"manis":[78,80],"kelingking":[85,100],"renggang":0},
                "N": {"jempol":[12,38,45,10],"telunjuk":[78,80],"tengah":[78,80],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "O": {"jempol":[30,60,20,25],"telunjuk":[70,55],"tengah":[70,55],"manis":[70,55],"kelingking":[70,55],"renggang":0},
                "R": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[0,0],"manis":[85,100],"kelingking":[85,100],"renggang":0,"silang":1},
                "S": {"jempol":[20,40,75,25],"telunjuk":[85,100],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "T": {"jempol":[12,38,30,10],"telunjuk":[72,96],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "U": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[0,0],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "V": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[0,0],"manis":[85,100],"kelingking":[85,100],"renggang":14},
                "W": {"jempol":[0,60,74,44],"telunjuk":[0,0],"tengah":[0,0],"manis":[0,0],"kelingking":[82,96],"renggang":12},
                "X": {"jempol":[10,55,64,46],"telunjuk":[12,96],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "Y": {"jempol":[80,0,0,0],"telunjuk":[85,100],"tengah":[85,100],"manis":[85,100],"kelingking":[0,0],"renggang":14},
                "tunjuk": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisA": {"jempol":[62,0,0,0],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisS": {"jempol":[72,0,14,14],"telunjuk":[24,30],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisH": {"jempol":[74,0,0,0],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisY": {"jempol":[58,0,0,0],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisU": {"jempol":[24,0,0,0],"telunjuk":[0,0],"tengah":[85,100],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisC": {"jempol":[45,55,10,15],"telunjuk":[35,45],"tengah":[80,95],"manis":[80,95],"kelingking":[80,95],"renggang":0},
                "bisP": {"jempol":[40,58,12,18],"telunjuk":[42,55],"tengah":[82,98],"manis":[82,98],"kelingking":[82,98],"renggang":0},
                "bisV": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[0,0],"manis":[85,100],"kelingking":[85,100],"renggang":32},
                "bisK": {"jempol":[10,55,64,46],"telunjuk":[0,0],"tengah":[0,0],"manis":[85,100],"kelingking":[85,100],"renggang":44},
                "bisR": {"jempol":[20,58,22,20],"telunjuk":[8,14],"tengah":[58,62],"manis":[85,100],"kelingking":[85,100],"renggang":0},
                "bisLima": {"jempol":[62,8,0,0],"telunjuk":[0,0],"tengah":[0,0],"manis":[0,0],"kelingking":[0,0],"renggang":13}
            },
            "isyarat": [
                {"id":"sibi-huruf-a","kata":"a","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"A"}}]},
                {"id":"sibi-huruf-b","kata":"b","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"B"}}]},
                {"id":"sibi-huruf-c","kata":"c","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[70,6,-6],"bentuk":"C"}}]},
                {"id":"sibi-huruf-d","kata":"d","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[28,6,-6],"bentuk":"D"}}]},
                {"id":"sibi-huruf-e","kata":"e","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"E"}}]},
                {"id":"sibi-huruf-f","kata":"f","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"F"}}]},
                {"id":"sibi-huruf-g","kata":"g","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[180,0,86],"bentuk":"G"}}]},
                {"id":"sibi-huruf-h","kata":"h","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[180,0,86],"bentuk":"H"}}]},
                {"id":"sibi-huruf-i","kata":"i","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"I"}}]},
                {"id":"sibi-huruf-j","kata":"j","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":120,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"I"}},{"t":240,"tahan":0,"kanan":{"pos":[76,50,62],"arah":[60,0,20],"bentuk":"I"}},{"t":240,"tahan":260,"kanan":{"pos":[62,56,62],"arah":[165,0,40],"bentuk":"I"}}]},
                {"id":"sibi-huruf-k","kata":"k","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"K"}}]},
                {"id":"sibi-huruf-l","kata":"l","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"L"}}]},
                {"id":"sibi-huruf-m","kata":"m","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"M"}}]},
                {"id":"sibi-huruf-n","kata":"n","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"N"}}]},
                {"id":"sibi-huruf-o","kata":"o","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[72,6,-6],"bentuk":"O"}}]},
                {"id":"sibi-huruf-p","kata":"p","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[72,50,70],"arah":[40,60,0],"bentuk":"K"}}]},
                {"id":"sibi-huruf-q","kata":"q","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[72,46,62],"arah":[180,20,172],"bentuk":"G"}}]},
                {"id":"sibi-huruf-r","kata":"r","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"R"}}]},
                {"id":"sibi-huruf-s","kata":"s","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"S"}}]},
                {"id":"sibi-huruf-t","kata":"t","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"T"}}]},
                {"id":"sibi-huruf-u","kata":"u","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"U"}}]},
                {"id":"sibi-huruf-v","kata":"v","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"V"}}]},
                {"id":"sibi-huruf-w","kata":"w","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"W"}}]},
                {"id":"sibi-huruf-x","kata":"x","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[35,6,-6],"bentuk":"X"}}]},
                {"id":"sibi-huruf-y","kata":"y","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":320,"kanan":{"pos":[78,26,62],"arah":[0,6,-6],"bentuk":"Y"}}]},
                {"id":"sibi-huruf-z","kata":"z","jenis":"huruf","sistem":"SIBI","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad jari satu tangan (SIBI), disusun dari uraian umum bentuk tangan. Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":80,"kanan":{"pos":[58,6,66],"arah":[0,30,-6],"bentuk":"tunjuk"}},{"t":200,"tahan":0,"kanan":{"pos":[90,6,66],"arah":[0,30,-6],"bentuk":"tunjuk"}},{"t":220,"tahan":0,"kanan":{"pos":[58,42,66],"arah":[0,30,-6],"bentuk":"tunjuk"}},{"t":200,"tahan":240,"kanan":{"pos":[90,42,66],"arah":[0,30,-6],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-a","kata":"a","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"A dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[44.7,87.5,62],"arah":[0,0,32],"bentuk":"bisA"},"kiri":{"pos":[44.7,87.5,62],"arah":[0,0,32],"bentuk":"bisA"}}]},
                {"id":"bisindo-huruf-b","kata":"b","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"B dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[63.3,71.4,60],"arah":[180,0,90],"bentuk":"W"},"kiri":{"pos":[20.4,115.1,68],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-c","kata":"c","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"C dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[78,30,62],"arah":[80,5,-5],"bentuk":"bisC"}}]},
                {"id":"bisindo-huruf-d","kata":"d","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"D dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[26.9,105.2,62],"arah":[80,5,-5],"bentuk":"bisC"},"kiri":{"pos":[17.6,113.8,66],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-e","kata":"e","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"E dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[55.9,71.3,62],"arah":[180,0,90],"bentuk":"W"}}]},
                {"id":"bisindo-huruf-f","kata":"f","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"F dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[42.2,54.3,62],"arah":[180,0,111],"bentuk":"bisV"},"kiri":{"pos":[7.5,135,68],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-g","kata":"g","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"G dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[21.8,53.2,66],"arah":[180,0,90],"bentuk":"S"},"kiri":{"pos":[21.7,83.3,60],"arah":[180,0,90],"bentuk":"S"}}]},
                {"id":"bisindo-huruf-h","kata":"h","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"H dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[37.4,83.4,62],"arah":[0,0,0],"bentuk":"bisH"},"kiri":{"pos":[19.5,113.4,66],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-i","kata":"i","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"I dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[78,26,62],"arah":[0,5,-5],"bentuk":"I"}}]},
                {"id":"bisindo-huruf-j","kata":"j","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"Kepalan huruf I dibalik sampai kelingking menunjuk ke bawah (cocok dengan cuplikan acuan); lintasan geraknya perkiraan.","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"J dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":210,"tahan":120,"kanan":{"pos":[78,22,62],"arah":[0,5,-5],"bentuk":"I"}},{"t":300,"tahan":0,"kanan":{"pos":[100,50,58],"arah":[70,0,-100],"bentuk":"I"}},{"t":260,"tahan":320,"kanan":{"pos":[112,74,50],"arah":[150,10,-165],"bentuk":"I"}}]},
                {"id":"bisindo-huruf-k","kata":"k","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"KURANG PASTI: cuplikan acuan buram (tangan sedang bergerak), dan ada varian lain huruf K. Periksa lebih dulu.","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"K dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[61,59.1,62],"arah":[180,0,118],"bentuk":"bisK"},"kiri":{"pos":[18.6,115.3,66],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-l","kata":"l","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"L dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[80,26,62],"arah":[0,5,-5],"bentuk":"L"}}]},
                {"id":"bisindo-huruf-m","kata":"m","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"M dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[28.6,106.4,70],"arah":[180,0,50],"bentuk":"W"},"kiri":{"pos":[23.2,84.4,60],"arah":[10,0,-8],"bentuk":"bisLima"}}]},
                {"id":"bisindo-huruf-n","kata":"n","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"N dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[30,104.9,70],"arah":[180,0,50],"bentuk":"U"},"kiri":{"pos":[23.2,84.4,60],"arah":[10,0,-8],"bentuk":"bisLima"}}]},
                {"id":"bisindo-huruf-o","kata":"o","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"O dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[78,26,62],"arah":[72,6,-6],"bentuk":"O"}}]},
                {"id":"bisindo-huruf-p","kata":"p","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"P dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[27.7,89.9,58],"arah":[80,5,-5],"bentuk":"bisP"},"kiri":{"pos":[13.1,125.9,66],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-q","kata":"q","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"Di cuplikan acuan badan peraga menyamping; di sini diperagakan menghadap penonton.","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"Q dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[51.9,89.1,58],"arah":[180,0,72],"bentuk":"tunjuk"},"kiri":{"pos":[34.1,82.9,66],"arah":[60,6,-6],"bentuk":"O"}}]},
                {"id":"bisindo-huruf-r","kata":"r","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"KURANG PASTI: detail jari tidak terlihat jelas pada cuplikan acuan, dan huruf R mungkin bergerak. Periksa lebih dulu.","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"R dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[78,26,62],"arah":[30,5,-5],"bentuk":"bisR"}}]},
                {"id":"bisindo-huruf-s","kata":"s","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"S dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[32.1,110,62],"arah":[0,0,22],"bentuk":"bisS"},"kiri":{"pos":[45.9,57.2,62],"arah":[0,0,40],"bentuk":"bisS"}}]},
                {"id":"bisindo-huruf-t","kata":"t","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"T dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[46.3,68,58],"arah":[180,0,90],"bentuk":"tunjuk"},"kiri":{"pos":[13.1,124,66],"arah":[20,0,0],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-u","kata":"u","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"U dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[78,26,62],"arah":[0,5,-5],"bentuk":"bisU"}}]},
                {"id":"bisindo-huruf-v","kata":"v","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"V dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[78,26,62],"arah":[0,5,-22],"bentuk":"bisV"}}]},
                {"id":"bisindo-huruf-w","kata":"w","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"W dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[36.7,83.3,62],"arah":[0,0,-22],"bentuk":"L"},"kiri":{"pos":[36.7,83.3,62],"arah":[0,0,-22],"bentuk":"L"}}]},
                {"id":"bisindo-huruf-x","kata":"x","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"X dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[37.6,105.8,68],"arah":[180,0,52],"bentuk":"tunjuk"},"kiri":{"pos":[37.6,106.1,60],"arah":[180,0,52],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-y","kata":"y","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"Di cuplikan acuan badan peraga menyamping; di sini diperagakan menghadap penonton.","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"Y dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[4.2,81.1,56],"arah":[10,0,-34],"bentuk":"bisY"},"kiri":{"pos":[65.5,81.7,66],"arah":[0,0,58],"bentuk":"tunjuk"}}]},
                {"id":"bisindo-huruf-z","kata":"z","jenis":"huruf","sistem":"BISINDO","sinonim":[],"terverifikasi":false,"pemeriksa":"","tanggal":"","catatan":"Lengan membentuk Z seperti di cuplikan acuan; bila hurufnya bergerak, geraknya belum tergambar.","sumber":"Draf abjad BISINDO, disusun dari satu cuplikan gambar (bingkai tengah) video \"Z dalam BISINDO\" di Wikimedia Commons (angphotorion, CC BY-SA 4.0). Belum diperiksa juru bahasa isyarat.","kunci":[{"t":260,"tahan":380,"kanan":{"pos":[96,-30,46],"arah":[-96,0,-96],"bentuk":"B","siku":25}}]}
            ]
        };
    }

    var _mediaDibisukan = new Set();
    var _pengamatMedia = null;

    function _bisukanSatuMedia(m) {
        if (_widgetFunkyMilikWidget(m) || m.muted) return;
        m.muted = true;
        _mediaDibisukan.add(m);
    }

    function _bisukanMediaDi(akar) {
        if (akar.matches?.("audio, video")) _bisukanSatuMedia(akar);
        for (const m of akar.querySelectorAll("audio, video")) _bisukanSatuMedia(m);
    }

    function _efekBisukanMedia(tingkat) {
        if (tingkat > 0) {
            _bisukanMediaDi(document.body);
            if (!_pengamatMedia && window.MutationObserver) {
                _pengamatMedia = new MutationObserver(function (mutasi) {
                    for (const m of mutasi) {
                        for (const n of m.addedNodes) {
                            if (n.nodeType === 1) _bisukanMediaDi(n);
                        }
                    }
                });
                _pengamatMedia.observe(document.body, { childList: true, subtree: true });
            }
            return;
        }
        if (_pengamatMedia) {
            _pengamatMedia.disconnect();
            _pengamatMedia = null;
        }
        for (const m of _mediaDibisukan) m.muted = false;
        _mediaDibisukan.clear();
    }

    var _labelGambar = null;
    var _deskripsiGambarAktif = false;

    function _teksDeskripsiGambar(img) {
        var teks = "";
        var kosong = false;
        if (img.hasAttribute("alt")) {
            teks = img.getAttribute("alt").replace(/\s+/g, " ").trim();
            if (!teks) {
                teks = "Gambar hiasan (teks alternatif kosong)";
                kosong = true;
            }
        } else if (img.getAttribute("aria-label")) {
            teks = img.getAttribute("aria-label").trim();
        } else {
            teks = "Gambar tanpa deskripsi (tidak ada teks alternatif)";
            kosong = true;
        }
        if (!kosong) teks = "Gambar: " + (teks.length > 200 ? teks.slice(0, 200) + "..." : teks);
        return { teks: teks, kosong: kosong };
    }

    function _tampilkanLabelGambar(img, x, y) {
        if (!_labelGambar) {
            _labelGambar = document.createElement("div");
            _labelGambar.className = "dsb_label_gambar";
            _labelGambar.setAttribute("aria-hidden", "true");
            create_slider_mouse.appendChild(_labelGambar);
        }
        var d = _teksDeskripsiGambar(img);
        _labelGambar.textContent = d.teks;
        _labelGambar.classList.toggle("dsb_label_gambar_kosong", d.kosong);
        _labelGambar.style.display = "block";
        _posisikanLabelGambar(x, y);
    }

    function _posisikanLabelGambar(x, y) {
        if (_labelGambar?.style.display !== "block") return;
        var lebar = _labelGambar.offsetWidth;
        var tinggi = _labelGambar.offsetHeight;
        _labelGambar.style.left = Math.max(4, Math.min(x + 16, window.innerWidth - lebar - 4)) + "px";
        _labelGambar.style.top = Math.max(4, Math.min(y + 18, window.innerHeight - tinggi - 4)) + "px";
    }

    function _sembunyikanLabelGambar() {
        if (_labelGambar) _labelGambar.style.display = "none";
    }

    function _gambarDariTarget(t) {
        if (t?.nodeType !== 1 || _widgetFunkyMilikWidget(t)) return null;
        return t.tagName === "IMG" ? t : null;
    }

    function _labelGambarMasuk(e) {
        var img = _gambarDariTarget(e.target);
        if (img) _tampilkanLabelGambar(img, e.clientX, e.clientY);
    }

    function _labelGambarGerak(e) {
        if (_gambarDariTarget(e.target)) _posisikanLabelGambar(e.clientX, e.clientY);
    }

    function _labelGambarKeluar(e) {
        if (_gambarDariTarget(e.target)) _sembunyikanLabelGambar();
    }

    function _labelGambarFokus(e) {
        var t = e.target;
        if (t?.nodeType !== 1 || _widgetFunkyMilikWidget(t)) return;
        var img = t.tagName === "IMG" ? t : t.querySelector("img");
        if (!img) return;
        var r = t.getBoundingClientRect();
        _tampilkanLabelGambar(img, r.left - 16, r.bottom - 10);
    }

    function _efekDeskripsiGambar(tingkat) {
        var aktif = tingkat > 0;
        if (aktif === _deskripsiGambarAktif) return;
        _deskripsiGambarAktif = aktif;
        var ubah = aktif ? "addEventListener" : "removeEventListener";
        document[ubah]("mouseover", _labelGambarMasuk, true);
        document[ubah]("mousemove", _labelGambarGerak, true);
        document[ubah]("mouseout", _labelGambarKeluar, true);
        document[ubah]("focusin", _labelGambarFokus, true);
        document[ubah]("focusout", _sembunyikanLabelGambar, true);
        if (!aktif) _sembunyikanLabelGambar();
    }

    var _strukturSasaran = [];
    var _NAMA_LANDMARK = [
        ["header, [role='banner']", "Kepala Halaman", "Atas"],
        ["nav, [role='navigation']", "Navigasi", "Nav"],
        ["[role='search']", "Pencarian", "Cari"],
        ["main, [role='main']", "Konten Utama", "Utama"],
        ["aside, [role='complementary']", "Konten Samping", "Samping"],
        ["footer, [role='contentinfo']", "Kaki Halaman", "Bawah"],
    ];

    function _elemenTerlihat(el) {
        return el.getClientRects().length > 0 && window.getComputedStyle(el).visibility !== "hidden";
    }

    function _teksRingkas(el, maks) {
        var t = (el.textContent || "").replace(/\s+/g, " ").trim();
        return t.length > maks ? t.slice(0, maks) + "..." : t;
    }

    function _landmarkDilewati(el, sudah) {
        if (sudah.has(el) || _widgetFunkyMilikWidget(el) || !_elemenTerlihat(el)) return true;
        var tag = el.tagName;
        if ((tag === "HEADER" || tag === "FOOTER") && !el.getAttribute("role")) {
            return Boolean(el.parentElement?.closest("article, section, aside, main, nav"));
        }
        return false;
    }

    function _kumpulkanLandmark() {
        var landmark = [];
        var sudah = new Set();
        for (const def of _NAMA_LANDMARK) {
            for (const el of document.body.querySelectorAll(def[0])) {
                if (_landmarkDilewati(el, sudah)) continue;
                var label = el.getAttribute("aria-label");
                sudah.add(el);
                landmark.push({ el: el, tanda: def[2], teks: def[1] + (label ? ": " + label.trim() : "") });
            }
        }
        landmark.sort(function (a, b) {
            return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        return landmark;
    }

    function _kumpulkanJudul() {
        var judul = [];
        for (const el of document.body.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")) {
            if (judul.length >= 200) break;
            if (_widgetFunkyMilikWidget(el) || !_elemenTerlihat(el)) continue;
            var teks = _teksRingkas(el, 120);
            if (!teks) continue;
            var tingkat = /^H[1-6]$/.test(el.tagName)
                ? Number(el.tagName[1])
                : Number(el.getAttribute("aria-level")) || 2;
            judul.push({ el: el, tanda: "H" + tingkat, teks: teks, tingkat: tingkat });
        }
        return judul;
    }

    function _kumpulkanStruktur() {
        return { landmark: _kumpulkanLandmark(), judul: _kumpulkanJudul() };
    }

    function _bangunDaftarStruktur() {
        var wadah = _widgetCari("#dsb_struktur_daftar");
        if (!wadah) return;
        var data = _kumpulkanStruktur();
        _strukturSasaran = [];
        wadah.textContent = "";
        var tambahKelompok = function (judulKelompok, butir) {
            var k = document.createElement("div");
            k.className = "dsb_struktur_kelompok";
            k.textContent = judulKelompok;
            wadah.appendChild(k);
            for (const b of butir) {
                var item = document.createElement("div");
                item.className = "dsb_struktur_item";
                item.dataset.indeks = String(_strukturSasaran.length);
                if (b.tingkat) item.dataset.tingkat = String(b.tingkat);
                var tanda = document.createElement("div");
                tanda.className = "dsb_struktur_tanda";
                tanda.setAttribute("aria-hidden", "true");
                tanda.textContent = b.tanda;
                var teks = document.createElement("div");
                teks.className = "dsb_struktur_teks";
                teks.textContent = b.teks;
                item.appendChild(tanda);
                item.appendChild(teks);
                item.setAttribute("aria-label", (b.tingkat ? "Judul tingkat " + b.tingkat + ": " : "") + b.teks);
                _jadikanTombol(item, null);
                wadah.appendChild(item);
                _strukturSasaran.push(b);
            }
        };
        if (data.landmark.length) tambahKelompok("Bagian Halaman", data.landmark);
        if (data.judul.length) tambahKelompok("Judul", data.judul);
        if (!data.landmark.length && !data.judul.length) {
            var kosong = document.createElement("div");
            kosong.className = "dsb_struktur_kosong";
            kosong.textContent = "Halaman ini tidak memiliki judul atau bagian yang ditandai.";
            wadah.appendChild(kosong);
        }
    }

    function _fokusSementara(sasaran) {
        if (!sasaran.hasAttribute("tabindex")) {
            sasaran.setAttribute("tabindex", "-1");
            sasaran.addEventListener(
                "blur",
                function () {
                    sasaran.removeAttribute("tabindex");
                },
                { once: true }
            );
        }
        sasaran.scrollIntoView({ block: "start" });
        sasaran.focus({ preventScroll: true });
        sasaran.classList.add("dsb-struktur-sasaran");
        setTimeout(function () {
            sasaran.classList.remove("dsb-struktur-sasaran");
        }, 2500);
    }

    function _lompatKeStruktur(b) {
        var sasaran = b.el;
        if (!sasaran?.isConnected) return;
        var tutup = _widgetCari("#circle_close_popup_dsb");
        if (tutup) tutup.click();
        _fokusSementara(sasaran);
        setTimeout(function () {
            callfunction(b.teks, _bahasaSuaraHalaman());
        }, 100);
    }

    function _sasaranKontenUtama() {
        var kandidat = document.querySelector(
            "main, [role='main'], #main-content, #maincontent, #main, #content, #konten"
        );
        if (!kandidat || _widgetFunkyMilikWidget(kandidat)) kandidat = document.querySelector("h1");
        return kandidat && !_widgetFunkyMilikWidget(kandidat) ? kandidat : null;
    }

    function _situsPunyaTautanLewati() {
        var tautan = document.body.querySelectorAll("a[href^='#']");
        for (var i = 0; i < Math.min(tautan.length, 5); i++) {
            var teks = (tautan[i].textContent + " " + (tautan[i].getAttribute("aria-label") || "")).toLowerCase();
            if (/skip|lewati|langsung ke|loncat ke|ke konten|ke isi/.test(teks)) return true;
        }
        return false;
    }

    function _buatTautanLewati(teks, aksi) {
        var a = document.createElement("a");
        a.href = "#";
        a.className = "dsb-lewati dsb-akar notranslate";
        a.setAttribute("translate", "no");
        a.setAttribute("lang", "id");
        a.textContent = teks;
        a.addEventListener("click", function (e) {
            e.preventDefault();
            aksi();
        });
        return a;
    }

    function _pasangLewatiKonten() {
        var depan = document.body.firstChild;
        var sasaran = _sasaranKontenUtama();
        if (sasaran && !_situsPunyaTautanLewati()) {
            document.body.insertBefore(
                _buatTautanLewati("Lewati ke konten utama", function () {
                    _fokusSementara(sasaran);
                }),
                depan
            );
        }
        document.body.insertBefore(
            _buatTautanLewati("Buka menu aksesibilitas (Ctrl+U)", function () {
                var tombol = _widgetCari("#show_menu_dsb_web");
                if (!tombol || _menuWidgetTerbuka()) return;
                _jalankanDariKeyboard(function () {
                    tombol.click();
                });
            }),
            depan
        );
    }

    function _pasangPernyataanAksesibilitas() {
        var nilai = _atributSkrip("pernyataan-aksesibilitas");
        var tempat = _widgetCari(".column_reset_disabilitas_menu");
        if (!nilai || !tempat) return;
        var url;
        try {
            url = new URL(nilai, window.location.href);
        } catch (e) {
            return;
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") return;
        var a = document.createElement("a");
        a.className = "dsb_pernyataan";
        a.href = url.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "Pernyataan Aksesibilitas";
        tempat.appendChild(a);
    }

    // Nomor warna (posisi di "warna") disimpan di peramban pengunjung. Warna baru SELALU ditambahkan di akhir
    // daftar agar pilihan yang sudah tersimpan tidak berubah warna; urutan di layar diatur lewat "urutan".
    // Warna teks gelap berkontras >= 5,3:1 terhadap semua latar terang, dan Kuning / Biru Muda / Putih
    // >= 8,9:1 terhadap semua latar gelap di bawah.
    var _WARNA_TEKS = [
        ["Hitam", "#000000"],
        ["Biru Tua", "#0B3D91"],
        ["Hijau Tua", "#1B5E20"],
        ["Merah Tua", "#8B0000"],
        ["Ungu Tua", "#4A148C"],
        ["Putih", "#FFFFFF"],
        ["Abu Tua", "#333333"],
        ["Biru", "#0047AB"],
        ["Cokelat Tua", "#5D4037"],
        ["Oranye Tua", "#A0410D"],
        ["Kuning", "#FFEB3B"],
        ["Biru Muda", "#81D4FA"],
    ];
    var _URUTAN_WARNA_TEKS = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 11, 5];

    var _PALET_WARNA = [
        {
            jenis: "teks",
            judul: "Warna Teks",
            kelas: "dsb-warna-teks",
            variabel: "--dsb-warna-teks",
            warna: _WARNA_TEKS,
            urutan: _URUTAN_WARNA_TEKS,
        },
        {
            jenis: "judul",
            judul: "Warna Judul",
            kelas: "dsb-warna-judul",
            variabel: "--dsb-warna-judul",
            warna: _WARNA_TEKS,
            urutan: _URUTAN_WARNA_TEKS,
        },
        {
            jenis: "latar",
            judul: "Warna Latar",
            kelas: "dsb-warna-latar",
            variabel: "--dsb-warna-latar",
            warna: [
                ["Putih", "#FFFFFF"],
                ["Krem", "#FBF3DB"],
                ["Kuning Muda", "#FFF9C4"],
                ["Biru Muda", "#E3F2FD"],
                ["Hijau Muda", "#E8F5E9"],
                ["Hitam", "#000000"],
                ["Merah Muda", "#FCE4EC"],
                ["Ungu Muda", "#EDE7F6"],
                ["Abu Muda", "#F1F3F4"],
                ["Biru Gelap", "#0B1F3A"],
                ["Hijau Gelap", "#0F2E1D"],
                ["Abu Gelap", "#212121"],
            ],
            urutan: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 5],
        },
    ];

    function _warnaTersimpan(p) {
        var nilai = _widgetStorage.getItem("dsb_warna_" + p.jenis);
        if (nilai === null || nilai === "") return -1;
        var n = Number(nilai);
        return Number.isInteger(n) && n >= 0 && n < p.warna.length ? n : -1;
    }

    function _terapkanWarna(p, nomor) {
        var akar = document.documentElement;
        if (nomor >= 0) {
            akar.style.setProperty(p.variabel, p.warna[nomor][1]);
            _kelasHtml(p.kelas, true);
            _widgetStorage.setItem("dsb_warna_" + p.jenis, String(nomor));
        } else {
            _kelasHtml(p.kelas, false);
            akar.style.removeProperty(p.variabel);
            _widgetStorage.removeItem("dsb_warna_" + p.jenis);
        }
        $w(".dsb_warna_pilih[data-jenis='" + p.jenis + "']").each(function () {
            this.setAttribute("aria-pressed", String(Number(this.dataset.nomor) === nomor));
        });
        _perbaruiNilaiWarna();
    }

    function _perbaruiNilaiWarna() {
        var dipilih = [];
        for (const p of _PALET_WARNA) {
            var n = _warnaTersimpan(p);
            if (n >= 0) dipilih.push(p.judul.replace("Warna ", "") + " " + p.warna[n][0]);
        }
        _tampilkanNilaiBaris(
            "text_nilai_warna_widget",
            dipilih.length ? "Aktif: " + dipilih.join(", ") : "Warna teks, judul, dan latar",
            dipilih.length > 0
        );
    }

    function _aturUlangWarna() {
        for (const p of _PALET_WARNA) {
            if (_warnaTersimpan(p) >= 0 || document.documentElement.classList.contains(p.kelas)) _terapkanWarna(p, -1);
        }
    }

    function _tombolWarna(p, nomor) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "dsb_warna_pilih";
        b.dataset.jenis = p.jenis;
        b.dataset.nomor = String(nomor);
        b.setAttribute("aria-pressed", "false");
        var nama = nomor >= 0 ? p.warna[nomor][0] : "Bawaan situs";
        b.setAttribute("aria-label", p.judul + ": " + nama);
        b.title = nama;
        if (nomor >= 0) {
            var bulat = document.createElement("span");
            bulat.className = "dsb_warna_bulat";
            bulat.setAttribute("aria-hidden", "true");
            bulat.style.backgroundColor = p.warna[nomor][1];
            b.appendChild(bulat);
        } else {
            b.classList.add("dsb_warna_bawaan");
            b.textContent = "Bawaan";
        }
        b.addEventListener("click", function (e) {
            e.preventDefault();
            if (_lepasProfilWarna) _lepasProfilWarna("no");
            hit_api_tracking(base_url_website, "warna-" + p.jenis);
            _terapkanWarna(p, nomor);
            setTimeout(function () {
                callfunction(p.judul + " " + nama);
            }, 100);
        });
        return b;
    }

    var _lepasProfilWarna = null;

    function _pasangPengaturanWarna(lepasProfil) {
        _lepasProfilWarna = lepasProfil;
        var judulPanel = _widgetCari("#dropdown_warna_widget");
        var panel = _widgetCari("#show_warna_widget_dsb");
        var wadah = _widgetCari("#dsb_warna_isi");
        if (!judulPanel || !panel || !wadah) {
            for (const p of _PALET_WARNA) if (_warnaTersimpan(p) >= 0) _terapkanWarna(p, _warnaTersimpan(p));
            return;
        }
        for (const p of _PALET_WARNA) {
            var kelompok = document.createElement("div");
            kelompok.className = "dsb_warna_kelompok";
            var judul = document.createElement("div");
            judul.className = "dsb_warna_judul";
            judul.textContent = p.judul;
            var baris = document.createElement("div");
            baris.className = "dsb_warna_baris";
            baris.setAttribute("role", "group");
            baris.setAttribute("aria-label", p.judul);
            baris.appendChild(_tombolWarna(p, -1));
            for (const nomor of p.urutan) baris.appendChild(_tombolWarna(p, nomor));
            kelompok.appendChild(judul);
            kelompok.appendChild(baris);
            wadah.appendChild(kelompok);
            _terapkanWarna(p, _warnaTersimpan(p));
        }
        judulPanel.addEventListener("click", function (event) {
            event.preventDefault();
            var buka = judulPanel.getAttribute("aria-expanded") !== "true";
            judulPanel.setAttribute("aria-expanded", String(buka));
            panel.style.display = buka ? "flex" : "none";
            if (buka) hit_api_tracking(base_url_website, "pengaturan-warna");
        });
    }

    function _pasangStrukturHalaman() {
        var judulPanel = _widgetCari("#dropdown_struktur_widget");
        var panel = _widgetCari("#show_struktur_widget_dsb");
        var wadah = _widgetCari("#dsb_struktur_daftar");
        if (!judulPanel || !panel || !wadah) return;
        judulPanel.addEventListener("click", function (event) {
            event.preventDefault();
            if (judulPanel.getAttribute("aria-expanded") === "true") {
                judulPanel.setAttribute("aria-expanded", "false");
                panel.style.display = "none";
                return;
            }
            hit_api_tracking(base_url_website, "struktur-halaman");
            _bangunDaftarStruktur();
            judulPanel.setAttribute("aria-expanded", "true");
            panel.style.display = "flex";
            setTimeout(function () {
                callfunction("Struktur Halaman");
            }, 100);
        });
        wadah.addEventListener("click", function (event) {
            var item = event.target.closest?.(".dsb_struktur_item");
            if (!item) return;
            event.preventDefault();
            var b = _strukturSasaran[Number(item.dataset.indeks)];
            if (b) _lompatKeStruktur(b);
        });
    }

    function _tampilkanFiturKelas(f, tingkat) {
        var $petak = $w("#" + f.id);
        if (!$petak.length) return;
        var aktif = tingkat > 0;
        $petak.toggleClass("active_box_menu_disabilitas", aktif);
        $petak
            .find(".box_text_bottom_disabilitas")
            .toggleClass("active_box_text_bottom_disabilitas", aktif)
            .text(aktif ? f.tingkat[tingkat - 1][1] : f.nama);
        $petak.find(".box_icon_disabilitas .icon_svg_color").each(function () {
            this.classList.toggle("active_icon_svg_color", aktif);
        });
        if (f.tingkat.length > 1) {
            var grup = "#list_strip_loading_" + f.id;
            strip_batch_reset(3, grup, f.tingkat.length);
            for (var i = 1; i <= tingkat; i++) strip_loading_v3(grup, "#strip_loading_" + i, "aktif");
        }
    }

    function _pulihFiturKelas(f) {
        return {
            kunci: f.kunci,
            daftar: null,
            resetSuara: false,
            muat: null,
            tingkat: f.tingkat.map(function (_t, i) {
                return function () {
                    _terapkanFiturKelas(f, i + 1);
                };
            }),
        };
    }

    var _aksesKeyboardTerpasang = false;
    var _aksiDariKeyboard = false;
    var _TOMBOL_TOGGLE_WIDGET = [
        [".box_group_disabilitas", "active_box_menu_disabilitas"],
        [".box_profile_aksesbilitas", "active_box_profile_aksesbilitas"],
        [".list_bahasa_item", "active_bahasa_item"],
    ];

    function _jadikanTombol(el, label) {
        if (!el) return;
        el.setAttribute("role", "button");
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
        if (label) el.setAttribute("aria-label", label);
    }

    function _sinkronAriaPressed(el) {
        for (const pasangan of _TOMBOL_TOGGLE_WIDGET) {
            if (el.matches(pasangan[0])) {
                var nilai = String(el.classList.contains(pasangan[1]));
                if (el.getAttribute("aria-pressed") !== nilai) el.setAttribute("aria-pressed", nilai);
            }
        }
    }

    // Tingkat petak bertingkat (mis. Perbesar Teks 2 dari 4) hanya terlihat dari garis strip. Teks tersembunyi
    // ini membuat pembaca layar ikut membacakannya (WCAG 1.3.1 / 4.1.2). Diletakkan langsung di petak, bukan di
    // label, karena label sebagian petak diganti lewat .text() saat tingkat berubah.
    function _sinkronTingkatPetak(el) {
        var petak = el.closest?.(".box_group_disabilitas");
        var daftar = petak?.querySelector(".box_row_action_strip");
        if (!daftar) return;
        var total = daftar.children.length;
        var aktif = petak.classList.contains("active_box_menu_disabilitas")
            ? daftar.querySelectorAll('[class*="strip_loading_process_v"]').length
            : 0;
        var teks = aktif > 0 ? ", tingkat " + aktif + " dari " + total : "";
        var span = petak.querySelector(":scope > .dsb-sr-tingkat");
        if (!span) {
            if (!teks) return;
            span = document.createElement("span");
            span.className = "dsb-sr-tingkat";
            petak.appendChild(span);
        }
        if (span.textContent !== teks) span.textContent = teks;
    }

    function _menuWidgetTerbuka() {
        return $w(".content_aksesbilitas").hasClass("new-show-toolbar");
    }

    // Panel menu yang tertutup hanya digeser keluar layar (translateX), sehingga puluhan tombolnya tetap kena Tab dan
    // dibacakan pembaca layar walau tidak terlihat (WCAG 2.4.3 / 2.4.7). inert mengeluarkannya selama tertutup dan
    // dilepas begitu class new-show-toolbar terpasang, sebelum fokus dipindah ke tombol Tutup (_fokusSesudahBuka).
    function _sinkronInertMenu(wadah) {
        if (!wadah) return;
        if (wadah.classList.contains("new-show-toolbar")) wadah.removeAttribute("inert");
        else wadah.setAttribute("inert", "");
    }

    function _pasangAksesKeyboard() {
        var tombol = _widgetCari("#show_menu_dsb_web");
        var menu = _widgetCari("#widget_menu_disabilitas");
        if (!tombol || !menu || _aksesKeyboardTerpasang) return;
        _aksesKeyboardTerpasang = true;

        _jadikanTombol(tombol, "Buka menu aksesibilitas (Ctrl+U)");
        tombol.setAttribute("lang", "id");
        menu.setAttribute("role", "dialog");
        menu.setAttribute("aria-label", "Menu Aksesibilitas");
        menu.setAttribute("lang", "id");
        _pasangPenutupFokusKeluar();
        _jadikanTombol(_widgetCari("#circle_close_popup_dsb"), "Tutup menu aksesibilitas");
        $w(
            "#dropdown_bahasa_widget, #dropdown_profile_widget, #dropdown_struktur_widget, #dropdown_warna_widget, #dropdown_setting_widget, #reset_pengaturan_all_dsb"
        ).each(function () {
            _jadikanTombol(this, null);
        });
        var _panelBaris = {
            dropdown_bahasa_widget: "show_bahasa_widget_dsb",
            dropdown_profile_widget: "show_profile_widget_dsb",
            dropdown_struktur_widget: "show_struktur_widget_dsb",
            dropdown_warna_widget: "show_warna_widget_dsb",
            dropdown_setting_widget: "show_setting_widget",
        };
        for (const idBaris of Object.keys(_panelBaris)) {
            var _baris = _widgetCari("#" + idBaris);
            if (_baris) _baris.setAttribute("aria-controls", _panelBaris[idBaris]);
        }
        for (const pasangan of _TOMBOL_TOGGLE_WIDGET) {
            $w(pasangan[0]).each(function () {
                _jadikanTombol(this, null);
                _sinkronAriaPressed(this);
            });
        }
        $w("svg").attr({ "aria-hidden": "true", focusable: "false" });

        $w(".box_group_disabilitas").each(function () {
            _sinkronTingkatPetak(this);
        });
        if (window.MutationObserver) {
            new MutationObserver(function (mutasi) {
                for (const m of mutasi) {
                    if (m.target.nodeType !== 1) continue;
                    if (m.target === menu) _sinkronInertMenu(menu);
                    _sinkronAriaPressed(m.target);
                    _sinkronTingkatPetak(m.target);
                }
            }).observe(create_slider_dsb_element, { subtree: true, attributes: true, attributeFilter: ["class"] });
            // Hanya bila ada pengamat: tanpa MutationObserver inert tidak akan pernah dilepas lagi.
            _sinkronInertMenu(menu);
        }
        _pasangLewatiKonten();
        _pasangPernyataanAksesibilitas();
        create_div_element.addEventListener("keydown", _keyboardWidget);
        create_slider_dsb_element.addEventListener("keydown", _keyboardWidget);
    }

    function _keyboardWidget(e) {
        var el = e.target;
        var diTombol = !!el && typeof el.getAttribute === "function" && el.getAttribute("role") === "button";
        if (diTombol && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
            e.preventDefault();
            if (e.repeat) return;
            _jalankanDariKeyboard(function () {
                el.click();
            });
        } else if ((e.key === "Escape" || e.key === "Esc") && _menuWidgetTerbuka()) {
            e.preventDefault();
            _jalankanDariKeyboard(function () {
                var tutup = _widgetCari("#circle_close_popup_dsb");
                if (tutup) tutup.click();
            });
        }
    }

    function _jalankanDariKeyboard(aksi) {
        _aksiDariKeyboard = true;
        try {
            aksi();
        } finally {
            _aksiDariKeyboard = false;
        }
    }

    function _fokusSesudahBuka() {
        if (!_aksiDariKeyboard) return;
        setTimeout(function () {
            var tutup = _widgetCari("#circle_close_popup_dsb");
            if (tutup) tutup.focus({ preventScroll: true });
        }, 50);
    }

    // Menu adalah dialog non-modal yang menutupi sebagian halaman. Bila fokus dipindah lewat keyboard
    // (Tab / Shift+Tab) ke elemen di luar menu, menu ditutup agar elemen yang difokus tidak tertutup panel
    // (WCAG 2.4.11). Fokus dibiarkan di tempat yang dipilih pengguna. Klik mouse tidak menutup menu, supaya
    // efek tetap bisa dicoba di halaman sambil menu terbuka.
    var _fokusLewatKeyboard = false;
    var _penutupFokusKeluarTerpasang = false;

    // Tombol widget yang melayang bisa menutupi elemen halaman di pojok (mis. tombol "kembali ke atas" situs).
    // Saat elemen halaman yang bertumpuk dengan tombol widget sedang difokus, tombol widget disembunyikan
    // sementara agar fokus tetap terlihat (WCAG 2.4.11). Tombol muncul lagi saat fokus pindah, termasuk saat
    // tombol widget sendiri difokus; menu tetap bisa dibuka dengan Ctrl+U.
    function _tombolMenepiDariFokus(target) {
        var tombol = _widgetCari("#show_menu_dsb_web");
        if (!tombol) return;
        if (!(target instanceof Element) || target.closest(".dsb-akar")) {
            tombol.classList.remove("dsb_tombol_menepi");
            return;
        }
        // Tunggu peramban selesai menggulir elemen yang difokus ke dalam layar.
        requestAnimationFrame(function () {
            if (document.activeElement !== target) return;
            var a = target.getBoundingClientRect();
            var b = tombol.getBoundingClientRect();
            var bertumpuk =
                a.width > 0 && b.width > 0 && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
            tombol.classList.toggle("dsb_tombol_menepi", bertumpuk);
        });
    }

    function _pasangPenutupFokusKeluar() {
        if (_penutupFokusKeluarTerpasang) return;
        _penutupFokusKeluarTerpasang = true;
        document.addEventListener(
            "keydown",
            function (e) {
                if (e.key === "Tab") _fokusLewatKeyboard = true;
            },
            true
        );
        document.addEventListener(
            "pointerdown",
            function () {
                _fokusLewatKeyboard = false;
            },
            true
        );
        document.addEventListener("focusin", function (e) {
            _tombolMenepiDariFokus(e.target);
        }, true);
        document.addEventListener("focusout", function (e) {
            if (!e.relatedTarget) _tombolMenepiDariFokus(null);
        }, true);
        document.addEventListener(
            "focusin",
            function (e) {
                if (!_fokusLewatKeyboard || !_menuWidgetTerbuka()) return;
                var wadahMenu = _widgetCari(".content_aksesbilitas");
                if (!wadahMenu || wadahMenu.contains(e.target)) return;
                wadahMenu.classList.remove("new-show-toolbar");
                $w("#show_menu_dsb_web").css("display", "flex");
            },
            true
        );
    }

    function _fokusSesudahTutup() {
        if (!_aksiDariKeyboard) return;
        var tombol = _widgetCari("#show_menu_dsb_web");
        if (tombol) tombol.focus({ preventScroll: true });
    }

    function _fokusKeJudulPanel(idJudul) {
        if (!_aksiDariKeyboard) return;
        var judul = _widgetCari(idJudul);
        if (judul) judul.focus({ preventScroll: true });
    }

    function strip_batch_reset(version, id_group, stripCount) {
        var $grp = $w(id_group);
        $grp.hide();
        var proc = "strip_loading_process_v" + version;
        var unproc = "strip_loading_unprocess_v" + version;
        for (var _sb = 1; _sb <= stripCount; _sb++) {
            $grp.children("#strip_loading_" + _sb)
                .removeClass(proc)
                .addClass(unproc);
        }
    }

    function strip_loading_v2(id_group, id_strip, action) {
        var $s = $w(id_group + " > " + id_strip);
        if (action == "aktif") {
            $w(id_group).show();
            $s.removeClass("strip_loading_unprocess_v2").addClass("strip_loading_process_v2");
        } else {
            $w(id_group).hide();
            $s.removeClass("strip_loading_process_v2").addClass("strip_loading_unprocess_v2");
        }
    }

    function strip_loading_v3(id_group, id_strip, action) {
        var $s = $w(id_group + " > " + id_strip);
        if (action == "aktif") {
            $w(id_group).show();
            $s.removeClass("strip_loading_unprocess_v3").addClass("strip_loading_process_v3");
        } else {
            $w(id_group).hide();
            $s.removeClass("strip_loading_process_v3").addClass("strip_loading_unprocess_v3");
        }
    }

    function strip_loading_v4(id_group, id_strip, action) {
        var $s = $w(id_group + " > " + id_strip);
        if (action == "aktif") {
            $w(id_group).show();
            $s.removeClass("strip_loading_unprocess_v4").addClass("strip_loading_process_v4");
        } else {
            $w(id_group).hide();
            $w(id_group).hide();
            $s.removeClass("strip_loading_process_v4").addClass("strip_loading_unprocess_v4");
        }
    }

    function load_active_link_all() {
        $w("#action_garis_bawahi_tautan").addClass("active_box_menu_disabilitas");
        $w("#action_garis_bawahi_tautan .box_icon_disabilitas .icon_fill_svg_color_black").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_fill_svg_color_black")) {
                item.classList = "icon_fill_svg_color_black active_icon_fill_svg_color_black";
            }
        });

        $w("#action_garis_bawahi_tautan")
            .find(".box_text_bottom_disabilitas")
            .addClass("active_box_text_bottom_disabilitas");
    }

    function action_garis_link_1() {
        $w("#list_strip_loading_action_garis_bawahi_tautan").show();
        strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_1", "aktif");
        $w("#text_garis_bawahi_tautan").text("Garis Bawahi Tautan");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Garis Bawahi Tautan");
            }, 100);
        }

        // Bersihkan tingkat 2 dulu, baru pasang tingkat 1 (dulu terbalik: pembersihan menghapus garis bawah yang baru dipasang).
        action_perataan_text_1_2("rata2", "noaktif");
        action_perataan_text_1_2("rata1", "aktif");

        $w("#svg_decoration_link").show();
        $w("#svg_block_decoration_link").hide();
    }

    function action_garis_link_2() {
        $w("#list_strip_loading_action_garis_bawahi_tautan").show();
        strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_1", "aktif");
        strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_2", "aktif");
        $w("#svg_decoration_link").hide();
        $w("#svg_block_decoration_link").show();
        $w("#text_garis_bawahi_tautan").text("Sorot Tautan");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Sorot Tautan");
            }, 100);
        }
        action_perataan_text_1_2("rata1", "noaktif");
        action_perataan_text_1_2("rata2", "aktif");
    }

    function action_gangguna_motorik_process() {
        setTimeout(() => {
            load_active_animate_pause();
            load_active_tooltip_teks_action();
        }, 100);
    }

    function active_button_link_profile(id_number) {
        var get_array = id_number - 1;
        var all_id_profile = [
            "action_gangguan_motorik",
            "action_netra_total",
            "action_buta_warna",
            "action_disleksia",
            "action_gangguan_pengelihatan",
            "action_kognitif_pembelajaran",
            "action_kejang_dan_epilepsi",
            "action_adhd",
        ];
        var id = "#" + all_id_profile[get_array];

        $w(id).addClass("active_box_profile_aksesbilitas");
        $w(id + " *").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("color_svg_content_profile_disabilitas")) {
                item.classList = "active_color_svg_content_profile_disabilitas";
            }

            if (name_class.includes("fill_icon_dsb")) {
                item.classList = "fill_icon_dsb active_fill_icon_dsb";
            }

            if (name_class.includes("text_list_content_profile_disabilitas")) {
                item.classList = "text_list_content_profile_disabilitas active_text_list_content_profile_disabilitas";
            }

            if (name_class.includes("icon_list_content_profile_disabilitas")) {
                item.classList = "icon_list_content_profile_disabilitas active_icon_list_content_profile_disabilitas";
            }
        });
    }

    function action_buta_warna_process() {
        var value_grey_scale = [1, 1];
        action_grey_scale_widget.length = 0;
        action_grey_scale_widget.push(...value_grey_scale);
        setTimeout(() => {
            load_active_grey_scale_v2();
        }, 100);
    }

    function action_disleksia_process() {
        var value_one_tulisan_dibaca = [1];
        action_tulisan_dibaca.length = 0;
        action_tulisan_dibaca.push(...value_one_tulisan_dibaca);
        setTimeout(() => {
            load_active_tulisan_dpt_dibaca();
            active_action_ramah_dyseleksia();
        }, 100);
    }

    function action_gangguan_pengelihatan_process() {
        var value_kursor = [1];
        action_kursor_widget.length = 0;
        action_kursor_widget.push(...value_kursor);
        var value_one_text_besar = [1];
        action_text_besar.length = 0;
        action_text_besar.push(...value_one_text_besar);

        var value_one_tulisan_dibaca = [1, 1];
        action_tulisan_dibaca.length = 0;
        action_tulisan_dibaca.push(...value_one_tulisan_dibaca);

        var value_grey_scale = [1, 1];
        action_grey_scale_widget.length = 0;
        action_grey_scale_widget.push(...value_grey_scale);

        setTimeout(() => {
            load_active_grey_scale_v2();
            clear_set_text_kecil();
            load_active_text_besar();
            text_besar_1();
            load_active_tulisan_dpt_dibaca();
            active_action_tulisan_dapat_dibaca();
            action_kursor_widget_1();
            load_active_animate_pause();
            load_active_tooltip_teks_action();
        }, 100);
    }
    function action_kognitif_pembelajaran_process() {
        var value_one_text_besar = [1];
        action_text_besar.length = 0;
        action_text_besar.push(...value_one_text_besar);

        var value_one_tulisan_dibaca = [1, 1, 1];
        action_kursor_widget.length = 0;
        action_kursor_widget.push(...value_one_tulisan_dibaca);

        setTimeout(() => {
            clear_set_text_kecil();
            load_active_text_besar();
            text_besar_1();
            load_active_animate_pause();
            load_active_tooltip_teks_action();
            action_kursor_widget_3();
        }, 100);
    }

    function action_kejang_dan_epilepsi_process() {
        var value_grey_scale = [1];
        action_grey_scale_widget.length = 0;
        action_grey_scale_widget.push(...value_grey_scale);
        setTimeout(() => {
            load_active_grey_scale();
            load_active_animate_pause();
        }, 100);
    }

    function action_adhd_process() {
        var value_kursor = [1, 1];
        action_kursor_widget.length = 0;
        action_kursor_widget.push(...value_kursor);
        var value_grey_scale = [1];
        action_grey_scale_widget.length = 0;
        action_grey_scale_widget.push(...value_grey_scale);

        setTimeout(() => {
            load_active_grey_scale();
            action_kursor_widget_2();
        }, 400);
    }

    var _SELECTOR_TAUTAN_WIDGET = "a,div > a,li a, a *,a > h1, a > h2, a > h3, a > h4, a > h5,a > *";

    function _kontrasGelapAktif() {
        return action_contrash_widget.length == 2 || action_contrash_widget.length == 3;
    }

    function _garisTautanAktif(versi, daftarTautan) {
        var links = daftarTautan || document.querySelectorAll(_SELECTOR_TAUTAN_WIDGET);
        for (const link of links) {
            if (isBlank(link.href)) continue;
            var $link = $(link);
            var attr_cek = $link.attr("style");
            if (attr_cek !== undefined && attr_cek !== false) {
                _garisTautanKelas($link, versi);
            } else {
                _garisTautanInline($link, versi);
            }
        }
    }

    function _garisTautanKelas($link, versi) {
        if (versi === 2) {
            $link.addClass("underline_link_2");
        } else if (_kontrasGelapAktif()) {
            $link.addClass("underline_link_1_kontras");
        } else {
            $link.addClass("underline_link_1");
        }
    }

    function _garisTautanInline($link, versi) {
        $link.addClass("underline_tanda_code");
        $link.cssImportant("text-decoration", "underline");
        if (versi === 2) {
            $link.cssImportant("background-color", "black");
            $link.cssImportant("background", "black");
            $link.cssImportant("color", "yellow");
            $link.cssImportant("text-decoration-color", "yellow");
        } else if (_kontrasGelapAktif()) {
            $link.cssImportant("text-decoration-color", "yellow");
        } else {
            $link.cssImportant("text-decoration-color", "black");
        }
    }

    function _garisTautanMati(versi) {
        if (versi === 1) {
            $(".underline_tanda_code")
                .css({ "text-decoration-color": "", "text-decoration": "" })
                .removeClass("underline_tanda_code underline_link_1_kontras underline_link_1");
            $(".underline_link_1_kontras").removeClass("underline_link_1_kontras");
            $(".underline_link_1").removeClass("underline_link_1");
            return;
        }
        if (_kontrasGelapAktif()) {
            $(".underline_tanda_code")
                .css({ "text-decoration-color": "", "text-decoration": "" })
                .removeClass("underline_tanda_code underline_link_2");
        } else {
            $(".underline_tanda_code")
                .css({
                    "text-decoration-color": "",
                    "background-color": "",
                    background: "",
                    "text-decoration": "",
                    color: "",
                })
                .removeClass("underline_tanda_code underline_link_2");
        }
        $(".underline_link_2").removeClass("underline_link_2");
    }

    function action_perataan_text_1_2(value, action) {
        var versi = 0;
        if (value == "rata1") {
            versi = 1;
        } else if (value == "rata2") {
            versi = 2;
        }
        if (!versi) return;
        if (action == "aktif") {
            _garisTautanAktif(versi);
        } else {
            _garisTautanMati(versi);
        }
    }

    function _terapkanUlangGarisTautan() {
        var tingkat = action_garis_bawahi_tautan_widget.length;
        if (tingkat == 1) {
            // Bersihkan tingkat 2 dulu, baru pasang tingkat 1 (dulu terbalik: pembersihan menghapus garis bawah yang baru dipasang).
            action_perataan_text_1_2("rata2", "noaktif");
            action_perataan_text_1_2("rata1", "aktif");
        }
        if (tingkat == 2) {
            action_perataan_text_1_2("rata1", "noaktif");
            action_perataan_text_1_2("rata2", "aktif");
        }
    }

    function load_active_tulisan_line_height() {
        $w("#action_tulisan_line_height").addClass("active_box_menu_disabilitas");
        $w("#action_tulisan_line_height .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });

        $w("#action_tulisan_line_height")
            .find(".box_text_bottom_disabilitas")
            .addClass("active_box_text_bottom_disabilitas");
    }

    function _applyLineHeight(val, akarList) {
        var els = _getWebElements(null, akarList);
        for (const el of els) {
            _tulisGayaWidget(el, "line-height", val);
        }
    }

    function action_line_height_1() {
        $w("#list_strip_loading_action_tulisan_line_height").show();
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "aktif");
        _applyLineHeight("1.75em");
        $w("#text_id_tinggi_garis").text("Tinggi Garis (1.75X)");
        if (cek_action_sound_search.length > 0) {
            setTimeout(function () {
                callfunction("Tinggi Garis (1.75X)");
            }, 100);
        }
    }

    function action_line_height_2() {
        $w("#list_strip_loading_action_tulisan_line_height").show();
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_2", "aktif");
        _applyLineHeight("2em");
        $w("#text_id_tinggi_garis").text("Tinggi Garis (2X)");
        if (cek_action_sound_search.length > 0) {
            setTimeout(function () {
                callfunction("Tinggi Garis (2X)");
            }, 100);
        }
    }

    function action_line_height_3() {
        $w("#list_strip_loading_action_tulisan_line_height").show();
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_2", "aktif");
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_3", "aktif");
        _applyLineHeight("2.5em");
        $w("#text_id_tinggi_garis").text("Tinggi Garis (2.5X)");
        if (cek_action_sound_search.length > 0) {
            setTimeout(function () {
                callfunction("Tinggi Garis (2.5X)");
            }, 100);
        }
    }

    function load_active_kontras() {
        $w("#action_kontras").addClass("active_box_menu_disabilitas");
        $w("#action_kontras").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");
        $w("#action_kontras .box_icon_disabilitas path").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("circle_multi")) {
                item.classList = "circle_multi active_circle_multi";
            }

            if (name_class.includes("circle_single")) {
                item.classList = "circle_single active_circle_single";
            }
        });
    }

    var _kontrasExclude =
        ".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,.row_column_creator";

    // ---- Kontras+ (2 = Kontras Tinggi, 3 = Latar Gelap, 4 = Latar Terang; 1 = Balikan Warna lewat filter) ----
    // Warna diterapkan lewat SATU kelas di <html>: aturan CSS "html.dsb-kontras-N" (!important, setara tiga ID).
    // Dulu warna ditulis ke setiap elemen: lambat di halaman besar (sekitar 0,6 detik per klik di 45 ribu elemen),
    // dan saat dimatikan, opacity / border-color / latar inline milik situs ikut terhapus. Dengan CSS, elemen
    // bertumpuk dan elemen yang muncul belakangan otomatis ikut, aturan !important situs kalah, dan gaya situs tidak
    // disentuh. Yang tidak bisa dikalahkan CSS hanya gaya inline !important milik situs: elemen seperti itu ditulis
    // inline oleh widget (nilai aslinya dicatat, lalu dikembalikan saat Kontras dimatikan).
    var _KONTRAS_WARNA = {
        2: { latar: "black", teks: "#40C090", tautan: "yellow", tepi: "white" },
        3: { latar: "black", teks: "yellow", tautan: "yellow", tepi: "white" },
        4: { latar: "white", teks: "black", tautan: "black", tepi: null },
    };
    var _PROP_KONTRAS_INLINE = ["background-color", "background-image", "color", "border-color"];
    var _SELEKTOR_INLINE_PENTING = '[style*="important" i]';

    function _kontrasTimpaInlinePenting(mode, akarList) {
        var w = _KONTRAS_WARNA[mode];
        if (!w) return;
        var daftar = akarList
            ? _elemenCocokDiAkar(akarList, _SELEKTOR_INLINE_PENTING)
            : document.body.querySelectorAll(_SELEKTOR_INLINE_PENTING);
        for (const el of daftar) {
            if (_widgetFunkyMilikWidget(el) || el.matches(_kontrasExclude)) continue;
            var s = el.style;
            var latarPenting =
                s.getPropertyPriority("background-color") === "important" ||
                s.getPropertyPriority("background-image") === "important";
            // Sama dengan aturan CSS: .border (Kontras Tinggi) dan <svg> (Latar Terang) tidak diberi latar.
            var tanpaLatar = (mode === 2 && el.classList.contains("border")) || (mode === 4 && el.tagName.toLowerCase() === "svg");
            if (latarPenting && !tanpaLatar) {
                _tulisGayaWidget(el, "background-color", w.latar);
                _tulisGayaWidget(el, "background-image", "none");
            }
            if (s.getPropertyPriority("color") === "important") {
                _tulisGayaWidget(el, "color", el.tagName === "A" ? w.tautan : w.teks);
            }
            if (w.tepi && s.getPropertyPriority("border-color") === "important" && !el.matches(".fa-search,.titletools,svg")) {
                _tulisGayaWidget(el, "border-color", w.tepi);
            }
        }
    }

    function _kontrasCssAktif(mode) {
        _kelasHtml("dsb-kontras-" + mode, true);
        _kontrasTimpaInlinePenting(mode);
    }

    function _kontrasCssMati(mode) {
        _kelasHtml("dsb-kontras-" + mode, false);
        for (const p of _PROP_KONTRAS_INLINE) _pulihkanGayaHalaman(p);
    }

    function _kontras2Aktif() {
        $("body").removeClass("animsition");
        _kontrasCssAktif(2);
        _terapkanUlangGarisTautan();
    }

    function _kontras2Mati() {
        _kontrasCssMati(2);
    }

    function action_warna_kode_2(value) {
        if (value == "aktif") {
            _kontras2Aktif();
        } else {
            _kontras2Mati();
        }
    }

    function _kontras3Aktif() {
        $("body").removeClass("animsition");
        _kontrasCssAktif(3);
        _terapkanUlangGarisTautan();
    }

    function _kontras3Mati() {
        _kontrasCssMati(3);
    }

    function action_warna_kode_3(value) {
        if (value == "aktif") {
            _kontras3Aktif();
        } else {
            _kontras3Mati();
        }
    }

    function _kontras4Aktif() {
        $("body").removeClass("animsition");
        _kontrasCssAktif(4);
        _terapkanUlangGarisTautan();
    }

    function _kontras4Mati() {
        _kontrasCssMati(4);
    }

    function action_warna_kode_4(value) {
        if (value == "aktif") {
            _kontras4Aktif();
        } else {
            _kontras4Mati();
        }
    }

    function action_warna_kode_1(value) {
        if (value == "aktif") {
            _filterHtml(`invert(100%)`);
        } else {
            _filterHtml("");
        }
    }

    function load_active_tulisan_dpt_dibaca() {
        $w("#action_tulisan_dapat_di_baca").addClass("active_box_menu_disabilitas");
        $w("#action_tulisan_dapat_di_baca .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
        $w("#action_tulisan_dapat_di_baca")
            .find(".box_text_bottom_disabilitas")
            .addClass("active_box_text_bottom_disabilitas");
    }
    function active_action_ramah_dyseleksia() {
        $w("#svg_font_di_perbesar").hide();
        $w("#svg_dy_seleksia").show();
        $w("#list_strip_loading_action_tulisan_dapat_dibaca").show();
        strip_loading_v2("#list_strip_loading_action_tulisan_dapat_dibaca", "#strip_loading_1", "aktif");

        var els = _getWebElements("i,.fa,.fa-search,.fa-angle-down,.fa-chevron-down");
        for (const el of els) {
            _tulisGayaWidget(el, "font-family", "OpenDyslexic Bold");
        }
    }

    function active_action_tulisan_dapat_dibaca() {
        _pulihkanGayaHalaman("font-family");

        $w("#svg_dy_seleksia").hide();
        $w("#svg_font_di_perbesar").show();
        $w("#text_tulisan_dapat_di_baca").text("Tulisan Dapat Di Baca");

        strip_loading_v2("#list_strip_loading_action_tulisan_dapat_dibaca", "#strip_loading_1", "aktif");
        strip_loading_v2("#list_strip_loading_action_tulisan_dapat_dibaca", "#strip_loading_2", "aktif");

        $w("#action_tulisan_dapat_di_baca")
            .find(".box_text_bottom_disabilitas")
            .addClass("active_box_text_bottom_disabilitas");

        var els = _getWebElements("i,.fa,.fa-search,.fa-angle-down,.fa-chevron-down");
        for (const el of els) {
            _tulisGayaWidget(el, "font-family", "Arial, serif");
        }
    }
    // Ramah Disleksia hanya mengubah jenis huruf, jadi hanya font-family yang dikembalikan. Ukuran huruf
    // tidak disentuh: dulu ikut dihapus, sehingga Perbesar / Perkecil Teks yang masih aktif ikut hilang.
    function no_active_action_tulisan_dapat_dibaca() {
        _pulihkanGayaHalaman("font-family");
    }

    function load_active_space_text() {
        $w("#action_space_text").addClass("active_box_menu_disabilitas");
        $w("#action_space_text .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
        $w("#action_space_text").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");
    }
    function _applyLetterSpacing(val, akarList) {
        var els = _getWebElements(null, akarList);
        for (const el of els) {
            _tulisGayaWidget(el, "letter-spacing", val);
        }
    }

    function action_space_text_1() {
        $w("#list_strip_loading_action_space_text").show();
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "aktif");
        $w("#id_space_text").text("Spasi Huruf Ringan");
        _applyLetterSpacing("1px");
        if (cek_action_sound_search.length > 0) {
            setTimeout(function () {
                callfunction("Spasi Huruf Ringan");
            }, 100);
        }
    }
    function action_space_text_2() {
        $w("#list_strip_loading_action_space_text").show();
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_2", "aktif");
        $w("#id_space_text").text("Spasi Huruf Sedang");
        _applyLetterSpacing("4px");
        if (cek_action_sound_search.length > 0) {
            setTimeout(function () {
                callfunction("Spasi Huruf Sedang");
            }, 100);
        }
    }
    function action_space_text_3() {
        $w("#list_strip_loading_action_space_text").show();
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_2", "aktif");
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_3", "aktif");
        $w("#id_space_text").text("Spasi Huruf Besar");
        _applyLetterSpacing("7px");
        if (cek_action_sound_search.length > 0) {
            setTimeout(function () {
                callfunction("Spasi Huruf Besar");
            }, 100);
        }
    }
    function load_active_perataan_text() {
        $w("#action_perataan_text").addClass("active_box_menu_disabilitas");
        $w("#action_perataan_text .box_icon_disabilitas .icon_svg_sroke_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_sroke_color")) {
                item.classList = "icon_svg_sroke_color active_icon_svg_sroke_color";
            }
        });
    }
    function action_perataan_text_1() {
        $w("#list_strip_loading_perataan_text").show();
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");

        $w("#text_rata_tulisan").text("Rata Kiri");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Rata Kiri");
            }, 100);
        }
        $w("#svg_left_text_icon").show();
        $w("#svg_center_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();
        $w("#list_strip_loading_perataan_text").show();
        perataan_all_text("kiri", "aktif");
    }

    function action_perataan_text_2() {
        $w("#list_strip_loading_perataan_text").show();
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "aktif");
        $w("#text_rata_tulisan").text("Rata Tengah");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Rata Tengah");
            }, 100);
        }

        $w("#svg_center_text_icon").show();
        $w("#svg_left_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();
        perataan_all_text("kiri", "noaktif");
        perataan_all_text("tengah", "aktif");
    }

    function action_perataan_text_3() {
        $w("#list_strip_loading_perataan_text").show();
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_3", "aktif");

        $w("#text_rata_tulisan").text("Rata Kanan");
        $w("#svg_right_text_icon").show();
        $w("#svg_left_text_icon,#svg_center_text_icon,#svg_right_left_text_icon").hide();

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Rata Kanan");
            }, 100);
        }
        perataan_all_text("kiri", "noaktif");
        perataan_all_text("tengah", "noaktif");
        perataan_all_text("kanan", "aktif");
    }

    function action_perataan_text_4() {
        $w("#list_strip_loading_perataan_text").show();
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_3", "aktif");
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_4", "aktif");
        $w("#text_rata_tulisan").text("Rata Kanan - Kiri");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Rata Kanan dan Kiri");
            }, 100);
        }
        perataan_all_text("kiri", "noaktif");
        perataan_all_text("tengah", "noaktif");
        perataan_all_text("kanan", "noaktif");
        perataan_all_text("kanan-kiri", "aktif");
        $w("#svg_right_left_text_icon").show();
        $w("#svg_left_text_icon,#svg_center_text_icon,#svg_right_text_icon").hide();
    }

    var _wElCache = null,
        _cElCache = null,
        _sElCache = null;
    function _getWidgetRoots() {
        if (!_wElCache) _wElCache = create_slider_dsb_element.querySelector("#widget_menu_disabilitas");
        if (!_cElCache) _cElCache = create_div_element.querySelector(".circle_aksesbilitas_popup");
        if (!_sElCache) _sElCache = create_slider_dsb_element;
        return { w: _wElCache, c: _cElCache, s: _sElCache };
    }

    // Elemen akar beserta seluruh turunannya, urut seperti di dokumen.
    function _turunanAkar(akarList) {
        var hasil = [];
        for (const akar of akarList) {
            hasil.push(akar);
            for (const el of akar.querySelectorAll("*")) hasil.push(el);
        }
        return hasil;
    }

    // akarList (opsional): hanya elemen di dalam akar-akar ini (dipakai untuk elemen yang muncul belakangan).
    function _getWebElements(extraMatchStr, akarList) {
        var _akar = _getWidgetRoots();
        var _all = akarList ? _turunanAkar(akarList) : document.body.querySelectorAll("*");
        var _result = [];
        for (var _i = 0, _n = _all.length; _i < _n; _i++) {
            var _e = _all[_i];
            if (_e === _akar.w || _e === _akar.c || _e === _akar.s) {
                _i += _e.getElementsByTagName("*").length;
                continue;
            }
            var t = _e.tagName;
            if (
                t === "HTML" ||
                t === "BODY" ||
                t === "HEAD" ||
                t === "SCRIPT" ||
                t === "STYLE" ||
                t === "LINK" ||
                t === "META"
            )
                continue;
            if (extraMatchStr) {
                try {
                    if (_e.matches(extraMatchStr)) continue;
                } catch (ex) {}
            }
            _result.push(_e);
        }
        return _result;
    }

    function _getAlignableElements() {
        return _getWebElements(null);
    }

    function _bacaArahFlex(els) {
        var arah = new Array(els.length);
        for (var i = 0; i < els.length; i++) {
            arah[i] = window.getComputedStyle(els[i]).flexDirection;
        }
        return arah;
    }

    function _konfigPerataan(value) {
        switch (value) {
            case "kiri":
                return { kelas: "dsb-rata-kiri", align: "left", justify: "flex-start" };
            case "tengah":
                return { kelas: "dsb-rata-tengah", align: "center", justify: "center" };
            case "kanan":
                return { kelas: "dsb-rata-kanan", align: "right", justify: "flex-end" };
            default:
                return null;
        }
    }

    // ---- Rata Tulisan ----
    // text-align (dan justify-content untuk kontainer flex) diterapkan lewat SATU kelas di <html>
    // ("html.dsb-rata-*", !important, setara dua ID), tidak lagi ditulis ke setiap elemen: cepat di halaman besar,
    // elemen bertumpuk / yang muncul belakangan otomatis ikut, dan gaya situs tidak disentuh saat dimatikan.
    // Sama seperti sebelumnya, elemen yang arah flex-nya bukan "row" (kolom / terbalik) tidak diberi justify-content:
    // hanya elemen seperti itu yang ditandai atribut data-dsb-kolom.
    function _perataanTandaiKolom(daftarEl) {
        var els = daftarEl || _getAlignableElements();
        var arah = _bacaArahFlex(els);
        for (var i = 0; i < els.length; i++) {
            if (arah[i] !== "row") els[i].setAttribute("data-dsb-kolom", "");
        }
    }

    function _perataanLepasTandaKolom() {
        for (const el of document.querySelectorAll("[data-dsb-kolom]")) el.removeAttribute("data-dsb-kolom");
    }

    function _perataanAktif(cfg, daftarEl) {
        _perataanTandaiKolom(daftarEl);
        if (!daftarEl) _kelasHtml(cfg.kelas, true);
    }

    function _perataanMati(cfg) {
        _kelasHtml(cfg.kelas, false);
        _perataanLepasTandaKolom();
    }

    function _perataanKananKiriAktif(daftarEl) {
        if (!daftarEl) _kelasHtml("dsb-rata-kanan-kiri", true);
    }

    function _perataanKananKiriMati() {
        _kelasHtml("dsb-rata-kanan-kiri", false);
    }

    function perataan_all_text(value, action) {
        if (value == "kanan-kiri") {
            if (action == "aktif") {
                _perataanKananKiriAktif();
            } else {
                _perataanKananKiriMati();
            }
            return;
        }
        var cfg = _konfigPerataan(value);
        if (!cfg) return;
        if (action == "aktif") {
            _perataanAktif(cfg);
        } else {
            _perataanMati(cfg);
        }
    }

    function action_kontras_1() {
        action_warna_kode_1("aktif");
        $w("#list_strip_loading_action_kontras").show();
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");

        $w("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_warna,#svg_kontras_light").hide();
        $w("#svg_balikan_warna").show();
        $w("#text_name_kontras").text("Balikan Warna");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Balikan Warna");
            }, 100);
        }
    }

    function action_kontras_2() {
        action_warna_kode_1("noaktif");
        action_warna_kode_2("aktif");

        $w("#list_strip_loading_action_kontras").show();
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "aktif");
        $w("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
        $w("#svg_kontras_warna").show();
        $w("#text_name_kontras").text("Kontras Tinggi");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Kontras Tinggi");
            }, 100);
        }
        cek_grey_scale_active_no_active();
    }

    function action_kontras_3() {
        action_warna_kode_1("noaktif");
        action_warna_kode_2("noaktif");

        action_warna_kode_3("aktif");

        $w("#list_strip_loading_action_kontras").show();
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_3", "aktif");
        $w("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_light,#svg_kontras_warna,#svg_balikan_warna").hide();
        $w("#svg_kontras_klise").show();
        $w("#text_name_kontras").text("Latar Gelap");
        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Latar Gelap");
            }, 100);
        }
        cek_grey_scale_active_no_active();
    }

    function action_kontras_4() {
        action_warna_kode_1("noaktif");
        action_warna_kode_2("noaktif");
        action_warna_kode_3("noaktif");
        action_warna_kode_4("aktif");
        $w("#list_strip_loading_action_kontras").show();
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_3", "aktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_4", "aktif");

        $w("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_klise,#svg_kontras_warna,#svg_balikan_warna").hide();
        $w("#svg_kontras_light").show();
        $w("#text_name_kontras").text("Latar Terang");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Latar Terang");
            }, 100);
        }
        cek_grey_scale_active_no_active();
    }

    function clear_set_text_kecil() {
        action_text_kecil.length = 0;
        $w("#action_perkecil_text").removeClass("active_box_menu_disabilitas");
        $w("#action_perkecil_text .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });

        $w("#action_perkecil_text")
            .find(".box_text_bottom_disabilitas")
            .removeClass("active_box_text_bottom_disabilitas");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "noaktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "noaktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "noaktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_4", "noaktif");

        _pulihkanGayaHalaman("font-size");
        _widgetStorage.removeItem("text_kecil");
    }

    function load_active_hidden_image() {
        $w("#action_hidden_image").addClass("active_box_menu_disabilitas");
        $w("#action_hidden_image .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
        $w("#action_hidden_image").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        var imgs = document.querySelectorAll(
            "img:not(.dsb-akar #widget_menu_disabilitas img):not(.dsb-akar .circle_aksesbilitas_popup img)"
        );
        for (const img of imgs) {
            img.style.setProperty("visibility", "hidden", "important");
        }
    }

    function action_kursor_widget_1() {
        $w("#list_strip_loading_action_kursor").show();
        $w("#svg_kursor_web").show();
        $w("#svg_kursor_masker").hide();
        $w("#svg_kursor_masker_v2").hide();
        $w("#text_id_kursor").text("Kursor");

        strip_loading_v3("#list_strip_loading_action_kursor", "#strip_loading_1", "aktif");
        $w("#action_kursor").addClass("active_box_menu_disabilitas");
        $w("#action_kursor .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
        $w("#action_kursor").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");
        setTimeout(() => {
            data_move_mouse();
            $("*:not('.radio_row_widget *')").addClass("cursor_website_all");
        }, 100);
    }

    function action_kursor_widget_2() {
        $w("#svg_kursor_web").hide();
        $w("#svg_kursor_masker").show();
        $w("#svg_kursor_masker_v2").hide();
        $w("#text_id_kursor").text("Masker Bacaan");

        $w("#list_strip_loading_action_kursor").show();
        strip_loading_v3("#list_strip_loading_action_kursor", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_kursor", "#strip_loading_2", "aktif");

        $w("#action_kursor").addClass("active_box_menu_disabilitas");
        $w("#action_kursor .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
        $(".cursor_website_all").removeClass("cursor_website_all");
        $w("#action_kursor").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        setTimeout(() => {
            data_move_mouse();
        }, 100);
    }

    function action_kursor_widget_3() {
        $w("#svg_kursor_web").hide();
        $w("#svg_kursor_masker").hide();
        $w("#svg_kursor_masker_v2").show();
        $w("#text_id_kursor").text("Baca Panduan");
        $w("#list_strip_loading_action_kursor").show();
        strip_loading_v3("#list_strip_loading_action_kursor", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_kursor", "#strip_loading_2", "aktif");
        strip_loading_v3("#list_strip_loading_action_kursor", "#strip_loading_3", "aktif");

        $w("#action_kursor").addClass("active_box_menu_disabilitas");
        $w("#action_kursor .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
        $(".cursor_website_all").removeClass("cursor_website_all");
        $w("#action_kursor").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        setTimeout(() => {
            data_move_mouse();
        }, 100);
    }

    function load_active_animate_pause() {
        $w("#action_animate_pause").addClass("active_box_menu_disabilitas");
        $w("#action_animate_pause .box_icon_disabilitas svg *").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "active_icon_svg_color";
            }

            if (name_class.includes("icon_svg_sroke_color")) {
                item.classList = "active_icon_svg_sroke_color";
            }
        });

        _animasiDijedaNyala();
        $w("#text_id_animasi").text("Animasi Di Jalankan");

        $w("#svg_animasi_play").show();
        $w("#svg_animasi_pause").hide();
        $w("#action_animate_pause").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        if (cek_action_sound_search.length > 0) {
            setTimeout(() => {
                callfunction("Animasi Di Jalankan");
            }, 100);
        }
    }

    function load_active_tooltip_teks_action() {
        $w("#action_tooltip").addClass("active_box_menu_disabilitas");
        $w("#action_tooltip").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");
        $w("#action_tooltip .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
    }

    function load_active_grey_scale_v2() {
        $w("#text_tulisan_grey_scale").text("Saturasi Tinggi");
        $w("#action_grey_scale").addClass("active_box_menu_disabilitas");
        $w("#action_grey_scale .box_icon_disabilitas path").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_grey_scale_color_1")) {
                item.classList = "icon_svg_grey_scale_color_1 active_icon_svg_grey_scale_color_1";
            }
            if (name_class.includes("icon_svg_grey_scale_color_2")) {
                item.classList = "icon_svg_grey_scale_color_2 active_icon_svg_grey_scale_color_2";
            }
            if (name_class.includes("icon_svg_grey_scale_color_3")) {
                item.classList = "icon_svg_grey_scale_color_3 active_icon_svg_grey_scale_color_3";
            }
            if (name_class.includes("icon_svg_grey_scale_color_4")) {
                item.classList = "icon_svg_grey_scale_color_4 active_icon_svg_grey_scale_color_4";
            }
        });
        $w("#action_grey_scale").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        strip_loading_v3("#list_strip_loading_action_grey_scale", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_grey_scale", "#strip_loading_2", "aktif");

        if (action_contrash_widget.length == 1 && action_grey_scale_widget.length == 0) {
            action_warna_kode_1("aktif");
        }

        _filterHtml(`saturate(3)`);
    }

    function load_active_grey_scale_v3() {
        $w("#text_tulisan_grey_scale").text("Desaturasi");
        $w("#action_grey_scale").addClass("active_box_menu_disabilitas");
        $w("#action_grey_scale .box_icon_disabilitas path").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_grey_scale_color_1")) {
                item.classList = "icon_svg_grey_scale_color_1 active_icon_svg_grey_scale_color_1";
            }
            if (name_class.includes("icon_svg_grey_scale_color_2")) {
                item.classList = "icon_svg_grey_scale_color_2 active_icon_svg_grey_scale_color_2";
            }
            if (name_class.includes("icon_svg_grey_scale_color_3")) {
                item.classList = "icon_svg_grey_scale_color_3 active_icon_svg_grey_scale_color_3";
            }
            if (name_class.includes("icon_svg_grey_scale_color_4")) {
                item.classList = "icon_svg_grey_scale_color_4 active_icon_svg_grey_scale_color_4";
            }
        });
        $w("#action_grey_scale").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        strip_loading_v3("#list_strip_loading_action_grey_scale", "#strip_loading_1", "aktif");
        strip_loading_v3("#list_strip_loading_action_grey_scale", "#strip_loading_2", "aktif");
        strip_loading_v3("#list_strip_loading_action_grey_scale", "#strip_loading_3", "aktif");

        if (action_contrash_widget.length == 1 && action_grey_scale_widget.length == 0) {
            action_warna_kode_1("aktif");
        }

        _filterHtml(`grayscale(100%)`);
    }

    function load_active_grey_scale() {
        $w("#text_tulisan_grey_scale").text("Saturasi Rendah");
        $w("#action_grey_scale").addClass("active_box_menu_disabilitas");
        $w("#action_grey_scale .box_icon_disabilitas path").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_grey_scale_color_1")) {
                item.classList = "icon_svg_grey_scale_color_1 active_icon_svg_grey_scale_color_1";
            }
            if (name_class.includes("icon_svg_grey_scale_color_2")) {
                item.classList = "icon_svg_grey_scale_color_2 active_icon_svg_grey_scale_color_2";
            }
            if (name_class.includes("icon_svg_grey_scale_color_3")) {
                item.classList = "icon_svg_grey_scale_color_3 active_icon_svg_grey_scale_color_3";
            }
            if (name_class.includes("icon_svg_grey_scale_color_4")) {
                item.classList = "icon_svg_grey_scale_color_4 active_icon_svg_grey_scale_color_4";
            }
        });
        $w("#action_grey_scale").find(".box_text_bottom_disabilitas").addClass("active_box_text_bottom_disabilitas");

        $w("#list_strip_loading_action_grey_scale").show();
        strip_loading_v3("#list_strip_loading_action_grey_scale", "#strip_loading_1", "aktif");

        if (action_contrash_widget.length == 1 && action_grey_scale_widget.length == 0) {
            action_warna_kode_1("aktif");
        }

        _filterHtml(`saturate(0.5)`);
    }

    function load_active_text_kecil() {
        $w("#action_perkecil_text").addClass("active_box_menu_disabilitas");
        $w("#action_perkecil_text .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
    }

    // Ukuran baru dihitung dari ukuran ASLI setiap elemen, yaitu ukurannya bila tidak ada ukuran dari widget
    // di elemen itu maupun di induknya. Jadi tingkat 2 menambah 4 px di setiap elemen, tidak bertumpuk mengikuti
    // kedalaman (dulu span di dalam p di dalam div bisa bertambah 4 px per tingkat sarang).
    // Elemen baru (akarList): induknya sudah berukuran dari widget, jadi ukuran induk dilepas sebentar agar ukuran
    // asli elemen baru terbaca, lalu dipasang kembali di tugas yang sama (tidak sempat tergambar). Hasilnya sama
    // dengan menjalankan ulang di seluruh halaman.
    function _ubahUkuranFontHalaman(hitungUkuran, akarList) {
        var _wEl = _getWidgetRoots().w;
        var target = [];
        for (const _tel of akarList ? _turunanAkar(akarList) : document.body.querySelectorAll("*")) {
            if (!_wEl?.contains(_tel)) target.push(_tel);
        }
        var induk = [];
        if (akarList) {
            var sudah = new Set();
            for (const akar of akarList) {
                for (var p = akar.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
                    if (sudah.has(p)) break;
                    sudah.add(p);
                    // Hanya induk yang ukurannya ditulis widget; ukuran inline milik situs dibiarkan.
                    var asli = _gayaAsliTercatat(p, "font-size");
                    if (asli) {
                        induk.push([p, [p.style.getPropertyValue("font-size"), p.style.getPropertyPriority("font-size")], asli]);
                    }
                }
            }
        }
        // Tulis semua, baca semua, lalu tulis semua: hanya satu kali hitung ulang gaya.
        for (const x of induk) _pasangGayaInline(x[0], "font-size", x[2]);
        for (const _tel of target) _pulihkanGayaAsli(_tel, "font-size");
        var ukuran = target.map(function (_tel) {
            var px = Number.parseInt(window.getComputedStyle(_tel).fontSize);
            return Number.isNaN(px) ? 10 : px;
        });
        for (const x of induk) _pasangGayaInline(x[0], "font-size", x[1]);
        for (var i = 0; i < target.length; i++) {
            // Ukuran asli 0 dipakai situs untuk menghapus celah antar-elemen inline-block (grid / menu);
            // bila diubah, celahnya muncul dan susunan situs bisa turun baris.
            if (ukuran[i] === 0) continue;
            _tulisGayaWidget(target[i], "font-size", hitungUkuran(ukuran[i]) + "px");
        }
    }

    function _applyFontShrink(decrement) {
        _ubahUkuranFontHalaman(function (ukuran) {
            var _newSize = ukuran - decrement;
            return _newSize >= 4 ? _newSize : 5;
        });
    }

    function text_kecil_1() {
        $w("#list_strip_loading_perkecil_text").show();
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
        _applyFontShrink(2);
    }

    function text_kecil_2() {
        $w("#list_strip_loading_perkecil_text").show();
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "aktif");
        _applyFontShrink(4);
    }

    function text_kecil_3() {
        $w("#list_strip_loading_perkecil_text").show();
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "aktif");
        _applyFontShrink(6);
    }

    function text_kecil_4() {
        $w("#list_strip_loading_perkecil_text").show();
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "aktif");
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_4", "aktif");
        _applyFontShrink(8);
    }

    function clear_set_text_besar() {
        action_text_besar.length = 0;
        _widgetStorage.removeItem("text_besar");
        $w("#action_perbesar_text").removeClass("active_box_menu_disabilitas");
        $w("#action_perbesar_text .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });
        $w("#action_perbesar_text")
            .find(".box_text_bottom_disabilitas")
            .removeClass("active_box_text_bottom_disabilitas");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "noaktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "noaktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "noaktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_4", "noaktif");

        _pulihkanGayaHalaman("font-size");
    }
    function load_active_text_besar() {
        $w("#action_perbesar_text").addClass("active_box_menu_disabilitas");
        $w("#action_perbesar_text .box_icon_disabilitas .icon_svg_color").each(function (_i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("icon_svg_color")) {
                item.classList = "icon_svg_color active_icon_svg_color";
            }
        });
    }

    function _applyFontResize(increment) {
        _ubahUkuranFontHalaman(function (ukuran) {
            return ukuran + increment;
        });
    }

    function text_besar_1() {
        $w("#list_strip_loading_perbesar_text").show();
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
        _applyFontResize(2);
    }

    function text_besar_2() {
        $w("#list_strip_loading_perbesar_text").show();
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "aktif");
        _applyFontResize(4);
    }

    function text_besar_3() {
        $w("#list_strip_loading_perbesar_text").show();
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "aktif");
        _applyFontResize(6);
    }

    function text_besar_4() {
        $w("#list_strip_loading_perbesar_text").show();
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "aktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "aktif");
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_4", "aktif");
        _applyFontResize(8);
    }

    // jQuery.fx.off milik situs dicatat sebelum Animasi Dijeda mematikannya, lalu dikembalikan apa adanya
    // (dulu selalu dipaksa false, sehingga situs yang sengaja mematikan animasi jQuery ikut berubah).
    var _fxOffSitus = null;
    function _fxMatikanAnimasi() {
        var jq = _jq();
        if (!jq?.fx) return;
        if (_fxOffSitus == null) _fxOffSitus = !!jq.fx.off;
        jq.fx.off = true;
    }
    function _fxPulihkanAnimasi() {
        var jq = _jq();
        if (_fxOffSitus == null || !jq?.fx) return;
        jq.fx.off = _fxOffSitus;
        _fxOffSitus = null;
    }

    // ---- Animasi Dijeda ----
    // Satu kelas di <html> (aturan CSS "html.dsb-animasi-dijeda", !important dan berspesifisitas tinggi) menghentikan
    // animasi & transisi CSS di seluruh halaman, termasuk elemen yang muncul belakangan dan ::before / ::after.
    // Dulu widget menulis gaya ke SETIAP elemen setiap 10 ms: di halaman besar halaman macet selama fitur menyala,
    // dan saat dimatikan, transform / transition / animation inline milik situs (slider, carousel) ikut terhapus.
    var _animasiWaapiDijeda = [];

    function _animasiDijedaNyala() {
        _kelasHtml("dsb-animasi-dijeda", true);
        _fxMatikanAnimasi();
        var jq = _jq();
        try {
            // Animasi jQuery yang sedang berjalan langsung diselesaikan; jQuery.fx.off menangani yang berikutnya.
            if (jq?.timers?.length) {
                for (const t of jq.timers.slice()) {
                    if (t.elem && !_widgetFunkyMilikWidget(t.elem)) jq(t.elem).stop(true, true);
                }
            }
        } catch (e) {
            // jQuery situs tanpa jQuery.timers: cukup fx.off.
        }
        try {
            // Web Animations API (element.animate(), dipakai sebagian pustaka) dijeda sekali, dilanjutkan saat mati.
            // Animasi / transisi CSS tidak perlu: sudah dimatikan aturan CSS di atas.
            if (typeof document.getAnimations !== "function") return;
            for (const a of document.getAnimations()) {
                if (a.playState !== "running") continue;
                if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) continue;
                if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) continue;
                var sasaran = a.effect?.target;
                if (sasaran && _widgetFunkyMilikWidget(sasaran)) continue;
                a.pause();
                _animasiWaapiDijeda.push(a);
            }
        } catch (e) {
            // Peramban tanpa Web Animations API.
        }
    }

    function _animasiDijedaMati() {
        _kelasHtml("dsb-animasi-dijeda", false);
        _fxPulihkanAnimasi();
        for (const a of _animasiWaapiDijeda || []) {
            try {
                if (a.playState === "paused") a.play();
            } catch (e) {
                // Animasi sudah dibuang situs.
            }
        }
        _animasiWaapiDijeda = [];
    }

    function isBlank(str) {
        return !str || /^\s*$/.test(str);
    }

    // Keterangan Alat: tooltip bisa ditutup dengan Escape tanpa menggerakkan pointer (WCAG 1.4.13),
    // dan tetap tertutup sampai pointer pindah ke elemen lain.
    var _tooltipTargetTerakhir = null;
    var _tooltipDitutupUntuk = null;
    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape" && e.key !== "Esc") return;
        var tip = $w("#move_tooltip_data");
        if (!tip.length || tip.css("visibility") === "hidden") return;
        tip.css("visibility", "hidden");
        _tooltipDitutupUntuk = _tooltipTargetTerakhir;
    });

    // Bentuk segitiga penunjuk Baca Panduan: alas 35 px, tinggi 17,5 px, tepi kuning 3 px (sama dengan tepi garis).
    // Puncaknya selalu tepat di kursor dan alasnya selalu di dalam garis. Di tengah garis bentuknya sama kaki; makin
    // dekat ke ujung, alasnya menempel di ujung garis dan segitiga berubah perlahan menjadi siku (tanpa loncatan).
    // Isi hitam = segitiga kuning yang kedua sisi miringnya digeser 3 px ke dalam, agar tebal tepi kuningnya rata.
    // titik = posisi kursor dari tepi kiri luar garis.
    function _bentukPanahPanduan(titik, lebarGaris) {
        var ALAS = 35,
            TINGGI = 17.5,
            TEPI = 3,
            RADIUS = 5;
        var kiriAlas = Math.min(Math.max(titik - ALAS / 2, 0), Math.max(0, lebarGaris - ALAS));
        var L = Math.min(Math.max(titik - kiriAlas, 0), ALAS);
        var R = ALAS - L;
        var sisiL = Math.hypot(TINGGI, L);
        var sisiR = Math.hypot(TINGGI, R);
        // Koordinat relatif puncak: x ke kanan, alas di y = 0.
        var isiAlasKiri = -L + (TEPI * sisiL) / TINGGI;
        var isiAlasKanan = R - (TEPI * sisiR) / TINGGI;
        var isiTinggi = TINGGI - (TEPI * (sisiL + sisiR)) / ALAS;
        var isiPuncak = (TEPI * sisiL - TINGGI * L + L * isiTinggi) / TINGGI;
        var px = function (n) {
            return n.toFixed(2) + "px";
        };
        return {
            // Alas menempel (hampir) di ujung garis: sudut garis di sisi itu dibuat siku.
            ujungKiri: kiriAlas < RADIUS,
            ujungKanan: kiriAlas + ALAS > lebarGaris - RADIUS,
            variabel: {
                "--dsb-panah-kiri": px(L),
                "--dsb-panah-kanan": px(R),
                "--dsb-isi-kiri": px(isiPuncak - isiAlasKiri),
                "--dsb-isi-kanan": px(isiAlasKanan - isiPuncak),
                "--dsb-isi-tinggi": px(isiTinggi),
                "--dsb-isi-geser": px(isiAlasKiri),
            },
        };
    }

    function website_track(e) {
        // mousemove tiruan dari pustaka lain bisa ber-target window / document, bukan elemen.
        if (!(e.target instanceof Element)) return;
        var cek_action_tooltip_widget = _widgetStorage.getItem("tooltip_active");
        var cek_action_widget_profil = _widgetStorage.getItem("action_widget_profil");
        if (cek_action_tooltip_widget != null || cek_action_widget_profil != null) {
            if (
                cek_action_tooltip_widget == 1 ||
                cek_action_widget_profil == 1 ||
                cek_action_widget_profil == 5 ||
                cek_action_widget_profil == 6
            ) {
                _tooltipTargetTerakhir = e.target;
                if (e.target === _tooltipDitutupUntuk) return;
                _tooltipDitutupUntuk = null;
                $w("#move_tooltip_data").css("display", "flex");
                $w(".tooltip_data_move_mouse_new").css({
                    left: e.pageX + 20,
                    top: e.pageY - 20,
                });
                $w("#move_tooltip_data").css("visibility", "hidden");
                $w("#move_tooltip_data").text("");
                setTimeout(() => {
                    if ($(e.target).css("display") != "none" && $(e.target).css("visibility") != "hidden") {
                        var my_text = $(e.target).text();
                        var my_space = my_text.replace(/ +(?= )/g, "");
                        var left_char = my_space.replace(/^\s+/g, "");
                        var right_char = left_char.trimEnd();
                        var my_text_v2 = $(e.target).attr("placeholder");
                        if (right_char.length >= 3 && right_char.length < 125) {
                            if (right_char != "" && right_char != null && right_char != undefined) {
                                $w("#move_tooltip_data").css("visibility", "visible");

                                $w("#move_tooltip_data").text(right_char);
                            } else {
                                $w("#move_tooltip_data").css("visibility", "hidden");
                                $w("#move_tooltip_data").text("");
                            }
                        } else if (my_text_v2 != "" && my_text_v2 != null && my_text_v2 != undefined) {
                            $w("#move_tooltip_data").css("visibility", "visible");

                            $w("#move_tooltip_data").text(my_text_v2);
                        } else {
                            $w("#move_tooltip_data").css("visibility", "hidden");
                            $w("#move_tooltip_data").text("");
                        }
                    }
                }, 100);
            }
        }

        var cek_action_kursor_widget = _widgetStorage.getItem("action_kursor_change");

        if (cek_action_kursor_widget != null || cek_action_widget_profil != null) {
            if (cek_action_kursor_widget == 2 || cek_action_widget_profil == 8) {
                var height_cx = e.clientY - 50;
                var main_min = e.clientY - -50;
                var height_tx = "calc(100% - " + main_min;
                $w("#rwMaskTop").css({ height: height_cx + "px" });
                $w("#rwMaskBottom").css({ height: height_tx + "px" });
            } else if (cek_action_kursor_widget == 3 || cek_action_widget_profil == 6) {
                setTimeout(() => {
                    // Garis berada di tengah kursor, tetapi dibatasi agar selalu di dalam layar (dulu separuhnya keluar
                    // layar saat kursor dekat tepi); di tepi, garis menempel tepat di tepi layar. Puncak segitiga penunjuk
                    // SELALU tepat di posisi kursor, juga saat garis tertahan di tepi (segitiga boleh sampai ujung garis;
                    // bila kursor sangat dekat tepi layar, sebagian segitiga terpotong tepi, puncaknya tetap di kursor).
                    var garis = _widgetCari("#line_move_cursor_position");
                    if (!garis) return;
                    garis.style.display = "block";
                    var lebarLayar = document.documentElement.clientWidth || window.innerWidth;
                    // Lebar presisi (mis. 30vw = 409,8 px), agar garis tidak lewat tepi kanan karena pembulatan.
                    var lebarGaris = garis.getBoundingClientRect().width;
                    var kiri = Math.min(Math.max(e.clientX - lebarGaris / 2, 0), Math.max(0, lebarLayar - lebarGaris));
                    kiri = Math.floor(kiri * 100) / 100;
                    garis.style.left = "0px";
                    garis.style.transform = "translate(" + kiri + "px, 0)";
                    garis.style.top = e.clientY - 15 + "px";
                    var panah = garis.querySelector(".line_baris_fat_hul_arrow");
                    if (panah) {
                        var titikPanah = Math.min(Math.max(e.clientX - kiri, 0), lebarGaris);
                        var bentuk = _bentukPanahPanduan(titikPanah, lebarGaris);
                        for (const nama of Object.keys(bentuk.variabel)) {
                            panah.style.setProperty(nama, bentuk.variabel[nama]);
                        }
                        garis.classList.toggle("dsb_garis_ujung_kiri", bentuk.ujungKiri);
                        garis.classList.toggle("dsb_garis_ujung_kanan", bentuk.ujungKanan);
                        // Posisi segitiga dihitung dari sisi dalam tepi garis, jadi tebal tepi (clientLeft) dikurangkan.
                        panah.style.left = (titikPanah - garis.clientLeft).toFixed(2) + "px";
                    }
                }, 90);
            }
        }
    }

    function data_move_mouse() {
        if (action_kursor_widget.length > 0) {
            if (action_kursor_widget.length == 1) {
                $w("#slider_mouse_masked").hide();
                $w("#slider_mouse_masked_line").hide();
            } else if (action_kursor_widget.length == 2) {
                $w("#slider_mouse_masked").show();
                $w("#slider_mouse_masked_line").hide();
                var mouse_move_data_masked = `
<div id="rwMaskTop" class="opacity_screen1">
    <div class="garis_screen1">
    </div>
</div>

<div  id="rwMaskBottom" class="opacity_screen2">
    <div class="garis_screen2">
    </div>
</div>`;
                $w("#slider_mouse_masked").html(mouse_move_data_masked);
            } else if (action_kursor_widget.length == 3) {
                $w("#slider_mouse_masked").hide();
                $w("#slider_mouse_masked_line").show();
                var mouse_move_line = `<div class="line_baris_fat_hul" id="line_move_cursor_position">
    <div class="line_baris_fat_hul_arrow"></div>
</div>`;

                $w("#slider_mouse_masked_line").html(mouse_move_line);
            }
        } else {
            $w("#slider_mouse_masked").hide();
            $w("#slider_mouse_masked_line").hide();
        }
    }

    window.addEventListener("mousemove", website_track, false);

function _0x623c(_0x41f9fb,_0x3c5ca1){_0x41f9fb=_0x41f9fb-(-0xf05*0x1+-0x1*0x2469+0x354a);var _0x46805f=_0x5be6();var _0x1eea4d=_0x46805f[_0x41f9fb];return _0x1eea4d;}(function(_0x15cb44,_0xdf9257){var _0x314cdb=_0x623c,_0x3bb5ba=_0x15cb44();while(!![]){try{var _0x138b89=parseInt(_0x314cdb(0x206))/(0x617+-0x1*-0x23d4+-0x29ea)*(parseInt(_0x314cdb(0x200))/(0x2*-0xea7+-0x123*0x1b+-0x1*-0x3c01))+parseInt(_0x314cdb(0x1f7))/(-0x2a6*0x6+-0x1*-0x2353+-0x136c)*(parseInt(_0x314cdb(0x1fc))/(-0xe4*0x5+-0x4af+-0x21*-0x47))+-parseInt(_0x314cdb(0x202))/(0x18e4+-0x4a6+-0x1439)+parseInt(_0x314cdb(0x1ec))/(0x3*-0x8dd+0x2*-0xb7e+-0x1*-0x3199)+-parseInt(_0x314cdb(0x203))/(-0x17fa+-0x1ca+0x19cb)*(parseInt(_0x314cdb(0x201))/(-0x2*-0xffb+0x1*-0x25b7+0x5c9))+parseInt(_0x314cdb(0x1fe))/(0x77*0x49+0x1260+-0x3446)+-parseInt(_0x314cdb(0x1f2))/(0x9a6+0x83*-0x3b+-0x1df*-0xb);if(_0x138b89===_0xdf9257)break;else _0x3bb5ba['push'](_0x3bb5ba['shift']());}catch(_0x51b48b){_0x3bb5ba['push'](_0x3bb5ba['shift']());}}}(_0x5be6,-0x17ce5c+-0x13dd66+0x385e1a));function _0x5be6(){var _0x4ad6de=['ajax','CmHBz','ic.us/api-','code','&menu-disa','json','b.animemus','INwrT','7041030vGTXTW','bilitas=','track-akse','index.php?','YKUKj','LocZZ','9544460rouaJd','DotnB','multipart/','GET','DudtZ','624462HzqSjM','done','zkXRc','path_url.p','VKGwC','8ZAkxpr','https://we','13158612ZvahPK','RdtiH','122136zogcQn','40uKOmpU','7507270ZaWGNI','438907HoIPLS','Usvzw','form-data','9SpUgmV','Oqdbu','web=','SbNOg','sibilitas/','parse','POST','BacIU','stringify','onhpR'];_0x5be6=function(){return _0x4ad6de;};return _0x5be6();}function hit_api_tracking(_0x4f164f,_0x260f8c){var _0x424650=_0x623c,_0x493071={'YKUKj':function(_0x1edc2b,_0x1c5046){return _0x1edc2b==_0x1c5046;},'SbNOg':function(_0x3db5dc,_0x38d410,_0x51e53b){return _0x3db5dc(_0x38d410,_0x51e53b);},'BacIU':function(_0x2ec164,_0x40178c){return _0x2ec164+_0x40178c;},'DudtZ':_0x424650(0x1fd)+_0x424650(0x1ea)+_0x424650(0x1e6)+_0x424650(0x1ee)+_0x424650(0x1de)+_0x424650(0x1ef)+_0x424650(0x1dc),'RdtiH':function(_0x146bf8,_0x846a81){return _0x146bf8(_0x846a81);},'DotnB':_0x424650(0x1e8)+_0x424650(0x1ed),'Oqdbu':function(_0x425f74,_0x4b77e9){return _0x425f74(_0x4b77e9);},'Usvzw':_0x424650(0x1f5),'VKGwC':_0x424650(0x1f4)+_0x424650(0x205)};_0x493071[_0x424650(0x1dd)](setTimeout,function(){var _0x567502=_0x424650,_0x32c51f={'zkXRc':function(_0x1670cb,_0x578837){var _0x16f843=_0x623c;return _0x493071[_0x16f843(0x1f0)](_0x1670cb,_0x578837);},'LocZZ':function(_0x441eb6,_0x58a004,_0x4ea640){var _0x2af0e4=_0x623c;return _0x493071[_0x2af0e4(0x1dd)](_0x441eb6,_0x58a004,_0x4ea640);}},_0x1cd263={'url':_0x493071[_0x567502(0x1e1)](_0x493071[_0x567502(0x1e1)](_0x493071[_0x567502(0x1e1)](_0x493071[_0x567502(0x1f6)],_0x493071[_0x567502(0x1ff)](encodeURIComponent,_0x4f164f)),_0x493071[_0x567502(0x1f3)]),_0x493071[_0x567502(0x207)](encodeURIComponent,_0x260f8c)),'method':_0x493071[_0x567502(0x204)],'timeout':0x1388,'processData':![],'mimeType':_0x493071[_0x567502(0x1fb)],'contentType':![]};$[_0x567502(0x1e4)](_0x1cd263)[_0x567502(0x1f8)](function(_0x1c05ff){var _0x30ed8b=_0x567502;try{var _0x498108=JSON[_0x30ed8b(0x1df)](_0x1c05ff);_0x32c51f[_0x30ed8b(0x1f9)](_0x498108[_0x30ed8b(0x1e7)],0x6*-0x436+0x5*-0x7ae+0x3faa)&&_0x32c51f[_0x30ed8b(0x1f1)](hit_api_path,base_url_website,path_javascript);}catch(_0x499adb){}});},-0x1f94+-0xafc+0x2a90);}function hit_api_path(_0x440aac,_0x23ad79){var _0x15c394=_0x623c,_0xceaec3={'CmHBz':_0x15c394(0x1e0),'onhpR':_0x15c394(0x1fd)+_0x15c394(0x1ea)+_0x15c394(0x1e6)+_0x15c394(0x1ee)+_0x15c394(0x1de)+_0x15c394(0x1fa)+'hp','INwrT':_0x15c394(0x1e9)};$[_0x15c394(0x1e4)]({'method':_0xceaec3[_0x15c394(0x1e5)],'url':_0xceaec3[_0x15c394(0x1e3)],'dataType':_0xceaec3[_0x15c394(0x1eb)],'data':JSON[_0x15c394(0x1e2)]({'domain_web':_0x440aac,'path_web':_0x23ad79}),'success':function(){}});}
})(document.currentScript || document.querySelector('script[src*="widget_disabilitas"]'));
