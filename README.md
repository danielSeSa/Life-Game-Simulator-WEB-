# Life-Game-Simulator-WEB
Life Simulator Game
Description
Life Simulator is an interactive web-based game where players create a character and navigate through various life stages and events. The game involves managing stats such as health, happiness, smarts, and looks, making decisions about career, assets, activities, and relationships, and experiencing random life events. The goal is to live a life, make choices, and see their consequences, ultimately leading to a game over screen summarizing the character's life.

Features
Character Creation: Players can name their character and choose their gender (male or female).

Stats Management: Core stats (Health, Happiness, Smarts, Looks) that change based on events and decisions.

Aging: Players can "Age Up" their character year by year, triggering events and changes.

Career Path: Options to find part-time or full-time jobs (with or without degree requirements), get promotions, or get fired.

Assets: Players can buy and manage assets like houses and cars, which come with costs and benefits.

Activities: A variety of activities to engage in, such as going to the gym, reading, clubbing, volunteering, or even committing petty crimes, each with different outcomes.

Relationships: Manage relationships with parents, find a partner, get married, and have children.

Education: Progress through different education levels from elementary school to university, with options to choose a major.

Events: Random and age-specific events occur, requiring player choices (e.g., school bully, finding money, illness).

Modal System: Interactive modals for job listings, asset purchases, activities, relationship interactions, and event choices.

Game Over: The game ends when the character dies, with a summary of their life, cause of death, final money, and key life events.

Persistent State (within a session): The game tracks the player's progress throughout their character's life.

Responsive Design: The UI is designed to be usable on different screen sizes, utilizing Tailwind CSS and custom styles.

How to Play
Character Creation:

Open index.html in your web browser.

Enter a name for your character.

Select a gender (Male or Female).

Click "Start Life".

Gameplay:

The main game screen displays your character's stats (Name, Age, Money, Health, Happiness, Smarts, Looks), current job, and education.

Use the "Age Up (+1 Year)" button to advance your character's life by one year. This will trigger age-related events, stat changes, and income.

Messages and events will appear in the message log.

Some events will present choices in a modal or directly on the screen.

Main Actions (Buttons at the bottom):

Career: Find jobs, see job listings, or resign from current jobs.

Assets: Buy houses or cars.

Activities: Engage in various activities that can affect your stats and money.

Relationships: Interact with family members, find partners, and manage relationships.

Goal:

There isn't a single "win" condition. The goal is to experience a simulated life, making choices and seeing where they lead. Try to keep your character healthy and happy, or explore different life paths!

The game ends upon the character's death.

Technologies Used
HTML: For the basic structure of the web pages.

CSS:

Tailwind CSS: For utility-first styling and responsive design.

Custom CSS (style.css): For additional specific styling, theming, and overrides.

JavaScript (script.js): For all game logic, including character management, event handling, UI updates, and interactions.

Files
index.html: The main HTML file that structures the game's different screens (character creation, game screen, game over screen, modal).

style.css: Contains custom CSS rules, including variable definitions for colors, fonts, and responsive adjustments. It complements Tailwind CSS.

script.js: The core JavaScript file containing all the game's logic, including:

Player character class and properties.

Game state management.

Functions for aging, stat updates, job handling, asset management, activities, relationships, and events.

DOM manipulation for UI updates and interactions.

Constants for names, jobs, assets, activities, etc.

Setup
Ensure all three files (index.html, style.css, script.js) are in the same directory.

Open index.html in a modern web browser (e.g., Chrome, Firefox, Safari, Edge).

بازی شبیه‌ساز زندگی
توضیحات
شبیه‌ساز زندگی یک بازی تعاملی مبتنی بر وب است که در آن بازیکنان یک شخصیت ساخته و در مراحل و رویدادهای مختلف زندگی حرکت می‌کنند. بازی شامل مدیریت آمارهایی مانند سلامتی، شادی، هوش و ظاهر، تصمیم‌گیری در مورد شغل، دارایی‌ها، فعالیت‌ها و روابط و تجربه رویدادهای تصادفی زندگی است. هدف، زندگی کردن، انتخاب کردن و دیدن عواقب آن‌هاست که در نهایت به صفحه پایان بازی و خلاصه‌ای از زندگی شخصیت منجر می‌شود.

ویژگی‌ها
ساخت شخصیت: بازیکنان می‌توانند شخصیت خود را نام‌گذاری کرده و جنسیت او را (مرد یا زن) انتخاب کنند.

مدیریت آمارها: آمارهای اصلی (سلامتی، شادی، هوش، ظاهر) که بر اساس رویدادها و تصمیمات تغییر می‌کنند.

افزایش سن: بازیکنان می‌توانند شخصیت خود را سال به سال "پیرتر" کنند که باعث رویدادها و تغییرات می‌شود.

مسیر شغلی: گزینه‌هایی برای یافتن شغل پاره‌وقت یا تمام‌وقت (با یا بدون نیاز به مدرک تحصیلی)، ارتقاء شغلی یا اخراج شدن.

دارایی‌ها: بازیکنان می‌توانند دارایی‌هایی مانند خانه و ماشین را خریداری و مدیریت کنند که هزینه‌ها و مزایای خود را دارند.

فعالیت‌ها: انواع فعالیت‌ها برای انجام دادن، مانند رفتن به باشگاه، کتاب خواندن، رفتن به کلاب، کار داوطلبانه یا حتی ارتکاب جرائم کوچک، که هر کدام نتایج متفاوتی دارند.

روابط: مدیریت روابط با والدین، یافتن شریک زندگی، ازدواج و بچه‌دار شدن.

تحصیلات: پیشرفت در سطوح مختلف تحصیلی از دبستان تا دانشگاه، با گزینه‌هایی برای انتخاب رشته تحصیلی.

رویدادها: رویدادهای تصادفی و مرتبط با سن رخ می‌دهند که نیازمند انتخاب بازیکن هستند (مانند قلدر مدرسه، پیدا کردن پول، بیماری).

سیستم مودال: مودال‌های تعاملی برای لیست مشاغل، خرید دارایی، فعالیت‌ها، تعاملات روابط و انتخاب‌های رویداد.

پایان بازی: بازی با مرگ شخصیت به پایان می‌رسد و خلاصه‌ای از زندگی او، علت مرگ، پول نهایی و رویدادهای کلیدی زندگی نمایش داده می‌شود.

وضعیت پایدار (در طول یک جلسه بازی): بازی پیشرفت بازیکن را در طول زندگی شخصیتش پیگیری می‌کند.

طراحی واکنش‌گرا: رابط کاربری طوری طراحی شده که در اندازه‌های مختلف صفحه نمایش قابل استفاده باشد، با استفاده از Tailwind CSS و استایل‌های سفارشی.

نحوه بازی
ساخت شخصیت:

فایل index.html را در مرورگر وب خود باز کنید.

نامی برای شخصیت خود وارد کنید.

جنسیت (مرد یا زن) را انتخاب کنید.

روی "شروع زندگی" کلیک کنید.

گیم‌پلی:

صفحه اصلی بازی آمارهای شخصیت شما (نام، سن، پول، سلامتی، شادی، هوش، ظاهر)، شغل فعلی و تحصیلات را نمایش می‌دهد.

از دکمه "سن را بالا ببر (+1 سال)" برای افزایش یک سال به عمر شخصیت خود استفاده کنید. این کار باعث رویدادهای مرتبط با سن، تغییرات آمار و درآمد می‌شود.

پیام‌ها و رویدادها در گزارش پیام نمایش داده می‌شوند.

برخی رویدادها گزینه‌هایی را در یک مودال یا مستقیماً روی صفحه نمایش ارائه می‌دهند.

اقدامات اصلی (دکمه‌های پایین صفحه):

مسیر شغلی: شغل پیدا کنید، لیست مشاغل را ببینید یا از شغل فعلی استعفا دهید.

دارایی‌ها: خانه یا ماشین بخرید.

فعالیت‌ها: در فعالیت‌های مختلفی شرکت کنید که می‌توانند بر آمار و پول شما تأثیر بگذارند.

روابط: با اعضای خانواده تعامل داشته باشید، شریک زندگی پیدا کنید و روابط را مدیریت کنید.

هدف:

شرط "برد" مشخصی وجود ندارد. هدف، تجربه یک زندگی شبیه‌سازی شده، انتخاب کردن و دیدن نتایج آن است. سعی کنید شخصیت خود را سالم و شاد نگه دارید، یا مسیرهای مختلف زندگی را کشف کنید!

بازی با مرگ شخصیت به پایان می‌رسد.

تکنولوژی‌های استفاده شده
HTML: برای ساختار اصلی صفحات وب.

CSS:

Tailwind CSS: برای استایل‌دهی مبتنی بر ابزار (utility-first) و طراحی واکنش‌گرا.

CSS سفارشی (style.css): برای استایل‌دهی خاص اضافی، تم‌بندی و بازنویسی استایل‌ها.

JavaScript (script.js): برای تمام منطق بازی، شامل مدیریت شخصیت، مدیریت رویدادها، به‌روزرسانی رابط کاربری و تعاملات.

فایل‌ها
index.html: فایل HTML اصلی که صفحات مختلف بازی (ساخت شخصیت، صفحه بازی، صفحه پایان بازی، مودال) را ساختاربندی می‌کند.

style.css: شامل قوانین CSS سفارشی، از جمله تعریف متغیرها برای رنگ‌ها، فونت‌ها و تنظیمات واکنش‌گرا. این فایل مکمل Tailwind CSS است.

script.js: فایل اصلی جاوااسکریپت که شامل تمام منطق بازی است، از جمله:

کلاس شخصیت بازیکن و خصوصیات آن.

مدیریت وضعیت بازی.

توابع مربوط به افزایش سن، به‌روزرسانی آمارها، مدیریت شغل، مدیریت دارایی‌ها، فعالیت‌ها، روابط و رویدادها.

دستکاری DOM برای به‌روزرسانی رابط کاربری و تعاملات.

ثابت‌ها برای نام‌ها، مشاغل، دارایی‌ها، فعالیت‌ها و غیره.

راه‌اندازی
اطمینان حاصل کنید که هر سه فایل (index.html، style.css، script.js) در یک پوشه قرار دارند.

فایل index.html را در یک مرورگر وب مدرن (مانند کروم، فایرفاکس، سافاری، اج) باز کنید.
