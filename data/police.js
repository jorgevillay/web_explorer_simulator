const STORAGE_KEY = "oficiales";

export function initializeOfficers() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      placa: "OFI-003",
      ciudadano: "1023456785",
      rango: "Capitán",
    },
    {
      placa: "OFI-001",
      ciudadano: "1023456784",
      rango: "Patrullero",
    },
    {
      placa: "OFI-004",
      ciudadano: "1023456788",
      rango: "Teniente",
    },
    {
      placa: "OFI-002",
      ciudadano: "1023456787",
      rango: "Teniente",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllOfficers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getOfficerByBadge(placa) {
  const officers = getAllOfficers();

  return officers.find((officer) => officer.placa === placa);
}

export function deleteOfficer(placa) {
  const officers = getAllOfficers();

  const filtered = officers.filter((officer) => officer.placa !== placa);

  if (filtered.length === officers.length) {
    throw new Error(`El oficial ${placa} no existe`);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  return true;
}

export function resetOfficers() {
  localStorage.removeItem(STORAGE_KEY);

  initializeOfficers();
}
