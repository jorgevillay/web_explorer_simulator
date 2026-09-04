const STORAGE_KEY = "cameras";

export function initializeCameras() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      codigo: "CAM-001",
      ubicacion: "Zona norte",
      tipo: "Visión nocturna",
      activa: true,
    },
    {
      codigo: "CAM-002",
      ubicacion: "Zona centro",
      tipo: "360 grados",
      activa: true,
    },
    {
      codigo: "CAM-003",
      ubicacion: "Zona sur",
      tipo: "Visión nocturna",
      activa: true,
    },
    {
      codigo: "CAM-004",
      ubicacion: "Zona oeste",
      tipo: "Perimetral",
      activa: false,
    },
    {
      codigo: "CAM-005",
      ubicacion: "Zona este",
      tipo: "Perimetral",
      activa: true,
    },
    {
      codigo: "CAM-006",
      ubicacion: "Zona centro",
      tipo: "Visión nocturna",
      activa: true,
    },
    {
      codigo: "CAM-007",
      ubicacion: "Zona norte",
      tipo: "360 grados",
      activa: true,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllCameras() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getCameraByCode(codigo) {
  const cameras = getAllCameras();

  return cameras.find((camera) => camera.codigo === codigo);
}

export function updateCamera(codigo, updatedData) {
  const cameras = getAllCameras();

  const index = cameras.findIndex((camera) => camera.codigo === codigo);

  if (index === -1) {
    throw new Error(`La cámara ${codigo} no existe`);
  }

  cameras[index] = {
    ...cameras[index],
    ...updatedData,
    codigo,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras));

  return cameras[index];
}

export function enableCamera(codigo) {
  updateCamera(codigo, { activa: true });
}

export function disableCamera(codigo) {
  updateCamera(codigo, { activa: false });
}

export function resetCameras() {
  localStorage.removeItem(STORAGE_KEY);

  initializeCameras();
}
