import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes";
import express, { Application, Request, Response } from "express";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Api-Key"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
