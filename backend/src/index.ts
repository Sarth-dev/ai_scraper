import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import "./queue";
import taskRoutes from "./routes/tasks";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
