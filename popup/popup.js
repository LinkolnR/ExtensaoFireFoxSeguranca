// getCapturedSites
carregou_uma_vez = false;
document.addEventListener('DOMContentLoaded', function() {
  // Envia a mensagem para o script de fundo pedindo pelos sites de terceiros capturados]
  if (!carregou_uma_vez){
    console.log("entrou no if");
    browser.runtime.sendMessage({action: "getCapturedSites"}, function(response) {
      // Recebe a resposta com os sites de terceiros capturados e os exibe na página HTML
      response.sites.forEach(function(site) {
        var li = document.createElement('li');
        li.textContent = site;
        siteList.appendChild(li);
      });
    });
  }
  carregou_uma_vez = true;
});


// função que envia a mensagem, pedindo a ação
// getStorage
document.addEventListener('DOMContentLoaded', function() {
  browser.runtime.sendMessage({action: "getStorage"}, function(response) {
    if (response.error) {
      console.error('Error:', response.error);
      document.getElementById("numeroLocalStorage").textContent = 'Não foi possível checar o local storage';
      document.getElementById("numeroSessionStorage").textContent = 'Não foi possível checar o session storage';
    } else {
      // Assuming response.data contains { localStorageCount: <number>, sessionStorageCount: <number> }
      document.getElementById("numeroLocalStorage").textContent = 'Número de itens salvos no localstorage : ' + response.data.localStorageCount;
      document.getElementById("numeroSessionStorage").textContent = 'Número de itens salvos no sessionstorage : ' + response.data.sessionStorageCount;
    }
  });
});


// getCookies
document.addEventListener('DOMContentLoaded', function() {
  browser.runtime.sendMessage({action: "getCookies"}, function(response) {
    // Recebe a resposta com os sites de terceiros capturados e os exibe na página HTML
    document.getElementById("cookieCount").textContent = "Esse é o número de cookies injetados : " + response.cookies.total;
    document.getElementById("cookieSite").textContent = "Número de cookies firstParty : " + response.cookies.firstParty;
    document.getElementById("cookieTerceitos").textContent = "Número de cookies thirdParty : " + response.cookies.thirdParty;
    document.getElementById("cookieSession").textContent = "Número de cookies de sessão: " + response.cookies.sessionCookies;
    document.getElementById("cookieFixo").textContent = "Número de cookies persistentes : " + response.cookies.persistentCookies;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  browser.runtime.sendMessage({action: "getCanvasFingerprint"}, function(response) {
    // Recebe a resposta com os sites de terceiros capturados e os exibe na página HTML
    document.getElementById("canvasFingerprint").textContent = "Esse é o fingerprint do canvas : " + response.canvasFingerprint;
  });
});



document.addEventListener('DOMContentLoaded', function() {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    browser.tabs.executeScript(tabs[0].id, {
        code: `({
          url: window.location.href
        })`
      }, function(results) {
        console.log(results[0].url);
      });
  });
});