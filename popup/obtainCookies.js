document.addEventListener("DOMContentLoaded",  function() {
  function contarCookiesPorCategoria() {
    // Objeto para armazenar contagem de cookies por categoria
    var contagemCookies = {};

    // Obtendo todos os cookies
    var todosCookies = Cookies.get();

    // Loop através de todos os cookies
    for (var cookieNome in todosCookies) {
        // Obtendo o primeiro segmento do nome do cookie como a categoria
        var categoria = cookieNome.split('_')[0];

        // Incrementando a contagem para a categoria atual
        if (contagemCookies[categoria] === undefined) {
            contagemCookies[categoria] = 1;
        } else {
            contagemCookies[categoria]++;
        }
    }

    // Exibindo a contagem de cookies por categoria
    for (var categoria in contagemCookies) {
        console.log('Categoria: ' + categoria + ', Quantidade: ' + contagemCookies[categoria]);
    }
}

// Chamando a função para contar os cookies por categoria
contarCookiesPorCategoria();
});
  
  // var theCookies = document.cookie.split(';');
  // var aString = '';
  // for (var i = 1 ; i <= theCookies.length; i++) {
  //     aString += i + ' ' + theCookies[i-1] + "\n";
  // }
  // console.log('Cookies: ', aString)


  // console.log("teste secundário : ")

  // const cookies = await document.cookieStore.getAll();

  // if (cookies.length > 0) {
  //   console.log("Cookies found  ")
  //   console.log(cookies);
  // } else {
  //   console.log("Cookie not found");
  // }

  // return aString;


