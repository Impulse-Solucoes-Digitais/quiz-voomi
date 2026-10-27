# Rastreamento e captura de dados — Quiz VORA

Esta é a camada de **back-end/dados** do quiz. O visual, as telas e o fluxo **não foram alterados**.
Tudo funciona com **placeholders**: enquanto um campo do `CONFIG` estiver vazio, aquela integração
fica desligada — sem erro, e o quiz roda normal.

## Onde fica a configuração

No topo do `index.html`, dentro do `<head>`:

```js
const CONFIG = {
  META_PIXEL_ID:     '',   // ID do Pixel da Meta. Vazio = Pixel desligado.
  SHEETS_WEBHOOK_URL:'',   // URL /exec do Apps Script. Vazio = não envia à planilha.
  PANDA_EMBED_URL:   '',   // URL do embed do Panda. Vazio = mantém o placeholder da VSL.
  SEGUNDOS_PITCH:     0,    // 0 = botão de oferta aparece direto; >0 = aparece nesse segundo do vídeo.
};
```

---

## 1) Planilha do Google (respostas + leads)

1. Crie uma planilha nova no Google Sheets.
2. **Extensões → Apps Script.**
3. Apague o conteúdo do `Code.gs` e cole **todo** o arquivo [`apps-script.gs`](./apps-script.gs).
4. **Implantar → Nova implantação.**
5. Em “Selecione o tipo”, escolha **App da Web**.
6. Configure:
   - **Executar como:** `Eu`
   - **Quem tem acesso:** `Qualquer pessoa`
7. Clique em **Implantar**, autorize o acesso à sua conta e **copie a URL** que termina em `/exec`.
8. Cole essa URL em `CONFIG.SHEETS_WEBHOOK_URL`.

A aba **“Respostas”** é criada sozinha no primeiro envio, com o cabeçalho das colunas.

**O que é enviado e quando** (sempre com o mesmo `session_id`):
- `quiz_complete` — ao terminar a última pergunta → respostas + UTMs.
- `lead` — ao enviar o formulário de WhatsApp → nome + WhatsApp + respostas + UTMs.

> Teste rápido: abrir a URL `/exec` no navegador deve mostrar `ok`.

---

## 2) Pixel da Meta

1. Pegue o **ID do Pixel** no Gerenciador de Eventos da Meta.
2. Cole em `CONFIG.META_PIXEL_ID`.
   - O código base do Pixel já está no `<head>` e **só carrega se houver ID**. Ele dispara `PageView`.
3. **Testar:** Gerenciador de Eventos → **Testar eventos** → abra a URL do quiz e vá respondendo.
   Você deve ver, em tempo real: `PageView`, `QuizStart`, `QuizStep`, `QuizComplete`, `ResultView`,
   `UnlockClick`, `PitchReached` e, ao enviar o WhatsApp, `Lead`.

**Eventos enviados:**

| Evento | Quando | Tipo |
|---|---|---|
| `PageView` | carga da página | padrão |
| `QuizStart` | clique no CTA da capa | custom |
| `QuizStep` | cada resposta (`step`, `pergunta`, `resposta`) | custom |
| `QuizComplete` | após a última resposta (respostas, sem dados pessoais) | custom |
| `ResultView` | entra na tela de resultado (`meta`) | custom |
| `UnlockClick` | clique em “Desbloquear acesso” | custom |
| `PitchReached` | botão de oferta aparece na VSL | custom |
| `Lead` | envio do formulário de WhatsApp | padrão |
| `InitiateCheckout` | clique num botão de checkout (quando houver) | padrão |

> **Nome e WhatsApp nunca vão para o Pixel** — só para a planilha.
> `InitiateCheckout`: ainda não há botão de checkout no fluxo. Quando houver, use
> `onclick="voraGoCheckout('URL_DO_CHECKOUT')"` — ele dispara o evento e abre o link já com as UTMs.

---

## 3) UTMify (UTMs)

1. No painel da UTMify, copie o **script oficial** de UTMs dela.
2. No `index.html`, procure o marcador no `<head>`:

   ```html
   <!-- UTMIFY_SNIPPET -->
   ```
3. Cole o script **logo abaixo** desse comentário. (Não use código “inventado” — só o snippet oficial.)

Independente da UTMify, a página já:
- lê da URL `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, src, sck` e salva na sessão;
- não sobrescreve um valor existente com vazio ao navegar;
- anexa as UTMs em **todos os links de saída** (WhatsApp e checkout), sem duplicar parâmetros.

---

## 4) VSL no Panda Video

1. No Panda, copie a **URL do embed** do vídeo.
2. Cole em `CONFIG.PANDA_EMBED_URL`. A página troca o placeholder por um player **vertical (9:16)**.
   (Vazio = mantém o placeholder atual.)
3. Defina `CONFIG.SEGUNDOS_PITCH` com o **segundo do vídeo** em que o botão de oferta deve aparecer
   (ex.: 25:45 = `25*60+45` = `1545`). `0` = aparece direto.
   - Com `> 0`, o botão fica escondido e aparece quando o vídeo atinge esse tempo, ouvindo os eventos
     de progresso do player do Panda (`panda_timeupdate` / `currentTime`, via `postMessage` — API oficial).
   - **Fallback:** se nenhum evento do player chegar, o botão aparece após `SEGUNDOS_PITCH` segundos de
     relógio desde a entrada na tela.
   - Quando o botão aparece, dispara `PitchReached`.

> Para testar o passo do WhatsApp **sem vídeo**, abra o console e rode `voraShowCTA()`.

---

## 5) Modo de teste (`?debug=1`)

Abra a URL do quiz com `?debug=1` (ex.: `.../index.html?debug=1`). Um painel no canto superior direito mostra,
em tempo real:
- status de cada integração (**Pixel / Planilha / Panda** = ON/OFF);
- o `session_id` da sessão;
- cada evento de `track()` e cada payload enviado para a planilha (`[TRACK]` e `[SHEET]`).

---

## O que já funciona agora (sem preencher nada)

- Fluxo do quiz, `session_id`, captura e persistência de UTMs, e anexação das UTMs no link do WhatsApp.
- Todos os `track()` e `sendToSheet()` **rodam** e aparecem no painel `?debug=1` (apenas não enviam para
  Pixel/planilha enquanto os campos estiverem vazios).
- VSL com placeholder; botão de oferta respeitando `SEGUNDOS_PITCH` (0 = direto).

## O que depende de você preencher no `CONFIG`

| Campo | Libera |
|---|---|
| `META_PIXEL_ID` | Disparo real dos eventos no Pixel da Meta |
| `SHEETS_WEBHOOK_URL` | Gravação das respostas e leads na planilha |
| `PANDA_EMBED_URL` | Troca o placeholder pelo vídeo real da VSL |
| `SEGUNDOS_PITCH` | Momento em que o botão de oferta aparece |
| `<!-- UTMIFY_SNIPPET -->` | Colar o script oficial da UTMify |
