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
const Company_1 = require("../entity/Company");
dotenv_1.default.config();
class AlertController {
    constructor() {
    }
    static getAlerts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const companyName = req.query.companyName;
                const userExist = yield user_1.User.findOne({ where: { id: user.id } });
                if (!userExist) {
                    return res.status(400).send({
                        message: "User not found"
                    });
                }
                const alerts = yield alert_1.Alert.find({ where: { user: user.id, company: { name: companyName } } });
                return res.json(alerts);
            }
            catch (e) {
                return e;
            }
        });
    }
    static createAlert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { companyId, value, shouldBeLower } = req.body;
            console.log(req.body);
            const userExist = yield user_1.User.findOne({ where: { id: user.id } });
            let companyExist = yield Company_1.Company.findOne({ where: { name: companyId } });
            console.log('Company exist', companyExist);
            if (!userExist) {
                return res.status(400).send({
                    message: "User not found"
                });
            }
            if (!companyId || !value) {
                return res.status(400).send({
                    message: "Please provide companyId and value"
                });
            }
            if (!companyExist) {
                const newCompany = yield Company_1.Company.create({ name: companyId }).save();
                if (newCompany) {
                    companyExist = newCompany;
                }
                else {
                    return res.status(400).send({
                        message: "Error during company creation"
                    });
                }
            }
            if (!userExist || !companyExist) {
                return res.status(400).send({
                    message: "User or company not found"
                });
            }
            const alert = alert_1.Alert.create({ value, shouldBeLower: !!shouldBeLower, user, company: companyExist });
            const isAlertCreated = yield alert.save();
            if (!isAlertCreated) {
                return res.status(400).send({
                    message: "Error during creation"
                });
            }
            return res.json(alert);
        });
    }
    static deleteAlert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const alertId = req.query.alertId;
            const user = req.user;
            const userExist = yield user_1.User.findOne({ where: { id: user.id } });
            if (!userExist) {
                return res.status(400).send({
                    message: "User not found"
                });
            }
            const alertExist = yield alert_1.Alert.findOne({ where: { id: alertId }, relations: ['user'] });
            if (!alertExist) {
                return res.status(400).send({
                    message: "Alert not found"
                });
            }
            if (alertExist.user.id !== user.id) {
                return res.status(401).send({
                    message: "You are not allowed to delete this alert"
                });
            }
            const isDeleted = yield alert_1.Alert.delete({ id: alertId });
            console.log('isDeleted', isDeleted);
            if (!isDeleted) {
                return res.status(400).send({
                    message: "Error during deletion"
                });
            }
            return res.json({
                message: "Alert deleted"
            });
        });
    }
}
exports.AlertController = AlertController;
