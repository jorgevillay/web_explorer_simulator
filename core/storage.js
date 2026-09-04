const BATTERY_KEY = "battery";
const ALERTS_COUNT_KEY = "alertsCount";
const TRANSACTIONS_COUNT_KEY = "transactionsCount";

const INITIAL_BATTERY = 100;
const INITIAL_CAMERAS_COUNT = 7;
const INITIAL_ALERTS_COUNT = 6;
const INITIAL_TRANSACTIONS_COUNT = 8;

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
  localStorage.removeItem(TRANSACTIONS_COUNT_KEY);

  initializeStorageItem(BATTERY_KEY, INITIAL_BATTERY);
  initializeStorageItem(CAMERAS_COUNT_KEY, INITIAL_CAMERAS_COUNT);
  initializeStorageItem(ALERTS_COUNT_KEY, INITIAL_ALERTS_COUNT);
  initializeStorageItem(TRANSACTIONS_COUNT_KEY, INITIAL_TRANSACTIONS_COUNT);
}

export function getBattery() {
  return initializeStorageItem(BATTERY_KEY, INITIAL_BATTERY);
}

export function updateBattery(newBattery) {
  updateStorageItem(BATTERY_KEY, newBattery);
}

export let alertsCount = initializeStorageItem(
  ALERTS_COUNT_KEY,
  INITIAL_ALERTS_COUNT,
);

export let transactionsCount = initializeStorageItem(
  TRANSACTIONS_COUNT_KEY,
  INITIAL_TRANSACTIONS_COUNT,
);

export function updateAlertsCount(newCount) {
  updateStorageItem(ALERTS_COUNT_KEY, newCount);
  alertsCount = newCount;
}

export function updateTransactionsCount(newCount) {
  updateStorageItem(TRANSACTIONS_COUNT_KEY, newCount);
  transactionsCount = newCount;
}
