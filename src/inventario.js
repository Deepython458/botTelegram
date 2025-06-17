const fs = require('fs');
const path = require('path');

const ruta = path.join(__dirname, '../data/data.json');

function cargarDatos() {
    if (fs.existsSync(ruta)) {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } else {
        return { inventario: {}, cash: 0 };
    }
}

function guardarDatos(data) {
    fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
}

function getDatos() {
    return cargarDatos();
}

function agregarInventario(letra, cantidad) {
    const datos = cargarDatos();
    if (!datos.inventario[letra]) return false;
    datos.inventario[letra].cantidad += cantidad;
    guardarDatos(datos);
    return true;
}

function registrarVenta(letra, precio) {
    const datos = cargarDatos();
    if (!datos.inventario[letra] || datos.inventario[letra].cantidad <= 0) return false;
    datos.inventario[letra].cantidad--;
    datos.cash += precio;
    guardarDatos(datos);
    return true;
}

function obtenerInventario() {
    return cargarDatos().inventario;
}

function obtenerCash() {
    const datos = cargarDatos();
    const inversionBase = 130000;
    const ganancia = datos.cash > inversionBase ? datos.cash - inversionBase : 0;
    return { total: datos.cash, ganancia };
}

module.exports = {
    agregarInventario,
    registrarVenta,
    obtenerInventario,
    obtenerCash,
    getDatos
};
