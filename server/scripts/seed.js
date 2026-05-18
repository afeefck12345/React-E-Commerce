import "../config/env.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.resolve(__dirname, "../../db.json");

const raw = await fs.readFile(dbJsonPath, "utf8");
const data = JSON.parse(raw);

await connectDB();

// Seed users
for (const user of data.users || []) {
  const exists = await User.findOne({ email: user.email });
  if (exists) { console.log(`Skip user: ${user.email}`); continue; }
  await User.create({
    name: user.name || "User",
    email: user.email,
    password: user.password,
    role: user.role || "user",
    blocked: Boolean(user.blocked),
    isActive: true,
  });
  console.log(`Created user: ${user.email}`);
}

// Seed products
for (const p of data.products || []) {
  const exists = await Product.findOne({ name: p.name });
  if (exists) { console.log(`Skip product: ${p.name}`); continue; }
  await Product.create({
    name: p.name,
    description: p.description || p.name,
    price: Number(p.price) || 0,
    category: p.category || "General",
    brand: p.brand || "",
    images: p.image ? [p.image] : [],
    stock: Number(p.stock) || 0,
    isFeatured: Boolean(p.isFeatured),
    active: true,
  });
  console.log(`Created product: ${p.name}`);
}

console.log("\nSeed complete");
process.exit(0);