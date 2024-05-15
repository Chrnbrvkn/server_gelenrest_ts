"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const handleApiError_1 = require("./errors/handleApiError");
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
app.use('/', routes_1.router);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err, req, res) => {
    console.error(err);
    (0, handleApiError_1.handleApiError)(err, req, res);
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.authenticate();
        yield db_1.default.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
});
start();
