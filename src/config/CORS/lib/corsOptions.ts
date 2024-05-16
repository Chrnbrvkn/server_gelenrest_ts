import cors from 'cors';


const allowedOrigins: string[] = [
  'https://gelenrest.ru',
  'https://www.gelenrest.ru',
  'https://localhost:5173',
  'https://localhost:5174',
];

export const corsOptions: cors.CorsOptions = {
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