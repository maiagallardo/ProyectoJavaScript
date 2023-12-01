let carritoVisible = false;

//espero a que los elementos cargen antes de ejecutar el script
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

const peluches = [
    { titulo: 'Alice', precio: 3999, imagenSrc: './multimedia/peluchitoUno.PNG' },
    { titulo: 'Alonso', precio: 3999, imagenSrc: './multimedia/peluchitoDos.PNG' },
    { titulo: 'Buzz', precio: 3999, imagenSrc: './multimedia/peluchitoTres.PNG' },
    { titulo: 'Kenny', precio: 3999, imagenSrc: './multimedia/peluchitoCuatro.PNG' },
    { titulo: 'Olivia', precio: 3999, imagenSrc: './multimedia/peluchitoCinco.PNG' },
    { titulo: 'Poppy', precio: 3999, imagenSrc: './multimedia/peluchitoSeis.PNG' },
    { titulo: 'Rosie', precio: 3999, imagenSrc: './multimedia/peluchitoSiete.PNG' },
    { titulo: 'Sipash', precio: 3999, imagenSrc: './multimedia/peluchitoOcho.PNG' },
    { titulo: 'Sofia', precio: 3999, imagenSrc: './multimedia/peluchitoNueve.PNG' }
];

function ready(){
    
    //agrego funcionalidad a los botones eliminar del carrito
    let botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(let i=0;i<botonesEliminarItem.length; i++){
        let boton = botonesEliminarItem[i];
        boton.addEventListener('click',eliminarItemCarrito);
    }

    //Agrego funcionalidad al boton sumar cantidad
    let botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for(let i=0;i<botonesSumarCantidad.length; i++){
        let boton = botonesSumarCantidad[i];
        boton.addEventListener('click',sumarCantidad);
    }

     //Agrego funcionalidad al buton restar cantidad
    let botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for(let i=0;i<botonesRestarCantidad.length; i++){
        let boton = botonesRestarCantidad[i];
        boton.addEventListener('click',restarCantidad);
    }

    //agrego funcionalidad al boton Agregar al carrito
    let botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for(let i=0; i<botonesAgregarAlCarrito.length;i++){
        let boton = botonesAgregarAlCarrito[i];
        boton.addEventListener('click', (event) => agregarAlCarritoClickeado(event, i));
    }

    //agrego funcionalidad al botón comprar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click',pagarClickeado)
}

function pagarClickeado(){
    alert("Gracias por la compra");
    
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild)
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

//funcion que controla el boton clickeado de agregar al carrito
function agregarAlCarritoClickeado(event, indicePeluche) {
    let boton = event.target;
    let peluche = peluches[indicePeluche];
    agregarItemAlCarrito(peluche);
    hacerVisibleCarrito();
}

//funcion que hace visible el carrito
function hacerVisibleCarrito(){
    carritoVisible = true;
    let carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    let items =document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

//funcion que agrega un item al carrito
function agregarItemAlCarrito(peluche){
    let item = document.createElement('div');
    item.classList.add('carrito-item');
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    let titulo = peluche.titulo;
    let precio = peluche.precio;
    let imagenSrc = peluche.imagenSrc;

    //controlamos que el item que intenta ingresar no se encuentre en el carrito
    let nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for(let i=0;i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText==titulo){
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    let itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <boton class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </boton>
        </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //agrego la funcionalidad eliminar al nuevo item
     item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    //agrego al funcionalidad restar cantidad del nuevo item
    let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click',restarCantidad);

    //agrego la funcionalidad sumar cantidad del nuevo item
    let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click',sumarCantidad);

    actualizarTotalCarrito();
}
//aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event){
    let botonClickeado = event.target;
    let selector = botonClickeado.parentElement;
    console.log(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}
//resto en uno la cantidad del elemento seleccionado
function restarCantidad(event){
    let botonClickeado = event.target;
    let selector = botonClickeado.parentElement;
    console.log(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

//elimino el item seleccionado del carrito
function eliminarItemCarrito(event){
    let botonClickeado = event.target;
    botonClickeado.parentElement.parentElement.remove();

    actualizarTotalCarrito();
    ocultarCarrito();
}

//funcion que controla si hay elementos en el carrito, si no hay oculto el carrito.
function ocultarCarrito(){
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount==0){
        let carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;
    
        let items =document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

//actualizo el total de Carrito
function actualizarTotalCarrito(){
    //seleccionamos el contenedor carrito
    let carritoContenedor = document.getElementsByClassName('carrito')[0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;
    //recorremos cada elemento del carrito para actualizar el total
    for(let i=0; i< carritoItems.length;i++){
        let item = carritoItems[i];
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        //quitamos el simobolo peso y el punto de milesimos.
        let precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        console.log(precio);
        let cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100)/100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$'+total.toLocaleString("es") + ",00";
}

// Buscar peluche por título
function buscarPeluchePorTitulo(titulo) {
    return peluches.find(peluche => peluche.titulo === titulo);
}

// Filtrar peluches por precio máximo
function filtrarPeluchesPorPrecioMaximo(precioMaximo) {
    return peluches.filter(peluche => peluche.precio <= precioMaximo);
}