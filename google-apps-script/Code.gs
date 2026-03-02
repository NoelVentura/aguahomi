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
    if (!e || !e.postData || !e.postData.contents) {
      return respuestaJson(400, { success: false, error: 'No se recibieron datos' });
    }

    var datos = JSON.parse(e.postData.contents);
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

    return respuestaJson(200, { success: true, message: 'Pedido registrado' });
  } catch (err) {
    return respuestaJson(500, { success: false, error: err.toString() });
  }
}

/** Respuesta JSON con CORS para que el navegador pueda leerla */
function respuestaJson(codigo, objeto) {
  var output = ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
