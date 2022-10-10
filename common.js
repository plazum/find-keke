"use strict";
let language = localStorage.language || navigator.language.substring(0, 2).toLowerCase();
const dialog_supported = "showModal" in document.createElement("dialog");

function open_dialog(id) {
    if (dialog_supported) {
        document.getElementById(id).showModal();
    } else {
        document.getElementById(id).setAttribute("open", "");
        document.getElementById(id).setAttribute("modal", "");
    }

    if (id === "scoreboard_dialog") {
        if (!document.getElementById("scoreboard_iframe").src.includes("scoreboard.html"))
            document.getElementById("scoreboard_iframe").src = "scoreboard.html"; // lazy loading
        document.getElementById("open_in_new_tab").style.marginLeft
            = `calc((100% - ${document.getElementById("open_in_new_tab").offsetWidth}px) / 2)`;
        document.getElementById("scoreboard_iframe").style.height
            = `calc(98% - ${document.getElementById("dialog_title_bar").offsetHeight}px)`; // 用100%或者99%的话这里会溢出一点点（其中日语界面溢出得最多）
        window.frames[0].postMessage(language, "*");
    }
}

function close_dialog(id) {
    if (dialog_supported) {
        document.getElementById(id).close();
    } else {
        document.getElementById(id).removeAttribute("open");
        document.getElementById(id).removeAttribute("modal");
    }
}

function init() {
    if (!["zh", "ja", "en"].includes(language))
        language = "en";
    document.getElementById(language).checked = true;
    set_language(language);

    if (!dialog_supported) {
        document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="dialog.css">');
        for (const dialog of document.getElementsByTagName("dialog")) {
            dialog.style.zIndex = "10001";
        }
        document.write('<div class="backdrop" style="z-index: 10000;"></div>');
    }
}
