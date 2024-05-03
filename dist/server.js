"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const PORT = parseInt(process.env.PORT) || 8080;
const app = (0, express_1.default)();
app.use('/public/uploads', express_1.default.static('public/uploads'));
const allowedOrigins = [
    'https://gelenrest.ru',
    'https://www.gelenrest.ru',
    'https://localhost:5173',
    'https://localhost:5174',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    console.log('Origin:', req.get('Origin'));
    next();
});
app.use(express_1.default.json());
app.use('/', routes_1.default);
const start = async () => {
    try {
        await db_1.default.authenticate();
        await db_1.default.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
};
start();
