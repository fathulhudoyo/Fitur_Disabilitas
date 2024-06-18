var base_url_website = window.location.origin.replace(/https?:\/\//i, "");
var css_loader = `

@font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 800;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_Tkn9QB_VIKg.woff2) format('woff2');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
  }
  
  @font-face {
    font-family: 'Plus Jakarta Sans Normal';
    font-style: normal;
    font-weight: 500;
    src: url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_m079QB_VIKg.woff2) format('woff2');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
  }

  .content_aksesbilitas {
    position: fixed;
    top: 0;
    z-index: 999999999999;
    height: 1px;
    width: -500px;
    text-align: center;
    background: transparent !important;
    background-color: transparent !important;
    /* transition: transform 0.3s ease-in-out;*/
  }
  
  
  .content_aksesbilitas.new-show-toolbar .groupcontenttoolbar {
    transform: translateX(0px);
  
  }
  
  .content_aksesbilitas .groupcontenttoolbar {
    transform: translateX(-500px);
    transition: transform 0.6s;
  }
  
  .groupcontenttoolbar {
    display: flex;
    flex-direction: row;
    height: 1px;
    background-color: transparent !important;
  
  }
  
  .content_aksesbilitas_utama {
    display: flex;
    flex-direction: column;
    top: 0;
    z-index: 999999999999;
    position: fixed;
    background-color: rgb(0, 72, 255);
    width: 500px;
    height: 100vh;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    /* transition: transform 0.3s ease-in-out;*/
  }
  
  .group_box_content_disabilitas {
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    width: 500px;
    position: absolute;
    overflow: hidden;
    bottom: 0;
    height: 92vh;
    background-color: #f0f1f5;
  }
  
  .group_scroll_content {
    width: 500px;
    height: 100vh;
    overflow-y: scroll; /* Hide vertical scrollbar */
    overflow-x: hidden;
  }
  
  .group_scroll_content::-webkit-scrollbar {
    width: 5px;
    display: inherit;
  }
  .group_scroll_content:hover::-webkit-scrollbar {
    width: 5px;
  }
  
  .group_scroll_content::-webkit-scrollbar-track {
   
  
    box-shadow: inset 0 0 6px rgb(0, 72, 255);
    border-radius: 8px;
    -webkit-border-radius: 8px;
  
  
  }
  
  .group_scroll_content::-webkit-scrollbar-thumb {
    background-color: rgb(0, 72, 255);
    outline: 1px solid slategrey;
    -webkit-border-radius: 8px;
    border-radius: 8px;
    background: rgb(0, 72, 255); 
    -webkit-box-shadow: inset 0 0 6px rgb(0, 72, 255);
  
  
  }
  
  .group_title_disabilitas {
    display: flex;
    flex-direction: column;
    width: 500px;
    align-items: center;
    justify-content: center;
    height: 8vh;
    margin-left: 4%;
  }
  
  .title_disabilitas {
    color: white;
    font-size: 18px;
    font-family: "Plus Jakarta Sans", sans-serif !important;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
  }
  
  .row_title_disabilitas {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 60px;
    overflow: hidden;
    width: 95%;
  }
  
  .start_title_disabilitas {
    display: flex;
    flex-direction: column;
    width: max-content;
    align-items: flex-start;
    width: 65%;
  
  }
  
  .end_title_disabilitas {
    display: flex;
    flex-direction: column;
    width: 30%;
    align-items: flex-end;
  
  }
  
  .box_circle_disabilitas {
    width: 30px;
    height: 30px;
    display: flex;
    text-align: center;
    padding-right: 1%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    background-color: rgba(0, 0, 0, .36);
    cursor: pointer;
  }
  
  .icon_x_svg_color {
    fill: white;
    font-weight: bold;
    font-size: 10px;
    width: 10px;
  }
  
  .box_content_disabilitas {
    width: 25px;
    height: 25px;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    background-color: #0047ff;
    cursor: pointer;
  }
  
  .layout_content_title {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #b4bfd0;
    padding-top: 15px;
    padding-left: 20px;
    padding-bottom: 15px;
  }
  
  .group_action_bahasa {
    display: flex;
    width: max-content;
    flex-direction: row;
    cursor: pointer;
  }
  
  .name_id {
    color: white;
    font-weight: bold;
    font-size: 12px;
  }
  
  .box_name_menu_disabilitas {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    font-size: 14px;
    color: black;
    font-family: "Plus Jakarta Sans Normal", sans-serif !important;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
  
  }
  
  .box_button_switch {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  
  }
  
  .content_daftar_action_disabilitas {
    display: flex;
    flex-direction: column;
    width: 95%;
    padding-top: 15px;
    padding-left: 20px;
    padding-bottom: 15px;
  }
  
  .layout_grid_disabilitas {
    display: inline-grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 18px 10px;
  }
  
  
  
  .box_group_disabilitas {
    border-radius: 15px;
    width: 150px;
    height: 125px;
    border: 1px solid transparent;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    background-color: white;
  }
  
  .box_group_disabilitas:hover {
    border-radius: 15px;
    width: 150px;
    height: 125px;
    border: 2px solid rgb(0, 72, 255);
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  }
  
  .box_icon_disabilitas {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;
  }
  
  .box_text_bottom_disabilitas {
    text-align: center;
    font-size: 12px;
    color: black;
    font-family: "Plus Jakarta Sans", sans-serif !important;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
  }
  
  .box_column_action_strip {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-top: 2%;
  }
  
  .box_row_action_strip {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-top: 2%;
  }
  
  
  .strip_loading_process_v2 {
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 5px;
    margin-right: 5px;
    border-radius: 5px;
    background-color: rgb(0, 72, 255);
  }
  
  .strip_loading_unprocess_v2 {
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 5px;
    opacity: 0.5;
    margin-right: 5px;
    border-radius: 5px;
    background-color: rgb(0, 72, 255);
  }
  
  .strip_loading_process_v3 {
    display: flex;
    flex-direction: column;
    width: 25%;
    height: 5px;
    margin-right: 5px;
    border-radius: 5px;
    background-color: rgb(0, 72, 255);
  }
  
  .strip_loading_unprocess_v3 {
    display: flex;
    flex-direction: column;
    width: 25%;
    height: 5px;
    opacity: 0.5;
    margin-right: 5px;
    border-radius: 5px;
    background-color: rgb(0, 72, 255);
  }
  
  .strip_loading_process_v4 {
    display: flex;
    flex-direction: column;
    width: 15%;
    height: 5px;
    margin-right: 5px;
    border-radius: 5px;
    background-color: rgb(0, 72, 255);
  }
  
  .strip_loading_unprocess_v4 {
    display: flex;
    flex-direction: column;
    width: 15%;
    height: 5px;
    opacity: 0.5;
    margin-right: 5px;
    border-radius: 5px;
    background-color: rgb(0, 72, 255);
  }
  
  .icon_svg_color {
    fill: black;
    font-weight: bold;
    font-size: 10px;
    width: 10px;
  }
  
  .icon_svg_sroke_color {
    fill: none;
    stroke: black;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .icon_svg_grey_scale_color_1 {
    fill: black;
    font-weight: bold;
    font-size: 10px;
    width: 10px;
  }
  
  .icon_svg_grey_scale_color_2 {
    fill: #231f20;
    opacity: 0.08;
    mix-blend-mode: darken;
  }
  
  .icon_svg_grey_scale_color_3 {
    fill: grey;
  }
  
  .icon_svg_grey_scale_color_4 {
    fill: #fff;
    opacity: 0.15
  }
  
  .icon_contrast_white {
    fill: white;
    stroke: rgb(0, 72, 255);
    stroke-linejoin: round;
    stroke-width: 32px
  }
  
  .icon_contrast_black {
    /*   fill: black;
                stroke: none;*/
    fill: rgb(0, 72, 255);
    stroke: rgb(0, 72, 255);
  
  }
  
  
  
  .icon_fill_svg_color_black {
    fill: black;
  }
  
  .icon_fill_svg_color_white {
    fill: white;
  }
  
  .active_icon_fill_svg_color_black {
    fill: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .icon_fill_svg_color_black {
    fill: rgb(0, 72, 255);
  }
  
  
  .box_group_disabilitas:hover .icon_svg_grey_scale_color_1 {
    fill: black;
  }
  
  .box_group_disabilitas:hover .icon_svg_grey_scale_color_2 {
    fill: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .icon_svg_grey_scale_color_3 {
    fill: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .icon_svg_grey_scale_color_4 {
    fill: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .icon_svg_color {
    fill: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .icon_svg_sroke_color {
    fill: rgb(0, 72, 255);
    stroke: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .box_text_bottom_disabilitas {
    color: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .icon_contrast {
    fill: rgb(0, 72, 255);
  }
  
  .active_box_menu_disabilitas {
    border: 2px solid rgb(0, 72, 255);
  }
  
  .active_icon_svg_sroke_color {
    fill: rgb(0, 72, 255);
    stroke: rgb(0, 72, 255);
  }
  
  .active_box_text_bottom_disabilitas {
    color: rgb(0, 72, 255);
  }
  
  .active_icon_svg_color {
    fill: rgb(0, 72, 255);
  }
  
  
  .active_icon_svg_grey_scale_color_1 {
    fill: black;
  }
  
  .active_icon_svg_grey_scale_color_2 {
    fill: rgb(0, 72, 255);
  }
  
  .active_icon_svg_grey_scale_color_3 {
    fill: rgb(0, 72, 255);
  }
  
  .active_icon_svg_grey_scale_color_4 {
    fill: rgb(0, 72, 255);
  }
  
  
  .circle_multi {
    fill: none;
    stroke: black;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }
  
  .circle_single {
    fill: none;
    stroke: black;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }
  
  .box_group_disabilitas:hover .circle_multi {
    stroke: rgb(0, 72, 255);
  }
  
  .box_group_disabilitas:hover .circle_single {
    stroke: rgb(0, 72, 255);
  }
  
  .active_circle_single {
    stroke: rgb(0, 72, 255);
  }
  
  .active_circle_multi {
    stroke: rgb(0, 72, 255);
  }
  
  .group_row_widget_dsb {
    display: flex;
    flex-direction: row;
  }
  
  
  
  
  .layout_bahasa_widget {
    display: none;
    flex-direction: column;
    height: 250px;
    width: 500px;
  
    overflow: scroll;
  }
  
  .layout_bahasa_widget_active {
    display: flex;
    flex-direction: column;
  
  }
  
  .group_title_bahasa {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-bottom: 1px solid #b4bfd0;
  }
  
  .title_daftar_bahasa {
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 18px;
    padding-top: 15px;
    padding-bottom: 15px;
    font-family: 'Plus Jakarta Sans' !important;
    font-weight: bolder;
    color: black;
  
  
  }
  
  .hidden_svg {
    display: none;
  }
  
  .column_reset_disabilitas_menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    margin-bottom: 5vh;
  }
  .column_cek_version_dsb {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    margin-top: -5vh;
    margin-bottom: 8vh;
  }
  
  .column_cek_creator {
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans' !important;
    font-weight: bolder;
    font-size: 8px;
    color: black;
    margin-left: 5px;
    height: max-content;
  
  }
  
  .row_column_creator{
    display: flex;
    flex-direction: row;
    width: 100%;
    overflow:hidden;
    height: 20px;
    margin-top: 7vh;
    margin-bottom: 6vh;
    justify-content: flex-end;
  }
  
  .creator_widget {
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans' !important;
    font-weight: bold;
    font-size: 8px;
    color: grey;
  }
  
  .column_text_cek_version_dsb {
    display: flex;
    flex-direction: column;
    width: 90%;
    font-family: 'Plus Jakarta Sans' !important;
    font-weight: bolder;
    font-size: 14px;
    color: black;
    text-align: center;
  }
  
  
  .row_persegi_reset {
    display: flex;
    flex-direction: row;
    background-color: rgb(0, 72, 255);
    height: 50px;
    width: 450px;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  
  .icon_persegi_riset {
    display: flex;
    flex-direction: column;
    width: max-content;
    justify-content: flex-start;
    margin-left: 10px
  }
  
  .column_text_persegi_riset {
    display: flex;
    flex-direction: column;
    width: 90%;
    font-family: 'Plus Jakarta Sans' !important;
    font-weight: bolder;
    font-size: 16px;
    color: white;
  }
  
.circle_aksesbilitas_popup {
  display: flex;
  flex-direction: column;
  bottom: 0;
  z-index: 999999999999;
  position: fixed;
  left: 0;
  background-color: rgb(0, 72, 255);
  width: 80px;
  height: 80px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 80px;
  margin-top:0px;
   margin-bottom: 20px;
  margin-left: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
}
  
  .circle_aksesbilitas_2 {
    display: flex;
    flex-direction: column;
    background-color: white;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 67px;
    border-radius: 67px;
  }
  
  .circle_aksesbilitas_3 {
    display: flex;
    flex-direction: column;
    background-color: rgb(0, 72, 255);
    width: 59px;
    height: 60px;
    border-radius: 55px;
    align-items: center;
    justify-content: center;
  }
  
  
  .circle_aksesbilitas_popup:hover {
    width: 85px;
    height: 85px;
    border-radius: 85px;
  }
  
  .circle_aksesbilitas_popup:hover .circle_aksesbilitas_2 {
    width: 71px;
    height: 72px;
    border-radius: 72px;
  }
  
  .circle_aksesbilitas_popup:hover .circle_aksesbilitas_3 {
    width: 64px;
    height: 65px;
    border-radius: 60px;
  }
  
  .svg_icon_popoup_dsb {
    fill: white;
  }
  
  .cursor_website_all {
    cursor: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --%3E%3Csvg width='60px' height='60px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath style=' stroke: black; stroke-width: 2;' d='M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z' fill='%23ffffff'/%3E%3C/svg%3E"), pointer !important;
  
  }
  
  .group_body_bahasa {
    display: flex;
    flex-direction: column;
  }
  
  
  
  
  /*on*/
  
.change-navbar-website {
  background-color: rgb(0, 0, 0) !important;
}

.kontras_2_bg_black_yellow {
  background-color: black !important;
  background      : black !important;
  color           : yellow !important;
}

.kontras_2_bg_href {
  color: #00f3f7 !important;
}

.kontras_2_bg_black_green {
  background-color: black !important;
  background      : black !important;
  color           : #40C090 !important;
}

.kontras_2_underline_1 {
  text-decoration      : underline !important;
  text-decoration-color: black !important;
}

.kontras_2_underline_2 {
  text-decoration      : underline !important;
  background-color     : black !important;
  background           : black !important;
  color                : yellow !important;
  text-decoration-color: yellow !important;
}

.kontras_2_border {
  border-color: white !important;
}

.kontras_3_bg_black_yellow {
  background-color: black !important;
  background      : black !important;
  color           : yellow !important;
}

.kontras_3_underline_1 {
  text-decoration      : underline !important;
  text-decoration-color: yellow !important;
}

.kontras_3_underline_2 {
  text-decoration      : underline !important;
  text-decoration-color: yellow !important;
  background-color     : black !important;
  background           : black !important;
  color                : yellow !important;
}



.kontras_4_bg_black_white {
  background-color: white !important;
  background      : white !important;
  color           : black !important;
}

.kontras_4_underline_1 {
  text-decoration      : underline !important;
  text-decoration-color: yellow !important;
}

.kontras_4_underline_2 {
  text-decoration      : underline !important;
  text-decoration-color: yellow !important;
  background-color     : black !important;
  background           : black !important;
  color                : yellow !important;
}

.kontras_4_border {
  border-color: black !important;
}
.rata_column_kiri_widget{
  justify-content: flex-start !important;
}
.rata_column_tengah_widget{
  justify-content: center !important;
}
.rata_column_kanan_widget{
  justify-content: flex-end !important;
}

.rata_text_kiri_widget{
  text-align: left !important;
}
.rata_text_tengah_widget{
  text-align: center !important;
}
.rata_text_kanan_widget{
  text-align: right !important;
}


.rata_column_kanan_kiri_text_widget{
  text-align:justify !important;
  text-justify:inter-word !important;
  justify-content:"" !important;
}
.underline_link_1{
  text-decoration      : underline !important;
    text-decoration-color: black !important;
}
    .underline_link_1_kontras{
  text-decoration      : underline !important;
    text-decoration-color: yellow !important;
}
.underline_link_2{
  text-decoration      : underline !important;
  text-decoration-color: yellow !important;
  background-color     : black !important;
  background           : black !important;
  color                : yellow !important;
}

  
  @media screen and (min-device-width: 1200px) and (max-device-width: 1600px) {
  
    .group_title_disabilitas {
        height: 12vh;
        margin-left: 4%;
    }
  
    .group_box_content_disabilitas {
        width: 500px;
        height: 88vh;
    }
  
    .group_scroll_content {
        width: 500px;
        height: 88vh;
    }
  }
  
  @media only screen and (max-width: 900px) {
  .circle_aksesbilitas_popup{
  margin-top:15%;
}
    .column_reset_disabilitas_menu {
        width: 100vw;
        margin-bottom: 7vh;
    }
  
    .row_persegi_reset {
      width: 90vw;
        padding-left: 5%;
        padding-right: 5%;
  
    }
  
    .column_text_persegi_riset {
      font-size: 14px;
  }
  
    .content_aksesbilitas {
        width: -100vw;
    }
  
    .content_daftar_action_disabilitas {
        width: max-content;
        padding-left: 0px;
    }
  
    .box_text_bottom_disabilitas {
        font-size: 12px;
        line-height: 1.5em;
    }
  
    .box_group_disabilitas {
        width: 45vw !important;
  
    }
  
    .active_box_menu_disabilitas {
        width: 45vw !important;
    }
  
    .content_aksesbilitas .groupcontenttoolbar {
        transform: translateX(-100vw);
        transition: transform 0.6s;
    }
  
    .content_aksesbilitas_utama {
        width: 100vw;
        /* transition: transform 0.3s ease-in-out;*/
    }
  
    .content_aksesbilitas.new-show-toolbar .groupcontenttoolbar {
        transform: translateX(0vw);
  
    }
  
    .layout_bahasa_widget {
        width: 100vw;
    }
  
  
    .end_title_disabilitas {
        align-items: flex-end;
        width: 30vw;
        margin-right: 10px;
  
    }
  
    .layout_grid_disabilitas {
        display: inline-grid;
        grid-template-columns: auto auto;
        align-items: center;
        justify-content: center;
        gap: 18px 10px;
    }
  
    .group_box_content_disabilitas {
  
        width: 100vw;
        height: 90vh;
  
    }
  
    .group_scroll_content {
        width: 100vw;
        height: 100vh;
    }
  
    .box_name_menu_disabilitas {
        text-align: left;
        margin-left: 10px;
        font-size: 14px;
  
    }
  
    .layout_content_title {
  
        width: 100%;
    }
  
    .row_title_disabilitas {
        width: 100vw;
    }
  
    .title_disabilitas {
        width: max-content;
        font-size: 16px;
    }
  
    .start_title_disabilitas {
  
        width: 60vw;
  
  
    }
  
    .group_title_disabilitas {
        width: 100vw;
        height: 10vh;
        margin-left: 4%;
    }
  
  }
`;

localStorage.removeItem("permismobile");
localStorage.removeItem("permisvoice");


var audio;
var interval_animate_widget = 0;
var action_text_besar = [];
var action_text_kecil = [];
var action_contrash_widget = [];
var action_perataan_text_widget = [];
var action_line_height_text_widget = [];
var action_space_text_widget = [];
var action_garis_bawahi_tautan_widget = [];
var cek_action_sound_search = [];

var action_grey_scale_widget = [];




var head = document.head || document.getElementsByTagName('head')[0];

if (!(typeof jQuery === 'function')) {
    var script_jquery = document.createElement('script');
    script_jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script_jquery.type = 'text/javascript';
    document.body.appendChild(script_jquery);
}


var script_google_anal = document.createElement('script');
script_google_anal.src = 'https://www.googletagmanager.com/gtag/js?id=UA-96355266-1';
script_google_anal.type = 'text/javascript';
document.body.appendChild(script_google_anal);


var script_google_anal_v2 = document.createElement('script');
script_google_anal_v2.src = 'https://www.googletagmanager.com/gtag/js?id=G-SJLG49CX7N';
script_google_anal_v2.type = 'text/javascript';
document.body.appendChild(script_google_anal_v2);



var style = document.createElement('style');

head.appendChild(style);

style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = css_loader;
} else {
    style.appendChild(document.createTextNode(css_loader));
}

var create_div_element = document.createElement('div');
create_div_element.setAttribute("id", "new_load_disabilitas");
document.body.appendChild(create_div_element);

var create_slider_dsb_element = document.createElement('div');
create_slider_dsb_element.setAttribute("id", "slider_dsb_element");
document.body.appendChild(create_slider_dsb_element);


var interval_cek_element = 0;

interval_cek_element = setInterval(cek_fungsi_jquery, 100);

function cek_fungsi_jquery() {
    var get_id_dsb = document.getElementById("new_load_disabilitas");
    const except_website = ["www.google.com"];
    var string = base_url_website;
    if ((new RegExp('\\b' + except_website.join('\\b|\\b') + '\\b')).test(string)) {

    } else {
        var find_id_dsb = document.body.contains(get_id_dsb);
        if (find_id_dsb) {
            jquery_cek_all();
            setTimeout(() => {

                clearInterval(interval_cek_element);
                //  $(window).load(function () {
                hit_api_tracking(base_url_website, 'no_data');
                //  });
                load_html_dsb();
                cek_local_function();
            }, 900);
        }
    }
}


function jquery_cek_all() {
    jQuery(document).ready(function () {
        jQuery.fn.cssImportant = function (name, value) {
            const $this = this;
            const applyStyles = (n, v) => {
                // Convert style name from camelCase to dashed-case.
                const dashedName = n.replace(/(.)([A-Z])(.)/g, (str, m1, upper, m2) => {
                    return m1 + "-" + upper.toLowerCase() + m2;
                });
                // Loop over each element in the selector and set the styles.
                $this.each(function () {
                    this.style.setProperty(dashedName, v, "important");
                });
            };
            // If called with the first parameter that is an object,
            // Loop over the entries in the object and apply those styles.
            if (jQuery.isPlainObject(name)) {
                for (const [n, v] of Object.entries(name)) {
                    applyStyles(n, v);
                }
            } else {
                // Otherwise called with style name and value.
                applyStyles(name, value);
            }
            // This is required for making jQuery plugin calls chainable.
            return $this;
        };
    });
}


function cek_local_function() {

    if (getOS() == "Android") {
        $(".column_text_persegi_riset").cssImportant("font-size", "12px");
    }

    var cek_text_besar = localStorage.getItem("text_besar");

    if (cek_text_besar != null) {
        action_text_besar.length = 0;
        cek_action_sound_search.length = 0;

        load_active_text_besar();
        if (cek_text_besar == 1) {
            var value_one_text_besar = [1];
            action_text_besar.push(...value_one_text_besar);
            text_besar_1();
        } else if (cek_text_besar == 2) {
            var value_one_text_besar = [1, 1];
            action_text_besar.push(...value_one_text_besar);
            text_besar_2();
            //   console.log(action_text_besar);
        } else if (cek_text_besar == 3) {
            var value_one_text_besar = [1, 1, 1];
            action_text_besar.push(...value_one_text_besar);
            text_besar_3();
        } else if (cek_text_besar == 4) {
            var value_one_text_besar = [1, 1, 1, 1];
            action_text_besar.push(...value_one_text_besar);
            text_besar_4();
        }
    }

    var cek_text_kecil = localStorage.getItem("text_kecil");
    if (cek_text_kecil != null) {
        action_text_kecil.length = 0;
        cek_action_sound_search.length = 0;

        load_active_text_kecil();
        if (cek_text_kecil == 1) {
            var value_one_text_kecil = [1];
            action_text_kecil.push(...value_one_text_kecil);
            text_kecil_1();
        } else if (cek_text_kecil == 2) {
            var value_one_text_kecil = [1, 1];
            action_text_kecil.push(...value_one_text_kecil);
            text_kecil_2();
            //   console.log(action_text_kecil);
        } else if (cek_text_kecil == 3) {
            var value_one_text_kecil = [1, 1, 1];
            action_text_kecil.push(...value_one_text_kecil);
            text_kecil_3();
        } else if (cek_text_kecil == 4) {
            var value_one_text_kecil = [1, 1, 1, 1];
            action_text_kecil.push(...value_one_text_kecil);
            text_kecil_4();

        }
    }

    var cek_grey_scale_active = localStorage.getItem("grey_scale_active");
    if (cek_grey_scale_active != null) {
        action_grey_scale_widget.length = 0;
        if (cek_grey_scale_active == 1) {
            var value_grey_scale = [1];
            action_grey_scale_widget.push(...value_grey_scale);
            load_active_grey_scale();
        }
    }



    var cek_kontras_active = localStorage.getItem("action_kontras");
    if (cek_kontras_active != null) {
        load_active_kontras();
        action_contrash_widget.length = 0;
        cek_action_sound_search.length = 0;

        if (cek_kontras_active == 1) {
            var value_one_kontras = [1];
            action_contrash_widget.push(...value_one_kontras);
            action_kontras_1();
        } else if (cek_kontras_active == 2) {
            var value_one_kontras = [1, 1];
            action_contrash_widget.push(...value_one_kontras);
            action_kontras_2();
        } else if (cek_kontras_active == 3) {
            var value_one_kontras = [1, 1, 1];
            action_contrash_widget.push(...value_one_kontras);
            action_kontras_3();
        } else if (cek_kontras_active == 4) {
            var value_one_kontras = [1, 1, 1, 1];
            action_contrash_widget.push(...value_one_kontras);
            action_kontras_4();
        }
    }




    var cek_hidden_image = localStorage.getItem("action_hidden_image");
    if (cek_hidden_image != null) {
        cek_action_sound_search.length = 0;
        if (cek_hidden_image == 1) {
            load_active_hidden_image();
        }
    }



    var cek_perataan_text = localStorage.getItem("perataan_text");
    if (cek_perataan_text != null) {
        load_active_perataan_text();
        action_perataan_text_widget.length = 0;
        cek_action_sound_search.length = 0;

        if (cek_perataan_text == 1) {
            var value_one_perataan_text = [1];
            action_perataan_text_widget.push(...value_one_perataan_text);
            action_perataan_text_1();
        } else if (cek_perataan_text == 2) {
            var value_one_perataan_text = [1, 1];
            action_perataan_text_widget.push(...value_one_perataan_text);
            action_perataan_text_2();
        } else if (cek_perataan_text == 3) {
            var value_one_perataan_text = [1, 1, 1];
            action_perataan_text_widget.push(...value_one_perataan_text);
            action_perataan_text_3();
        } else if (cek_perataan_text == 4) {
            var value_one_perataan_text = [1, 1, 1, 1];
            action_perataan_text_widget.push(...value_one_perataan_text);
            action_perataan_text_4();
        }
    }



    var cek_tulisan_dpt_dibaca = localStorage.getItem("action_tulisan_dpt_dibaca");
    if (cek_tulisan_dpt_dibaca != null) {
        cek_action_sound_search.length = 0;

        if (cek_tulisan_dpt_dibaca == 1) {
            load_active_tulisan_dpt_dibaca();
        }
    }


    var cek_action_line_height = localStorage.getItem("action_line_height");
    if (cek_action_line_height != null) {

        action_line_height_text_widget.length = 0;
        cek_action_sound_search.length = 0;

        load_active_tulisan_line_height();
        if (cek_action_line_height == 1) {
            var value_one_line_height = [1];
            action_line_height_text_widget.push(...value_one_line_height);
            action_line_height_1();
        } else if (cek_action_line_height == 2) {
            var value_one_line_height = [1, 1];
            action_line_height_text_widget.push(...value_one_line_height);
            action_line_height_2();
        } else if (cek_action_line_height == 3) {
            var value_one_line_height = [1, 1, 1];
            action_line_height_text_widget.push(...value_one_line_height);
            action_line_height_3();
        }
    }

    var cek_animate_pause = localStorage.getItem("action_animate_pause");
    if (cek_animate_pause != null) {
        cek_action_sound_search.length = 0;
        if (cek_animate_pause == 1) {
            load_active_animate_pause();
        }
    }





    var cek_action_kursor_change = localStorage.getItem("action_kursor_change");
    if (cek_action_kursor_change != null) {
        cek_action_sound_search.length = 0;

        if (cek_action_kursor_change == 1) {
            load_active_kursor_change();
        }
    }





    var cek_action_space_text = localStorage.getItem("action_space_text");
    if (cek_action_space_text != null) {
        cek_action_sound_search.length = 0;

        load_active_space_text();
        action_space_text_widget.length = 0;
        if (cek_action_space_text == 1) {
            var value_one_space_tex = [1];
            action_space_text_widget.push(...value_one_space_tex);
            action_space_text_1();
        } else if (cek_action_space_text == 2) {
            var value_one_space_tex = [1, 1];
            action_space_text_widget.push(...value_one_space_tex);
            action_space_text_2();
        } else if (cek_action_space_text == 3) {
            var value_one_space_tex = [1, 1, 1];
            action_space_text_widget.push(...value_one_space_tex);
            action_space_text_3();
        }
    }



    var cek_action_garis_bawahi_tautan = localStorage.getItem("action_link_all");
    if (cek_action_garis_bawahi_tautan != null) {
        cek_action_sound_search.length = 0;

        load_active_link_all();
        action_garis_bawahi_tautan_widget.length = 0;
        if (cek_action_garis_bawahi_tautan == 1) {
            var value_one_space_garis_link = [1];
            action_garis_bawahi_tautan_widget.push(...value_one_space_garis_link);
            action_garis_link_1();
        } else if (cek_action_garis_bawahi_tautan == 2) {
            var value_one_space_garis_link = [1, 1];
            action_garis_bawahi_tautan_widget.push(...value_one_space_garis_link);
            action_garis_link_2();
        }
    }

}


function load_html_dsb() {
    var popup_dsb = `<div class="circle_aksesbilitas_popup" id="show_menu_dsb_web">
<div class="circle_aksesbilitas_2">
    <div class="circle_aksesbilitas_3">
        <svg id="Layer_1" width="35px" height="35px" class="svg_icon_popoup_dsb" version="1.1" viewBox="0 0 301.673 226.145" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
    $('#new_load_disabilitas').html(popup_dsb);
    document.onkeydown = function (e) {
        if (e.ctrlKey &&
            (e.keyCode === 85)) {
            if ($('.content_aksesbilitas').hasClass('new-show-toolbar')) {
                event.preventDefault();
                var stickyToolbarContainer = document.querySelector(
                    ".content_aksesbilitas"
                );
                stickyToolbarContainer.classList.remove("new-show-toolbar");
                $('#show_menu_dsb_web').css('display', 'flex');

            } else {
                var stickyToolbarContainer = document.querySelector(
                    ".content_aksesbilitas"
                );
                stickyToolbarContainer.classList.toggle("new-show-toolbar");
                $('#show_menu_dsb_web').css('display', 'none');
            }
            return false;
        } else {

            return true;
        }
    };

    $("#circle_close_popup_dsb").click(function (event) {
        event.preventDefault();
        var stickyToolbarContainer = document.querySelector(
            ".content_aksesbilitas"
        );
        stickyToolbarContainer.classList.remove("new-show-toolbar");
        $('#show_menu_dsb_web').css('display', 'flex');
    });

    $("#show_menu_dsb_web").click(function (event) {
        event.preventDefault();
        var stickyToolbarContainer = document.querySelector(
            ".content_aksesbilitas"
        );
        stickyToolbarContainer.classList.toggle("new-show-toolbar");
        $('#show_menu_dsb_web').css('display', 'none');

    });

    $("input[autocomplete]").on("input", function () {
        var dInput = this.value;
        cek_action_sound_search.length = 0;
        if (dInput.length > 2) {
            funky = setInterval(function () {
                cek_local_function();
            }, 250);
            cek_action_sound_search.push(1);
        }
    });




    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'G-SJLG49CX7N');




}
var my_website_jkt = "";
var except_url = ["www.jakarta.go.id", "jakarta.go.id", "ppid.jakarta.go.id"];
if ((new RegExp('\\b' + except_url.join('\\b|\\b') + '\\b')).test(base_url_website)) {
    my_website_jkt = "Mode Suara";
} else {
    my_website_jkt = "Moda Suara";
}

function slider_popup_disabilitas() {

    var slider_popup = `<div class="content_aksesbilitas" id="widget_menu_disabilitas">
<div class="groupcontenttoolbar" id="checklangmenu">
    <div class="content_aksesbilitas_utama">
        <div class="group_title_disabilitas">
            <div class="row_title_disabilitas">
                <div class="start_title_disabilitas">
                    <div class="title_disabilitas">Menu Aksesibilitas (CTRL+U)</div>
                </div>
                <div class="end_title_disabilitas">
                    <div class="box_circle_disabilitas" id="circle_close_popup_dsb">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 448 448" fill="none">
                            <path class="icon_x_svg_color" d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="group_box_content_disabilitas">
            <div class="group_scroll_content">
                <div class="layout_content_title">
                    <div class="group_row_widget_dsb">
                        <div class="group_action_bahasa" id="dropdown_bahasa_widget">
                            <div class="box_content_disabilitas">
                                <div class="name_id">ID</div>
                            </div>
                            <div class="box_name_menu_disabilitas">
                                Bahasa Indonesia (Indonesian)
                            </div>
                        </div>
                        <div class="box_button_switch">

                        </div>
                    </div>
                </div>

                <div class="layout_bahasa_widget" id="show_bahasa_widget_dsb">
                    <div class="group_title_bahasa">
                        <div class="title_daftar_bahasa">
                            Daftar Bahasa Widget Aksesibilitas
                        </div>
                    </div>
                    <div class="group_body_bahasa">
                        <!--div class="catatan_kosong">Saat Ini Sedang Tidak Tersedia Bahasa Lain</div-->
                    </div>
                </div>
                <div class="content_daftar_action_disabilitas">
                    <div class="layout_grid_disabilitas">
                        <div class="box_group_disabilitas" id="action_moda_suara">
                            <div class="box_icon_disabilitas">
                                <svg data-name="Layer 1" width="80px" height="60px" id="Layer_1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                           <div class="box_text_bottom_disabilitas">`+my_website_jkt+`
                            </div>
                            <div class="box_column_action_strip">

                            </div>
                        </div>
                        <div class="box_group_disabilitas" id="action_perbesar_text">
                            <div class="box_icon_disabilitas">


                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="70px" height="70px" width="234.000000pt" height="174.000000pt" viewBox="0 0 234.000000 174.000000" preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,174.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                        <path class="icon_svg_color" d="M900 1470 l0 -100 250 0 250 0 0 -590 0 -590 95 0 95 0 0 590 0 590
                                            248 2 247 3 3 98 3 97 -596 0 -595 0 0 -100z" />
                                        <path class="icon_svg_color" d="M117 1173 c-4 -3 -7 -48 -7 -100 l0 -93 200 0 200 0 0 -395 0 -395 100 0 100 0 0 395 0 395 195 0 195 0 0 100 0 100 -488 0 c-269 0 -492 -3 -495-7z" />
                                    </g>
                                </svg>

                                <!--svg version="1.1" width="60px" height="60px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path class="icon_svg_color" d="M16 9v8h-2V9h-4V7h10v2h-4zM8 5v12H6V5H0V3h15v2H8z" />
                                </svg-->
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
                                <svg version="1.1" width="60px" height="60px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
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


                        <div class="box_group_disabilitas" id="action_grey_scale">
                            <div class="box_icon_disabilitas">
                                <svg version="1.1" width="60px" height="60px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <g style="isolation: isolate">
                                        <g data-name="Layer 1" id="Layer_1">
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
                            <div class="box_text_bottom_disabilitas">
                                Skala Abu - Abu
                            </div>
                            <div class="box_column_action_strip">

                            </div>
                        </div>

                        <div class="box_group_disabilitas" id="action_kontras">
                            <div class="box_icon_disabilitas">
                                <svg id="svg_kontras_multi" width="60px" height="60px" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path class="circle_multi" d="M27,15.1c1.2,1.5,2,3.4,2,5.4c0,4.7-3.8,8.5-8.5,8.5S12,25.2,12,20.5s3.8-8.5,8.5-8.5c0.5,0,1,0,1.4,0.1" />
                                    <path class="circle_multi" d="M19.7,22.6c-0.9,3.7-4.3,6.4-8.2,6.4C6.8,29,3,25.2,3,20.5c0-2.2,0.8-4.2,2.2-5.7" />
                                    <path class="circle_multi" d="M10.5,12.1c0.3,0,0.7-0.1,1-0.1c3.5,0,6.4,2.1,7.8,5" />
                                    <path class="circle_single" d="M9.7,17.5C8.4,16,7.7,14.1,7.7,12c0-4.7,3.8-8.5,8.5-8.5s8.5,3.8,8.5,8.5s-3.8,8.5-8.5,8.5c-0.3,0-0.6,0-0.9,0" />
                                </svg>
                               
                               
    <svg id="svg_balikan_warna" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="60" height="60">
          
    <path class="active_icon_svg_color" fill-rule="nonzero"
        d="m14.1 33.9-7.805 7.805a1 1 0 0 0 .708.295h33.994c.551 0 1.003-.451 1.003-1.003V7.003a1 1 0 0 0-.295-.708L33.9 14.1A13.956 13.956 0 0 1 38 24c0 7.732-6.268 14-14 14a13.956 13.956 0 0 1-9.9-4.1ZM4 7.002A3.006 3.006 0 0 1 7.003 4h33.994A3.006 3.006 0 0 1 44 7.003v33.994A3.006 3.006 0 0 1 40.997 44H7.003A3.006 3.006 0 0 1 4 40.997V7.003ZM33.9 14.1A13.956 13.956 0 0 0 24 10c-7.732 0-14 6.268-14 14 0 3.866 1.567 7.366 4.1 9.9l19.8-19.8Z"
        class="color000 svgShape"></path>

</svg>

                               
                               
                                <svg id="svg_kontras_warna" viewBox="0 0 512 512" width="60px" height="60px" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="icon_contrast_white" cx="256" cy="256" r="208" />
                                    <path class="icon_contrast_black" d="M256,464C141.12,464,48,370.88,48,256S141.12,48,256,48Z" />
                                </svg>


                                <svg width="60px" height="60px" id="svg_kontras_klise" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g>
                                        <path class="active_icon_svg_color" d="M256,128c-81.9,0-145.7,48.8-224,128c67.4,67.7,124,128,224,128c99.9,0,173.4-76.4,224-126.6   C428.2,198.6,354.8,128,256,128z M256,347.3c-49.4,0-89.6-41-89.6-91.3c0-50.4,40.2-91.3,89.6-91.3s89.6,41,89.6,91.3   C345.6,306.4,305.4,347.3,256,347.3z" />
                                        <g>
                                            <path class="active_icon_svg_color" d="M256,224c0-7.9,2.9-15.1,7.6-20.7c-2.5-0.4-5-0.6-7.6-0.6c-28.8,0-52.3,23.9-52.3,53.3c0,29.4,23.5,53.3,52.3,53.3    s52.3-23.9,52.3-53.3c0-2.3-0.2-4.6-0.4-6.9c-5.5,4.3-12.3,6.9-19.8,6.9C270.3,256,256,241.7,256,224z" />
                                        </g>
                                    </g>
                                </svg>

                                <svg id="svg_kontras_light" preserveAspectRatio="xMidYMid" width="60px" height="60px" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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


                        <div class="box_group_disabilitas" id="action_hidden_image">
                            <div class="box_icon_disabilitas">
                                <svg fill="none" height="60" viewBox="0 0 64 64" width="60" xmlns="http://www.w3.org/2000/svg">
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


                        <div class="box_group_disabilitas" id="action_perataan_text">
                            <div class="box_icon_disabilitas">


                                <svg id="svg_left_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="68" y2="68" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="168" y1="108" y2="108" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="148" y2="148" />
                                    <line fill="none" class="icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="168" y1="188" y2="188" />
                                </svg>

                                <svg class="hidden_svg" id="svg_center_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <path class="active_icon_svg_color" d="M40,76H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Z" />
                                    <path class="active_icon_svg_color" d="M64,100a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z" />
                                    <path class="active_icon_svg_color" d="M216,140H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                                    <path class="active_icon_svg_color" d="M192,180H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z" />
                                </svg>


                                <svg class="hidden_svg" id="svg_right_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="none" height="60" width="60" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="68" y2="68" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="88" x2="216" y1="108" y2="108" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="40" x2="216" y1="148" y2="148" />
                                    <line fill="none" class="active_icon_svg_sroke_color" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="88" x2="216" y1="188" y2="188" />
                                </svg>


                                <svg class="hidden_svg" id="svg_right_left_text_icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
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

                        <div class="box_group_disabilitas" id="action_tulisan_dapat_di_baca">
                            <div class="box_icon_disabilitas">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="60" width="60" viewBox="0 0 448 448">
                                    <path class="icon_svg_color" d="M181.25 139.75l-42.5 112.5c24.75 0.25 49.5 1 74.25 1 4.75 0 9.5-0.25 14.25-0.5-13-38-28.25-76.75-46-113zM0 416l0.5-19.75c23.5-7.25 49-2.25 59.5-29.25l59.25-154 70-181h32c1 1.75 2 3.5 2.75 5.25l51.25 120c18.75 44.25 36 89 55 133 11.25 26 20 52.75 32.5 78.25 1.75 4 5.25 11.5 8.75 14.25 8.25 6.5 31.25 8 43 12.5 0.75 4.75 1.5 9.5 1.5 14.25 0 2.25-0.25 4.25-0.25 6.5-31.75 0-63.5-4-95.25-4-32.75 0-65.5 2.75-98.25 3.75 0-6.5 0.25-13 1-19.5l32.75-7c6.75-1.5 20-3.25 20-12.5 0-9-32.25-83.25-36.25-93.5l-112.5-0.5c-6.5 14.5-31.75 80-31.75 89.5 0 19.25 36.75 20 51 22 0.25 4.75 0.25 9.5 0.25 14.5 0 2.25-0.25 4.5-0.5 6.75-29 0-58.25-5-87.25-5-3.5 0-8.5 1.5-12 2-15.75 2.75-31.25 3.5-47 3.5z"></path>
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas">
                                Tulisan Dapat Dibaca
                            </div>
                            <div class="box_column_action_strip">
                            </div>
                        </div>

                        <div class="box_group_disabilitas" id="action_tulisan_line_height">
                            <div class="box_icon_disabilitas">
                                <svg fill="none" height="60" width="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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



                        <div class="box_group_disabilitas" id="action_animate_pause">
                            <div class="box_icon_disabilitas">

                                <svg height="45" width="45" id="svg_animasi_pause" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg">
                                    <defs id="defs19" />
                                    <g id="g2998" transform="matrix(10.666667,0,0,10.666667,-13434.667,-10410.667)">
                                        <g id="g3">
                                            <path class="icon_svg_color" d="m 1293,987 c 0,2.812 -3.311,5.562 -5.973,7.771 -1.203,0.998 -2.48,1.995 -3.527,3.229 -1.046,-1.233 -2.324,-2.23 -3.527,-3.229 -2.658,-2.209 -5.973,-4.959 -5.973,-7.771 0,0 7.436,3.399 9.5,3.399 2.064,0 9.5,-3.399 9.5,-3.399 z" id="path5" />
                                            <path class="icon_svg_color" d="m 1283.5,1006 c 1.051,0.927 2.322,1.684 3.526,2.436 2.663,1.658 5.974,3.728 5.974,5.839 V 1018 h -19 v -3.727 c 0,-2.111 3.311,-4.181 5.973,-5.839 1.205,-0.75 2.481,-1.507 3.527,-2.434" id="path7" />
                                            <g id="g9">
                                                <path class="icon_svg_color" d="m 1294,981 v 6.517 c 0,3.725 -3.01,6.452 -5.208,8.444 -1.621,1.469 -2.792,2.53 -2.792,4.039 0,1.509 1.172,2.57 2.793,4.04 2.197,1.991 5.207,4.72 5.207,8.442 V 1019 h -21 v -6.518 c 0,-3.724 3.01,-6.451 5.207,-8.442 1.621,-1.47 2.793,-2.531 2.793,-4.04 0,-1.509 -1.171,-2.57 -2.792,-4.039 -2.198,-1.992 -5.208,-4.72 -5.208,-8.444 V 981 h 21 m 2,-2 h -25 c 0,0 0,1.542 0,8.517 0,6.977 8,10.647 8,12.483 0,1.836 -8,5.508 -8,12.482 0,6.976 0,8.518 0,8.518 h 25 c 0,0 0,-1.542 0,-8.518 0,-6.976 -8,-10.646 -8,-12.482 0,-1.835 8,-5.507 8,-12.483 0,-6.975 0,-8.517 0,-8.517 l 0,0 z" id="path11" />
                                            </g>
                                            <rect class="icon_svg_sroke_color" height="2" id="rect13" width="29" x="1269" y="976" />
                                            <rect class="icon_svg_sroke_color" height="2" id="rect15" width="29" x="1269" y="1022" />
                                        </g>
                                    </g>
                                </svg>

                                <svg class="hidden_svg" id="svg_animasi_play" version="1.1" height="60" width="60" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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




                        <div class="box_group_disabilitas" id="action_kursor">
                            <div class="box_icon_disabilitas">

                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path class="icon_svg_color" d="M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z" />
                                </svg>
                            </div>
                            <div class="box_text_bottom_disabilitas">
                                Kursor
                            </div>
                            <div class="box_column_action_strip">

                            </div>
                        </div>

                        <div class="box_group_disabilitas" id="action_space_text">
                            <div class="box_icon_disabilitas">
                                <svg version="1.0" width="60" height="60" xmlns="http://www.w3.org/2000/svg" width="208.000000pt" height="207.000000pt" viewBox="0 0 208.000000 207.000000" preserveAspectRatio="xMidYMid meet">
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
                                Spasi Teks
                            </div>
                            <div class="box_column_action_strip">
                                <div class="box_row_action_strip" id="list_strip_loading_action_space_text">
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_1"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_2"></div>
                                    <div class="strip_loading_unprocess_v3" id="strip_loading_3"></div>
                                </div>
                            </div>
                        </div>





                        <div class="box_group_disabilitas" id="action_garis_bawahi_tautan">
                            <div class="box_icon_disabilitas">

                                <svg fill="#000000" id="svg_decoration_link" width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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




                    </div>

                    <div class="column_reset_disabilitas_menu">
                        <div class="row_persegi_reset" id="reset_pengaturan_all_dsb">
                            <div class="icon_persegi_riset">
                                <svg height="20px" width="20px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path class="icon_x_svg_color" d="M29,2c-0.452,0-0.952,0.144-1.415,0.582l-1.941,1.941C22.981,2.273,19.593,1,16,1C9.473,1,3.738,5.173,1.73,11.385  c-0.34,1.051,0.237,2.179,1.288,2.518C3.224,13.969,3.431,14,3.634,14c0.845,0,1.63-0.539,1.903-1.385C7.009,8.06,11.214,5,16,5  c2.513,0,4.88,0.864,6.791,2.377l-3.209,3.209C19.144,11.048,19,11.548,19,12c0,1.021,0.809,2,2,2h8c1.024,0,2-0.812,2-2V4  C31,2.809,30.021,2,29,2z M28.981,18.097C28.776,18.031,28.569,18,28.366,18c-0.845,0-1.63,0.539-1.903,1.385  C24.991,23.94,20.786,27,16,27c-2.513,0-4.88-0.864-6.791-2.377l3.209-3.209C12.856,20.952,13,20.452,13,20c0-1.021-0.809-2-2-2H3  c-1.024,0-2,0.812-2,2v8c0,1.191,0.979,2,2,2c0.452,0,0.952-0.144,1.415-0.582l1.941-1.941C9.019,29.727,12.407,31,16,31  c6.527,0,12.262-4.173,14.27-10.385C30.609,19.564,30.032,18.437,28.981,18.097z" />
                                </svg>
                            </div>
                            <div class="column_text_persegi_riset">
                                Atur Ulang Semua Pengaturan Aksesibilitas
                            </div>
                        </div>
                    </div>
                    <div class="column_cek_version_dsb">
                    <div class="column_text_cek_version_dsb">
                    -  Widget Aksesibilitas Version 2.0  -
                </div>
            
                    </div>
                    <!--div class="row_column_creator">
                    <div class="creator_widget">
                   Di Buat Oleh : 
                </div>
              
                    <a href="https://fathulhudoyo.info" class="column_cek_creator" target="_blank">
                    Fathul Hudoyo
                </a>
                </div-->
                </div>
            </div>
        </div>
    </div>
</div>
</div>`;
    $('#slider_dsb_element').html(slider_popup);

    
    $("#list_strip_loading_perbesar_text").hide();
    $("#list_strip_loading_perkecil_text").hide();
    $("#list_strip_loading_action_kontras").hide();
    $("#svg_kontras_warna,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
    $("#list_strip_loading_perataan_text").hide();
    $("#list_strip_loading_action_tulisan_line_height").hide();
    $("#list_strip_loading_action_space_text").hide();
    $("#svg_block_decoration_link,#list_strip_loading_action_garis_bawahi_tautan").hide();




$('#widget_menu_disabilitas .box_group_disabilitas').each(function (i, item) {
    $(item).cssImportant("line-height", "20px");
});


    // var groups_widget_dsb = Array.from(document.querySelectorAll("#widget_menu_disabilitas"));
    $("#action_moda_suara").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'moda-suara');
        if ($('#action_moda_suara').hasClass('active_box_menu_disabilitas')) {
            $("#action_moda_suara").removeClass("active_box_menu_disabilitas");
            $('#action_moda_suara .box_icon_disabilitas .active_icon_svg_sroke_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_sroke_color")) {
                    item.classList = "icon_svg_sroke_color";
                }
            });
            $("#action_moda_suara").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas')
            localStorage.setItem("permismobile", "off");
            localStorage.setItem("permisvoice", "off");


        } else {
            if (getOS() == "iOS" || getOS() == "Android") {
                localStorage.setItem("permismobile", "on");
                speachmobile("Selamat Datang Di Website Info.go.id");
            } else {
                localStorage.setItem("permisvoice", "on");
                speach("Selamat Datang Di Website Info.go.id");
            }

            $("#action_moda_suara").addClass("active_box_menu_disabilitas");
            $('#action_moda_suara .box_icon_disabilitas .icon_svg_sroke_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("icon_svg_sroke_color")) {
                    item.classList = "icon_svg_sroke_color active_icon_svg_sroke_color";
                }

            });
            $("#action_moda_suara").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');

        }
    });




    $("#action_perbesar_text").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'perbesar-teks');
        if ($('#action_perbesar_text').hasClass('active_box_menu_disabilitas') && action_text_besar.length == 4) {
            clear_set_text_besar();
        } else {
            clear_set_text_kecil();
            load_active_text_besar();
            if (action_text_besar.length == 0) {
                localStorage.setItem("text_besar", "1");
                text_besar_1();
            } else if (action_text_besar.length == 1) {

                localStorage.setItem("text_besar", "2");
                text_besar_2();
            } else if (action_text_besar.length == 2) {


                localStorage.setItem("text_besar", "3");
                text_besar_3();
            } else if (action_text_besar.length == 3) {
                localStorage.setItem("text_besar", "4");
                text_besar_4();
            }

            action_text_besar.push(1);
            $("#action_perbesar_text").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas')
        }
    });






    $("#action_grey_scale").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'skala-abu-abu');
        if ($('#action_grey_scale').hasClass('active_box_menu_disabilitas') && action_grey_scale_widget.length == 1) {
            $('#action_grey_scale .box_icon_disabilitas path').each(function (i, item) {
                action_grey_scale_widget.length = 0;
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
            $("#action_grey_scale").removeClass("active_box_menu_disabilitas");
            $("#action_grey_scale").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {

                $('html').css({
                    'filter': ""
                })

            });

            localStorage.removeItem("grey_scale_active");

            if (action_contrash_widget.length == 1) {
                action_warna_kode_1("aktif");
            }
        } else {

            localStorage.setItem("grey_scale_active", "1");
            action_grey_scale_widget.push(1);
            setTimeout(() => {
                load_active_grey_scale();
            }, 90);

            //    $('#effectweb').attr("class", "greyscaleall");

        }
    });


    $("#action_kontras").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'kontras');
        if ($('#action_kontras').hasClass('active_box_menu_disabilitas') && action_contrash_widget.length == 4) {
            action_contrash_widget.length = 0;
            $("#action_kontras").removeClass("active_box_menu_disabilitas");
            $("#action_kontras").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');

            $('#action_kontras .box_icon_disabilitas path').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_circle_multi")) {
                    item.classList = "circle_multi";
                }

                if (name_class.includes("active_circle_single")) {
                    item.classList = "circle_single";
                }
            });


            strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "noaktif");
            strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "noaktif");
            strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_3", "noaktif");
            strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_4", "noaktif");
            $("#svg_kontras_multi").show();
            $("#svg_kontras_warna,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
            $("#text_name_kontras").text('Kontras+');
            action_warna_kode_1("noaktif");
            action_warna_kode_2("noaktif");
            action_warna_kode_3("noaktif");
            action_warna_kode_4("noaktif");
            localStorage.removeItem('action_kontras');
            if (cek_action_sound_search.length > 0) {
                setTimeout(() => {
                    callfunction('Kontras+');
                }, 100);
            }

            if (action_grey_scale_widget.length == 1) {
                load_active_grey_scale();
            }

            if (action_garis_bawahi_tautan_widget.length > 0) {
                if (action_garis_bawahi_tautan_widget.length == 1) {
                    action_perataan_text_1_2("rata1", "aktif");
                    action_perataan_text_1_2("rata2", "noaktif");
                }

                if (action_garis_bawahi_tautan_widget.length == 2) {
                    action_perataan_text_1_2("rata1", "noaktif");
                    action_perataan_text_1_2("rata2", "aktif");
                }
            }


        } else {

            load_active_kontras();
            if (action_contrash_widget.length == 0) {
                localStorage.setItem('action_kontras', '1');
                action_kontras_1();
            } else if (action_contrash_widget.length == 1) {

                localStorage.setItem('action_kontras', '2');
                action_kontras_2();
            } else if (action_contrash_widget.length == 2) {
                localStorage.setItem('action_kontras', '3');
                action_kontras_3();
            } else if (action_contrash_widget.length == 3) {
                localStorage.setItem('action_kontras', '4');
                action_kontras_4();
            }

            action_contrash_widget.push(1);
        }
    });



    $("#action_hidden_image").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'sembunyikan-gambar');
        if ($('#action_hidden_image').hasClass('active_box_menu_disabilitas')) {
            action_text_besar.length = 0;
            $("#action_hidden_image").removeClass("active_box_menu_disabilitas");
            $('#action_hidden_image .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_color")) {
                    item.classList = "icon_svg_color";
                }
            });
            $("#action_hidden_image").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');

            $('* > img:not("#widget_menu_disabilitas *")').each(function (i, item) {
                $(item).cssImportant("visibility", "");
            });
            localStorage.removeItem('action_hidden_image');
        } else {
            localStorage.setItem('action_hidden_image', '1');
            load_active_hidden_image();
        }

    });








    $("#action_perataan_text").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'rata-tulisan');
        if ($('#action_perataan_text').hasClass('active_box_menu_disabilitas') && action_perataan_text_widget.length == 4) {
            action_perataan_text_widget.length = 0;
            $("#action_perataan_text").removeClass("active_box_menu_disabilitas");
            $('#action_perataan_text .box_icon_disabilitas .icon_svg_sroke_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_sroke_color")) {
                    item.classList = "icon_svg_sroke_color";
                }
            });
            $("#action_perataan_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "noaktif")
            strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "noaktif")
            strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_3", "noaktif")
            strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_4", "noaktif")
            $("#text_rata_tulisan").text('Rata Tulisan');
            setTimeout(() => {
                callfunction('Rata Tulisan');
            }, 100);
            $("#svg_left_text_icon").show();
            $("#list_strip_loading_perataan_text").hide();
            $("#svg_center_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();

            perataan_all_text("kiri", "noaktif");
            perataan_all_text("tengah", "noaktif");
            perataan_all_text("kanan", "noaktif");
            perataan_all_text("kanan-kiri", "noaktif");

            localStorage.removeItem("perataan_text")

        } else {

            load_active_perataan_text();



            if (action_perataan_text_widget.length == 0) {
                action_perataan_text_1();
                localStorage.setItem("perataan_text", "1");
            } else if (action_perataan_text_widget.length == 1) {
                localStorage.setItem("perataan_text", "2");
                action_perataan_text_2();
            } else if (action_perataan_text_widget.length == 2) {
                localStorage.setItem("perataan_text", "3");
                action_perataan_text_3();
            } else if (action_perataan_text_widget.length == 3) {
                localStorage.setItem("perataan_text", "4");
                action_perataan_text_4();
            }


            action_perataan_text_widget.push(1);
            $("#action_perataan_text").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas')
        }

    });





    $("#action_tulisan_dapat_di_baca").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'tinggi-garis');
        if ($('#action_tulisan_dapat_di_baca').hasClass('active_box_menu_disabilitas')) {
            action_text_besar.length = 0;
            $("#action_tulisan_dapat_di_baca").removeClass("active_box_menu_disabilitas");
            $('#action_tulisan_dapat_di_baca .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_color")) {
                    item.classList = "icon_svg_color";
                }
            });
            $("#action_tulisan_dapat_di_baca").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');

            $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
                "font-family": "",
                "font-weight": "",
                "font-size": "",
                "font-family": "",
            });
            localStorage.removeItem("action_tulisan_dpt_dibaca", "1");
        } else {
            localStorage.setItem("action_tulisan_dpt_dibaca", "1");

            load_active_tulisan_dpt_dibaca();


        }
    });



    $("#action_tulisan_line_height").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'tinggi-garis');


        if ($('#action_tulisan_line_height').hasClass('active_box_menu_disabilitas') && action_line_height_text_widget.length == 3) {
            //  console.log('lolxxxx');
            action_line_height_text_widget.length = 0;
            $("#action_tulisan_line_height").removeClass("active_box_menu_disabilitas");
            $('#action_tulisan_line_height .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_color")) {
                    item.classList = "icon_svg_color";
                }
            });
            $("#list_strip_loading_action_tulisan_line_height").hide();
            $("#action_tulisan_line_height").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "noaktif");
            strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_2", "noaktif");
            strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_3", "noaktif");
            $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *")').each(function (i, item) {
                $(item).cssImportant("line-height", "");
            });


            $("#text_id_tinggi_garis").text("Tinggi Garis");
            localStorage.removeItem("action_line_height");

            setTimeout(() => {
                callfunction('Tinggi Garis');
            }, 100);
        } else {
            load_active_tulisan_line_height();


            if (action_line_height_text_widget.length == 0) {
                localStorage.setItem("action_line_height", "1");
                action_line_height_1();


            } else if (action_line_height_text_widget.length == 1) {
                localStorage.setItem("action_line_height", "2");
                action_line_height_2();


            } else if (action_line_height_text_widget.length == 2) {
                localStorage.setItem("action_line_height", "3");
                action_line_height_3();

            }

            action_line_height_text_widget.push(1);
            $("#action_tulisan_line_height").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas')


        }
    });




    $("#action_animate_pause").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'animasi-dijeda');
        if ($('#action_animate_pause').hasClass('active_box_menu_disabilitas')) {
            $('#action_animate_pause .box_icon_disabilitas svg *').each(function (i, item) {

                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_color")) {
                    item.classList = "icon_svg_color";
                }

                if (name_class.includes("active_icon_svg_sroke_color")) {
                    item.classList = "icon_svg_sroke_color";
                }
            });
            $("#action_animate_pause").removeClass("active_box_menu_disabilitas");
            $("#action_animate_pause").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            $("#svg_animasi_play").hide();
            $("#svg_animasi_pause").show();

            clearInterval(interval_animate_widget);
            jQuery.fx.off = false;

            $('*,*:before, *:after').each(function (i, item) {
                $(item).cssImportant("animation-duration", "");
                $(item).cssImportant("transform", "");
                $(item).cssImportant("transition", "");
                $(item).cssImportant("animation", "");
                $(item).cssImportant("animation-play-state", "");
                $(item).cssImportant("-webkit-animation-play-state", "");
                $(item).cssImportant("-moz-animation-play-state", "");
                $(item).cssImportant("-o-animation-play-state", "");
                $(item).clearQueue();
            });
            event.cancelBubble = false;
            $("#text_id_animasi").text("Animasi Dijeda");

            setTimeout(() => {
                callfunction('Animasi Dijeda');
            }, 100);
            localStorage.removeItem("action_animate_pause");
        } else {
            load_active_animate_pause();
            localStorage.setItem("action_animate_pause", "1");
            event.cancelBubble = true;
        }
    });


    $("#action_kursor").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'kursor');
        if ($('#action_kursor').hasClass('active_box_menu_disabilitas')) {
            $("#action_kursor").removeClass("active_box_menu_disabilitas");
            $('#action_kursor .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_color")) {
                    item.classList = "icon_svg_color";
                }
            });
            $("#action_kursor").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            $("*").removeClass("cursor_website_all");
            localStorage.removeItem("action_kursor_change");
        } else {
            load_active_kursor_change();
            localStorage.setItem("action_kursor_change", "1");

        }
    });





    $("#action_space_text").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'spasi-teks');
        if ($('#action_space_text').hasClass('active_box_menu_disabilitas') && action_space_text_widget.length == 3) {
            action_space_text_widget.length = 0;
            $("#action_space_text").removeClass("active_box_menu_disabilitas");
            $('#action_space_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_svg_color")) {
                    item.classList = "icon_svg_color";
                }
            });
            $("#list_strip_loading_action_space_text").hide();
            $("#action_space_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "noaktif");
            strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_2", "noaktif");
            strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_3", "noaktif");

            $('div > *:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas")').css({
                "letter-spacing": "",
            });
            $("#id_space_text").text("Spasi Teks");

            setTimeout(() => {
                callfunction("Spasi Teks");
            }, 100);
            localStorage.removeItem("action_space_text");
        } else {
            load_active_space_text();

            if (action_space_text_widget.length == 0) {
                localStorage.setItem("action_space_text", "1");
                action_space_text_1();

            } else if (action_space_text_widget.length == 1) {
                localStorage.setItem("action_space_text", "2");
                action_space_text_2();
            } else if (action_space_text_widget.length == 2) {
                localStorage.setItem("action_space_text", "3");
                action_space_text_3();
            }

            action_space_text_widget.push(1);
            $("#action_space_text").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas')


        }
    });





    $("#action_perkecil_text").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'perkecil-teks');
        if ($('#action_perkecil_text').hasClass('active_box_menu_disabilitas') && action_text_kecil.length == 4) {
            clear_set_text_kecil();
        } else {
            clear_set_text_besar();
            load_active_text_kecil();
            if (action_text_kecil.length == 0) {
                localStorage.setItem("text_kecil", "1");
                text_kecil_1();

            } else if (action_text_kecil.length == 1) {
                localStorage.setItem("text_kecil", "2");
                text_kecil_2();

            } else if (action_text_kecil.length == 2) {
                localStorage.setItem("text_kecil", "3");
                text_kecil_3();

            } else if (action_text_kecil.length == 3) {
                localStorage.setItem("text_kecil", "4");
                text_kecil_4();

            }

            action_text_kecil.push(1);
            $("#action_perkecil_text").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas')
        }
    });






    $("#action_garis_bawahi_tautan").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'garis-bawahi-tautan');
        if ($('#action_garis_bawahi_tautan').hasClass('active_box_menu_disabilitas') && action_garis_bawahi_tautan_widget.length == 2) {
            action_garis_bawahi_tautan_widget.length = 0;
            $("#action_garis_bawahi_tautan").removeClass("active_box_menu_disabilitas");
            $('#action_garis_bawahi_tautan .box_icon_disabilitas .icon_fill_svg_color_black').each(function (i, item) {
                var name_class = item.classList.value;
                if (name_class.includes("active_icon_fill_svg_color_black")) {
                    item.classList = "icon_fill_svg_color_black";
                }
            });

            $("#list_strip_loading_action_garis_bawahi_tautan").hide();
            $("#action_garis_bawahi_tautan").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
            strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_1", "noaktif");
            strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_2", "noaktif");
            strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_3", "noaktif");

            $("#svg_decoration_link").show();
            $("#svg_block_decoration_link").hide();

            action_perataan_text_1_2("rata1", "noaktif");
            action_perataan_text_1_2("rata2", "noaktif");



            $("#text_garis_bawahi_tautan").text("Garis Bawahi Tautan");

            setTimeout(() => {
                callfunction("Garis Bawahi Tautan");
            }, 100);
            localStorage.removeItem("action_link_all");
        } else {
            load_active_link_all();
            if (action_garis_bawahi_tautan_widget.length == 0) {
                localStorage.setItem("action_link_all", "1");
                action_garis_link_1();
            } else if (action_garis_bawahi_tautan_widget.length == 1) {
                localStorage.setItem("action_link_all", "2");
                action_garis_link_2();
            }
            action_garis_bawahi_tautan_widget.push(1);
            $("#action_garis_bawahi_tautan").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');
        }

    });




    $("#dropdown_bahasa_widget").click(function (event) {
        event.preventDefault();
        //  console.log('yow');
        //alert('')
        /*
        if ($('#show_bahasa_widget_dsb').hasClass('layout_bahasa_widget_active')) {
          $('#show_bahasa_widget_dsb').removeClass('layout_bahasa_widget_active');
        } else {
          $('#show_bahasa_widget_dsb').addClass('layout_bahasa_widget_active');
        }*/
    });


















    $("#reset_pengaturan_all_dsb").click(function (event) {
        event.preventDefault();
        hit_api_tracking(base_url_website, 'reset-pengaturan-disabilitas');

        $("*").each(function (i, item) {
            $(item).css({
                "opacity": "",
                "border-color": ""
            });
        });

        $(
            '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
        ).cssImportant("border-color", "");

        $("#action_moda_suara").removeClass("active_box_menu_disabilitas");
        $('#action_moda_suara .box_icon_disabilitas .active_icon_svg_sroke_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_sroke_color")) {
                item.classList = "icon_svg_sroke_color";
            }
        });
        $("#action_moda_suara").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas')

        localStorage.setItem("permisvoice", "off");




        /*perbesar_text*/

        action_text_besar.length = 0;
        $("#action_perbesar_text").removeClass("active_box_menu_disabilitas");
        $('#action_perbesar_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });
        $("#action_perbesar_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "noaktif")
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "noaktif")
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "noaktif")
        strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_4", "noaktif")

        $('*:not("#widget_menu_disabilitas *")').css({
            "font-size": "",
        });





        /*grey scale*/

        $('#action_grey_scale .box_icon_disabilitas path').each(function (i, item) {
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
        $("#action_grey_scale").removeClass("active_box_menu_disabilitas");
        $("#action_grey_scale").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {

            $('html').css({
                'filter': ""
            })

        });





        /*kontras*/


        action_contrash_widget.length = 0;
        $("#action_kontras").removeClass("active_box_menu_disabilitas");
        $("#action_kontras").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');

        $('#action_kontras .box_icon_disabilitas path').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_circle_multi")) {
                item.classList = "circle_multi";
            }

            if (name_class.includes("active_circle_single")) {
                item.classList = "circle_single";
            }
        });


        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "noaktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "noaktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_3", "noaktif");
        strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_4", "noaktif");
        $("#svg_kontras_multi").show();
        $("#svg_kontras_warna,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
        $("#text_name_kontras").text(' Kontras+');
        action_warna_kode_1("noaktif");
        action_warna_kode_2("noaktif");
        action_warna_kode_3("noaktif");
        action_warna_kode_4("noaktif");




        /* perataan text */


        action_perataan_text_widget.length = 0;
        $("#action_perataan_text").removeClass("active_box_menu_disabilitas");
        $('#action_perataan_text .box_icon_disabilitas .icon_svg_sroke_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_sroke_color")) {
                item.classList = "icon_svg_sroke_color";
            }
        });
        $("#action_perataan_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "noaktif")
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "noaktif")
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_3", "noaktif")
        strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_4", "noaktif")
        $("#text_rata_tulisan").text('Rata Tulisan');
        $("#svg_left_text_icon").show();
        $("#svg_center_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();

        perataan_all_text("kiri", "noaktif");
        perataan_all_text("tengah", "noaktif");
        perataan_all_text("kanan", "noaktif");
        perataan_all_text("kanan-kiri", "noaktif");




        /* hidden image */




        $("#action_hidden_image").removeClass("active_box_menu_disabilitas");
        $('#action_hidden_image .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });
        $("#action_hidden_image").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');

        $('* > img:not("#widget_menu_disabilitas *")').each(function (i, item) {
            $(item).cssImportant("visibility", "");
        });


        /* reset text besar*/





        action_text_besar.length = 0;
        $("#action_tulisan_dapat_di_baca").removeClass("active_box_menu_disabilitas");
        $('#action_tulisan_dapat_di_baca .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });
        $("#action_tulisan_dapat_di_baca").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');

        $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({

            "font-size": "",

        });





        /* line height */

        action_line_height_text_widget.length = 0;
        $("#action_tulisan_line_height").removeClass("active_box_menu_disabilitas");
        $('#action_tulisan_line_height .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });

        $("#action_tulisan_line_height").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "noaktif");
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_2", "noaktif");
        strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_3", "noaktif");
        $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *")').each(function (i, item) {
            $(item).cssImportant("line-height", "");
        });
        $("#text_id_tinggi_garis").text("Tinggi Garis");







        /* Animasi  */
        $('#action_animate_pause .box_icon_disabilitas svg *').each(function (i, item) {

            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }

            if (name_class.includes("active_icon_svg_sroke_color")) {
                item.classList = "icon_svg_sroke_color";
            }
        });
        $("#action_animate_pause").removeClass("active_box_menu_disabilitas");
        $("#action_animate_pause").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        $("#svg_animasi_play").hide();
        $("#svg_animasi_pause").show();
        clearInterval(interval_animate_widget);
        jQuery.fx.off = false;

        $('*,*:before, *:after').each(function (i, item) {
            $(item).cssImportant("animation-duration", "");
            $(item).cssImportant("transform", "");
            $(item).cssImportant("transition", "");
            $(item).cssImportant("animation", "");
            $(item).cssImportant("animation-play-state", "");
            $(item).cssImportant("-webkit-animation-play-state", "");
            $(item).cssImportant("-moz-animation-play-state", "");
            $(item).cssImportant("-o-animation-play-state", "");
            $(item).clearQueue();
        });

        $("#text_id_animasi").text("Animasi Dijeda");



        /*kursor*/


        $("#action_kursor").removeClass("active_box_menu_disabilitas");
        $('#action_kursor .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });
        $("#action_kursor").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        $("*").removeClass("cursor_website_all");


        action_space_text_widget.length = 0;
        $("#action_space_text").removeClass("active_box_menu_disabilitas");
        $('#action_space_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });
        $("#list_strip_loading_action_space_text").hide();
        $("#action_space_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "noaktif");
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_2", "noaktif");
        strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_3", "noaktif");

        $('div > *:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas")').css({
            "letter-spacing": "",
        });
        $("#id_space_text").text("Spasi Teks");



        /*perkecil text*/

        action_text_kecil.length = 0;
        $("#action_perkecil_text").removeClass("active_box_menu_disabilitas");
        $('#action_perkecil_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_svg_color")) {
                item.classList = "icon_svg_color";
            }
        });

        $("#action_perkecil_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "noaktif")
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "noaktif")
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "noaktif")
        strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_4", "noaktif")

        $('*:not("#widget_menu_disabilitas *")').css({
            "font-size": "",
        });



        /*garis bawahi tautan*/
        action_garis_bawahi_tautan_widget.length = 0;
        $("#action_garis_bawahi_tautan").removeClass("active_box_menu_disabilitas");
        $('#action_garis_bawahi_tautan .box_icon_disabilitas .icon_fill_svg_color_black').each(function (i, item) {
            var name_class = item.classList.value;
            if (name_class.includes("active_icon_fill_svg_color_black")) {
                item.classList = "icon_fill_svg_color_black";
            }
        });

        $("#list_strip_loading_action_garis_bawahi_tautan").hide();
        $("#action_garis_bawahi_tautan").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
        strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_1", "noaktif");
        strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_2", "noaktif");
        strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_3", "noaktif");

        $("#svg_decoration_link").show();
        $("#svg_block_decoration_link").hide();
        action_perataan_text_1_2("rata1", "noaktif");
        action_perataan_text_1_2("rata2", "noaktif");




        localStorage.removeItem("text_besar");
        localStorage.removeItem("text_kecil");
        localStorage.removeItem("grey_scale_active");
        localStorage.removeItem("action_kontras");
        localStorage.removeItem("action_hidden_image");
        localStorage.removeItem("perataan_text");
        localStorage.removeItem("action_tulisan_dpt_dibaca");
        localStorage.removeItem("action_line_height");
        localStorage.removeItem("action_animate_pause");
        localStorage.removeItem("action_kursor_change");
        localStorage.removeItem("action_space_text");
        localStorage.removeItem("action_link_all");

        if (getOS() == "Android") {
            $(".column_text_persegi_riset").cssImportant("font-size", "12px");
        }

    });


    $(document).on("mouseover", "a > *", function () {
        var textvalue = $(this).text().toString();
        // console.log(textvalue);
        speach(textvalue);
        speachmobile(textvalue);
    });

    $(document).on("mouseover", "a", function () {
        var textvalue = $(this).text().toString();
        //   console.log(textvalue);
        speach(textvalue);
        speachmobile(textvalue);
    });


    if (!window.James) {
        James = {};
    }
    James.Selector = {};
    James.Selector.mouseup = function () {
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
            speach(textvalue);
            //   speachmobile(textvalue);
        }
    };
    $(document).ready(function () {
        $(document).bind("mouseup", James.Selector.mouseup);
    });
    $(document).ready(function () {
        document.addEventListener("selectionchange", function (event) {
            var voicecek = localStorage.getItem("permismobile");
            if (voicecek != null && voicecek == "on") {
                const selection = window.getSelection();
                if (selection.rangeCount === 0) {
                    return;
                }
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const text = selection.toString();
                if (!isBlank(text) && text != undefined && text != "") {
                    speachmobile(text);
                }
            }
        });
    });


    $(document).on("mouseover", ".box_group_disabilitas", function () {
        var textvalue = $(this).text().toString();
        //  console.log(textvalue);
        callfunction(textvalue);
    });

    $(document).on("mouseover", ".row_persegi_reset", function () {
        var textvalue = $(this).text().toString();
        //  console.log(textvalue);
        callfunction(textvalue);
    });

    $(".reset_pengaturan_all_dsb").on("hover", function (e) {
        if (e.type == "mouseenter") {
            console.log("over");
        }
        else if (e.type == "mouseleave") {
            console.log("out");
        }
    });
}












function cek_grey_scale_active_no_active() {

    if (action_grey_scale_widget.length == 1 && action_contrash_widget.length > 0) {
        load_active_grey_scale();
    }
}




function callfunction(value) {
    var voicecek = localStorage.getItem("permismobile");
    if (voicecek != null && voicecek == "on") {
        setTimeout(() => {
            speachmobile(value);
        }, 50);
    } else {
        speach(value);
    }
}


function speachmobile(value) {
    var voicecek = localStorage.getItem("permismobile");
    if (voicecek != null && voicecek == "on") {
      if (responsiveVoice.voiceSupport()) {
        responsiveVoice.speak(value, "Indonesian Female");
      }
    }
  }
  

function speach(value) {
    var voicecek = localStorage.getItem("permisvoice");
    if (voicecek != null && voicecek == "on") {
        var speechSynthesis = window.speechSynthesis;
        speechSynthesis.cancel();
        if ("speechSynthesis" in window) {
            const to_speak = new SpeechSynthesisUtterance(value || "");
            to_speak.lang = "id-ID";
            speechSynthesis.getVoices();
            speechSynthesis.speak(to_speak);
        } else {
            alert("not supported");
        }
    }
}


let r = setInterval(() => {
    if (!speechSynthesis.speaking) {
      clearInterval(r);
    } else {
      speechSynthesis.resume();
    }
  }, 14000);


async function pauseAudio() {
    if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
}

async function playAudio(src) {
    pauseAudio();
    audio = new Audio();
    audio.src = src;
    audio.play();
}





function callfunction(value) {
    var voicecek = localStorage.getItem("permismobile");
    if (voicecek != null && voicecek == "on") {
        setTimeout(() => {
            speachmobile(value);
        }, 50);
    } else {
        speach(value);
    }
}



function getOS() {
    var is_chrome = navigator.userAgent.indexOf("Chrome") > -1;
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    var userAgent = window.navigator.userAgent,
        platform =
            window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"],
        os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
        os = "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = "Windows";
    } else if (/Android/.test(userAgent)) {
        os = "Android";
    } else if (/Linux/.test(platform)) {
        os = "Linux";
    }
    return os;
}



//load langsung






function strip_loading_v2(id_group, id_strip, action) {
    if (action == "aktif") {
        $(id_group).show();
        $(id_group + " > " + id_strip).removeClass('strip_loading_unprocess_v2');
        $(id_group + " > " + id_strip).addClass('strip_loading_process_v2');
    } else {
        $(id_group).hide();
        $(id_group + " > " + id_strip).removeClass('strip_loading_process_v2');
        $(id_group + " > " + id_strip).addClass('strip_loading_unprocess_v2');
    }
}

function strip_loading_v3(id_group, id_strip, action) {
    if (action == "aktif") {
        $(id_group).show();
        $(id_group + " > " + id_strip).removeClass('strip_loading_unprocess_v3');
        $(id_group + " > " + id_strip).addClass('strip_loading_process_v3');
    } else {
        $(id_group).hide();
        $(id_group + " > " + id_strip).removeClass('strip_loading_process_v3');
        $(id_group + " > " + id_strip).addClass('strip_loading_unprocess_v3');
    }
}

function strip_loading_v4(id_group, id_strip, action) {
    if (action == "aktif") {
        $(id_group).show();
        $(id_group + " > " + id_strip).removeClass('strip_loading_unprocess_v4');
        $(id_group + " > " + id_strip).addClass('strip_loading_process_v4');
    } else {
        $(id_group).hide();
        $(id_group + " > " + id_strip).removeClass('strip_loading_process_v4');
        $(id_group + " > " + id_strip).addClass('strip_loading_unprocess_v4');
    }
}





function load_active_link_all() {
    $("#action_garis_bawahi_tautan").addClass("active_box_menu_disabilitas");
    $('#action_garis_bawahi_tautan .box_icon_disabilitas .icon_fill_svg_color_black').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_fill_svg_color_black")) {
            item.classList = "icon_fill_svg_color_black active_icon_fill_svg_color_black";
        }
    });

    $("#action_garis_bawahi_tautan").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');
}

function action_garis_link_1() {
    $("#list_strip_loading_action_garis_bawahi_tautan").show();
    strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_1", "aktif");
    $("#text_garis_bawahi_tautan").text("Garis Bawahi Tautan");

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction("Garis Bawahi Tautan");
        }, 100);
    }


    action_perataan_text_1_2("rata1", "aktif");
    action_perataan_text_1_2("rata2", "noaktif");


    $("#svg_decoration_link").show();
    $("#svg_block_decoration_link").hide();
}


function action_garis_link_2() {
    $("#list_strip_loading_action_garis_bawahi_tautan").show();
    strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_1", "aktif");
    strip_loading_v2("#list_strip_loading_action_garis_bawahi_tautan", "#strip_loading_2", "aktif");
    $("#svg_decoration_link").hide();
    $("#svg_block_decoration_link").show();
    $("#text_garis_bawahi_tautan").text("Sorot Tautan");

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction("Sorot Tautan");
        }, 100);
    }
    action_perataan_text_1_2("rata1", "noaktif");
    action_perataan_text_1_2("rata2", "aktif");


}

function action_perataan_text_1_2(value, action) {
    if (value == "rata1") {
        if (action == "aktif") {


            var links = document.querySelectorAll("a,div > a,li a, a *,a > h1, a > h2, a > h3, a > h4, a > h5,a > *");
            for (var i = 0; i < links.length; i++) {
                if (!isBlank(links[i].href)) {


                    var attr_cek = $(links[i]).attr('style');
                    if (typeof attr_cek !== 'undefined' && attr_cek !== false) {

                        if (action_contrash_widget.length == 2 || action_contrash_widget.length == 3) {
                            $(links[i]).addClass("underline_link_1_kontras");
                        } else {
                            $(links[i]).addClass("underline_link_1");
                        }

                    } else {
                        $(links[i]).addClass("underline_tanda_code");//ini tanda
                        $(links[i]).cssImportant("text-decoration", "underline");
                        if (action_contrash_widget.length == 2 || action_contrash_widget.length == 3) {
                            $(links[i]).cssImportant("text-decoration-color", "yellow");
                        } else {
                            $(links[i]).cssImportant("text-decoration-color", "black");
                        }

                    }


                }
            }



        } else {
            $("*").each(function (i, item) {
                if ($(item).hasClass('underline_tanda_code')) {
                    $(item).css({
                        "text-decoration-color": "",
                        "text-decoration": ""
                    });
                    $(item).removeClass("underline_tanda_code underline_link_1_kontras underline_link_1 ");
                }
                $(item).removeClass("underline_link_1_kontras underline_link_1 ");

            });

        }
    } else if (value == "rata2") {
        if (action == "aktif") {


            var links = document.querySelectorAll("a,div > a,li a, a *,a > h1, a > h2, a > h3, a > h4, a > h5,a > *");
            for (var i = 0; i < links.length; i++) {
                if (!isBlank(links[i].href)) {


                    var attr_cek = $(links[i]).attr('style');
                    if (typeof attr_cek !== 'undefined' && attr_cek !== false) {

                        $(links[i]).addClass("underline_link_2");

                    } else {
                        $(links[i]).addClass("underline_tanda_code");//ini tanda
                        $(links[i]).cssImportant("text-decoration", "underline");
                        $(links[i]).cssImportant("background-color", "black");
                        $(links[i]).cssImportant("background", "black");
                        $(links[i]).cssImportant("color", "yellow");
                        $(links[i]).cssImportant("text-decoration-color", "yellow");

                    }


                }
            }



        } else {
            $("*").each(function (i, item) {
                if ($(item).hasClass('underline_tanda_code')) {
                    if (action_contrash_widget.length == 2 || action_contrash_widget.length == 3) {
                        $(item).css({
                            "text-decoration-color": "",
                            "text-decoration": ""
                        });
                    } else {
                        $(item).css({
                            "text-decoration-color": "",
                            "background-color": "",
                            "background": "",
                            "text-decoration": "",
                            "color": "",
                            "text-decoration-color": ""
                        });
                    }
                    $(item).removeClass("underline_tanda_code underline_link_2");
                }
                $(item).removeClass("underline_link_2 ");

            });

        }


    }
}

function load_active_tulisan_line_height() {

    $("#action_tulisan_line_height").addClass("active_box_menu_disabilitas");
    $('#action_tulisan_line_height .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });

    $("#action_tulisan_line_height").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');
}


function action_line_height_1() {
    $("#list_strip_loading_action_tulisan_line_height").show();
    strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "aktif");
    $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas,body,html,#slider_dsb_element")').each(function (i, item) {
        $(item).cssImportant("line-height", "1.75em");
    });
    $("#text_id_tinggi_garis").text("Tinggi Garis (1.75X)");

    $("#list_strip_loading_action_tulisan_line_height").show();

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Tinggi Garis (1.75X)');
        }, 100);
    }
}

function action_line_height_2() {
    $("#list_strip_loading_action_tulisan_line_height").show();
    strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "aktif");
    strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_2", "aktif");
    $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas,body,html,#slider_dsb_element")').each(function (i, item) {
        $(item).cssImportant("line-height", "2em");
    });

    $("#text_id_tinggi_garis").text("Tinggi Garis (2X)");

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Tinggi Garis (2X)');
        }, 100);
    }
}



function action_line_height_3() {
    $("#list_strip_loading_action_tulisan_line_height").show();
    strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_1", "aktif");
    strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_2", "aktif");
    strip_loading_v3("#list_strip_loading_action_tulisan_line_height", "#strip_loading_3", "aktif");
    $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas,body,html,#slider_dsb_element")').each(function (i, item) {
        $(item).cssImportant("line-height", "2.5em");
    });

    $("#text_id_tinggi_garis").text("Tinggi Garis (2.5X)");
    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Tinggi Garis (2.5X)');
        }, 100);
    }
}




function load_active_kontras() {

    $("#action_kontras").addClass("active_box_menu_disabilitas");
    $("#action_kontras").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas')
    $('#action_kontras .box_icon_disabilitas path').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("circle_multi")) {
            item.classList = "circle_multi active_circle_multi";
        }

        if (name_class.includes("circle_single")) {
            item.classList = "circle_single active_circle_single";
        }
    });
}


function action_warna_kode_2(value) {

    if (value == "aktif") {
        $(".navbar-inverse2").css("background-color", "rgb(0, 0, 0)");
        $(
            `*:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *,
        * > a
        ")`
        ).each(function (i, item) {

            var attr_cek = $(item).attr('style');
            if (typeof attr_cek !== 'undefined' && attr_cek !== false) {
                $(item).addClass("kontras_2_bg_black_green");
            } else {
                $(item).addClass("kontras_2_tanda_code");//ini tanda
                $(item).cssImportant("background-color", "black");
                $(item).cssImportant("color", "#40C090");
                $(item).cssImportant("background", "black");
            }


        });


        $(
            `* > svg *:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
        ")`
        ).each(function (i, item) {
            $(item).cssImportant("color", "#40C090");
        });


        $('* > .border').each(function (i, item) {
            $(item).cssImportant("background-color", "");
            $(item).cssImportant("background", "");
        });

        $(".close_layout_banner_background").css("opacity", "1");
        $(
            '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *")'
        ).cssImportant("border-color", "white");
        var links = document.querySelectorAll("a,div,li a strong");
        for (var i = 0; i < links.length; i++) {
            if (!isBlank(links[i].href)) {
                var attr_cek = $(links[i]).attr('style');
                if (typeof attr_cek !== 'undefined' && attr_cek !== false) {
                    // $(links[i]).addClass("kontras_2_bg_href");

                } else {
                    if (!$(links[i]).hasClass('kontras_2_tanda_code')) {
                        $(links[i]).addClass("kontras_2_tanda_code");
                    }
                    links[i].style.color = "#00f3f7 !important";
                }


            }
        }



        $("h1,h2,h3,h4,h5").each(function (i, item) {
            var cek_style = $(item).attr('style');
            if (typeof cek_style !== 'undefined' && cek_style !== false) {
                $(item).addClass("kontras_2_bg_black_green");
            } else {
                $(item).addClass("kontras_2_tanda_code");
                $(item).cssImportant("background-color", "black");
                $(item).cssImportant("color", "#40C090");
                $(item).cssImportant("background", "black");
            }
        });


        $("* > button, * > p").each(function (i, item) {
            var cek_style = $(item).attr('style');
            if (typeof cek_style !== 'undefined' && cek_style !== false) {
                $(item).addClass("kontras_2_bg_black_green");
            } else {
                $(item).addClass("kontras_2_tanda_code");
                $(item).cssImportant("background-color", "black");
                $(item).cssImportant("color", "#40C090");
                $(item).cssImportant("background", "black");
            }
        });



        $("* > a").each(function (i, item) {
            var cek_style = $(item).attr('style');
            if (typeof cek_style !== 'undefined' && cek_style !== false) {

                $(item).addClass("kontras_2_bg_black_yellow");
            } else {
                $(item).addClass("kontras_2_tanda_code");
                $(item).cssImportant("background-color", "black");
                $(item).cssImportant("color", "yellow");
                $(item).cssImportant("background", "black");
            }
        });

        if (action_garis_bawahi_tautan_widget.length > 0) {
            if (action_garis_bawahi_tautan_widget.length == 1) {
                action_perataan_text_1_2("rata1", "aktif");
                action_perataan_text_1_2("rata2", "noaktif");
            }

            if (action_garis_bawahi_tautan_widget.length == 2) {
                action_perataan_text_1_2("rata1", "noaktif");

                action_perataan_text_1_2("rata2", "aktif");
            }
        }



    } else {
        $("*").each(function (i, item) {
            if ($(item).hasClass('kontras_2_tanda_code')) {
                $(item).css({
                    "background-color": "",
                    "background": "",
                    "color": "",
                    "opacity": ""
                });
                $(item).removeClass("kontras_2_tanda_code");
            }
            $(item).removeClass("kontras_2_bg_black_yellow kontras_2_bg_black_green kontras_2_bg_href");
        });
        $('*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")').cssImportant("border-color", "");
        $("* > svg *").each(function (i, item) {
            $(item).css({
                "color": "",
            });
        });
    }
}



function action_warna_kode_3(value) {
    if (value == "aktif") {

        $(".navbar-inverse2").css("background-color", "rgb(0, 0, 0)");

        $(
            `*:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
        ")`
        ).each(function (i, item) {
            var attr_cek = $(item).attr('style');
            if (typeof attr_cek !== 'undefined' && attr_cek !== false) {
                $(item).addClass("kontras_3_bg_black_yellow");
            } else {
                $(item).addClass("kontras_3_tanda_code");//ini tanda
                $(item).cssImportant("background-color", "black");
                $(item).cssImportant("color", "yellow");
                $(item).cssImportant("background", "black");
            }
        });

        $(
            `* > svg *:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
        ")`
        ).each(function (i, item) {
            $(item).cssImportant("color", "yellow");

        });

        $(".close_layout_banner_background").css("opacity", "1");
        
        $(
            '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.columncopyright,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *")'
        ).cssImportant("border-color", "white");



        if (action_garis_bawahi_tautan_widget.length > 0) {
            if (action_garis_bawahi_tautan_widget.length == 1) {
                action_perataan_text_1_2("rata1", "aktif");
                action_perataan_text_1_2("rata2", "noaktif");
            }

            if (action_garis_bawahi_tautan_widget.length == 2) {
                action_perataan_text_1_2("rata1", "noaktif");
                action_perataan_text_1_2("rata2", "aktif");
            }
        }




    } else {
        $("*").each(function (i, item) {
            if ($(item).hasClass('kontras_3_tanda_code')) {
                $(item).css({
                    "background-color": "",
                    "background": "",
                    "color": "",
                    "opacity": "",
                });

                $(item).removeClass("kontras_3_tanda_code");
            } else {
                $(item).removeClass("kontras_3_bg_black_yellow");
            }
        });

        $('*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")').cssImportant("border-color", "");
        $("* > svg *").each(function (i, item) {
            $(item).css({
                "color": "",
            });
        });
    }
}

function action_warna_kode_4(value) {
    if (value == "aktif") {
        $(
            `*:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
        ")`
        ).each(function (i, item) {
            var attr_cek = $(item).attr('style');
            if (typeof attr_cek !== 'undefined' && attr_cek !== false) {
                $(item).addClass("kontras_4_bg_black_white");
            } else {
                $(item).addClass("kontras_4_tanda_code");//ini tanda
                $(item).cssImportant("color", "black");
                $(item).cssImportant("background-color", "white");
                $(item).cssImportant("background", "white");
            }
        });

        $(
            `* > svg *:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
        ")`
        ).each(function (i, item) {
            $(item).cssImportant("color", "black");
        });


        $(
            `* > svg:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
      .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
      ")`
        ).each(function (i, item) {
            $(item).cssImportant("color", "black");
            $(item).css({

                "background-color": "",
                "background": "",
            });
        });

        if (action_garis_bawahi_tautan_widget.length > 0) {
            if (action_garis_bawahi_tautan_widget.length == 1) {
                action_perataan_text_1_2("rata1", "aktif");
                action_perataan_text_1_2("rata2", "noaktif");
            }

            if (action_garis_bawahi_tautan_widget.length == 2) {
                action_perataan_text_1_2("rata1", "noaktif");
                action_perataan_text_1_2("rata2", "aktif");
            }
        }


    } else {
        $("*").each(function (i, item) {
            if ($(item).hasClass('kontras_4_tanda_code')) {
                $(item).css({
                    "background-color": "",
                    "background": "",
                    "color": "",
                    "opacity": "",
                });

                $(item).removeClass("kontras_4_tanda_code");
            }
            $(item).removeClass("kontras_4_bg_black_white");

        });
        $('*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")').cssImportant("border-color", "");
        $(
            `* > svg *:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
        .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
        ")`
        ).each(function (i, item) {
            $(item).css({
                "color": "",
            });
        });


        $(
            `* > svg:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container,.slider-navigation,.box_data_permohonan,.columncopyright,.slick-next,.slick-prev,.form_all_daftar_menu_permohonan,
      .container_menu_all > .grouprow,.container_menu_all > .stylecolumnsosmed,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,.row_column_creator *
      ")`
        ).each(function (i, item) {
            $(item).css({
                "color": "",
                "background-color": "",
                "background": "",
            });
        });
    }

}
function action_warna_kode_1(value) {
    if (value == "aktif") {
        $('html').css({
            'filter': `invert(100%)`
        })


    } else {

        $('html').css({
            'filter': ""
        })
    }
}





function load_active_tulisan_dpt_dibaca() {
    $("#action_tulisan_dapat_di_baca").addClass("active_box_menu_disabilitas");
    $('#action_tulisan_dapat_di_baca .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });
    $("#action_tulisan_dapat_di_baca").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');
    $(
        '*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down, h1 ,h2 , h3,#widget_menu_disabilitas *,.circle_aksesbilitas_popup *")'
    ).css({
        "font-size": "23px",
    });

    $("h1,h2,h3,h4").css({
        "font-size": "50px",
    });
}




function load_active_space_text() {
    $("#action_space_text").addClass("active_box_menu_disabilitas");
    $('#action_space_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });
    $("#action_space_text").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');
}
function action_space_text_1() {
    $("#list_strip_loading_action_space_text").show();
    strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "aktif");
    $("#id_space_text").text("Spasi Ringan");
    $('div > *:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas")').css({
        "letter-spacing": "1px",
    });

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction("Spasi Ringan");
        }, 100);
    }
}
function action_space_text_2() {
    $("#list_strip_loading_action_space_text").show();
    strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "aktif");
    strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_2", "aktif");
    $("#id_space_text").text("Spasi Sedang");

    $('div > *:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas")').css({
        "letter-spacing": "4px",
    });
    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction("Spasi Sedang");
        }, 100);
    }
}
function action_space_text_3() {
    $("#list_strip_loading_action_space_text").show();
    strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_1", "aktif");
    strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_2", "aktif");
    strip_loading_v3("#list_strip_loading_action_space_text", "#strip_loading_3", "aktif");
    $("#id_space_text").text("Spasi Besar");

    $('div > *:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#widget_menu_disabilitas")').css({
        "letter-spacing": "7px",
    });

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction("Spasi Besar");
        }, 100);
    }
}
function load_active_perataan_text() {
    $("#action_perataan_text").addClass("active_box_menu_disabilitas");
    $('#action_perataan_text .box_icon_disabilitas .icon_svg_sroke_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_sroke_color")) {
            item.classList = "icon_svg_sroke_color active_icon_svg_sroke_color";
        }
    });

}
function action_perataan_text_1() {
    $("#list_strip_loading_perataan_text").show();
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");

    $("#text_rata_tulisan").text('Rata Kiri');

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Rata Kiri');
        }, 100);
    }
    $("#svg_left_text_icon").show();
    $("#svg_center_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();
    $("#list_strip_loading_perataan_text").show();
    perataan_all_text("kiri", "aktif");


}

function action_perataan_text_2() {
    $("#list_strip_loading_perataan_text").show();
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "aktif");
    $("#text_rata_tulisan").text('Rata Tengah');


    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Rata Tengah');
        }, 100);
    }

    $("#svg_center_text_icon").show();
    $("#svg_left_text_icon,#svg_right_text_icon,#svg_right_left_text_icon").hide();
    perataan_all_text("kiri", "noaktif");
    perataan_all_text("tengah", "aktif");



}

function action_perataan_text_3() {
    $("#list_strip_loading_perataan_text").show();
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "aktif");
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_3", "aktif");

    $("#text_rata_tulisan").text('Rata Kanan');
    $("#svg_right_text_icon").show();
    $("#svg_left_text_icon,#svg_center_text_icon,#svg_right_left_text_icon").hide();

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Rata Kanan');
        }, 100);
    }
    perataan_all_text("kiri", "noaktif");
    perataan_all_text("tengah", "noaktif");
    perataan_all_text("kanan", "aktif");

}

function action_perataan_text_4() {
    $("#list_strip_loading_perataan_text").show();
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_2", "aktif");
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_3", "aktif");
    strip_loading_v4("#list_strip_loading_perataan_text", "#strip_loading_4", "aktif")
    $("#text_rata_tulisan").text('Rata Kanan - Kiri');

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Rata Kanan dan Kiri');
        }, 100);
    }
    perataan_all_text("kiri", "noaktif");
    perataan_all_text("tengah", "noaktif");
    perataan_all_text("kanan", "noaktif");
    perataan_all_text("kanan-kiri", "aktif");
    $("#svg_right_left_text_icon").show();
    $("#svg_left_text_icon,#svg_center_text_icon,#svg_right_text_icon").hide();



}


function perataan_all_text(value, action) {
    if (value == "kiri") {
        if (action == "aktif") {
            $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#slider_dsb_element,#slider_dsb_element *")').each(function (i, item) {
                var cek_style = $(item).attr('style');
                if (typeof cek_style !== 'undefined' && cek_style !== false) {
                    $(item).addClass('rata_text_kiri_widget');
                    if ($(item).css("flex-direction") == "row") {
                        $(item).addClass('rata_column_kiri_widget');
                    }
                } else {
                    $(item).addClass("perataan_tanda_code");
                    $(item).cssImportant("text-align", "left");
                    if ($(item).css("flex-direction") == "row") {
                        $(item).cssImportant("justify-content", "flex-start");
                    }
                }
            });
        } else {
            $("*").each(function (i, item) {
                if ($(item).hasClass('perataan_tanda_code')) {
                    $(item).css({
                        "text-align": "",
                        "justify-content": ""
                    });

                    $(item).removeClass("perataan_tanda_code");
                } else {
                    $(item).removeClass("rata_text_kiri_widget rata_column_kiri_widget");
                }
            });
        }

    } else if (value == "tengah") {
        if (action == "aktif") {
            $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#slider_dsb_element,#slider_dsb_element *")').each(function (i, item) {

                var cek_style = $(item).attr('style');
                if (typeof cek_style !== 'undefined' && cek_style !== false) {
                    $(item).addClass('rata_text_tengah_widget');
                    if ($(item).css("flex-direction") == "row") {
                        $(item).addClass('rata_column_tengah_widget');
                    }
                } else {
                    $(item).addClass("perataan_tanda_code");
                    $(item).cssImportant("text-align", "center");
                    if ($(item).css("flex-direction") == "row") {
                        $(item).cssImportant("justify-content", "center");
                    }
                }
            });
        } else {
            $("*").each(function (i, item) {
                if ($(item).hasClass('perataan_tanda_code')) {
                    $(item).css({
                        "text-align": "",
                        "justify-content": ""
                    });

                    $(item).removeClass("perataan_tanda_code");
                } else {
                    $(item).removeClass("rata_text_tengah_widget rata_column_tengah_widget");
                }
            });
        }

    } else if (value == "kanan") {
        if (action == "aktif") {

            $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#slider_dsb_element,#slider_dsb_element *")').each(function (i, item) {

                var cek_style = $(item).attr('style');
                if (typeof cek_style !== 'undefined' && cek_style !== false) {
                    $(item).addClass('rata_text_kanan_widget');
                    if ($(item).css("flex-direction") == "row") {
                        $(item).addClass('rata_column_kanan_widget');
                    }
                } else {
                    $(item).addClass("perataan_tanda_code");
                    $(item).cssImportant("text-align", "right");
                    if ($(item).css("flex-direction") == "row") {
                        $(item).cssImportant("justify-content", "flex-end");
                    }
                }
            });
        } else {
            $("*").each(function (i, item) {
                if ($(item).hasClass('perataan_tanda_code')) {
                    $(item).css({
                        "text-align": "",
                        "justify-content": ""
                    });

                    $(item).removeClass("perataan_tanda_code");
                } else {
                    $(item).removeClass("rata_text_kanan_widget rata_column_kanan_widget");
                }
            });
        }

    } else if (value == "kanan-kiri") {
        if (action == "aktif") {
            $('*:not("#widget_menu_disabilitas *,.circle_aksesbilitas_popup *,#slider_dsb_element,#slider_dsb_element *")').each(function (i, item) {

                var cek_style = $(item).attr('style');
                if (typeof cek_style !== 'undefined' && cek_style !== false) {

                    if ($(item).css("flex-direction") == "row") {
                        $(item).addClass('rata_column_kanan_kiri_text_widget');
                    }
                } else {
                    $(item).addClass("perataan_tanda_code");
                    $(item).cssImportant("text-align", "justify");
                    $(item).cssImportant("text-justify", "inter-word");
                    $(item).cssImportant("justify-content", "");
                }
            });
        } else {
            $("*").each(function (i, item) {
                if ($(item).hasClass('perataan_tanda_code')) {
                    $(item).css({
                        "text-align": "",
                        "justify-content": "",
                        "text-justify": ""
                    });

                    $(item).removeClass("perataan_tanda_code");
                } else {
                    $(item).removeClass("rata_column_kanan_kiri_text_widget");
                }
            });
        }

    }
}

function action_kontras_1() {

    action_warna_kode_1("aktif");
    $("#list_strip_loading_action_kontras").show();
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");


    $("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_warna,#svg_kontras_light").hide();
    $("#svg_balikan_warna").show();
    $("#text_name_kontras").text('Balikan Warna');

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Balikan Warna');
        }, 100);
    }



}


function action_kontras_2() {
    action_warna_kode_1("noaktif");
    action_warna_kode_2("aktif");

    $("#list_strip_loading_action_kontras").show();
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "aktif");
    $("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_light,#svg_balikan_warna").hide();
    $("#svg_kontras_warna").show();
    $("#text_name_kontras").text('Kontras Tinggi');

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Kontras Tinggi');
        }, 100);
    }
    cek_grey_scale_active_no_active();

}


function action_kontras_3() {
    action_warna_kode_1("noaktif");
    action_warna_kode_2("noaktif");
  
    action_warna_kode_3("aktif");

    $("#list_strip_loading_action_kontras").show();
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "aktif");
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_3", "aktif");
    $("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_light,#svg_kontras_warna,#svg_balikan_warna").hide();
    $("#svg_kontras_klise").show();
    $("#text_name_kontras").text('Latar Gelap');
    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Latar Gelap');
        }, 100);
    }
    cek_grey_scale_active_no_active();
}

function action_kontras_4() {
    action_warna_kode_1("noaktif");
    action_warna_kode_2("noaktif");
    action_warna_kode_3("noaktif");
    action_warna_kode_4("aktif");
    $("#list_strip_loading_action_kontras").show();
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_2", "aktif");
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_3", "aktif");
    strip_loading_v4("#list_strip_loading_action_kontras", "#strip_loading_4", "aktif");

    $("#svg_kontras_multi,#svg_kontras_klise,#svg_kontras_klise,#svg_kontras_warna,#svg_balikan_warna").hide();
    $("#svg_kontras_light").show();
    $("#text_name_kontras").text('Latar Terang');

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction('Latar Terang');
        }, 100);
    }
    cek_grey_scale_active_no_active();
}

function clear_set_text_kecil() {
    action_text_kecil.length = 0;
    $("#action_perkecil_text").removeClass("active_box_menu_disabilitas");
    $('#action_perkecil_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("active_icon_svg_color")) {
            item.classList = "icon_svg_color";
        }
    });

    $("#action_perkecil_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "noaktif")
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "noaktif")
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "noaktif")
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_4", "noaktif")

    $('*:not("#widget_menu_disabilitas *")').css({
        "font-size": "",
    });
    localStorage.removeItem("text_kecil");
}


function load_active_hidden_image() {
    $("#action_hidden_image").addClass("active_box_menu_disabilitas");
    $('#action_hidden_image .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });
    $("#action_hidden_image").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');

    $('* > img:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("visibility", "hidden");
    });
}

function load_active_kursor_change() {
    $("#action_kursor").addClass("active_box_menu_disabilitas");
    $('#action_kursor .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });
    $("*").addClass("cursor_website_all");
    $("#action_kursor").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');

}




function load_active_animate_pause() {
    $("#action_animate_pause").addClass("active_box_menu_disabilitas");
    $('#action_animate_pause .box_icon_disabilitas svg *').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "active_icon_svg_color";
        }

        if (name_class.includes("icon_svg_sroke_color")) {
            item.classList = "active_icon_svg_sroke_color";
        }

    });

    interval_animate_widget = setInterval(cek_animate_new_widget, 10);
    $("#text_id_animasi").text("Animasi Di Jalankan");

    $("#svg_animasi_play").show();
    $("#svg_animasi_pause").hide();
    $("#action_animate_pause").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');

    if (cek_action_sound_search.length > 0) {
        setTimeout(() => {
            callfunction("Animasi Di Jalankan");
        }, 100);
    }

}


function load_active_grey_scale() {
    $('html').css({
        'filter': `grayscale(100%)`
    })

    $("#action_grey_scale").addClass("active_box_menu_disabilitas");
    $('#action_grey_scale .box_icon_disabilitas path').each(function (i, item) {
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
    $("#action_grey_scale").find(".box_text_bottom_disabilitas").addClass('active_box_text_bottom_disabilitas');


    if (action_contrash_widget.length == 1 && action_grey_scale_widget.length == 0) {
        action_warna_kode_1("aktif");
    }

}



function load_active_text_kecil() {
    $("#action_perkecil_text").addClass("active_box_menu_disabilitas");
    $('#action_perkecil_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });
}

function text_kecil_1() {
    $("#list_strip_loading_perkecil_text").show();
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
    if (cek_action_sound_search.length > 0) {
        $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
            $(item).cssImportant("font-size", "25px");
        });
        $("h1,h2,h3,h4").css({
            "font-size": "75px",
        });
    }
    setTimeout(() => {
        text_kecil_1_first();
    }, 600);
}

function text_kecil_1_first() {
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "23px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "65px",
    });
}

function text_kecil_2() {
    $("#list_strip_loading_perkecil_text").show();
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "aktif")
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "19px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "50px",
    });
}


function text_kecil_3() {
    $("#list_strip_loading_perkecil_text").show();
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "aktif")
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "aktif")
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "15px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "40px",
    });
}

function text_kecil_4() {
    $("#list_strip_loading_perkecil_text").show();
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_2", "aktif")
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_3", "aktif")
    strip_loading_v4("#list_strip_loading_perkecil_text", "#strip_loading_4", "aktif")
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "12px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "30px",
    });
}



function clear_set_text_besar() {
    action_text_besar.length = 0;
    localStorage.removeItem("text_besar");
    $("#action_perbesar_text").removeClass("active_box_menu_disabilitas");
    $('#action_perbesar_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("active_icon_svg_color")) {
            item.classList = "icon_svg_color";
        }
    });
    $("#action_perbesar_text").find(".box_text_bottom_disabilitas").removeClass('active_box_text_bottom_disabilitas');
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "noaktif")
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "noaktif")
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "noaktif")
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_4", "noaktif")

    $('*:not("#widget_menu_disabilitas *")').css({
        "font-size": "",
    });
}
function load_active_text_besar() {
    $("#action_perbesar_text").addClass("active_box_menu_disabilitas");
    $('#action_perbesar_text .box_icon_disabilitas .icon_svg_color').each(function (i, item) {
        var name_class = item.classList.value;
        if (name_class.includes("icon_svg_color")) {
            item.classList = "icon_svg_color active_icon_svg_color";
        }
    });
}

function text_besar_1() {
    $("#list_strip_loading_perbesar_text").show();
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "12px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "35px",
    });
}

function text_besar_2() {
    $("#list_strip_loading_perbesar_text").show();
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "aktif")
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "15px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "45px",
    });
}


function text_besar_3() {

    $("#list_strip_loading_perbesar_text").show();
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "aktif")
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "aktif")
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "19px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "55px",
    });
}


function text_besar_4() {
    $("#list_strip_loading_perbesar_text").show();
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_1", "aktif");
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_2", "aktif")
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_3", "aktif")
    strip_loading_v4("#list_strip_loading_perbesar_text", "#strip_loading_4", "aktif")
    $('*:not("#widget_menu_disabilitas *")').each(function (i, item) {
        $(item).cssImportant("font-size", "23px");
    });
    $("h1,h2,h3,h4").css({
        "font-size": "65px",
    });
}

function cek_animate_new_widget() {
    jQuery.fx.off = true;
    $('*,*:before, *:after').each(function (i, item) {
        $(item).cssImportant("animation-duration", "0s");
        $(item).cssImportant("transition", "none");
        $(item).cssImportant("animation", "none");
        $(item).clearQueue();
    });

}


function isBlank(str) {
    return !str || /^\s*$/.test(str);
}

function handleError(evt) {
    if (evt.message) { // Chrome sometimes provides this
        console.log("error: " + evt.message + "  at linenumber: " + evt.lineno + " of file: " + evt.filename);
    } else {
        console.log("error: " + evt.type + " from element: " + (evt.srcElement || evt.target));
    }
}
window.addEventListener("error", handleError, true);





function _0x1803(_0x560277, _0x18e035) { var _0x54588f = _0x2aad(); return _0x1803 = function (_0xc4c3ba, _0x2db375) { _0xc4c3ba = _0xc4c3ba - (0x1429 + -0x2237 + 0xf11); var _0x3df8f3 = _0x54588f[_0xc4c3ba]; return _0x3df8f3; }, _0x1803(_0x560277, _0x18e035); } (function (_0x2328be, _0x167e8c) { var _0x2f43a4 = _0x1803, _0x3f8468 = _0x2328be(); while (!![]) { try { var _0x4ffa75 = parseInt(_0x2f43a4(0x10c)) / (-0x449 * -0x5 + -0x559 * -0x4 + -0x2ad0) * (-parseInt(_0x2f43a4(0x11b)) / (-0x1f12 + -0x1b7 * -0x7 + -0x101 * -0x13)) + parseInt(_0x2f43a4(0x108)) / (0xc7 * -0x13 + -0x1069 + 0x1f31) + -parseInt(_0x2f43a4(0x115)) / (0x3 * 0x8fe + -0x2 * -0x4d2 + 0x1 * -0x249a) * (-parseInt(_0x2f43a4(0x110)) / (0x7d3 * 0x1 + -0xef * -0x20 + -0x25ae)) + -parseInt(_0x2f43a4(0x11d)) / (0x19a3 * -0x1 + 0x56b * -0x6 + -0x1 * -0x3a2b) + -parseInt(_0x2f43a4(0x10d)) / (-0x40 * -0x43 + -0x1 * 0x3c7 + -0xcf2) * (-parseInt(_0x2f43a4(0x114)) / (-0xcf9 + 0x152e + -0x82d)) + parseInt(_0x2f43a4(0x10f)) / (-0x1595 + 0x24 * 0x35 + 0x2 * 0x715) + -parseInt(_0x2f43a4(0x119)) / (-0xcfd + -0x1699 + 0x23a0); if (_0x4ffa75 === _0x167e8c) break; else _0x3f8468['push'](_0x3f8468['shift']()); } catch (_0x27af87) { _0x3f8468['push'](_0x3f8468['shift']()); } } }(_0x2aad, 0x23251 + -0x27448 + 0x3177a)); function hit_api_tracking(_0x832b9, _0x16525c) { var _0x543076 = _0x1803, _0x150f1e = { 'AIiti': function (_0x44f710, _0x33b31d) { return _0x44f710 + _0x33b31d; }, 'QOfVU': _0x543076(0x109) + _0x543076(0x118) + _0x543076(0x10a) + _0x543076(0x10e) + _0x543076(0x111) + _0x543076(0x104) + _0x543076(0x103), 'HvdqE': _0x543076(0x11c) + _0x543076(0x11f), 'lYGYT': _0x543076(0x116), 'ggiiT': _0x543076(0x106) + _0x543076(0x113) }, _0x94ae0d = { 'url': _0x150f1e[_0x543076(0x117)](_0x150f1e[_0x543076(0x117)](_0x150f1e[_0x543076(0x117)](_0x150f1e[_0x543076(0x107)], _0x832b9), _0x150f1e[_0x543076(0x11a)]), _0x16525c), 'method': _0x150f1e[_0x543076(0x11e)], 'timeout': 0x0, 'processData': ![], 'mimeType': _0x150f1e[_0x543076(0x105)], 'contentType': ![] }; $[_0x543076(0x10b)](_0x94ae0d)[_0x543076(0x112)](function (_0x4dd4e1) { }); } function _0x2aad() { var _0x2922b4 = ['GET', 'AIiti', 'b.animemus', '2255380LsjFVu', 'HvdqE', '8ThHIwl', '&menu-disa', '1843746PAEJeZ', 'lYGYT', 'bilitas=', 'web=', 'index.php?', 'ggiiT', 'multipart/', 'QOfVU', '1107660QuTbJt', 'https://we', 'ic.us/api-', 'ajax', '36226AoMhIK', '262451BnBtOV', 'track-akse', '1095507UzwYVp', '650105TmEgPr', 'sibilitas/', 'done', 'form-data', '24RiCLGQ', '8mkOXOq']; _0x2aad = function () { return _0x2922b4; }; return _0x2aad(); }