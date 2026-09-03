const STORAGE_KEY = "prisioneros";

export function initializePrisoners() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      codigo: "PRI-005",
      ciudadano: "1023456789",
      estado: "En juicio",
      fechaCaptura: "2087-06-12",
      cargos: "Distribución de información restringida",
      oficial: "OFI-001",
    },
    {
      codigo: "PRI-002",
      ciudadano: "1023456781",
      estado: "En espera de proceso",
      fechaCaptura: "2087-06-14",
      cargos: "Alteración del orden",
      oficial: "OFI-003",
    },
    {
      codigo: "PRI-006",
      ciudadano: "1023456785",
      estado: "En juicio",
      fechaCaptura: "2087-06-08",
      cargos: "Desobediencia a la autoridad",
      oficial: "OFI-004",
    },
    {
      codigo: "PRI-001",
      ciudadano: "1023456786",
      estado: "Cumpliendo sentencia",
      fechaCaptura: "2087-06-11",
      cargos: "Acceso no autorizado",
      oficial: "OFI-001",
    },
    {
      codigo: "PRI-004",
      ciudadano: "1023456783",
      estado: "En espera de proceso",
      fechaCaptura: "2087-06-15",
      cargos: "Acceso a información restringida",
      oficial: "OFI-002",
    },
    {
      codigo: "PRI-003",
      ciudadano: "1023456782",
      estado: "Cumpliendo sentencia",
      fechaCaptura: "2087-06-09",
      cargos: "Sabotaje de infraestructura",
      oficial: "OFI-002",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllPrisoners() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getPrisonerByCode(codigo) {
  const prisoners = getAllPrisoners();

  return prisoners.find((prisoner) => prisoner.codigo === codigo);
}

export function updatePrisoner(codigo, updatedData) {
  const prisoners = getAllPrisoners();

  const index = prisoners.findIndex((prisoner) => prisoner.codigo === codigo);

  if (index === -1) {
    throw new Error(`El prisionero ${codigo} no existe`);
  }

  prisoners[index] = {
    ...prisoners[index],
    ...updatedData,
    codigo,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prisoners));

  return prisoners[index];
}

export function deletePrisoner(codigo) {
  const prisoners = getAllPrisoners();

  const filtered = prisoners.filter((prisoner) => prisoner.codigo !== codigo);

  if (filtered.length === prisoners.length) {
    throw new Error(`El prisionero ${codigo} no existe`);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  return true;
}

export function resetPrisoners() {
  localStorage.removeItem(STORAGE_KEY);

  initializePrisoners();
}
