import re

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
lines = list(map(lambda l: l.strip(), lines))
high_score = {}
high_score_index = set()
for i in range(len(lines)):
    if lines[i] == "| --- | --- | --- | --- | --- |":
        start = i + 1
        break

for i in range(start, len(lines)):
    match = regex_match(lines[i])
    time = float(match[3])
    # 小于0.1秒的分数不计
    if time < 0.1:
        continue
    rows = match[1]
    cols = match[2]
    if not (rows, cols) in high_score:
        high_score_index.add(i)
        high_score[(rows, cols)] = (i, time)
    elif time < high_score[(rows, cols)][1]:
        high_score_index.discard(high_score[(rows, cols)][0])
        high_score_index.add(i)
        high_score[(rows, cols)] = (i, time)

with open(".idea/processed.txt", "w", encoding="UTF-8") as f:
    f.write("# 最高纪录\n")
    f.write("（按照产生纪录的时间排序。）\n")
    f.write("（小于0.1秒的分数有作弊的嫌疑，忽略不计。）\n")
    f.write("（以999开头的分数是我怀疑其作弊而添加的用于标注的前缀。）\n")
    f.write("| 玩家名 | 行 | 列 | 用时/秒 | 时间 |\n")
    f.write("| --- | ---: | ---: | ---: | --- |\n")
    for i in range(start, len(lines)):
        if i in high_score_index:
            line = lines[i]
            match = regex_match(line)
            line = "| %s | %s | %s | %s | %s |" % (match[0], match[1], match[2], match[3], match[4])
            f.write(line + "\n")
    f.write("# 计分板\n")
    f.write("（当前最高纪录用粗体表示。）\n")
    for i in range(start - 6, start):
        f.write(lines[i] + "\n")
    for i in range(start, len(lines)):
        line = lines[i]
        match = regex_match(line)
        if i in high_score_index:
            line = "| **%s** | **%s** | **%s** | **%s** | **%s** |" % (match[0], match[1], match[2], match[3], match[4])
        else:
            line = "| %s | %s | %s | %s | %s |" % (match[0], match[1], match[2], match[3], match[4])
        f.write(line + ("\n" if i != len(lines) - 1 else ""))
