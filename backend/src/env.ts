// src/env.ts
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

// Solo para verificar que carga bien:
console.log("Using env:", process.env.NODE_ENV, process.env.DATABASE_URL);
