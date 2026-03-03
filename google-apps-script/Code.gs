/**
 * Script para recibir pedidos del formulario de compra AGUAHOMI
 * y guardarlos en esta hoja de cálculo.
 *
 * CÓMO USAR:
 * 1. Abre tu hoja: https://docs.google.com/spreadsheets/d/1v6geNnK7etFe-hxme_zCq4q4nwA1tbE5EfcQG0LuFIk/
 * 2. Menú Extensiones > Apps Script
 * 3. BORRA todo el código anterior y pega ESTE archivo completo. Guarda (Ctrl+S).
 * 4. Implementar > Gestionar implementaciones > Editar (lápiz) la actual > Desplegar.
 * 5. La URL de la app web la tienes en compra.html (GOOGLE_SCRIPT_URL).
 *
 * Si en el navegador ves el HTML en crudo o URLs con errores (noalventura, sgushoml_ck, etc.),
 * es que en Google está desplegada una versión vieja: repite los pasos 3 y 4.
 */

function doPost(e) {
  try {
    if (!e) {
      return respuestaHtmlError('No se recibió la petición. Verifica la URL del script.');
    }
    var datos = {};

    // Aceptar JSON (fetch) o datos de formulario (form POST)
    if (e.postData && e.postData.contents) {
      var type = (e.postData.type || '').toLowerCase();
      if (type.indexOf('json') !== -1) {
        datos = JSON.parse(e.postData.contents);
      } else if (type.indexOf('x-www-form-urlencoded') !== -1 || e.parameter) {
        // Formulario: usar e.parameter o parsear el cuerpo
        if (e.parameter && (e.parameter.nombre || e.parameter.calle)) {
          datos = {
            nombre: e.parameter.nombre || '',
            calle: e.parameter.calle || '',
            colonia: e.parameter.colonia || '',
            codigoPostal: e.parameter.codigoPostal || '',
            ciudad: e.parameter.ciudad || '',
            telefono: e.parameter.telefono || '',
            metodoPago: e.parameter.metodoPago || '',
            productos: e.parameter.productos || '',
            total: e.parameter.total || '',
            redirectSuccess: e.parameter.redirectSuccess || ''
          };
        } else {
          datos = parseFormUrlEncoded(e.postData.contents);
        }
      } else {
        datos = parseFormUrlEncoded(e.postData.contents);
      }
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
        total: e.parameter.total || '',
        redirectSuccess: e.parameter.redirectSuccess || ''
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

    var redirectUrl = datos.redirectSuccess || '';
    return respuestaHtmlOk(redirectUrl);
  } catch (err) {
    return respuestaHtmlError(err.toString());
  }
}

/** Devuelve HTML que avisa a la página de compra que el pedido SÍ se guardó */
function respuestaHtmlOk(redirectUrl) {
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
  if (redirectUrl) {
    var safeUrl = redirectUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    html += '<meta http-equiv="refresh" content="0;url=' + safeUrl + '">';
    html += '<script>try{window.location.href="' + redirectUrl.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/</g, '\\u003c') + '";}catch(e){}</script>';
  }
  html += '</head><body><script>if(window.opener){window.opener.postMessage("aguahomi_ok","*");}if(window.parent!==window){window.parent.postMessage("aguahomi_ok","*");}</script><p>Redirigiendo...</p></body></html>';
  return HtmlService.createHtmlOutput(html);
}

/** Devuelve HTML que avisa a la página de compra que hubo un error */
function respuestaHtmlError(mensaje) {
  var safe = (mensaje || '').toString()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
  html += '<script>if(window.opener){window.opener.postMessage("aguahomi_error","*");}if(window.parent!==window){window.parent.postMessage("aguahomi_error","*");}</script>';
  html += '<p>Error: ' + safe + '</p></body></html>';
  return HtmlService.createHtmlOutput(html);
}

/** Respuesta JSON (para peticiones fetch si se usa en el futuro) */
function respuestaJson(codigo, objeto) {
  var output = ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/** Parsea cuerpo application/x-www-form-urlencoded cuando e.parameter no viene lleno */
function parseFormUrlEncoded(contents) {
  var datos = { nombre: '', calle: '', colonia: '', codigoPostal: '', ciudad: '', telefono: '', metodoPago: '', productos: '', total: '', redirectSuccess: '' };
  if (!contents) return datos;
  var partes = contents.split('&');
  for (var i = 0; i < partes.length; i++) {
    var kv = partes[i].split('=');
    if (kv.length >= 2) {
      var key = decodeURIComponent(kv[0].replace(/\+/g, ' '));
      var val = decodeURIComponent(kv.slice(1).join('=').replace(/\+/g, ' '));
      if (datos.hasOwnProperty(key)) datos[key] = val;
    }
  }
  return datos;
}
