import {
  getAllCameras,
  getCameraByCode,
  createCamera,
  enableCamera,
  disableCamera,
} from "../data/cameras.js";
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
} from "../data/alerts.js";
import {
  camerasCount,
  alertsCount,
  updateCamerasCount,
  updateAlertsCount,
} from "./storage.js";

export const endpointDefinitions = {
  "listar/camaras": {
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de cámaras enviado correctamente",
      info: () =>
        getAllCameras().map((camera) => ({
          Código: camera.codigo,
          Ubicación: camera.ubicacion,
          Tipo: camera.tipo,
          Activa: camera.activa ? "Sí" : "No",
        })),
    },
  },
  "agregar/camara": {
    requiredParams: ["ubicacion", "tipo"],
    response: {
      code: 200,
      message: () => "Nueva cámara registrada correctamente",
      process: ({ ubicacion, tipo }) => {
        const newCamera = {
          codigo: `CAM-${String(camerasCount + 1).padStart(3, "0")}`,
          ubicacion,
          tipo,
          activa: true,
        };
        createCamera(newCamera);
        updateCamerasCount(camerasCount + 1);
        return newCamera.codigo;
      },
      info: (codigo) => {
        const camera = getCameraByCode(codigo);
        return [
          {
            Código: camera.codigo,
            Ubicación: camera.ubicacion,
            Tipo: camera.tipo,
            Activa: camera.activa ? "Sí" : "No",
          },
        ];
      },
    },
  },
  "activar/camara": {
    requiredParams: ["codigo"],
    response: {
      code: 200,
      message: ({ codigo }) => `La cámara ${codigo} fue activada correctamente`,
      process: ({ codigo }) => {
        const camera = getCameraByCode(codigo);
        if (!camera) {
          throw new Error(`La cámara ${codigo} no existe`);
        }
        if (camera.activa) {
          throw new Error(`La cámara ${codigo} ya está activada`);
        }
        enableCamera(codigo);
      },
    },
  },
  "desactivar/camara": {
    requiredParams: ["codigo"],
    response: {
      code: 200,
      message: ({ codigo }) =>
        `La cámara ${codigo} fue desactivada correctamente`,
      process: ({ codigo }) => {
        const camera = getCameraByCode(codigo);
        if (!camera) {
          throw new Error(`La cámara ${codigo} no existe`);
        }
        if (!camera.activa) {
          throw new Error(`La cámara ${codigo} ya está desactivada`);
        }
        const alerts = getAllAlerts();
        const hasAlerts = alerts.some((alert) => alert.camara === codigo);
        if (hasAlerts) {
          throw new Error(
            "No es posible desactivar la cámara porque tiene alertas asociadas",
          );
        }
        disableCamera(codigo);
      },
    },
  },
  "listar/alertas": {
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de alertas enviado correctamente",
      info: () =>
        getAllAlerts().map((alert) => {
          const fecha = new Date(alert.fecha);
          return {
            ID: alert.id,
            Cámara: alert.camara,
            "Nivel de amenaza": alert.nivel,
            "Descripción del evento": alert.descripcion,
            Fecha: fecha.toLocaleString("es-ES"),
          };
        }),
    },
  },
  "crear/alerta": {
    requiredParams: ["camara", "nivel", "descripcion"],
    response: {
      code: 200,
      message: () => "Nueva alerta creada correctamente",
      process: ({ camara, nivel, descripcion }) => {
        const camera = getCameraByCode(camara);
        if (!camera) {
          throw new Error(`La cámara ${camara} no existe`);
        }
        if (!camera.activa) {
          throw new Error(`La cámara ${camara} está desactivada`);
        }
        const newAlert = {
          id: `ALT-${String(alertsCount + 1).padStart(3, "0")}`,
          camara,
          nivel,
          descripcion,
          fecha: new Date(),
        };
        createAlert(newAlert);
        updateAlertsCount(alertsCount + 1);
        return newAlert.id;
      },
      info: (id) => {
        const alert = getAlertById(id);
        const fecha = new Date(alert.fecha);
        return [
          {
            ID: alert.id,
            Cámara: alert.camara,
            "Nivel de amenaza": alert.nivel,
            "Descripción del evento": alert.descripcion,
            Fecha: fecha.toLocaleString("es-ES"),
          },
        ];
      },
    },
  },
  "modificar/alerta": {
    requiredParams: ["id", "nivel"],
    response: {
      code: 200,
      message: ({ id }) => `La alerta ${id} fue modificada correctamente`,
      process: ({ id, nivel }) => {
        const alert = getAlertById(id);
        if (!alert) {
          throw new Error(`La alerta ${id} no existe`);
        }
        updateAlert(id, { nivel });
      },
    },
  },
  "borrar/alerta": {
    requiredParams: ["id"],
    response: {
      code: 200,
      message: ({ id }) => `La alerta ${id} fue eliminada correctamente`,
      process: ({ id }) => {
        deleteAlert(id);
      },
    },
  },
};
