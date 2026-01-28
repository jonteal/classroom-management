import express from "express";
import { db } from "./backend/db.js";
import { cars } from "./backend/schema.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// let cars = [
//   { id: 1, make: "Toyota", model: "Camry", year: 2020, price: 24000 },
//   { id: 2, make: "Honda", model: "Civic", year: 2019, price: 22000 },
//   { id: 3, make: "Ford", model: "Mustang", year: 2021, price: 26000 },
// ];

app.get("/", (req, res) => {
  res.send("Welcome to the Car Management API");
});

router.get("/", async (req, res) => {
  const all = await db.select().from(cars);
  res.json(all);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const rows = await db.select().from(cars).where(eq(cars.id, id));
  const car = rows[0];

  if (!car) {
    return res.status(404).json({ error: "Car not found" });
  }

  res.json(car);
});

router.post("/", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const [newCar] = await db
    .insert(cars)
    .values({
      make,
      model,
      year,
      price,
    })
    .returning();

  res.status(201).json(newCar);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { make, model, year, price } = req.body;

  const updateData = {};
  if (make !== undefined) updateData.make = make;
  if (model !== undefined) updateData.model = model;
  if (year !== undefined) updateData.year = year;
  if (price !== undefined) updateData.price = price;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  const [updated] = await db
    .update(cars)
    .set(updateData)
    .where(eq(cars.id, id))
    .returning();

  if (!updated) {
    return res.status(404).json({ error: "Car not found" });
  }

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const [deleted] = await db.delete(cars).where(eq(cars.id, id)).returning();

  if (!deleted) {
    return res.status(404).json({ error: "Car not found" });
  }

  res.json({ message: "Car deleted", car: deleted });
});

app.use("/api/v1/cars", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
