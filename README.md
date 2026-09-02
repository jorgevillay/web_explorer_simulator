# Web Explorer

Prototipo web para simular consultas a sistemas gubernamentales dentro de la experiencia del juego. La aplicación permite escribir URLs, ejecutar endpoints simulados, consultar o modificar datos persistidos en `localStorage`, consumir batería y registrar el progreso de las misiones.

## Ejecución

El proyecto utiliza módulos ES (`import` / `export`), por lo que debe ejecutarse desde un servidor local y no abriendo directamente `index.html` mediante `file://`.

Opciones sencillas:

```bash
npx serve .
```

## Estructura

```text
web-explorer/
├── index.html
├── styles.css
├── script.js
├── README.md
├── core/
│   ├── endpoints.js
│   └── storage.js
├── data/
│   ├── alerts.js
│   ├── cameras.js
│   └── missions.js
└── utils/
    └── url.js
```

### `index.html`

Contiene la estructura visual principal: estado del sistema, batería, progreso de misiones, formulario de consulta, respuesta y modal de finalización.

### `styles.css`

Define la presentación futurista/militar de la interfaz, incluyendo estados de batería, códigos de respuesta, tabla de resultados, modal e indicador de progreso.

### `script.js`

Es el punto de entrada de la aplicación. Coordina la interfaz con los módulos de datos y lógica: ejecución de consultas, consumo de batería, actualización del progreso, renderizado de respuestas y reinicio de partida.

### `core/storage.js`

Gestiona los valores generales persistidos en `localStorage`:

- Batería.
- Contador de cámaras.
- Contador de alertas.
- Reinicio de esos valores.

### `core/endpoints.js`

Contiene `endpointDefinitions`, el catálogo interno de endpoints admitidos y la respuesta o proceso asociado a cada uno. Aquí se conectan las consultas con las operaciones sobre cámaras y alertas.

### `data/cameras.js`

Gestiona los datos de cámaras en `localStorage`:

- Inicialización.
- Consulta de todas las cámaras.
- Consulta por `codigo`.
- Creación.
- Modificación.
- Eliminación.
- Activación y desactivación.
- Reinicio de datos.

El campo `codigo` funciona como identificador único de cada cámara.

### `data/alerts.js`

Gestiona las alertas almacenadas en `localStorage`, incluyendo creación, consulta, modificación, eliminación y reinicio.

### `data/missions.js`

Define las misiones y sus objetivos (`goals`) y persiste su progreso. Cada objetivo contiene una URL esperada y un indicador `executed`.

### `utils/url.js`

Agrupa las utilidades relacionadas con URLs:

- `validateUrlSyntax`: valida el formato general.
- `parseUrl`: separa dominio, ruta y parámetros.
- `normalizeUrl`: ordena los parámetros para comparar URLs independientemente de su orden.
- `getEndpointDefinition`: obtiene el endpoint correspondiente y verifica parámetros obligatorios.

## Flujo general de una consulta

1. El usuario escribe una URL sin el prefijo `https://`.
2. `script.js` consume batería.
3. Se valida la sintaxis mediante `utils/url.js`.
4. Se obtiene la definición correspondiente desde `core/endpoints.js`.
5. El endpoint consulta o modifica los datos de `data/` cuando corresponde.
6. La interfaz muestra el código, mensaje e información de respuesta.
7. Si la consulta coincide con un objetivo, se actualiza el progreso de las misiones.
8. La partida termina cuando se completan todas las misiones o la batería llega a cero.

## Local Storage

La aplicación utiliza las siguientes claves:

| Clave | Contenido |
| --- | --- |
| `cameras` | Cámaras disponibles. |
| `alerts` | Alertas registradas. |
| `missions` | Estado y progreso de las misiones. |
| `battery` | Batería restante. |
| `camerasCount` | Contador utilizado para generar códigos de cámaras. |
| `alertsCount` | Contador utilizado para generar identificadores de alertas. |

El botón **NUEVA PARTIDA** reinicia los datos utilizados por la partida actual.

## Endpoints actualmente definidos

### Cámaras

- `listar/camaras`
- `agregar/camara?ubicacion=[valor]&tipo=[valor]`
- `activar/camara?codigo=[valor]`
- `desactivar/camara?codigo=[valor]`

### Alertas

- `listar/alertas`
- `crear/alerta?camara=[valor]&nivel=[valor]&descripcion=[valor]`
- `modificar/alerta?id=[valor]&nivel=[valor]`
- `borrar/alerta?id=[valor]`

Todos deben ir precedidos por un dominio `.gov`, por ejemplo:

```text
vigilancia.gov/listar/camaras
```

## Configuración de misiones

Las misiones se encuentran en `data/missions.js`. Una misión tiene la siguiente estructura:

```js
{
  id: 1,
  goals: [
    {
      url: "vigilancia.gov/desactivar/camara?codigo=CAM-006",
      executed: false,
    },
  ],
  completed: false,
}
```

La comparación normaliza el orden de los parámetros, por lo que dos URLs con los mismos parámetros en distinto orden se consideran equivalentes.
