import {DataSource} from "typeorm";
import {User} from "./entity/user";

// l'host se retrouve dans les gestionnaire de tâche le Ethernet wsl

// Enlever ajouter les migrations dans migrations
export const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})