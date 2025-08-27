const fs = require('fs');
const path = require('path');

const ruta = path.join(__dirname, '../data/data.json');

function cargarDatos() {
  if (fs.existsSync(ruta)) {
    const data = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(data);
  } else {
    return { inventario: {}, cash: 0, inversion: 0 };
  }
}

function guardarDatos(data) {
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
}

// 👉 Agregar nueva marca con letra automática
function agregarMarca(nombre) {
  const datos = cargarDatos();
  const letras = Object.keys(datos.inventario);
  let nuevaLetra = 'a';

  if (letras.length > 0) {
    const ultima = letras[letras.length - 1];
    nuevaLetra = String.fromCharCode(ultima.charCodeAt(0) + 1);
  }

  datos.inventario[nuevaLetra] = { marca: nombre, sabores: {} };
  guardarDatos(datos);

  return { letra: nuevaLetra, marca: nombre };
}

// 👉 Agregar nuevo sabor a una marca
function agregarSabor(letraMarca, nombreSabor, cantidad) {
  const datos = cargarDatos();
  if (!datos.inventario[letraMarca]) return null;

  const sabores = datos.inventario[letraMarca].sabores;
  const indices = Object.keys(sabores).map(n => parseInt(n));
  const nuevoIndice = indices.length > 0 ? Math.max(...indices) + 1 : 1;

  sabores[nuevoIndice] = { sabor: nombreSabor, cantidad };
  guardarDatos(datos);

  return { indice: nuevoIndice, sabor: nombreSabor, cantidad };
}

// 👉 Registrar venta
function registrarVenta(letraMarca, numSabor, precio) {
  const datos = cargarDatos();
  const marca = datos.inventario[letraMarca];
  if (!marca || !marca.sabores[numSabor]) return null;

  if (marca.sabores[numSabor].cantidad > 0) {
    marca.sabores[numSabor].cantidad--;
    datos.cash += precio;
    guardarDatos(datos);
    return { sabor: marca.sabores[numSabor].sabor, cantidad: marca.sabores[numSabor].cantidad };
  }
  return null;
}

// 👉 Obtener inventario
function obtenerInventario() {
  return cargarDatos().inventario;
}

// 👉 Obtener cash y ganancia
function obtenerCash() {
  const datos = cargarDatos();
  const inversionBase = datos.inversion || 0;
  const ganancia = datos.cash > inversionBase ? datos.cash - inversionBase : 0;
  return { total: datos.cash, ganancia, inversion: inversionBase };
}

function setInversion(monto) {
  const datos = cargarDatos();
  datos.inversion = monto;
  guardarDatos(datos);
}

module.exports = {
  agregarMarca,
  agregarSabor,
  registrarVenta,
  obtenerInventario,
  obtenerCash,
  setInversion
};
