"use strict";
let issue_comments;
let database = localStorage.database ? JSON.parse(localStorage.database) : false;
let csv_file_count = parseInt(localStorage.csv_file_count) || 0;

const UI_text = {
    title: {
        zh: "计分板全量数据库搜索",
        ja: "",//TODO
        en: "Scoreboard Full Database Search"
    },
    introduction: {
        zh: "请在文本框中输入查询条件，支持正则表达式。",
        ja: "",//TODO
        en: "Please enter query conditions, regular expressions supported."
    },
    player_name_header: {
        zh: "玩家名",
        ja: "プレイヤー名",//TODO
        en: "Player name"
    },
    rows_header: {
        zh: "行",
        ja: "行",//TODO
        en: "Rows"
    },
    cols_header: {
        zh: "列",
        ja: "列",//TODO
        en: "Columns"
    },
    score_header: {
        zh: "用时/秒",
        ja: "",//TODO
        en: "Time spent (second)"
    },
    time_header: {
        zh: "时间",
        ja: "",//TODO
        en: "Time"
    },
    relation: {
        zh: "各查询条件之间的关系：",
        ja: "各検索条件間の関係：",//TODO
        en: "The relation among the query conditions:"
    },
    and_label: {
        zh: "AND（与）",
        ja: "AND（論理積）",//TODO
        en: "AND"
    },
    or_label: {
        zh: "OR（或）",
        ja: "OR（論理和）",//TODO
        en: "OR"
    },
    use_regex_label: {
        zh: "使用正则表达式",
        ja: "",//TODO
        en: "Use regular expressions"
    },
    case_sensitive_label: {
        zh: "区分大小写",
        ja: "",//TODO
        en: "Case sensitive"
    },
    scoreboard: {
        zh: "计分板",
        ja: "スコアボード",//TODO
        en: "Scoreboard"
    },
    reset: {
        zh: "重置",
        ja: "リセット",//TODO
        en: "Reset"
    },
    update: {
        zh: "更新数据",
        ja: "データを更新する",//TODO
        en: "Update the data"
    },
    search: {
        zh: "搜索",
        ja: "検索",//TODO
        en: "Search"
    },
    loading: {
        zh: "加载中……",
        ja: "読み込み中……",//TODO
        en: "Loading..."
    },
    retry: {
        zh: "重试",
        ja: "再試行",//TODO
        en: "Retry"
    },
    cancel: {
        zh: "取消",
        ja: "キャンセル",//TODO
        en: "Cancel"
    }
};
const UI_element_id = Object.keys(UI_text);
const UI_element_id2 = ["player_name_header", "rows_header", "cols_header", "score_header", "time_header"];

function set_language(value) {
    language = value;

    document.documentElement.lang = language;
    localStorage.language = language;

    document.title = UI_text.title[language];
    for (const id of UI_element_id) {
        document.getElementById(id).textContent = UI_text[id][language];
    }
    for (const id of UI_element_id2) {
        document.getElementById(id + "2").textContent = UI_text[id][language];
    }
    if (document.getElementById("label_0")) {
        for (let i = 0; i < database.length; i++) {
            const scoreboard_checkbox_label = {
                zh: `${UI_text.scoreboard.zh}${i + 1}（${database[i].length}）`,
                ja: `${UI_text.scoreboard.ja}${i + 1}（${database[i].length}）`,
                en: `${UI_text.scoreboard.en} ${i + 1} (${database[i].length})`
            };
            document.getElementById("label_" + i).textContent = scoreboard_checkbox_label[language];
        }
    }
}

window.addEventListener("message", event => set_language(event.data), false);

async function fetch_url(url, cancellable) {
    document.getElementById("progress_bar").style.display = "";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("cancel").style.display = cancellable ? "" : "none";
    if (!document.getElementById("loading_dialog").hasAttribute("open"))
        open_dialog("loading_dialog");
    let retry = true;
    let result = null;
    do {
        let fetch_fail = false;
        const response = await fetch(
            url,
            {
                headers: {
                    Accept: "application/vnd.github+json"
                }
            }
        )
            .catch(error => {
                fetch_fail = true;
                const text_fetch_error = {
                    zh: `Fetch API抛出错误“${error}”，是否重试？`,
                    ja: `Fetch APIに「${error}」というエラーが発生しました。再試行しますか？`,//TODO
                    en: `Fetch API throws error "${error}", retry?`
                };
                retry = confirm(text_fetch_error[language]);
            });
        if (fetch_fail) {
            if (retry)
                continue;
            else
                break;
        }

        if (response.ok) {
            result = await response.json();
            break;
        } else {
            const text = await response.text();
            const text_github_rest_api_failed = {
                zh: `GitHub REST API失败，返回如下\n${response.status} ${response.statusText}\n${text}是否重试？`,
                ja: `GitHub REST APIが失敗しました。戻り値は以下になります\n${response.status} ${response.statusText}\n${text}再試行しますか？`,//TODO
                en: `GitHub REST API fails, returning as follows\n${response.status} ${response.statusText}\n${text}Retry?`
            };
            retry = confirm(text_github_rest_api_failed[language]);
        }
    } while (retry);
    if (result === null) {
        document.getElementById("progress_bar").style.display = "none";
        document.getElementById("buttons").style.display = "";
    } else {
        close_dialog("loading_dialog");
    }
    return result;
}

const pattern1 = /^[|] (.+) [|] (\d+) [|] (\d+) [|] (-?\d+[.]\d\d) [|] (([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d [(].+[)]) [|]$/;
const pattern2 = /^[|] ([*][*])(.+)\1 [|] \1(\d+)\1 [|] \1(\d+)\1 [|] \1(-?\d+[.]\d\d)\1 [|] \1(([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d [(].+[)])\1 [|]$/;

function compute() {
    database = [];
    csv_file_count = 0;

    const scoreboard_comment_ids = issue_comments[14].body.split("\r\n", 1)[0].match(/\d+/g).map(value => parseInt(value));
    for (const comment of issue_comments) {
        if (scoreboard_comment_ids.includes(comment.id)) {
            const index = database.length;
            database.push([]);
            const lines = comment.body.split(comment.body.includes("\r\n") ? "\r\n" : "\n"); // 有些评论的换行符是\n，有些评论的换行符是\r\n

            if (lines[2].endsWith(".csv") && !lines[3].startsWith("-->"))
                csv_file_count++;

            const start = lines.indexOf("| --- | --- | --- | --- | --- |") + 1;
            if (lines[lines.length - 1] === "</details>")
                lines.length--;
            for (let i = start; i < lines.length; i++) {
                let record = lines[i].match(pattern1);
                if (record) {
                    database[index].push(record.slice(1, 6));
                    continue;
                }
                record = lines[i].match(pattern2).slice(2, 7);
                record.push("best");
                database[index].push(record);
            }
        }
    }
    localStorage.database = JSON.stringify(database);
    localStorage.csv_file_count = csv_file_count.toString();
    localStorage.latest_update_time = Date.now();
}

function render() {
    let scoreboard_filter = "";

    for (let i = 0; i < database.length; i++) {
        if (i % 5 === 0)
            scoreboard_filter += "<tr>";
        scoreboard_filter += `<td><input id="${i}" type="checkbox" checked><label id="label_${i}" for="${i}"></label>`
            + `${i < csv_file_count ? `<br><a href="scoreboard-${i + 1}.csv">scoreboard-${i + 1}.csv</a>` : ""}</td>`;
        if (i % 5 === 4 || i === database.length - 1)
            scoreboard_filter += "</tr>";
    }

    document.getElementById("scoreboard_filter").innerHTML = scoreboard_filter;
    set_language(language);
}

async function prepare() {
    if (!localStorage.latest_update_time || (Date.now() - parseInt(localStorage.latest_update_time) >= 86400000)) {
        const comments = await fetch_url("https://api.github.com/repos/plazum/find-keke/issues/5/comments", false);
        if (comments) {
            issue_comments = comments;
            compute();
        } else {
            return;
        }
    }
    render();
}

// 因为按钮的id为update，所以在onclick函数中的名字update将指向button#update，而不是函数update()，
// 这是因为onclick函数with了所在的<form>，而<form>.update即为该按钮，
// 所以在onclick函数中调用的时候要用window.update()
async function update() {
    const comments = await fetch_url("https://api.github.com/repos/plazum/find-keke/issues/5/comments", true);
    if (comments) {
        issue_comments = comments;
        compute();
        render();
    }
}

function retry() {
    if (!localStorage.latest_update_time)
        prepare();
    else
        update();
}

function validate(target) {
    if (!document.getElementById("use_regex").checked) {
        target.setCustomValidity("");
    } else {
        try {
            const regex = new RegExp(target.value);
            target.setCustomValidity("");
        } catch (e) {
            target.setCustomValidity(e);
        }
    }
}

function validate_all() {
    for (const input of document.querySelectorAll("input[type='search']")) {
        validate(input);
    }
}

let player_name, rows, cols, score, time;
let player_name_regex, rows_regex, cols_regex, score_regex, time_regex;

function match(record) {
    let player_name_matched, rows_matched, cols_matched, score_matched, time_matched;
    const and_or = document.querySelector("input[name='and_or']:checked").id;

    if (document.getElementById("use_regex").checked) {
        player_name_matched = player_name_regex === null || player_name_regex.test(record[0]);
               rows_matched =        rows_regex === null ||        rows_regex.test(record[1]);
               cols_matched =        cols_regex === null ||        cols_regex.test(record[2]);
              score_matched =       score_regex === null ||       score_regex.test(record[3]);
               time_matched =        time_regex === null ||        time_regex.test(record[4]);
    } else {
        if (!document.getElementById("case_sensitive").checked)
            record = record.map(value => value.toUpperCase());
        player_name_matched = player_name === "" || record[0].includes(player_name);
               rows_matched =        rows === "" || record[1].includes(rows);
               cols_matched =        cols === "" || record[2].includes(cols);
              score_matched =       score === "" || record[3].includes(score);
               time_matched =        time === "" || record[4].includes(time);
    }

    switch (and_or) {
        case "and":
            return player_name_matched && rows_matched && cols_matched && score_matched && time_matched;
        case "or":
            return (player_name !== "" && player_name_matched)
                || (       rows !== "" && rows_matched)
                || (       cols !== "" && cols_matched)
                || (      score !== "" && score_matched)
                || (       time !== "" && time_matched);
    }
}

// 和上面的update()同样理由，因为和<form>当中的button#search重名了，所以要用window.search()的方式调用
function search() {
    [player_name, rows, cols, score, time] = [
        document.getElementById("player_name").value,
        document.getElementById("rows").value,
        document.getElementById("cols").value,
        document.getElementById("score").value,
        document.getElementById("time").value
    ];
    if (player_name === "" && rows === "" && cols === "" && score === "" && time === "")
        return;

    if (document.getElementById("use_regex").checked) {
        const flags = document.getElementById("case_sensitive").checked ? "" : "i";
        player_name_regex = player_name !== "" ? new RegExp(player_name, flags) : null;
               rows_regex =        rows !== "" ? new RegExp(rows, flags) : null;
               cols_regex =        cols !== "" ? new RegExp(cols, flags) : null;
              score_regex =       score !== "" ? new RegExp(score, flags) : null;
               time_regex =        time !== "" ? new RegExp(time, flags) : null;
    } else {
        if (!document.getElementById("case_sensitive").checked)
            [player_name, rows, cols, score, time] = [player_name, rows, cols, score, time].map(value => value.toUpperCase());
    }

    let result = "";
    for (let i = 0; i < database.length; i++) {
        if (!document.getElementById(i.toString()).checked)
            continue;
        for (const record of database[i]) {
            if (match(record)) {
                if (record[5] === "best")
                    result += `<tr><td><b>${i + 1}</b></td><td><b>${record[0]}</b></td><td><b>${record[1]}</b></td>`
                        + `<td><b>${record[2]}</b></td><td><b>${record[3]}</b></td><td><b>${record[4]}</b></td></tr>`;
                else
                    result += `<tr><td>${i + 1}</td><td>${record[0]}</td><td>${record[1]}</td>`
                        + `<td>${record[2]}</td><td>${record[3]}</td><td>${record[4]}</td></tr>`;
            }
        }
    }
    document.getElementById("result").innerHTML = result;
}
