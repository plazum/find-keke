# find-keke
寻找唐可可：https://zrtech.org/find-keke/

寻找唐可可（调试用）：https://zrtech.org/find-keke/debug

后者跟前者唯一的不同是无论点哪个都能赢。设计这个一开始是为了测试网速的影响（有人反映图片加载慢导致他的计时不准），但是现在由于可以在不刷新页面的情况下开始一局新的游戏，所以这个的作用也就没有那么大了。

## 添加角色
欢迎给本小游戏添加角色作为干扰项！

只需要经过以下简单的几步：

1. 准备一张与游戏棋盘中的图片除了角色之外内容完全一致的图片。
   1. 确保其分辨率为75×75。
   2. 确保图片和原有图片对齐（可以通过在浏览器的两个标签页中打开两张图片并来回切换以确定图片是否对齐）。
   3. 将文件的基本名（文件名由基本名和扩展名两部分组成）设置为角色的名（即，不包括姓）的罗马字写法（可以参考[https://love-live.fandom.com/wiki/Category:Characters][url]）（对于中文名，使用拼音）。
      - 示例：`keke.jpg`；`kotori.jpg`；`you.jpg`

[url]:https://love-live.fandom.com/wiki/Category:Characters

2. 在`index.html`和`debug.html`的`<head>`部分的脚本的全局变量`image`中，在最后追加图片的文件名。
   - 示例：`var image = ["kotori.jpg", "you.jpg"];`


3. 在`index.html`和`debug.html`的`<body>`部分的复选框部分中，在最后追加一行（建议直接复制粘贴），将复选框的`id`设为当前添加角色的序号**减一**，将标签设为角色的中文名。
   - 示例：
     ```
     <label><input id="0" type="checkbox" checked onchange="generate_map(last_rows, last_cols)">南小鸟</label>
     <label><input id="1" type="checkbox" checked onchange="generate_map(last_rows, last_cols)">渡边曜</label>
     ```

4. 测试一下，然后就给本仓库创建拉取请求吧！

## 在本页中寻找唐可可

<details><summary>是不是藏在这里呢……</summary>
被你发现啦！

![keke-big.jpg](https://repository-images.githubusercontent.com/431044681/bbb358a6-de45-4d8a-b29b-f17cca522403)
</details>
