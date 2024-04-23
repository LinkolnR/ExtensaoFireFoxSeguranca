// Array para armazenar os sites de terceiros capturados
var thirdPartySites = [];

// Escuta todas as requisições
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Verifica se o domínio da requisição não é do próprio site
    if (!details.url.startsWith("http://seu_site.com")) {
      console.log("Conexão com domínio de terceiros detectada:", details.url);
      // Adiciona o site de terceiros ao array
      thirdPartySites.push(details.url);
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

// Listener para mensagens do popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Se a mensagem for para obter os sites de terceiros capturados, responde com a lista de sites
  if (request.action == "getCapturedSites") {
    sendResponse({sites: thirdPartySites});
  }
});
