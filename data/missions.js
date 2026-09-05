const STORAGE_KEY = "missions";

export function initializeMissions() {
  const savedProgress = localStorage.getItem(STORAGE_KEY);

  if (savedProgress) {
    return JSON.parse(savedProgress || "[]");
  }

  const initialData = [
    {
      id: "VIG-01",
      goals: [
        {
          url: "vigilancia.gov/desactivar/camara?codigo=CAM-007",
          executed: false,
        },
        {
          url: "vigilancia.gov/borrar/alerta?id=ALT-002",
          executed: false,
        },
        {
          url: "vigilancia.gov/desactivar/camara?codigo=CAM-001",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "VIG-02",
      goals: [
        {
          url: "vigilancia.gov/crear/alerta?camara=CAM-003&nivel=ALTO&descripcion=Actividad sospechosa",
          executed: false,
        },
        {
          url: "vigilancia.gov/activar/camara?codigo=CAM-004",
          executed: false,
        },
        {
          url: "vigilancia.gov/crear/alerta?camara=CAM-004&nivel=ALTO&descripcion=Robo en progreso",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "VIG-03",
      goals: [
        {
          url: "vigilancia.gov/modificar/alerta?id=ALT-001&nivel=BAJO",
          executed: false,
        },
        {
          url: "vigilancia.gov/modificar/alerta?id=ALT-005&nivel=BAJO",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "FIN-01",
      goals: [
        {
          url: "finanzas.gov/crear/transaccion?cuenta=CTA-001&monto=2250000&tipo=CONSIGNACIÓN",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "FIN-02",
      goals: [
        {
          url: "finanzas.gov/modificar/multa?id=MUL-001&estado=ANULADA",
          executed: false,
        },
        {
          url: "finanzas.gov/modificar/multa?id=MUL-006&estado=ANULADA",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "FIN-03",
      goals: [
        {
          url: "finanzas.gov/crear/transaccion?cuenta=CTA-004&monto=1200000&tipo=RETIRO",
          executed: false,
        },
        {
          url: "finanzas.gov/crear/transaccion?cuenta=CTA-010&monto=1200000&tipo=CONSIGNACIÓN",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "FIN-04",
      goals: [
        {
          url: "finanzas.gov/crear/transaccion?cuenta=CTA-007&monto=7300000&tipo=RETIRO",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "DEF-01",
      goals: [
        {
          url: "defensa.gov/liberar/celda?numero=CEL-007",
          executed: false,
        },
        {
          url: "defensa.gov/modificar/prisionero?codigo=PRI-001&estado=LIBERADO",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "DEF-02",
      goals: [
        {
          url: "defensa.gov/modificar/prisionero?codigo=PRI-002&estado=CUMPLIENDO SENTENCIA",
          executed: false,
        },
        {
          url: "defensa.gov/asignar/celda?numero=CEL-003&prisionero=PRI-002",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "DEF-03",
      goals: [
        {
          url: "defensa.gov/borrar/oficial?placa=OFI-002",
          executed: false,
        },
      ],
      completed: false,
    },
    {
      id: "DEF-04",
      goals: [
        {
          url: "defensa.gov/borrar/prisionero?codigo=PRI-004",
          executed: false,
        },
      ],
      completed: false,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

export function saveMissionProgress(missions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
}

export function resetMissions() {
  localStorage.removeItem(STORAGE_KEY);

  return initializeMissions();
}
