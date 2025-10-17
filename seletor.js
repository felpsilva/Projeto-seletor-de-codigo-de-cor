/** ===========================
 * 🎨 SELETOR DE CORES - VERSÃO REFINADA
 * ============================ **/

// -------- SELETORES PRINCIPAIS --------

const idiomasSuportados = ['en', 'es', 'fr', 'de'];

const selectors = {
    file: document.querySelector('#arquivo'),
    preview: document.querySelector('.preview'),
    image: document.querySelector('#image'),
    close: document.querySelector('#fechar'),
    msg: document.querySelector('.msg'),
    zoom: document.querySelector('.controleTamanho'),
    zoomIn: document.querySelector('.mais'),
    zoomOut: document.querySelector('.menos'),
    canvas: document.querySelector('#cs'),
    result: document.querySelector('#resultado'),
    previewColor: document.querySelector('#previewCor'),
    colorOutput: document.querySelector('#selectCor'),
    darkToggle: document.querySelector('#modo-escuro'),
    harmonyType: document.querySelector('#tipo-harmonia'),
    variationsDark: document.querySelectorAll('.variacao-de-cor'),
    variationsLight: document.querySelectorAll('.variacao-de-cor-clara'),
    palettesContainer: document.querySelector('#resultado-paleta'),
    tipoHarmonia: document.getElementById("tipo-harmonia"),
    paginaInternacional: idiomasSuportados.some(lang => window.location.pathname.includes(`/${lang}/`))
};

let { file, preview, image, close, msg, zoom, zoomIn, zoomOut, canvas, result, previewColor, colorOutput, harmonyType, variationsDark, variationsLight, palettesContainer, tipoHarmonia, paginaInternacional } = selectors;

const basePath = paginaInternacional ? './../' : './';

// -------- ESTADO INICIAL --------
let [width, height] = [100, 100];
close.classList.add('fecharOff');
zoom.classList.add('controleTamanhoOff');

// -------- FUNÇÕES AUXILIARES --------
const atualizarTamanho = () => {
    image.style.width = `${width}%`;
    image.style.height = `${height}%`;
};

const resetarImagem = () => {
    image.removeAttribute('src');
    file.value = '';
    close.classList.add('fecharOff');
    previewColor.style.backgroundColor = colorOutput.style.backgroundColor = 'transparent';
    result.innerHTML = '';
    msg.classList.remove('msgDesativo');
    zoom.classList.add('controleTamanhoOff');
    width = height = 0;
    atualizarTamanho();
};

const aplicarZoom = delta => {
    if (width > 20 || delta >= 20) {
        width += delta;
        height += delta;
        atualizarTamanho();
    }
};

// -------- CARREGAMENTO DE IMAGEM --------
const carregarImagem = arquivo => {
    const reader = new FileReader();
    reader.onloadend = () => (image.src = reader.result);
    reader.readAsDataURL(arquivo);

    width = height = 100;
    atualizarTamanho();
    close.classList.remove('fecharOff');
    msg.classList.add('msgDesativo');
    zoom.classList.remove('controleTamanhoOff');
};

// -------- CAPTURA DE COR --------
const capturarCor = (x, y) => {
    useCanvas(canvas, image, () => {
        const [r, g, b, a] = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        const rgb = `${r}, ${g}, ${b}`;
        const hsl = rgbParaHsl(r, g, b);
        const hex = rgbParaHex(r, g, b);

        result.innerHTML = `
      RGB: ${rgb}<br>
      HSL: ${hsl}<br>
      Hexadecimal: ${hex}
    `;

        colorOutput.style.backgroundColor = hex;
        colorOutput.setAttribute('data-cor-hex', hex);
    });
};

// -------- CANVAS --------
const useCanvas = (el, img, callback) => {
    const ctx = el.getContext('2d');
    el.width = img.width;
    el.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    callback();
};

// -------- CONVERSÕES DE COR --------
const rgbParaHsl = (r, g, b) => {
    [r, g, b] = [r, g, b].map(v => v / 255);
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h *= 60;
    }

    return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
};

const rgbParaHex = (r, g, b) => `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;

// -------- VARIAÇÕES DE COR --------
const getVariacaoDeCor = (cor, variacao, ton) => {
    if (variacao === 0) return cor;
    cor = cor.replace(/^#/, '').padEnd(6, cor.slice(-1));

    let [r, g, b] = [
        parseInt(cor.substring(0, 2), 16),
        parseInt(cor.substring(2, 4), 16),
        parseInt(cor.substring(4, 6), 16)
    ];

    variacao = Math.min(100, Math.max(0, variacao));
    let fator = variacao / 100;

    if (ton === 'escuro') {
        [r, g, b] = [r, g, b].map(v => Math.round(v * (1 - fator)));
    } else {
        [r, g, b] = [r, g, b].map(v => Math.round(v + (255 - v) * fator));
    }

    return rgbParaHex(r, g, b);
};

const contrasteCor = cor => {
    cor = cor.replace(/^#/, '');
    const [r, g, b] = [
        parseInt(cor.substring(0, 2), 16),
        parseInt(cor.substring(2, 4), 16),
        parseInt(cor.substring(4, 6), 16)
    ];
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminancia > 0.5 ? '#000' : '#fff';
};

// -------- APLICAÇÃO DE VARIAÇÕES --------
const aplicarVariacaoDeCor = () => {
    const corBase = colorOutput.getAttribute('data-cor-hex') || '#336699';
    let variacaoEscura = 0, variacaoClara = 0;

    variationsDark.forEach(div => {
        const hex = getVariacaoDeCor(corBase, variacaoEscura, 'escuro');
        const label = div.querySelector('.cor-hex');
        div.style.backgroundColor = hex;
        label.innerText = hex;
        label.style.color = contrasteCor(hex);
        variacaoEscura += 10;
    });

    variationsLight.forEach(div => {
        const hex = getVariacaoDeCor(corBase, variacaoClara, 'claro');
        const label = div.querySelector('.cor-hex');
        div.style.backgroundColor = hex;
        label.innerText = hex;
        label.style.color = contrasteCor(hex);
        variacaoClara += 10;
    });
};

// -------- PALLETES HARMONIZADAS --------
const hexToHsl = hex => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    let [r, g, b] = [
        parseInt(hex.substring(0, 2), 16) / 255,
        parseInt(hex.substring(2, 4), 16) / 255,
        parseInt(hex.substring(4, 6), 16) / 255
    ];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

const hslToHex = (h, s, l) => {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let [r, g, b] = [0, 0, 0];

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];

    return rgbParaHex(
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    );
};

const gerarPaleta = (hex, tipo) => {
    const [h, s, l] = hexToHsl(hex);
    switch (tipo) {
        case 'complementar': return [hslToHex(h, s, l), hslToHex((h + 180) % 360, s, l)];
        case 'analogas': return [hslToHex(h, s, l), hslToHex((h + 30) % 360, s, l), hslToHex((h + 330) % 360, s, l)];
        case 'triade': return [hslToHex(h, s, l), hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
        case 'tetradica': return [hslToHex(h, s, l), hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)];
        case 'monocromatica': return [hslToHex(h, s, l), hslToHex(h, s, Math.min(l + 20, 100)), hslToHex(h, s, Math.max(l - 20, 0))];
        default: return [];
    }
};

const mostrarPaleta = hex => {
    const tipo = harmonyType.value;
    const paleta = gerarPaleta(hex, tipo);
    palettesContainer.innerHTML = '';
    paleta.forEach(cor => {
        const div = document.createElement('div');
        div.className = 'caixa-cor';
        div.style.backgroundColor = cor;
        div.textContent = cor;
        div.style.color = contrasteCor(cor);
        div.addEventListener('click', () => copiarParaAreaDeTransferencia(cor));
        palettesContainer.appendChild(div);
    });
};

function getImagePath(fileName) {
  return `${basePath}img01/${fileName}`;
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
        logo.src = getImagePath("logo.PNG");
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
        logo.src = getImagePath("logo-black.png");
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

// -------- CÓPIA DE CORES --------
const copiarParaAreaDeTransferencia = texto =>
    navigator.clipboard.writeText(texto)
        .then(() => alert(`Cor ${texto} copiada!`))
        .catch(() => alert('Erro ao copiar cor!'));

// -------- EVENTOS PRINCIPAIS --------
preview.addEventListener('click', () => !image.src && file.click());
zoomIn.addEventListener('click', () => aplicarZoom(20));
zoomOut.addEventListener('click', () => aplicarZoom(-20));
close.addEventListener('click', resetarImagem);

file.addEventListener('change', e => {
    const arquivo = e.target.files.item(0);
    if (arquivo) carregarImagem(arquivo);
});

image.addEventListener('mousemove', e => {
    const { offsetX, offsetY } = e;
    useCanvas(canvas, image, () => {
        const pixel = canvas.getContext('2d').getImageData(offsetX, offsetY, 1, 1).data;
        previewColor.style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    });
});

image.addEventListener('click', e => {
    const { offsetX, offsetY } = e;
    capturarCor(offsetX, offsetY);
    aplicarVariacaoDeCor();
    mostrarPaleta(colorOutput.getAttribute('data-cor-hex'));
});

harmonyType.addEventListener('change', () =>
    mostrarPaleta(colorOutput.getAttribute('data-cor-hex'))
);

function mostrarDescricaoHarmonia(tipo) {
    document.querySelectorAll('#descricao-harmonias .descricao').forEach(el => el.hidden = true);

    const descricaoAtiva = document.getElementById(`descricao-${tipo}`);
    if (descricaoAtiva) {
        descricaoAtiva.hidden = false;
    }
}

// copiar variações de cor 
document.querySelectorAll('.cor-hex').forEach(el => {
    el.addEventListener('click', function() {
        copiarParaAreaDeTransferencia(this.innerText);
    });
});

// Quando o tipo de harmonia for alterado:
tipoHarmonia.addEventListener("change", () => {
    mostrarPaleta(selectCor.getAttribute("data-cor-hex"));
    mostrarDescricaoHarmonia(tipoHarmonia.value);
});

// Modo escuro 
let troca = document.getElementById("modo-escuro");
troca.addEventListener("change", function () {
    modoEscuro(); 
});

// Exibe o primeiro por padrão:
mostrarDescricaoHarmonia("complementar");

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    mostrarPaleta(colorOutput.getAttribute('data-cor-hex'))
    aplicarVariacaoDeCor();
});
