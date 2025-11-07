document.addEventListener("DOMContentLoaded", () => {
    const selectIdioma = document.getElementById("idioma");
    if (!selectIdioma) return;

    const path = window.location.pathname;

    // Detecta idioma atual pela URL
    if (path.includes("/en/")) {
        selectIdioma.value = "/en/";
    } else if (path.includes("/es/")) {
        selectIdioma.value = "/es/";
    } else {
        selectIdioma.value = "/";
    }

    // Mapeamento entre as páginas equivalentes
    const equivalencias = {
        "index.html": {
            "/": "index.html",
            "/en/": "index.html",
            "/es/": "index.html"
        },
        "politica-privacidade.html": {
            "/": "politica-privacidade.html",
            "/en/": "privacy-policy.html",
            "/es/": "politica-de-privacidad.html"
        },
        "privacy-policy.html": {
            "/": "politica-privacidade.html",
            "/en/": "privacy-policy.html",
            "/es/": "politica-de-privacidad.html"
        },
        "politica-de-privacidad.html": {
            "/": "politica-privacidade.html",
            "/en/": "privacy-policy.html",
            "/es/": "politica-de-privacidad.html"
        }
    };

    // Obtém o nome do arquivo atual
    let arquivo = path.split("/").pop();
    if (arquivo === "" || arquivo === undefined) arquivo = "index.html";

    selectIdioma.addEventListener("change", (e) => {
        const idiomaSelecionado = e.target.value;

        // Verifica se há página equivalente, senão volta para home
        const novaPagina =
            equivalencias[arquivo]?.[idiomaSelecionado] || "index.html";

        // Redireciona
        window.location.href = idiomaSelecionado + novaPagina;
    });
});
