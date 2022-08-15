let  imageFile = document.querySelector('#arquivo')

let preview = document.querySelector('.preview')

//se o scr da imagem estiver vazio, ao clicar no preview será dado um click no input file
preview.onclick = () =>{
    if(image.src === "" ){
        document.getElementById('arquivo').click()   
    }

}

let image = document.getElementById('image');
let fechar = document.querySelector("#fechar");
let msg = document.querySelector(".msg");
fechar.classList.add('fecharOff');
let zoom = document.querySelector('.controleTamanho');
zoom.classList.add('controleTamanhoOff');
let mais = document.querySelector('.mais');
let menos = document.querySelector('.menos');


let largura = 100;
let altura = 100;

//Mecanismo de aproximar e diminuir (zoom), a cada clique no "+" a imagem cresce 20% de largura e altura
mais.addEventListener('click', () =>{
    
    largura += 20;
    altura += 20;

    image.style.width = `${largura}%`;
    image.style.height = `${altura }%`;


})

menos.addEventListener('click', () => {
    largura -= 20;
    altura -= 20;

    image.style.width = `${largura}%`;
    image.style.height = `${altura}%`;
})


/*Botão de fechar, quando clicado será removido o src da imagem que fará ela sumir,
o input file será limpo, o botão fechar receberá uma classe com display none,
o preview da cor da posição do mouse e o seletor de cor terão opacidade maxima,
o resultado da busca do código de cor sera zerado, remove a classe que desativa 
a mensagem de inserir a imagem,remove o controle de tamanho da imagem e tira o tamanho
predefinido da imagem*/
fechar.addEventListener('click', function(){
    image.removeAttribute('src');
    imageFile.value = ""
    fechar.classList.add('fecharOff')
    previewCor.style.backgroundColor = "rgba(255,255,255, 0)"
    selectCor.style.backgroundColor = "rgba(255,255,255, 0)"
    resultado.innerHTML = '';
    msg.classList.remove('msgDesativo');
    zoom.classList.add('controleTamanhoOff')

    image.style.width = `0px`;
    image.style.height = `0px`;
});


/*Ao carregar a página o input file recebe a função de mudança com 'imagem' de parâmetro
em seguida utilizo o parâmetro para coletar o primeiro arquivo do input file e
o insiro na constante 'arquivo'*/
window.addEventListener('DOMContentLoaded', () =>{

    imageFile.addEventListener('change', (imagem) => {
        const arquivo = imagem.target.files.item(0)
        
        //Crio uma função para ler arquivos e a insiro em uma constante       
        const endereco = new FileReader()
        
        /*Feita a leitura, a constate recebe a função de setar o atributo src e direcionar
        o resultado de sua leitura ao mesmo
        */
        endereco.onloadend = function(){
            image.setAttribute('src',endereco.result)
        }
        
        /*Por fim designo o leitor de arquivos que criei à ler o arquivo contido na
        constante 'arquivo' cujo conteúdo é o primeiro arquivo do input file.*/
        endereco.readAsDataURL(arquivo);

        //Deixei o tamanho da imagem e as variais de largura e altura com valores fixados
        image.style.width = '100%'
        image.style.height = '100%'
        largura = 100
        altura = 100

        //removi o botão de fechar a imagem, deixei a mensagem de de 'inserir imagem', visível e removi os botões de controle de tamanho.
        fechar.classList.remove('fecharOff');
        msg.classList.add('msgDesativo');
        zoom.classList.remove('controleTamanhoOff');
    });   
});


let selectCor = document.querySelector('#selectCor');

/*inseri o canvas, resultado, preview da cor, um x e um y com valor vazio,
em uma variável*/
let canvas = document.querySelector('#cs'), resultado = document.querySelector('#resultado'), previewCor = document.querySelector('#previewCor'), x = "", y = "";

//adicionei um evento de movimento de mouse a imagem que for inserida 
image.addEventListener('mousemove', (e) => {

/*se houver deslocamento do mouse a variável 'x' irá receber a posição 
do eixo x e a 'y' recebe a posição do eixo y do mouse*/
    if(e.offsetX){
      x =  e.offsetX ;
      y =  e.offsetY ;
    }

//método para o fire fox
    else if(e.layerX){
        x = e.layerX;
        y = e.layerY;
    }
// ----É aqui que acontece a mágica-----
//utilizei a função base, canvas, imagem e callback como parâmetros 
    useCanvas(canvas, image, function(){

/*O objetivo desta função é pegar a cor em RGB da posição em que o mouse estiver
e inserir em uma variável*/
    let p = canvas.getContext('2d').getImageData(x, y, 1, 1).data
        let rgb = p[0] + ',' + p[1] + ',' + p[2];

//utilizei a cor da da posição do mouse para "pintar" uma dive de referencia (preview)
    previewCor.style.backgroundColor = 'rgb('+ rgb +')' 
    
})
});

/*Para capturar a cor, utilizei o mesmo método porém o evento foi alterado para 
clique */
image.addEventListener('click', (e) =>{
    if(e.offsetX){
        x = e.offsetX;
        y = e.offsetY;
    }

/*Utilizei a função de base, como parâmetro utilizei canvas a imagem e a função de callback */
    useCanvas(canvas, image, () => {
    
// Novamente inseri a cor da posição do mouse em uma variável
    let p = canvas.getContext('2d').getImageData(x, y, 1, 1).data

// Aqui organizo as informações e as apresento no campo de resultados
    let rgb = p[0] + ',' + p[1] + ',' + p[2];
    let hsl = rgbParaHsl(p[0], p[1], p[2])
    let hex = rgbParaHex(p[0], p[1], p[2])
    resultado.innerHTML = 'RGB: '+ rgb +'<br>' 
    resultado.innerHTML += 'HSL: '+ hsl +'<br>' 
    resultado.innerHTML += 'Hexadecimal: ' + hex
    selectCor.style.backgroundColor = hex    
    });
});

/*Determinei uma função base para a utilização do canvas, e inseri os parâmetros */
function useCanvas(el, imagem,callback){
    //canvas irá receber o mesmo tamanho da imagem inserida 
    el.width = imagem.width;
    el.height = imagem.height;

    //insere toda imagem em si ao canvas em um contexto 2d e retorna um callback
    el.getContext('2d').drawImage(imagem, 0, 0, imagem.width, imagem.height);
    return callback();

};

//Função para converter rbg em HSL
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

//função que cria um conversor Hexadecimal 
function conversorHex(r){
    let hex = r.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};

//função para utilizar o conversor para converter RGB em Hexadecimal
function rgbParaHex(r, g, b){
    return '#' + conversorHex(r) + conversorHex(g) + conversorHex(b);
}