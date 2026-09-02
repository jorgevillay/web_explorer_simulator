const STORAGE_KEY = "missions";

export function initializeMissions() {
  const savedProgress = localStorage.getItem(STORAGE_KEY);

  if (savedProgress) {
    return JSON.parse(savedProgress || "[]");
  }

  const initialData = [
    {
      id: 1,
      goals: [
        {
          url: "vigilancia.gov/desactivar/camara?codigo=CAM-006",
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
      id: 2,
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
      id: 3,
      goals: [
        {
          url: "vigilancia.gov/modificar/alerta?id=ALT-001&nivel=BAJO",
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
