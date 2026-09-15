import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

/* =========================================================
   CORS
========================================================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

/* =========================================================
   REQUEST BODY LIMIT
   Increased to support larger JSON / form payloads.
========================================================= */
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* =========================================================
   HEALTH CHECK
========================================================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Perroqueta API is running",
  });
});

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/careers", careerRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/inquiries", inquiryRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/redirects", redirectRoutes);

app.use("/api/admin/dashboard", dashboardRoutes);

export default app;