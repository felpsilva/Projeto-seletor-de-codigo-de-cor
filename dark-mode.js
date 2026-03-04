const idiomas = ['en', 'es', 'fr', 'de'];

const paginaInternacional = idiomas.some(lang =>
  window.location.pathname.includes(`/${lang}/`)
);

const basePath = paginaInternacional ? './../' : './';

function getImagePath(fileName) {
  return `${basePath}img01/${fileName}`;
}

const toggles = document.querySelectorAll("#modo-escuro");
const body = document.body;
const logo = document.querySelector(".logo");

function atualizarLogo(modoDark) {
  if (!logo) return;

  if (modoDark) {
    logo.src = paginaInternacional
      ? getImagePath("favicon.png")
      : getImagePath("logo-black.png");
  } else {
    logo.src = paginaInternacional
      ? getImagePath("favicon-branco.PNG")
      : getImagePath("logo.PNG");
  }
}

function modoEscuro(event) {
    console.log("Modo escuro toggled");
  const ativo = event.target.checked;

  // Sincroniza todos os toggles
  toggles.forEach(toggle => {
    toggle.checked = ativo;
  });

  body.classList.toggle("dark-mode", ativo);

  atualizarLogo(ativo);
}

// Event listener
toggles.forEach(toggle => {
  toggle.addEventListener("change", modoEscuro);
});