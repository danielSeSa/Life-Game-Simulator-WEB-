// activities.js
// Contains the logic for executing various player activities.

import * as utils from "./utils.js";
import * as menus from "./menus.js";
import { EDUCATION_HIERARCHY } from "./constants.js";
// --- NEW: ماژول i18n برای ترجمه اضافه شد ---
import { t } from "./i18n.js";

// Dependencies from main.js, to be injected
let getPlayer;
let addMessageToLog;
let closeModal;

/**
 * Initializes the activities module with necessary dependencies from main.js.
 * @param {function} playerGetter - A function that returns the current player object.
 * @param {function} messageLogger - A function to log messages in the game.
 * @param {function} closeModalCallback - A function to close any open modal.
 */
export function initializeActivities(
  playerGetter,
  messageLogger,
  closeModalCallback
) {
  getPlayer = playerGetter;
  addMessageToLog = messageLogger;
  closeModal = closeModalCallback;
}

// --- Specific Activity Handlers ---

/**
 * Handles simple activities that have direct effects and costs.
 * @param {object} player - The player character object.
 * @param {object} details - The activity's data from constants.js.
 * @param {string} activityKey - The key of the activity.
 */
function handleSimpleActivity(player, details, activityKey) {
  if (details.effect) {
    Object.entries(details.effect).forEach(([stat, val_change]) => {
      let changeAmount = Array.isArray(val_change)
        ? utils.randint(val_change[0], val_change[1])
        : val_change;
      player.applyStatChange(stat, changeAmount);
    });
  }
  const activity_name_key = `ACTIVITY_${activityKey}`;
  let message = t('ACTIVITY_SIMPLE_SUCCESS', { activityName: t(activity_name_key).toLowerCase() });
  if (details.cost > 0) {
    player.money -= details.cost;
    message += ` ${t('ACTIVITY_COST_MSG', { cost: utils.formatCurrency(details.cost) })}`;
  }
  addMessageToLog(message, "event");
  player.addEventToLog(message);
}

/**
 * Handles the driving test activity.
 * @param {object} player - The player character object.
 * @param {object} details - The activity's data from constants.js.
 */
function handleDrivingTest(player, details) {
  player.money -= details.cost;
  const pass_chance = player.smarts > 30 ? 0.7 : 0.4;
  let message = "";
  if (Math.random() < pass_chance) {
    player.has_drivers_license = true;
    player.skills.push("Driver's License");
    player.applyStatChange("happiness", 15);
    message = t('ACTIVITY_DRIVING_TEST_PASSED', { cost: utils.formatCurrency(details.cost) });
    player.addEventToLog("Obtained driver's license.");
  } else {
    player.applyStatChange("happiness", -10);
    message = t('ACTIVITY_DRIVING_TEST_FAILED', { cost: utils.formatCurrency(details.cost) });
    player.addEventToLog("Failed driving test.");
  }
  addMessageToLog(message, "event");
}

/**
 * Handles higher education applications (Master's, PhD).
 * @param {object} player - The player character object.
 * @param {object} details - The activity's data from constants.js.
 * @param {string} degreeType - "Master's Degree" or "Doctorate (PhD)".
 */
function handleApplyForDegree(player, details, degreeType) {
  player.money -= details.cost;
  let message = "";
  const degree_name_key = `EDU_${degreeType.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
  const translated_degree = t(degree_name_key);
  
  if (player.smarts > 70 && Math.random() < 0.8) {
    player.education_level = degreeType;
    player.in_school = true;
    message = t('ACTIVITY_DEGREE_ACCEPTED', { degree: translated_degree });
    player.addEventToLog(message);
  } else {
    player.applyStatChange("happiness", -5);
    message = t('ACTIVITY_DEGREE_REJECTED', { degree: translated_degree });
    player.addEventToLog(message);
  }
  addMessageToLog(message, "event");
}

/**
 * Handles a simple crime activity.
 * @param {object} player - The player character object.
 * @param {object} details - The activity's data from constants.js.
 * @param {string} activityKey - The key of the activity.
 */
function handleCrime(player, details, activityKey) {
  let successChance = 0.6;
  let potentialGain = 0;
  let jailTime = 0;

  switch (activityKey) {
    case "Shoplift":
    case "CommitPettyCrime":
      successChance = 0.8; potentialGain = utils.randint(20, 100); jailTime = 1;
      break;
    case "Pickpocket":
      successChance = 0.65; potentialGain = utils.randint(50, 300); jailTime = utils.randint(1, 2);
      break;
    case "Burglary":
      successChance = 0.4; potentialGain = utils.randint(1000, 5000); jailTime = utils.randint(2, 5);
      break;
    case "GrandTheftAuto":
      successChance = 0.25; potentialGain = utils.randint(5000, 20000); jailTime = utils.randint(3, 8);
      break;
    case "BankHeist":
      successChance = 0.1; potentialGain = utils.randint(50000, 250000); jailTime = utils.randint(10, 25);
      break;
  }
  successChance += (player.smarts - 50) / 200;

  const activity_name_key = `ACTIVITY_${activityKey}`;
  const translated_activity_name = t(activity_name_key).toLowerCase();
  let message = "";

  if (Math.random() < successChance) {
    player.money += potentialGain;
    player.applyStatChange("happiness", 5);
    message = t('CRIME_SUCCESS', { crimeName: translated_activity_name, amount: utils.formatCurrency(potentialGain) });
  } else {
    player.prison_time += jailTime;
    player.criminal_record = true;
    player.applyStatChange("happiness", -30);
    message = t('CRIME_CAUGHT', { years: jailTime });

    if (player.job) {
      const job_name_key = `JOB_NAME_${player.job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
      addMessageToLog(t('LOST_JOB_ARREST', { jobName: t(job_name_key) }), "error");
      player.job = null;
      player.current_annual_salary = 0;
    }
     if (player.part_time_job) {
      const job_name_key = `JOB_NAME_${player.part_time_job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
      addMessageToLog(t('LOST_JOB_ARREST', { jobName: t(job_name_key) }), "error");
      player.part_time_job = null;
      player.current_part_time_annual_salary = 0;
    }
  }
  addMessageToLog(message, "event");
  player.addEventToLog(message);
}

export function handlePrisonBehave(player) {
    let message = "";
    if (Math.random() < 0.2) {
        const reduction = 1;
        player.prison_time = Math.max(0, player.prison_time - reduction);
        player.applyStatChange('happiness', 10);
        message = t('PRISON_BEHAVE_SUCCESS', { years: reduction });
    } else {
        player.applyStatChange('happiness', 2);
        message = t('PRISON_BEHAVE_FAIL');
    }
    addMessageToLog(message, 'event');
    player.addEventToLog(message);
}

export function handlePrisonEscape(player) {
    let message = "";
    const escapeChance = 0.1 + ((player.smarts - 50) / 100);

    if (Math.random() < escapeChance) {
        player.prison_time = 0;
        player.applyStatChange('happiness', 50);
        message = t('PRISON_ESCAPE_SUCCESS');
    } else {
        const outcome = utils.choice(['caught', 'injured']);
        if (outcome === 'injured') {
            const injury = utils.randint(10, 30);
            player.applyStatChange('health', -injury);
            player.applyStatChange('happiness', -20);
            message = t('PRISON_ESCAPE_INJURED', { damage: injury });
        } else {
            const extraTime = utils.randint(2, 5);
            player.prison_time += extraTime;
            player.applyStatChange('happiness', -30);
            message = t('PRISON_ESCAPE_CAUGHT', { years: extraTime });
        }
    }
    addMessageToLog(message, 'error');
    player.addEventToLog(message);
}

export function handlePrisonAppeal(player, details) {
    player.money -= details.cost;
    let message = "";
    const appealChance = 0.05 + ((player.smarts - 50) / 200);

    if (Math.random() < appealChance) {
        const reduction = Math.ceil(player.prison_time / 2);
        player.prison_time -= reduction;
        player.applyStatChange('happiness', 25);
        message = t('PRISON_APPEAL_SUCCESS', { years: reduction });
    } else {
        player.applyStatChange('happiness', -10);
        message = t('PRISON_APPEAL_FAIL');
    }
    addMessageToLog(message, 'event');
    player.addEventToLog(message);
}


/**
 * The main function to handle any activity action triggered from the menus.
 * It delegates to more specific functions based on the activity key.
 * @param {string} activityKey - The unique key for the activity (e.g., "GoToGym").
 * @param {object} details - The activity's data from constants.js.
 */
export function doActivity(activityKey, details) {
  const player = getPlayer();
  if (!player) return;

  if (!['LearnSkill'].includes(activityKey)) {
      closeModal();
  }

  switch (activityKey) {
    case "GoToGym":
    case "ReadBook":
    case "Meditate":
    case "VisitLibrary":
    case "VisitDoctor":
    case "CosmeticSurgery":
    case "DonateBlood":
    case "WatchTV":
    case "GoClubbing":
    case "GoOnVacation":
    case "FineDining":
    case "AttendConcert":
    case "Volunteer":
      handleSimpleActivity(player, details, activityKey);
      break;
    
    case "TakeDrivingTest":
      handleDrivingTest(player, details);
      break;
    case "LearnSkill":
      menus.showSkillSelectionMenu();
      break;
    case "ApplyMasters":
      handleApplyForDegree(player, details, "Master's Degree");
      break;
    case "ApplyPhD":
      handleApplyForDegree(player, details, "Doctorate (PhD)");
      break;

    case "Shoplift":
    case "Pickpocket":
    case "Burglary":
    case "GrandTheftAuto":
    case "BankHeist":
    case "CommitPettyCrime":
      handleCrime(player, details, activityKey);
      break;

    case "GoOnDate":
      addMessageToLog(t('ACTIVITY_GO_ON_DATE_MSG'), "event");
      if (player.looks > 30 && player.happiness > 25 && Math.random() < 0.5) {
        const partner_gender = player.gender === "male" ? "female" : "male";
        const partner_name = utils.generateRandomName(partner_gender);
        const partner_age = utils.randint(Math.max(18, player.age - 7), player.age + 7);
        player.partner = { name: partner_name, gender: partner_gender, age: partner_age };
        player.years_with_partner = 0;
        player.is_married = false;
        player.applyStatChange("happiness", 20);
        addMessageToLog(t('ACTIVITY_DATE_SUCCESS', { partnerName: partner_name }), "event");
      } else {
        addMessageToLog(t('ACTIVITY_DATE_FAIL'), "event");
        player.applyStatChange("happiness", -5);
      }
      break;

    default:
      addMessageToLog(t('ACTIVITY_NOT_IMPLEMENTED', { activityName: details.name_en }), "error");
      console.warn("Unimplemented activity:", activityKey);
      break;
  }
}