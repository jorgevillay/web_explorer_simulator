const BATTERY_KEY = "battery";
const CAMERAS_COUNT_KEY = "camerasCount";
const ALERTS_COUNT_KEY = "alertsCount";

const INITIAL_BATTERY = 100;
const INITIAL_CAMERAS_COUNT = 7;
const INITIAL_ALERTS_COUNT = 6;

function initializeStorageItem(key, initialValue) {
  const storageValue = localStorage.getItem(key);

  if (storageValue) {
    return parseInt(storageValue, 10);
  }

  localStorage.setItem(key, JSON.stringify(initialValue));
  return parseInt(initialValue, 10);
}

function updateStorageItem(key, updatedData) {
  localStorage.setItem(key, updatedData);
}

export function resetStorage() {
  localStorage.removeItem(BATTERY_KEY);
  localStorage.removeItem(CAMERAS_COUNT_KEY);
  localStorage.removeItem(ALERTS_COUNT_KEY);

  initializeStorageItem(BATTERY_KEY, INITIAL_BATTERY);
  initializeStorageItem(CAMERAS_COUNT_KEY, INITIAL_CAMERAS_COUNT);
  initializeStorageItem(ALERTS_COUNT_KEY, INITIAL_ALERTS_COUNT);
}

export function getBattery() {
  return initializeStorageItem(BATTERY_KEY, INITIAL_BATTERY);
}

export function updateBattery(newBattery) {
  updateStorageItem(BATTERY_KEY, newBattery);
}

export let camerasCount = initializeStorageItem(
  CAMERAS_COUNT_KEY,
  INITIAL_CAMERAS_COUNT,
);

export let alertsCount = initializeStorageItem(
  ALERTS_COUNT_KEY,
  INITIAL_ALERTS_COUNT,
);

export function updateCamerasCount(newCount) {
  updateStorageItem(CAMERAS_COUNT_KEY, newCount);
  camerasCount = newCount;
}

export function updateAlertsCount(newCount) {
  updateStorageItem(ALERTS_COUNT_KEY, newCount);
  alertsCount = newCount;
}
