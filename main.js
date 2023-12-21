let carritoVisible = false;

//espero a que los elementos cargen antes de ejecutar el script
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

// Reemplaza el array de datos original con una llamada a fetch
fetch('datos.json')
  .then(response => response.json())
  .then(data => {
    // Ahora, 'data' contiene el array de datos
    peluches = data;

    ready();
  })
  .catch(error => {
    console.error('Error al cargar datos desde el archivo JSON:', error);
  });

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
    Swal.fire({
        title: 'Gracias por la compra',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
    
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

//actualizo el total de Carrito
function actualizarTotalCarrito() {
    let carritoContenedor = document.getElementsByClassName('carrito')[0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;

    for (let i = 0; i < carritoItems.length; i++) {
        let item = carritoItems[i];
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        let precio = parseFloat(precioElemento.innerText.replace('$', '').replace(',', ''));
        
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        let cantidad = parseInt(cantidadItem.value);

        if (!isNaN(precio) && !isNaN(cantidad)) {
            console.log(precio)
            total += parseFloat((precio * cantidad/2).toFixed(2));
            console.log(total)
        }
    }

    // Formatear el total con dos decimales y agregar el símbolo $
    let totalFormateado = '$' + total.toFixed(2);

    document.getElementsByClassName('carrito-precio-total')[0].innerText = totalFormateado;
}

//funcion que agrega un item al carrito
function agregarItemAlCarrito(peluche) {
    let item = document.createElement('div');
    item.classList.add('carrito-item');
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    let id = peluche.id;
    let titulo = peluche.titulo;
    let precio = peluche.precio;
    let imagenSrc = peluche.imagenSrc;

    // Convertir la colección de elementos a un array y obtener los ids
    let idsItemsCarrito = Array.from(itemsCarrito.getElementsByClassName('carrito-item')).map(item => parseInt(item.dataset.itemId) || 0);

    console.log("Ids en el carrito:", idsItemsCarrito);

    // Controlar si el artículo ya está en el carrito
    if (idsItemsCarrito.includes(id)) {
        Swal.fire({
            title: 'El artículo ya está en el carrito',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
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
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    // Añadir el id como un atributo de datos al elemento del carrito
    item.dataset.itemId = id;

    // Agregar la funcionalidad eliminar al nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    // Agregar la funcionalidad restar cantidad del nuevo item
    let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    // Agregar la funcionalidad sumar cantidad del nuevo item
    let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    actualizarTotalCarrito();
}
//aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event){
    let botonClickeado = event.target;
    let selector = botonClickeado.parentElement;
    let cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual >= 1 && (selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual + 1);
    actualizarTotalCarrito();
}
//resto en uno la cantidad del elemento seleccionado
function restarCantidad(event){
    let botonClickeado = event.target;
    let selector = botonClickeado.parentElement;
    let cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual > 1 && (selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual - 1);
    actualizarTotalCarrito();
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

// Buscar peluche por título
function buscarPeluchePorTitulo(titulo) {
    return peluches.find(peluche => peluche.titulo === titulo);
}

// Filtrar peluches por precio máximo
function filtrarPeluchesPorPrecioMaximo(precioMaximo) {
    return peluches.filter(peluche => peluche.precio <= precioMaximo);
}