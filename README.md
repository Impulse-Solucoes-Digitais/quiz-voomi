# Quiz Voomi — Funil TikTok Shop

Landing page de funil de quiz (arquivo único, sem build) para captação de leads de afiliados do TikTok Shop — vender sem estoque e sem aparecer na câmera.

## Fluxo

Capa → 4 perguntas (uma por tela, com barra de progresso) → transição "Analisando sua resposta…" → tela da VSL com diagnóstico personalizado → captura (nome + WhatsApp) → redirecionamento para o WhatsApp.

- **Pergunta 1:** notificações de venda se acumulando abaixo dos cards.
- **Perguntas 2–4:** animação/conteúdo específico abaixo de cada pergunta (diagrama do método, mensagem da loja, relógio).
- Visual escuro com fundo aurora + grid, cores da marca (`#FE2C55` / `#25F4EE`), mobile-first (390px).
- Estado 100% em memória (sem localStorage/sessionStorage).

## Como abrir

Basta abrir o `index.html` no navegador (duplo clique). Não há dependências de build.

Para testar via servidor local (necessário só para pixels/vídeo com URL real):

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000/index.html
```

## Arquivos

- `index.html` — todo o quiz (HTML, CSS e JS inline).
- `hero.jpg` — imagem do topo da capa (troque o arquivo mantendo o nome para atualizar).

## Configuração

Tudo editável no topo do `<script>` em `index.html` (seção CONFIGURAÇÃO):

- `WHATSAPP_NUMBER` — número de destino do WhatsApp.
- `TRANS1_NOTIFS` / `NOTIF_TIMES` — produtos, comissões e horários das notificações de venda.
- `QUESTIONS` — perguntas, opções e conteúdo abaixo de cada uma.
- `DIAG_Q2` — frases do diagnóstico personalizado (baseado na pergunta 2).

## Pendências

- Substituir o vídeo da VSL (bloco `.video-slot`).
- Trocar `og-image.jpg` (imagem de compartilhamento 1200×630).
- Preencher os IDs dos pixels Meta/TikTok (snippets comentados no `<head>`).
- Ajustar produtos/comissões reais nas notificações.
