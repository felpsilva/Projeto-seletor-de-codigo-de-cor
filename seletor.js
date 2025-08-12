// Seletores principais
const imageFile   = document.querySelector('#arquivo');
const preview     = document.querySelector('.preview');
const image       = document.querySelector('#image');
const fechar      = document.querySelector('#fechar');
const msg         = document.querySelector('.msg');
const zoom        = document.querySelector('.controleTamanho');
const mais        = document.querySelector('.mais');
const menos       = document.querySelector('.menos');
const selectCor   = document.querySelector('#selectCor');
const canvas      = document.querySelector('#cs');
const resultado   = document.querySelector('#resultado');
const previewCor  = document.querySelector('#previewCor');

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

// Eventos
preview.onclick = () => {
    if (!image.src) imageFile.click();
};

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
});
