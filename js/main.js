// --- Datos de productos ---
const PRODUCTOS = [
    { id: 1, nombre: "Equipación Local 24/25", precio: 79.99 },
    { id: 2, nombre: "Equipación Visitante 24/25", precio: 79.99 },
    { id: 3, nombre: "Tercera Equipación 24/25", precio: 89.99 },
    { id: 4, nombre: "Equipación 90's", precio: 69.99 },
    { id: 5, nombre: "Equipación 2000's", precio: 69.99 },
    { id: 6, nombre: "Equipación 80's", precio: 69.99 },
    { id: 7, nombre: "Bufanda Oficial", precio: 24.99 },
    { id: 8, nombre: "Gorra Oficial", precio: 29.99 },
    { id: 9, nombre: "Mochila Oficial", precio: 49.99 }
];

// --- Recuperar carrito de localStorage o inicializarlo ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- Mostrar carrito en el HTML ---
function mostrarCarrito() {
    const contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }
    carrito.forEach(item => {
        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <span>${item.nombre} - €${item.precio.toFixed(2)}</span>
        `;
        contenedor.appendChild(div);
    });
    // Total
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    const totalDiv = document.createElement("div");
    totalDiv.className = "carrito-total";
    totalDiv.innerHTML = `<strong>Total: €${total.toFixed(2)}</strong>`;
    contenedor.appendChild(totalDiv);
}

// --- Agregar producto al carrito ---
function agregarAlCarrito(nombreProducto) {
    const producto = PRODUCTOS.find(p => p.nombre === nombreProducto);
    if (producto) {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}

// --- Limpiar carrito ---
function limpiarCarrito() {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// --- Eventos ---
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();

    // Delegación de eventos para todos los botones "Añadir al carrito"
    document.body.addEventListener("click", e => {
        if (e.target.classList.contains("agregar-carrito")) {
            const nombreProducto = e.target.getAttribute("data-producto");
            agregarAlCarrito(nombreProducto);
        }
    });

    // Botón para limpiar carrito
    const btnLimpiar = document.getElementById("limpiar-carrito");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarCarrito);
    }
});