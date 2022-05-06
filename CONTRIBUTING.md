# 参与指南
## 如何添加角色
请看`README.md`。

## 注意事项
请始终保持`index.html`的功能和`debug.html`完全一致，除了后者无论点哪个都会赢之外。

为此，请在发起拉取请求之前，对这两个文件作一个diff，并确保它们只有一处不同，即`index.html`的`<head>`标签中的`<script>`标签中的`data-debug`属性的值为`false`，即
```html
<script id="script" src="script-in-head.js" data-debug="false"></script>
```
而`debug.html`的相应位置处的值为`true`，即
```html
<script id="script" src="script-in-head.js" data-debug="true"></script>
```

## 如何构建`get-token.wasm`
1. 安装[Emscripten](https://emscripten.org/docs/getting_started/downloads.html)和[WABT](https://github.com/WebAssembly/wabt/releases)。
2. 使用emcc将`get-token.c`编译成wasm：
   ```bash
   emcc get-token.c -o get-token.wasm --no-entry -Oz -sENVIRONMENT="web,webview"
   ```
3. 使用wasm2wat将wasm文件反编译成wat：
   ```bash
   wasm2wat get-token.wasm -o get-token.wat --inline-exports --generate-names
   ```
4. 去除多余的函数等，并将内存页数改为1。
5. 使用wat2wasm将wat文件编译成wasm：
   ```bash
   wat2wasm get-token.wat
   ```
