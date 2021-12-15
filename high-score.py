import re
from math import *

pattern1 = re.compile(r"^[|] (.+) [|] (\d+) [|] (\d+) [|] ([-]?\d+[.]\d\d) [|]"
                      r" (([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d [(](.+)[)]) [|]$")
pattern2 = re.compile(r"^[|] ([*][*])(.+)\1 [|] \1(\d+)\1 [|] \1(\d+)\1 [|] \1([-]?\d+[.]\d\d)\1 [|]"
                      r" \1(([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d [(](.+)[)])\1 [|]$")


def regex_match(line):
    if match := pattern1.match(line):
        return [match.group(1), match.group(2), match.group(3), match.group(4), match.group(5)]
    match = pattern2.match(line)
    return [match.group(2), match.group(3), match.group(4), match.group(5), match.group(6)]


with open(".idea/comment.txt", "r", encoding="UTF-8") as f:
    lines = f.readlines()
lines = list(map(lambda l: l.removesuffix("\n"), lines))
high_score_index = set()
start = lines.index("| --- | --- | --- | --- | --- |") + 1
record = {}

for i in range(start, len(lines)):
    match = regex_match(lines[i])
    match.append(i)
    lines[i] = match
    time = float(match[3])
    # 小于0.1秒的分数不计
    if time < 0.1:
        continue
    rows = int(match[1])
    cols = int(match[2])
    if (rows, cols) not in record:
        record[(rows, cols)] = [match]
    else:
        record[(rows, cols)].append(match)
# 给记录排序并保留前ceil(ln(x + 1))项
record = [record[map_size] for map_size in sorted(record.keys(), key=lambda x: (x[0] * x[1], x[1]))]
for i in range(len(record)):
    record[i].sort(key=lambda x: float(x[3]))
    record[i] = record[i][:ceil(log1p(len(record[i])))]
    high_score_index.add(record[i][0][5])

with open(".idea/processed.txt", "w", encoding="UTF-8") as f:
    f.write("# 最高纪录\n")
    f.write("（按照棋盘大小和用时排序。）\n")
    f.write("（当前最高纪录用粗体表示。）\n")
    f.write("（对于每种棋盘大小，显示前![lagrida_latex_editor(ceil(ln(x+1))).png]"
            "(https://user-images.githubusercontent.com/34277374/145692061-7013a8b3-5ce4-4e5a-9cc2-bfe2cb9dfee5.png)"
            "名（用到的函数为`ceil(log1p(x))`）（分数相同时，先产生纪录者优先）。）\n")
    f.write("（小于0.1秒的分数有作弊的嫌疑，忽略不计。）\n")
    f.write("（以999开头的分数是我怀疑其作弊而添加了用于标注的前缀。）\n")
    f.write("| 玩家名 | 行 | 列 | 用时/秒 | 时间 |\n")
    f.write("| --- | ---: | ---: | ---: | --- |\n")
    for record_of_a_map in record:
        line = "| **%s** | **%s** | **%s** | **%s** | **%s** |"\
               % (record_of_a_map[0][0], record_of_a_map[0][1], record_of_a_map[0][2], record_of_a_map[0][3],
                  record_of_a_map[0][4])
        f.write(line + "\n")
        for i in range(1, len(record_of_a_map)):
            line = "| %s | %s | %s | %s | %s |" \
                   % (record_of_a_map[i][0], record_of_a_map[i][1], record_of_a_map[i][2], record_of_a_map[i][3],
                      record_of_a_map[i][4])
            f.write(line + "\n")
    f.write("# 计分板\n")
    for i in range(start - 6, start):
        f.write(lines[i] + "\n")
    for i in range(start, len(lines)):
        match = lines[i]
        if i in high_score_index:
            line = "| **%s** | **%s** | **%s** | **%s** | **%s** |" % (match[0], match[1], match[2], match[3], match[4])
        else:
            line = "| %s | %s | %s | %s | %s |" % (match[0], match[1], match[2], match[3], match[4])
        f.write(line + ("\n" if i != len(lines) - 1 else ""))
