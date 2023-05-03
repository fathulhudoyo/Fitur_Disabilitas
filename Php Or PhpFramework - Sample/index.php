<script src="jquery.min.js"></script>
<script src="bootstrap.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link href="https://ppid.jakarta.go.id/assets/home/ppidNew/css/bootstrap.min.css" rel="stylesheet">
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
        height: auto;
        width: auto;
    }



    @media only screen and (max-width: 900px) {
        .toolbar-disabilitas {
            top: 11%;
        }
    }
</style>
<script src="https://code.responsivevoice.org/responsivevoice.js?key=dWWNB9Gr"></script>

<span id="loadmodaldisabilitas"></span>
<script type="text/javascript">
    if (!window.James) {
        James = {};
    }
    localStorage.removeItem("permismobile");
    localStorage.removeItem("permisvoice");

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
            if ('speechSynthesis' in window) {
                const to_speak = new SpeechSynthesisUtterance(value || '');
                to_speak.lang = 'id-ID';
                speechSynthesis.getVoices();
                speechSynthesis.speak(to_speak);

            } else {
                alert('not supported');
            }

        }
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
        if (selectedText != '') {
            var textvalue = window.getSelection().toString();
            speach(textvalue);
            speachmobile(textvalue);
        }
    }

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
        return (!str || /^\s*$/.test(str));
    }



    var dataspeachweb = `
                <div class="subtitletools" id="webspeach">
                <div class="flexrowdata">
                 <span><i class='fas fa-file-audio'></i></span>
                 &nbsp;&nbsp;&nbsp;<div id="twebspeach"   class="aksestexttools">Moda Suara</div>
                 </div>
                </div>`;

    var datamobileweb = `
                <div class="subtitletools" id="mobileapp">
                <div class="flexrowdata">
                 <span><i class='fas fa-file-audio'></i></span>
                 &nbsp;&nbsp;&nbsp;<div id="twebspeach" class="aksestexttools">Moda Suara</div>
                 </div>
                </div>`;

    var logicspeachweb = (getOS() == "Windows") ? dataspeachweb : datamobileweb;
    var toolbardisabilitas = `
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
            ` + logicspeachweb + `
                <div class="subtitletools" id="increasetext">
                <div class="flexrowdata">
               <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M256 200v16c0 4.25-3.75 8-8 8h-56v56c0 4.25-3.75 8-8 8h-16c-4.25 0-8-3.75-8-8v-56h-56c-4.25 0-8-3.75-8-8v-16c0-4.25 3.75-8 8-8h56v-56c0-4.25 3.75-8 8-8h16c4.25 0 8 3.75 8 8v56h56c4.25 0 8 3.75 8 8zM288 208c0-61.75-50.25-112-112-112s-112 50.25-112 112 50.25 112 112 112 112-50.25 112-112zM416 416c0 17.75-14.25 32-32 32-8.5 0-16.75-3.5-22.5-9.5l-85.75-85.5c-29.25 20.25-64.25 31-99.75 31-97.25 0-176-78.75-176-176s78.75-176 176-176 176 78.75 176 176c0 35.5-10.75 70.5-31 99.75l85.75 85.75c5.75 5.75 9.25 14 9.25 22.5z" "=""></path></svg></span>
               &nbsp;&nbsp;<div id="tincreasetext" class="aksestexttools">Perbesar Teks</div>
               </div>
                </div>
                <div class="subtitletools"  id="decreasetext">
                <div class="flexrowdata">
               <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M256 200v16c0 4.25-3.75 8-8 8h-144c-4.25 0-8-3.75-8-8v-16c0-4.25 3.75-8 8-8h144c4.25 0 8 3.75 8 8zM288 208c0-61.75-50.25-112-112-112s-112 50.25-112 112 50.25 112 112 112 112-50.25 112-112zM416 416c0 17.75-14.25 32-32 32-8.5 0-16.75-3.5-22.5-9.5l-85.75-85.5c-29.25 20.25-64.25 31-99.75 31-97.25 0-176-78.75-176-176s78.75-176 176-176 176 78.75 176 176c0 35.5-10.75 70.5-31 99.75l85.75 85.75c5.75 5.75 9.25 14 9.25 22.5z"></path></svg></span>
                &nbsp;&nbsp;<div id="tdecreasetext"  class="aksestexttools">Perkecil Text</div>
                </div>
                </div>
                <div class="subtitletools"  id="egrayscale">
                <div class="flexrowdata">
                <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M15.75 384h-15.75v-352h15.75v352zM31.5 383.75h-8v-351.75h8v351.75zM55 383.75h-7.75v-351.75h7.75v351.75zM94.25 383.75h-7.75v-351.75h7.75v351.75zM133.5 383.75h-15.5v-351.75h15.5v351.75zM165 383.75h-7.75v-351.75h7.75v351.75zM180.75 383.75h-7.75v-351.75h7.75v351.75zM196.5 383.75h-7.75v-351.75h7.75v351.75zM235.75 383.75h-15.75v-351.75h15.75v351.75zM275 383.75h-15.75v-351.75h15.75v351.75zM306.5 383.75h-15.75v-351.75h15.75v351.75zM338 383.75h-15.75v-351.75h15.75v351.75zM361.5 383.75h-15.75v-351.75h15.75v351.75zM408.75 383.75h-23.5v-351.75h23.5v351.75zM424.5 383.75h-8v-351.75h8v351.75zM448 384h-15.75v-352h15.75v352z"></path></svg></span>
                &nbsp;&nbsp;<div id="tegrayscale"  class="aksestexttools">Skala Abu-abu</div>
                </div>
                </div>
                <div class="subtitletools" id="hcontrash">
                <div class="flexrowdata">
                <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M192 360v-272c-75 0-136 61-136 136s61 136 136 136zM384 224c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192z" "=""></path></svg></span>
                &nbsp;&nbsp;<div id="thcontrash"  class="aksestexttools">Warna</div>
                </div>
                </div>
                <div class="subtitletools" id="ncontrash">
                <div class="flexrowdata">
                <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M416 240c-23.75-36.75-56.25-68.25-95.25-88.25 10 17 15.25 36.5 15.25 56.25 0 61.75-50.25 112-112 112s-112-50.25-112-112c0-19.75 5.25-39.25 15.25-56.25-39 20-71.5 51.5-95.25 88.25 42.75 66 111.75 112 192 112s149.25-46 192-112zM236 144c0-6.5-5.5-12-12-12-41.75 0-76 34.25-76 76 0 6.5 5.5 12 12 12s12-5.5 12-12c0-28.5 23.5-52 52-52 6.5 0 12-5.5 12-12zM448 240c0 6.25-2 12-5 17.25-46 75.75-130.25 126.75-219 126.75s-173-51.25-219-126.75c-3-5.25-5-11-5-17.25s2-12 5-17.25c46-75.5 130.25-126.75 219-126.75s173 51.25 219 126.75c3 5.25 5 11 5 17.25z"></path></svg></span>
                &nbsp;&nbsp;<div id="tncontrash"  class="aksestexttools">Klise</div>
                </div>
                </div>
                <div class="subtitletools"] id="lgcontrash">
                <div class="flexrowdata">
                <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M184 144c0 4.25-3.75 8-8 8s-8-3.75-8-8c0-17.25-26.75-24-40-24-4.25 0-8-3.75-8-8s3.75-8 8-8c23.25 0 56 12.25 56 40zM224 144c0-50-50.75-80-96-80s-96 30-96 80c0 16 6.5 32.75 17 45 4.75 5.5 10.25 10.75 15.25 16.5 17.75 21.25 32.75 46.25 35.25 74.5h57c2.5-28.25 17.5-53.25 35.25-74.5 5-5.75 10.5-11 15.25-16.5 10.5-12.25 17-29 17-45zM256 144c0 25.75-8.5 48-25.75 67s-40 45.75-42 72.5c7.25 4.25 11.75 12.25 11.75 20.5 0 6-2.25 11.75-6.25 16 4 4.25 6.25 10 6.25 16 0 8.25-4.25 15.75-11.25 20.25 2 3.5 3.25 7.75 3.25 11.75 0 16.25-12.75 24-27.25 24-6.5 14.5-21 24-36.75 24s-30.25-9.5-36.75-24c-14.5 0-27.25-7.75-27.25-24 0-4 1.25-8.25 3.25-11.75-7-4.5-11.25-12-11.25-20.25 0-6 2.25-11.75 6.25-16-4-4.25-6.25-10-6.25-16 0-8.25 4.5-16.25 11.75-20.5-2-26.75-24.75-53.5-42-72.5s-25.75-41.25-25.75-67c0-68 64.75-112 128-112s128 44 128 112z"></path></svg></span>
                &nbsp;&nbsp;<div id="tlgcontrash"  class="aksestexttools">Penerangan</div>
                </div>
                </div>
                <div class="subtitletools" id="readablefont">
                <div class="flexrowdata">
                 <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M181.25 139.75l-42.5 112.5c24.75 0.25 49.5 1 74.25 1 4.75 0 9.5-0.25 14.25-0.5-13-38-28.25-76.75-46-113zM0 416l0.5-19.75c23.5-7.25 49-2.25 59.5-29.25l59.25-154 70-181h32c1 1.75 2 3.5 2.75 5.25l51.25 120c18.75 44.25 36 89 55 133 11.25 26 20 52.75 32.5 78.25 1.75 4 5.25 11.5 8.75 14.25 8.25 6.5 31.25 8 43 12.5 0.75 4.75 1.5 9.5 1.5 14.25 0 2.25-0.25 4.25-0.25 6.5-31.75 0-63.5-4-95.25-4-32.75 0-65.5 2.75-98.25 3.75 0-6.5 0.25-13 1-19.5l32.75-7c6.75-1.5 20-3.25 20-12.5 0-9-32.25-83.25-36.25-93.5l-112.5-0.5c-6.5 14.5-31.75 80-31.75 89.5 0 19.25 36.75 20 51 22 0.25 4.75 0.25 9.5 0.25 14.5 0 2.25-0.25 4.5-0.5 6.75-29 0-58.25-5-87.25-5-3.5 0-8.5 1.5-12 2-15.75 2.75-31.25 3.5-47 3.5z"></path></svg></span>
                 &nbsp;&nbsp;<div id="treadablefont"  class="aksestexttools">Tulisan Dapat Di Baca</div>
                 </div>
                </div>
                <div class="subtitletools" id="linkunderline">
                <div class="flexrowdata">
                 <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M364 304c0-6.5-2.5-12.5-7-17l-52-52c-4.5-4.5-10.75-7-17-7-7.25 0-13 2.75-18 8 8.25 8.25 18 15.25 18 28 0 13.25-10.75 24-24 24-12.75 0-19.75-9.75-28-18-5.25 5-8.25 10.75-8.25 18.25 0 6.25 2.5 12.5 7 17l51.5 51.75c4.5 4.5 10.75 6.75 17 6.75s12.5-2.25 17-6.5l36.75-36.5c4.5-4.5 7-10.5 7-16.75zM188.25 127.75c0-6.25-2.5-12.5-7-17l-51.5-51.75c-4.5-4.5-10.75-7-17-7s-12.5 2.5-17 6.75l-36.75 36.5c-4.5 4.5-7 10.5-7 16.75 0 6.5 2.5 12.5 7 17l52 52c4.5 4.5 10.75 6.75 17 6.75 7.25 0 13-2.5 18-7.75-8.25-8.25-18-15.25-18-28 0-13.25 10.75-24 24-24 12.75 0 19.75 9.75 28 18 5.25-5 8.25-10.75 8.25-18.25zM412 304c0 19-7.75 37.5-21.25 50.75l-36.75 36.5c-13.5 13.5-31.75 20.75-50.75 20.75-19.25 0-37.5-7.5-51-21.25l-51.5-51.75c-13.5-13.5-20.75-31.75-20.75-50.75 0-19.75 8-38.5 22-52.25l-22-22c-13.75 14-32.25 22-52 22-19 0-37.5-7.5-51-21l-52-52c-13.75-13.75-21-31.75-21-51 0-19 7.75-37.5 21.25-50.75l36.75-36.5c13.5-13.5 31.75-20.75 50.75-20.75 19.25 0 37.5 7.5 51 21.25l51.5 51.75c13.5 13.5 20.75 31.75 20.75 50.75 0 19.75-8 38.5-22 52.25l22 22c13.75-14 32.25-22 52-22 19 0 37.5 7.5 51 21l52 52c13.75 13.75 21 31.75 21 51z"></path></svg></span>
                 &nbsp;&nbsp;<div id="tlinkunderline"  class="aksestexttools">Garis Bawahi Tautan</div>
                 </div>
                </div>
                <div class="subtitletools" id="resetdisabilitas">
                <div class="flexrowdata">
                <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 448 448"><path fill="currentColor" d="M384 224c0 105.75-86.25 192-192 192-57.25 0-111.25-25.25-147.75-69.25-2.5-3.25-2.25-8 0.5-10.75l34.25-34.5c1.75-1.5 4-2.25 6.25-2.25 2.25 0.25 4.5 1.25 5.75 3 24.5 31.75 61.25 49.75 101 49.75 70.5 0 128-57.5 128-128s-57.5-128-128-128c-32.75 0-63.75 12.5-87 34.25l34.25 34.5c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-112c-8.75 0-16-7.25-16-16v-112c0-6.5 4-12.25 10-14.75 5.75-2.5 12.75-1.25 17.25 3.5l32.5 32.25c35.25-33.25 83-53 132.25-53 105.75 0 192 86.25 192 192z"></path></svg></span>

                &nbsp;&nbsp;<div id="tidreset"  class="aksestexttools">Mengatur Ulang</div>
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
        var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
        var is_safari = navigator.userAgent.indexOf("Safari") > -1;
        var userAgent = window.navigator.userAgent,
            platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;


        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (/Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    $(".open-toolbar").click(function(event) {
        var stickyToolbarContainer = document.querySelector(
            ".toolbar-disabilitas"
        );
        stickyToolbarContainer.classList.toggle("show-toolbar");
    })



    $("#checklang").on("change", function() {
        changelang(this);
    })

    function changelang(ele) {
        var groups = Array.from(document.querySelectorAll('#checklangmenu'));

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
                tidreset: "Reset"
            }
            replacetext(groups, toolslangEn);

        } else if ($(ele).prop("checked") == false) {
            var toolslangID = {
                tdataoff: "Indonesia",
                tdataon: "Inggris",
                taccessbility: "Sarana",
                tincreasetext: "Perbesar Text",
                tdecreasetext: "Perkecil Text",
                tegrayscale: "Skala abu-abu",
                thcontrash: "Warna",
                tncontrash: "Klise",
                tlgcontrash: "Penerangan",
                treadablefont: "Tulisan Dapat Di Baca",
                tlinkunderline: "Garis Bawahi Tautan",
                twebspeach: "Moda Suara",
                tidreset: "Mengatur Ulang"
            }
            replacetext(groups, toolslangID);

        }
    }



    function callfunction(value) {
        var voicecek = localStorage.getItem("permismobile");
        if (voicecek != null && voicecek == "on") {
            setTimeout(() => {
                speachmobile(value)
            }, 50);
        } else {
            speach(value);
        }
    }

    function replacetext(groups, arrayjs) {

        var namedatainput = '[class="contenttoolbar_disabilitas"]';
        var namedatainput2 = 'div';
        var listgroupselector = groups.map(function(group) {
            return group.querySelector(namedatainput);
        });


        var listdata = listgroupselector.map(function(group) {
            return Array.from(group.querySelectorAll(namedatainput2)).map(function(item) {
                return item
            });
        })



        //  console.log(mytext)
        //   var mytext = getelement.replace("indonesian", "indonesia");
        // $("#tmulticheckboxlang").text(resultvalue);

        var keysarray = Object.keys(arrayjs);
        var keysvalues = Object.values(arrayjs);
        for (let i = 0; i < listdata.length; i++) {
            for (let k = 0; k < listdata[i].length; k++) {
                for (let b = 0; b < keysarray.length; b++) {
                    var idhtml = keysarray[b];

                    if (listdata[i][k].id == idhtml && idhtml != "tdataoff" && idhtml != "tdataon") {
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


    var zoomLevel = 1;
    var rootFontSize = 12;
    var groups = Array.from(document.querySelectorAll('#groupcekmenu'));

    $("#increasetext").click(function(event) {
        // tracking_fitur_disabilitas('Perbesar Text');
        var listdatagroup = cekclassactive(groups, 'increasetext');

        setTimeout(() => {
            if (zoomLevel < 2) {
                zoomLevel = zoomLevel + 0.1;
                rootFontSize = rootFontSize + 2;
                $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
                    "font-family": "",
                    "font-weight": 400,
                    "font-size": `${rootFontSize}px`,

                });
            } else {
                $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
                    "font-family": "",
                    "font-weight": 400,
                    "font-size": '20px',
                    "font-family": ""
                });
            }
        }, 100);
    })

    $("#decreasetext").click(function(event) {


        //  tracking_fitur_disabilitas('Perkecil Text');
        $('#resetdisabilitas').removeClass("subtitletoolsactive");
        $('#resetdisabilitas').addClass("subtitletools");
        //  var listdatagroup = cekclassactive(groups, 'decreasetext');
        setTimeout(() => {

            if (rootFontSize > 10) {

                zoomLevel = zoomLevel - 0.1;
                rootFontSize = rootFontSize - 2;
                $('#increasetext').removeClass("subtitletoolsactive");
                $('#increasetext').addClass("subtitletools");

                $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
                    "font-family": "",
                    "font-weight": 400,
                    "font-size": `${rootFontSize}px`,
                    "font-family": ""
                });
            }
        }, 100);
    })

    $("#readablefont").on('click', function(event) {
        //  tracking_fitur_disabilitas('Tulisan Dapat Di Baca');
        var listdatagroup = cekclassactive(groups, 'readablefont');
        if (listdatagroup.getclass.classactiv == "active") {
            $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
                "font-family": "",
                "font-weight": 400,
                "font-size": '16px',
                "font-family": ""
            });
        } else {
            $('*:not(".fa-search,.toolbar-disabilitas  *,.fa,.fa-angle-down")').css({
                "font-family": "",
                "font-weight": "",
                "font-size": "",
                "font-family": ""
            });
        }
    })



    $("#hcontrash").click(function(event) {
        //   tracking_fitur_disabilitas('Warna');
        var listdatagroup = cekclassactive(groups, 'hcontrash', 'on');
        if (listdatagroup.getclass.classactiv == "active") {
            $(".navbar-inverse2").css("background-color", "rgb(0, 0, 0)");
            $('*:not(".btn-color-mode-switch-inner,.mycheckbox")').each(function(i, item) {
                var color = $(item).css('color')
                $(item).css({
                    "background-color": "black",
                    "color": "white",
                    "background": "black",
                });
            });


            var links = document.querySelectorAll("a,div,li a strong");
            for (var i = 0; i < links.length; i++) {
                if (!isBlank(links[i].href) || links[i].className == "col-md-12 feature-txt2" ||
                    links[i].className == "col-md-12 feature-txt" || links[i].className == "col-md-12 feature-txt" || links[i].className == "text-center") {
                    links[i].style.color = "#00f3f7";
                }
            }
            $('h1,h2,h3').each(function(i, item) {
                var color = $(item).css('color')
                $(item).css({
                    "color": "white",
                });
                $(item).css({
                    "background-color": "black",
                    "color": "#40C090",
                    "background": "black",
                });
            });
            changecolordisabilitas(groups);
            hoveractive();
            if (getOS() == "Android") {
                $('#instagram').removeClass('col-md-2', 'instagram');
                $('#twitter').removeClass('col-md-2', 'twitter');
            }
        } else {
            $('*').each(function(i, item) {
                var color = $(item).css('color')
                $(item).css({
                    "background-color": "",
                    "background": "",
                    "color": ""
                });
            });
            if (getOS() == "Android") {
                $('#instagram').addClass('col-md-2', 'instagram');
                $('#twitter').addClass('col-md-2', 'twitter');
            }
            hovernoactive();

        }
    })


    function changecolordisabilitas(groups) {
        var namedatainput = '[class="bodytools"]';
        var namedatainput2 = '[class="aksestexttools"]';
        var listgroupselector = groups.map(function(group) {
            return group.querySelector(namedatainput);
        });
        var listdata = listgroupselector.map(function(group) {
            return Array.from(group.querySelectorAll(namedatainput2)).map(function(item) {
                return item
            });
        })
        var listdatall = [];
        var listdatall2 = [];
        for (let i = 0; i < listdata.length; i++) {
            for (let k = 0; k < listdata[i].length; k++) {
                var classactive = "";
                var classid = "";
                console.log(listdata[i][k].id)
                $('#' + listdata[i][k].id).css({
                    "color": "#00f3f7"
                });
                //  document.getElementById().style.color = "#0080FF";
                //  $("#thcontrash").css("color", "#0080FF");
            }
        }


    }


    $("#ncontrash").click(function(event) {
        //  tracking_fitur_disabilitas('Klise');
        var listdatagroup = cekclassactive(groups, 'ncontrash');
        if (listdatagroup.getclass.classactiv == "active") {
            $(".navbar-inverse2").css("background-color", "rgb(0, 0, 0)");
            $('*:not(".btn-color-mode-switch-inner,.mycheckbox")').each(function(i, item) {
                var color = $(item).css('color')
                $(item).css({
                    "background-color": "black",
                    "color": "yellow",
                    "background": "black",
                });
            });
            if (getOS() == "Android") {
                $('#instagram').removeClass('col-md-2', 'instagram');
                $('#twitter').removeClass('col-md-2', 'twitter');
            }

            hoveractive();

        } else {
            $('*').each(function(i, item) {
                var color = $(item).css('color')
                $(item).css({
                    "background-color": "",
                    "background": "",
                    "color": ""
                });
                if (getOS() == "Android") {
                    $('#instagram').addClass('col-md-2', 'instagram');
                    $('#twitter').addClass('col-md-2', 'twitter');
                }
            });
            hovernoactive();
        }
    })

    function hoveractive() {
        $("* > a:not('.cameraContent > .camera_link')").hover(function(e) {

            if (e.type === "mouseenter") {
                $(this).css({
                    "background-color": "#c23616",
                    "opacity": "0.5"

                })
            } else if (e.type === "mouseleave") {
                $(this).css({
                    "background-color": "black",
                    "opacity": ""
                })
            }
        })
    }

    function hovernoactive() {
        $("* > a").hover(function(e) {
            console.log(e.type)
            if (e.type === "mouseenter") {
                $(this).css({
                    "background-color": "",
                    "opacity": ""

                })
            } else if (e.type === "mouseleave") {
                $(this).css({
                    "background-color": "",
                    "opacity": ""
                })
            }
        })
    }

    $("#lgcontrash").click(function(event) {
        //  tracking_fitur_disabilitas('Penerangan');
        var listdatagroup = cekclassactive(groups, 'lgcontrash');
        if (listdatagroup.getclass.classactiv == "active") {
            $('*').each(function(i, item) {
                var color = $(item).css('color')
                $(item).css({
                    "background-color": "",
                    "background": "",
                    "color": ""
                });
                if (getOS() == "Android") {
                    $('#instagram').addClass('col-md-2', 'instagram');
                    $('#twitter').addClass('col-md-2', 'twitter');
                }
            });

            $('*:not(".fa-search,.titletools,svg,.btn-color-mode-switch-inner")').css({
                "background-color": "white",
                "color": "black",
                "background": "white",
            });
            hovernoactive();
        } else {
            $("*").css({
                "background-color": "",
                "color": "",
                "background": "",
            });
            hovernoactive();
        }

        // resetcss();
    });




    $("#linkunderline").click(function(event) {
        //    tracking_fitur_disabilitas('Garis Bawahi Tautan');
        var listdatagroup = cekclassactive(groups, 'linkunderline');
        if (listdatagroup.getclass.classactiv == "active") {
            var links = document.querySelectorAll("a,div,li a strong,.columnmobile");

            for (var i = 0; i < links.length; i++) {



                if (!isBlank(links[i].href) || links[i].className == "hurufawal mylink capitalfont" || links[i].className == "subtitletools" || links[i].className == "subtitletoolsactive" || links[i].className == "mylinkweb" || links[i].className == "hurufawal mylink" || links[i].className == "col-md-12 feature-txt2" ||
                    links[i].className == "col-md-12 feature-txt" || links[i].className == "col-md-12 feature-txt" || links[i].className == "text-center") {
                    links[i].style.textDecoration = "underline";
                }
            }

            $('.toolbar-disabilitas  *').css({
                "text-decoration": ""
            });
        } else {
            $('*').css({
                "text-decoration": ""
            });
        }
    })

    $("#egrayscale").on('click', function(event) {
        //('Skala Abu-abu');
        var listdatagroup = cekclassactive(groups, 'egrayscale');
        if (listdatagroup.getclass.classactiv == "active") {
            $('#effectweb').attr("class", "greyscaleall");
        } else {
            $('#effectweb').removeAttr("class");
        }
    })

    $("#resetdisabilitas").click(function(event) {
        //    tracking_fitur_disabilitas('Mengatur Ulang');
        var listdatagroup = cekclassactive(groups, 'resetdisabilitas');
        if (listdatagroup.getclass.classactiv == "active") {
            resetcss();
            localStorage.removeItem("permisvoice");
            localStorage.removeItem("permismobile");
        }




    })


    function resetcss() {
        $('*').each(function(i, item) {
            var color = $(item).css('color')
            $(item).css({
                "background-color": "",
                "background": "",
                "color": "",
                "font-size": "",
                "text-decoration": "",
                "font-weight": "",
                "font-family": ""
            });
        });
        $("a").hover(function(e) {
            console.log(e.type)
            if (e.type === "mouseenter") {
                $(this).css({
                    "background-color": "",
                    "opacity": ""

                })
            } else if (e.type === "mouseleave") {
                $(this).css({
                    "background-color": "",
                    "opacity": ""
                })
            }
        })
        $('#effectweb').removeAttr("class");
        $('*').css({
            "text-decoration": "none"
        });
    }



    function cekclassactive(groups, idhtml) {
        if (idhtml != "resetdisabilitas") {
            $('#resetdisabilitas').removeClass("subtitletoolsactive");
            $('#resetdisabilitas').addClass("subtitletools");
        }
        var namedatainput = '[class="bodytools"]';
        var namedatainput2 = 'div';
        var listgroupselector = groups.map(function(group) {
            return group.querySelector(namedatainput);
        });
        var listdata = listgroupselector.map(function(group) {
            return Array.from(group.querySelectorAll(namedatainput2)).map(function(item) {
                return item
            });
        })

        var listdatall = [];
        var listdatall2 = [];
        for (let i = 0; i < listdata.length; i++) {
            for (let k = 0; k < listdata[i].length; k++) {
                var classactive = "";
                var classid = "";
                if (listdata[i][k].id == idhtml) {

                    if ($('#' + idhtml).hasClass('subtitletools') && idhtml != "decreasetext") {
                        classactive = "active";
                        $('#' + idhtml).addClass("subtitletoolsactive");
                        $('#' + idhtml).removeClass("subtitletools");

                    } else if ($('#' + idhtml).hasClass('subtitletoolsactive') && idhtml == "resetdisabilitas") {
                        classactive = "noactive";
                        $('#' + idhtml).removeClass("subtitletoolsactive");
                        $('#' + idhtml).addClass("subtitletools");
                    } else {
                        classactive = "noactive";
                        $('#' + idhtml).removeClass("subtitletoolsactive");
                        $('#' + idhtml).addClass("subtitletools");
                    }
                } else {
                    if (idhtml == "resetdisabilitas") {

                        classactive = "noactive";
                        //   classid = listdata[i][k].id;
                        if ($('#' + listdata[i][k].id).hasClass('subtitletoolsactive')) {
                            $('#' + listdata[i][k].id).removeClass("subtitletoolsactive");
                            $('#' + listdata[i][k].id).addClass("subtitletools");
                        }
                    } else if (idhtml == "lgcontrash" || idhtml == "ncontrash" || idhtml == "hcontrash") {
                        if (listdata[i][k].id == "lgcontrash" || listdata[i][k].id == "ncontrash" || listdata[i][k].id == "hcontrash") {
                            if ($('#' + listdata[i][k].id).hasClass('subtitletoolsactive')) {
                                $('#' + listdata[i][k].id).removeClass("subtitletoolsactive");
                                $('#' + listdata[i][k].id).addClass("subtitletools");
                            }

                        }

                    }
                }
                //console.log(classactive);
                var loopmulti = {
                    id: listdata[i][k].id,
                    class: listdata[i][k].className,
                    classactiv: classactive
                }
                listdatall.push(loopmulti);
            }
        }
        var cekactiveclass = listdatall.filter(function(group) {
            return group.id == idhtml
        });
        var returndata = {
            getclass: cekactiveclass[0],
            data: listdata
        }
        return returndata;
    }

    function getOS() {
        var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
        var is_safari = navigator.userAgent.indexOf("Safari") > -1;
        var userAgent = window.navigator.userAgent,
            platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;


        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (/Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }


    $("#webspeach").click(function(event) {
        // tracking_fitur_disabilitas('Moda Suara');
        var listdatagroup = cekclassactive(groups, 'webspeach');
        if (listdatagroup.getclass.classactiv == "active") {
            localStorage.setItem("permisvoice", "on");
            speach("Selamat Datang Di Website PPID Jakarta");
            //    localStorage.setItem("setwelcome", "welcomeoff");
        } else {
            localStorage.setItem("permisvoice", "off");
        }
    });

    $("#mobileapp").click(function(event) {
        //     tracking_fitur_disabilitas('Moda Suara Mobile Apps');
        var listdatagroup = cekclassactive(groups, 'mobileapp');
        if (listdatagroup.getclass.classactiv == "active") {
            localStorage.setItem("permismobile", "on");


            speachmobile("Selamat Datang Di Website PPID Jakarta");

            //    localStorage.setItem("setwelcome", "welcomeoff");
        } else {
            localStorage.setItem("permismobile", "off");
        }
    });


    localStorage.removeItem("permismobile");
    localStorage.removeItem("permisvoice");

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
            if ('speechSynthesis' in window) {
                const to_speak = new SpeechSynthesisUtterance(value || '');
                to_speak.lang = 'id-ID';
                speechSynthesis.getVoices();
                speechSynthesis.speak(to_speak);

            } else {
                alert('not supported');
            }

        }
    }

    $("a").on('mouseover', function() {
        ;
        var textvalue = $(this).text().toString();
        speach(textvalue)
        speachmobile(textvalue)
    });
    $(".subtitletools").on('mouseover', function() {
        ;
        var textvalue = $(this).text().toString();
        speach(textvalue)
        speachmobile(textvalue)
    });
    /*
    $(document).ready(function() {
        $('#modalBanner.modal-show').modal('show');
        $('#frame-floatb .close').click(function() {
            $('#frame-floatb').hide();
        });
    });*/
</script>