const axios = require('axios');

async function obtenerDolarBlue() {
  try {
    const res = await axios.get('https://api.bluelytics.com.ar/v2/latest');
    const dolar = res.data.blue;
    return `💵 Dólar Blue:

Compra: $${dolar.value_buy}
Venta: $${dolar.value_sell}`;
  } catch (error) {
    return 'Error al obtener la cotización del dólar.';
  }
}

module.exports = { obtenerDolarBlue };
