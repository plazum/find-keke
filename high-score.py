import re

with open(".idea/comment.txt", "r", encoding="UTF-8") as f:
    lines = f.readlines()
pattern = re.compile(r"^[|] ([*][*][*])?(.+)\1? [|] \1?(\d+)\1? [|] \1?(\d+)\1? [|] \1?([-]?\d+[.]\d\d)\1? [|]"
                     r" \1?(([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d (.+))\1? [|]$")
lines = list(map(lambda l: l.strip(), lines))
high_score = {}
high_score_index = set()
for i in range(len(lines)):
    if lines[i] == "| --- | --- | --- | --- | --- |":
        start = i + 1
        break

for i in range(start, len(lines)):
    match = pattern.match(lines[i])
    time = float(match.group(5))
    # 小于0.1秒的分数不计
    if time < 0.1:
        continue
    rows = match.group(3)
    cols = match.group(4)
    if not (rows, cols) in high_score:
        high_score_index.add(i)
        high_score[(rows, cols)] = (i, time)
    elif time < high_score[(rows, cols)][1]:
        high_score_index.discard(high_score[(rows, cols)][0])
        high_score_index.add(i)
        high_score[(rows, cols)] = (i, time)

print(high_score)
with open(".idea/processed.txt", "w", encoding="UTF-8") as f:
    f.write("# 最高纪录\n（按照产生纪录的时间排序。小于0.1秒的分数有作弊的嫌疑，忽略不计。）\n")
    f.write("| 玩家名 | 行 | 列 | 用时/秒 | 时间 |\n")
    f.write("| --- | ---: | ---: | ---: | --- |\n")
    for i in range(start, len(lines)):
        if i in high_score_index:
            line = lines[i]
            match = pattern.match(line)
            line = "| %s | %s | %s | %s | %s |" \
                % (match.group(2), match.group(3), match.group(4), match.group(5), match.group(6))
            f.write(line + "\n")
    f.write("# 计分板\n（当前最高纪录用加粗斜体表示。）\n")
    for i in range(start - 6, start):
        f.write(lines[i] + "\n")
    for i in range(start, len(lines)):
        line = lines[i]
        match = pattern.match(line)
        if i in high_score_index:
            line = "| ***%s*** | ***%s*** | ***%s*** | ***%s*** | ***%s*** |" \
                % (match.group(2), match.group(3), match.group(4), match.group(5), match.group(6))
        else:
            line = "| %s | %s | %s | %s | %s |" \
                % (match.group(2), match.group(3), match.group(4), match.group(5), match.group(6))
        f.write(line + ("\n" if i != len(lines) - 1 else ""))
