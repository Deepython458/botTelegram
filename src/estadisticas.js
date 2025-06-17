const fs = require('fs');
const path = require('path');

const rutaData = path.join(__dirname, '../data/data.json');
const rutaHistorial = path.join(__dirname, '../data/datos.json');

function reiniciarDatos() {
  let data = { inventario: {}, cash: 0 };
  if (fs.existsSync(rutaData)) {
    const rawData = fs.readFileSync(rutaData, 'utf-8');
    data = JSON.parse(rawData);
  }

  let historial = { tandas: [] };
  if (fs.existsSync(rutaHistorial)) {
    const rawHistorial = fs.readFileSync(rutaHistorial, 'utf-8');
    historial = JSON.parse(rawHistorial);
    if (!Array.isArray(historial.tandas)) {
      historial.tandas = [];
    }
  }

  const numeroTanda = historial.tandas.length + 1;

  historial.tandas.push({
    numero: numeroTanda,
    dinero: data.cash,
    fecha: new Date().toLocaleDateString('es-AR')
  });

  fs.writeFileSync(rutaHistorial, JSON.stringify(historial, null, 2));

  data.cash = 0;
  for (const key in data.inventario) {
    data.inventario[key].cantidad = 0;
  }
  fs.writeFileSync(rutaData, JSON.stringify(data, null, 2));
}

module.exports = { reiniciarDatos };