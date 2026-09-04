const STORAGE_KEY = "transacciones";

export function initializeTransactions() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      id: "TRA-001",
      cuenta: "CTA-001",
      monto: 750000,
      tipo: "CONSIGNACIÓN",
      fecha: "2087-06-14 09:15",
    },
    {
      id: "TRA-002",
      cuenta: "CTA-003",
      monto: 350000,
      tipo: "RETIRO",
      fecha: "2087-06-14 11:42",
    },
    {
      id: "TRA-003",
      cuenta: "CTA-004",
      monto: 500000,
      tipo: "CONSIGNACIÓN",
      fecha: "2087-06-14 14:08",
    },
    {
      id: "TRA-004",
      cuenta: "CTA-005",
      monto: 800000,
      tipo: "RETIRO",
      fecha: "2087-06-14 16:27",
    },
    {
      id: "TRA-005",
      cuenta: "CTA-007",
      monto: 3500000,
      tipo: "RETIRO",
      fecha: "2087-06-15 20:13",
    },
    {
      id: "TRA-006",
      cuenta: "CTA-008",
      monto: 3800000,
      tipo: "RETIRO",
      fecha: "2087-06-15 21:05",
    },
    {
      id: "TRA-007",
      cuenta: "CTA-009",
      monto: 1750000,
      tipo: "CONSIGNACIÓN",
      fecha: "2087-06-15 09:48",
    },
    {
      id: "TRA-008",
      cuenta: "CTA-010",
      monto: 3800000,
      tipo: "CONSIGNACIÓN",
      fecha: "2087-06-15 22:21",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllTransactions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getTransactionById(id) {
  const transactions = getAllTransactions();

  return transactions.find((transaction) => transaction.id === id);
}

export function createTransaction(transactionData) {
  const transactions = getAllTransactions();

  const exists = transactions.some(
    (transaction) => transaction.id === transactionData.id,
  );

  if (exists) {
    throw new Error(`La transacción ${transactionData.id} ya existe`);
  }

  transactions.push(transactionData);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

  return transactionData;
}

export function resetTransactions() {
  localStorage.removeItem(STORAGE_KEY);

  initializeTransactions();
}
