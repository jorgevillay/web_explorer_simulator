const STORAGE_KEY = "ciudadanos";

export function initializeCitizens() {
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (existingData) {
    return;
  }

  const initialData = [
    {
      cedula: "1023456783",
      nombre: "Daniela Rojas",
      fechaNacimiento: "2057-06-21",
      sexo: "F",
      estadoCivil: "Soltera",
      ubicacion: "Zona sur",
    },
    {
      cedula: "1023456784",
      nombre: "Carlos Vega",
      fechaNacimiento: "2045-01-12",
      sexo: "M",
      estadoCivil: "Casado",
      ubicacion: "Zona norte",
    },
    {
      cedula: "1023456782",
      nombre: "Andrés Salazar",
      fechaNacimiento: "2048-11-08",
      sexo: "M",
      estadoCivil: "Casado",
      ubicacion: "Zona centro",
    },
    {
      cedula: "1023456788",
      nombre: "Ricardo Molina",
      fechaNacimiento: "2046-07-23",
      sexo: "M",
      estadoCivil: "Casado",
      ubicacion: "Zona sur",
    },
    {
      cedula: "1023456785",
      nombre: "Natalia Torres",
      fechaNacimiento: "2051-09-30",
      sexo: "F",
      estadoCivil: "Divorciada",
      ubicacion: "Zona este",
    },
    {
      cedula: "1023456789",
      nombre: "Sofía Navarro",
      fechaNacimiento: "2053-02-11",
      sexo: "F",
      estadoCivil: "Casada",
      ubicacion: "Zona centro",
    },
    {
      cedula: "1023456781",
      nombre: "Laura Mendoza",
      fechaNacimiento: "2054-03-17",
      sexo: "F",
      estadoCivil: "Soltera",
      ubicacion: "Zona oeste",
    },
    {
      cedula: "1023456786",
      nombre: "Miguel Herrera",
      fechaNacimiento: "2059-04-05",
      sexo: "M",
      estadoCivil: "Soltero",
      ubicacion: "Zona este",
    },
    {
      cedula: "1023456787",
      nombre: "Elena Castro",
      fechaNacimiento: "2042-12-14",
      sexo: "F",
      estadoCivil: "Casada",
      ubicacion: "Zona norte",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

export function getAllCitizens() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getCitizenByCedula(cedula) {
  const citizens = getAllCitizens();

  return citizens.find((citizen) => citizen.cedula === cedula);
}

export function resetCitizens() {
  localStorage.removeItem(STORAGE_KEY);

  initializeCitizens();
}

export function clearCitizenStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
