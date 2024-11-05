"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./entity/user");
const alert_1 = require("./entity/alert");
const Company_1 = require("./entity/Company");
// l'host se retrouve dans les gestionnaire de tâche le Ethernet wsl
// Enlever ajouter les migrations dans migrations
exports.appDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [user_1.User, alert_1.Alert, Company_1.Company],
    subscribers: [],
    migrations: [],
});
