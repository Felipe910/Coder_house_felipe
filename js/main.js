// Variables y arrays
const PRODUCTOS = ["Camisa", "Pantalón", "Zapatos"];
// Validar usuario
function saludarUsuario() {
    let nombre = prompt("Ingresa tu nombre:");
    let saldo= prompt("Ingresa tu saldo inicial:");
    alert(`Hola ${nombre}, tienes $${saldo} para gastar.`);
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
        let precio = 300;
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
saludarUsuario();
mostrarProductos();
comprar();