// events.js
import * as utils from "./utils.js";
import { Person } from "./character.js";
// --- NEW: ماژول i18n برای ترجمه اضافه شد ---
import { t } from "./i18n.js";

// Dependencies injected via initializeEventsModule
let player; // Will be a getter function: () => playerObject
let addMessageToLogToGame; // Function to log messages in the main game

/**
 * Initializes the events module with necessary dependencies.
 * @param {function} playerGetter - A function that returns the current player object.
 * @param {function} messageLogger - A function to log messages in the game.
 */
export function initializeEventsModule(playerGetter, messageLogger) {
  player = playerGetter;
  addMessageToLogToGame = messageLogger;
}

// --- Event Functions ---

/**
 * Childhood Illness Event
 * @returns {object | null} Event object or null if the event doesn't occur.
 */
export function eventChildhoodIllness() {
  if (!player || !addMessageToLogToGame || !utils.randint) return null;
  const currentPlayer = player();
  if (
    currentPlayer.age >= 3 &&
    currentPlayer.age <= 10 &&
    Math.random() < 0.15 &&
    currentPlayer.prison_time === 0
  ) {
    const severity = utils.randint(5, 20);
    currentPlayer.applyStatChange("health", -severity);
    currentPlayer.applyStatChange("happiness", -Math.floor(severity / 2));
    // --- UPDATED: Use t() for translation ---
    const msg = t('EVENT_CHILDHOOD_ILLNESS_MSG', { severity: severity });
    addMessageToLogToGame(msg, "event");
    currentPlayer.addEventToLog(msg);
    if (currentPlayer.health < 20) {
      // --- UPDATED: Use t() for translation ---
      const msg2 = t('EVENT_ILLNESS_SERIOUS_MSG');
      addMessageToLogToGame(msg2, "error");
      currentPlayer.addEventToLog(msg2);
    }
    return { type: "simple_event_occurred", message: msg };
  }
  return null;
}

/**
 * Found Money Event
 * @returns {object | null} Event object or null.
 */
export function eventFoundMoney() {
  if (
    !player ||
    !addMessageToLogToGame ||
    !utils.randint ||
    !utils.formatCurrency
  )
    return null;
  const currentPlayer = player();
  if (Math.random() < 0.03 && currentPlayer.prison_time === 0) {
    const amount =
      utils.randint(10, 100) * (Math.floor(currentPlayer.age / 5) + 1);
    currentPlayer.money += amount;
    currentPlayer.applyStatChange("happiness", 5);
    // --- UPDATED: Use t() for translation ---
    const msg = t('EVENT_FOUND_MONEY_MSG', { amount: utils.formatCurrency(amount) });
    addMessageToLogToGame(msg, "event");
    currentPlayer.addEventToLog(msg);
    return { type: "simple_event_occurred", message: msg };
  }
  return null;
}

/**
 * School Bully Event (requires player choice)
 * @returns {object | null} Choice event object or null.
 */
export function eventSchoolBully() {
  if (!player) return null;
  const currentPlayer = player();
  if (
    currentPlayer.in_school &&
    currentPlayer.age >= 6 &&
    currentPlayer.age <= 17 &&
    Math.random() < 0.1 &&
    currentPlayer.prison_time === 0
  ) {
    return {
      type: "choice_event",
      // --- UPDATED: Use t() for translation ---
      title: t('EVENT_BULLY_TITLE'),
      choices: [
        { text: t('EVENT_BULLY_CHOICE_IGNORE'), key: "bully_ignore" },
        { text: t('EVENT_BULLY_CHOICE_CONFRONT'), key: "bully_confront" },
        { text: t('EVENT_BULLY_CHOICE_TELL'), key: "bully_tell_teacher" },
      ],
      handlerKey: "handleSchoolBullyChoice",
    };
  }
  return null;
}

/**
 * Education Progression Event (can require choices)
 * Relies on EDUCATION_HIERARCHY in constants.js being translated to English.
 * @returns {object | null} Event object (simple or choice) or null.
 */
export function eventEducationProgression() {
  if (!player || !addMessageToLogToGame || !utils.randint) return null;
  const currentPlayer = player();
  if (currentPlayer.prison_time > 0) return null;

  let edu_text_log_key = null;

  if (currentPlayer.age === 6 && currentPlayer.education_level === "Uneducated") {
    currentPlayer.education_level = "Elementary School";
    currentPlayer.applyStatChange("smarts", utils.randint(5, 10));
    edu_text_log_key = "EVENT_EDUCATION_ELEMENTARY";
    currentPlayer.in_school = true;
  } else if (currentPlayer.age === 12 && currentPlayer.education_level === "Elementary School") {
    currentPlayer.education_level = "Middle School";
    currentPlayer.applyStatChange("smarts", utils.randint(5, 10));
    edu_text_log_key = "EVENT_EDUCATION_MIDDLE";
    currentPlayer.in_school = true;
  } else if (currentPlayer.age === 15 && currentPlayer.education_level === "Middle School") {
    currentPlayer.education_level = "High School";
    currentPlayer.applyStatChange("smarts", utils.randint(5, 10));
    edu_text_log_key = "EVENT_EDUCATION_HIGH";
    currentPlayer.in_school = true;
  } else if (currentPlayer.age === 18 && currentPlayer.education_level === "High School") {
    currentPlayer.in_school = false;
    return {
      type: "choice_event",
      // --- UPDATED: Use t() for translation ---
      title: t('EVENT_HIGH_SCHOOL_GRAD_TITLE'),
      choices: [
        { text: t('EVENT_CHOICE_YES'), key: "uni_yes" },
        { text: t('EVENT_CHOICE_NO'), key: "uni_no" },
      ],
      handlerKey: "handleUniversityChoice",
    };
  } else if (
    currentPlayer.age === 22 &&
    currentPlayer.education_level === "University Student" &&
    currentPlayer.university_major
  ) {
    currentPlayer.education_level = "Bachelor's Degree";
    currentPlayer.applyStatChange("smarts", utils.randint(10, 20));
    currentPlayer.applyStatChange("happiness", 10);
    const msg = t('EVENT_UNIVERSITY_GRADUATED', { major: currentPlayer.university_major });
    addMessageToLogToGame(msg, "event");
    currentPlayer.addEventToLog(msg);
    currentPlayer.in_school = false;
    return { type: "simple_event_occurred", message: msg };
  }

  if (edu_text_log_key) {
    const translated_msg = t(edu_text_log_key);
    addMessageToLogToGame(translated_msg, "event");
    currentPlayer.addEventToLog(translated_msg);
    return { type: "simple_event_occurred", message: translated_msg };
  }
  return null;
}

/**
 * Job Offer or Promotion Event
 * @returns {object | null} Event object or null.
 */
export function eventJobOfferOrPromotion() {
  if (
    !player ||
    !addMessageToLogToGame ||
    !utils.randint ||
    !utils.formatCurrency
  )
    return null;

  const currentPlayer = player();
  if ((!currentPlayer.job && !currentPlayer.part_time_job) || currentPlayer.prison_time > 0)
    return null;

  let event_msg = null;

  // Full-time job event
  if (currentPlayer.job && Math.random() < 0.08) {
    const job_name_key = `JOB_NAME_${currentPlayer.job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
    const translated_job_name = t(job_name_key);
    
    if (Math.random() < 0.2) {
      // Fired
      event_msg = t('EVENT_JOB_FIRED', { job: translated_job_name });
      addMessageToLogToGame(event_msg, "error");
      currentPlayer.addEventToLog(`Fired from job (${currentPlayer.job}).`);
      currentPlayer.job = null;
      currentPlayer.current_annual_salary = 0;
      currentPlayer.applyStatChange("happiness", -25);
    } else {
      // Promotion/Raise
      const old_salary = currentPlayer.current_annual_salary;
      const increase_percent = Math.random() * (0.25 - 0.05) + 0.05;
      currentPlayer.current_annual_salary = Math.floor(old_salary * (1 + increase_percent));
      currentPlayer.applyStatChange("smarts", utils.randint(1, 3));
      currentPlayer.applyStatChange("happiness", 15);
      event_msg = t('EVENT_JOB_PROMOTION', { job: translated_job_name, salary: utils.formatCurrency(currentPlayer.current_annual_salary) });
      addMessageToLogToGame(event_msg, "event");
      currentPlayer.addEventToLog(event_msg);
    }
    return { type: "simple_event_occurred", message: event_msg };
  }

  // Part-time job event
  if (currentPlayer.part_time_job && Math.random() < 0.06) {
    const job_name_key = `JOB_NAME_${currentPlayer.part_time_job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
    const translated_job_name = t(job_name_key);
    const increase_percent = Math.random() * (0.15 - 0.03) + 0.03;
    currentPlayer.current_part_time_annual_salary = Math.floor(currentPlayer.current_part_time_annual_salary * (1 + increase_percent));
    const new_hourly_approx = currentPlayer.current_part_time_annual_salary / (20 * 52);
    currentPlayer.applyStatChange("happiness", 5);
    event_msg = t('EVENT_JOB_RAISE_PT', { job: translated_job_name, wage: utils.formatCurrency(Math.floor(new_hourly_approx)) });
    addMessageToLogToGame(event_msg, "event");
    currentPlayer.addEventToLog(event_msg);
    return { type: "simple_event_occurred", message: event_msg };
  }
  return null;
}

/**
 * Relationship Milestone Event (marriage, child, breakup)
 * @returns {object | null} Event object or null.
 */
export function eventRelationshipMilestone() {
  if (
    !player ||
    !addMessageToLogToGame ||
    !utils.choice ||
    !utils.generateRandomName ||
    !utils.randint
  )
    return null;

  const currentPlayer = player();
  if (currentPlayer.prison_time > 0) return null;

  let event_msg = null;

  // Chance of having a child if married
  if (
    currentPlayer.is_married &&
    currentPlayer.partner &&
    currentPlayer.age >= 20 &&
    currentPlayer.age <= 45 &&
    currentPlayer.children.length < 4 &&
    Math.random() < 0.12
  ) {
    const child_gender = utils.choice(["male", "female"]);
    const child_name = utils.generateRandomName(child_gender);
    const new_child = new Person(child_name, child_gender, 0);
    currentPlayer.children.push(new_child);
    currentPlayer.applyStatChange("happiness", 25);
    const translated_gender = t(child_gender === 'male' ? 'GENDER_MALE_CHILD' : 'GENDER_FEMALE_CHILD');
    event_msg = t('EVENT_REL_CHILD_BORN', { name: child_name, gender: translated_gender });
    addMessageToLogToGame(event_msg, "event");
    currentPlayer.addEventToLog(event_msg);
    return { type: "simple_event_occurred", message: event_msg };
  }

  // Chance of breakup if in a relationship but not married
  if (
    currentPlayer.partner &&
    !currentPlayer.is_married &&
    currentPlayer.years_with_partner > 1 &&
    Math.random() < 0.05
  ) {
    event_msg = t('EVENT_REL_BREAKUP', { partnerName: currentPlayer.partner.name });
    addMessageToLogToGame(event_msg, "error");
    currentPlayer.addEventToLog(event_msg);
    currentPlayer.partner = null;
    currentPlayer.years_with_partner = 0;
    currentPlayer.years_married = 0;
    currentPlayer.applyStatChange("happiness", -30);
    return { type: "simple_event_occurred", message: event_msg };
  }
  return null;
}