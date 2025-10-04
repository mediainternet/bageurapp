import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { toppings, packages, packageToppings } from "./shared/schema.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("🌱 Seeding database...");

  const toppingData = [
    { name: "Ceker", price: 3000 },
    { name: "Siomay", price: 2500 },
    { name: "Batagor", price: 2500 },
    { name: "Bakso", price: 2000 },
    { name: "Mie", price: 3000 },
    { name: "Makaroni", price: 2500 },
    { name: "Telur", price: 3000 },
    { name: "Sosis", price: 3000 },
    { name: "Keju", price: 2000 },
    { name: "Jamur", price: 2500 },
  ];

  console.log("📝 Adding toppings...");
  const insertedToppings = await db.insert(toppings).values(toppingData).returning();
  console.log(`✅ Added ${insertedToppings.length} toppings`);

  const packageData = [
    { name: "Paket Komplit", price: 15000 },
    { name: "Paket Hemat", price: 10000 },
    { name: "Paket Spesial", price: 18000 },
  ];

  console.log("📦 Adding packages...");
  const insertedPackages = await db.insert(packages).values(packageData).returning();
  console.log(`✅ Added ${insertedPackages.length} packages`);

  const paketKomplit = insertedPackages.find(p => p.name === "Paket Komplit");
  const paketHemat = insertedPackages.find(p => p.name === "Paket Hemat");
  const paketSpesial = insertedPackages.find(p => p.name === "Paket Spesial");

  const ceker = insertedToppings.find(t => t.name === "Ceker");
  const siomay = insertedToppings.find(t => t.name === "Siomay");
  const bakso = insertedToppings.find(t => t.name === "Bakso");
  const mie = insertedToppings.find(t => t.name === "Mie");
  const telur = insertedToppings.find(t => t.name === "Telur");
  const sosis = insertedToppings.find(t => t.name === "Sosis");

  console.log("🔗 Linking packages with toppings...");
  if (paketKomplit && ceker && siomay && mie && telur && sosis) {
    await db.insert(packageToppings).values([
      { packageId: paketKomplit.id, toppingId: ceker.id },
      { packageId: paketKomplit.id, toppingId: siomay.id },
      { packageId: paketKomplit.id, toppingId: mie.id },
      { packageId: paketKomplit.id, toppingId: telur.id },
      { packageId: paketKomplit.id, toppingId: sosis.id },
    ]);
  }

  if (paketHemat && bakso && mie) {
    await db.insert(packageToppings).values([
      { packageId: paketHemat.id, toppingId: bakso.id },
      { packageId: paketHemat.id, toppingId: mie.id },
    ]);
  }

  if (paketSpesial && ceker && siomay && bakso && mie && telur) {
    await db.insert(packageToppings).values([
      { packageId: paketSpesial.id, toppingId: ceker.id },
      { packageId: paketSpesial.id, toppingId: siomay.id },
      { packageId: paketSpesial.id, toppingId: bakso.id },
      { packageId: paketSpesial.id, toppingId: mie.id },
      { packageId: paketSpesial.id, toppingId: telur.id },
    ]);
  }

  console.log("✅ Package toppings linked successfully");
  console.log("🎉 Seeding completed!");

  await pool.end();
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
