# leonardosiqueira.dev.br

Currículo online em português, inglês e espanhol, publicado via GitHub Pages.

## Estrutura

- `src/index.html`: template único com o conteúdo nos três idiomas (`lang="pt"`, `lang="en"`, `lang="es"`). **Edite somente este arquivo.**
- `scripts/build.mjs`: gera `index.html` (pt-BR), `en/index.html` e `es/index.html`, cada um só com o seu idioma, além de `sitemap.xml` e `robots.txt`. Título, descrição, canonical, hreflang, Open Graph e JSON-LD (Person/ProfilePage) ficam no objeto `LOCALES`.
- `scripts/og.html`: modelo das imagens de compartilhamento em `og/` (1200×630).
- `fonts/`: Inter, Inter Tight e JetBrains Mono (subset latin, licença OFL) servidas localmente.

## Publicar uma alteração

```bash
npm install      # só na primeira vez
npm run build
git add -A && git commit -m "..." && git push
```

## Regerar as imagens Open Graph

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for l in pt en es; do "$CHROME" --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=3000 --screenshot="$PWD/og/$l.png" "file://$PWD/scripts/og.html#$l"; done
```

## Impressão

O botão de impressão (ou Ctrl/Cmd+P) gera uma versão em formato de currículo A4 no idioma da página aberta, com o nome de arquivo sugerido "Currículo/Resume/Currículum - Leonardo Siqueira Pessanha".

## Google Search Console

O arquivo `google54f6d0ed8e73a575.html` na raiz verifica a propriedade no Search Console. Não remova.
