import csv
import datetime
import re
from math import ceil, log1p

pattern1 = re.compile(r"^[|] (.+) [|] (\d+) [|] (\d+) [|] (-?\d+[.]\d\d) [|]"
                      r" (([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d [(](.+)[)]) [|]$")
pattern2 = re.compile(r"^[|] ([*][*])(.+)\1 [|] \1(\d+)\1 [|] \1(\d+)\1 [|] \1(-?\d+[.]\d\d)\1 [|]"
                      r" \1(([A-Z][a-z][a-z] ){2}\d\d \d\d\d\d \d\d:\d\d:\d\d GMT[+-]\d\d\d\d [(](.+)[)])\1 [|]$")


def regex_match(line):
    if match := pattern1.match(line):
        return tuple(match.group(i) for i in (1, 2, 3, 4, 5))
    match = pattern2.match(line)
    return tuple(match.group(i) for i in (2, 3, 4, 5, 6))


with open(".idea/comment.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
lines = list(map(lambda l: l.removesuffix("\n"), lines))
top_score_index = set()
start = lines.index("| --- | --- | --- | --- | --- |") + 1
record_dict = {}

for i in range(start, len(lines)):
    match = regex_match(lines[i])
    timestamp = int(datetime.datetime.strptime(match[4][:33], "%a %b %d %Y %H:%M:%S GMT%z").timestamp())
    match += (timestamp, )
    lines[i] = match
# 对记录按产生时间排序
lines_record_part = lines[start:]
lines_record_part.sort(key=lambda x: x[5])
lines[start:] = lines_record_part
for i in range(start, len(lines)):
    lines[i] += (i, )  # i用于后面的top_score_index

board_num = next(l for l in lines if l.startswith("# 计分板"))[5:]

# # 生成CSV文件，取消注释即可使用
# with open("scoreboard-" + board_num + ".csv", "w", newline="") as csvfile:
#     fieldnames = ("玩家名", "行", "列", "用时/秒", "时间", "UNIX时间戳")
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
#     writer.writeheader()
#     for record in lines[start:]:
#         writer.writerow({
#             "玩家名": record[0],
#             "行": record[1],
#             "列": record[2],
#             "用时/秒": "'" + record[3],
#             "时间": record[4],
#             "UNIX时间戳": record[5]
#         })
# exit()

# # 统计各内置玩家名出现次数
# names = ["涩谷香音", "唐可可", "岚千砂都", "平安名堇", "叶月恋", "圣泽悠奈", "柊摩央",
#          "澁谷かのん", "嵐千砂都", "平安名すみれ", "葉月恋", "聖澤悠奈",
#          "Shibuya Kanon", "Tang Keke", "Arashi Chisato", "Heanna Sumire", "Hazuki Ren", "Hijirisawa Yuuna", "Hiiragi Mao"]
# name_count = {name: 0 for name in names}
# total = 0
# for i in range(start, len(lines)):
#     if lines[i][0] in names:
#         name_count[lines[i][0]] += 1
#         total += 1
# print(name_count)
# print(" 计分板%s |\n ---: |" % board_num)
# for name in names:
#     print("%-18s\t| %d |" % (name, name_count[name]))
# print(" %d |\n %d |" % (total, len(lines) - start))
# exit()

for i in range(start, len(lines)):
    record = lines[i]
    time = float(record[3])
    # 小于0.1秒的分数不计
    if time < 0.1:
        continue
    rows = int(record[1])
    cols = int(record[2])
    if (rows, cols) not in record_dict:
        record_dict[(rows, cols)] = [record]
    else:
        record_dict[(rows, cols)].append(record)

# 对记录按用时排序并对每种棋盘大小保留前ceil(ln(x + 1))项
record_list = [record_dict[map_size] for map_size in sorted(record_dict.keys(), key=lambda x: (x[0] * x[1], x[1]))]
for i in range(len(record_list)):
    record_list[i].sort(key=lambda x: float(x[3]))
    record_list[i] = record_list[i][:ceil(log1p(len(record_list[i])))]
    top_score_index.add(record_list[i][0][6])

with open(".idea/processed.txt", "w", encoding="utf-8") as f:
    prev_id = re.search(r"\d+", lines[0]).group()
    f.write("# 查看其他计分板：<!--[下一个](#issuecomment-next_id)、-->[上一个](#issuecomment-" + prev_id + ")\n")
    f.write("<!--\n本计分板已经达到长度限制，无法继续更新。感谢大家的热情支持！\n")
    f.write("为了供有需要的人更方便地研究数据，在此提供以CSV格式存储的数据，文件编码为GBK，可以直接在Excel中打开：")
    f.write("https://zrtech.org/find-keke/scoreboard-" + board_num + ".csv\n-->\n")
    f.write("# 最高纪录（计分板" + board_num + "）\n")
    f.write("（按照棋盘大小和用时排序。）\n")
    f.write("（当前最高纪录用粗体表示。）\n")
    f.write("（对于每种棋盘大小，显示前 $\\left\\lceil ln(x+1)\\right\\rceil$ 名（用到的函数为`ceil(log1p(x))`）（分数相同时，先产生记录者优先）。）\n")
    f.write("（小于0.1秒的分数有作弊的嫌疑，忽略不计。）\n")
    f.write("（部分分数开头的999是我怀疑其作弊而添加的用于标注的前缀。）\n")
    f.write("| 玩家名 | 行 | 列 | 用时/秒 | 时间 |\n")
    f.write("| --- | ---: | ---: | ---: | --- |\n")
    for records_of_a_map in record_list:
        line = "| **%s** | **%s** | **%s** | **%s** | **%s** |" \
               % (records_of_a_map[0][0], records_of_a_map[0][1], records_of_a_map[0][2], records_of_a_map[0][3],
                  records_of_a_map[0][4])
        f.write(line + "\n")
        for i in range(1, len(records_of_a_map)):
            line = "| %s | %s | %s | %s | %s |" \
                   % (records_of_a_map[i][0], records_of_a_map[i][1], records_of_a_map[i][2], records_of_a_map[i][3],
                      records_of_a_map[i][4])
            f.write(line + "\n")
    f.write("# 计分板" + board_num + "\n")
    f.write("<!--\n<details><summary>展开%d条记录</summary>\n\n-->\n" % (len(lines) - start))
    f.write("| 玩家名 | 行 | 列 | 用时/秒 | 时间 |\n")
    f.write("| --- | ---: | ---: | ---: | --- |\n")
    f.write("| player name | 14 | 10 | 0.00 | Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间) |\n")
    f.write("| test | 14 | 10 | 0.00 | Thu Jan 01 1970 00:00:00 GMT+0000 (格林尼治标准时间) |\n")
    f.write("| hoge fuga | 14 | 10 | 0.00 | Thu Jan 01 1970 09:00:00 GMT+0900 (日本标准时间) |\n")
    f.write("| --- | --- | --- | --- | --- |\n")
    for i in range(start, len(lines)):
        record = lines[i]
        if i in top_score_index:
            line = "| **%s** | **%s** | **%s** | **%s** | **%s** |" % (record[0], record[1], record[2], record[3], record[4])
        else:
            line = "| %s | %s | %s | %s | %s |" % (record[0], record[1], record[2], record[3], record[4])
        f.write(line + ("\n" if i != len(lines) - 1 else ""))
