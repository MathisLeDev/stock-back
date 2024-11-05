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
exports.UserController = void 0;
const user_1 = require("../entity/user");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserController {
    constructor() {
    }
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const firstName = req.query.firstName;
            if (!firstName()) {
                return res.status(400).send({
                    message: "Please provide firstName"
                });
            }
            const user = yield user_1.User.findOne({ where: { firstName: firstName } });
            if (!user) {
                return res.status(400).send({
                    message: "User not found"
                });
            }
            return res.json(user);
        });
    }
    static createUser(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email) || !((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.firstName) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.lastName) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.password)) {
                return res.status(400).send({
                    message: "Please provide email, firstName, lastName and password"
                });
            }
            const { email, firstName, lastName } = req.body;
            const userExist = yield user_1.User.findOne({ where: { email } });
            if (userExist) {
                return res.status(400).send({
                    message: "User already exist"
                });
            }
            //encrypt password
            const passwordHash = crypto.createHash('sha256').update(req.body.password).digest('hex');
            const user = user_1.User.create({ firstName, lastName, email, password: passwordHash });
            const isUserCreated = yield user.save();
            if (!isUserCreated) {
                return res.status(400).send({
                    message: "User error during creation"
                });
            }
            return res.json(user);
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
exports.UserController = UserController;
