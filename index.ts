import express from "express";
import { connectDB, closeDB } from "./config/db.config";
import { setupSwagger } from "./config/swagger.config";
import userRoutes from "./routes/user.routes";
import ticketRoutes from "./routes/ticket.routes"

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().then(() => {
  // API Routes
  app.use("/api/v1", userRoutes);
  app.use("/api/v1", ticketRoutes);

  // Swagger Setup
  setupSwagger(app);

  // Start the server
  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}, path of localhost:4000/api/v1`);
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
