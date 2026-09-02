import { initializeCameras, resetCameras } from "./data/cameras.js";
import { initializeAlerts, resetAlerts } from "./data/alerts.js";
import {
  initializeMissions,
  saveMissionProgress,
  resetMissions,
} from "./data/missions.js";
import { getBattery, updateBattery, resetStorage } from "./core/storage.js";
import { endpointDefinitions } from "./core/endpoints.js";
import {
  validateUrlSyntax,
  parseUrl,
  normalizeUrl,
  getEndpointDefinition,
} from "./utils/url.js";

const BATTERY_COST = 5;
let gameEnded = false;
let battery = getBattery();

const endpointInput = document.querySelector("#endpoint");
const executeButton = document.querySelector("#execute");
const responseCode = document.querySelector("#response-code");
const responseMessage = document.querySelector("#response-message");
const responseInfoWrapper = document.querySelector("#response-info-wrapper");
const responseTable = document.querySelector("#response-table");
const statusPanel = document.querySelector("#status-panel");
const systemStatus = document.querySelector("#system-status");
const batteryLevel = document.querySelector("#battery-level");
const missionModal = document.querySelector("#mission-modal");
const modalTitle = document.querySelector("#modal-title");
const modalMessage = document.querySelector("#modal-message");
const modalRestart = document.querySelector("#modal-restart");

// ---------- MISIONES ----------
let missions = initializeMissions();
const missionProgressList = document.querySelector("#mission-progress-list");
const missionProgressText = document.querySelector("#mission-progress-text");
const missionProgressFill = document.querySelector("#mission-progress-fill");
const missionProgressPercent = document.querySelector(
  "#mission-progress-percent",
);

function initializeMissionProgress() {
  missionProgressList.innerHTML = "";

  missions.forEach((mission) => {
    const indicator = document.createElement("div");

    indicator.classList.add("mission-indicator");
    indicator.dataset.missionId = mission.id;
    indicator.textContent = String(mission.id).padStart(2, "0");

    missionProgressList.appendChild(indicator);
  });

  updateMissionProgressIndicator();
}

function updateMissionProgressIndicator() {
  const completedMissions = missions.filter(
    (mission) => mission.completed,
  ).length;

  const percentage = Math.round((completedMissions / missions.length) * 100);

  missionProgressText.textContent = `${completedMissions} / ${missions.length} MISIONES`;

  missionProgressPercent.textContent = `${percentage}%`;

  missionProgressFill.style.width = `${percentage}%`;

  missions.forEach((mission) => {
    const indicator = document.querySelector(
      `[data-mission-id="${mission.id}"]`,
    );

    indicator.classList.toggle("completed", mission.completed);
  });
}
// --------------------

function enableExecuteButton() {
  if (!endpointInput.value.trim()) executeButton.disabled = true;
  else executeButton.disabled = false;
}

function lockExecuteButton() {
  executeButton.disabled = true;
  setTimeout(() => {
    if (endpointInput.value.trim() || !gameEnded || battery !== 0) {
      executeButton.disabled = false;
    }
  }, 750);
}

function updateBatteryDisplay() {
  batteryLevel.textContent = `${battery}%`;
  statusPanel.classList.remove("status-online", "status-low", "status-offline");
  if (battery === 0) {
    statusPanel.classList.add("status-offline");
    systemStatus.textContent = "SISTEMA BLOQUEADO\nBATERÍA AGOTADA";
  } else if (battery <= 30) {
    statusPanel.classList.add("status-low");
    systemStatus.textContent = "SISTEMA EN LÍNEA\nBATERÍA BAJA";
  } else {
    statusPanel.classList.add("status-online");
    systemStatus.textContent = "SISTEMA EN LÍNEA";
  }
}

function consumeBattery() {
  battery = Math.max(0, battery - BATTERY_COST);
  updateBattery(battery);
  updateBatteryDisplay();
}

function updateMissionProgress(rawUrl) {
  const n = normalizeUrl(rawUrl);
  missions.forEach((mission) => {
    mission.goals.forEach((step) => {
      if (!step.executed && normalizeUrl(step.url) === n) step.executed = true;
    });
  });
}

function updateMissionCompleted() {
  missions.forEach((mission) => {
    mission.completed = mission.goals.every((step) => step.executed);
  });
}

function allMissionsAreCompleted() {
  return missions.every((mission) => mission.completed);
}

function showModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  missionModal.classList.remove("hidden");
}

function endGameAsSuccess() {
  gameEnded = true;
  executeButton.disabled = true;
  endpointInput.disabled = true;
  showModal(
    "FELICITACIONES",
    "Todas las misiones se completaron correctamente.\n" +
      "Nivel de batería: Restante " +
      battery +
      "% VS. Óptimo 60%\n" +
      "La partida ha finalizado.",
  );
}

function endGameAsFailure() {
  gameEnded = true;
  executeButton.disabled = true;
  endpointInput.disabled = true;
  showModal(
    "SISTEMA BLOQUEADO",
    "La batería se agotó antes de completar las misiones. La partida ha finalizado.",
  );
}

function checkBatteryAfterExecution() {
  if (battery === 0 && !allMissionsAreCompleted()) endGameAsFailure();
}

function executeEndpoint() {
  if (gameEnded || battery === 0) return;
  const rawUrl = endpointInput.value.trim();
  consumeBattery();
  lockExecuteButton();

  if (!validateUrlSyntax(rawUrl)) {
    renderResponse({
      code: 400,
      message: () => "La URL no tiene el formato esperado",
      info: null,
    });
    checkBatteryAfterExecution();
    return;
  }

  const parsed = parseUrl(rawUrl);
  let endpoint;
  try {
    endpoint = getEndpointDefinition(parsed, endpointDefinitions);
  } catch (error) {
    renderResponse({
      code: 400,
      message: () => error.message,
      info: null,
    });
    checkBatteryAfterExecution();
    return;
  }

  if (!endpoint) {
    renderResponse({
      code: 404,
      message: () => "No existe información para la dirección consultada",
    });
    checkBatteryAfterExecution();
    return;
  }

  try {
    renderResponse(endpoint.response, parsed.params);
  } catch (error) {
    renderResponse({
      code: 500,
      message: () => error.message,
    });
    checkBatteryAfterExecution();
    return;
  }

  updateMissionProgress(rawUrl);
  updateMissionCompleted();
  saveMissionProgress(missions);
  updateMissionProgressIndicator();

  if (allMissionsAreCompleted()) {
    endGameAsSuccess();
    return;
  }

  checkBatteryAfterExecution();
}

function renderResponse({ code, message, process, info }, params = {}) {
  responseCode.textContent = code;
  responseMessage.textContent = message(params);
  responseCode.className = "response-code";
  if (code === 200) responseCode.classList.add("code-success");
  else if (code === 400) responseCode.classList.add("code-client-error");
  else if (code === 404) responseCode.classList.add("code-not-found");
  else if (code === 500) responseCode.classList.add("code-server-error");
  else responseCode.classList.add("code-neutral");

  let newCode;
  if (process) {
    newCode = process(params);
  }

  if (!info) {
    responseInfoWrapper.classList.add("hidden");
    responseTable.innerHTML = "";
    return;
  }

  responseInfoWrapper.classList.remove("hidden");
  renderTable(info(newCode));
}

function renderTable(rows) {
  const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const thead = document.createElement("thead"),
    hr = document.createElement("tr");
  columns.forEach((c) => {
    const th = document.createElement("th");
    th.textContent = c;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  const tbody = document.createElement("tbody");
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    columns.forEach((c) => {
      const td = document.createElement("td");
      td.textContent = r[c] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  responseTable.replaceChildren(thead, tbody);
}

function resetGame() {
  gameEnded = false;
  endpointInput.value = "";
  responseCode.textContent = "---";
  responseCode.className = "response-code code-neutral";
  responseMessage.textContent = "Esperando ejecución de solicitud...";
  responseInfoWrapper.classList.add("hidden");
  responseTable.innerHTML = "";
  enableExecuteButton();
  resetCameras();
  resetAlerts();
  resetStorage();
  battery = getBattery();
  missions = resetMissions();
  updateBatteryDisplay();
  initializeMissionProgress();
  missionModal.classList.add("hidden");
}

endpointInput.addEventListener("input", enableExecuteButton);
executeButton.addEventListener("click", executeEndpoint);
modalRestart.addEventListener("click", resetGame);
enableExecuteButton();
updateBatteryDisplay();
initializeCameras();
initializeAlerts();
initializeMissionProgress();
