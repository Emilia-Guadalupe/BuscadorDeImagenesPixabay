const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');


const registrosPorPagina = 40;

let totalPaginas;
let iterador; 
let paginaActual = 1;

//Validar formulario

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value;
    
    if(terminoBusqueda === '') {
        mostrarAlerta('Agregá un término de búsqueda');
        return;
    }

    buscarImagenes();
}

//Mostrar alerta en caso de error y eliminarla después de 3 segundos

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {
    const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

    alerta.innerHTML = `
        <strong class='font-bold'>Error:</strong>
        <span class='block sm: inline'>${mensaje}</span>
    `;

    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
    }

}

//Función para consultar la API de Pixabay y buscar las imágenes

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = '19232562-fb21aefdc81051af64289ffc0';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado =>{
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las páginas

function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

//Función para calcular la cantidad de páginas que tendrá cada búsqueda

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}


//Eliminar la búsqueda anterior antes de mostrar los resultados de una búsqueda nueva

function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre el arreglo de imágenes y construir el HTML

    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">

                <div class="p-4">
                <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                <p class="font-bold">${views} <span class="font-light">Visualizaciones</span></p>

                <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                Ver imagen
                </a>
                </div>
            </div>
        </div>
        `;
    })

    //Limpiar el paginador o contador de páginas anterior
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    //Generar el nuevo HTML
    imprimirPaginador();
}

//Insertar el paginador o contador de páginas en el HTML

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const {value, done} = iterador.next();
        if(done) return;

        //En el caso de que no haya terminado, producir un botón por cada elemento del generador

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}