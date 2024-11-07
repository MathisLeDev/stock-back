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
const chai_1 = require("chai");
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: 'http://localhost:3001/api', // Remplacez par l'URL de votre serveur Express.js
});
let token;
let user_id;
let alert_id;
describe('/ping', () => {
    it('should return pong', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)('pong').equal('pong');
    }));
});
describe('Create User Route', () => {
    it('Devrait créer un nouvel utilisateur avec les informations fournies', () => __awaiter(void 0, void 0, void 0, function* () {
        const userPayload = {
            firstName: "Mathis",
            lastName: "Brouard",
            password: "0000",
            email: "mathisbrouard@test.com"
        };
        const response = yield api.post('/user', userPayload);
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('id');
        (0, chai_1.expect)(response.data.firstName).to.equal(userPayload.firstName);
        user_id = response.data.id;
    }));
});
describe('Login Route', () => {
    it('Devrait retourner un token JWT valide', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: 'mathisbrouard@gmail.com',
            password: '0000',
        };
        const response = yield api.post('/login', loginPayload);
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('token');
        token = response.data.token;
    }));
});
describe('Create alert', () => {
    it("Devrait créer une alerte et creer l'action si elle n'existe pas", () => __awaiter(void 0, void 0, void 0, function* () {
        const alertPayload = {
            companyId: "binance",
            value: 10,
            shouldWeLower: true
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = yield api.post('/alert', alertPayload);
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('id');
        alert_id = response.data.id;
    }));
});
describe('Get user alert on a stock', () => {
    it('Devrait renvoyer les alertes définie sur une action en particulier', () => __awaiter(void 0, void 0, void 0, function* () {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = yield api.delete(`/alert?companyName=binance`);
        (0, chai_1.expect)(response.status).to.equal(200);
    }));
});
describe('Delete alert', () => {
    it('Devrait supprimer une alerte', () => __awaiter(void 0, void 0, void 0, function* () {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = yield api.patch(`/alert?alertId=${alert_id}`);
        (0, chai_1.expect)(response.status).to.equal(200);
    }));
});
describe('Delete User', () => {
    it('Devrait supprimer un utilisateur', () => __awaiter(void 0, void 0, void 0, function* () {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = yield api.delete(`/user/${user_id}`);
        (0, chai_1.expect)(response.status).to.equal(200);
    }));
});
