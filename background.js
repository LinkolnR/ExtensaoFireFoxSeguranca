// Array para armazenar os sites de terceiros capturados
var thirdPartySites = [];
var cookies ;
var localStorage = {};


function checkStorage(tabId, sendResponse) {
  browser.tabs.executeScript(tabId, {
    code: `({
      localStorageCount: Object.keys(localStorage).length,
      sessionStorageCount: Object.keys(sessionStorage).length
    })`
  }, function(results) {
    if (browser.runtime.lastError) {
      sendResponse({error: browser.runtime.lastError.message});
    } else {
      sendResponse({data: results[0]});
    }
  });
}

function getCookies(tabId, sendResponse) {
  browser.tabs.executeScript(tabId, {
      code: `({
        url: window.location.href
      })`
    }, function(results) {
      console.log(results);
    });
    
    
}


// Escuta todas as requisições
browser.webRequest.onBeforeRequest.addListener(
  async function(details) {
    var url = await getUrl()
    // Verifica se o domínio da requisição não é do próprio site
    if (!details.url.startsWith(url)){
      // Adiciona o site de terceiros ao array
    thirdPartySites.push(details.url);
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

// Listener para mensagens do popup.js
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Se a mensagem for para obter os sites de terceiros capturados, responde com a lista de sites
  if (request.action == "getCapturedSites") {
    sendResponse({sites: thirdPartySites});
  }else if (request.action == "getCookies"){
    rowser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        console.log("nuiasdbnashukbdsaiubndhsanildsanjkldnasjldnjiq")
        getCookies(tabs[0].id, sendResponse);
      } else {
        sendResponse({error: "No active tab found"});
      }
    });
    return true;
  }
  else if (request.action === "getStorage") {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        checkStorage(tabs[0].id, sendResponse);
      } else {
        sendResponse({error: "No active tab found"});
      }
    });
    return true;
  }
});


function getUrl() {
  return new Promise(function(resolve, reject) {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        var urlAtual = tabs[0].url;
        resolve(urlAtual);
      } else {
        reject("Não foi possível obter a URL da guia atual.");
      }
    });
  });
}

// function getUrl() {
//   // script to getting all cookies
//   var urlAtual = window.location.href;

// // Exibe a URL no console
//     console.log("URL da aba atual:", urlAtual);
//     console.log('teste')
//      console.log(results);
// }