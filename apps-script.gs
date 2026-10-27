/**
 * VORA — Webhook do quiz para Google Sheets
 * ------------------------------------------------------------
 * Recebe os POSTs do quiz (eventos "quiz_complete" e "lead") e grava
 * uma linha por evento na aba "Respostas".
 *
 * Como publicar:
 *   1) Crie uma planilha no Google Sheets.
 *   2) Extensões → Apps Script.
 *   3) Cole este arquivo inteiro (substituindo o Code.gs padrão).
 *   4) Implantar → Nova implantação → Tipo: App da Web.
 *        - Executar como: Eu
 *        - Quem tem acesso: Qualquer pessoa
 *   5) Copie a URL que termina em /exec e cole em CONFIG.SHEETS_WEBHOOK_URL (no index.html).
 *
 * Obs.: o quiz envia com mode:'no-cors' e Content-Type text/plain, por isso
 * lemos de e.postData.contents e respondemos texto simples.
 */

const COLS = ['data_hora','evento','session_id','genero','idade','momento','objetivo','trava',
  'motivacao','meta','tempo','nome','whatsapp','utm_source','utm_medium','utm_campaign',
  'utm_content','utm_term','fbclid','user_agent'];

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Respostas') || ss.insertSheet('Respostas');
  if (sh.getLastRow() === 0) sh.appendRow(COLS);
  const d = JSON.parse((e.postData && e.postData.contents) || '{}');
  d.data_hora = new Date();
  sh.appendRow(COLS.map(c => d[c] ?? ''));
  return ContentService.createTextOutput('ok');
}

/** Opcional: abrir a URL /exec no navegador deve responder "ok" (teste rápido). */
function doGet() {
  return ContentService.createTextOutput('ok');
}
