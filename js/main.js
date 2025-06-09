const PRODUCTOS = ["Equipación Local", "Equipación Visitante", "Tercera Equipación"];
const PRECIOS = [79.99, 79.99, 89.99];
let saldo = 0;

// Validar usuario
function saludarUsuario() {
    let nombre = prompt("Ingresa tu nombre:");
    let saldoUsuario = parseFloat(prompt("Ingresa tu saldo inicial:"));
    alert(`Hola ${nombre}, tienes $${saldoUsuario} para gastar.`);
    return saldoUsuario;
}

// Función 2: Mostrar productos
function mostrarProductos() {
    console.log("Productos disponibles:");
    for (let i = 0; i < PRODUCTOS.length; i++) {
        console.log(`${i + 1}. ${PRODUCTOS[i]}`);
    }
}

// Función 3: Comprar
function comprar() {
    let opcion = parseInt(prompt("Elige un producto (1 al 3):")) - 1;
    if (opcion >= 0 && opcion < PRODUCTOS.length) {
        let precio = (PRECIOS.length);
        if (saldo >= precio) {
            saldo -= precio;
            alert(`Compra exitosa! Saldo restante: $${saldo}`);
        } else {
            alert("Saldo insuficiente");
        }
    } else {
        alert("Opción inválida");
    }
}

// Llamadas a funciones
saldo = saludarUsuario();
mostrarProductos();
comprar();