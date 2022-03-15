# 参与指南
## 如何添加角色
请看`README.md`。

## 注意事项
始终保持`index.html`的功能和`debug.html`完全一致，除了后者无论点哪个都会赢之外。

为此，请在发起拉取请求之前，对这两个文件作一个diff，并确保它们只有一处不同，即`index.html`的`<head>`标签中的`<script>`标签中的`data-debug`属性的值为`0`，即
```html
<script id="script" src="script-in-head.js" data-debug="0"></script>
```
而`debug.html`的相应位置处的值为`1`，即
```html
<script id="script" src="script-in-head.js" data-debug="1"></script>
```
