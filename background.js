// Array para armazenar os sites de terceiros capturados
var thirdPartySites = new Set();
var cookies ;
var localStorage = {};
var urlPrincipal;

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
function getCookies(url, callback) {
  chrome.cookies.getAll({}, function(cookies) {
    const cookieDetails = {
      total: cookies.length,
      firstParty: 0,
      thirdParty: 0,
      sessionCookies: 0,
      persistentCookies: 0
    };

    cookies.forEach(cookie => {
      if (cookie.domain === url) {
        cookieDetails.firstParty++;
      } else {
        cookieDetails.thirdParty++;
      }

      if ("session" in cookie && cookie.session) {
        cookieDetails.sessionCookies++;
      } else {
        cookieDetails.persistentCookies++;
      }
    });

    callback(cookieDetails);
  });
}

// Variável para controlar se é necessário limpar o conjunto thirdPartySites
let limpar = false;
// Ouvinte de evento para quando uma nova guia é ativada
browser.tabs.onActivated.addListener(function(activeInfo) {
    // Define a flag para limpar o conjunto
    limpar = true;
});
// Ouvinte de evento para antes de cada requisição
browser.webRequest.onBeforeRequest.addListener(
    async function(details) {
        // Obter a URL da aba atual
        var url = await getUrl();
        // Limpa o conjunto thirdPartySites se a flag limpar estiver definida
        if (limpar) {
            thirdPartySites.clear();
            limpar = false; // Redefine a flag para false após a limpeza
        }

        // Verifica se o domínio da requisição é o mesmo que o da aba atual
        if (details.url === url) {
            console.log("A URL da requisição é a mesma que a da aba atual: ", details.url);
        } else if (!details.url.startsWith(url)) {
            // Adiciona o site de terceiros ao conjunto
            thirdPartySites.add(details.url);
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

function filtrarSet(set, urlPrincipal) {
  const resultado = new Set();
  
  // Itera sobre os elementos do conjunto
  for (const url of set) {
    // console.log ("FILTRAR SET")
    // console.log(urlPrincipal)
    // console.log(url)
    // console.log(url.startsWith(urlPrincipal))
      // Verifica se a URL não começa com a URL principal
      if (!url.startsWith(urlPrincipal)) {
          // Adiciona a URL ao conjunto resultado
          resultado.add(url);
      }
  }
  
  return resultado;
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getCapturedSites") {
    newurl = trataUrl(urlPrincipal)
    resultado = filtrarSet(thirdPartySites, newurl);
    sendResponse({sites: resultado});
    limpar = true;
  } else if (request.action == "getCookies") {
    newurl = trataUrl(urlPrincipal);
    getCookies(newurl, function(cookieDetails) {
      console.log(cookieDetails);
      sendResponse({cookies: cookieDetails});
    });
    // Importante retornar true para manter a conexão com sendResponse aberta
    return true;
  } else if (request.action === "getStorage") {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        checkStorage(tabs[0].id, sendResponse);
      } else {
        sendResponse({error: "No active tab found"});
      }
    });
    // Importante retornar true para manter a conexão com sendResponse aberta
    return true;
  }
});


function getUrl() {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            // Retorna a URL da aba ativa
            urlPrincipal = tabs[0].url;
        } else {
            reject(new Error('Não foi possível obter a URL da aba ativa'));
        }
    });
};
function trataUrl(url) {
  // Encontra a posição de "://"
  const indiceDoisPontosBarra = url.indexOf("://");

  // Se "://" for encontrado
  if (indiceDoisPontosBarra !== -1) {
    // Encontra a posição da primeira barra após "://"
    const indiceBarra = url.indexOf("/", indiceDoisPontosBarra + 3);

    // Extrai a parte da string até a primeira barra após "://"
    const parteUrl = indiceBarra !== -1 ? url.substring(0, indiceBarra) : url;

    // console.log(parteUrl); // Output: "https://chat.openai.com"
    return parteUrl;
  } else {
    console.log("Formato de URL inválido");
  }
}

