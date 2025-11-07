function modoEscuro() {
    let logo = document.querySelector(".logo");
    let header = document.querySelector("header");
    let main = document.querySelector("main");
    let topo = document.getElementById("topo");
    let corpo = document.getElementById("corpo");
    let p = document.querySelectorAll("p");
    let previewCor = document.getElementById("previewCor");
    let selectCor = document.getElementById("selectCor");
    let variacoesDeCores = document.querySelector(".variacao-de-cores");
    let footer = document.querySelector("footer");
    let paletas = document.querySelector(".paletas");
    let label = document.querySelectorAll("label");
    let tipoHarmonia = document.getElementById("tipo-harmonia");
    let paginaInternacional = idiomasSuportados.some(lang => window.location.pathname.includes(`/${lang}/`));

    if (troca.checked) {
        if(paginaInternacional){
            logo.src = getImagePath("favicon-branco.PNG");
        } else {
            logo.src = getImagePath("logo.PNG");
        }
        main.classList.remove("main-dark");
        topo.classList.remove("topo-dark");
        corpo.classList.remove("corpo-dark");
        p.forEach(el => el.classList.remove("p-dark"));
        previewCor.classList.remove("preview-dark");
        selectCor.classList.remove("preview-dark");
        resultado.classList.remove("resultado-dark");
        variacoesDeCores.classList.remove("variacao-de-cores-dark");
        footer.classList.remove("footer-dark");
        paletas.classList.remove("corpo-dark");
        label.forEach(el => el.classList.remove("p-dark"));
        tipoHarmonia.classList.remove("selector-dark")
    } else {
        if(paginaInternacional){
            logo.src = getImagePath("favicon.png");
        } else {
            logo.src = getImagePath("logo-black.png");
        }
        main.classList.add("main-dark");
        topo.classList.add("topo-dark");
        corpo.classList.add("corpo-dark");
        p.forEach(el => el.classList.add("p-dark"));
        previewCor.classList.add("preview-dark");
        selectCor.classList.add("preview-dark");
        resultado.classList.add("resultado-dark");
        variacoesDeCores.classList.add("variacao-de-cores-dark");
        footer.classList.add("footer-dark");
        paletas.classList.add("corpo-dark");
        label.forEach(el => el.classList.add("p-dark"));
        tipoHarmonia.classList.add("selector-dark");
    }
}

// Modo escuro 
let troca = document.getElementById("modo-escuro");
troca.addEventListener("change", function () {
    modoEscuro(); 
});
