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
exports.AlertController = void 0;
const user_1 = require("../entity/user");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv_1 = __importDefault(require("dotenv"));
const alert_1 = require("../entity/alert");
dotenv_1.default.config();
class AlertController {
    constructor() {
    }
    static getAlert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const user = req.user;
            if (!id) {
                return res.status(400).send({
                    message: "Please provide id"
                });
            }
            const alert = yield alert_1.Alert.findOne({ where: { id, user: user.id }, relations: ['user'] });
            if (!alert) {
                return res.status(400).send({
                    message: "Alert not found"
                });
            }
            return res.json(alert);
        });
    }
    static createAlert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { companyId, value, shouldBeLower } = req.body;
            const userExist = yield user_1.User.findOne({ where: { id: user.id } });
            const companyExist = yield user_1.User.findOne({ where: { id: companyId } });
            if (!userExist || !companyExist) {
                return res.status(400).send({
                    message: "User or company not found"
                });
            }
            const alert = alert_1.Alert.create({ value, shouldBeLower, user, company: companyId });
            const isAlertCreated = yield alert.save();
            if (!isAlertCreated) {
                return res.status(400).send({
                    message: "Error during creation"
                });
            }
            return res.json(alert);
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const user = req.user;
                const userToUpdate = yield user_1.User.findOne({ where: { id: user.id } });
                if (!userToUpdate) {
                    return res.status(400).send({
                        message: "User not found"
                    });
                }
                const { firstName, lastName, email, password } = req.body;
                userToUpdate.firstName = firstName;
                userToUpdate.lastName = lastName;
                userToUpdate.email = email;
                if (password) {
                    userToUpdate.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
                }
                if (yield userToUpdate.save())
                    return res.json(userToUpdate);
                else
                    return res.status(400).send({
                        message: "Error during update user"
                    });
            }
            catch (e) {
                return res.status(400).send({
                    message: "Error during update user"
                });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send({
                    message: "Please provide username and password"
                });
            }
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            const user = yield user_1.User.findOne({ where: { email, password: passwordHash } });
            if (!user) {
                return res.status(400).send({
                    message: "User not found"
                });
            }
            //remove password
            const userRes = Object.assign({}, user);
            const TOKEN = process.env.TOKEN;
            delete userRes.password;
            const token = jwt.sign({ userRes }, TOKEN, { algorithm: 'HS256', expiresIn: '1h' });
            return res.json({ user: userRes, token: token });
        });
    }
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_1.User.find();
            if (!users) {
                return res.status(400).send({
                    message: "Users not found"
                });
            }
            //remove password
            users.forEach((user) => {
                delete user.password;
            });
            return res.json(users);
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield user_1.User.findOne({ where: { id } });
                if (!user) {
                    return res.status(200).send({
                        message: "User not found"
                    });
                }
                if (yield user.remove())
                    return res.json({ message: "User deleted" });
                else
                    return res.status(400).send({
                        message: "Error during delete user"
                    });
            }
            catch (e) {
                return res.status(400).send({
                    message: "Error during delete user"
                });
            }
        });
    }
}
exports.AlertController = AlertController;
