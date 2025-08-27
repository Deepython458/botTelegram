const {
  agregarMarca,
  agregarSabor,
  registrarVenta,
  obtenerInventario,
  obtenerCash,
  setInversion
} = require('./inventario');
const { obtenerDolarBlue } = require('./dolar');
const { reiniciarDatos } = require('./estadisticas');

function mostrarOpciones() {
  return `𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒:

/opciones - Mostrar comandos 💬
/inventario - Ver inventario 👁️
/agregarmarca <nombre> - Crear nueva marca 🏷️
/agregarsabor <letraMarca> <nombreSabor> <cantidad> - Agregar sabor a marca 🧃
/venta <letraMarca> <numSabor> <precio> - Registrar venta ❎
/cash - Ver plata obtenida 💰
/reiniciar - Guardar tanda y reiniciar(Cuidado!) 🔄
/dolar - Ver dólar blue 💵
/inversion <monto> - Definir Inversión 💸`;
}

async function manejarMensaje(chatId, mensaje, estados) {
  const partes = mensaje.trim().split(' ');
  const comando = partes[0].toLowerCase();

  if (comando === '/opciones') return mostrarOpciones();

  if (comando === '/inventario') {
    const inv = obtenerInventario();
    let texto = '📦 ɪɴᴠᴇɴᴛᴀʀɪᴏ:\n';
    for (const letra in inv) {
      texto += `\n🔹 ${letra.toUpperCase()} - ${inv[letra].marca}:\n`;
      for (const num in inv[letra].sabores) {
        texto += `   ${num} - ${inv[letra].sabores[num].sabor}: ${inv[letra].sabores[num].cantidad}\n`;
      }
    }
    return texto;
  }

  if (comando === '/agregarmarca') {
    if (partes.length < 2) return '❌ Usá: /agregarmarca <nombre>';
    const nombre = partes.slice(1).join(' ');
    const { letra, marca } = agregarMarca(nombre);
    return `✅ Marca agregada: ${marca} (letra asignada: ${letra})`;
  }

  if (comando === '/agregarsabor') {
    if (partes.length < 4) return '❌ Usá: /agregarsabor <letraMarca> <nombreSabor> <cantidad>';
    const letraMarca = partes[1];
    const cantidad = parseInt(partes.pop(), 10);
    const nombreSabor = partes.slice(2, -1).join(' ');

    if (isNaN(cantidad)) return '❌ Cantidad inválida.';

    const nuevo = agregarSabor(letraMarca, nombreSabor, cantidad);
    if (!nuevo) return '❌ Marca inválida.';

    return `✅ Sabor agregado a ${letraMarca}: ${nuevo.sabor} (ID: ${nuevo.indice}, Cantidad: ${nuevo.cantidad})`;
  }

  if (comando === '/venta') {
    if (partes.length !== 4) return '❌ Usá: /venta <letraMarca> <numSabor> <precio>';
    const [_, letraMarca, numSabor, precioStr] = partes;
    const precio = parseFloat(precioStr);

    if (isNaN(precio)) return '❌ Precio inválido.';

    const venta = registrarVenta(letraMarca, numSabor, precio);
    if (!venta) return '❌ Marca o sabor inválido, o sin stock.';

    return `✅ Venta registrada: 1 unidad de ${venta.sabor} a $${precio}. Restan: ${venta.cantidad}`;
  }

  if (comando === '/cash') {
    const { total, ganancia } = obtenerCash();
    return `💵 Recaudado: $${total.toLocaleString('es-AR')}\n🎉 Ganancia: $${ganancia.toLocaleString('es-AR')}`;
  }

  if (comando === '/dolar') return await obtenerDolarBlue();

  if (comando === '/reiniciar') {
    reiniciarDatos();
    return '🔄 Se reinició la ganancia y las ventas.';
  }

  if (comando === '/inversion') {
    if (partes.length !== 2) return '❌ Usá: /inversion <monto>';
    const monto = parseFloat(partes[1]);
    if (isNaN(monto) || monto <= 0) return '❌ Monto inválido.';
    setInversion(monto);
    return `✅ Inversión actualizada a $${monto}`;
  }

  return 'No entendí. Escribí /opciones para ver los comandos.';
}

module.exports = { manejarMensaje };

