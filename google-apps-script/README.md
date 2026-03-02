# Cómo conectar el formulario de compra con Google Sheets

## 1. Abre tu hoja de cálculo

https://docs.google.com/spreadsheets/d/1v6geNnK7etFe-hxme_zCq4q4nwA1tbE5EfcQG0LuFIk/edit

## 2. Abre Apps Script

- Menú **Extensiones** → **Apps Script**
- Se abrirá el editor con un proyecto nuevo (o uno existente vinculado a esta hoja)

## 3. Pega el código

- Borra el contenido que haya en `Code.gs`
- Copia todo el contenido del archivo **Code.gs** de esta carpeta y pégalo
- Guarda el proyecto (Ctrl+S o el icono de disco)

## 4. Despliega como aplicación web

- Arriba: **Implementar** → **Nueva implementación**
- Tipo: **Aplicación web**
- Configuración:
  - **Descripción:** "Recibir pedidos compra" (o la que quieras)
  - **Al ejecutar como:** Yo (tu cuenta)
  - **Quién tiene acceso:** Cualquier persona
- **Implementar**
- **Autorizar acceso** si te lo pide (inicia sesión con la cuenta del sheet)
- Copia la **URL de la aplicación web** (termina en `/exec`)

## 5. Pega la URL en compra.html

En el archivo **compra.html** del proyecto, busca la línea:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/...';
```

Sustituye esa URL por la que copiaste en el paso anterior. Guarda y vuelve a desplegar tu sitio en Vercel si es necesario.

## 6. Probar

Llena el formulario en https://aguahomi-zws7.vercel.app/compra.html (con productos en el carrito), envía y revisa que aparezca una nueva fila en la hoja.
