const STORAGE_KEY = "cuentas";

export function initializeAccounts() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      numero: "CTA-001",
      cliente: "1023456781",
      saldo: 5750000,
      activa: true,
    },
    {
      numero: "CTA-002",
      cliente: "1023456781",
      saldo: 2100000,
      activa: false,
    },
    {
      numero: "CTA-003",
      cliente: "1023456782",
      saldo: 3400000,
      activa: true,
    },
    {
      numero: "CTA-004",
      cliente: "1023456783",
      saldo: 4800000,
      activa: true,
    },
    {
      numero: "CTA-005",
      cliente: "1023456784",
      saldo: 2150000,
      activa: true,
    },
    {
      numero: "CTA-006",
      cliente: "1023456786",
      saldo: 1850000,
      activa: true,
    },
    {
      numero: "CTA-007",
      cliente: "1023456784",
      saldo: 7300000,
      activa: true,
    },
    {
      numero: "CTA-008",
      cliente: "1023456785",
      saldo: 5650000,
      activa: true,
    },
    {
      numero: "CTA-009",
      cliente: "1023456787",
      saldo: 9200000,
      activa: true,
    },
    {
      numero: "CTA-010",
      cliente: "1023456786",
      saldo: 900000,
      activa: false,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllAccounts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getAccountByNumber(numero) {
  const accounts = getAllAccounts();

  return accounts.find((account) => account.numero === numero);
}

export function getAccountsByClient(clientId) {
  const accounts = getAllAccounts();

  return accounts.filter((account) => account.cliente === clientId);
}

export function updateAccount(numero, updatedData) {
  const accounts = getAllAccounts();

  const index = accounts.findIndex((account) => account.numero === numero);

  if (index === -1) {
    throw new Error(`La cuenta ${numero} no existe`);
  }

  accounts[index] = {
    ...accounts[index],
    ...updatedData,
    numero,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));

  return accounts[index];
}

export function enableAccount(numero) {
  updateAccount(numero, { activa: true });
}

export function disableAccount(numero) {
  updateAccount(numero, { activa: false });
}

export function resetAccounts() {
  localStorage.removeItem(STORAGE_KEY);

  initializeAccounts();
}
