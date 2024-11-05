import {User} from "../entity/user";
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
import dotenv from "dotenv";
import {findSourceMap} from "node:module";
import {Alert} from "../entity/alert";
import {Company} from "../entity/Company";
dotenv.config();

export class AlertController {

    constructor() {
    }

    static async getAlerts(req: any, res: any) {
        try {
            const user = req.user;
            const companyName = req.query.companyName;
            const userExist = await User.findOne({where: {id: user.id}});
            if(!userExist){
                return res.status(400).send({
                    message: "User not found"
                });
            }
            const alerts = await Alert.find({where: {user: user.id, company: {name: companyName}}});
            return res.json(alerts);
        } catch (e) {
            return e
        }
    }

    static async createAlert(req: any, res: any) {
        const user = req.user;
        const {companyId, value, shouldBeLower} = req.body;
        console.log(req.body)

        const userExist = await User.findOne({where: {id: user.id}});
        let companyExist = await Company.findOne({where: {name: companyId}});

        console.log('Company exist', companyExist)

        if(!userExist) {
            return res.status(400).send({
                message: "User not found"
            });
        }

        if(!companyId || !value){
            return res.status(400).send({
                message: "Please provide companyId and value"
            });
        }

        if(!companyExist) {
            const newCompany = await Company.create({name: companyId}).save();
            if(newCompany) {
                companyExist = newCompany;
            } else {
                return res.status(400).send({
                    message: "Error during company creation"
                });
            }
        }

        if(!userExist || !companyExist){
            return res.status(400).send({
                message: "User or company not found"
            });
        }

        const alert = Alert.create({value, shouldBeLower: !!shouldBeLower, user, company: companyExist});

        const isAlertCreated  = await alert.save();
        if(!isAlertCreated){
            return res.status(400).send({
                message: "Error during creation"
            });
        }
        return res.json(alert);
    }

    static async deleteAlert(req: any, res: any) {
        const alertId = req.query.alertId;
        const user = req.user;
        const userExist = await User.findOne({where: {id: user.id}});
        if(!userExist) {
            return res.status(400).send({
                message: "User not found"
            });
        }

        const alertExist = await Alert.findOne({where: {id: alertId}, relations: ['user']});
        if(!alertExist) {
            return res.status(400).send({
                message: "Alert not found"
            });
        }

        if(alertExist.user.id !== user.id) {
            return res.status(401).send({
                message: "You are not allowed to delete this alert"
            });
        }

        const isDeleted = await Alert.delete({id: alertId});
        console.log('isDeleted', isDeleted)
        if(!isDeleted) {
            return res.status(400).send({
                message: "Error during deletion"
            });
        }

        return res.json({
            message: "Alert deleted"
        });
    }
}