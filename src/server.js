"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_data_source_1 = require("./app-data-source");
const jwtAuth_1 = require("./middleware/jwtAuth");
const routes_1 = __importDefault(require("./routes/routes"));
const cors = require('cors');
// establish database connection
app_data_source_1.appDataSource
    .initialize()
    .then((conn) => {
    conn.runMigrations();
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const app = (0, express_1.default)();
const port = 3001;
app.use(cors({
    origin: '*',
}));
app.use('/media', express_1.default.static('public/images'));
// Votre route pour servir l'image
app.get('/api/media/:imageName', (req, res) => {
    const { imageName } = req.params;
    res.sendFile(`${__dirname}/public/images/${imageName}`);
});
app.use(express_1.default.json()); // Add this line to handle JSON requests
app.use(express_1.default.urlencoded({ extended: true }));
app.use(jwtAuth_1.JwtMiddleware);
app.get('/', (req, res) => {
    res.send('Hello, this is Express + TypeScript');
});
app.use(routes_1.default);
app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
exports.default = app;
//add listerer for each request
