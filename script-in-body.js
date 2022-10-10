"use strict";
// 在此处添加角色信息
let images = [
    {
        filename: "kotori.jpg",
        name: {
            zh: "南小鸟",
            ja: "南ことり",
            en: "Minami Kotori"
        }
    },
    {
        filename: "you.jpg",
        name: {
            zh: "渡边曜",
            ja: "渡辺曜",
            en: "Watanabe You"
        }
    },
    {
        filename: "fu.png",
        name: {
            zh: "福",
            ja: "福",
            en: "Fu (福)"
        }
    },
];
document.getElementById("filter").innerHTML = images.map(
    (val, idx) => '<input id="' + idx + '" type="checkbox"' + (val.filename !== "fu.png" ? ' checked' : '')
        + ' onchange="generate_map(last_rows, last_cols)">'
        + '<label id="label_' + idx + '" for="' + idx + '"></label>'
).join(" ");
if (debug)
    document.getElementById("debug_link").outerHTML = document.getElementById("banner").outerHTML;

init();

const preview_img_initial = document.getElementById('preview_img').outerHTML;
const base_url = location.href.substring(0, location.href.lastIndexOf(debug ? "/debug" : "/") + 1);
const example_images = ["fu.jpg", "keke-big.jpg", "good.gif", "bubu.gif"];
document.getElementById("example_url").innerHTML = example_images.map(value => "<option>" + base_url + value + "</option>").join("");
document.getElementById("name").value = UI_text.example[language];

generate_map(14, 10);
