#include <emscripten.h>

char EMSCRIPTEN_KEEPALIVE e[1024];

void EMSCRIPTEN_KEEPALIVE get_token(int l)
{
    // The initial contents of a memory are zero bytes.
    // https://webassembly.github.io/bulk-memory-operations/core/syntax/modules.html#data-segments
    for (int i = 0; e[i * 3] != '\0'; i++) e[i] = ((e[i * 3] - ' ') * 9025 + (e[i * 3 + 1] - ' ') * 95 + (e[i * 3 + 2] - ' ')) / l + ' ';
}
