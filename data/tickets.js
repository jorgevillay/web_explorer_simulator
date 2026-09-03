const STORAGE_KEY = "multas";

export function initializeTickets() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      id: "MUL-001",
      ciudadano: "1023456782",
      descripcion: "Alteración del orden",
      valor: 450000,
      estado: "Pendiente de cobro",
    },
    {
      id: "MUL-002",
      ciudadano: "1023456785",
      descripcion: "Incumplimiento de identificación",
      valor: 320000,
      estado: "Anulada",
    },
    {
      id: "MUL-003",
      ciudadano: "1023456786",
      descripcion: "Acceso a zona restringida",
      valor: 750000,
      estado: "Pendiente de cobro",
    },
    {
      id: "MUL-004",
      ciudadano: "1023456784",
      descripcion: "Estacionamiento no autorizado",
      valor: 180000,
      estado: "Pago realizado",
    },
    {
      id: "MUL-005",
      ciudadano: "1023456782",
      descripcion: "Acceso a zona restringida",
      valor: 900000,
      estado: "Pago realizado",
    },

    {
      id: "MUL-006",
      ciudadano: "1023456782",
      descripcion: "Incumplimiento de toque de queda",
      valor: 600000,
      estado: "Pendiente de cobro",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllTickets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getTicketById(id) {
  const tickets = getAllTickets();

  return tickets.find((ticket) => ticket.id === id);
}

export function getTicketsByCitizen(citizenId) {
  const tickets = getAllTickets();

  return tickets.filter((ticket) => ticket.ciudadano === citizenId);
}

export function updateTicket(id, updatedData) {
  const tickets = getAllTickets();

  const index = tickets.findIndex((ticket) => ticket.id === id);

  if (index === -1) {
    throw new Error(`La multa ${id} no existe`);
  }

  tickets[index] = {
    ...tickets[index],
    ...updatedData,
    id,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));

  return tickets[index];
}

export function resetTickets() {
  localStorage.removeItem(STORAGE_KEY);

  initializeTickets();
}
