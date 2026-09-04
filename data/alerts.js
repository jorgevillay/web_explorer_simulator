const STORAGE_KEY = "alerts";

export function initializeAlerts() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      id: "ALT-001",
      camara: "CAM-006",
      nivel: "ALTO",
      descripcion: "Movimiento no identificado",
      fecha: "2087-06-14 22:18",
    },
    {
      id: "ALT-002",
      camara: "CAM-001",
      nivel: "MEDIO",
      descripcion: "Actividad recurrente detectada",
      fecha: "2087-06-15 16:42",
    },
    {
      id: "ALT-003",
      camara: "CAM-002",
      nivel: "BAJO",
      descripcion: "Objeto abandonado",
      fecha: "2087-06-15 10:27",
    },
    {
      id: "ALT-004",
      camara: "CAM-003",
      nivel: "MEDIO",
      descripcion: "Acceso a zona restringida",
      fecha: "2087-06-15 14:05",
    },
    {
      id: "ALT-005",
      camara: "CAM-005",
      nivel: "ALTO",
      descripcion: "Movimiento detectado",
      fecha: "2087-06-15 19:31",
    },
    {
      id: "ALT-006",
      camara: "CAM-002",
      nivel: "BAJO",
      descripcion: "Presencia no identificada",
      fecha: "2087-06-14 21:36",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllAlerts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getAlertById(id) {
  const alerts = getAllAlerts();

  return alerts.find((alert) => alert.id === id);
}

export function createAlert(alertData) {
  const alerts = getAllAlerts();

  const exists = alerts.some((alert) => alert.id === alertData.id);

  if (exists) {
    throw new Error(`La alerta ${alertData.id} ya existe`);
  }

  alerts.push(alertData);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));

  return alertData;
}

export function updateAlert(id, updatedData) {
  const alerts = getAllAlerts();

  const index = alerts.findIndex((alert) => alert.id === id);

  if (index === -1) {
    throw new Error(`La alerta ${id} no existe`);
  }

  alerts[index] = {
    ...alerts[index],
    ...updatedData,
    id,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));

  return alerts[index];
}

export function resetAlerts() {
  localStorage.removeItem(STORAGE_KEY);

  initializeAlerts();
}
