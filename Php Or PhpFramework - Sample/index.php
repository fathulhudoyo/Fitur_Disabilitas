<script src="jquery.min.js"></script>
<script src="bootstrap.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link href="https://ppid.jakarta.go.id/assets/home/ppidNew/css/bootstrap.min.css" rel="stylesheet">
<style>
  .btn-container {
    margin-bottom: 10px;
    text-align: center;
  }

  .greyscaleall {
    webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);

  }

  .mycheckbox {
    font-size: 12px;
    color: black;
    font-weight: 500;
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
    z-index: 999;
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
    height: 100%;
    width: 100%;
  }

  .flexrowtext {
    display: flex;
    flex-direction: column;

    height: 100%;
justify-content: center;
    align-items: center;
    width: 100%;
  }

  .datatextinfo {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;

  }

  .texttulisan {
    color: black;
    font-size: 18px;
    font-weight: bold;
  }

  @media only screen and (max-width: 900px) {
    .toolbar-disabilitas {
      top: 11%;
    }
  }
</style>
<!--script src="https://code.responsivevoice.org/responsivevoice.js?key=N0bzbTAK"></script-->
<div class="flexrowtext">
  <div class="datatextinfo">
  <div class="texttulisan">xxxxxxxxxxxxxx asdsad</div>
 
  </div>
  <div class="datatextinfo">

    <div class="texttulisan">mantul</div>
  </div>
  <div class="datatextinfo">

    <p class="texttulisan">mantul</p>
  </div>
</div>
<span id="loadmodaldisabilitas"></span>
<script type="text/javascript">
  /*
(function (d) {
  var s = d.createElement("script");
  s.setAttribute("data-account", "sxcf6MvtVf");
  s.setAttribute("src", "https://cdn.userway.org/widget.js");
  (d.body || d.head).appendChild(s);
})(document);*/

  /*
  function speachmobile(value) {
    var voicecek = localStorage.getItem("permismobile");
    if (voicecek != null && voicecek == "on") {
      if (responsiveVoice.voiceSupport()) {
        responsiveVoice.speak(value, "Indonesian Female");
      }
    }
  }*/
  /*(function (d) {
      var s = d.createElement("script");
      s.setAttribute("data-account", "sxcf6MvtVf");
      s.setAttribute("src", "https://cdn.userway.org/widget.js");
      (d.body || d.head).appendChild(s);
    })(document);*/
  //(function(d){var s = d.createElement("script");s.setAttribute("data-account", "sxcf6MvtVf");s.setAttribute("src", "https://cdn.userway.org/widget.js");(d.body || d.head).appendChild(s);})(document)

  localStorage.removeItem("permismobile");
  localStorage.removeItem("permisvoice");
  var arraybase64 = [];

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
      
  /*
    var obj = {
      handlePlayMusic: function(music) {
        try {
          this.audio.pause();
          this.audio.currentTime = 0;
        } catch (e) {
          console.log(e);
        }
    
        this.audio = new Audio(music);
        this.audio.play()
      },
      handleStopMusic: function() {
    
        this.audio.pause()
      }
    };*/
  /*
  var obj = {
    handlePlayMusic: async function (music) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.load();
      } catch (e) {
        console.log(e);
      }
      this.audio = await new Audio(music);
    //  this.audio.currentTime = 0;
      //  var isPlaying =   this.audio.currentTime > 0 && !  this.audio.paused && !  this.audio.ended
      //   &&   this.audio.readyState >   this.audio.HAVE_CURRENT_DATA;

      await this.audio.play();
    },
    handleStopMusic: async function () {
      await this.audio.pause();
    },
  };*/
  var audio;


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
  async function hitapivoice(valueText) {
    var voicecek = localStorage.getItem("permismobile");

    if (voicecek != null && voicecek == "on") {
      var API_KEY = "";
      const spanishResponse = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              text: valueText,
            },
            voice: {
              languageCode: "id-ID",
              name: "id-ID-Wavenet-D",
              ssmlGender: "FEMALE",
            },
            audioConfig: {
              audioEncoding: "MP3",
            },
          }),
        }
      );

      const spanishAudioData = await spanishResponse.json();
      var myaudionew = `data:audio/mp3;base64,${spanishAudioData.audioContent}`;
      await playAudio(myaudionew);
    }
  }
  async function speachmobile(value) {
    var voicecek = localStorage.getItem("permismobile");
    if (voicecek != null && voicecek == "on") {
    if (getOS() == "iOS") {
      setTimeout(async () => {
        await hitapivoice(value);
      }, 250);
    } else {
      hitapivoice(value);
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

  if (!window.James) {
    James = {};
  }
  James.Selector = {};
  James.Selector.mouseup = function() {
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
      speachmobile(textvalue);
    }
  };
  $(document).ready(function() {
    $(document).bind("mouseup", James.Selector.mouseup);
  });
  $(document).ready(function() {
    document.addEventListener("selectionchange", function(event) {
      var voicecek = localStorage.getItem("permismobile");
      if (voicecek != null && voicecek == "on") {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
          return;
        }
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const text = selection.toString();
        if (!isBlank(text) || text != undefined || text != "") {
          speachmobile(text);
          //   speechSynthesis.speak(new SpeechSynthesisUtterance('Hello World'));
        }
      }
      //  });
      //window.getSelection().removeAllRanges();
    });
  });

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }
  var dataspeachweb = `
   
              
              
              
              <div class="subtitletools" id="webspeach">
              <div class="flexrowdata">
           
           <span><svg version="1.1" class='fontawesomesvg' width="1em"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448">
               <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zm2 226.3c37.1 22.4 62 63.1 62 109.7s-24.9 87.3-62 109.7c-7.6 4.6-17.4 2.1-22-5.4s-2.1-17.4 5.4-22C269.4 401.5 288 370.9 288 336s-18.6-65.5-46.5-82.3c-7.6-4.6-10-14.4-5.4-22s14.4-10 22-5.4zm-91.9 30.9c6 2.5 9.9 8.3 9.9 14.8V400c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L113.4 376H80c-8.8 0-16-7.2-16-16V312c0-8.8 7.2-16 16-16h33.4l35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5zm51 34.9c6.6-5.9 16.7-5.3 22.6 1.3C249.8 304.6 256 319.6 256 336s-6.2 31.4-16.3 42.7c-5.9 6.6-16 7.1-22.6 1.3s-7.1-16-1.3-22.6c5.1-5.7 8.1-13.1 8.1-21.3s-3.1-15.7-8.1-21.3c-5.9-6.6-5.3-16.7 1.3-22.6z"/>
               </svg></span>
              &nbsp;&nbsp;<div id="twebspeach" class="aksestexttools">Moda Suara</div>
             </div>
             </div>
              `;

  var datamobileweb = `
  
  <div class="subtitletools" id="mobileapp">
  <div class="flexrowdata">
  
  <span><svg version="1.1" class='fontawesomesvg' width="1em"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448">
   <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zm2 226.3c37.1 22.4 62 63.1 62 109.7s-24.9 87.3-62 109.7c-7.6 4.6-17.4 2.1-22-5.4s-2.1-17.4 5.4-22C269.4 401.5 288 370.9 288 336s-18.6-65.5-46.5-82.3c-7.6-4.6-10-14.4-5.4-22s14.4-10 22-5.4zm-91.9 30.9c6 2.5 9.9 8.3 9.9 14.8V400c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L113.4 376H80c-8.8 0-16-7.2-16-16V312c0-8.8 7.2-16 16-16h33.4l35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5zm51 34.9c6.6-5.9 16.7-5.3 22.6 1.3C249.8 304.6 256 319.6 256 336s-6.2 31.4-16.3 42.7c-5.9 6.6-16 7.1-22.6 1.3s-7.1-16-1.3-22.6c5.1-5.7 8.1-13.1 8.1-21.3s-3.1-15.7-8.1-21.3c-5.9-6.6-5.3-16.7 1.3-22.6z"/>
   </svg></span>
  &nbsp;&nbsp;<div id="twebspeach" class="aksestexttools">Moda Suara</div>
  </div>
  </div>
  
        `;
  var logicspeachweb = getOS() == "Windows" ? dataspeachweb : datamobileweb;
  var toolbardisabilitas =
    `
  <div class="toolbar-disabilitas">
  <div class="groupcontenttoolbar" id="checklangmenu">
      <div class="contenttoolbar_disabilitas" id="groupcekmenu">
          <div class="titletools" id="taccessbility">
          Sarana
              </div>
         
              <div class="btn-container">
      <div class="mycheckbox switch btn-color-mode-switch" id="tmulticheckboxlang">
          <input type="checkbox" id="checklang" value="1">
          <label id="tmycheckbox" for="checklang" data-on="Inggris" data-off="Indonesia" class="btn-color-mode-switch-inner"></label>
      
  </div>
       </div>
          <div class="bodytools">
          ` +
    logicspeachweb +
    `
              <div class="subtitletools" id="increasetext">
              <div class="flexrowdata">
             <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M256 200v16c0 4.25-3.75 8-8 8h-56v56c0 4.25-3.75 8-8 8h-16c-4.25 0-8-3.75-8-8v-56h-56c-4.25 0-8-3.75-8-8v-16c0-4.25 3.75-8 8-8h56v-56c0-4.25 3.75-8 8-8h16c4.25 0 8 3.75 8 8v56h56c4.25 0 8 3.75 8 8zM288 208c0-61.75-50.25-112-112-112s-112 50.25-112 112 50.25 112 112 112 112-50.25 112-112zM416 416c0 17.75-14.25 32-32 32-8.5 0-16.75-3.5-22.5-9.5l-85.75-85.5c-29.25 20.25-64.25 31-99.75 31-97.25 0-176-78.75-176-176s78.75-176 176-176 176 78.75 176 176c0 35.5-10.75 70.5-31 99.75l85.75 85.75c5.75 5.75 9.25 14 9.25 22.5z" "=""></path></svg></span>
             &nbsp;&nbsp;<div id="tincreasetext" class="aksestexttools">Perbesar Teks</div>
             </div>
              </div>
              <div class="subtitletools"  id="decreasetext">
              <div class="flexrowdata">
             <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M256 200v16c0 4.25-3.75 8-8 8h-144c-4.25 0-8-3.75-8-8v-16c0-4.25 3.75-8 8-8h144c4.25 0 8 3.75 8 8zM288 208c0-61.75-50.25-112-112-112s-112 50.25-112 112 50.25 112 112 112 112-50.25 112-112zM416 416c0 17.75-14.25 32-32 32-8.5 0-16.75-3.5-22.5-9.5l-85.75-85.5c-29.25 20.25-64.25 31-99.75 31-97.25 0-176-78.75-176-176s78.75-176 176-176 176 78.75 176 176c0 35.5-10.75 70.5-31 99.75l85.75 85.75c5.75 5.75 9.25 14 9.25 22.5z"></path></svg></span>
              &nbsp;&nbsp;<div id="tdecreasetext"  class="aksestexttools">Perkecil Teks</div>
              </div>
              </div>
              <div class="subtitletools"  id="egrayscale">
              <div class="flexrowdata">
              <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M15.75 384h-15.75v-352h15.75v352zM31.5 383.75h-8v-351.75h8v351.75zM55 383.75h-7.75v-351.75h7.75v351.75zM94.25 383.75h-7.75v-351.75h7.75v351.75zM133.5 383.75h-15.5v-351.75h15.5v351.75zM165 383.75h-7.75v-351.75h7.75v351.75zM180.75 383.75h-7.75v-351.75h7.75v351.75zM196.5 383.75h-7.75v-351.75h7.75v351.75zM235.75 383.75h-15.75v-351.75h15.75v351.75zM275 383.75h-15.75v-351.75h15.75v351.75zM306.5 383.75h-15.75v-351.75h15.75v351.75zM338 383.75h-15.75v-351.75h15.75v351.75zM361.5 383.75h-15.75v-351.75h15.75v351.75zM408.75 383.75h-23.5v-351.75h23.5v351.75zM424.5 383.75h-8v-351.75h8v351.75zM448 384h-15.75v-352h15.75v352z"></path></svg></span>
              &nbsp;&nbsp;<div id="tegrayscale"  class="aksestexttools">Skala Abu - Abu</div>
              </div>
              </div>
              <div class="subtitletools" id="hcontrash">
              <div class="flexrowdata">
              <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M192 360v-272c-75 0-136 61-136 136s61 136 136 136zM384 224c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192z" "=""></path></svg></span>
              &nbsp;&nbsp;<div id="thcontrash"  class="aksestexttools">Kontras Tinggi</div>
              </div>
              </div>
              <div class="subtitletools" id="ncontrash">
              <div class="flexrowdata">
              <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M416 240c-23.75-36.75-56.25-68.25-95.25-88.25 10 17 15.25 36.5 15.25 56.25 0 61.75-50.25 112-112 112s-112-50.25-112-112c0-19.75 5.25-39.25 15.25-56.25-39 20-71.5 51.5-95.25 88.25 42.75 66 111.75 112 192 112s149.25-46 192-112zM236 144c0-6.5-5.5-12-12-12-41.75 0-76 34.25-76 76 0 6.5 5.5 12 12 12s12-5.5 12-12c0-28.5 23.5-52 52-52 6.5 0 12-5.5 12-12zM448 240c0 6.25-2 12-5 17.25-46 75.75-130.25 126.75-219 126.75s-173-51.25-219-126.75c-3-5.25-5-11-5-17.25s2-12 5-17.25c46-75.5 130.25-126.75 219-126.75s173 51.25 219 126.75c3 5.25 5 11 5 17.25z"></path></svg></span>
              &nbsp;&nbsp;<div id="tncontrash"  class="aksestexttools">Latar Gelap</div>
              </div>
              </div>
              <div class="subtitletools"] id="lgcontrash">
              <div class="flexrowdata">
              <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M184 144c0 4.25-3.75 8-8 8s-8-3.75-8-8c0-17.25-26.75-24-40-24-4.25 0-8-3.75-8-8s3.75-8 8-8c23.25 0 56 12.25 56 40zM224 144c0-50-50.75-80-96-80s-96 30-96 80c0 16 6.5 32.75 17 45 4.75 5.5 10.25 10.75 15.25 16.5 17.75 21.25 32.75 46.25 35.25 74.5h57c2.5-28.25 17.5-53.25 35.25-74.5 5-5.75 10.5-11 15.25-16.5 10.5-12.25 17-29 17-45zM256 144c0 25.75-8.5 48-25.75 67s-40 45.75-42 72.5c7.25 4.25 11.75 12.25 11.75 20.5 0 6-2.25 11.75-6.25 16 4 4.25 6.25 10 6.25 16 0 8.25-4.25 15.75-11.25 20.25 2 3.5 3.25 7.75 3.25 11.75 0 16.25-12.75 24-27.25 24-6.5 14.5-21 24-36.75 24s-30.25-9.5-36.75-24c-14.5 0-27.25-7.75-27.25-24 0-4 1.25-8.25 3.25-11.75-7-4.5-11.25-12-11.25-20.25 0-6 2.25-11.75 6.25-16-4-4.25-6.25-10-6.25-16 0-8.25 4.5-16.25 11.75-20.5-2-26.75-24.75-53.5-42-72.5s-25.75-41.25-25.75-67c0-68 64.75-112 128-112s128 44 128 112z"></path></svg></span>
              &nbsp;&nbsp;<div id="tlgcontrash"  class="aksestexttools">Latar Terang</div>
              </div>
              </div>
              <div class="subtitletools" id="readablefont">
              <div class="flexrowdata">
               <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M181.25 139.75l-42.5 112.5c24.75 0.25 49.5 1 74.25 1 4.75 0 9.5-0.25 14.25-0.5-13-38-28.25-76.75-46-113zM0 416l0.5-19.75c23.5-7.25 49-2.25 59.5-29.25l59.25-154 70-181h32c1 1.75 2 3.5 2.75 5.25l51.25 120c18.75 44.25 36 89 55 133 11.25 26 20 52.75 32.5 78.25 1.75 4 5.25 11.5 8.75 14.25 8.25 6.5 31.25 8 43 12.5 0.75 4.75 1.5 9.5 1.5 14.25 0 2.25-0.25 4.25-0.25 6.5-31.75 0-63.5-4-95.25-4-32.75 0-65.5 2.75-98.25 3.75 0-6.5 0.25-13 1-19.5l32.75-7c6.75-1.5 20-3.25 20-12.5 0-9-32.25-83.25-36.25-93.5l-112.5-0.5c-6.5 14.5-31.75 80-31.75 89.5 0 19.25 36.75 20 51 22 0.25 4.75 0.25 9.5 0.25 14.5 0 2.25-0.25 4.5-0.5 6.75-29 0-58.25-5-87.25-5-3.5 0-8.5 1.5-12 2-15.75 2.75-31.25 3.5-47 3.5z"></path></svg></span>
               &nbsp;&nbsp;<div id="treadablefont"  class="aksestexttools">Tulisan Dapat Dibaca</div>
               </div>
              </div>
              <div class="subtitletools" id="linkunderline">
              <div class="flexrowdata">
               <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M364 304c0-6.5-2.5-12.5-7-17l-52-52c-4.5-4.5-10.75-7-17-7-7.25 0-13 2.75-18 8 8.25 8.25 18 15.25 18 28 0 13.25-10.75 24-24 24-12.75 0-19.75-9.75-28-18-5.25 5-8.25 10.75-8.25 18.25 0 6.25 2.5 12.5 7 17l51.5 51.75c4.5 4.5 10.75 6.75 17 6.75s12.5-2.25 17-6.5l36.75-36.5c4.5-4.5 7-10.5 7-16.75zM188.25 127.75c0-6.25-2.5-12.5-7-17l-51.5-51.75c-4.5-4.5-10.75-7-17-7s-12.5 2.5-17 6.75l-36.75 36.5c-4.5 4.5-7 10.5-7 16.75 0 6.5 2.5 12.5 7 17l52 52c4.5 4.5 10.75 6.75 17 6.75 7.25 0 13-2.5 18-7.75-8.25-8.25-18-15.25-18-28 0-13.25 10.75-24 24-24 12.75 0 19.75 9.75 28 18 5.25-5 8.25-10.75 8.25-18.25zM412 304c0 19-7.75 37.5-21.25 50.75l-36.75 36.5c-13.5 13.5-31.75 20.75-50.75 20.75-19.25 0-37.5-7.5-51-21.25l-51.5-51.75c-13.5-13.5-20.75-31.75-20.75-50.75 0-19.75 8-38.5 22-52.25l-22-22c-13.75 14-32.25 22-52 22-19 0-37.5-7.5-51-21l-52-52c-13.75-13.75-21-31.75-21-51 0-19 7.75-37.5 21.25-50.75l36.75-36.5c13.5-13.5 31.75-20.75 50.75-20.75 19.25 0 37.5 7.5 51 21.25l51.5 51.75c13.5 13.5 20.75 31.75 20.75 50.75 0 19.75-8 38.5-22 52.25l22 22c13.75-14 32.25-22 52-22 19 0 37.5 7.5 51 21l52 52c13.75 13.75 21 31.75 21 51z"></path></svg></span>
               &nbsp;&nbsp;<div id="tlinkunderline"  class="aksestexttools">Garis Bawahi Tautan</div>
               </div>
              </div>
  
              <div class="subtitletools" id="ratatulisan">
              <div class="flexrowdata">
              <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M384 1056v64q0 13-9.5 22.5T352 1152h-64q-13 0-22.5-9.5T256 1120v-64q0-13 9.5-22.5t22.5-9.5h64q13 0 22.5 9.5t9.5 22.5zm0-256v64q0 13-9.5 22.5T352 896h-64q-13 0-22.5-9.5T256 864v-64q0-13 9.5-22.5T288 768h64q13 0 22.5 9.5T384 800zm0-256v64q0 13-9.5 22.5T352 640h-64q-13 0-22.5-9.5T256 608v-64q0-13 9.5-22.5T288 512h64q13 0 22.5 9.5T384 544zm1152 512v64q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 1120v-64q0-13 9.5-22.5t22.5-9.5h960q13 0 22.5 9.5t9.5 22.5zm0-256v64q0 13-9.5 22.5T1504 896H544q-13 0-22.5-9.5T512 864v-64q0-13 9.5-22.5T544 768h960q13 0 22.5 9.5t9.5 22.5zm0-256v64q0 13-9.5 22.5T1504 640H544q-13 0-22.5-9.5T512 608v-64q0-13 9.5-22.5T544 512h960q13 0 22.5 9.5t9.5 22.5zm128 704V416q0-13-9.5-22.5T1632 384H160q-13 0-22.5 9.5T128 416v832q0 13 9.5 22.5t22.5 9.5h1472q13 0 22.5-9.5t9.5-22.5zm128-1088v1088q0 66-47 113t-113 47H160q-66 0-113-47T0 1248V160Q0 94 47 47T160 0h1472q66 0 113 47t47 113z"/></svg></span>
              &nbsp;&nbsp;<div id="tratatulisan"  class="aksestexttools">Rata Tulisan</div>
              </div>
              </div>
  
              <div class="subtitletools" id="resetdisabilitas">
              <div class="flexrowdata">
              <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M384 224c0 105.75-86.25 192-192 192-57.25 0-111.25-25.25-147.75-69.25-2.5-3.25-2.25-8 0.5-10.75l34.25-34.5c1.75-1.5 4-2.25 6.25-2.25 2.25 0.25 4.5 1.25 5.75 3 24.5 31.75 61.25 49.75 101 49.75 70.5 0 128-57.5 128-128s-57.5-128-128-128c-32.75 0-63.75 12.5-87 34.25l34.25 34.5c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-112c-8.75 0-16-7.25-16-16v-112c0-6.5 4-12.25 10-14.75 5.75-2.5 12.75-1.25 17.25 3.5l32.5 32.25c35.25-33.25 83-53 132.25-53 105.75 0 192 86.25 192 192z"></path></svg></span>
              &nbsp;&nbsp;<div id="tidreset"  class="aksestexttools">Atur Ulang</div>
              </div>
              </div>
  
  
          </div>
      </div>
      <button type="button" class="open-toolbar"  onmouseout="callfunction('Open Toolbar')">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" enable-background="new 0 0 100 100" viewBox="0 0 100 100" fill="currentColor" width="1em">
              <g>
                  <path fill="#FFFFFF" d="M60.4,78.9c-2.2,4.1-5.3,7.4-9.2,9.8c-4,2.4-8.3,3.6-13,3.6c-6.9,0-12.8-2.4-17.7-7.3c-4.9-4.9-7.3-10.8-7.3-17.7c0-5,1.4-9.5,4.1-13.7c2.7-4.2,6.4-7.2,10.9-9.2l-0.9-7.3c-6.3,2.3-11.4,6.2-15.3,11.8C7.9,54.4,6,60.6,6,67.3c0,5.8,1.4,11.2,4.3,16.1s6.8,8.8,11.7,11.7c4.9,2.9,10.3,4.3,16.1,4.3c7,0,13.3-2.1,18.9-6.2c5.7-4.1,9.6-9.5,11.7-16.2l-5.7-11.4C63.5,70.4,62.5,74.8,60.4,78.9z"></path>
                  <path fill="#FFFFFF" d="M93.8,71.3l-11.1,5.5L70,51.4c-0.6-1.3-1.7-2-3.2-2H41.3l-0.9-7.2h22.7v-7.2H39.6L37.5,19c2.5,0.3,4.8-0.5,6.7-2.3c1.9-1.8,2.9-4,2.9-6.6c0-2.5-0.9-4.6-2.6-6.3c-1.8-1.8-3.9-2.6-6.3-2.6c-2,0-3.8,0.6-5.4,1.8c-1.6,1.2-2.7,2.7-3.2,4.6c-0.3,1-0.4,1.8-0.3,2.3l5.4,43.5c0.1,0.9,0.5,1.6,1.2,2.3c0.7,0.6,1.5,0.9,2.4,0.9h26.4l13.4,26.7c0.6,1.3,1.7,2,3.2,2c0.6,0,1.1-0.1,1.6-0.4L97,77.7L93.8,71.3z"></path>
              </g>
          </svg>
      </button>
      </div>`;
  document.getElementById("loadmodaldisabilitas").innerHTML = toolbardisabilitas;

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
  $(".open-toolbar").click(function(event) {
    var stickyToolbarContainer = document.querySelector(".toolbar-disabilitas");
    stickyToolbarContainer.classList.toggle("show-toolbar");
  });
  $("#checklang").on("change", function() {
    changelang(this);
  });

  var arrayratatulisan = [];
  var langdefault = [];

  function replacemultipletext(lang, status) {
    var dataratatulisanid = "";
    var dataratatulisanen = "";
    if (arrayratatulisan.length == 0) {
      dataratatulisanid = "Rata Tulisan";
      dataratatulisanen = "Average Writing";
    } else if (arrayratatulisan.length > 0) {
      if (arrayratatulisan[0] == 0) {
        dataratatulisanid = "Rata Tulisan";
        dataratatulisanen = "Average Writing";
      } else if (arrayratatulisan[0] == 1) {
        dataratatulisanid = "Rata Kiri";
        dataratatulisanen = "Align Left";
      } else if (arrayratatulisan[0] == 2) {
        dataratatulisanid = "Rata Tengah";
        dataratatulisanen = "Average Middle";
      } else if (arrayratatulisan[0] == 3) {
        dataratatulisanid = "Rata Tengah";
        dataratatulisanen = "Average Middle";
      } else if (arrayratatulisan[0] == 4) {
        dataratatulisanid = "Rata Kanan";
        dataratatulisanen = "Align Right";
      }
    }

    if (status == "reset") {
      dataratatulisanid = "Rata Tulisan";
      dataratatulisanen = "Average Writing";
    }

    var replaceratatulisan = "";
    if (lang == undefined || lang == "") {
      replaceratatulisan = {
        ratatulisan: dataratatulisanid,
      };
    } else if (lang == 1) {
      replaceratatulisan = {
        ratatulisan: dataratatulisanid,
      };
    } else if (lang == 2) {
      replaceratatulisan = {
        ratatulisan: dataratatulisanen,
      };
    }

    return replaceratatulisan;
  }

  function ratatulisan(lang) {
    var resulttext = replacemultipletext(lang, "noreset");
    var text_tulisan = "";
    if (lang == "") {
      text_tulisan = "";
    } else {
      text_tulisan = resulttext.ratatulisan;
    }
    $("#tratatulisan").text(text_tulisan);
  }

  function changelang(ele) {
    var groups = Array.from(document.querySelectorAll("#checklangmenu"));
    langdefault.length = 0;
    langdefault.push(2);

    var resulttext = replacemultipletext(2, "noreset");
    if ($(ele).prop("checked") == true) {
      var toolslangEn = {
        tdataoff: "Indonesian",
        tdataon: "English",
        taccessbility: "Accessibility Tools",
        tincreasetext: "Increase Text",
        tdecreasetext: "Decrease Text",
        tegrayscale: "Grayscale",
        thcontrash: "Hight Contrast",
        tncontrash: "Negative Contrast",
        tlgcontrash: "Light Background",
        treadablefont: "Readable Font",
        tlinkunderline: "Link Underline",
        twebspeach: "Web Speech",
        tratatulisan: resulttext.ratatulisan,
        tidreset: "Reset",
      };
      replacetext(groups, toolslangEn);
    } else if ($(ele).prop("checked") == false) {
      langdefault.length = 0;
      langdefault.push(1);

      var resulttext = replacemultipletext(1, "noreset");
      var toolslangID = {
        tdataoff: "Indonesia",
        tdataon: "Inggris",
        taccessbility: "Sarana",
        tincreasetext: "Perbesar Teks",
        tdecreasetext: "Perkecil Teks",
        tegrayscale: "Skala Abu - Abu",
        thcontrash: "Kontras Tinggi",
        tncontrash: "Latar Gelap",
        tlgcontrash: "Latar Terang",
        treadablefont: "Tulisan Dapat Dibaca",
        tlinkunderline: "Garis Bawahi Tautan",
        twebspeach: "Moda Suara",
        tratatulisan: resulttext.ratatulisan,
        tidreset: "Atur Ulang",
      };
      replacetext(groups, toolslangID);
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

  function replacetext(groups, arrayjs) {
    var namedatainput = '[class="contenttoolbar_disabilitas"]';
    var namedatainput2 = "div";
    var listgroupselector = groups.map(function(group) {
      return group.querySelector(namedatainput);
    });
    var listdata = listgroupselector.map(function(group) {
      return Array.from(group.querySelectorAll(namedatainput2)).map(function(
        item
      ) {
        return item;
      });
    });
    //  console.log(mytext)
    //   var mytext = getelement.replace("indonesian", "indonesia");
    // $("#tmulticheckboxlang").text(resultvalue);
    var keysarray = Object.keys(arrayjs);
    var keysvalues = Object.values(arrayjs);
    for (let i = 0; i < listdata.length; i++) {
      for (let k = 0; k < listdata[i].length; k++) {
        for (let b = 0; b < keysarray.length; b++) {
          var idhtml = keysarray[b];
          if (
            listdata[i][k].id == idhtml &&
            idhtml != "tdataoff" &&
            idhtml != "tdataon"
          ) {
            // var listdatallx = listdata[i][k];
            var getelement = document.getElementById(keysarray[b]);
            var mytext = getelement.textContent.trim();
            var resultvalue = mytext.replace(mytext, keysvalues[b]);
            $("#" + idhtml).text(resultvalue);
          } else if (idhtml == "tdataoff" || idhtml == "tdataon") {
            if (idhtml == "tdataon") {
              var mytext = $("#tmycheckbox").attr("data-on");
              $("#tmycheckbox").attr("data-on", keysvalues[b]);
            }
            if (idhtml == "tdataoff") {
              var mytext = $("#tmycheckbox").attr("data-off");
              $("#tmycheckbox").attr("data-off", keysvalues[b]);
            }
            ///
          }
        }
      }
    }
  }

  $("#ratatulisan").click(function(event) {
    if (arrayratatulisan.length > 0) {
      if (arrayratatulisan[0] == 1) {
        arrayratatulisan.length = 0;
        arrayratatulisan.push(2);
        ratatulisan(langdefault[0]);
        $('*:not(".btn-color-mode-switch-inner, *")').each(function(i, item) {
          $(item).cssImportant("text-align", "left");

          if ($(item).css("flex-direction") == "row") {
            $(item).cssImportant("justify-content", "flex-start");
          }
        });
      }

      if (arrayratatulisan[0] == 2) {
        arrayratatulisan.length = 0;
        arrayratatulisan.push(3);

        ratatulisan(langdefault[0]);

        $('*:not(".btn-color-mode-switch-inner")').each(function(i, item) {
          $(item).cssImportant("text-align", "center");
          if ($(item).css("flex-direction") == "row") {
            $(item).cssImportant("justify-content", "center");
          }
        });
      } else if (arrayratatulisan[0] == 3) {
        arrayratatulisan.length = 0;
        arrayratatulisan.push(4);
        ratatulisan(langdefault[0]);
        $('*:not(".btn-color-mode-switch-inner")').each(function(i, item) {
          $(item).cssImportant("text-align", "right");
          if ($(item).css("flex-direction") == "row") {
            $(item).cssImportant("justify-content", "flex-end");
          }
        });
      } else if (arrayratatulisan[0] == 4) {
        cekclassactive(groups, "ratatulisan");
        arrayratatulisan.length = 0;
        ratatulisan(langdefault[0]);

        $('*:not(".btn-color-mode-switch-inner")').each(function(i, item) {
          $(item).cssImportant("text-align", "");
          if ($(item).css("flex-direction") == "row") {
            $(item).cssImportant("justify-content", "");
          }
        });
      } else if (arrayratatulisan[0] == 0) {
        cekclassactive(groups, "ratatulisan");
        arrayratatulisan.length = 0;

        arrayratatulisan.push(1);
        ratatulisan(langdefault[0]);

        $('*:not(".btn-color-mode-switch-inner")').each(function(i, item) {
          $(item).cssImportant("text-align", "left");
          if ($(item).css("flex-direction") == "row") {
            $(item).cssImportant("justify-content", "flex-start");
          }
        });
      }
    } else {
      cekclassactive(groups, "ratatulisan");
      arrayratatulisan.length = 0;

      arrayratatulisan.push(1);
      ratatulisan(langdefault[0]);

      $('*:not(".btn-color-mode-switch-inner")').each(function(i, item) {
        $(item).cssImportant("text-align", "left");
        if ($(item).css("flex-direction") == "row") {
          $(item).cssImportant("justify-content", "flex-start");
        }
      });
    }

    $(".contenttoolbar_disabilitas *,div.titletools,.open-toolbar").each(
      function(i, item) {
        $(item).cssImportant("text-align", "");
        $(item).cssImportant("justify-content", "");
      }
    );
    $(".titletools").cssImportant("text-align", "center");
  });

  var zoomLevel = 1;
  var rootFontSize = 12;
  var groups = Array.from(document.querySelectorAll("#groupcekmenu"));
  $("#increasetext").click(function(event) {
    // tracking_fitur_disabilitas('Perbesar Text');
    var listdatagroup = cekclassactive(groups, "increasetext");

    zoomLevel = zoomLevel + 0.1;
    rootFontSize = rootFontSize + 2;
    $('div > *:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
      // "font-weight": 400,
      "font-size": rootFontSize + "px",
    });
  });
  $("#decreasetext").click(function(event) {
    //  tracking_fitur_disabilitas('Perkecil Text');
    $("#resetdisabilitas").removeClass("subtitletoolsactive");
    $("#resetdisabilitas").addClass("subtitletools");
    //  var listdatagroup = cekclassactive(groups, 'decreasetext');
    setTimeout(() => {
      zoomLevel = zoomLevel - 0.1;
      rootFontSize = rootFontSize - 2;
      $("#increasetext").removeClass("subtitletoolsactive");
      $("#increasetext").addClass("subtitletools");
      $(
        'div > *:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")'
      ).css({
        //  "font-weight": 400,
        "font-size": rootFontSize + "px",
      });
    }, 100);
  });
  $("#readablefont").on("click", function(event) {
    //  tracking_fitur_disabilitas('Tulisan Dapat Di Baca');
    var listdatagroup = cekclassactive(groups, "readablefont");
    if (listdatagroup.getclass.classactiv == "active") {
      $(
        '*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down, h1 ,h2 , h3")'
      ).css({
        //"font-weight": 400,

        "font-size": "25px",
      });

      $("h1,h2,h3,h4").css({
        "font-size": "45px",
      });
    } else {
      $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
        "font-family": "",
        "font-weight": "",
        "font-size": "",
        "font-family": "",
      });
    }
  });
  jQuery(document).ready(function() {
    jQuery.fn.cssImportant = function(name, value) {
      const $this = this;
      const applyStyles = (n, v) => {
        // Convert style name from camelCase to dashed-case.
        const dashedName = n.replace(/(.)([A-Z])(.)/g, (str, m1, upper, m2) => {
          return m1 + "-" + upper.toLowerCase() + m2;
        });
        // Loop over each element in the selector and set the styles.
        $this.each(function() {
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

  $("#hcontrash").click(function (event) {
  //   tracking_fitur_disabilitas('Warna');

  var listdatagroup = cekclassactive(groups, "hcontrash", "on");
  if (listdatagroup.getclass.classactiv == "active") {
    $(".navbar-inverse2").css("background-color", "rgb(0, 0, 0)");
    $(
      '*:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container")'
    ).each(function (i, item) {
      var color = $(item).css("color");
      $(item).cssImportant("background-color", "black");

      $(item).cssImportant("color", "#40C090");
      $(item).cssImportant("background", "black");
    });

    $(
      '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
    ).cssImportant("border-color", "white");
    var links = document.querySelectorAll("a,div,li a strong");
    for (var i = 0; i < links.length; i++) {
      if (!isBlank(links[i].href)) {
        links[i].style.color = "#00f3f7 !important";
      }
    }
    $("h1,h2,h3,h4,h5").each(function (i, item) {
      var color = $(item).css("color");
      $(item).cssImportant("color", "white");

      $(item).cssImportant("background-color", "black");
      $(item).cssImportant("color", "#40C090");
      $(item).cssImportant("background", "black");
    });

    $("* > div").each(function (i, item) {
      var color = $(item).css("color");
    });

    $("*>button, * > p").each(function (i, item) {
      var color = $(item).css("color");

      $(item).cssImportant("background-color", "black");
      $(item).cssImportant("color", "#40C090");
      $(item).cssImportant("background", "black");
    });

    $("*>a").each(function (i, item) {
      var color = $(item).css("color");

      $(item).cssImportant("background-color", "black");
      $(item).cssImportant("color", "yellow");
      $(item).cssImportant("background", "black");
    });
    changecolordisabilitas(groups);
    hoveractive();

    $("#groupcekmenu > *, .bodytools path").each(function (i, item) {
      $(item).cssImportant("color", "#00f3f7");
    });
  } else {
    $("*").each(function (i, item) {
      var color = $(item).css("color");
      $(item).css({
        "background-color": "",
        background: "",
        color: "",
      });
    });
    $(
      '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
    ).cssImportant("border-color", "");
    hovernoactive();
  }
});
  function changecolordisabilitas(groups) {
    var namedatainput = '[class="bodytools"]';
    var namedatainput2 = '[class="aksestexttools"]';
    var listgroupselector = groups.map(function(group) {
      return group.querySelector(namedatainput);
    });
    var listdata = listgroupselector.map(function(group) {
      return Array.from(group.querySelectorAll(namedatainput2)).map(function(
        item
      ) {
        return item;
      });
    });

    var listdatall = [];
    var listdatall2 = [];
    for (let i = 0; i < listdata.length; i++) {
      for (let k = 0; k < listdata[i].length; k++) {
        var classactive = "";
        var classid = "";
        //     console.log(listdata[i][k].id);
        $("#" + listdata[i][k].id).css({
          color: "#00f3f7",
        });
        //  document.getElementById().style.color = "#0080FF";
        //  $("#thcontrash").css("color", "#0080FF");
      }
    }
  }
  $("#ncontrash").click(function(event) {
    //  tracking_fitur_disabilitas('Klise');
    var listdatagroup = cekclassactive(groups, "ncontrash");
    if (listdatagroup.getclass.classactiv == "active") {
      $(".navbar-inverse2").css("background-color", "rgb(0, 0, 0)");
      $(
        '*:not(".btn-color-mode-switch-inner,.mycheckbox,.Vue-Toastification__container")'
      ).each(function(i, item) {
        var color = $(item).css("color");
        $(item).cssImportant("background-color", "black");
        $(item).cssImportant("color", "yellow");
        $(item).cssImportant("background", "black");
      });
      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("border-color", "white");
      hoveractive();
    } else {
      $("*").each(function(i, item) {
        var color = $(item).css("color");
        $(item).css({
          "background-color": "",
          background: "",
          color: "",
        });
      });
      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("border-color", "");
      hovernoactive();
    }
  });

  function hoveractive() {
    $("* > a").hover(function(e) {
      if (e.type === "mouseenter") {
        $(this).css({
          "background-color": "#c23616",
          opacity: "0.5",
        });
      } else if (e.type === "mouseleave") {
        $(this).css({
          "background-color": "black",
          opacity: "",
        });
      }
    });
  }

  function hovernoactive() {
    $("* > a").hover(function(e) {
      // console.log(e.type);
      if (e.type === "mouseenter") {
        $(this).css({
          "background-color": "",
          opacity: "",
        });
      } else if (e.type === "mouseleave") {
        $(this).css({
          "background-color": "",
          opacity: "",
        });
      }
    });
  }
  $("#lgcontrash").click(function(event) {
    //  tracking_fitur_disabilitas('Penerangan');
    var listdatagroup = cekclassactive(groups, "lgcontrash");
    if (listdatagroup.getclass.classactiv == "active") {
      $("*").each(function(i, item) {
        var color = $(item).css("color");
        $(item).css({
          "background-color": "",
          background: "",
          color: "",
        });
      });

      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("background-color", "white");
      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("color", "black");
      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("background", "white");
      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("border-color", "white");
      $("*:hover").cssImportant("border-color", "white");
      $("*:focus").cssImportant("border-color", "white");

      hovernoactive();
    } else {
      $("*").each(function(i, item) {
        var color = $(item).css("color");
        $(item).css({
          "background-color": "",
          background: "",
          color: "",
        });
      });
      $(
        '*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")'
      ).cssImportant("border-color", "");
      hovernoactive();
    }
    // resetcss();
  });
  $("#linkunderline").click(function(event) {
    //    tracking_fitur_disabilitas('Garis Bawahi Tautan');
    var listdatagroup = cekclassactive(groups, "linkunderline");
  if (listdatagroup.getclass.classactiv == "active") {

    var links = document.querySelectorAll("a,div > a,li a, a *");
    for (var i = 0; i < links.length; i++) {
      if (!isBlank(links[i].href)) {
 
        $(links[i]).cssImportant("textDecoration", "underline");



        
        //  links[i].style.textDecoration = "underline";
      }
    }

    $('a *:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner,.Vue-Toastification__container")').cssImportant("textDecoration","underline");
      $(".toolbar-disabilitas  *").css({
        "text-decoration": "",
      });
    } else {
      $("*").css({
        "text-decoration": "",
      });
    }
  });
  $("#egrayscale").on("click", function(event) {
    //('Skala Abu-abu');
    var listdatagroup = cekclassactive(groups, "egrayscale");
    // console.log("grey");
    if (listdatagroup.getclass.classactiv == "active") {
      $("html").attr("class", "greyscaleall");
    } else {
      $("html").removeAttr("class");
    }
  });

  $("#resetdisabilitas").click(function(event) {
    //    tracking_fitur_disabilitas('Mengatur Ulang');
    var listdatagroup = cekclassactive(groups, "resetdisabilitas");
    if (listdatagroup.getclass.classactiv == "active") {
      resetcss();
      localStorage.removeItem("permisvoice");
      localStorage.removeItem("permismobile");
    }
  });

  function resetcss() {
    localStorage.removeItem("permisvoice");
    localStorage.removeItem("permismobile");
    arrayratatulisan.length = 0;
    arrayratatulisan.push(0);

    $("*").each(function(i, item) {
      var color = $(item).css("color");
      $(item).css({
        "background-color": "",
        background: "",
        color: "",
        "font-size": "",
        "text-decoration": "",
        "font-weight": "",
        "font-family": "",
      });
    });
    $("a").hover(function(e) {
      //console.log(e.type);
      if (e.type === "mouseenter") {
        $(this).css({
          "background-color": "",
          opacity: "",
        });
      } else if (e.type === "mouseleave") {
        $(this).css({
          "background-color": "",
          opacity: "",
        });
      }
    });
    $("html").removeAttr("class");
    $("*").css({
      "text-decoration": "",
      "border-color": "",
      "text-align": "",
    });

    rootFontSize = 20;
    $('*:not(".btn-color-mode-switch-inner")').each(function(i, item) {
      $(item).cssImportant("text-align", "");
      $(item).cssImportant("justify-content", "");
    });

    var text_tulisan = "";
    var langnew = 1;

    if (langdefault.length > 0) {
      langnew = langdefault[0];
    }

    if (langdefault.length == 0) {
      replacemultipletext(langnew, "noreset");
      var resultdata = replacemultipletext(langnew, "reset");
      text_tulisan = resultdata.ratatulisan;
    } else {
      langnew = langdefault[0];

      replacemultipletext(langnew, "noreset");
      var resultdata = replacemultipletext(langnew, "reset");
      // langdefault.length = 0;
      text_tulisan = resultdata.ratatulisan;
    }

    $("#tratatulisan").text(text_tulisan);
  }

  function cekclassactive(groups, idhtml) {
    if (idhtml != "resetdisabilitas") {
      $("#resetdisabilitas").removeClass("subtitletoolsactive");
      $("#resetdisabilitas").addClass("subtitletools");
    }
    var namedatainput = '[class="bodytools"]';
    var namedatainput2 = "div";
    var listgroupselector = groups.map(function(group) {
      return group.querySelector(namedatainput);
    });
    var listdata = listgroupselector.map(function(group) {
      return Array.from(group.querySelectorAll(namedatainput2)).map(function(
        item
      ) {
        return item;
      });
    });
    var listdatall = [];
    var listdatall2 = [];
    for (let i = 0; i < listdata.length; i++) {
      for (let k = 0; k < listdata[i].length; k++) {
        var classactive = "";
        var classid = "";
        if (listdata[i][k].id == idhtml) {
          if (
            $("#" + idhtml).hasClass("subtitletools") &&
            idhtml != "decreasetext"
          ) {
            classactive = "active";
            $("#" + idhtml).addClass("subtitletoolsactive");
            $("#" + idhtml).removeClass("subtitletools");
          } else if (
            $("#" + idhtml).hasClass("subtitletoolsactive") &&
            idhtml == "resetdisabilitas"
          ) {
            classactive = "noactive";
            $("#" + idhtml).removeClass("subtitletoolsactive");
            $("#" + idhtml).addClass("subtitletools");
          } else {
            classactive = "noactive";
            $("#" + idhtml).removeClass("subtitletoolsactive");
            $("#" + idhtml).addClass("subtitletools");
          }
        } else {
          if (idhtml == "resetdisabilitas") {
            classactive = "noactive";
            //   classid = listdata[i][k].id;
            if ($("#" + listdata[i][k].id).hasClass("subtitletoolsactive")) {
              $("#" + listdata[i][k].id).removeClass("subtitletoolsactive");
              $("#" + listdata[i][k].id).addClass("subtitletools");
            }
          } else if (
            idhtml == "lgcontrash" ||
            idhtml == "ncontrash" ||
            idhtml == "hcontrash"
          ) {
            if (
              listdata[i][k].id == "lgcontrash" ||
              listdata[i][k].id == "ncontrash" ||
              listdata[i][k].id == "hcontrash"
            ) {
              if ($("#" + listdata[i][k].id).hasClass("subtitletoolsactive")) {
                $("#" + listdata[i][k].id).removeClass("subtitletoolsactive");
                $("#" + listdata[i][k].id).addClass("subtitletools");
              }
            }
          }
        }
        //console.log(classactive);
        var loopmulti = {
          id: listdata[i][k].id,
          class: listdata[i][k].className,
          classactiv: classactive,
        };
        listdatall.push(loopmulti);
      }
    }
    var cekactiveclass = listdatall.filter(function(group) {
      return group.id == idhtml;
    });
    var returndata = {
      getclass: cekactiveclass[0],
      data: listdata,
    };
    return returndata;
  }


  $("#webspeach").click(function(event) {
    // tracking_fitur_disabilitas('Moda Suara');
    var listdatagroup = cekclassactive(groups, "webspeach");
    if (listdatagroup.getclass.classactiv == "active") {
      localStorage.setItem("permisvoice", "on");
      speach("Selamat Datang Di Website Info.go.id");
      //    localStorage.setItem("setwelcome", "welcomeoff");
    } else {
      localStorage.setItem("permisvoice", "off");
    }
  });

  
  $("#mobileapp").click(function(event) {
    //     tracking_fitur_disabilitas('Moda Suara Mobile Apps');
    var listdatagroup = cekclassactive(groups, "mobileapp");
    if (listdatagroup.getclass.classactiv == "active") {
      localStorage.setItem("permismobile", "on");
      speachmobile("Selamat Datang Di Website Info.go.id");
      //    localStorage.setItem("setwelcome", "welcomeoff");
    } else {
      localStorage.setItem("permismobile", "off");
    }
  });
  localStorage.removeItem("permismobile");
  localStorage.removeItem("permisvoice");

  $(document).on("mouseover", "a > *:not('.subtitletools')", function() {
    var textvalue = $(this).text().toString();
    console.log(textvalue);
    speach(textvalue);
    speachmobile(textvalue);
  });

  $(document).on("mouseover", "a:not('.subtitletools')", function() {
    var textvalue = $(this).text().toString();
    console.log(textvalue);
    speach(textvalue);
    speachmobile(textvalue);
  });

  if (getOS() == "Windows" || getOS() == "Mac OS") {
    var namedatainput = '[class="bodytools"]';
    var namedatainput2 = "div";
    var listgroupselector = groups.map(function(group) {
      return group.querySelector(namedatainput);
    });
    var listdata = listgroupselector.map(function(group) {
      return Array.from(group.querySelectorAll(namedatainput2)).map(function(
        item
      ) {
        return item;
      });
    });

    var listdatall = [];

    for (let i = 0; i < listdata.length; i++) {
      for (let k = 0; k < listdata[i].length; k++) {
        var tagid = "#" + listdata[i][k].id;

        if (tagid == "#ratatulisan") {
          $(tagid).click(function() {
            var mytext = $(this).text();
            callfunction(mytext);
          });
        }
      }
    }

    $(document).on("mouseover", ".subtitletools", function() {
      var textvalue = $(this).text().toString();
      callfunction(textvalue);
    });
  } else {
    var namedatainput = '[class="bodytools"]';
    var namedatainput2 = "div";
    var listgroupselector = groups.map(function(group) {
      return group.querySelector(namedatainput);
    });
    var listdata = listgroupselector.map(function(group) {
      return Array.from(group.querySelectorAll(namedatainput2)).map(function(
        item
      ) {
        return item;
      });
    });

    var listdatall = [];

    for (let i = 0; i < listdata.length; i++) {
      for (let k = 0; k < listdata[i].length; k++) {
        var tagid = "#" + listdata[i][k].id;
        var notagid = listdata[i][k].id;

        if (tagid != "#resetdisabilitas" && tagid != "#mobileapp") {
          $(tagid).click(function() {
            var mytext = $(this).text();
            callfunction(mytext);
          });
        }
        if (notagid == "resetdisabilitas") {
          $(document).on("mouseover", ".subtitletools", function() {
            var textvalue = $(this).text().toString();
            callmobile(textvalue);
          });
        }
      }
    }
  }

  function callmobile(value) {
    var voicecek = localStorage.getItem("permismobile");
    if (voicecek != null && voicecek == "on") {
      speachmobile(value);
    }
  }
</script>