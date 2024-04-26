document.addEventListener('DOMContentLoaded', function() {
  browser.runtime.sendMessage({action: "getCapturedSites"}, function(response) {
    // Recebe a resposta com os sites de terceiros capturados e os exibe na página HTML
    response.sites.forEach(function(site) {
      var li = document.createElement('li');
      li.textContent = site;
      siteList.appendChild(li);
    });
  });
  // Envia a mensagem para o script de fundo pedindo pelos cookies
  browser.runtime.sendMessage({action: "getCookies"}, function(response) {
    // Recebe a resposta com os sites de terceiros capturados e os exibe na página HTML
    document.getElementById("cookieNum").textContent = "Esse é o número de cookies injetados : " + response.cookies;
  });

});

// função que envia a mensagem, pedindo a ação
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


// // função que envia a mensagem, pedindo a ação
// document.addEventListener('DOMContentLoaded', function() {
//   browser.runtime.sendMessage({action: "getCookies"}, function(response) {
//     console.log(response)
//     if (response.error) {
//       console.error('Error:', response.error);
//     } else {
//       document.getElementById("cookieNum").textContent = "Esse é o número de cookies injetados : " + response.cookies;
      
//     }
//   });
// });
//
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