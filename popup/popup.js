document.addEventListener('DOMContentLoaded', function() {
  // Limpa o componente <ul> antes de adicionar os novos itens
  var siteList = document.getElementById('siteList');
  while (siteList.firstChild) {
    siteList.removeChild(siteList.firstChild);
  }

  // Envia uma mensagem para o script de fundo pedindo pelos sites de terceiros capturados
  chrome.runtime.sendMessage({action: "getCapturedSites"}, function(response) {
    // Recebe a resposta com os sites de terceiros capturados e os exibe na página HTML
    response.sites.forEach(function(site) {
      var li = document.createElement('li');
      li.textContent = site;
      siteList.appendChild(li);
    });
  });
});
