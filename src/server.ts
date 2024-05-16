import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

import sequelize from "./db/db";
import { corsOptions } from "./config/CORS/lib/corsOptions";
import { router } from "./routes";
import { handleApiError } from "./errors/handleApiError";

const PORT = parseInt(process.env.PORT as string) || 8080;
const app = express();

app.use("/public/uploads", express.static("public/uploads"));

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", router);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  handleApiError(err, req, res);
});

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
