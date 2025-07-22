// --- Constantes y configuración ---
const API_URL = 'https://mocki.io/v1/d46dc365-f752-46ee-b0cd-c136aec38e99'; // API simulada
const CARRITO_KEY = 'tienda_futbol_carrito';

// --- Clases para manejar la lógica de negocio ---
class Producto {
    constructor(id, nombre, precio, stock = 10, imagen = '') {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen || `producto_${id}.jpg`;
    }
}

class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    }

    agregarProducto(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
            } else {
                throw new Error('No hay suficiente stock disponible');
            }
        } else {
            this.items.push({...producto, cantidad: 1});
        }
        
        this.guardar();
    }

    eliminarProducto(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardar();
    }

    actualizarCantidad(id, nuevaCantidad) {
        const producto = this.items.find(item => item.id === id);
        if (producto) {
            producto.cantidad = Math.max(1, Math.min(nuevaCantidad, producto.stock));
            this.guardar();
        }
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    vaciar() {
        this.items = [];
        this.guardar();
    }

    guardar() {
        localStorage.setItem(CARRITO_KEY, JSON.stringify(this.items));
    }

    get cantidadItems() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }
}

// --- Instancia global del carrito ---
const carrito = new Carrito();

// --- Funciones para manejar la UI ---
async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const data = await response.json();
        return data.map(p => new Producto(
            p.id, 
            p.nombre, 
            p.precio, 
            p.stock,
            p.imagen
        ));
    } catch (error) {
        console.error('Error:', error);
        // Datos de respaldo si falla la API
        return [
            new Producto(1, "Equipación Local 24/25", 79.99, 10, "producto_1.png"),
            new Producto(2, "Equipación Visitante 24/25", 79.99, 8, "visitante.png"),
            new Producto(3, "Tercera Equipación 24/25", 89.99, 5, "tercera_equipacion.jpg"),
            new Producto(4, "Equipación 90's", 69.99, 3, "equipacion_90s.jpg"),
            new Producto(5, "Equipación 2000's", 69.99, 7, "equipacion_2000s.jpg"),
            new Producto(6, "Equipación 80's", 69.99, 2, "equipacion_80s.jpg"),
            new Producto(7, "Bufanda Oficial", 24.99, 15, "bufanda.jpg"),
            new Producto(8, "Gorra Oficial", 29.99, 12, "gorra.jpg"),
            new Producto(9, "Mochila Oficial", 49.99, 6, "mochila.jpg")
        ];
    }
}

function renderizarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <img src="../assets/Guechas/Tienda/local.png ${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>€${producto.precio.toFixed(2)}</p>
            <p class="stock">Stock: ${producto.stock}</p>
            <button class="btn agregar-carrito" data-id="${producto.id}">
                Añadir al carrito
            </button>
        `;
        contenedor.appendChild(card);
    });
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito');
    const contador = document.getElementById('carrito-contador');
    const totalContainer = document.getElementById('carrito-total');
    
    contenedor.innerHTML = '';
    contador.textContent = carrito.cantidadItems;
    
    if (carrito.items.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
        totalContainer.innerHTML = '';
        return;
    }
    
    carrito.items.forEach(item => {
        const elemento = document.createElement('div');
        elemento.className = 'item-carrito';
        elemento.innerHTML = `
            <img src="../assets/Guechas/Tienda/${item.imagen}" alt="${item.nombre}" class="item-imagen">
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>€${item.precio.toFixed(2)} c/u</p>
                <div class="item-cantidad">
                    <button class="btn cantidad-btn" data-id="${item.id}" data-accion="decrementar">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn cantidad-btn" data-id="${item.id}" data-accion="incrementar">+</button>
                </div>
            </div>
            <button class="btn eliminar-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        contenedor.appendChild(elemento);
    });
    
    // Mostrar total
    totalContainer.innerHTML = `
        <div class="total-linea">
            <span>Subtotal:</span>
            <span>€${carrito.calcularTotal().toFixed(2)}</span>
        </div>
        <div class="total-linea">
            <span>Envío:</span>
            <span>€${(carrito.calcularTotal() > 100 ? 0 : 5.99).toFixed(2)}</span>
        </div>
        <div class="total-linea total">
            <strong>Total:</strong>
            <strong>€${(carrito.calcularTotal() + (carrito.calcularTotal() > 100 ? 0 : 5.99)).toFixed(2)}</strong>
        </div>
        <button id="btn-checkout" class="btn btn-primary">Proceder al pago</button>
    `;
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// --- Funciones para el proceso de compra ---
function iniciarCheckout() {
    // Simulación de proceso de compra
    mostrarNotificacion('Redirigiendo a pasarela de pago...');
    
    // Simular pago exitoso después de 2 segundos
    setTimeout(() => {
        mostrarNotificacion('Compra realizada con éxito!', 'success');
        carrito.vaciar();
        renderizarCarrito();
        
        // Mostrar resumen de compra (simulado)
        document.getElementById('checkout-resumen').innerHTML = `
            <h2>¡Gracias por tu compra!</h2>
            <p>Recibirás un correo con los detalles de tu pedido.</p>
            <button id="btn-volver" class="btn">Volver a la tienda</button>
        `;
    }, 2000);
}

// --- Inicialización y Eventos ---
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar productos
    const productos = await cargarProductos();
    renderizarProductos(productos);
    renderizarCarrito();
    
    // Delegación de eventos
    document.addEventListener('click', (e) => {
        // Añadir al carrito
        if (e.target.classList.contains('agregar-carrito')) {
            const id = parseInt(e.target.dataset.id);
            const producto = productos.find(p => p.id === id);
            
            try {
                carrito.agregarProducto(producto);
                renderizarCarrito();
                mostrarNotificacion(`${producto.nombre} añadido al carrito`);
            } catch (error) {
                mostrarNotificacion(error.message, 'error');
            }
        }
        
        // Eliminar del carrito
        if (e.target.classList.contains('eliminar-item') || 
            e.target.parentElement.classList.contains('eliminar-item')) {
            const id = parseInt(
                e.target.classList.contains('eliminar-item') ? 
                e.target.dataset.id : 
                e.target.parentElement.dataset.id
            );
            
            carrito.eliminarProducto(id);
            renderizarCarrito();
            mostrarNotificacion('Producto eliminado', 'warning');
        }
        
        // Cambiar cantidad
        if (e.target.classList.contains('cantidad-btn')) {
            const id = parseInt(e.target.dataset.id);
            const accion = e.target.dataset.accion;
            const item = carrito.items.find(item => item.id === id);
            
            if (item) {
                const nuevaCantidad = accion === 'incrementar' ? 
                    item.cantidad + 1 : 
                    item.cantidad - 1;
                
                carrito.actualizarCantidad(id, nuevaCantidad);
                renderizarCarrito();
            }
        }
        
        // Checkout
        if (e.target.id === 'btn-checkout') {
            iniciarCheckout();
        }
        
        // Vaciar carrito
        if (e.target.id === 'limpiar-carrito') {
            carrito.vaciar();
            renderizarCarrito();
            mostrarNotificacion('Carrito vaciado', 'warning');
        }
        
        // Volver a la tienda desde checkout
        if (e.target.id === 'btn-volver') {
            document.getElementById('checkout-resumen').innerHTML = '';
        }
    });

    // --- ABRIR/CERRAR CARRITO ---
    const carritoIcono = document.querySelector('.carrito-icono a');
    const carritoContainer = document.getElementById('carrito-container');

    // Abrir carrito al hacer click en el icono
    carritoIcono.addEventListener('click', function(e) {
        e.preventDefault();
        carritoContainer.classList.add('abierto');
    });

    // Cerrar carrito al hacer click fuera del modal (opcional)
    carritoContainer.addEventListener('click', function(e) {
        if (e.target === carritoContainer) {
            carritoContainer.classList.remove('abierto');
        }
    });

    const cerrarBtn = document.getElementById('cerrar-carrito');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', function() {
            carritoContainer.classList.remove('abierto');
        });
    }
});

