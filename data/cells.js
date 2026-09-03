const STORAGE_KEY = "celdas";

export function initializeCells() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      numero: "CEL-006",
      prisionero: null,
      seguridad: "Celda individual",
      sector: "Pabellón central",
    },
    {
      numero: "CEL-002",
      prisionero: "PRI-003",
      seguridad: "Celda compartida",
      sector: "Pabellón central",
    },
    {
      numero: "CEL-004",
      prisionero: null,
      seguridad: "Celda compartida",
      sector: "Patio",
    },
    {
      numero: "CEL-001",
      prisionero: "PRI-001",
      seguridad: "Celda individual",
      sector: "Pabellón interno",
    },
    {
      numero: "CEL-007",
      prisionero: null,
      seguridad: "Dormitorio",
      sector: "Pabellón central",
    },
    {
      numero: "CEL-005",
      prisionero: null,
      seguridad: "Aislamiento",
      sector: "Pabellón interno",
    },
    {
      numero: "CEL-003",
      prisionero: null,
      seguridad: "Dormitorio",
      sector: "Patio",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllCells() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getCellByNumber(numero) {
  const cells = getAllCells();

  return cells.find((cell) => cell.numero === numero);
}

export function updateCell(numero, updatedData) {
  const cells = getAllCells();

  const index = cells.findIndex((cell) => cell.numero === numero);

  if (index === -1) {
    throw new Error(`La celda ${numero} no existe`);
  }

  cells[index] = {
    ...cells[index],
    ...updatedData,
    numero,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cells));

  return cells[index];
}

export function resetCells() {
  localStorage.removeItem(STORAGE_KEY);

  initializeCells();
}
