import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import Car from "../src/models/Car.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "db", "seed-data");
const readJson = async (file) => JSON.parse(await readFile(resolve(root, file), "utf8"));
try {
  await connectDatabase();
  const [{ cars }, images] = await Promise.all([readJson("cars.json"), readJson("image-map.json")]);
  if (!Array.isArray(cars) || !cars.length) throw new Error("cars.json must contain a non-empty cars array.");
  const operations = cars.map((car) => {
    const main = images[`main:${car.image_file}`];
    return { updateOne: { filter: { _id: car.id }, update: { $set: {
      make: car.make, model: car.model, year_range: car.year_range, year: car.year,
      condition: car.condition, listing_type: car.listing_type, price: car.price,
      body_type: car.body_type, fuel: car.fuel, transmission: car.transmission,
      cc: car.cc, bhp: car.bhp, mileage: car.mileage, colour: car.colour,
      image_url: main?.secureUrl || "", image_public_id: main?.publicId || "", status: "available",
      details: car.details, features: car.features || [],
      gallery: (car.gallery_files || []).map((filename, index) => ({ image_url: images[`gallery:${filename}`]?.secureUrl || "", image_public_id: images[`gallery:${filename}`]?.publicId || "", sort_order: index })),
    } }, upsert: true } };
  });
  const result = await Car.bulkWrite(operations);
  console.log(`MongoDB seed complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`);
} finally { await disconnectDatabase(); }
