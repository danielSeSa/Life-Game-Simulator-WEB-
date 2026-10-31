// character.js
import {
  randint,
  choice,
  generateRandomName,
  findCarByName,
  formatCurrency,
} from "./utils.js";

import { AVAILABLE_ASSETS } from "./constants.js";
import { t } from "./i18n.js";

export class Person {
  constructor(name, gender, age = 0) {
    this.name = name;
    this.gender = gender;
    this.age = age;
  }
}

export class Character extends Person {
  constructor(name, gender) {
    super(name, gender, 0);
    this.health = randint(70, 100);
    this.happiness = randint(50, 100);
    this.smarts = randint(20, 80);
    this.looks = randint(20, 80);
    this.money = 1000;
    this.alive = true;
    this.job = null;
    this.part_time_job = null;
    this.current_annual_salary = 0;
    this.current_part_time_annual_salary = 0;
    this.education_level = "Uneducated";
    this.university_major = null;
    this.skills = [];
    this.has_drivers_license = false;
    this.cause_of_death = "";
    this.significant_events = [];

    this.properties = [];
    this.cars_owned = [];

    this.in_school = false;
    this.prison_time = 0;
    this.criminal_record = false;

    this.is_homeless = false;
    this.years_in_debt = 0;

    this.parents = {
      father: new Person(
        generateRandomName("male"),
        "male",
        randint(this.age + 20, this.age + 40)
      ),
      mother: new Person(
        generateRandomName("female"),
        "female",
        randint(this.age + 18, this.age + 38)
      ),
    };
    this.relationship_with_father = randint(40, 80);
    this.relationship_with_mother = randint(40, 80);

    this.partner = null;
    this.is_married = false;
    this.children = [];
    this.years_married = 0;
    this.years_with_partner = 0;
  }

  addEventToLog(event_description) {
    const eventEntry = `${t('AGE_LOG_PREFIX', {age: this.age})}: ${event_description}`;
    this.significant_events.push(eventEntry);
    if (this.significant_events.length > 30) {
      this.significant_events.shift();
    }
  }

  can_work_part_time() {
    return (
      this.age >= 14 &&
      this.age < 65 &&
      this.prison_time === 0 &&
      ([
        "Middle School",
        "High School",
        "University Student",
        "Some University",
      ].includes(this.education_level) ||
        this.in_school)
    );
  }

  can_work_full_time() {
    return this.age >= 18 && this.age < 65 && this.prison_time === 0;
  }

  applyStatChange(stat, change) {
    if (typeof this[stat] !== "undefined") {
      this[stat] += change;
      if (
        [
          "health",
          "happiness",
          "smarts",
          "looks",
          "relationship_with_father",
          "relationship_with_mother",
        ].includes(stat)
      ) {
        this[stat] = Math.max(0, Math.min(100, this[stat]));
      }
    }
  }

  age_up() {
    const messagesToLog = [];
    if (!this.alive) return messagesToLog;

    // --- BUG FIX: Aging now happens FIRST, regardless of prison status. ---
    this.age += 1;
    this.addEventToLog(t('LOG_BIRTHDAY'));

    // Age up family members
    if (this.parents.father) this.parents.father.age += 1;
    if (this.parents.mother) this.parents.mother.age += 1;
    if (this.partner) {
        this.partner.age += 1;
        this.years_with_partner += 1;
        if (this.is_married) this.years_married += 1;
    }
    this.children.forEach((child) => (child.age += 1));

    if (this.prison_time > 0) {
      // Logic for when player is in prison
      this.prison_time -= 1;
      this.applyStatChange("happiness", -10);
      this.applyStatChange("health", -2);
      messagesToLog.push({
        text: t('LOG_PRISON_YEAR', { years: this.prison_time }),
        type: "normal",
      });
      if (this.prison_time === 0) {
        messagesToLog.push({
          text: t('LOG_RELEASED_FROM_PRISON'),
          type: "event",
        });
        this.criminal_record = true;
      }
    } else {
      // Logic for when player is NOT in prison
      this.is_homeless = this.age >= 18 && this.properties.length === 0;

      if (this.job) {
        this.money += this.current_annual_salary;
        const job_name_key = `JOB_NAME_${this.job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
        messagesToLog.push({
          text: t('LOG_SALARY', { amount: formatCurrency(this.current_annual_salary), job: t(job_name_key) }),
          type: "normal",
        });
      }
      if (this.part_time_job) {
        this.money += this.current_part_time_annual_salary;
        const job_name_key = `JOB_NAME_${this.part_time_job.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
        messagesToLog.push({
          text: t('LOG_WAGE', { amount: formatCurrency(this.current_part_time_annual_salary), job: t(job_name_key) }),
          type: "normal",
        });
      }

      let total_maintenance_and_rent = 0;
      this.properties.forEach((prop) => {
        if (prop.status === "rented") {
          total_maintenance_and_rent += prop.rent_price;
        } else if (prop.status === "owned") {
          total_maintenance_and_rent += prop.maintenance;
          const healthDecrease = randint(1, 4);
          prop.health = Math.max(0, prop.health - healthDecrease);
          if (prop.health === 0 && prop.status !== 'uninhabitable') {
              prop.status = 'uninhabitable';
              this.applyStatChange("happiness", -20);
              messagesToLog.push({ text: t('LOG_PROP_UNINHABITABLE', { propName: prop.name_en }), type: 'error' });
              this.addEventToLog(`Property became uninhabitable: ${prop.name_en}.`);
          }
          if (prop.health < 30 && prop.status !== 'uninhabitable') {
            messagesToLog.push({
              text: t('LOG_PROP_BAD_CONDITION', { propName: prop.name_en }),
              type: "error",
            });
            this.applyStatChange("happiness", -2);
          }
        }
      });

      this.cars_owned.forEach((car) => {
        if (car && typeof car.maintenance === "number") {
          total_maintenance_and_rent += car.maintenance;
        }
        if (car && typeof car.health === "number") {
          const healthDecrease = randint(2, 6);
          car.health = Math.max(0, car.health - healthDecrease);
          if (car.health === 0 && car.status !== "broken") {
            car.status = "broken";
            messagesToLog.push({
              text: t('LOG_CAR_BROKE_DOWN', { carName: car.name_en }),
              type: "error",
            });
            this.addEventToLog(`Car broken down: ${car.name_en}.`);
          }
        }
      });

      if (total_maintenance_and_rent > 0) {
        this.money -= total_maintenance_and_rent;
        messagesToLog.push({
          text: t('LOG_MAINTENANCE', { amount: formatCurrency(total_maintenance_and_rent) }),
          type: "normal",
        });
      }

      if (this.money < 0) {
          this.years_in_debt += 1;
          messagesToLog.push({ text: t('LOG_IN_DEBT', { years: this.years_in_debt }), type: 'error' });
      } else {
          this.years_in_debt = 0;
      }

      if (this.years_in_debt > 2) {
          this.applyStatChange('happiness', -25);
          if (this.cars_owned.length > 0) {
              this.cars_owned.sort((a, b) => b.price - a.price);
              const repossessedCar = this.cars_owned.shift();
              const debtPayment = Math.round(repossessedCar.price * 0.4);
              this.money += debtPayment;
              messagesToLog.push({ text: t('LOG_CAR_REPOSSESSED', { carName: repossessedCar.name_en, amount: formatCurrency(debtPayment) }), type: 'error' });
              this.addEventToLog(`Car repossessed due to debt: ${repossessedCar.name_en}.`);
              this.years_in_debt = 0;
          } else if (this.properties.find(p => p.status === 'owned')) {
              const propertyToForeclose = this.properties.find(p => p.status === 'owned');
              const debtPayment = Math.round(propertyToForeclose.purchase_price * 0.5);
              this.money += debtPayment;
              this.properties = this.properties.filter(p => p.uniqueId !== propertyToForeclose.uniqueId);
              messagesToLog.push({ text: t('LOG_PROP_FORECLOSED', { propName: propertyToForeclose.name_en, amount: formatCurrency(debtPayment) }), type: 'error' });
              this.addEventToLog(`Property foreclosed due to debt: ${propertyToForeclose.name_en}.`);
              this.years_in_debt = 0;
          }
      }

      if (this.is_homeless) {
          this.applyStatChange("happiness", -10);
          this.applyStatChange("health", -5);
          messagesToLog.push({text: t('LOG_HOMELESS_TOLL'), type: 'error'});
      }

      if (this.age === 18 && this.education_level === "High School") {
         this.in_school = false;
      }
      if (this.age > 22 && this.education_level === "University Student" && !this.university_major && this.in_school) {
        this.education_level = "Some University";
        const msg = t('LOG_DROPPED_OUT_NO_MAJOR');
        messagesToLog.push({ text: msg, type: "event" });
        this.addEventToLog(msg);
        this.in_school = false;
        this.applyStatChange('happiness', -5);
      }

      if (this.age > 50) {
        this.applyStatChange("health", -randint(1, 4));
        this.applyStatChange("happiness", -randint(0, 3));
      }
      if (this.partner && Math.random() < 0.1) {
        this.applyStatChange("happiness", -1);
      }
      this.applyStatChange("relationship_with_father", -randint(0, 2));
      this.applyStatChange("relationship_with_mother", -randint(0, 2));
    }

    let diedThisTurn = false;
    if (this.health <= 0) {
        this.cause_of_death = t('DEATH_POOR_HEALTH');
        diedThisTurn = true;
    } else if (this.age > 100 && Math.random() < 0.25 * (this.age - 99)) {
        this.cause_of_death = t('DEATH_EXTREME_OLD_AGE');
        diedThisTurn = true;
    } else if (this.age > 85 && Math.random() < 0.05 * (this.age - 84)) {
        this.cause_of_death = t('DEATH_OLD_AGE');
        diedThisTurn = true;
    }

    if (diedThisTurn && this.alive) {
      this.alive = false;
      this.addEventToLog(t('LOG_DIED_OF', {cause: this.cause_of_death}));
      messagesToLog.push({ text: t('LOG_DIED_OF', {cause: this.cause_of_death}), type: "error" });
    }

    if (this.alive) {
      this.health = Math.max(0, Math.min(100, this.health));
      this.happiness = Math.max(0, Math.min(100, this.happiness));
      this.smarts = Math.max(0, Math.min(100, this.smarts));
      this.looks = Math.max(0, Math.min(100, this.looks));
    }

    return messagesToLog;
  }

  die(cause) {
    if (this.alive) {
      this.alive = false;
      this.cause_of_death = cause;
      this.addEventToLog(t('LOG_DIED_OF', {cause: cause}));
    }
  }
}