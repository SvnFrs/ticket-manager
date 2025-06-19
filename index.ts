import express from "express";
import cookieParser from "cookie-parser";
import { connectDB, closeDB } from "./config/db.config";
import { setupSwagger } from "./config/swagger.config";
import userRoutes from "./routes/user.routes";
import ticketRoutes from "./routes/ticket.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB().then(() => {
  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/v1", userRoutes);
  app.use("/api/v1", ticketRoutes);

  // Swagger Setup
  setupSwagger(app);

  // Start the server
  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
    console.info(`API available at localhost:${PORT}/api/v1`);
    console.info(`Auth endpoints at localhost:${PORT}/api/auth`);
  });
}).catch(err => {
  console.error("Failed to start the server:", err);
  process.exit(1);
});

// Handle shutdown
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});
