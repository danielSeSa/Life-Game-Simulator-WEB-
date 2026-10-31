// main.js

// --- Import Modules ---
import {
  ACTIVITY_CATEGORIES,
  SKILLS_AVAILABLE,
} from "./constants.js";

import * as utils from "./utils.js";
import { Character } from "./character.js";
import * as ui from "./ui.js";
import * as menus from "./menus.js";
import * as events from "./events.js";
import { t, initI18n, setLanguage as setI18nLanguage } from "./i18n.js";
import * as activities from "./activities.js";
import { initializeSecurity } from "./security.js"; // NEW: Import security module

// --- Global Game State Variables ---
export let player = null;
export let gameState = "character_creation";
export let messageLog = [];
export let currentChoiceHandler = null;
let selectedGenderForCreation = null;
export let currentMenuType = null;
export let temporaryModalReturnState = "playing";
let currentTheme = localStorage.getItem("theme") || "light";

// --- Setter and Getter Functions for Global States ---
export function getPlayerInstance() {
  return player;
}

export function setGameState(newState) {
  gameState = newState;

  if (ui.ageUpButton) {
    const isButtonDisabled = (newState === 'menu' || newState === 'event_choice');
    ui.ageUpButton.disabled = isButtonDisabled;
    if (isButtonDisabled) {
      ui.ageUpButton.classList.add('button-disabled');
    } else {
      ui.ageUpButton.classList.remove('button-disabled');
    }
  }
}

export function setCurrentMenuType(newType) {
  currentMenuType = newType;
}
export function getTemporaryModalReturnState() {
  return temporaryModalReturnState;
}
export function setTemporaryModalReturnState(newState) {
  temporaryModalReturnState = newState;
}
export function setCurrentChoiceHandler(newHandler) {
  currentChoiceHandler = newHandler;
}

// --- Helper/Wrapper Functions for Logging Messages ---
export function addMessageToLog(message, type = "normal") {
  ui.addMessageToLog(message, type, messageLog, renderMessageLog);
}
function renderMessageLog() {
  ui.renderMessageLog(messageLog);
}

// --- Theme Related Functions ---
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
  currentTheme = theme;
}

function toggleTheme() {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
}

function updateStaticUIText() {
    if(ui.characterCreationScreen && !ui.characterCreationScreen.classList.contains('hidden')) {
        document.querySelector('#character-creation-screen h1').textContent = t('CREATE_YOUR_CHARACTER');
        document.querySelector('label[for="character-name"]').textContent = t('CHARACTER_NAME_LABEL');
        ui.characterNameInput.placeholder = t('CHARACTER_NAME_PLACEHOLDER');
        document.querySelector('#character-creation-screen .mb-6 > label').textContent = t('GENDER_LABEL');
        ui.genderMaleButton.textContent = t('MALE');
        ui.genderFemaleButton.textContent = t('FEMALE');
        ui.startLifeButton.textContent = t('START_LIFE');
    }

    if(ui.gameScreen && !ui.gameScreen.classList.contains('hidden')) {
        document.querySelector('#health-value').parentElement.childNodes[0].textContent = `${t('STAT_HEALTH')}: `;
        document.querySelector('#happiness-value').parentElement.childNodes[0].textContent = `${t('STAT_HAPPINESS')}: `;
        document.querySelector('#smarts-value').parentElement.childNodes[0].textContent = `${t('STAT_SMARTS')}: `;
        document.querySelector('#looks-value').parentElement.childNodes[0].textContent = `${t('STAT_LOOKS')}: `;
        ui.careerButton.textContent = t('CAREER_BUTTON');
        ui.assetsButton.textContent = t('ASSETS_BUTTON');
        ui.activitiesButton.textContent = t('ACTIVITIES_BUTTON');
        ui.relationshipsButton.textContent = t('RELATIONSHIPS_BUTTON');
        ui.ageUpButton.textContent = t('AGE_UP_BUTTON');
    }
    
    if(ui.gameOverScreen && !ui.gameOverScreen.classList.contains('hidden')) {
        ui.gameOverScreen.querySelector('h1').textContent = t('GAME_OVER');
        ui.restartButton.textContent = t('RESTART');
        ui.keyEventsListEl.previousElementSibling.textContent = t('KEY_EVENTS');
    }
}


// --- Event Choice Handlers ---
const eventChoiceHandlers = {
  handleSchoolBullyChoice: (key) => {
    let res_msg_key = "";
    if (!player) return;
    if (key === "bully_ignore") {
      player.applyStatChange("happiness", -10);
      res_msg_key = "EVENT_BULLY_IGNORE_RESULT";
    } else if (key === "bully_confront") {
      if (Math.random() < (player.smarts + player.looks) / 150) {
        player.applyStatChange("happiness", 10);
        player.applyStatChange("smarts", 2);
        res_msg_key = "EVENT_BULLY_CONFRONT_SUCCESS";
      } else {
        player.applyStatChange("happiness", -15);
        player.applyStatChange("health", -5);
        res_msg_key = "EVENT_BULLY_CONFRONT_FAIL";
      }
    } else if (key === "bully_tell_teacher") {
      if (Math.random() < 0.7) {
        player.applyStatChange("happiness", 5);
        res_msg_key = "EVENT_BULLY_TELL_SUCCESS";
      } else {
        player.applyStatChange("happiness", -5);
        res_msg_key = "EVENT_BULLY_TELL_FAIL";
      }
    }
    if (res_msg_key) {
        const res_msg = t(res_msg_key);
        addMessageToLog(res_msg);
        player.addEventToLog(res_msg);
    }
  },
  handleUniversityChoice: (key) => {
    let res_msg = "";
    if (!player) return;
    if (key === "uni_yes") {
      if (player.smarts > 50) {
        player.education_level = "University Student";
        player.applyStatChange("smarts", utils.randint(10, 20));
        const cost = utils.randint(5000, 15000);
        if (player.money >= cost) {
          player.money -= cost;
          res_msg = t('EVENT_UNIVERSITY_ENROLLED', {cost: utils.formatCurrency(cost)});
          player.in_school = true;
          addMessageToLog(res_msg);
          player.addEventToLog(res_msg);
          menus.showMajorSelectionMenu();
        } else {
          res_msg = t('EVENT_UNIVERSITY_POOR', {cost: utils.formatCurrency(cost)});
          player.education_level = "High School Diploma";
          addMessageToLog(res_msg, 'error');
          player.addEventToLog(res_msg);
        }
      } else {
        player.applyStatChange("happiness", -5);
        player.education_level = "High School Diploma";
        res_msg = t('EVENT_UNIVERSITY_NOT_SMART');
        addMessageToLog(res_msg, 'error');
        player.addEventToLog(res_msg);
      }
    } else if (key === "uni_no") {
      player.education_level = "High School Diploma";
      res_msg = t('EVENT_UNIVERSITY_DECLINED');
      addMessageToLog(res_msg);
      player.addEventToLog(res_msg);
    }
  },
};

// --- Core Game Functions ---
function resetGameForCreation() {
  player = null;
  messageLog = [];
  currentChoiceHandler = null;
  selectedGenderForCreation = null;
  if (ui.characterNameInput) ui.characterNameInput.value = "";
  if (ui.selectedGenderText) ui.selectedGenderText.textContent = "";
  if (ui.genderMaleButton) {
    ui.genderMaleButton.classList.remove("ring-2", "ring-offset-2", "ring-yellow-400");
  }
  if (ui.genderFemaleButton) {
    ui.genderFemaleButton.classList.remove("ring-2", "ring-offset-2", "ring-yellow-400");
  }
  document.body.classList.remove("game-over-active");
  ui.clearEventArea(setCurrentChoiceHandler);
  renderMessageLog();
  ui.switchScreen("character_creation", setGameState);
  updateStaticUIText();
}

function startGame() {
  const name = ui.characterNameInput.value.trim();
  if (!name) {
    ui.showToast(t('TOAST_ENTER_NAME'));
    return;
  }
  if (!selectedGenderForCreation) {
    ui.showToast(t('TOAST_SELECT_GENDER'));
    return;
  }
  player = new Character(name, selectedGenderForCreation);
  messageLog = [];
  addMessageToLog(t('LOG_NEW_LIFE', {name: player.name, age: player.age}), "event");
  addMessageToLog(t('LOG_PARENTS_INFO', {
      fatherName: player.parents.father.name,
      fatherAge: player.parents.father.age,
      motherName: player.parents.mother.name,
      motherAge: player.parents.mother.age,
  }));
  player.addEventToLog(t('LOG_LIFE_STARTED'));
  player.addEventToLog(`Parents: Father - ${player.parents.father.name}, Mother - ${player.parents.mother.name}.`);
  ui.switchScreen("game", setGameState);
  
  updateAllUI();
}

function handleAgeUp() {
  if (!player || !player.alive || gameState !== 'playing') {
    if (gameState === "event_choice") ui.showToast(t('TOAST_EVENT_RESPONSE'));
    if (gameState === "menu") ui.showToast(t('TOAST_CLOSE_MENU'));
    return;
  }
  ui.clearEventArea(setCurrentChoiceHandler);
  const ageUpMessages = player.age_up();
  if (Array.isArray(ageUpMessages)) {
    ageUpMessages.forEach((msg) => addMessageToLog(msg.text, msg.type));
  }
  if (!player.alive) {
    showGameOverScreen();
    return;
  }
  let eventTriggeredThisTurn = false;
  let choiceEventData = null;
  if (player.prison_time === 0) {
    const eduEventResult = events.eventEducationProgression();
    if (eduEventResult) {
      eventTriggeredThisTurn = true;
      if (eduEventResult.type === "choice_event") choiceEventData = eduEventResult;
    }
    if (gameState === "playing" && !eventTriggeredThisTurn) {
      const jobEventResult = events.eventJobOfferOrPromotion();
      if (jobEventResult) eventTriggeredThisTurn = true;
    }
    if (gameState === "playing" && !eventTriggeredThisTurn) {
      const relEventResult = events.eventRelationshipMilestone();
      if (relEventResult) eventTriggeredThisTurn = true;
    }
    if (gameState === "playing" && !eventTriggeredThisTurn && Math.random() < 0.35) {
      const randomEventsList = [];
      if (player.age <= 17) {
        if (typeof events.eventChildhoodIllness === "function") randomEventsList.push(events.eventChildhoodIllness);
        if (typeof events.eventFoundMoney === "function") randomEventsList.push(events.eventFoundMoney);
        if (typeof events.eventSchoolBully === "function") randomEventsList.push(events.eventSchoolBully);
      } else {
        if (typeof events.eventFoundMoney === "function") randomEventsList.push(events.eventFoundMoney);
      }
      if (randomEventsList.length > 0) {
        const chosen_event_func = utils.choice(randomEventsList);
        if (chosen_event_func) {
          const eventResult = chosen_event_func();
          if (eventResult) {
            eventTriggeredThisTurn = true;
            if (eventResult.type === "choice_event") choiceEventData = eventResult;
          }
        }
      }
    }
  }
  if (choiceEventData && eventChoiceHandlers[choiceEventData.handlerKey]) {
    ui.displayEventChoices(choiceEventData.title, choiceEventData.choices, eventChoiceHandlers[choiceEventData.handlerKey], setGameState, setCurrentChoiceHandler, updateAllUI, checkGameOver);
  } else {
    updateAllUI();
    checkGameOver();
  }
}

function checkGameOver() {
  if (player && !player.alive && gameState !== "game_over") {
    showGameOverScreen();
  }
}

function showGameOverScreen() {
  if (gameState === "game_over" || !player) return;
  setGameState("game_over");
  document.body.classList.add("game-over-active");
  ui.gameOverNameAgeEl.textContent = `${player.name} died at age ${player.age}.`;
  ui.gameOverCauseEl.textContent = t('GAME_OVER_CAUSE_PREFIX') + player.cause_of_death;
  ui.gameOverMoneyEl.textContent = t('GAME_OVER_MONEY_PREFIX') + utils.formatCurrency(player.money);
  ui.keyEventsListEl.innerHTML = "";
  const eventsToShow = player.significant_events.slice(-7);
  eventsToShow.forEach((eventText) => {
    const li = document.createElement("li");
    li.textContent = eventText;
    ui.keyEventsListEl.appendChild(li);
  });
  ui.switchScreen("game_over", setGameState);
  updateStaticUIText();
}

function updateAllUI() {
  if (player && player.alive) {
    ui.updateStatsUI(player);
    if (gameState === 'playing' || gameState === 'event_choice') {
        renderMessageLog();
    }
    updateStaticUIText(); 
  } else if (player && !player.alive && gameState !== "game_over") {
    showGameOverScreen();
  }
}

function closeModalWrapper() {
  ui.closeModal(getTemporaryModalReturnState, setGameState, () => ui.clearEventArea(setCurrentChoiceHandler), updateAllUI, checkGameOver, setCurrentChoiceHandler);
}

const actionHandlers = {
    toggle_theme: () => {
        toggleTheme();
        menus.showSettingsMenu();
    },
    set_language: async (data) => {
        await setI18nLanguage(data);
        localStorage.setItem("game_language", data);
        updateAllUI();
        menus.showSettingsMenu();
    },
    job_type_select: (data) => {
        menus.showJobListingMenu(data);
    },
    apply_job: (data) => {
        let messageForLog = "";
        if (data.eligible) {
            const job_name_en = data.name_en;
            const details = data.details;
            const job_name_key = `JOB_NAME_${job_name_en.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
            const translated_job_name = t(job_name_key);
            
            if (details.type === "part_time") {
                player.part_time_job = job_name_en;
                const hourly_pay = utils.randint(details.salary_range[0], details.salary_range[1]);
                player.current_part_time_annual_salary = hourly_pay * 20 * 52;
                player.applyStatChange("happiness", 10);
                messageForLog = t('HIRE_MESSAGE_PT', {jobName: translated_job_name, amount: utils.formatCurrency(hourly_pay)});
            } else {
                player.job = job_name_en;
                player.current_annual_salary = utils.randint(details.salary_range[0], details.salary_range[1]);
                player.applyStatChange("happiness", 15);
                messageForLog = t('HIRE_MESSAGE_FT', {jobName: translated_job_name, amount: utils.formatCurrency(player.current_annual_salary)});
            }
            player.addEventToLog(messageForLog);
        } else {
            const job_name_key = `JOB_NAME_${data.name_en.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
            messageForLog = t('INELIGIBLE_FOR_JOB', {jobName: t(job_name_key)});
        }
        addMessageToLog(messageForLog);
        closeModalWrapper();
    },
    resign_job: () => {
        let resigned = false;
        if (player.job) {
            const job_name_key = `JOB_NAME_${player.job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
            const translated_job_name = t(job_name_key);
            addMessageToLog(t('RESIGNED_FT', {jobName: translated_job_name}));
            player.addEventToLog(`Resigned from full-time job (${player.job}).`);
            player.job = null;
            player.current_annual_salary = 0;
            player.applyStatChange("happiness", -5);
            resigned = true;
        }
        if (player.part_time_job) {
            const job_name_key = `JOB_NAME_${player.part_time_job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
            const translated_job_name = t(job_name_key);
            addMessageToLog(t('RESIGNED_PT', {jobName: translated_job_name}));
            player.addEventToLog(`Resigned from part-time job (${player.part_time_job}).`);
            player.part_time_job = null;
            player.current_part_time_annual_salary = 0;
            player.applyStatChange("happiness", -3);
            resigned = true;
        }
        if (!resigned) addMessageToLog(t('NO_JOB_TO_RESIGN'));
        closeModalWrapper();
    },
    rent_property: (data) => {
        const prop_template = data.item;
        const price = prop_template.rent_price;
        if (player.money >= price) {
            player.money -= price;
            const new_property = { ...prop_template, uniqueId: `prop_${Date.now()}_${utils.randint(1000, 9999)}`, status: "rented", health: 100 };
            player.properties.push(new_property);
            player.applyStatChange("happiness", prop_template.effect.happiness || 5);
            const message = t('RENTED_PROPERTY', {propName: prop_template.name_en, price: utils.formatCurrency(price)});
            addMessageToLog(message);
            player.addEventToLog(message);
        } else {
            addMessageToLog(t('CANNOT_AFFORD_TO_RENT', {propName: prop_template.name_en}));
        }
        closeModalWrapper();
    },
    buy_property: (data) => {
        const prop_template = data.item;
        const price = prop_template.purchase_price;
        if (player.money >= price) {
            player.money -= price;
            const new_property = { ...prop_template, uniqueId: `prop_${Date.now()}_${utils.randint(1000, 9999)}`, status: "owned", health: 100 };
            player.properties.push(new_property);
            player.applyStatChange("happiness", prop_template.effect.happiness || 15);
            const message = t('PURCHASED_PROPERTY', {propName: prop_template.name_en, price: utils.formatCurrency(price)});
            addMessageToLog(message);
            player.addEventToLog(message);
        } else {
            addMessageToLog(t('CANNOT_AFFORD_TO_BUY', {propName: prop_template.name_en}));
        }
        closeModalWrapper();
    },
    sell_property: (data) => {
        const propToSell = player.properties.find((p) => p.uniqueId === data);
        if (propToSell) {
            const resaleValue = Math.round(propToSell.purchase_price * 0.8 * (propToSell.health / 100));
            player.money += resaleValue;
            player.properties = player.properties.filter((p) => p.uniqueId !== data);
            const message = t('SOLD_PROPERTY', {propName: propToSell.name_en, price: utils.formatCurrency(resaleValue)});
            addMessageToLog(message);
            player.addEventToLog(message);
        }
    },
    repair_property: (data) => {
        const propToRepair = player.properties.find((p) => p.uniqueId === data);
        if (propToRepair) {
            const healthToRestore = 100 - propToRepair.health;
            if (healthToRestore > 0) {
                const repairCost = Math.round(healthToRestore * 20 + propToRepair.purchase_price * 0.005);
                if (player.money >= repairCost) {
                    player.money -= repairCost;
                    propToRepair.health = 100;
                    if(propToRepair.status === 'uninhabitable') propToRepair.status = 'owned';
                    addMessageToLog(t('REPAIRED_PROPERTY', {propName: propToRepair.name_en, cost: utils.formatCurrency(repairCost)}));
                } else {
                    addMessageToLog(t('CANNOT_AFFORD_REPAIR', {cost: utils.formatCurrency(repairCost)}));
                }
            }
        }
        menus.showPropertyActionsMenu(propToRepair);
    },
    end_rental: (data) => {
        const propToEndRental = player.properties.find((p) => p.uniqueId === data);
        if (propToEndRental) {
            player.properties = player.properties.filter((p) => p.uniqueId !== data);
            const message = t('ENDED_RENTAL', {propName: propToEndRental.name_en});
            player.applyStatChange("happiness", -10);
            addMessageToLog(message, 'error');
            player.addEventToLog(message);
        }
    },
    select_car_category: (data) => {
        if (data === "Cars") {
            if (player.age < 18) {
                addMessageToLog(t('TOAST_CAR_TOO_YOUNG'));
                closeModalWrapper();
            } else if (!player.has_drivers_license) {
                addMessageToLog(t('TOAST_CAR_NO_LICENSE'));
                closeModalWrapper();
            } else {
                menus.showCarBrandSelectionMenu();
            }
        }
    },
    select_car_brand: (data) => {
        menus.showAssetListingMenu("Cars", data);
    },
    buy_asset: (data) => {
        const asset_type = data.type;
        const item_template = data.item;
        let messageForLog = "";

        if (asset_type === "Cars" && (player.age < 18 || !player.has_drivers_license)) {
            messageForLog = t('TOAST_CAR_NO_LICENSE');
        } else if (player.money >= item_template.price) {
            player.money -= item_template.price;
            const purchased_item = { ...item_template, uniqueId: `car_${Date.now()}_${utils.randint(1000, 9999)}`, health: 100, status: "operational" };
            player.cars_owned.push(purchased_item);
            Object.entries(purchased_item.effect).forEach(([stat, val_change]) => {
                let changeAmount = Array.isArray(val_change) ? utils.randint(val_change[0], val_change[1]) : val_change;
                player.applyStatChange(stat, changeAmount);
            });
            messageForLog = t('PURCHASED_ASSET', {assetName: purchased_item.name_en, price: utils.formatCurrency(item_template.price)});
            player.addEventToLog(messageForLog);
        } else {
            messageForLog = t('CANNOT_AFFORD_ASSET', {assetName: item_template.name_en});
        }
        addMessageToLog(messageForLog);
        closeModalWrapper();
    },
    sell_car: (data) => {
        const carToSell = player.cars_owned.find((c) => c.uniqueId === data);
        if (carToSell) {
            const resaleValue = Math.round(carToSell.price * 0.5 * (carToSell.health / 100));
            player.money += resaleValue;
            player.cars_owned = player.cars_owned.filter((c) => c.uniqueId !== data);
            addMessageToLog(t('SOLD_CAR', {carName: carToSell.name_en, price: utils.formatCurrency(resaleValue)}));
        }
    },
    repair_car: (data) => {
        const carToRepair = player.cars_owned.find((c) => c.uniqueId === data);
        if (carToRepair) {
            const healthToRestore = 100 - carToRepair.health;
            if (healthToRestore > 0) {
                const repairCost = Math.round(healthToRestore * 15 + carToRepair.price * 0.01);
                if (player.money >= repairCost) {
                    player.money -= repairCost;
                    carToRepair.health = 100;
                    carToRepair.status = "operational";
                    addMessageToLog(t('REPAIRED_CAR', {carName: carToRepair.name_en, cost: utils.formatCurrency(repairCost)}));
                } else {
                    addMessageToLog(t('CANNOT_AFFORD_REPAIR', {cost: utils.formatCurrency(repairCost)}));
                }
            }
        }
        menus.showCarActionsMenu(carToRepair);
    },
    abandon_car: (data) => {
        const carToAbandon = player.cars_owned.find((c) => c.uniqueId === data);
        if (carToAbandon) {
            player.cars_owned = player.cars_owned.filter((c) => c.uniqueId !== data);
            const message = t('ABANDONED_CAR', {carName: carToAbandon.name_en});
            player.applyStatChange("happiness", -5);
            addMessageToLog(message);
            player.addEventToLog(message);
        }
    },
    do_activity: (data) => {
        if (data && data.key && data.details) {
            activities.doActivity(data.key, data.details);
        } else {
            console.error("Invalid data for do_activity action", data);
            addMessageToLog("Could not perform the selected activity.");
            closeModalWrapper();
        }
    },
    learn_skill_confirm: (data) => {
        const skill_to_learn = data;
        const skill_learn_cost = ACTIVITY_CATEGORIES.EDUCATION_SKILLS.activities.LearnSkill.cost;
        let messageForLog = "";

        if (player.money >= skill_learn_cost && !player.skills.includes(skill_to_learn)) {
            player.money -= skill_learn_cost;
            player.skills.push(skill_to_learn);
            player.applyStatChange("smarts", utils.randint(3, 7));
            player.applyStatChange("happiness", 5);
            messageForLog = t('LEARNED_SKILL', {skillName: skill_to_learn});
        } else if (player.skills.includes(skill_to_learn)) {
            messageForLog = t('ALREADY_KNOW_SKILL', {skillName: skill_to_learn});
        } else {
            messageForLog = t('CANNOT_AFFORD_SKILL', {skillName: skill_to_learn});
        }
        addMessageToLog(messageForLog);
        menus.showActivitiesForCategory("EDUCATION_SKILLS");
    },
    select_major: (data) => {
        player.university_major = data;
        addMessageToLog(t('SELECTED_MAJOR', {majorName: data}));
        closeModalWrapper();
    },
    interact_parent: (data) => {
        const parent_type = data;
        const rel_attr = `relationship_with_${parent_type}`;
        player.applyStatChange(rel_attr, utils.randint(3, 10));
        player.applyStatChange("happiness", utils.randint(1, 3));
        addMessageToLog(t('SPENT_TIME_WITH_PARENT', {parentType: t(parent_type.toUpperCase()), rel: player[rel_attr]}));
        menus.showRelationshipsMenu();
    },
    interact_partner: () => {
        let messageForLog = "";
        if (player.partner && !player.is_married) {
            if (player.happiness > 60 && player.years_with_partner > 0 && player.money > 1000 && Math.random() < 0.6) {
                player.is_married = true;
                player.years_married = 0;
                player.applyStatChange("happiness", 30);
                messageForLog = t('PROPOSAL_ACCEPTED', {partnerName: player.partner.name});
            } else {
                messageForLog = t('PROPOSAL_REJECTED', {partnerName: player.partner.name});
                player.applyStatChange("happiness", -20);
                if (Math.random() < 0.25) {
                    addMessageToLog(t('PARTNER_BROKE_UP_AFTER_PROPOSAL', {partnerName: player.partner.name}), "error");
                    player.partner = null;
                    player.years_with_partner = 0;
                }
            }
        } else if (player.partner && player.is_married) {
            player.applyStatChange("happiness", utils.randint(5, 10));
            messageForLog = t('SPENT_TIME_WITH_SPOUSE', {partnerName: player.partner.name});
        }
        if (messageForLog) addMessageToLog(messageForLog);
        menus.showRelationshipsMenu();
    },
    go_to_activity_date: () => {
        menus.showActivitiesForCategory("SOCIAL");
    },
    try_for_baby: () => {
        let messageForLog = "";
        if (player.is_married && player.partner) {
            if (player.age >= 18 && player.age <= 45 && Math.random() < 0.25) {
                const child_gender = utils.choice(["male", "female"]);
                const child_name = utils.generateRandomName(child_gender);
                const new_child = new Character(child_name, child_gender);
                new_child.age = 0;
                player.children.push(new_child);
                player.applyStatChange("happiness", 30);
                messageForLog = t('HAD_A_BABY', {partnerName: player.partner.name, childName: child_name, childGender: t(child_gender === 'male' ? 'GENDER_MALE_CHILD' : 'GENDER_FEMALE_CHILD')});
            } else {
                messageForLog = t('TRIED_FOR_BABY_FAILED', {partnerName: player.partner.name});
                player.applyStatChange("happiness", -2);
            }
        } else {
            messageForLog = t('CANNOT_TRY_FOR_BABY');
        }
        if (messageForLog) addMessageToLog(messageForLog);
        menus.showRelationshipsMenu();
    },
    interact_child: (data) => {
        if (player.children[data]) {
            addMessageToLog(t('SPENT_TIME_WITH_CHILD', {childName: player.children[data].name}));
            player.applyStatChange("happiness", utils.randint(2, 5));
        }
        menus.showRelationshipsMenu();
    },
    cancel_major_selection: () => {
        closeModalWrapper();
    },
    prison_behave: () => {
        activities.handlePrisonBehave(player);
        closeModalWrapper();
    },
    prison_escape: () => {
        activities.handlePrisonEscape(player);
        closeModalWrapper();
    },
    prison_appeal: (data) => {
        activities.handlePrisonAppeal(player, data);
        closeModalWrapper();
    }
};

export function handleMenuAction(action, data) {
    if (!player && !["toggle_theme", "set_language"].includes(action)) {
      console.error("Player object is null in handleMenuAction.");
      addMessageToLog("Error: Player data not found. Please restart.", "error");
      return;
    }
    try {
        const handler = actionHandlers[action];
        if (typeof handler === 'function') {
            handler(data);
        } else {
            console.warn("Unknown or unimplemented menu action:", action);
            closeModalWrapper();
        }
    } catch (error) {
        console.error("Error in handleMenuAction:", error, "Action:", action, "Data:", data);
        addMessageToLog("An internal error occurred. Please try again.", "error");
        if (ui.genericModalEl.style.display === "flex") {
            closeModalWrapper();
        }
    } finally {
        updateAllUI();
        checkGameOver();
    }
}

function initializeExternalModules() {
  menus.initializeMenus(handleMenuAction, getPlayerInstance, setCurrentMenuType, ui.showToast, setGameState, setTemporaryModalReturnState, closeModalWrapper);
  events.initializeEventsModule(getPlayerInstance, addMessageToLog);
  activities.initializeActivities(getPlayerInstance, addMessageToLog, closeModalWrapper);
  ui.initializeUiModule(() => ({ ACTIVITY_CATEGORIES: ACTIVITY_CATEGORIES, SKILLS_AVAILABLE: SKILLS_AVAILABLE, }));
}

function setupEventListeners() {
  if (ui.genderMaleButton) {
    ui.genderMaleButton.onclick = () => {
      selectedGenderForCreation = "male";
      if (ui.selectedGenderText) ui.selectedGenderText.textContent = t('SELECTED_GENDER_PREFIX') + t('MALE');
      ui.genderMaleButton.classList.add("ring-2", "ring-offset-2", "ring-yellow-400");
      if (ui.genderFemaleButton) ui.genderFemaleButton.classList.remove("ring-2", "ring-offset-2", "ring-yellow-400");
    };
  }
  if (ui.genderFemaleButton) {
    ui.genderFemaleButton.onclick = () => {
      selectedGenderForCreation = "female";
      if (ui.selectedGenderText) ui.selectedGenderText.textContent = t('SELECTED_GENDER_PREFIX') + t('FEMALE');
      ui.genderFemaleButton.classList.add("ring-2", "ring-offset-2", "ring-yellow-400");
      if (ui.genderMaleButton) ui.genderMaleButton.classList.remove("ring-2", "ring-offset-2", "ring-yellow-400");
    };
  }
  if (ui.startLifeButton) ui.startLifeButton.onclick = startGame;
  if (ui.ageUpButton) ui.ageUpButton.onclick = handleAgeUp;
  if (ui.careerButton) ui.careerButton.onclick = menus.showCareerMenu;
  if (ui.assetsButton) ui.assetsButton.onclick = menus.showAssetsMenu;
  
  if (ui.activitiesButton) {
      ui.activitiesButton.onclick = menus.showActivitiesMenu;
  }
  
  if (ui.relationshipsButton) ui.relationshipsButton.onclick = menus.showRelationshipsMenu;
  if (ui.restartButton) ui.restartButton.onclick = resetGameForCreation;

  if (ui.settingsButtonCreation) ui.settingsButtonCreation.onclick = menus.showSettingsMenu;
  if (ui.settingsButtonGame) ui.settingsButtonGame.onclick = menus.showSettingsMenu;

  if (ui.helpButtonCreation) ui.helpButtonCreation.onclick = menus.showHelpMenu;
  if (ui.helpButtonGame) ui.helpButtonGame.onclick = menus.showHelpMenu;


  if (ui.modalCloseButton) {
    ui.modalCloseButton.onclick = () => {
      if (currentMenuType === "major_selection" && player && player.education_level === "University Student" && !player.university_major) {
      }
      closeModalWrapper();
    };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (ui.toastNotificationEl) ui.toastNotificationEl.classList.add("hidden");
  
  initializeSecurity();
  
  applyTheme(currentTheme);
  await initI18n(); 
  
  initializeExternalModules();
  setupEventListeners();
  
  resetGameForCreation();
});