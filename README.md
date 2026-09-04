# Web Explorer Simulator

Prototipo web para simular consultas a diferentes sistemas
gubernamentales dentro de la experiencia del juego. La aplicación
permite construir y ejecutar URLs, consultar o modificar datos
persistidos en `localStorage`, consumir batería y registrar el progreso
de las misiones.

Actualmente el simulador integra tres sistemas principales:

-   **Registro** (`registro.gov`): información de ciudadanos.
-   **Vigilancia** (`vigilancia.gov`): cámaras y alertas.
-   **Finanzas** (`finanzas.gov`): cuentas, transacciones y multas.
-   **Defensa** (`defensa.gov`): prisioneros, celdas y oficiales.

La partida está compuesta por **11 misiones**.

## Ejecución

El proyecto utiliza módulos ES mediante `import` y `export`. Por esta
razón debe ejecutarse desde un servidor local y no abriendo directamente
`index.html` con `file://`.

Una opción sencilla, teniendo Node.js instalado, es ejecutar desde la
raíz del proyecto:

``` bash
npx serve .
```

Luego se debe abrir en el navegador la dirección local indicada por el
servidor.

También puede utilizarse una extensión de servidor local como **Live
Server** en Visual Studio Code.

## Estructura del proyecto

``` text
web_explorer_simulator/
├── index.html
├── styles.css
├── script.js
├── favicon.ico
├── README.md
├── core/
│   ├── endpoints.js
│   └── storage.js
├── data/
│   ├── accounts.js
│   ├── alerts.js
│   ├── cameras.js
│   ├── cells.js
│   ├── citizens.js
│   ├── missions.js
│   ├── police.js
│   ├── prisoners.js
│   ├── tickets.js
│   └── transactions.js
└── utils/
    └── url.js
```

### `index.html`

Contiene la estructura visual principal:

-   Estado del sistema y batería.
-   Indicador global de progreso.
-   Campo para ingresar la URL.
-   Botón para ejecutar consultas.
-   Código y mensaje de respuesta.
-   Tabla de información recuperada.
-   Modal de finalización de partida.

El archivo carga `script.js` mediante `type="module"`.

### `styles.css`

Define la apariencia futurista/gubernamental de la herramienta,
incluyendo:

-   Panel principal.
-   Estados visuales de batería.
-   Indicadores de progreso.
-   Códigos de respuesta.
-   Tablas de resultados.
-   Modal de finalización.
-   Diseño adaptable.

### `script.js`

Es el punto de entrada de la aplicación y coordina la interfaz con los
módulos de datos y lógica.

Sus responsabilidades principales son:

-   Inicializar los datos de la partida.
-   Ejecutar las consultas ingresadas.
-   Consumir y actualizar la batería.
-   Mostrar las respuestas.
-   Actualizar los objetivos y misiones completadas.
-   Actualizar el indicador global de progreso.
-   Detectar victoria o batería agotada.
-   Reiniciar la partida.

Actualmente cada consulta consume **1% de batería**.

### `core/storage.js`

Gestiona valores generales persistidos en `localStorage`, incluyendo:

-   Batería.
-   Contador de alertas.
-   Contador de transacciones.
-   Reinicio de los valores generales de la partida.

### `core/endpoints.js`

Contiene `endpointDefinitions`, el catálogo interno de endpoints que
reconoce el simulador.

Cada definición puede indicar:

-   Dominio esperado.
-   Parámetros requeridos.
-   Parámetros opcionales, cuando corresponda.
-   Código de respuesta.
-   Mensaje.
-   Proceso que modifica los datos.
-   Información que debe mostrarse como resultado.

Este archivo conecta las URLs ingresadas con las operaciones definidas
en los módulos de `data/`.

### `utils/url.js`

Contiene las utilidades relacionadas con las URLs:

-   `validateUrlSyntax`: valida la estructura general.
-   `parseUrl`: separa dominio, ruta y parámetros.
-   `normalizeUrl`: ordena los parámetros para poder comparar URLs
    independientemente de su orden.
-   `getEndpointDefinition`: identifica el endpoint y valida su dominio
    y parámetros requeridos.

## Datos

Todos los módulos dentro de `data/` utilizan `localStorage` para
mantener el estado de la partida.

### `data/citizens.js`

Gestiona los ciudadanos utilizados por los diferentes sistemas.

La cédula funciona como identificador de cada ciudadano.

### `data/cameras.js`

Gestiona las cámaras del sistema de vigilancia.

El campo `codigo` identifica cada cámara.

Incluye operaciones para consultar, activar, desactivar y reiniciar los
datos.

### `data/alerts.js`

Gestiona las alertas asociadas a las cámaras.

Permite consultar, crear, modificar y eliminar alertas.

### `data/accounts.js`

Gestiona las cuentas financieras.

Permite consultar cuentas, buscar cuentas asociadas a un ciudadano y
modificar sus datos.

### `data/transactions.js`

Gestiona las transacciones financieras y permite crear nuevos
movimientos.

### `data/tickets.js`

Gestiona las multas asociadas a ciudadanos.

Permite consultar multas, consultar por ciudadano y modificar sus datos.

### `data/prisoners.js`

Gestiona los prisioneros del sistema de defensa.

Permite consultar, modificar y eliminar registros.

### `data/cells.js`

Gestiona las celdas y su relación con los prisioneros.

Permite consultar y modificar asignaciones.

### `data/police.js`

Gestiona los oficiales.

Permite consultar oficiales y eliminar registros.

### `data/missions.js`

Define y persiste las **11 misiones** de la partida.

Cada misión tiene uno o más objetivos (`goals`). Un objetivo almacena:

``` js
{
  url: "vigilancia.gov/desactivar/camara?codigo=CAM-007",
  executed: false
}
```

Cuando una consulta exitosa coincide con la URL del objetivo, `executed`
cambia a `true`.

Una misión se considera completada cuando todos sus objetivos han sido
ejecutados.

## Flujo de una consulta

El flujo general es:

1.  El usuario escribe una URL sin incluir `https://`.
2.  Se consume batería.
3.  Se valida la sintaxis general de la URL.
4.  Se separan dominio, ruta y parámetros.
5.  Se busca la ruta en `endpointDefinitions`.
6.  Se valida que el dominio y los parámetros correspondan al endpoint.
7.  Se ejecuta el proceso asociado al endpoint, cuando existe.
8.  Se muestra el código, mensaje y/o tabla de respuesta.
9.  Si la consulta fue exitosa, se compara con los objetivos de las
    misiones.
10. Se guarda el progreso en `localStorage`.
11. Se actualiza visualmente el indicador de misiones.
12. Si todas las misiones están completas, termina la partida.
13. Si la batería llega a `0%` antes de completar todas las misiones, la
    partida termina por batería agotada.

## Validación de URLs

Las consultas se escriben sin protocolo:

``` text
vigilancia.gov/listar/camaras
```

Una consulta con parámetros utiliza `?` y `&`:

``` text
vigilancia.gov/crear/alerta?camara=CAM-003&nivel=ALTO&descripcion=Actividad sospechosa
```

Los parámetros se normalizan antes de comparar una consulta con un
objetivo de misión. Por esta razón, el orden de los parámetros no afecta
la comparación.

## Endpoints disponibles

### Registro --- `registro.gov`

``` text
listar/ciudadanos
```

### Vigilancia --- `vigilancia.gov`

``` text
listar/camaras
activar/camara?codigo=[valor]
desactivar/camara?codigo=[valor]

listar/alertas
crear/alerta?camara=[valor]&nivel=[valor]&descripcion=[valor]
modificar/alerta?id=[valor]&nivel=[valor]
borrar/alerta?id=[valor]
```

### Finanzas --- `finanzas.gov`

``` text
listar/cuentas
cuentas/cliente?cedula=[valor]

listar/transacciones
crear/transaccion?cuenta=[valor]&monto=[valor]&tipo=[valor]

listar/multas
multas/ciudadano?cedula=[valor]
modificar/multa?id=[valor]&estado=[valor]
```

### Defensa --- `defensa.gov`

``` text
listar/prisioneros
modificar/prisionero?codigo=[valor]&estado=[valor]
borrar/prisionero?codigo=[valor]

listar/celdas
liberar/celda?numero=[valor]
asignar/celda?numero=[valor]&prisionero=[valor]

listar/oficiales
borrar/oficial?placa=[valor]
```

> Los parámetros mostrados representan la estructura general. Las reglas
> adicionales y restricciones de cada operación se encuentran en
> `core/endpoints.js`.

## Respuestas HTTP simuladas

La interfaz utiliza los siguientes códigos principales:

  -----------------------------------------------------------------------
  Código                              Uso
  ----------------------------------- -----------------------------------
  `200`                               Consulta ejecutada correctamente.

  `400`                               La URL, dominio o parámetros no
                                      cumplen las condiciones esperadas.

  `404`                               No existe un endpoint para la
                                      dirección consultada.

  `500`                               La operación no puede completarse
                                      por una condición de los datos o
                                      una restricción del sistema.
  -----------------------------------------------------------------------

Los errores generados durante los procesos de un endpoint se presentan
como respuestas `500`.

## Progreso de misiones

El progreso global se muestra en la interfaz mediante:

-   Número de misiones completadas.
-   Total de misiones.
-   Porcentaje de progreso.
-   Indicador individual para cada misión.
-   Barra de progreso.

El estado se guarda en `localStorage`, por lo que permanece disponible
al recargar la página hasta iniciar una nueva partida.

## Local Storage

La aplicación utiliza actualmente las siguientes claves:

  -----------------------------------------------------------------------
  Clave                               Contenido
  ----------------------------------- -----------------------------------
  `ciudadanos`                        Ciudadanos registrados.

  `cameras`                           Cámaras del sistema de vigilancia.

  `alerts`                            Alertas registradas.

  `cuentas`                           Cuentas financieras.

  `transacciones`                     Transacciones financieras.

  `multas`                            Multas de ciudadanos.

  `prisioneros`                       Prisioneros.

  `celdas`                            Celdas y asignaciones.

  `oficiales`                         Oficiales.

  `missions`                          Estado de objetivos y misiones.

  `battery`                           Batería restante.

  `alertsCount`                       Contador para generar nuevos IDs de
                                      alertas.

  `transactionsCount`                 Contador para generar nuevos IDs de
                                      transacciones.
  -----------------------------------------------------------------------

## Reinicio de partida

El botón **NUEVA PARTIDA** restablece:

-   Datos iniciales de las entidades.
-   Batería.
-   Contadores.
-   Progreso de las misiones.
-   Estado visual de la interfaz.

Después del reinicio se puede comenzar una nueva partida desde el estado
inicial.

## Configuración de nuevas misiones

Las misiones se configuran en `data/missions.js`.

Ejemplo:

``` js
{
  id: 12,
  goals: [
    {
      url: "defensa.gov/liberar/celda?numero=CEL-001",
      executed: false
    },
    {
      url: "defensa.gov/modificar/prisionero?codigo=PRI-001&estado=LIBERADO",
      executed: false
    }
  ],
  completed: false
}
```

Para agregar una misión es necesario incorporarla al arreglo inicial y
asegurarse de que las URLs utilizadas correspondan a endpoints definidos
en `core/endpoints.js`.

## Agregar o modificar endpoints

Los endpoints se definen en `core/endpoints.js`.

La estructura general es:

``` js
"ruta/endpoint": {
  domain: "sistema.gov",
  requiredParams: ["parametro"],
  response: {
    code: 200,
    message: ({ parametro }) => "Mensaje de respuesta",
    process: ({ parametro }) => {
      // Operación sobre los datos.
    },
    info: () => {
      // Información opcional para la tabla.
    }
  }
}
```

`process` e `info` son opcionales dependiendo del comportamiento
requerido.

## Persistencia y pruebas

Debido al uso de `localStorage`, los cambios realizados durante una
partida permanecen en el navegador aunque se recargue la página.

Para regresar al estado inicial debe utilizarse **NUEVA PARTIDA** o
eliminar manualmente los datos del sitio desde las herramientas del
navegador.
