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
      estado: "EN JUICIO",
      fechaCaptura: "2087-06-12",
      cargos: "Distribución de información restringida",
      oficial: "OFI-004",
    },
    {
      codigo: "PRI-002",
      ciudadano: "1023456781",
      estado: "EN ESPERA DE PROCESO",
      fechaCaptura: "2087-06-14",
      cargos: "Alteración del orden",
      oficial: "OFI-003",
    },
    {
      codigo: "PRI-006",
      ciudadano: "1023456785",
      estado: "EN JUICIO",
      fechaCaptura: "2087-06-08",
      cargos: "Desobediencia a la autoridad",
      oficial: "OFI-004",
    },
    {
      codigo: "PRI-001",
      ciudadano: "1023456786",
      estado: "CUMPLIENDO SENTENCIA",
      fechaCaptura: "2087-06-11",
      cargos: "Conspiración para cometer delitos",
      oficial: "OFI-001",
    },
    {
      codigo: "PRI-004",
      ciudadano: "1023456783",
      estado: "EN ESPERA DE PROCESO",
      fechaCaptura: "2087-06-15",
      cargos: "Acceso a información restringida",
      oficial: "OFI-003",
    },
    {
      codigo: "PRI-003",
      ciudadano: "1023456782",
      estado: "CUMPLIENDO SENTENCIA",
      fechaCaptura: "2087-06-09",
      cargos: "Sabotaje de infraestructura",
      oficial: "OFI-002",
    },
    {
      codigo: "PRI-007",
      ciudadano: "1023456788",
      estado: "EN ESPERA DE PROCESO",
      fechaCaptura: "2087-06-10",
      cargos: "Interferencia con sistema gubernamental",
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

export function getPrisonersByOfficer(placa) {
  const prisoners = getAllPrisoners();

  return prisoners.filter((prisoner) => prisoner.oficial === placa);
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

  const index = prisoners.findIndex((prisoner) => prisoner.codigo === codigo);

  if (index === -1) {
    throw new Error(`El prisionero ${codigo} no existe`);
  }

  prisoners.splice(index, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prisoners));
}

export function resetPrisoners() {
  localStorage.removeItem(STORAGE_KEY);

  initializePrisoners();
}
