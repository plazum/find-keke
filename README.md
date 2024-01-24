# find-keke
寻找唐可可：https://zrtech.org/find-keke/
- （短网址：[zrtech.org/tkk](https://zrtech.org/tkk)、[zrtech.org](https://zrtech.org)）

寻找唐可可（调试用）：https://zrtech.org/find-keke/debug
- （短网址：[zrtech.org/tkk_debug](https://zrtech.org/tkk_debug)）
- 后者跟前者唯一的不同是无论点哪个都能赢。设计这个一开始是为了测试网速的影响（有人反映图片加载慢导致他的计时不准），但是现在由于可以在不刷新页面的情况下开始一局新的游戏，所以这个的作用也就没有那么大了。

计分板和最高纪录（二代目，最新）：https://github.com/plazum/find-keke/issues/10

计分板和最高纪录（一代目）：https://github.com/plazum/find-keke/issues/11

计分板数据搜索：https://zrtech.org/find-keke/scoreboard

## 添加角色
欢迎给本游戏添加角色！

只需要经过以下简单的几步：

1. 准备一张与游戏棋盘中的图片除了角色之外内容完全一致的图片。
   1. 确保其分辨率为75×75。（你可以使用[这个网站](https://www.iloveimg.com/zh-cn/crop-image)对图片进行裁剪。）（另外，如果要进行更复杂的编辑，也可以试试[这个网站](https://www.photopea.com)，它相当于一个在线的Photoshop。）
   2. 确保图片和原有图片对齐（可以通过在浏览器的两个标签页中打开两张图片并来回切换以确定图片是否对齐）。
   3. 将文件的基本名（文件名由基本名和扩展名两部分组成）设置为角色的名（即，不包括姓）的罗马字写法，具体拼写请与`script-in-head.js`中的`placeholder.en`数组中的拼写保持一致。
      - 示例：`keke.jpg`；`kotori.jpg`；`you.jpg`

2. 在`script-in-body.js`的数组`images`中追加一个元素，按照格式填入图片的文件名和角色的中文名、日文名和日文名的罗马字写法（为了避免格式错误，可以先复制一个已有的元素然后再修改）。
   - 示例：
     ```javascript
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
     ];
     ```

3. 测试一下，没有问题的话就可以给本仓库发起拉取请求了！

## 关于许可的补充说明
本仓库的许可文件仅作用于除图片和视频文件以外的文件。

## 在本页中寻找唐可可
<details><summary>是不是藏在这里呢……</summary>
被你发现啦！

![keke-big.jpg](https://repository-images.githubusercontent.com/431044681/bbb358a6-de45-4d8a-b29b-f17cca522403)
</details>
