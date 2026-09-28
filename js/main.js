const catalogoProductos = document.getElementById('catalogo-productos');
const contenedorCarrito = document.getElementById('contenedor-carrito');
const totalItemsHTML = document.getElementById('total-items');
const totalDineroHTML = document.getElementById('total-dinero');
const bannerAsincrono = document.getElementById('banner-asincrono');


let productosDisponibles = []; 
let carrito = JSON.parse(localStorage.getItem('carrito')) ?? [];


const cargarCatalogoAPI = async () => {
    try {
        // Feedback visual de carga inicial en el DOM
        catalogoProductos.innerHTML = `<p style="color: #7f8c8d;">Cargando catálogo desde la API...</p>`;

        
        const respuesta = await fetch('https://fakestoreapi.com');
        
        if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");

        
        productosDisponibles = await respuesta.json();
        
        
        renderizarCatalogo(productosDisponibles);

        
        Toastify({
            text: "✅ Productos cargados desde internet con éxito",
            duration: 3000,
            gravity: "top", 
            position: "right", 
            style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
        }).showToast();

    } catch (error) {
        console.error(error);
        
        catalogoProductos.innerHTML = `<p style="color: #e74c3c; font-weight: bold;">No se pudieron cargar los productos de la API. Reintente más tarde.</p>`;
        
        Swal.fire({
            icon: 'error',
            title: '¡Error de Conexión!',
            text: 'No logramos conectar con el servidor externo de la API.',
            confirmButtonColor: '#e74c3c'
        });
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
                <small>Precio: $${price} | Stock disponible</small>
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
        ? contenedorCarrito.innerHTML = `<p style="color: #7f8c8d;">El carrito está vacío actualmente.</p>`
        : carrito.forEach(producto => {
            
            const { id, nombre, precio, cantidad } = producto;
            
            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <div>
                    <p><strong>${nombre}</strong></p>
                    <small>$${precio} x ${cantidad} u.</small>
                </div>
                <button class="btn-eliminar" onclick="eliminarProductoIndividual(${id})">❌</button>
            `;
            contenedorCarrito.appendChild(div);
        });

    actualizarContadores();
};

const actualizarContadores = () => {
    
    const totalUnidades = carrito.reduce((acumulador, { cantidad }) => acumulador + cantidad, 0);
    const totalPrecio = carrito.reduce((acumulador, { precio, cantidad }) => acumulador + (precio * cantidad), 0);

    totalItemsHTML.innerText = totalUnidades;
    totalDineroHTML.innerText = totalPrecio.toFixed(2); // Redondea a 2 decimales si los precios traen centavos
};

const guardarYSincronizar = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarVistaCarrito();
};

const agregarProducto = (productoNuevo) => {
    const existe = carrito.find(item => item?.id === productoNuevo?.id);
    
    
    existe ? existe.cantidad++ : carrito.push({ ...productoNuevo, quantity: undefined, cantidad: 1 });
    
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

    
    Toastify({
        text: `❌ Producto eliminado`,
        duration: 1500,
        gravity: "bottom",
        position: "left",
        style: { background: "#e74c3c" }
    }).showToast();
};

const vaciarTodoElCarrito = () => {
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Se borrarán todos los artículos del carrito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            localStorage.removeItem('carrito');
            renderizarVistaCarrito();
            
            Swal.fire(
                '¡Vaciado!',
                'Tu carrito vuelve a estar en cero.',
                'success'
            );
        }
    });
};


setTimeout(() => {
    bannerAsincrono.innerHTML = `🔔 Cotización del dólar hoy: $1200 ARS | ¡Disfrutá la experiencia interactiva!`;
    bannerAsincrono.classList.remove('hidden');
}, 3000);


document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarTodoElCarrito);


cargarCatalogoAPI();

renderizarVistaCarrito();