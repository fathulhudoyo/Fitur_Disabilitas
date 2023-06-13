<style>
    .btn-container {
        margin-bottom: 10px;
        text-align: center;
    }
    .mycheckbox {
        font-size: 12px;
        color: black;
        font-weight: 500;
    }
    .greyscaleall {
        webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);

    }
    .btn-color-mode-switch {
        display: inline-block;
        margin: 0px;
        position: relative;
    }
    .btn-color-mode-switch>label.btn-color-mode-switch-inner {
        margin: 0px;
        width: 170px;
        height: 26px;
        background: #E0E0E0;
        border-radius: 26px;
        overflow: hidden;
        position: relative;
        transition: all 0.3s ease;
        display: block;
    }
    .btn-color-mode-switch>label.btn-color-mode-switch-inner:before {
        content: attr(data-on);
        cursor: pointer;
        position: absolute;
        font-size: 12px;
        font-weight: bold;
        top: 5px;
        right: 25px;
        margin-bottom: 5px;
    }
    .btn-color-mode-switch>label.btn-color-mode-switch-inner:after {
        content: attr(data-off);
        cursor: pointer;
        width: 85px;
        height: 22px;
        font-size: 12px;
        background: #fff;
        border-radius: 26px;
        position: absolute;
        left: 2px;
        top: 2px;
        font-weight: bold;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0px 0px 6px -2px #111;
        padding: 2px 0px;
        margin-bottom: 10px;
    }
    .btn-color-mode-switch input[type="checkbox"] {
        cursor: pointer;
        width: 70px;
        height: 25px;
        opacity: 0;
        position: absolute;
        top: 0;
        z-index: 1;
        padding: 2px 0px;
        margin: 0px;
    }
    .btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner {
        background: #E0E0E0;
        color: black;
        font-weight: bold;
        font-size: 12px;
    }
    .btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner:after {
        content: attr(data-on);
        left: 83px;
        background: white;
        font-weight: bold;
        font-size: 12px;
    }
    .btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner:before {
        content: attr(data-off);
        right: auto;
        left: 15px;
        color: black;
        font-weight: bold;
        font-size: 12px;
    }
    .btn-color-mode-switch input[type="checkbox"]:checked~.alert {
        display: block;
    }
    .toolbar-disabilitas {
        position: fixed;
        top: 6%;
        left: 0;
        z-index: 999999999;
        height: 1px;
        width: -180px;
        text-align: center;
        background: transparent !important;
        background-color: transparent !important;
    }
    .open-toolbar {
        margin-top: 10%;
        padding-top: 8px;
        padding-right: 5px;
        padding-left: 5px;
        padding-bottom: 3px;
        height: 50px;
        border: none;
        width: 50px;
    }
    .toolbar-disabilitas .open-toolbar {
        background: #4054b2;
    }
    .toolbar-disabilitas .groupcontenttoolbar {
        transform: translateX(-180px);
        transition: transform 0.6s;
    }
    .toolbar-disabilitas.show-toolbar .groupcontenttoolbar {
        transform: translateX(0px);
    }
    .contenttoolbar_disabilitas {
        margin-top: 10%;
        padding-top: 15px;
        display: flex;
        flex-direction: column;
        height: max-content;
        border: 1px solid black;
        box-shadow: 0 10px 10px rgb(0 0 0 / 0.2);
        background-color: white;
        width: 180px;
        word-break: break-all;
        overflow: hidden;
    }
    .groupcontenttoolbar {
        display: flex;
        flex-direction: row;
        height: 1px;
        background-color: transparent !important;
    }
    .titletools {
        font-size: 13px !important;
        font-weight: bold;
        margin-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
        color: black;
    }
    .bodytools {
        left: 0;
        height: max-content;
        width: 100%;
        margin-bottom: 10px;
    }
    .subtitletools {
        font-size: 12px !important;
        margin-bottom: 5px;
        cursor: pointer;
        left: 0;
        font-family: Arial, Helvetica, sans-serif;
        padding-left: 10px;
        text-align: left;
        color: black
    }
    .subtitletoolsactive {
        background-color: black;
        font-size: 12px !important;
        margin-bottom: 5px;
        cursor: pointer;
        left: 0;
        padding-top: 5px;
        padding-left: 10px;
        padding-bottom: 5px;
        text-align: left;
        color: white;
        font-weight: bold;
    }
    .subtitletools:hover,
    .subtitletools:focus,
    .subtitletools:active {
        background-color: black;
        color: white;
        font-weight: bold;
        font-size: 12;
        max-width: 100%;
        padding-top: 5px;
        padding-left: 10px;
        padding-bottom: 5px;
    }
    .flexrowdata {
        display: flex;
        flex-direction: row;
        height: auto;
        width: auto;
    }
    @media only screen and (max-width: 900px) {
        .toolbar-disabilitas {
            top: 11%;
        }
    }
</style>


<template>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link href="https://ppid.jakarta.go.id/assets/home/ppidNew/css/bootstrap.min.css" rel="stylesheet">
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
  <div>
    
<span id="loadmodaldisabilitas"></span>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    const plugin1 = document.createElement("script");
    plugin1.setAttribute(
      "src",
      "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"

    );

    plugin1.async = true;
    document.head.appendChild(plugin1);



    const plugin2 = document.createElement("script");
    plugin2.setAttribute(
      "src",
      "https://code.responsivevoice.org/responsivevoice.js?key=N0bzbTAK"
    );

    plugin2.async = true;
    document.head.appendChild(plugin2);


    const plugin3 = document.createElement("script");
    plugin3.setAttribute(
      "src",
      "https://vue.animemusic.us/loadattdisabilitas.js"
    );

    plugin3.async = true;
    document.head.appendChild(plugin3);
        

    

  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
