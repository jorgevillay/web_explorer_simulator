import { getAllCitizens } from "../data/citizens.js";
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
import { getAllAccounts } from "../data/accounts.js";
import { getAllTransactions } from "../data/transactions.js";
import { getAllTickets } from "../data/tickets.js";
import {
  camerasCount,
  alertsCount,
  updateCamerasCount,
  updateAlertsCount,
} from "./storage.js";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

export const endpointDefinitions = {
  "listar/ciudadanos": {
    domain: "registro.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de ciudadanos enviado correctamente",
      info: () =>
        getAllCitizens().map((citizen) => {
          const fecha = new Date(citizen.fechaNacimiento);
          return {
            Cédula: citizen.cedula,
            Nombre: citizen.nombre,
            "Fecha de nacimiento": fecha.toLocaleString("es-ES"),
            Sexo: citizen.sexo,
            "Estado civil": citizen.estadoCivil,
            Ubicación: citizen.ubicacion,
          };
        }),
    },
  },
  "listar/camaras": {
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
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
    domain: "vigilancia.gov",
    requiredParams: ["id"],
    response: {
      code: 200,
      message: ({ id }) => `La alerta ${id} fue eliminada correctamente`,
      process: ({ id }) => {
        deleteAlert(id);
      },
    },
  },
  "listar/cuentas": {
    domain: "finanzas.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de cuentas enviado correctamente",
      info: () =>
        getAllAccounts().map((account) => ({
          "Número de cuenta": account.numero,
          "Cédula del cliente": account.cliente,
          Saldo: currencyFormatter.format(account.saldo),
          Activa: account.activa ? "Sí" : "No",
        })),
    },
  },
  "listar/transacciones": {
    domain: "finanzas.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de transacciones enviado correctamente",
      info: () =>
        getAllTransactions().map((transaction) => {
          const fecha = new Date(transaction.fecha);
          return {
            ID: transaction.id,
            "Número de cuenta": transaction.cuenta,
            Monto: currencyFormatter.format(transaction.monto),
            Tipo: transaction.tipo,
            Fecha: fecha.toLocaleString("es-ES"),
          };
        }),
    },
  },
  "listar/multas": {
    domain: "finanzas.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de multas enviado correctamente",
      info: () =>
        getAllTickets().map((ticket) => ({
          ID: ticket.id,
          "Cédula del ciudadano": ticket.ciudadano,
          Descripción: ticket.descripcion,
          Valor: currencyFormatter.format(ticket.valor),
          Estado: ticket.estado,
        })),
    },
  },
};
