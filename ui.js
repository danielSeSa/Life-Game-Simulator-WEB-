// ui.js
import { formatCurrency } from "./utils.js";
import { characterPortraits } from "./character-portraits.js";

// --- DOM Elements ---
export const characterCreationScreen = document.getElementById(
  "character-creation-screen"
);
export const gameScreen = document.getElementById("game-screen");
export const gameOverScreen = document.getElementById("game-over-screen");
export const characterNameInput = document.getElementById("character-name");
export const genderMaleButton = document.getElementById("gender-male-button");

export const settingsButtonCreation = document.getElementById(
  "settings-button-creation"
);
export const settingsButtonGame = document.getElementById(
  "settings-button-game"
);

// --- NEW: Help Button Elements ---
export const helpButtonCreation = document.getElementById("help-button-creation");
export const helpButtonGame = document.getElementById("help-button-game");


export const genderFemaleButton = document.getElementById(
  "gender-female-button"
);
export const selectedGenderText = document.getElementById(
  "selected-gender-text"
);
export const startLifeButton = document.getElementById("start-life-button");
export const characterPortrait = document.getElementById("character-portrait");
export const playerNameAgeEl = document.getElementById("player-name-age");
export const playerMoneyEl = document.getElementById("player-money");
export const healthValueEl = document.getElementById("health-value");
export const healthBarEl = document.getElementById("health-bar");
export const happinessValueEl = document.getElementById("happiness-value");
export const happinessBarEl = document.getElementById("happiness-bar");
export const smartsValueEl = document.getElementById("smarts-value");
export const smartsBarEl = document.getElementById("smarts-bar");
export const looksValueEl = document.getElementById("looks-value");
export const looksBarEl = document.getElementById("looks-bar");
export const playerJobEl = document.getElementById("player-job");
export const playerEducationEl = document.getElementById("player-education");
export const prisonStatusEl = document.getElementById("prison-status");

export const homelessStatusEl = document.getElementById("homeless-status");
export const messageLogEl = document.getElementById("message-log");
export const eventTitleEl = document.getElementById("event-title");
export const eventChoicesEl = document.getElementById("event-choices");
export const ageUpButton = document.getElementById("age-up-button");
export const careerButton = document.getElementById("career-button");
export const assetsButton = document.getElementById("assets-button");
export const activitiesButton = document.getElementById("activities-button");
export const relationshipsButton = document.getElementById(
  "relationships-button"
);
export const mainActionButtonsEl = document.getElementById("main-action-buttons");
export const gameOverNameAgeEl = document.getElementById("game-over-name-age");
export const gameOverCauseEl = document.getElementById("game-over-cause");
export const gameOverMoneyEl = document.getElementById("game-over-money");
export const keyEventsListEl = document.getElementById("key-events-list");
export const restartButton = document.getElementById("restart-button");

// Generic Modal Elements
export const genericModalEl = document.getElementById("generic-modal");
export const modalTitleEl = document.getElementById("modal-title");
export const modalBodyEl = document.getElementById("modal-body");
export const modalCloseButton = document.getElementById("modal-close-button");
export const modalFooterEl = document.getElementById("modal-footer");

// Confirmation Dialog Elements
export const confirmationModalEl = document.getElementById("confirmation-modal");
export const confirmationTitleEl = document.getElementById("confirmation-title");
export const confirmationMessageEl = document.getElementById("confirmation-message");
export const confirmButtonEl = document.getElementById("confirmation-confirm-button");
export const cancelButtonEl = document.getElementById("confirmation-cancel-button");

export const toastNotificationEl =
  document.getElementById("toast-notification");

let translatedConstants = null;

export function initializeUiModule(constantsGetter) {
  if (typeof constantsGetter === "function") {
    translatedConstants = constantsGetter();
  }
}

export function getTranslatedConstants() {
  if (!translatedConstants) {
    console.warn(
      "Translated constants have not been initialized in ui.js."
    );
    return { AVAILABLE_ASSETS: {}, ACTIVITY_CATEGORIES: {} };
  }
  return translatedConstants;
}


// --- UI Update Functions ---

export function updateCharacterPortrait(player) {
    if (!characterPortrait || !player) return;

    let stage = 'baby';

    if (player.age >= 60) {
        stage = 'senior';
    } else if (player.age >= 40) {
        stage = 'middleAged';
    } else if (player.age >= 20) {
        stage = 'youngAdult';
    } else if (player.age >= 13) {
        stage = 'teen';
    } else if (player.age >= 3) {
        stage = 'child';
    }

    const portraitUrl = characterPortraits[player.gender]?.[stage];

    if (portraitUrl) {
        characterPortrait.src = portraitUrl;
        characterPortrait.alt = `${player.gender} character portrait at age ${player.age}`;
    } else {
        characterPortrait.src = '';
        characterPortrait.alt = 'Character portrait not available';
    }
}


export function updateStatsUI(player) {
  if (!player) return;

  updateCharacterPortrait(player);

  playerNameAgeEl.textContent = `${player.name} (Age: ${player.age})`;
  playerMoneyEl.textContent = `Money: ${formatCurrency(player.money)}`;
  playerMoneyEl.className = `text-lg font-semibold ${
    player.money >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400"
  }`;

  healthValueEl.textContent = player.health;
  healthBarEl.style.width = `${player.health}%`;
  healthBarEl.className = `stat-bar-fill ${
    player.health > 60
      ? "bg-green-500"
      : player.health > 30
      ? "bg-yellow-500"
      : "bg-red-500"
  }`;

  happinessValueEl.textContent = player.happiness;
  happinessBarEl.style.width = `${player.happiness}%`;
  happinessBarEl.className = `stat-bar-fill ${
    player.happiness > 60
      ? "bg-yellow-400"
      : player.happiness > 30
      ? "bg-orange-500"
      : "bg-red-600"
  }`;

  smartsValueEl.textContent = player.smarts;
  smartsBarEl.style.width = `${player.smarts}%`;
  smartsBarEl.className = "stat-bar-fill bg-blue-500";

  looksValueEl.textContent = player.looks;
  looksBarEl.style.width = `${player.looks}%`;
  looksBarEl.className = "stat-bar-fill bg-pink-500";

  let jobText = "Job: Unemployed";
  if (player.job && player.part_time_job) {
    jobText = `Job: ${player.job} (Full-time), ${player.part_time_job} (Part-time)`;
  } else if (player.job) {
    jobText = `Job: ${player.job} (Full-time)`;
  } else if (player.part_time_job) {
    jobText = `Job: ${player.part_time_job} (Part-time)`;
  }
  playerJobEl.textContent = jobText;

  let eduText = `Education: ${player.education_level}`;
  if (player.university_major) {
    eduText += ` (${player.university_major})`;
  }
  playerEducationEl.textContent = eduText;

  if (player.prison_time > 0) {
    prisonStatusEl.textContent = `In Prison: ${player.prison_time} years remaining`;
    prisonStatusEl.classList.remove("hidden");
  } else {
    prisonStatusEl.classList.add("hidden");
  }

  if (homelessStatusEl) {
      if (player.is_homeless) {
          homelessStatusEl.textContent = "Status: Homeless";
          homelessStatusEl.classList.remove("hidden");
      } else {
          homelessStatusEl.classList.add("hidden");
      }
  }

  if (mainActionButtonsEl) {
      if (player.age < 6) {
          mainActionButtonsEl.classList.add('hidden');
      } else {
          mainActionButtonsEl.classList.remove('hidden');
      }
  }
}

export function addMessageToLog(
  message,
  type = "normal",
  messageLogArray,
  renderFunc
) {
  if (!messageLogArray || !renderFunc) {
    console.error("addMessageToLog: messageLogArray or renderFunc is missing!");
    return;
  }
  messageLogArray.unshift({ text: message, type: type });
  if (messageLogArray.length > 20) messageLogArray.pop();
  renderFunc(messageLogArray);
}

export function renderMessageLog(messageLogArray) {
  if (!messageLogEl) return;
  messageLogEl.innerHTML = "";
  messageLogArray.forEach((msgObj) => {
    const p = document.createElement("p");
    p.textContent = msgObj.text;
    p.className =
      "p-2 bg-white dark:bg-gray-700 rounded shadow-sm text-sm text-gray-800 dark:text-gray-200";
    if (msgObj.type === "error") {
      p.classList.add("text-red-600", "dark:text-red-400", "font-semibold");
    } else if (msgObj.type === "event") {
      p.classList.add("text-blue-700", "dark:text-blue-400");
    }
    messageLogEl.appendChild(p);
  });
  messageLogEl.scrollTop = 0;
}

export function switchScreen(screenName, setGameStateFunc) {
  if (
    !characterCreationScreen ||
    !gameScreen ||
    !gameOverScreen ||
    !genericModalEl ||
    !setGameStateFunc
  ) {
    console.error(
      "One or more screen elements or setGameStateFunc is undefined in switchScreen."
    );
    return;
  }
  characterCreationScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  genericModalEl.style.display = "none";

  if (screenName === "character_creation") {
    characterCreationScreen.classList.remove("hidden");
    setGameStateFunc("character_creation");
  } else if (screenName === "game") {
    gameScreen.classList.remove("hidden");
    setGameStateFunc("playing");
  } else if (screenName === "game_over") {
    gameOverScreen.classList.remove("hidden");
  }
}

export function displayEventChoices(
  title,
  choicesArray,
  handler,
  setGameStateFunc,
  setCurrentChoiceHandlerFunc,
  updateAllUIFunc,
  checkGameOverFunc
) {
  if (
    !eventTitleEl ||
    !eventChoicesEl ||
    !setGameStateFunc ||
    !setCurrentChoiceHandlerFunc
  ) {
    console.error(
      "Essential elements or functions for displayEventChoices are undefined."
    );
    return;
  }
  setGameStateFunc("event_choice");
  eventTitleEl.textContent = title;
  eventChoicesEl.innerHTML = "";
  setCurrentChoiceHandlerFunc(handler);

  choicesArray.forEach((choiceData) => {
    const button = document.createElement("button");
    button.textContent = choiceData.text;
    button.className = "w-full button-primary py-2 text-sm mb-2";
    if (choiceData.disabled) {
      button.classList.add("button-disabled");
      button.disabled = true;
    }
    button.onclick = () => {
      if (handler) handler(choiceData.key);
      clearEventArea(setCurrentChoiceHandlerFunc);
      setGameStateFunc("playing");
      if (updateAllUIFunc) updateAllUIFunc();
      if (checkGameOverFunc) checkGameOverFunc();
    };
    eventChoicesEl.appendChild(button);
  });
}

export function clearEventArea(setCurrentChoiceHandlerFunc) {
  if (eventTitleEl) eventTitleEl.textContent = "";
  if (eventChoicesEl) eventChoicesEl.innerHTML = "";
  if (setCurrentChoiceHandlerFunc) setCurrentChoiceHandlerFunc(null);
}

export function openModal(
  title,
  bodyContentGenerator,
  returnToStateOnClose = "playing",
  backButtonAction = null,
  customFooterGenerator = null,
  setGameStateFunc,
  setTemporaryModalReturnStateFunc
) {
  if (
    !modalTitleEl ||
    !modalBodyEl ||
    !modalFooterEl ||
    !genericModalEl ||
    !setGameStateFunc ||
    !setTemporaryModalReturnStateFunc
  ) {
    console.error(
      "One or more modal elements or setter functions are undefined in openModal."
    );
    return;
  }
  modalTitleEl.textContent = title;
  modalBodyEl.innerHTML = "";
  if (typeof bodyContentGenerator === "function") {
    bodyContentGenerator(modalBodyEl);
  }

  modalFooterEl.innerHTML = "";
  if (customFooterGenerator) {
    customFooterGenerator(modalFooterEl);
  } else {
    const defaultBackButton = document.createElement("button");
    defaultBackButton.id = "modal-back-button-dynamic";
    defaultBackButton.textContent = "Back";
    defaultBackButton.className =
      "button-primary bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700";
    if (typeof backButtonAction === "function") {
      defaultBackButton.onclick = backButtonAction;
    }
    modalFooterEl.appendChild(defaultBackButton);
  }

  genericModalEl.style.display = "flex";
  setGameStateFunc("menu");
  setTemporaryModalReturnStateFunc(returnToStateOnClose);
}

export function closeModal(
  getTemporaryModalReturnStateFunc,
  setGameStateFunc,
  clearEventAreaFunc,
  updateAllUIFunc,
  checkGameOverFunc,
  setCurrentChoiceHandlerFuncForEventArea
) {
  if (
    !genericModalEl ||
    !getTemporaryModalReturnStateFunc ||
    !setGameStateFunc
  ) {
    console.error(
      "Essential elements or functions for closeModal are undefined."
    );
    if (genericModalEl) genericModalEl.style.display = "none";
    if (setGameStateFunc && getTemporaryModalReturnStateFunc) {
      setGameStateFunc(getTemporaryModalReturnStateFunc() || "playing");
    }
    return;
  }
  genericModalEl.style.display = "none";
  const returnState = getTemporaryModalReturnStateFunc();
  setGameStateFunc(returnState);

  if (typeof clearEventAreaFunc === "function") {
    clearEventAreaFunc(setCurrentChoiceHandlerFuncForEventArea);
  }
  if (typeof updateAllUIFunc === "function") {
    updateAllUIFunc();
  }
  if (typeof checkGameOverFunc === "function") {
    checkGameOverFunc();
  }
}

export function showConfirmationDialog(title, message, onConfirm) {
    if (!confirmationModalEl || !confirmButtonEl || !cancelButtonEl) {
        console.error("Confirmation dialog elements are not found in the DOM.");
        onConfirm();
        return;
    }

    confirmationTitleEl.textContent = title;
    confirmationMessageEl.textContent = message;

    confirmationModalEl.style.display = "flex";

    const newConfirmButton = confirmButtonEl.cloneNode(true);
    confirmButtonEl.parentNode.replaceChild(newConfirmButton, confirmButtonEl);
    
    const newCancelButton = cancelButtonEl.cloneNode(true);
    cancelButtonEl.parentNode.replaceChild(newCancelButton, cancelButtonEl);
    
    const finalConfirmButton = document.getElementById("confirmation-confirm-button");
    const finalCancelButton = document.getElementById("confirmation-cancel-button");

    const closeDialog = () => {
        confirmationModalEl.style.display = "none";
    };

    finalConfirmButton.onclick = () => {
        closeDialog();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    };

    finalCancelButton.onclick = closeDialog;
}


export function showToast(message) {
  if (!toastNotificationEl) return;
  toastNotificationEl.textContent = message;
  toastNotificationEl.classList.remove("hidden");
  toastNotificationEl.classList.add("show");
  setTimeout(() => {
    toastNotificationEl.classList.remove("show");
  }, 3000);
}