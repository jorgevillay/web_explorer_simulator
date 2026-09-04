import { getAllCitizens } from "../data/citizens.js";
import {
  getAllCameras,
  getCameraByCode,
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
  getAllAccounts,
  getAccountByNumber,
  getAccountsByClient,
  updateAccount,
} from "../data/accounts.js";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
} from "../data/transactions.js";
import {
  getAllTickets,
  getTicketById,
  getTicketsByCitizen,
  updateTicket,
} from "../data/tickets.js";
import {
  getAllPrisoners,
  getPrisonerByCode,
  getPrisonersByOfficer,
  updatePrisoner,
  deletePrisoner,
} from "../data/prisoners.js";
import {
  getAllCells,
  getCellByNumber,
  getCellByPrisoner,
  updateCell,
} from "../data/cells.js";
import {
  getAllOfficers,
  getOfficerByBadge,
  deleteOfficer,
} from "../data/police.js";
import {
  alertsCount,
  transactionsCount,
  updateAlertsCount,
  updateTransactionsCount,
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
          "Tipo de cámara": camera.tipo,
          Activa: camera.activa ? "Sí" : "No",
        })),
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
        if (["BAJO", "MEDIO", "ALTO"].includes(nivel)) {
          throw new Error(`El nivel de amenaza ${nivel} no es válido`);
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
        const alert = getAlertById(id);
        if (!alert) {
          throw new Error(`La alerta ${id} no existe`);
        }
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
  "cuentas/cliente": {
    domain: "finanzas.gov",
    requiredParams: ["cedula"],
    response: {
      code: 200,
      message: ({ cedula }) =>
        `Listado de cuentas del cliente ${cedula} enviado correctamente`,
      info: ({ cedula }) =>
        getAccountsByClient(cedula).map((account) => ({
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
  "crear/transaccion": {
    domain: "finanzas.gov",
    requiredParams: ["cuenta", "monto", "tipo"],
    response: {
      code: 200,
      message: () => "Nueva transacción creada correctamente",
      process: ({ cuenta, monto, tipo }) => {
        if (!cuenta || !monto || !tipo) {
          throw new Error(
            "Hace falta información obligatoria para crear la transacción",
          );
        }
        if (tipo !== "CONSIGNACIÓN" && tipo !== "RETIRO") {
          throw new Error(`El tipo de transacción ${tipo} no es válido`);
        }
        if (isNaN(Number(monto)) || Number(monto) <= 0) {
          throw new Error(
            "El monto de la transacción debe ser un número positivo",
          );
        }
        const account = getAccountByNumber(cuenta);
        if (!account) {
          throw new Error(`La cuenta ${cuenta} no existe`);
        }
        if (!account.activa) {
          throw new Error(`La cuenta ${cuenta} está desactivada`);
        }
        if (tipo === "RETIRO" && account.saldo < Number(monto)) {
          throw new Error(
            `No hay suficiente saldo en la cuenta ${cuenta} para realizar el RETIRO`,
          );
        }
        const newTransaction = {
          id: `TRA-${String(transactionsCount + 1).padStart(3, "0")}`,
          cuenta,
          monto: Number(monto),
          tipo,
          fecha: new Date(),
        };
        createTransaction(newTransaction);
        updateTransactionsCount(transactionsCount + 1);
        updateAccount(cuenta, {
          saldo:
            tipo === "CONSIGNACIÓN"
              ? account.saldo + Number(monto)
              : account.saldo - Number(monto),
        });
        return newTransaction.id;
      },
      info: (id) => {
        const transaction = getTransactionById(id);
        const fecha = new Date(transaction.fecha);
        return [
          {
            ID: transaction.id,
            "Número de cuenta": transaction.cuenta,
            Monto: currencyFormatter.format(transaction.monto),
            Tipo: transaction.tipo,
            Fecha: fecha.toLocaleString("es-ES"),
          },
        ];
      },
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
  "multas/ciudadano": {
    domain: "finanzas.gov",
    requiredParams: ["cedula"],
    response: {
      code: 200,
      message: ({ cedula }) =>
        `Listado de multas del ciudadano ${cedula} enviado correctamente`,
      info: ({ cedula }) =>
        getTicketsByCitizen(cedula).map((ticket) => ({
          ID: ticket.id,
          "Cédula del ciudadano": ticket.ciudadano,
          Descripción: ticket.descripcion,
          Valor: currencyFormatter.format(ticket.valor),
          Estado: ticket.estado,
        })),
    },
  },
  "modificar/multa": {
    domain: "finanzas.gov",
    requiredParams: ["id", "estado"],
    response: {
      code: 200,
      message: ({ id }) => `La multa ${id} fue modificada correctamente`,
      process: ({ id, estado }) => {
        if (
          !["ANULADA", "PENDIENTE DE COBRO", "PAGO REALIZADO"].includes(estado)
        ) {
          throw new Error(`El estado ${estado} no es válido`);
        }
        const ticket = getTicketById(id);
        if (!ticket) {
          throw new Error(`La multa ${id} no existe`);
        }
        updateTicket(id, { estado });
      },
    },
  },
  "listar/prisioneros": {
    domain: "defensa.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de prisioneros enviado correctamente",
      info: () =>
        getAllPrisoners().map((prisionero) => {
          const fecha = new Date(prisionero.fechaCaptura);
          return {
            Código: prisionero.codigo,
            Ciudadano: prisionero.ciudadano,
            Estado: prisionero.estado,
            "Fecha de captura": fecha.toLocaleString("es-ES"),
            Cargos: prisionero.cargos,
            "Oficial a cargo": prisionero.oficial,
          };
        }),
    },
  },
  "modificar/prisionero": {
    domain: "defensa.gov",
    requiredParams: ["codigo"],
    optionalParams: ["estado", "oficial"],
    response: {
      code: 200,
      message: ({ codigo }) =>
        `El prisionero ${codigo} fue modificado correctamente`,
      process: ({ codigo, estado, oficial }) => {
        const prisoner = getPrisonerByCode(codigo);
        if (!prisoner) {
          throw new Error(`El prisionero ${codigo} no existe`);
        }
        if (estado) {
          if (
            [
              "EN ESPERA DE PROCESO",
              "EN JUICIO",
              "CUMPLIENDO SENTENCIA",
              "LIBERADO",
            ].includes(estado)
          ) {
            throw new Error(`El estado ${estado} no es válido`);
          }
          if (prisoner.estado === "LIBERADO" && estado !== "LIBERADO") {
            throw new Error(
              `El prisionero ${codigo} ya fue liberado y no puede cambiar de estado`,
            );
          }
          if (prisoner.estado !== "LIBERADO" && estado === "LIBERADO") {
            const cell = getCellByPrisoner(codigo);
            if (cell) {
              throw new Error(
                `El prisionero ${codigo} no puede ser liberado mientras esté asignado a una celda`,
              );
            }
            updatePrisoner(codigo, { estado });
          } else if (estado) {
            updatePrisoner(codigo, { estado });
          }
        }
        if (oficial) {
          const officer = getOfficerByBadge(oficial);
          if (!officer) {
            throw new Error(`El oficial ${oficial} no existe`);
          }
          updatePrisoner(codigo, { oficial });
        }
      },
    },
  },
  "borrar/prisionero": {
    domain: "defensa.gov",
    requiredParams: ["codigo"],
    response: {
      code: 200,
      message: ({ codigo }) =>
        `El prisionero ${codigo} fue eliminado correctamente`,
      process: ({ codigo }) => {
        const prisoner = getPrisonerByCode(codigo);
        if (!prisoner) {
          throw new Error(`El prisionero ${codigo} no existe`);
        }
        const cell = getCellByPrisoner(codigo);
        if (cell) {
          throw new Error(
            `El prisionero ${codigo} no puede ser eliminado mientras esté asignado a una celda`,
          );
        }
        deletePrisoner(codigo);
      },
    },
  },
  "listar/celdas": {
    domain: "defensa.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de celdas enviado correctamente",
      info: () =>
        getAllCells().map((celda) => ({
          Número: celda.numero,
          Prisionero: celda.prisionero || "Vacía",
          "Nivel de seguridad": celda.seguridad,
          Sector: celda.sector,
        })),
    },
  },
  "liberar/celda": {
    domain: "defensa.gov",
    requiredParams: ["numero"],
    response: {
      code: 200,
      message: ({ numero }) => `La celda ${numero} fue liberada correctamente`,
      process: ({ numero }) => {
        const cell = getCellByNumber(numero);
        if (!cell) {
          throw new Error(`La celda ${numero} no existe`);
        }
        if (!cell.prisionero) {
          throw new Error(`La celda ${numero} ya está vacía`);
        }
        updateCell(numero, { prisionero: null });
      },
    },
  },
  "asignar/celda": {
    domain: "defensa.gov",
    requiredParams: ["numero", "prisionero"],
    response: {
      code: 200,
      message: ({ numero, prisionero }) =>
        `La celda ${numero} fue asignada correctamente al prisionero ${prisionero}`,
      process: ({ numero, prisionero }) => {
        const cell = getCellByNumber(numero);
        if (!cell) {
          throw new Error(`La celda ${numero} no existe`);
        }
        const prisoner = getPrisonerByCode(prisionero);
        if (!prisoner) {
          throw new Error(`El prisionero ${prisionero} no existe`);
        }
        if (prisoner.estado !== "CUMPLIENDO SENTENCIA") {
          throw new Error(
            `El prisionero ${prisionero} no puede ser asignado a una celda porque no está cumpliendo sentencia`,
          );
        }
        const currentCell = getCellByPrisoner(prisionero);
        if (currentCell && currentCell.numero !== numero) {
          throw new Error(
            `El prisionero ${prisionero} ya está asignado a la celda ${currentCell.numero}`,
          );
        }
        updateCell(numero, { prisionero: prisionero });
      },
    },
  },
  "listar/oficiales": {
    domain: "defensa.gov",
    requiredParams: [],
    response: {
      code: 200,
      message: () => "Listado de oficiales enviado correctamente",
      info: () =>
        getAllOfficers().map((oficial) => ({
          Placa: oficial.placa,
          Ciudadano: oficial.ciudadano,
          Rango: oficial.rango,
        })),
    },
  },
  "borrar/oficial": {
    domain: "defensa.gov",
    requiredParams: ["placa"],
    response: {
      code: 200,
      message: ({ placa }) => `El oficial ${placa} fue eliminado correctamente`,
      process: ({ placa }) => {
        const officer = getOfficerByBadge(placa);
        if (!officer) {
          throw new Error(`El oficial ${placa} no existe`);
        }
        const prisioners = getPrisonersByOfficer(placa);
        if (prisioners.length > 0) {
          throw new Error(
            `El oficial ${placa} no puede ser eliminado porque tiene prisioneros asignados`,
          );
        }
        deleteOfficer(placa);
      },
    },
  },
};
