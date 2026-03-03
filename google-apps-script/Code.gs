/**
 * Script para recibir pedidos del formulario de compra AGUAHOMI
 * y guardarlos en esta hoja de cálculo.
 *
 * CÓMO USAR:
 * 1. Abre tu hoja: https://docs.google.com/spreadsheets/d/1v6geNnK7etFe-hxme_zCq4q4nwA1tbE5EfcQG0LuFIk/
 * 2. Menú Extensiones > Apps Script
 * 3. Pega este código, guarda (Ctrl+S)
 * 4. Despliega: Implementar > Nueva implementación > Tipo: Aplicación web
 *    - Al ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 5. Copia la URL de la aplicación web y pégala en compra.html (GOOGLE_SCRIPT_URL)
 */

function doPost(e) {
  try {
    var datos = {};

    // Aceptar JSON (fetch) o datos de formulario (form POST para evitar CORS)
    if (e.postData && e.postData.contents) {
      datos = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      datos = {
        nombre: e.parameter.nombre || '',
        calle: e.parameter.calle || '',
        colonia: e.parameter.colonia || '',
        codigoPostal: e.parameter.codigoPostal || '',
        ciudad: e.parameter.ciudad || '',
        telefono: e.parameter.telefono || '',
        metodoPago: e.parameter.metodoPago || '',
        productos: e.parameter.productos || '',
        total: e.parameter.total || ''
      };
    }

    if (!datos.nombre && !datos.calle) {
      return respuestaHtmlError('No se recibieron datos');
    }

    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Si la hoja está vacía, escribe encabezados en la primera fila
    if (hoja.getLastRow() === 0) {
      hoja.appendRow([
        'Fecha',
        'Nombre',
        'Calle y número',
        'Colonia',
        'Código Postal',
        'Ciudad',
        'Teléfono',
        'Método de pago',
        'Productos',
        'Total'
      ]);
    }

    var fila = [
      new Date(),
      datos.nombre || '',
      datos.calle || '',
      datos.colonia || '',
      datos.codigoPostal || '',
      datos.ciudad || '',
      datos.telefono || '',
      datos.metodoPago || '',
      datos.productos || '',
      datos.total || ''
    ];

    hoja.appendRow(fila);

    // Devolver HTML que notifica al padre (iframe) para confirmar que sí se guardó
    return respuestaHtmlOk();
  } catch (err) {
    return respuestaHtmlError(err.toString());
  }
}

/** Devuelve HTML que avisa a la página de compra que el pedido SÍ se guardó */
function respuestaHtmlOk() {
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
  html += '<script>if(window.parent!==window){window.parent.postMessage("aguahomi_ok","*");}</script>';
  html += '<p>Pedido registrado correctamente.</p></body></html>';
  return ContentService.createTextOutput(html).setMimeType(ContentService.MimeType.HTML);
}

/** Devuelve HTML que avisa a la página de compra que hubo un error */
function respuestaHtmlError(mensaje) {
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
  html += '<script>if(window.parent!==window){window.parent.postMessage("aguahomi_error","*");}</script>';
  html += '<p>Error: ' + mensaje + '</p></body></html>';
  return ContentService.createTextOutput(html).setMimeType(ContentService.MimeType.HTML);
}

/** Respuesta JSON (para peticiones fetch si se usa en el futuro) */
function respuestaJson(codigo, objeto) {
  var output = ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
