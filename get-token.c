#include <emscripten.h>

char EMSCRIPTEN_KEEPALIVE e[121];

void EMSCRIPTEN_KEEPALIVE get_token(int l)
{
    for (int i = 0; i < 40; i++) e[i] = ((e[i * 3] - ' ') * 9025 + (e[i * 3 + 1] - ' ') * 95 + (e[i * 3 + 2] - ' ')) / l + ' ';
}
