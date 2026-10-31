// utils.js
import {
  MALE_NAMES,          // Expected to be an array of English male names
  FEMALE_NAMES,        // Expected to be an array of English female names
  LAST_NAMES,          // Expected to be an array of English last names
  EDUCATION_HIERARCHY, // Expected to be an array of English education level strings
  AVAILABLE_ASSETS,    // Expected to have English asset names (e.g., asset.name_en)
} from "./constants.js"; // Ensure this path is correct and constants.js is translated

/**
 * Generates a random integer between min and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer.
 */
export function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects a random element from an array.
 * @param {Array<any>} arr - The array to choose from.
 * @returns {any | null} A random element from the array, or null if the array is empty.
 */
export function choice(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Formats a number as currency in USD.
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string (e.g., "$1,234.56").
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    // console.warn("formatCurrency called with non-numeric value:", amount);
    amount = Number(amount) || 0; // Try to convert, default to 0 if NaN
  }
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // No cents for simplicity, or use 2 for cents
    maximumFractionDigits: 0,
  });
}

/**
 * Generates a random full name based on gender using English name lists.
 * @param {'male' | 'female'} gender - The gender for the name.
 * @returns {string} A randomly generated full English name.
 */
export function generateRandomName(gender) {
  // Assumes MALE_NAMES, FEMALE_NAMES, LAST_NAMES from constants.js are English
  const firstName =
    gender === "male" ? choice(MALE_NAMES) : choice(FEMALE_NAMES);
  const lastName = choice(LAST_NAMES);
  return `${firstName} ${lastName}`;
}

/**
 * Checks if a character's education level meets a required education level.
 * Assumes education levels are English strings from EDUCATION_HIERARCHY.
 * @param {string} characterEducation - The character's current education level (English).
 * @param {string} requiredEducation - The required education level (English).
 * @returns {boolean} True if the character meets the requirement, false otherwise.
 */
export function checkEducationRequirement(
  characterEducation,
  requiredEducation
) {
  try {
    // EDUCATION_HIERARCHY from constants.js is expected to be an array of English education levels
    const charEduIndex = EDUCATION_HIERARCHY.indexOf(characterEducation);
    const reqEduIndex = EDUCATION_HIERARCHY.indexOf(requiredEducation);

    if (charEduIndex === -1) {
      console.warn(
        `Character education level '${characterEducation}' not found in hierarchy.`
      );
      return false;
    }
    if (reqEduIndex === -1) {
      console.warn(
        `Required education level '${requiredEducation}' not found in hierarchy.`
      );
      return false; // Or throw an error, as this might indicate a data setup issue
    }
    return charEduIndex >= reqEduIndex;
  } catch (e) {
    console.error(
      "Error in checkEducationRequirement:",
      e,
      characterEducation,
      requiredEducation
    );
    return false;
  }
}

/**
 * Finds a car's data from AVAILABLE_ASSETS by its English name.
 * Assumes AVAILABLE_ASSETS.Cars is an object where keys are English brand names (or "General"),
 * and each car object within has a 'name_en' property.
 * @param {string} car_name_en - The English name of the car to find.
 * @returns {object | null} The car data object if found, otherwise null.
 */
export function findCarByName(car_name_en) {
  if (!AVAILABLE_ASSETS || !AVAILABLE_ASSETS.Cars) {
    console.error("AVAILABLE_ASSETS.Cars is not defined in findCarByName");
    return null;
  }
  // Iterate over each brand in the Cars object
  for (const brand_en in AVAILABLE_ASSETS.Cars) { // brand_en is the English brand key
    if (Object.prototype.hasOwnProperty.call(AVAILABLE_ASSETS.Cars, brand_en)) {
      const car_list = AVAILABLE_ASSETS.Cars[brand_en]; // Array of cars for that brand
      if (Array.isArray(car_list)) {
        // Find the car by its English name (name_en)
        const found_car = car_list.find((car) => car && car.name_en === car_name_en);
        if (found_car) {
          return found_car; // Return the car object if found
        }
      }
    }
  }
  // console.warn(`Car with English name '${car_name_en}' not found.`);
  return null; // Return null if the car is not found
}