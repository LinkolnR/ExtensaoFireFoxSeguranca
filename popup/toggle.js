document.addEventListener("DOMContentLoaded", function() {
    var secoes = document.querySelectorAll(".secao");
    secoes.forEach(function(secao) {
      secao.addEventListener("click", function() {
        var id = this.id.replace("secao", "conteudo");
        var conteudo = document.getElementById(id);
        if (conteudo.style.display === "none") {
          conteudo.style.display = "block";
        } else {
          conteudo.style.display = "none";
        }
      });
    });
  });
      