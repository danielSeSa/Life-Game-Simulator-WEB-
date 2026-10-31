// menus.js
import {
  AVAILABLE_ASSETS,
  POSSIBLE_JOBS,
  EDUCATION_HIERARCHY,
  UNIVERSITY_MAJORS,
  SKILLS_AVAILABLE,
  ACTIVITY_CATEGORIES,
} from "./constants.js";

import {
  checkEducationRequirement,
  formatCurrency,
  randint,
  choice,
} from "./utils.js";

import { openModal as uiOpenModal, showConfirmationDialog } from "./ui.js";
import { t, getAvailableLanguages, getLang } from "./i18n.js";

// Dependencies injected from the main game file (main.js)
let handleMenuAction;
let getPlayer;
let setCurrentMenuType;
let showToast;
let setGameState;
let setTemporaryModalReturnState;
let mainCloseModal;

export function initializeMenus(
  actionHandler,
  playerInstanceGetter,
  menuTypeSetter,
  toastFunction,
  gameStateSetter,
  tempModalReturnStateSetter,
  closeModalFunction
) {
  handleMenuAction = actionHandler;
  getPlayer = playerInstanceGetter;
  setCurrentMenuType = menuTypeSetter;
  showToast = toastFunction;
  setGameState = gameStateSetter;
  setTemporaryModalReturnState = tempModalReturnStateSetter;
  mainCloseModal = closeModalFunction;
}

function openModal(
  title,
  bodyContentGenerator,
  returnToStateOnClose,
  backButtonAction = null,
  customFooterGenerator = null
) {
  if (!mainCloseModal) {
    console.error(
      "mainCloseModal is not initialized in menus.js. Cannot open modal."
    );
    return;
  }
  const effectiveBackButtonAction = backButtonAction || mainCloseModal;

  uiOpenModal(
    title,
    bodyContentGenerator,
    returnToStateOnClose,
    effectiveBackButtonAction,
    customFooterGenerator,
    setGameState,
    setTemporaryModalReturnState
  );
}

/**
 * --- NEW: Displays the help/guide menu. ---
 */
export function showHelpMenu() {
    if (!setCurrentMenuType || !getPlayer) return;
    const player = getPlayer();
    const returnState = player ? "playing" : "character_creation";
    setCurrentMenuType("help_menu");

    openModal(
        t('HELP_TITLE'),
        (bodyEl) => {
            bodyEl.innerHTML = `
                <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-1">${t('HELP_GOAL_TITLE')}</h4>
                        <p>${t('HELP_GOAL_TEXT')}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-1">${t('HELP_HOW_TO_PLAY_TITLE')}</h4>
                        <p>${t('HELP_HOW_TO_PLAY_TEXT')}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-1">${t('HELP_WHAT_TO_DO_TITLE')}</h4>
                        <ul class="list-disc list-inside space-y-1">
                            <li>${t('HELP_WHAT_TO_DO_ITEM_1')}</li>
                            <li>${t('HELP_WHAT_TO_DO_ITEM_2')}</li>
                            <li>${t('HELP_WHAT_TO_DO_ITEM_3')}</li>
                            <li>${t('HELP_WHAT_TO_DO_ITEM_4')}</li>
                        </ul>
                    </div>
                </div>
            `;
        },
        returnState,
        mainCloseModal
    );
}


export function showSettingsMenu() {
    if (!setCurrentMenuType || !handleMenuAction || !getPlayer) return;
    const player = getPlayer();
    const returnState = player ? "playing" : "character_creation";
    setCurrentMenuType("settings_menu");

    openModal(
        t('SETTINGS_TITLE'),
        (bodyEl) => {
            const displayHeader = document.createElement("h4");
            displayHeader.textContent = t('SETTINGS_SECTION_DISPLAY');
            displayHeader.className = "text-lg font-semibold mb-2 text-gray-800 dark:text-white border-b pb-1 border-gray-300 dark:border-gray-600";
            bodyEl.appendChild(displayHeader);

            const themeButton = document.createElement("button");
            themeButton.textContent = t('SETTINGS_TOGGLE_THEME');
            themeButton.className = "w-full button-primary bg-purple-500 hover:bg-purple-600 py-2 text-sm mb-4";
            themeButton.onclick = () => handleMenuAction("toggle_theme", null);
            bodyEl.appendChild(themeButton);

            const langHeader = document.createElement("h4");
            langHeader.textContent = t('SETTINGS_SECTION_LANGUAGE');
            langHeader.className = "text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-white border-b pb-1 border-gray-300 dark:border-gray-600";
            bodyEl.appendChild(langHeader);
            
            const languages = getAvailableLanguages();
            const currentLang = getLang();
            const langButtonsContainer = document.createElement('div');
            langButtonsContainer.className = 'grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4';

            for (const langCode in languages) {
                const langName = languages[langCode];
                const langButton = document.createElement("button");
                langButton.textContent = langName;
                langButton.className = "w-full button-primary py-2 text-xs";
                
                if(langCode === currentLang) {
                    langButton.classList.add("bg-green-600", "dark:bg-green-700", "ring-2", "ring-yellow-400");
                    langButton.disabled = true;
                } else {
                    langButton.classList.add("bg-blue-500", "hover:bg-blue-600", "dark:bg-blue-600", "dark:hover:bg-blue-700");
                }
                
                langButton.onclick = () => handleMenuAction("set_language", langCode);
                langButtonsContainer.appendChild(langButton);
            }
            bodyEl.appendChild(langButtonsContainer);

            const aboutHeader = document.createElement("h4");
            aboutHeader.textContent = t('SETTINGS_SECTION_ABOUT');
            aboutHeader.className = "text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-white border-b pb-1 border-gray-300 dark:border-gray-600";
            bodyEl.appendChild(aboutHeader);

            const developedBy = document.createElement('p');
            developedBy.className = 'text-center text-sm text-gray-600 dark:text-gray-400';
            developedBy.textContent = t('DEVELOPED_BY');
            bodyEl.appendChild(developedBy);

            const githubLink = document.createElement('a');
            githubLink.href = 'https://github.com/danielSeSa';
            githubLink.textContent = t('GITHUB_PROFILE');
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.className = 'block text-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-1 text-sm underline';
            bodyEl.appendChild(githubLink);

            const WebsiteLink = document.createElement('a');
            WebsiteLink.href = 'https://www.danielseyedsaadat.com/';
            WebsiteLink.textContent = t('Website');
            WebsiteLink.target = '_blank';
            WebsiteLink.rel = 'noopener noreferrer';
            WebsiteLink.className = 'block text-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-1 text-sm underline';
            bodyEl.appendChild(WebsiteLink);
        },
        returnState,
        mainCloseModal
    );
}

export function showCareerMenu() {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType("career_menu");
  const player = getPlayer();
  if (!player) return;

  const baseItems = [
    {
      id: "pt_job",
      textKey: 'CAREER_MENU_PART_TIME',
      action: "job_type_select",
      data: "part_time",
      condition: () => player.can_work_part_time(),
      disabledTextKey: 'CAREER_MENU_INELIGIBLE',
      alreadyHaveTextKey: 'CAREER_MENU_ALREADY_HAVE',
      checkAlreadyHave: () => player.part_time_job,
    },
    {
      id: "ft_no_degree_job",
      textKey: 'CAREER_MENU_FULL_TIME_NO_DEGREE',
      action: "job_type_select",
      data: "full_time_no_degree",
      condition: () => player.can_work_full_time(),
      disabledTextKey: 'CAREER_MENU_INELIGIBLE',
      alreadyHaveTextKey: 'CAREER_MENU_ALREADY_HAVE',
      checkAlreadyHave: () => player.job,
    },
    {
      id: "ft_degree_job",
      textKey: 'CAREER_MENU_FULL_TIME_DEGREE',
      action: "job_type_select",
      data: "full_time_degree",
      condition: () =>
        player.can_work_full_time() &&
        EDUCATION_HIERARCHY.indexOf(player.education_level) >=
          EDUCATION_HIERARCHY.indexOf("Bachelor's Degree"),
      disabledTextKey: 'CAREER_MENU_REQ_DEGREE',
      alreadyHaveTextKey: 'CAREER_MENU_ALREADY_HAVE',
      checkAlreadyHave: () => player.job,
    },
    {
      id: "resign",
      textKey: 'CAREER_MENU_RESIGN',
      action: "resign_job",
      data: null,
      condition: () => player.job || player.part_time_job,
      disabledTextKey: 'CAREER_MENU_NO_JOB',
    },
  ];

  openModal(
    t('MENU_TITLE_CAREER'),
    (bodyEl) => {
      baseItems.forEach((item) => {
        const button = document.createElement("button");
        let currentText = t(item.textKey);
        let isDisabled = false;

        if (
          typeof item.checkAlreadyHave === "function" &&
          item.checkAlreadyHave()
        ) {
          isDisabled = true;
          if (item.alreadyHaveTextKey) currentText += ` (${t(item.alreadyHaveTextKey)})`;
        } else if (typeof item.condition === "function" && !item.condition()) {
          isDisabled = true;
          if (item.disabledTextKey) currentText += ` (${t(item.disabledTextKey)})`;
        }

        button.textContent = currentText;
        button.className = "w-full button-primary py-2 text-sm mb-2";
        if (isDisabled) {
          button.classList.add("button-disabled");
          button.disabled = true;
        }
        button.onclick = () => handleMenuAction(item.action, item.data);
        bodyEl.appendChild(button);
      });
    },
    "playing"
  );
}

export function showJobListingMenu(jobTypeFilter) {
    if (!getPlayer || !setCurrentMenuType) return;
    setCurrentMenuType(`job_listing_${jobTypeFilter}`);
    const player = getPlayer();
    if (!player) return;

    let title_key = "MENU_TITLE_AVAILABLE_JOBS";
    if (jobTypeFilter === "part_time") title_key = "MENU_TITLE_AVAILABLE_PT_JOBS";
    else if (jobTypeFilter === "full_time_no_degree") title_key = "MENU_TITLE_AVAILABLE_FT_NODEGREE_JOBS";
    else if (jobTypeFilter === "full_time_degree") title_key = "MENU_TITLE_AVAILABLE_FT_DEGREE_JOBS";

    openModal(
        t(title_key),
        (bodyEl) => {
            let jobsFound = false;
            Object.entries(POSSIBLE_JOBS).forEach(([job_key_original, details]) => {
                if (details.type === jobTypeFilter) {
                    jobsFound = true;
                    let eligible = true;
                    const req_text_parts = [];
                    const job_name_key = `JOB_NAME_${details.name_en.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;

                    if (player.smarts < details.smarts_req) {
                        req_text_parts.push(`${t('STAT_SMARTS')} ${details.smarts_req}+`);
                        eligible = false;
                    }
                    if (!checkEducationRequirement(player.education_level, details.edu_req)) {
                        const edu_name_key = `EDU_${details.edu_req.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
                        req_text_parts.push(`${t('PLAYER_EDUCATION_PREFIX')} ${t(edu_name_key)}`);
                        eligible = false;
                    }
                    if (player.age < (details.age_min || 0) || player.age > (details.age_max || 150)) {
                        req_text_parts.push(t('REQ_AGE_RANGE', {min: (details.age_min || 0), max: (details.age_max || 150)}));
                        eligible = false;
                    }
                    if (jobTypeFilter === "part_time" && !player.can_work_part_time()) eligible = false;
                    if (jobTypeFilter !== "part_time" && !player.can_work_full_time()) eligible = false;
                    if ((jobTypeFilter === "part_time" && player.part_time_job) || (jobTypeFilter !== "part_time" && player.job)) {
                        eligible = false;
                    }

                    let pay_text = `${formatCurrency(details.salary_range[0])} - ${formatCurrency(details.salary_range[1])}`;
                    pay_text += details.hourly ? ` (${t('JOB_HOURLY')})` : ` (${t('JOB_ANNUAL')})`;
                    
                    let job_display_text = `${t(job_name_key)} (${pay_text})`;

                    if (!eligible) {
                        if (req_text_parts.length > 0) {
                            job_display_text += ` (${t('JOB_REQUIRES')}: ${req_text_parts.join(", ")})`;
                        } else if ((jobTypeFilter === "part_time" && player.part_time_job) || (jobTypeFilter !== "part_time" && player.job)) {
                            job_display_text += ` (${t('JOB_ALREADY_HAVE_CATEGORY')})`;
                        } else {
                            job_display_text += ` (${t('JOB_INELIGIBLE')})`;
                        }
                    }

                    const button = document.createElement("button");
                    button.textContent = job_display_text;
                    button.className = `w-full button-primary py-2 text-xs text-left mb-1 ${ eligible ? "" : "button-disabled" }`;
                    button.disabled = !eligible;
                    button.onclick = () => handleMenuAction("apply_job", { name_en: details.name_en, details: details, eligible: eligible });
                    bodyEl.appendChild(button);
                }
            });
            if (!jobsFound) {
                bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('NO_JOBS_AVAILABLE')}</p>`;
            }
        },
        "playing",
        showCareerMenu
    );
}

export function showAssetsMenu() {
    if (!getPlayer || !setCurrentMenuType) return;
    setCurrentMenuType("assets_menu");

    const items = [
        { textKey: 'ASSETS_MENU_BUY_HOUSE', action: "show_housing_market" },
        { textKey: 'ASSETS_MENU_BUY_CAR', action: "show_car_market" },
        { textKey: 'ASSETS_MENU_MY_ASSETS', action: "show_my_assets" },
    ];

    openModal(
        t('MENU_TITLE_ASSETS'),
        (bodyEl) => {
            items.forEach((item) => {
                const button = document.createElement("button");
                button.textContent = t(item.textKey);
                button.className = "w-full button-primary py-2 text-sm mb-2";
                button.onclick = () => {
                    if (item.action === "show_housing_market") showHousingMarketMenu();
                    if (item.action === "show_car_market") showCarPurchaseOptions();
                    if (item.action === "show_my_assets") showMyAssetsMenu();
                };
                bodyEl.appendChild(button);
            });
        },
        "playing"
    );
}

export function showHousingMarketMenu() {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType("housing_market");
  const player = getPlayer();
  if (!player) return;

  openModal(
    t('MENU_TITLE_REAL_ESTATE'),
    (bodyEl) => {
      AVAILABLE_ASSETS.Houses.forEach((prop) => {
        const propDiv = document.createElement("div");
        propDiv.className = "p-3 mb-2 border border-gray-200 dark:border-gray-700 rounded-lg";
        
        const nameEl = document.createElement("p");
        nameEl.textContent = prop.name_en;
        nameEl.className = "font-semibold text-gray-900 dark:text-white";
        propDiv.appendChild(nameEl);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex space-x-2 mt-2";

        if (prop.type === "rent" || prop.type === "both") {
          const rentButton = document.createElement("button");
          const canAffordRent = player.money >= prop.rent_price;
          rentButton.textContent = `${t('RENT_BUTTON')} (${formatCurrency(prop.rent_price)}/${t('PER_YEAR')})`;
          rentButton.className = `flex-1 button-primary text-xs py-1 ${canAffordRent ? "bg-green-500" : "button-disabled"}`;
          rentButton.disabled = !canAffordRent;
          rentButton.onclick = () => handleMenuAction("rent_property", { item: prop });
          buttonContainer.appendChild(rentButton);
        }

        if (prop.type === "purchase" || prop.type === "both") {
          const buyButton = document.createElement("button");
          const canAffordBuy = player.money >= prop.purchase_price;
          buyButton.textContent = `${t('BUY_BUTTON')} (${formatCurrency(prop.purchase_price)})`;
          buyButton.className = `flex-1 button-primary text-xs py-1 ${canAffordBuy ? "bg-blue-500" : "button-disabled"}`;
          buyButton.disabled = !canAffordBuy;
          buyButton.onclick = () => handleMenuAction("buy_property", { item: prop });
          buttonContainer.appendChild(buyButton);
        }
        propDiv.appendChild(buttonContainer);
        bodyEl.appendChild(propDiv);
      });
    },
    "playing",
    showAssetsMenu
  );
}

export function showMyAssetsMenu() {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType("my_assets_menu");
  const player = getPlayer();
  if (!player) return;

  openModal(
    t('MENU_TITLE_MY_ASSETS'),
    (bodyEl) => {
      const docsHeader = document.createElement("h4");
      docsHeader.textContent = t('MY_ASSETS_SECTION_DOCS');
      docsHeader.className = "text-lg font-semibold mb-2 text-gray-800 dark:text-white border-b pb-1 border-gray-300 dark:border-gray-600";
      bodyEl.appendChild(docsHeader);

      const licenseEl = document.createElement("p");
      const licenseStatus = player.has_drivers_license ? t('YES') : t('NO');
      licenseEl.innerHTML = `${t('MY_ASSETS_DRIVERS_LICENSE')}: <span class="${player.has_drivers_license ? "text-green-600" : "text-red-600"}">${licenseStatus}</span>`;
      licenseEl.className = "text-sm text-gray-700 dark:text-gray-300";
      bodyEl.appendChild(licenseEl);

      const educationEl = document.createElement("p");
      const edu_name_key = `EDU_${player.education_level.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
      educationEl.textContent = `${t('PLAYER_EDUCATION_PREFIX')} ${t(edu_name_key)}`;
      educationEl.className = "text-sm text-gray-700 dark:text-gray-300 mb-4";
      bodyEl.appendChild(educationEl);

      const propsHeader = document.createElement("h4");
      propsHeader.textContent = t('MY_ASSETS_SECTION_PROPERTIES');
      propsHeader.className = "text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-white border-b pb-1 border-gray-300 dark:border-gray-600";
      bodyEl.appendChild(propsHeader);

      if (player.properties.length === 0) {
        bodyEl.insertAdjacentHTML("beforeend", `<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${t('MY_ASSETS_NO_PROPERTIES')}</p>`);
      } else {
        player.properties.forEach((prop) => {
          const propDiv = document.createElement("div");
          propDiv.className = "p-3 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700";
          const nameEl = document.createElement("p");
          nameEl.className = "font-semibold text-gray-900 dark:text-white";
          nameEl.textContent = prop.name_en;
          const statusEl = document.createElement("p");
          statusEl.className = "text-sm text-gray-600 dark:text-gray-300";
          const healthColor = prop.health > 60 ? "text-green-600 dark:text-green-400" : prop.health > 30 ? "text-yellow-500 dark:text-yellow-400" : "text-red-600 dark:text-red-400";
          if (prop.status === "owned" || prop.status === 'uninhabitable') {
              statusEl.innerHTML = `${t('MY_ASSETS_PROP_STATUS_OWNED')} <br> ${t('STAT_HEALTH')}: <span class="${healthColor}">${prop.health}%</span>`;
              if (prop.status === 'uninhabitable') {
                  statusEl.innerHTML += ` <span class="text-red-500 font-bold">(${t('MY_ASSETS_PROP_UNINHABITABLE')})</span>`;
              }
          } else {
            statusEl.innerHTML = t('MY_ASSETS_PROP_STATUS_RENTED');
          }
          const manageButton = document.createElement("button");
          manageButton.textContent = t('MANAGE_BUTTON');
          manageButton.className = "button-primary text-xs py-1 px-2 mt-2 bg-blue-500 hover:bg-blue-600";
          manageButton.onclick = () => showPropertyActionsMenu(prop);
          propDiv.appendChild(nameEl);
          propDiv.appendChild(statusEl);
          propDiv.appendChild(manageButton);
          bodyEl.appendChild(propDiv);
        });
      }

      const carsHeader = document.createElement("h4");
      carsHeader.textContent = t('MY_ASSETS_SECTION_VEHICLES');
      carsHeader.className = "text-lg font-semibold mb-2 mt-4 text-gray-800 dark:text-white border-b pb-1 border-gray-300 dark:border-gray-600";
      bodyEl.appendChild(carsHeader);

      if (player.cars_owned.length === 0) {
        bodyEl.insertAdjacentHTML("beforeend", `<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${t('MY_ASSETS_NO_VEHICLES')}</p>`);
      } else {
        player.cars_owned.forEach((car) => {
            const carDiv = document.createElement("div");
            carDiv.className = "p-3 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700";
            const healthColor = car.health > 60 ? "text-green-600 dark:text-green-400" : car.health > 30 ? "text-yellow-500 dark:text-yellow-400" : "text-red-600 dark:text-red-400";
            const nameEl = document.createElement("p");
            nameEl.className = "font-semibold text-gray-900 dark:text-white";
            nameEl.textContent = car.name_en;
            const statusEl = document.createElement("p");
            statusEl.className = "text-sm text-gray-600 dark:text-gray-300";
            statusEl.innerHTML = `${t('STAT_HEALTH')}: <span class="${healthColor}">${car.health}%</span>`;
            const manageButton = document.createElement("button");
            manageButton.textContent = t('MANAGE_BUTTON');
            manageButton.className = "button-primary text-xs py-1 px-2 mt-2 bg-blue-500 hover:bg-blue-600";
            manageButton.onclick = () => showCarActionsMenu(car);
            carDiv.appendChild(nameEl);
            carDiv.appendChild(statusEl);
            carDiv.appendChild(manageButton);
            bodyEl.appendChild(carDiv);
        });
      }
    },
    "playing",
    showAssetsMenu
  );
}

export function showPropertyActionsMenu(propertyObject) {
  if (!getPlayer || !setCurrentMenuType || !propertyObject) return;
  setCurrentMenuType(`property_actions_${propertyObject.uniqueId}`);

  openModal(
    t('MANAGE_PROPERTY_TITLE', { propName: propertyObject.name_en }),
    (bodyEl) => {
      if (propertyObject.status === "owned" || propertyObject.status === "uninhabitable") {
        const sellButton = document.createElement("button");
        sellButton.textContent = t('SELL_PROPERTY_BUTTON');
        sellButton.className = "w-full button-primary py-2 text-sm mb-2";
        sellButton.onclick = () => {
            handleMenuAction("sell_property", propertyObject.uniqueId);
            showMyAssetsMenu();
        };
        bodyEl.appendChild(sellButton);

        const repairButton = document.createElement("button");
        const healthToRestore = 100 - propertyObject.health;
        const repairCost = Math.round(healthToRestore * 20 + propertyObject.purchase_price * 0.005);
        repairButton.textContent = `${t('REPAIR_PROPERTY_BUTTON')} (${formatCurrency(repairCost)})`;
        repairButton.className = "w-full button-primary py-2 text-sm mb-2";
        if (propertyObject.health === 100) {
          repairButton.disabled = true;
          repairButton.classList.add("button-disabled");
        }
        repairButton.onclick = () => handleMenuAction("repair_property", propertyObject.uniqueId);
        bodyEl.appendChild(repairButton);

      } else if (propertyObject.status === "rented") {
        const endRentalButton = document.createElement("button");
        endRentalButton.textContent = t('END_RENTAL_BUTTON');
        endRentalButton.className = "w-full button-primary button-danger py-2 text-sm mb-2";
        endRentalButton.onclick = () => {
            showConfirmationDialog(
                t('CONFIRM_END_RENTAL_TITLE'),
                t('CONFIRM_END_RENTAL_MSG'),
                () => {
                    handleMenuAction("end_rental", propertyObject.uniqueId);
                    showMyAssetsMenu();
                }
            );
        };
        bodyEl.appendChild(endRentalButton);
      }
    },
    "playing",
    showMyAssetsMenu
  );
}

export function showCarPurchaseOptions() {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType("car_purchase_options");
  const player = getPlayer();
  if (!player) return;

  if (player.age < 18) {
    showToast(t('TOAST_CAR_TOO_YOUNG'));
    showAssetsMenu();
    return;
  }
  if (!player.has_drivers_license) {
    showToast(t('TOAST_CAR_NO_LICENSE'));
    showAssetsMenu();
    return;
  }

  const items = [
    { textKey: "CAR_MARKET_DEALERSHIP", action: "select_car_category", data: "Cars" },
    { textKey: "CAR_MARKET_USED_LOT", action: "show_used_car_listing", data: "showroom" },
  ];

  openModal(
    t('MENU_TITLE_CAR_MARKET'),
    (bodyEl) => {
      items.forEach((item) => {
        const button = document.createElement("button");
        button.textContent = t(item.textKey);
        button.className = "w-full button-primary py-2 text-sm mb-2";
        if (item.action === "show_used_car_listing") {
          button.onclick = () => showUsedCarListing(item.data);
        } else {
          button.onclick = () => handleMenuAction(item.action, item.data);
        }
        bodyEl.appendChild(button);
      });
    },
    "playing",
    showAssetsMenu
  );
}

export function showCarBrandSelectionMenu() {
  if (!setCurrentMenuType) return;
  setCurrentMenuType("car_brand_selection");
  openModal(
    t('MENU_TITLE_CAR_BRANDS'),
    (bodyEl) => {
      const brandKeys = Object.keys(AVAILABLE_ASSETS.Cars);
      if (brandKeys.length === 0) {
        bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('NO_CAR_BRANDS_AVAILABLE')}</p>`;
        return;
      }
      brandKeys.forEach((brandKey) => {
        const brandData = AVAILABLE_ASSETS.Cars[brandKey];
        const button = document.createElement("button");
        button.className = "w-full button-primary py-2 text-sm mb-2 flex items-center justify-center space-x-2";
        if (brandData && brandData.logo_url) {
          const logoImg = document.createElement("img");
          logoImg.src = brandData.logo_url;
          logoImg.alt = `${brandKey} Logo`;
          logoImg.className = "h-6 w-6 object-contain";
          if (brandData.logo_url.includes(".svg")) {
            logoImg.style.filter = document.documentElement.classList.contains("dark") ? "invert(1)" : "invert(0)";
          }
          button.appendChild(logoImg);
        }
        const nameSpan = document.createElement("span");
        nameSpan.textContent = brandKey;
        button.appendChild(nameSpan);
        button.onclick = () => handleMenuAction("select_car_brand", brandKey);
        bodyEl.appendChild(button);
      });
    },
    "playing",
    showCarPurchaseOptions
  );
}

export function showAssetListingMenu(assetCategory, brandName = null) {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType(`asset_listing_${assetCategory}${brandName ? `_${brandName}` : ""}`);
  const player = getPlayer();
  if (!player) return;

  let title = "";
  let itemsToList = [];
  let backFunction = showCarPurchaseOptions;
  let canBuyCategory = true;

  if (assetCategory === "Cars") {
    if (player.age < 18 || !player.has_drivers_license) canBuyCategory = false;
    if (brandName && AVAILABLE_ASSETS.Cars[brandName]) {
      const brandData = AVAILABLE_ASSETS.Cars[brandName];
      if (brandData && Array.isArray(brandData.cars)) {
        itemsToList = brandData.cars;
      }
      title = t('MENU_TITLE_BRAND_CARS', { brand: brandName });
      backFunction = showCarBrandSelectionMenu;
    }
  } else {
    console.error("Invalid assetCategory in showAssetListingMenu:", assetCategory);
    return;
  }

  openModal(
    title,
    (bodyEl) => {
      if (!canBuyCategory) {
        bodyEl.innerHTML = `<p class="text-center text-red-500">${t('TOAST_CAR_NO_LICENSE')}</p>`;
        return;
      }
      if (!itemsToList || itemsToList.length === 0) {
        bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('NO_CARS_IN_BRAND')}</p>`;
        return;
      }
      itemsToList.forEach((item) => {
        const can_afford = player.money >= item.price;
        let displayText = `${item.name_en} - ${formatCurrency(item.price)}`;
        if (!can_afford) displayText += ` (${t('TOO_EXPENSIVE')})`;

        const button = document.createElement("button");
        button.textContent = displayText;
        button.className = `w-full button-primary py-2 text-xs text-left mb-1 ${can_afford ? "" : "button-disabled"}`;
        button.disabled = !can_afford;
        button.onclick = () => handleMenuAction("buy_asset", { type: assetCategory, item: item });
        bodyEl.appendChild(button);
      });
    },
    "playing",
    backFunction
  );
}

export function showUsedCarListing(source) {
  if (!getPlayer || !setCurrentMenuType) return;
  const player = getPlayer();
  if (!player || player.age < 18 || !player.has_drivers_license) {
    showToast(t('TOAST_CAR_NO_LICENSE'));
    showCarPurchaseOptions();
    return;
  }
  setCurrentMenuType(`used_car_listing_${source}`);
  const title = t('MENU_TITLE_USED_CARS');
  openModal(
    title,
    (bodyEl) => {
      const allCarTemplates = Object.values(AVAILABLE_ASSETS.Cars).map((b) => b.cars).flat();
      const eligibleCarTemplates = allCarTemplates.filter((c) => c && c.price > 1000);
      const numberOfOffers = randint(5, Math.min(8, eligibleCarTemplates.length));

      if (eligibleCarTemplates.length === 0) {
        bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('NO_USED_CARS_AVAILABLE')}</p>`;
        return;
      }
      for (let i = 0; i < numberOfOffers; i++) {
        const randomCarTemplate = choice(eligibleCarTemplates);
        if (!randomCarTemplate) continue;
        const usedCar = JSON.parse(JSON.stringify(randomCarTemplate));
        usedCar.price = Math.round(usedCar.price * (1 - randint(10, 40) / 100));
        usedCar.name_en += ` (${t('USED_TAG')})`;
        usedCar.health = randint(60, 95);
        usedCar.uniqueId = `car_${Date.now()}_${randint(1000, 9999)}`;
        const can_afford = player.money >= usedCar.price;
        let display_text = `${usedCar.name_en} - ${formatCurrency(usedCar.price)} (${t('STAT_HEALTH')}: ${usedCar.health}%)`;
        if (!can_afford) display_text += ` (${t('TOO_EXPENSIVE')})`;

        const button = document.createElement("button");
        button.textContent = display_text;
        button.className = `w-full button-primary py-2 text-xs text-left mb-1 ${can_afford ? "" : "button-disabled"}`;
        button.disabled = !can_afford;
        button.onclick = () => handleMenuAction("buy_asset", { type: "Cars", item: usedCar });
        bodyEl.appendChild(button);
      }
    },
    "playing",
    showCarPurchaseOptions
  );
}

export function showCarActionsMenu(carObject) {
  if (!getPlayer || !setCurrentMenuType || !carObject) return;
  setCurrentMenuType(`car_actions_${carObject.uniqueId}`);

  openModal(
    t('MANAGE_CAR_TITLE', { carName: carObject.name_en }),
    (bodyEl) => {
      const detailsEl = document.createElement("p");
      const brokenText = carObject.status === "broken" ? `<span class='text-red-500 font-bold'>(${t('BROKEN_TAG')})</span>` : "";
      detailsEl.innerHTML = `${t('STAT_HEALTH')}: ${carObject.health}% ${brokenText}`;
      detailsEl.className = "mb-4 text-gray-700 dark:text-gray-300";
      bodyEl.appendChild(detailsEl);
      const actions = [
        { textKey: "SELL_CAR_BUTTON", action: "sell_car", data: carObject.uniqueId, disabled: false },
        { textKey: "REPAIR_CAR_BUTTON", action: "repair_car", data: carObject.uniqueId, disabled: carObject.health === 100 },
        { textKey: "ABANDON_CAR_BUTTON", action: "abandon_car", data: carObject.uniqueId, disabled: false, danger: true },
      ];
      actions.forEach((act) => {
        const button = document.createElement("button");
        button.textContent = t(act.textKey);
        button.className = "w-full button-primary py-2 text-sm mb-2";
        if(act.danger) button.classList.add('button-danger');
        if (act.disabled) {
          button.classList.add("button-disabled");
          button.disabled = true;
        }
        
        button.onclick = () => {
            if (act.action === 'abandon_car') {
                showConfirmationDialog(
                    t('CONFIRM_ABANDON_CAR_TITLE'),
                    t('CONFIRM_ABANDON_CAR_MSG', { carName: carObject.name_en }),
                    () => {
                        handleMenuAction(act.action, act.data);
                        showMyAssetsMenu();
                    }
                );
            } else {
                handleMenuAction(act.action, act.data);
                if (act.action === 'sell_car') {
                    showMyAssetsMenu();
                }
            }
        };
        bodyEl.appendChild(button);
      });
    },
    "playing",
    showMyAssetsMenu
  );
}

export function showActivitiesMenu() {
  const player = getPlayer();
  if (!player) return;

  if (player.prison_time > 0) {
    showPrisonMenu();
    return;
  }
  
  setCurrentMenuType("activities_menu");
  openModal(
    t('MENU_TITLE_ACTIVITIES'),
    (bodyEl) => {
      Object.entries(ACTIVITY_CATEGORIES).forEach(
        ([categoryKey, categoryDetails]) => {
          if (categoryKey === 'CRIME' && player.criminal_record && Math.random() < 0.5) return;
          const category_name_key = `ACTIVITY_CATEGORY_${categoryKey}`;
          const button = document.createElement("button");
          button.textContent = t(category_name_key);
          button.className = "w-full button-primary py-2 text-sm mb-2";
          button.onclick = () => showActivitiesForCategory(categoryKey);
          bodyEl.appendChild(button);
        }
      );
    },
    "playing"
  );
}

export function showActivitiesForCategory(categoryKey) {
  const player = getPlayer();
  const category = ACTIVITY_CATEGORIES[categoryKey];
  if (!category || !player) return;

  setCurrentMenuType(`activities_${categoryKey}`);
  const category_name_key = `ACTIVITY_CATEGORY_${categoryKey}`;

  openModal(
    t(category_name_key),
    (bodyEl) => {
      let activitiesFound = false;
      Object.entries(category.activities).forEach(([activityKey, details]) => {
        activitiesFound = true;
        const activity_name_key = `ACTIVITY_${activityKey}`;
        let can_afford = player.money >= (details.cost || 0);
        let meets_edu_req = !details.req || !details.req.education || checkEducationRequirement(player.education_level, details.req.education);
        let meets_age_req = player.age >= (details.age_req || 0);
        let already_has = activityKey === "TakeDrivingTest" && player.has_drivers_license;
        let isDisabled = !can_afford || !meets_edu_req || !meets_age_req || already_has;
        let displayText = t(activity_name_key);

        if (details.cost > 0) {
          displayText += ` (${formatCurrency(details.cost)})`;
        }
        let reason = "";
        if (already_has) {
          reason = ` (${t('COMPLETED')})`;
        } else if (!meets_age_req) {
            reason = ` (${t('REQ_AGE', {age: details.age_req})})`;
        } else if (!meets_edu_req) {
          const edu_name_key = `EDU_${details.req.education.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
          reason = ` (${t('JOB_REQUIRES')}: ${t(edu_name_key)})`;
        } else if (!can_afford) {
          reason = ` (${t('TOO_EXPENSIVE')})`;
        }
        displayText += reason;

        const button = document.createElement("button");
        button.textContent = displayText;
        button.className = `w-full button-primary py-2 text-xs text-left mb-1 ${isDisabled ? "button-disabled" : ""}`;
        button.disabled = isDisabled;
        button.onclick = () => handleMenuAction("do_activity", { key: activityKey, details: details });
        bodyEl.appendChild(button);
      });
      if (!activitiesFound) {
          bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('NO_ACTIVITIES_IN_CATEGORY')}</p>`;
      }
    },
    "playing",
    showActivitiesMenu
  );
}

export function showPrisonMenu() {
    if (!getPlayer || !setCurrentMenuType) return;
    setCurrentMenuType("prison_menu");
    const player = getPlayer();
    if (!player || player.prison_time === 0) return;

    openModal(
        t('MENU_TITLE_PRISON'),
        (bodyEl) => {
            const prisonActivities = {
                'behave': { textKey: 'PRISON_BEHAVE', action: 'prison_behave' },
                'escape': { textKey: 'PRISON_ESCAPE', action: 'prison_escape', requires_smarts: 50 },
                'appeal': { textKey: 'PRISON_APPEAL', action: 'prison_appeal', cost: 10000 }
            };
            Object.values(prisonActivities).forEach(activity => {
                const button = document.createElement("button");
                let displayText = t(activity.textKey);
                let isDisabled = false;

                if (activity.cost && player.money < activity.cost) {
                    displayText += ` (${t('COST_UNNAFORDABLE', {cost: formatCurrency(activity.cost)})})`;
                    isDisabled = true;
                } else if (activity.cost) {
                    displayText += ` (${t('COST', {cost: formatCurrency(activity.cost)})})`;
                }

                if (activity.requires_smarts && player.smarts < activity.requires_smarts) {
                    displayText += ` (${t('REQ_SMARTS', {smarts: activity.requires_smarts})})`;
                    isDisabled = true;
                }

                button.textContent = displayText;
                button.className = `w-full button-primary py-2 text-sm mb-2 ${isDisabled ? 'button-disabled' : 'bg-red-700'}`;
                button.disabled = isDisabled;
                button.onclick = () => handleMenuAction(activity.action, activity);
                bodyEl.appendChild(button);
            });
        },
        "playing"
    );
}

export function showRelationshipsMenu() {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType("relationships_menu");
  const player = getPlayer();
  if (!player) return;

  openModal(
    t('MENU_TITLE_RELATIONSHIPS'),
    (bodyEl) => {
      const options = [];
      if (player.parents.father) {
        options.push({ text: t('REL_FATHER', {name: player.parents.father.name, rel: player.relationship_with_father}), action: "interact_parent", data: "father" });
      }
      if (player.parents.mother) {
        options.push({ text: t('REL_MOTHER', {name: player.parents.mother.name, rel: player.relationship_with_mother}), action: "interact_parent", data: "mother" });
      }
      if (player.partner) {
        const status = player.is_married ? t('REL_SPOUSE', {name: player.partner.name, years: player.years_married}) : t('REL_PARTNER', {name: player.partner.name, years: player.years_with_partner});
        options.push({ text: status, action: "interact_partner", data: null });
      } else {
        if (player.age >= 16) {
          options.push({ text: t('REL_FIND_PARTNER'), action: "go_to_activity_date", data: null });
        }
      }
      if (player.is_married && player.children.length < 4 && player.age >= 18 && player.age <= 45) {
        options.push({ text: t('REL_TRY_FOR_BABY'), action: "try_for_baby", data: null });
      }
      player.children.forEach((child, i) => {
        const gender = child.gender === 'male' ? t('GENDER_MALE_CHILD') : t('GENDER_FEMALE_CHILD');
        options.push({ text: t('REL_CHILD', {index: i + 1, name: child.name, gender: gender, age: child.age}), action: "interact_child", data: i });
      });

      if (options.length === 0) {
        bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('NO_RELATIONSHIPS')}</p>`;
      } else {
        options.forEach((opt) => {
          const button = document.createElement("button");
          button.textContent = opt.text;
          button.className = "w-full button-primary py-2 text-xs text-left mb-1";
          button.onclick = () => handleMenuAction(opt.action, opt.data);
          bodyEl.appendChild(button);
        });
      }
    },
    "playing"
  );
}

export function showMajorSelectionMenu() {
  if (!setCurrentMenuType || !showToast) return;
  setCurrentMenuType("major_selection");
  const player = getPlayer();
  openModal(
    t('MENU_TITLE_SELECT_MAJOR'),
    (bodyEl) => {
      UNIVERSITY_MAJORS.forEach((major_en) => {
        const button = document.createElement("button");
        button.textContent = major_en;
        button.className = "w-full button-primary py-2 text-sm mb-2";
        button.onclick = () => handleMenuAction("select_major", major_en);
        bodyEl.appendChild(button);
      });
    },
    "playing",
    () => {
        if (player && player.education_level === "University Student" && !player.university_major) {
            showConfirmationDialog(
                t('CONFIRM_DROPOUT_TITLE'),
                t('CONFIRM_DROPOUT_MSG'),
                () => {
                    player.education_level = "High School Diploma";
                    player.in_school = false;
                    handleMenuAction("cancel_major_selection", null);
                    showToast(t('TOAST_DROPPED_OUT'));
                    player.addEventToLog(t('LOG_DROPPED_OUT_NO_MAJOR'));
                }
            );
        } else {
            handleMenuAction("cancel_major_selection", null);
        }
    }
  );
}

export function showSkillSelectionMenu() {
  if (!getPlayer || !setCurrentMenuType) return;
  setCurrentMenuType("skill_selection");
  const player = getPlayer();
  if (!player) return;

  const learnSkillDetails = ACTIVITY_CATEGORIES.EDUCATION_SKILLS.activities.LearnSkill;
  const skillCost = learnSkillDetails.cost;

  openModal(
    t('MENU_TITLE_LEARN_SKILL', { cost: formatCurrency(skillCost) }),
    (bodyEl) => {
      const learnableSkills = SKILLS_AVAILABLE.filter(
        (skill) => skill !== "Driver's License" && !player.skills.includes(skill)
      );

      if (learnableSkills.length === 0) {
        bodyEl.innerHTML = `<p class="text-center text-gray-500">${t('ALL_SKILLS_LEARNED')}</p>`;
        return;
      }

      learnableSkills.forEach((skill_en) => {
        const can_afford = player.money >= skillCost;
        const button = document.createElement("button");
        button.textContent = skill_en;
        button.className = `w-full button-primary py-2 text-sm mb-1 ${can_afford ? "" : "button-disabled"}`;
        button.disabled = !can_afford;
        button.onclick = () => handleMenuAction("learn_skill_confirm", skill_en);
        bodyEl.appendChild(button);
      });
    },
    "playing",
    () => showActivitiesForCategory("EDUCATION_SKILLS")
  );
}