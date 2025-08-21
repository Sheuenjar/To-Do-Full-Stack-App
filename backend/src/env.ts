// src/env.ts
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

// For verification purposes only:
console.log("Using env:", process.env.NODE_ENV, process.env.DATABASE_URL);
