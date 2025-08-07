import express from "express";
import cors from "cors";
import router from "./routes/router";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use("", router);
app.use(errorHandler);

export default app;
