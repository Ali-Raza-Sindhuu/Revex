import { chromium } from "../Frontend/node_modules/playwright/index.mjs";

const baseUrl = "http://127.0.0.1:5173";
const outputDir = new URL("./", import.meta.url).pathname;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cars = [
  ["bmw-i8-2022", "BMW", "i8", 2023, "new", "buy", 145000, "Coupe", "Hybrid", "Automatic", 1499, 369, 0, "Orange", "bmw-i8.png"],
  ["chevrolet-camaro-ss-2019", "Chevrolet", "Camaro SS", 2020, "used", "rent", 89.99, "Coupe", "Petrol", "Automatic", 6162, 455, 42000, "Red", "camaro-ss.png"],
  ["chevrolet-camaro-rs-2023", "Chevrolet", "Camaro RS", 2024, "new", "buy", 42500, "Coupe", "Petrol", "Automatic", 3600, 335, 0, "Yellow", "camaro-rs.png"],
  ["bmw-m2-competition-2022", "BMW", "M2 Competition", 2023, "new", "buy", 58900, "Coupe", "Petrol", "Manual", 2993, 405, 0, "Blue", "bmw-m2.png"],
  ["toyota-hilux-2023", "Toyota", "Hilux", 2024, "new", "buy", 34200, "Pickup", "Diesel", "Manual", 2755, 201, 0, "White", "toyata-hilux.png"],
  ["mercedes-e-class-2019", "Mercedes-Benz", "E-Class", 2020, "used", "rent", 75.99, "Sedan", "Petrol", "Automatic", 1991, 194, 58000, "Black", "mercedes-e-class.png"],
  ["porsche-911-carrera-2022", "Porsche", "911 Carrera", 2023, "used", "buy", 112000, "Coupe", "Petrol", "Automatic", 2981, 379, 18000, "Grey", "porsche-911.png"],
  ["toyota-land-cruiser-2021", "Toyota", "Land Cruiser", 2022, "used", "buy", 68500, "SUV", "Diesel", "Automatic", 3346, 304, 36000, "White", "land-cruiser.png"],
  ["land-rover-defender-90-2022", "Land Rover", "Defender 90", 2023, "new", "rent", 139, "SUV", "Diesel", "Automatic", 2997, 296, 0, "Green", "defender-90.png"],
  ["tesla-model-3-2023", "Tesla", "Model 3", 2023, "new", "buy", 42990, "Sedan", "Electric", "Automatic", 0, 283, 0, "White", "tesla-model-3.png"],
].map(([id, make, model, year, condition, listing_type, price, body_type, fuel, transmission, cc, bhp, mileage, colour, image]) => ({
  id, _id: id, make, model, year, year_range: `${year - 1}-${year}`, condition,
  listing_type, price, body_type, fuel, transmission, cc, bhp, mileage, colour,
  status: "available", image_url: `/src/assets/${image}`,
  features: ["Adaptive cruise control", "Premium sound system", "Parking sensors"],
  details: {
    description: `Explore the ${year} ${make} ${model}, presented in the REVEX sample inventory. View key specifications, compare options, and contact a seller to learn more.`,
    specs: { torque: 570, zeroToHundred: 4.4, topSpeed: 250, drivetrain: "All-wheel drive", doors: 4, seats: 5, interiorColour: "Black" },
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00" },
  },
  gallery: [{ image_url: `/src/assets/${image}` }],
}));

const facets = {
  makes: [...new Set(cars.map((car) => car.make))].sort(),
  modelsByMake: Object.fromEntries([...new Set(cars.map((car) => car.make))].map((make) => [make, cars.filter((car) => car.make === make).map((car) => car.model)])),
  years: [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a),
  bodyTypes: [...new Set(cars.map((car) => car.body_type))].sort(),
};

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outputDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.route("**/api/cars**", async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (path.endsWith("/facets")) {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(facets) });
    return;
  }
  const detailMatch = path.match(/\/api\/cars\/([^/]+)$/);
  if (detailMatch) {
    const car = cars.find((entry) => entry.id === decodeURIComponent(detailMatch[1]));
    await route.fulfill({ status: car ? 200 : 404, contentType: "application/json", body: JSON.stringify(car ?? { error: { message: "Vehicle not found" } }) });
    return;
  }
  await route.fulfill({ contentType: "application/json", body: JSON.stringify({ items: cars, total: cars.length, page: 1, pageSize: cars.length }) });
});

await page.addStyleTag({ content: `
  #demo-badge { position:fixed;z-index:99999;top:24px;right:28px;padding:9px 14px;border:1px solid rgba(255,255,255,.3);border-radius:999px;background:rgba(14,14,14,.75);color:#fff;font:600 10px/1 system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;backdrop-filter:blur(12px); }
  #demo-caption { position:fixed;z-index:99999;left:52px;bottom:38px;max-width:850px;padding:20px 26px;border-left:3px solid #f05a1a;border-radius:0 16px 16px 0;background:rgba(16,16,16,.92);color:#fff;box-shadow:0 15px 45px rgba(0,0,0,.28);font-family:system-ui,sans-serif;transition:opacity .25s ease,transform .25s ease; }
  #demo-caption small { display:block;margin-bottom:6px;color:#f05a1a;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase; }
  #demo-caption strong { display:block;font-size:23px;line-height:1.25;font-weight:600;letter-spacing:-.025em; }
  #demo-caption span { display:block;margin-top:5px;color:#c9c9c9;font-size:12px;line-height:1.4; }
`});
await page.evaluate(() => {
  const badge = document.createElement("div"); badge.id = "demo-badge"; badge.textContent = "REVEX · DIGITAL SHOWROOM"; document.body.appendChild(badge);
  const caption = document.createElement("div"); caption.id = "demo-caption"; document.body.appendChild(caption);
});
const caption = async (section, title, detail = "") => {
  await page.evaluate(({ section, title, detail }) => {
    const node = document.querySelector("#demo-caption");
    node.innerHTML = `<small>${section}</small><strong>${title}</strong>${detail ? `<span>${detail}</span>` : ""}`;
  }, { section, title, detail });
  await sleep(400);
};
const scrollTo = async (y, duration = 950) => {
  await page.evaluate(({ y, duration }) => window.scrollTo({ top: y, behavior: "smooth" }), { y, duration });
  await sleep(duration);
};

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await sleep(1200);
await caption("REVEX · CAR MARKETPLACE", "A modern showroom, made for every journey", "Browse, compare, rent, and personalise your next vehicle. Local preview uses sample inventory.");
await sleep(2800);
await caption("THE DESIGN", "Immersive imagery meets a clear, confident interface", "A warm orange accent, generous spacing, and simple navigation guide each step.");
await sleep(2100);
await scrollTo(680);
await sleep(500);
await scrollTo(1380);
await caption("DISCOVER", "Explore vehicle categories and featured listings", "Editorial photography and compact vehicle cards bring the showroom to life.");
await sleep(1900);

await page.goto(`${baseUrl}/inventory`, { waitUntil: "domcontentloaded" });
await page.getByText("BMW", { exact: false }).first().waitFor({ timeout: 10000 });
await page.evaluate(() => window.scrollTo(0, 0));
await caption("INVENTORY", "Browse new, used, and rental vehicles", "Filter by make, model, year, and price, then sort or switch the result layout.");
await sleep(2200);
await page.getByRole("radio", { name: "Rent Car" }).click();
await sleep(700);
await page.evaluate(() => window.scrollTo({ top: 920, behavior: "smooth" }));
await sleep(1100);
await caption("FIND YOUR FIT", "Narrow the listings to the way you want to travel", "Quick search controls work alongside detailed vehicle filters.");
await sleep(1800);

await page.goto(`${baseUrl}/inventory/bmw-i8-2022`, { waitUntil: "domcontentloaded" });
await page.getByText("BMW i8", { exact: false }).first().waitFor({ timeout: 10000 });
await page.evaluate(() => window.scrollTo(0, 0));
await caption("VEHICLE DETAILS", "A closer look at every listing", "Browse the image gallery, compare specifications, review performance, and contact the seller.");
await sleep(3000);
await scrollTo(650, 850);
await sleep(1300);

await page.goto(`${baseUrl}/configurator`, { waitUntil: "domcontentloaded" });
await page.getByLabel("Vehicle").waitFor({ timeout: 10000 });
await page.evaluate(() => window.scrollTo(400, 420));
await caption("CONFIGURATOR", "Make a build preview your own", "Select a vehicle, try exterior colors, and choose an interior finish.");
await sleep(1900);
await page.getByRole("button", { name: "Deep blue" }).click();
await sleep(600);
await page.locator("#config-interior").selectOption("Ivory");
await sleep(800);
await caption("YOUR NEXT STEP", "Take your preview to the listing or ask a question", "The configurator connects the build preview with vehicle details and seller enquiries.");
await sleep(2200);

await page.goto(`${baseUrl}/services`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => window.scrollTo(0, 0));
await caption("SERVICES & SUPPORT", "A consistent design from discovery to support", "Service information, inspection guidance, and FAQs help buyers move forward.");
await sleep(2400);
await scrollTo(720, 850);
await sleep(1000);
await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.evaluate(() => window.scrollTo(0, 0));
await caption("REVEX", "Find the road that feels like yours", "Thanks for taking a tour of the REVEX digital showroom.");
await sleep(3200);

const video = page.video();
await context.close();
await browser.close();
const file = await video.path();
const { copyFile, stat } = await import("node:fs/promises");
const outputPath = new URL("./revex-website-demo.webm", import.meta.url);
await copyFile(file, outputPath);
const info = await stat(outputPath);
console.log(`Saved ${outputPath.pathname} (${(info.size / 1024 / 1024).toFixed(1)} MB)`);
