// constants.js

// --- Character Names ---
export const MALE_NAMES = [
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
  "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua",
];

export const FEMALE_NAMES = [
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
  "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle",
];

export const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
];

// --- Education & Skills ---
export const EDUCATION_HIERARCHY = [
  "Uneducated", "Elementary School", "Middle School", "High School", "High School Diploma",
  "University Student", "Some University", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)"
];
export const UNIVERSITY_MAJORS = [
  "Medicine", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Art & Design",
  "Business Administration", "Economics", "Law", "Psychology", "Political Science", "Literature", "History", "Philosophy"
];
export const SKILLS_AVAILABLE = [
  "Driver's License",
  "Programming", "Guitar Playing", "Piano Playing", "Digital Painting", "Creative Writing", "English Language",
  "German Language", "Professional Cooking", "Advanced Gardening", "Photography", "Video Editing", "Web Design"
];

// --- Careers / Jobs ---
export const POSSIBLE_JOBS = {
  // Part-time jobs
  "Newspaper Deliverer": { type: "part_time", salary_range: [7, 12], smarts_req: 5, edu_req: "Middle School", hourly: true, age_min: 12, age_max: 18, name_en: "Newspaper Deliverer" },
  "Babysitter": { type: "part_time", salary_range: [8, 15], smarts_req: 10, edu_req: "Middle School", hourly: true, age_min: 14, age_max: 22, name_en: "Babysitter" },
  "Fast Food Worker": { type: "part_time", salary_range: [10, 18], smarts_req: 10, edu_req: "High School", hourly: true, age_min: 16, name_en: "Fast Food Worker" },
  "Retail Cashier": { type: "part_time", salary_range: [11, 19], smarts_req: 15, edu_req: "High School", hourly: true, age_min: 16, name_en: "Retail Cashier" },
  "Library Assistant (Part-time)": { type: "part_time", salary_range: [12, 20], smarts_req: 40, edu_req: "High School", hourly: true, age_min: 16, name_en: "Library Assistant (Part-time)" },
  "Barista": { type: "part_time", salary_range: [13, 22], smarts_req: 20, edu_req: "High School", hourly: true, age_min: 17, name_en: "Barista" },

  // Full-time no degree
  "Janitor": { type: "full_time_no_degree", salary_range: [28000, 42000], smarts_req: 5, edu_req: "Uneducated", name_en: "Janitor", hourly: false },
  "Construction Worker": { type: "full_time_no_degree", salary_range: [35000, 60000], smarts_req: 10, edu_req: "Uneducated", name_en: "Construction Worker", hourly: false },
  "Office Clerk": { type: "full_time_no_degree", salary_range: [32000, 48000], smarts_req: 30, edu_req: "High School Diploma", name_en: "Office Clerk", hourly: false },
  "Truck Driver": { type: "full_time_no_degree", salary_range: [45000, 75000], smarts_req: 20, edu_req: "High School Diploma", name_en: "Truck Driver", hourly: false },
  "Sales Associate": { type: "full_time_no_degree", salary_range: [30000, 50000], smarts_req: 25, edu_req: "High School Diploma", name_en: "Sales Associate", hourly: false },

  // Full-time degree
  "Elementary School Teacher": { type: "full_time_degree", salary_range: [48000, 75000], smarts_req: 60, edu_req: "Bachelor's Degree", major_bonus: "Education", name_en: "Elementary School Teacher", hourly: false },
  "Accountant": { type: "full_time_degree", salary_range: [58000, 95000], smarts_req: 65, edu_req: "Bachelor's Degree", major_bonus: "Business Administration", name_en: "Accountant", hourly: false },
  "Software Engineer": { type: "full_time_degree", salary_range: [75000, 150000], smarts_req: 75, edu_req: "Bachelor's Degree", major_bonus: "Computer Science", name_en: "Software Engineer", hourly: false },
  "General Practitioner (Doctor)": { type: "full_time_degree", salary_range: [160000, 350000], smarts_req: 85, edu_req: "Master's Degree", major_bonus: "Medicine", name_en: "General Practitioner (Doctor)", hourly: false },
  "Lawyer": { type: "full_time_degree", salary_range: [80000, 200000], smarts_req: 80, edu_req: "Bachelor's Degree", major_bonus: "Law", name_en: "Lawyer", hourly: false },
  "University Professor": { type: "full_time_degree", salary_range: [70000, 180000], smarts_req: 80, edu_req: "Doctorate (PhD)", major_bonus: null, name_en: "University Professor", hourly: false },
  "Marketing Manager": { type: "full_time_degree", salary_range: [90000, 220000], smarts_req: 70, edu_req: "Bachelor's Degree", major_bonus: "Business Administration", name_en: "Marketing Manager", hourly: false },
  "Surgeon": { type: "full_time_degree", salary_range: [300000, 700000], smarts_req: 90, edu_req: "Doctorate (PhD)", major_bonus: "Medicine", name_en: "Surgeon", hourly: false },
};

// --- Assets (Houses and Cars) ---
export const AVAILABLE_ASSETS = {
  Houses: [
    { name_en: "Shared Room", type: 'rent', purchase_price: 0, rent_price: 3000, effect: { happiness: 1 }, maintenance: 0 },
    { name_en: "Studio Apartment", type: 'rent', purchase_price: 0, rent_price: 6000, effect: { happiness: 4 }, maintenance: 0 },
    { name_en: "Small Starter Home", type: 'purchase', purchase_price: 250000, rent_price: 0, effect: { happiness: 15 }, maintenance: 500 },
    { name_en: "Suburban House", type: 'purchase', purchase_price: 600000, rent_price: 0, effect: { happiness: 25, looks: 3 }, maintenance: 1000 },
    { name_en: "City Apartment", type: 'both', purchase_price: 900000, rent_price: 30000, effect: { happiness: 30, looks: 7 }, maintenance: 1500 },
    { name_en: "Luxury Condo", type: 'both', purchase_price: 1500000, rent_price: 50000, effect: { happiness: 40, looks: 10 }, maintenance: 2500 },
    { name_en: "Beachfront Villa", type: 'purchase', purchase_price: 3000000, rent_price: 0, effect: { happiness: 55, looks: 12 }, maintenance: 5000 },
    { name_en: "Mansion", type: 'purchase', purchase_price: 7000000, rent_price: 0, effect: { happiness: 70, looks: 18 }, maintenance: 10000 },
  ],
  Cars: {
    "Generic": {
      logo_url: "https://placehold.co/32x32/eeeeee/777777?text=Car",
      cars: [
        { name_en: "Old Rusty Bicycle", brand_en: "Generic", price: 50, effect: { happiness: 1, looks: -2 }, maintenance: 5 },
        { name_en: "Used Scooter", brand_en: "Generic", price: 300, effect: { happiness: 3, looks: 0 }, maintenance: 20 },
        { name_en: "Old Beater Car", brand_en: "Generic", price: 1500, effect: { happiness: 2, looks: -1 }, maintenance: 100 },
      ]
    },
    "Toyota": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/toyota.svg",
      cars: [
        { name_en: "Toyota Yaris", brand_en: "Toyota", price: 9000, effect: { happiness: 8, looks: 2 }, maintenance: 150 },
        { name_en: "Toyota Corolla", brand_en: "Toyota", price: 13000, effect: { happiness: 12, looks: 3 }, maintenance: 200 },
        { name_en: "Toyota Camry", brand_en: "Toyota", price: 22000, effect: { happiness: 15, looks: 4 }, maintenance: 250 },
        { name_en: "Toyota Land Cruiser", brand_en: "Toyota", price: 70000, effect: { happiness: 25, looks: 8 }, maintenance: 600 },
      ]
    },
    "Honda": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/honda.svg",
      cars: [
        { name_en: "Honda Civic", brand_en: "Honda", price: 12000, effect: { happiness: 10, looks: 3 }, maintenance: 180 },
        { name_en: "Honda Accord", brand_en: "Honda", price: 20000, effect: { happiness: 14, looks: 4 }, maintenance: 220 },
      ]
    },
    "Hyundai": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hyundai.svg",
      cars: [
        { name_en: "Hyundai Elantra", brand_en: "Hyundai", price: 18000, effect: { happiness: 13, looks: 4 }, maintenance: 200 },
        { name_en: "Hyundai Sonata", brand_en: "Hyundai", price: 25000, effect: { happiness: 16, looks: 5 }, maintenance: 280 },
        { name_en: "Hyundai Santa Fe", brand_en: "Hyundai", price: 35000, effect: { happiness: 18, looks: 6 }, maintenance: 350 },
      ]
    },
    "Kia": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/kia.svg",
      cars: [
        { name_en: "Kia Cerato", brand_en: "Kia", price: 17000, effect: { happiness: 12, looks: 4 }, maintenance: 190 },
        { name_en: "Kia Optima", brand_en: "Kia", price: 24000, effect: { happiness: 15, looks: 5 }, maintenance: 260 },
        { name_en: "Kia Sportage", brand_en: "Kia", price: 33000, effect: { happiness: 17, looks: 6 }, maintenance: 330 },
      ]
    },
    "BMW": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bmw.svg",
      cars: [
        { name_en: "BMW 320i", brand_en: "BMW", price: 45000, effect: { happiness: 25, looks: 8 }, maintenance: 500 },
        { name_en: "BMW 530i", brand_en: "BMW", price: 70000, effect: { happiness: 30, looks: 10 }, maintenance: 700 },
        { name_en: "BMW X4", brand_en: "BMW", price: 90000, effect: { happiness: 35, looks: 12 }, maintenance: 800 },
        { name_en: "BMW M4 Competition", brand_en: "BMW", price: 110000, effect: { happiness: 45, looks: 16 }, maintenance: 1000 },
        { name_en: "BMW i8", brand_en: "BMW", price: 200000, effect: { happiness: 50, looks: 18 }, maintenance: 1500 },
      ]
    },
    "Mercedes-Benz": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mercedes.svg",
      cars: [
        { name_en: "Mercedes-Benz C200", brand_en: "Mercedes-Benz", price: 50000, effect: { happiness: 28, looks: 9 }, maintenance: 550 },
        { name_en: "Mercedes-Benz E300", brand_en: "Mercedes-Benz", price: 80000, effect: { happiness: 38, looks: 12 }, maintenance: 750 },
        { name_en: "Mercedes-Benz G 63 AMG", brand_en: "Mercedes-Benz", price: 220000, effect: { happiness: 60, looks: 22, smarts: -2 }, maintenance: 2000 },
        { name_en: "Mercedes-AMG CLS 63 S", brand_en: "Mercedes-Benz", price: 160000, effect: { happiness: 55, looks: 20 }, maintenance: 1500 },
        { name_en: "Mercedes-Benz S500", brand_en: "Mercedes-Benz", price: 180000, effect: { happiness: 60, looks: 20 }, maintenance: 1200 },
        { name_en: "Mercedes-AMG GT R", brand_en: "Mercedes-Benz", price: 250000, effect: { happiness: 70, looks: 25 }, maintenance: 2200 },
      ]
    },
    "Dodge": {
      logo_url: "https://logo.clearbit.com/dodge.com",
      cars: [
        { name_en: "Dodge Charger R/T", brand_en: "Dodge", price: 55000, effect: { happiness: 30, looks: 10 }, maintenance: 600 },
        { name_en: "Dodge Challenger SRT Hellcat", brand_en: "Dodge", price: 95000, effect: { happiness: 40, looks: 15 }, maintenance: 900 },
        { name_en: "Dodge Durango SRT Hellcat", brand_en: "Dodge", price: 100000, effect: { happiness: 38, looks: 14 }, maintenance: 950 },
        { name_en: "Dodge Challenger SRT Demon", brand_en: "Dodge", price: 130000, effect: { happiness: 50, looks: 18, smarts: -1 }, maintenance: 1200 },
        { name_en: "Dodge Viper ACR", brand_en: "Dodge", price: 150000, effect: { happiness: 55, looks: 20, health: -1 }, maintenance: 1400 },
      ]
    },
    "Porsche": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/porsche.svg",
      cars: [
        { name_en: "Porsche 718 Boxster", brand_en: "Porsche", price: 80000, effect: { happiness: 40, looks: 15 }, maintenance: 800 },
        { name_en: "Porsche 911 Carrera", brand_en: "Porsche", price: 120000, effect: { happiness: 50, looks: 18 }, maintenance: 1100 },
        { name_en: "Porsche Panamera Turbo S", brand_en: "Porsche", price: 250000, effect: { happiness: 65, looks: 22 }, maintenance: 1800 },
        { name_en: "Porsche Taycan Turbo S", brand_en: "Porsche", price: 220000, effect: { happiness: 60, looks: 20, smarts: 2 }, maintenance: 1000 },
      ]
    },
    "Ferrari": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ferrari.svg",
      cars: [
        { name_en: "Ferrari Roma", brand_en: "Ferrari", price: 280000, effect: { happiness: 75, looks: 26 }, maintenance: 2500 },
        { name_en: "Ferrari 488 GTB", brand_en: "Ferrari", price: 400000, effect: { happiness: 80, looks: 28 }, maintenance: 3000 },
        { name_en: "Ferrari SF90 Stradale", brand_en: "Ferrari", price: 700000, effect: { happiness: 90, looks: 32, smarts: 1 }, maintenance: 5000 },
      ]
    },
    "Lamborghini": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/lamborghini.svg",
      cars: [
        { name_en: "Lamborghini Huracan EVO", brand_en: "Lamborghini", price: 330000, effect: { happiness: 82, looks: 29 }, maintenance: 3200 },
        { name_en: "Lamborghini Aventador SVJ", brand_en: "Lamborghini", price: 650000, effect: { happiness: 92, looks: 35, smarts: -1 }, maintenance: 6000 },
        { name_en: "Lamborghini Urus", brand_en: "Lamborghini", price: 280000, effect: { happiness: 70, looks: 25 }, maintenance: 2800 },
      ]
    },
    "Tesla": {
      logo_url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tesla.svg",
      cars: [
        { name_en: "Tesla Model 3 Performance", brand_en: "Tesla", price: 60000, effect: { happiness: 35, looks: 10, smarts: 3 }, maintenance: 200 },
        { name_en: "Tesla Model S Plaid", brand_en: "Tesla", price: 140000, effect: { happiness: 50, looks: 15, smarts: 5 }, maintenance: 300 },
        { name_en: "Tesla Cybertruck", brand_en: "Tesla", price: 80000, effect: { happiness: 30, looks: 5, smarts: 2 }, maintenance: 250 },
      ]
    },
    "Legendary Tuners": {
      logo_url: "https://placehold.co/32x32/FFD700/000000?text=LT",
      cars: [
        { name_en: "Mansory Stallone (Ferrari 812)", brand_en: "Legendary Tuners", price: 950000, effect: { happiness: 95, looks: 40, smarts: -2 }, maintenance: 10000 },
        { name_en: "Brabus Rocket 900 (Mercedes-AMG GT)", brand_en: "Legendary Tuners", price: 800000, effect: { happiness: 93, looks: 38 }, maintenance: 9000 },
        { name_en: "Hennessey Venom F5", brand_en: "Legendary Tuners", price: 2100000, effect: { happiness: 98, looks: 35, health: -2 }, maintenance: 15000 },
        { name_en: "Koenigsegg Jesko Absolut", brand_en: "Legendary Tuners", price: 3500000, effect: { happiness: 99, looks: 42, smarts: 2 }, maintenance: 20000 },
        { name_en: "Bugatti Chiron Super Sport 300+", brand_en: "Legendary Tuners", price: 4000000, effect: { happiness: 100, looks: 45, smarts: 1 }, maintenance: 25000 },
      ]
    }
  }
};

// --- Activities with Categories ---
// FIX: Added age_req to activities to implement age restrictions.
export const ACTIVITY_CATEGORIES = {
  MIND_BODY: {
    name_en: "Mind & Body",
    activities: {
      GoToGym: { cost: 50, effect: { health: [3, 7], looks: [1, 3], happiness: [0, 2] }, name_en: "Go to the Gym", age_req: 16 },
      ReadBook: { cost: 0, effect: { smarts: [2, 5], happiness: [1, 3] }, name_en: "Read a Book", age_req: 6 },
      Meditate: { cost: 0, effect: { happiness: [3, 7], health: [0, 2] }, name_en: "Meditate", age_req: 12 },
      VisitLibrary: { cost: 0, effect: { smarts: [1, 4] }, name_en: "Visit the Library", age_req: 6 },
    }
  },
  HEALTH_WELLNESS: {
    name_en: "Health & Wellness",
    activities: {
      VisitDoctor: { cost: 200, effect: { health: [5, 15] }, name_en: "Doctor Check-up", age_req: 6 },
      CosmeticSurgery: { cost: 5000, effect: { looks: [10, 25], health: [-5, 0] }, name_en: "Cosmetic Surgery", age_req: 18 },
      DonateBlood: { cost: 0, effect: { happiness: [5, 10], health: [-2, -1] }, name_en: "Donate Blood", age_req: 18 },
    }
  },
  LEISURE_FUN: {
    name_en: "Leisure & Fun",
    activities: {
        WatchTV: { cost: 0, effect: { happiness: [2, 5], smarts: [-1, 0] }, name_en: "Watch TV", age_req: 3 },
        GoClubbing: { cost: 100, effect: { happiness: [5, 15], health: [-5, -2], smarts: [-2, 0] }, name_en: "Go Clubbing", age_req: 18 },
        GoOnVacation: { cost: 2000, effect: { happiness: [15, 30], health: [1, 3] }, name_en: "Go on Vacation", age_req: 18 },
        FineDining: { cost: 150, effect: { happiness: [5,10], looks: [0,1]}, name_en: "Fine Dining", age_req: 16},
        AttendConcert: { cost: 80, effect: { happiness: [8,15]}, name_en: "Attend a Concert", age_req: 14},
        Gamble: { cost: 100, effect: {}, name_en: "Gamble", age_req: 18 },
    }
  },
  EDUCATION_SKILLS: {
      name_en: "Education & Skills",
      activities: {
          TakeDrivingTest: { cost: 100, effect: {}, name_en: "Take Driving Test", age_req: 16 },
          LearnSkill: { cost: 500, effect: { smarts: [3, 7] }, name_en: "Learn a New Skill", age_req: 10 },
          ApplyMasters: { cost: 200, effect: {}, name_en: "Apply for Master's Degree", req: { education: "Bachelor's Degree" }, age_req: 18 },
          ApplyPhD: { cost: 500, effect: {}, name_en: "Apply for Doctorate (PhD)", req: { education: "Master's Degree" }, age_req: 18 },
      }
  },
  CRIME: {
    name_en: "Crime",
    activities: {
      Shoplift: { cost: 0, name_en: "Shoplift", age_req: 12 },
      Pickpocket: { cost: 0, name_en: "Pickpocket", age_req: 14 },
      Burglary: { cost: 0, name_en: "Burgle a House", age_req: 16 },
      GrandTheftAuto: { cost: 0, name_en: "Steal a Car", age_req: 16 },
      BankHeist: { cost: 0, name_en: "Rob a Bank", age_req: 18 },
      CommitPettyCrime: { cost: 0, name_en: "Commit Petty Crime", age_req: 12 },
    }
  },
  SOCIAL: {
      name_en: "Social",
      activities: {
          GoOnDate: { cost: 50, effect: {}, name_en: "Go on a Date", age_req: 16 },
          Volunteer: { cost: 0, effect: { happiness: [3, 8] }, name_en: "Volunteer", age_req: 14 },
      }
  }
};