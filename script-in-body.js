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

// 北京时间的零点是协调世界时的负八点
const spring_festival = [
    {
        begin: Date.UTC(2023, 0, 14, -8),
        end: Date.UTC(2023, 1, 6, -8)
    }
];
// 在春节期间（从腊月二十三到元宵节）默认勾选福字
const during_the_spring_festival = (() => {
    const now = Date.now();
    for (const period of spring_festival)
        if (period.begin <= now && now <= period.end)
            return true;
    return false;
})();

document.getElementById("filter").innerHTML = images.map(
    (val, idx) => '<input id="' + idx + '" type="checkbox"' + (val.filename !== "fu.png" || during_the_spring_festival ? ' checked' : '')
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

const animals_of_the_years = [
    ["🐭", "🐀"], ["🐮", "🐂"], ["🐯", "🐅"], ["🐰", "🐇"],
    ["🐲", "🐉"], ["🐍", "🐍"], ["🐴", "🐎"], ["🐐", "🐏"],
    ["🐵", "🐒"], ["🐔", "🐓"], ["🐶", "🐕"], ["🐷", "🐖"]
];
(() => {
    // 计算当前是哪个生肖年，以2020年鼠年为基点
    const shengxiao_index = (((new Date()).getFullYear() - 2020) % 12 + 12) % 12;
    document.getElementById("bainian").firstElementChild.firstElementChild.textContent
        = animals_of_the_years[shengxiao_index][0]
        + document.getElementById("bainian").firstElementChild.firstElementChild.textContent
        + animals_of_the_years[shengxiao_index][1];
})();

generate_map(14, 10);
