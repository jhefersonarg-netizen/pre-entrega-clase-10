

const catalogoProductos = document.getElementById('catalogo-productos');
const contenedorCarrito = document.getElementById('contenedor-carrito');
const totalItemsHTML = document.getElementById('total-items');
const totalDineroHTML = document.getElementById('total-dinero');
const bannerAsincrono = document.getElementById('banner-asincrono');


let productosDisponibles = []; 
let carrito = JSON.parse(localStorage.getItem('carrito')) ?? [];
     

const baseDatosProductos = [
    { id: 1, title: "Teclado Mecánico RGB", price: 45000 },
    { id: 2, title: "Mouse Inalámbrico Pro", price: 22000 },
    { id: 3, title: "Monitor Gamer 24''", price: 180000 },
    { id: 4, title: "Auriculares Premium", price: 35000 }
];

// 1. SOLICITAR DATOS: ASYNC / AWAIT CON ESTRUCTURA COMPLETA
const cargarCatalogoAPI = async () => {
    try {
        catalogoProductos.innerHTML = `<p id="texto-cargando" style="color: #7f8c8d; font-weight: bold;">Cargando productos...</p>`;

        
        productosDisponibles = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(baseDatosProductos);
            }, 1000);
        });
        
        renderizarCatalogo(productosDisponibles);

        Toastify({
            text: "✅ Productos cargados con éxito",
            duration: 3000,
            gravity: "top", 
            position: "right", 
            style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
        }).showToast();

    } catch (error) {
        console.error("Error detectado:", error);
        catalogoProductos.innerHTML = `<p style="color: #e74c3c; font-weight: bold;">No se pudieron cargar los productos.</p>`;
        
        Swal.fire({
            icon: 'error',
            title: '¡Error de carga!',
            text: 'Hubo un problema al procesar los datos de la tienda.',
            confirmButtonColor: '#e74c3c'
        });
    } finally {
        // Bloque finally requerido para restaurar el estado de la interfaz
        const textoCargando = document.getElementById('texto-cargando');
        if (textoCargando) {
            textoCargando.remove();
        }
    }
};

const renderizarCatalogo = (productos) => {
    catalogoProductos.innerHTML = '';
    productos.forEach(prod => {
        const { id, title, price } = prod;
        const div = document.createElement('div');
        div.className = 'producto-tarjeta';
        div.innerHTML = `
            <div>
                <p><strong>${title}</strong></p>
                <small>Precio: $${price}</small>
            </div>
            <button id="btn-add-${id}">Agregar</button>
        `;
        catalogoProductos.appendChild(div);

        document.getElementById(`btn-add-${id}`).addEventListener('click', () => {
            agregarProducto({ id, nombre: title, precio: price });
        });
    });
};


const renderizarVistaCarrito = () => {
    contenedorCarrito.innerHTML = '';
    carrito.length === 0 
        ? contenedorCarrito.innerHTML = `<p style="color: #7f8c8d;">El carrito está vacío.</p>`
        : carrito.forEach(producto => {
            const { id, nombre, precio, cantidad } = producto;
            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <div><p><strong>${nombre}</strong></p><small>$${precio} x ${cantidad} u.</small></div>
                <button class="btn-eliminar" onclick="eliminarProductoIndividual(${id})">❌</button>
            `;
            contenedorCarrito.appendChild(div);
        });
    actualizarContadores();
};

const actualizarContadores = () => {
    const totalUnidades = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const totalPrecio = carrito.reduce((acc, item) => acc + ((item.price || item.precio || 0) * (item.cantidad || 0)), 0);
    totalItemsHTML.innerText = totalUnidades;
    totalDineroHTML.innerText = totalPrecio.toLocaleString('es-AR');
};

const guardarYSincronizar = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarVistaCarrito();
};

const agregarProducto = (productoNuevo) => {
    const existe = carrito.find(item => item?.id === productoNuevo?.id);
    existe ? existe.cantidad++ : carrito.push({ id: productoNuevo.id, nombre: productoNuevo.nombre, precio: productoNuevo.precio, cantidad: 1 });
    guardarYSincronizar();

    Toastify({
        text: `➕ Producto añadido`,
        duration: 1500,
        gravity: "bottom",
        position: "left",
        style: { background: "#3498db" }
    }).showToast();
};

const eliminarProductoIndividual = (idSeleccionado) => {
    carrito = carrito.filter(item => item.id !== idSeleccionado);
    guardarYSincronizar();
    Toastify({ text: `❌ Producto eliminado`, duration: 1500, gravity: "bottom", position: "left", style: { background: "#e74c3c" } }).showToast();
};

const vaciarTodoElCarrito = () => {
    Swal.fire({
        title: '¿Estás seguro?', text: "¡Se borrarán los artículos!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Sí, vaciar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = []; localStorage.removeItem('carrito'); renderizarVistaCarrito();
            Swal.fire('¡Vaciado!', 'Tu carrito vuelve a estar en cero.', 'success');
        }
    });
};



setTimeout(() => {
    bannerAsincrono.innerHTML = `🔔 Cotización del dólar hoy: $1.200 ARS`;
    bannerAsincrono.classList.remove('hidden');
}, 3000);

document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarTodoElCarrito);


cargarCatalogoAPI();
renderizarVistaCarrito();

const finalizarCompra = () => {
    
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agrega al menos un producto al carrito antes de finalizar tu compra.',
            confirmButtonColor: '#3498db'
        });
        return; 
    }

    
    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        text: 'Muchas gracias por tu elección. El proceso de facturación ha finalizado.',
        confirmButtonColor: '#2ecc71'
    }).then(() => {
        
        carrito = [];
        localStorage.removeItem('carrito');
        renderizarVistaCarrito();
    });
};


document.getElementById('btn-comprar').addEventListener('click', finalizarCompra);






