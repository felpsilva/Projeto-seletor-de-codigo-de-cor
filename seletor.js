// Seletores principais
const imageFile   = document.querySelector('#arquivo');
const preview     = document.querySelector('.preview');
const image       = document.querySelector('#image');
const fechar      = document.querySelector('#fechar');
const msg         = document.querySelector('.msg');
const zoom        = document.querySelector('.controleTamanho');
const mais        = document.querySelector('.mais');
const menos       = document.querySelector('.menos');
const canvas      = document.querySelector('#cs');
const resultado   = document.querySelector('#resultado');
const previewCor  = document.querySelector('#previewCor');
const variacoesDeCores  = document.querySelector('.variacao-de-cores');
let selectCor     = document.querySelector('#selectCor');
let variacoes = document.querySelectorAll('.variacao-de-cor');
let variacoesCoresClaras = document.querySelectorAll('.variacao-de-cor-clara');
let tipoHarmonia = document.getElementById("tipo-harmonia");
let largura = 100;
let altura  = 100;

// Estado inicial
fechar.classList.add('fecharOff');
zoom.classList.add('controleTamanhoOff');

// Função para atualizar tamanho da imagem
function atualizarTamanhoImagem() {
    image.style.width = `${largura}%`;
    image.style.height = `${altura}%`;
}

// Função para resetar visual
function resetarImagem() {
    image.removeAttribute('src');
    imageFile.value = "";
    fechar.classList.add('fecharOff');
    previewCor.style.backgroundColor = "transparent";
    selectCor.style.backgroundColor = "transparent";
    resultado.innerHTML = '';
    msg.classList.remove('msgDesativo');
    zoom.classList.add('controleTamanhoOff');
    largura = altura = 0;
    atualizarTamanhoImagem();
}

// Função para zoom
function aplicarZoom(delta) {
    largura += delta;
    altura  += delta;
    atualizarTamanhoImagem();
}

// Função para carregar imagem
function carregarImagem(arquivo) {
    const reader = new FileReader();
    reader.onloadend = () => image.setAttribute('src', reader.result);
    reader.readAsDataURL(arquivo);

    largura = altura = 100;
    atualizarTamanhoImagem();

    fechar.classList.remove('fecharOff');
    msg.classList.add('msgDesativo');
    zoom.classList.remove('controleTamanhoOff');
}

// Função para capturar cor no ponto
function capturarCor(x, y) {
    useCanvas(canvas, image, () => {
        const pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        const rgb   = `${pixel[0]}, ${pixel[1]}, ${pixel[2]}`;
        const hsl   = rgbParaHsl(pixel[0], pixel[1], pixel[2]);
        const hex   = rgbParaHex(pixel[0], pixel[1], pixel[2]);

        resultado.innerHTML  = `RGB: ${rgb}<br>`;
        resultado.innerHTML += `HSL: ${hsl}<br>`;
        resultado.innerHTML += `Hexadecimal: ${hex}`;

        selectCor.style.backgroundColor = hex;
        return selectCor.setAttribute("data-cor-hex", hex);
    });
}

// Função para usar canvas
function useCanvas(el, img, callback) {
    el.width = img.width;
    el.height = img.height;
    el.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    callback();
}

// Conversões de cor
function rgbParaHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
    }
    h = Math.round(h * 60);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h}, ${s}%, ${l}%`;
}

function conversorHex(v) {
    const hex = v.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function rgbParaHex(r, g, b) {
    return `#${conversorHex(r)}${conversorHex(g)}${conversorHex(b)}`;
}

function getVariacaoDeCor(cor, variacao, ton) {
    if(variacao === 0) return cor;

    cor = cor.replace(/^#/, "");

    // Expande shorthand tipo #abc → #aabbcc
    if (cor.length === 3) {
        cor = cor.split("").map(c => c + c).join("");
    }

    // Converte hex para RGB
    let r = parseInt(cor.substring(0, 2), 16);
    let g = parseInt(cor.substring(2, 4), 16);
    let b = parseInt(cor.substring(4, 6), 16);

    // Garante que a variação fique entre 0 e 100
    variacao = Math.min(100, Math.max(0, variacao));

    // Aplica fator
    if (ton === "escuro"){
        let fator = (100 - variacao) / 100;
        r = Math.round(r * fator);
        g = Math.round(g * fator);
        b = Math.round(b * fator);
        return rgbParaHex(r, g, b);
    }

    if (ton === "claro") {
        let fator = variacao / 100;
        r = Math.round(r + (255 - r) * fator);
        g = Math.round(g + (255 - g) * fator);
        b = Math.round(b + (255 - b) * fator);
        return rgbParaHex(r, g, b);
    }
}

function aplicarVariacaoDeCor() {
  let corBase = selectCor.getAttribute("data-cor-hex")
  let variacaoEscura = 0;
  let variacaoClara = 0
  Array.from(variacoes).forEach((variacaoCor) => {
    let tonsEscuros = getVariacaoDeCor(corBase, variacaoEscura, "escuro");
    console.log("tons escuros" + tonsEscuros);
    variacaoCor.style.backgroundColor = tonsEscuros;
    variacaoCor.querySelector('.variacao-de-cor .cor-hex').innerText = tonsEscuros;
    variacaoCor.querySelector('.variacao-de-cor .cor-hex').style.color = contrasteCor(tonsEscuros);
    variacaoEscura += 10;
  });

  Array.from(variacoesCoresClaras).forEach((variacaoCorClara) => {
    let tonsClaros = getVariacaoDeCor(corBase, variacaoClara, "claro");
    variacaoCorClara.style.backgroundColor = tonsClaros;
    variacaoCorClara.querySelector('.variacao-de-cor-clara .cor-hex').innerText = tonsClaros;
    variacaoCorClara.querySelector('.variacao-de-cor-clara .cor-hex').style.color = contrasteCor(tonsClaros);
    variacaoClara += 10;
  })
}

function contrasteCor(cor) {
    cor = cor.replace(/^#/, "");
    if (cor.length === 3) {
        cor = cor.split("").map(c => c + c).join("");
    }
    const r = parseInt(cor.substring(0, 2), 16);
    const g = parseInt(cor.substring(2, 4), 16);
    const b = parseInt(cor.substring(4, 6), 16);
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminancia > 0.5 ? '#000000' : '#FFFFFF';
}

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

    if (troca.checked) {
        logo.src = "./img01/logo.PNG";
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
        logo.src = "./img01/logo-black.png";
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

function copiarParaAreaDeTransferencia(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert(`Cor ${texto} copiada para a área de transferência!`);
        }).catch(err => {
        console.error('Erro ao copiar para a área de transferência: ', err);
        alert('Erro ao copiar para a área de transferência.');
    });
}

// Eventos
Array.from(variacoes).forEach(variacaoCor => {
    variacaoCor.addEventListener('click', () => {
        const corHex = variacaoCor.querySelector('.cor-hex').innerText;
        copiarParaAreaDeTransferencia(corHex);
    });
});

Array.from(variacoesCoresClaras).forEach(variacaoCorClara => {
    variacaoCorClara.addEventListener('click', () => {
        const corHex = variacaoCorClara.querySelector('.cor-hex').innerText;
        copiarParaAreaDeTransferencia(corHex);
    })
})

preview.onclick = () => {
    if (!image.src) imageFile.click();
};

aplicarVariacaoDeCor()
mais.addEventListener('click', () => aplicarZoom(20));
menos.addEventListener('click', () => aplicarZoom(-20));
fechar.addEventListener('click', resetarImagem);

window.addEventListener('DOMContentLoaded', () => {
    imageFile.addEventListener('change', e => {
        const arquivo = e.target.files.item(0);
        if (arquivo) carregarImagem(arquivo);
    });
});

image.addEventListener('mousemove', e => {
    const x = e.offsetX || e.layerX;
    const y = e.offsetY || e.layerY;
    useCanvas(canvas, image, () => {
        const pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        previewCor.style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    });
});

image.addEventListener('click', e => {
    const x = e.offsetX || e.layerX;
    const y = e.offsetY || e.layerY;
    capturarCor(x, y);
    let corBase1 = selectCor.getAttribute("data-cor-hex");
    console.log(corBase1);
    aplicarVariacaoDeCor();
    mostrarPaleta(corBase1);
});

// Modo escuro
let troca = document.getElementById("modo-escuro");
troca.addEventListener("change", function () {
    modoEscuro();
});

function hexToHsl(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

// Utilitário: HSL → HEX
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c/2;
  let [r, g, b] = [0,0,0];
  if (0 <= h && h < 60) [r,g,b] = [c,x,0];
  else if (60 <= h && h < 120) [r,g,b] = [x,c,0];
  else if (120 <= h && h < 180) [r,g,b] = [0,c,x];
  else if (180 <= h && h < 240) [r,g,b] = [0,x,c];
  else if (240 <= h && h < 300) [r,g,b] = [x,0,c];
  else if (300 <= h && h < 360) [r,g,b] = [c,0,x];
  r = Math.round((r+m) * 255);
  g = Math.round((g+m) * 255);
  b = Math.round((b+m) * 255);
  return "#" + [r,g,b].map(x=>x.toString(16).padStart(2,"0")).join("");
}

// Gerar paleta
function gerarPaleta(hex, tipo) {
  let [h, s, l] = hexToHsl(hex);
  let cores = [];

  switch (tipo) {
    case "complementar":
      cores = [h, (h+180)%360];
      break;
    case "analogas":
      cores = [h, (h+30)%360, (h+330)%360];
      break;
    case "triade":
      cores = [h, (h+120)%360, (h+240)%360];
      break;
    case "tetradica":
      cores = [h, (h+90)%360, (h+180)%360, (h+270)%360];
      break;
    case "monocromatica":
      cores = [h]; // mesma cor em 3 luminosidades
      return [hslToHex(h, s, l), hslToHex(h, s, Math.min(l+20,100)), hslToHex(h, s, Math.max(l-20,0))];
  }
  return cores.map(hue => hslToHex(hue, s, l));
}

// Renderizar paleta
function mostrarPaleta(hex) {
  let tipo = document.getElementById("tipo-harmonia").value;
  let paleta = gerarPaleta(hex, tipo);
  let container = document.getElementById("resultado-paleta");
  container.innerHTML = "";
  paleta.forEach(cor => {
    let div = document.createElement("div");
    let span = document.createElement("span");
    div.className = "caixa-cor";
    div.style.backgroundColor = cor;
    span.style.color = contrasteCor(cor);
    span.textContent = cor;
    container.appendChild(div);
    div.appendChild(span);
    div.addEventListener("click", () => copiarParaAreaDeTransferencia(cor));
  });
}

// Exemplo inicial: cor padrão
tipoHarmonia.addEventListener("change", () => mostrarPaleta(selectCor.getAttribute("data-cor-hex")));
mostrarPaleta(selectCor.getAttribute("data-cor-hex"));