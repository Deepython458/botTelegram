const { agregarInventario, registrarVenta, obtenerInventario, obtenerCash } = require('./inventario');
const { obtenerDolarBlue } = require('./dolar');
const { reiniciarDatos } = require('./estadisticas');

function mostrarOpciones() {
  return `𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒:

/opciones - Mostrar comandos 💬
/inventario - Ver inventario 👁️
/agregar - Agregar inventario ✅ (indicando letra y cantidad)
/venta - Registrar venta ❎ (indicando letra y precio)
/cash - Ver plata obtenida 💰
/reiniciar - Guardar tanda y reiniciar(Cuidado!) 🔄
/dolar - Ver dólar blue 💵`;
}

async function manejarMensaje(chatId, mensaje, estados) {
  mensaje = mensaje.toLowerCase().trim();

  if (!estados[chatId]) estados[chatId] = { paso: null };

  if (estados[chatId].paso === 'agregar') {
    const [letra, cantidadStr] = mensaje.split(' ');
    const cantidad = parseInt(cantidadStr, 10);

    if (!letra || isNaN(cantidad)) {
      estados[chatId].paso = null;
      return '❌ Formato incorrecto. Volvé a empezar escribiendo /agregar o /opciones para ver comandos.';
    }

    if (agregarInventario(letra, cantidad)) {
      estados[chatId].paso = null;
      return `✅ Se agregaron ${cantidad} unidades de ${obtenerInventario()[letra].sabor}. Total: ${obtenerInventario()[letra].cantidad}`;
    } else {
      estados[chatId].paso = null;
      return '❌ Sabor inválido. Volvé a empezar escribiendo /agregar o /opciones para ver comandos.';
    }
  }

  if (estados[chatId].paso === 'venta') {
    const [letra, precioStr] = mensaje.split(' ');
    const precio = parseFloat(precioStr);

    if (!letra || isNaN(precio)) {
      estados[chatId].paso = null;
      return '❌ Formato incorrecto. Volvé a empezar escribiendo /venta o /opciones para ver comandos.';
    }

    if (registrarVenta(letra, precio)) {
      estados[chatId].paso = null;
      return `✅ Venta registrada: 1 unidad de ${obtenerInventario()[letra].sabor} a $${precio}. Inventario restante: ${obtenerInventario()[letra].cantidad}`;
    } else {
      estados[chatId].paso = null;
      return '❌ No hay unidades disponibles o sabor inválido. Volvé a empezar escribiendo /venta o /opciones para ver comandos.';
    }
  }

  if (mensaje === '/opciones') return mostrarOpciones();

  if (mensaje === '/inventario') {
    const inv = obtenerInventario();
    let texto = 'ɪɴᴠᴇɴᴛᴀʀɪᴏ :\n';
    for (const letra in inv) {
      texto += `${letra} - ${inv[letra].sabor}: ${inv[letra].cantidad}\n`;
    }
    return texto;
  }

  if (mensaje === '/agregar') {
    estados[chatId].paso = 'agregar';
    return 'Escribí la letra y la cantidad que querés agregar, ej: a 5';
  }

  if (mensaje === '/venta') {
    estados[chatId].paso = 'venta';
    return 'Escribí la letra del sabor y el precio, ej: b 150';
  }

  if (mensaje === '/cash') {
    const { total, ganancia } = obtenerCash();
    let respuesta = `💵 Plata recaudada: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n`;
    if (ganancia > 0) {
      respuesta += `🎉 Ganancia: $${ganancia.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    } else {
      respuesta += `📉 Aún no hay ganancia.`;
    }
    return respuesta;
  }

  if (mensaje === '/dolar') return await obtenerDolarBlue();

  if (mensaje === '/reiniciar') {
    reiniciarDatos();
    return '🔄 Se reinició la ganancia y las ventas. La tanda fue guardada correctamente.';
  }

  return 'No entendí. Escribí /opciones para ver los comandos genio.';
}

module.exports = { manejarMensaje };