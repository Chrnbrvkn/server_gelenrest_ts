import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import sequelize from './db';
import { router } from './routes';
import cors from 'cors';
import { handleApiError } from './errors/handleApiError';

const PORT = parseInt(process.env.PORT as string) || 8080;
const app = express();


// app.use((req, res, next) => {
//   console.log(req.processedFiles); // Тестовый вывод, TypeScript должен распознавать это поле
//   next();
// });


app.use('/public/uploads', express.static('public/uploads'));

const allowedOrigins: string[] = [
  'https://gelenrest.ru',
  'https://www.gelenrest.ru',
  'https://localhost:5173',
  'https://localhost:5174',
];

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Origin:', req.get('Origin'));
  next();
});

app.use(express.json());
app.use('/', router);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  handleApiError(err, req, res);
});

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync( );
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
