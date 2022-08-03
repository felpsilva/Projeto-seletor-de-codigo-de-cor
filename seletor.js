let  imageFile = document.querySelector('#arquivo')

let preview = document.querySelector('.preview')

preview.onclick = () =>{
    if(image.src === "" ){
        document.getElementById('arquivo').click()   
    }
  
}

let image = document.getElementById('image')
let fechar = document.querySelector("#fechar");
let msg = document.querySelector(".msg");
fechar.classList.add('fecharOff')


fechar.addEventListener('click', function(){
    image.removeAttribute('src');
    imageFile.value = ""
    fechar.classList.add('fecharOff')
    previewCor.style.backgroundColor = "rgba(255,255,255, 0)"
    selectCor.style.backgroundColor = "rgba(255,255,255, 0)"
    resultado.innerHTML = '';
    msg.classList.remove('msgDesativo')
});


window.addEventListener('DOMContentLoaded', () =>{

    imageFile.addEventListener('change', (imagem) => {
        const arquivo = imagem.target.files.item(0)
        const endereco = new FileReader()
        endereco.onloadend = function(){
            image.setAttribute('src',endereco.result)
        }
        endereco.readAsDataURL(arquivo);
        //image.style.width = '100%';
        //image.style.height = '100%';

        fechar.classList.remove('fecharOff');
        msg.classList.add('msgDesativo')
    });   
});


let selectCor = document.querySelector('#selectCor');
let canvas = document.querySelector('#cs'), resultado = document.querySelector('#resultado'), previewCor = document.querySelector('#previewCor'), x = "", y = "";

image.addEventListener('mousemove', (e) => {
    if(e.offsetX){
      x =  e.offsetX ;
      y =  e.offsetY ;
    }
    else if(e.layerX){
        x = e.layerX;
        y = e.layerY;
    }

    useCanvas(canvas, image, function(){
    let p = canvas.getContext('2d').getImageData(x, y, 1, 1).data
        let rgb = p[0] + ',' + p[1] + ',' + p[2];


    previewCor.style.backgroundColor = 'rgb('+ rgb +')' 
    
},false)
});


image.addEventListener('click', (e) =>{
    if(e.offsetX){
        x = e.offsetX;
        y = e.offsetY;
    }

    useCanvas(canvas, image, () => {
    let p = canvas.getContext('2d').getImageData(x, y, 1, 1).data
    
    let rgb = p[0] + ',' + p[1] + ',' + p[2];
    let hsl = rgbParaHsl(p[0], p[1], p[2])
    let hex = rgbParaHex(p[0], p[1], p[2])
    resultado.innerHTML = 'RGB: '+ rgb +'<br>' 
    resultado.innerHTML += 'HSL: '+ hsl +'<br>' 
    resultado.innerHTML += 'Hexadecimal: ' + hex
    
    selectCor.style.backgroundColor = hex    
    });

});
function useCanvas(el, imagem,callback){
    el.width = imagem.width;
    el.height = imagem.height;

    el.getContext('2d').drawImage(imagem, 0, 0, imagem.width, imagem.height);
    return callback();

};

function rgbParaHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min)/ 2;

    if(max == min){
        h = s = 0;
    }else{
        let d = max - min;
        s = l > 0.5 ? d/ (2 - max - min) : d / (max + min);

        switch(max){
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - b) / d + 4;
                break;
        }
    }

    h = h * 60;
    s = Math.floor(s * 100);
    l = Math.floor(l * 100);

    if(h > 0){
        h = Math.floor(h);
    }else{
        h = Math.floor(360 - h)
    }

    let ins = h + ", " + s + "%, " + l + "%";
    return ins
};

function conversorHex(r){
    let hex = r.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};

function rgbParaHex(r, g, b){
    return '#' + conversorHex(r) + conversorHex(g) + conversorHex(b);
}