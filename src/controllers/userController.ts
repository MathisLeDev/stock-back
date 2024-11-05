import {User} from "../entity/user";
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
import dotenv from "dotenv";
import {findSourceMap} from "node:module";
dotenv.config();

export class UserController {

    constructor() {
    }

    static async getUser(req: any, res: any) {
        const firstName = req.query.firstName;
        if(!firstName()){
            return res.status(400).send({
                message: "Please provide firstName"
            });
        }
        const user = await User.findOne({where: {firstName: <string>firstName}});
        if(!user){
            return res.status(400).send({
                message: "User not found"
            });
        }

        return res.json(user)
    }

    static async createUser(req: any, res: any) {
        if(!req?.body?.email || !req?.body?.firstName || !req?.body?.lastName || !req?.body?.password){
            return res.status(400).send({
                message: "Please provide email, firstName, lastName and password"
            });
        }




        const {email, firstName, lastName }  = req.body;

        const userExist = await User.findOne({where: {email}});
        if(userExist){
            return res.status(400).send({
                message: "User already exist"
            });
        }

        //encrypt password
        const passwordHash = crypto.createHash('sha256').update(req.body.password).digest('hex');

        const user = User.create({firstName, lastName, email, password: passwordHash});

        const isUserCreated  = await user.save();
        if(!isUserCreated){
            return res.status(400).send({
                message: "User error during creation"
            });
        }
        return res.json(user);
    }

    static async updateUser(req: any, res: any) {
        try {

        console.log(req.body)
        const user = req.user;

        const userToUpdate = await User.findOne({where: {id: user.id}});
        if(!userToUpdate){
            return res.status(400).send({
                message: "User not found"
            });
        }

        const {firstName, lastName, email, password} = req.body;

        userToUpdate.firstName = firstName;
        userToUpdate.lastName = lastName;
        userToUpdate.email = email;
        if(password) {
            userToUpdate.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        }
        if(await userToUpdate.save())
            return res.json(userToUpdate)
        else
            return res.status(400).send({
                message: "Error during update user"
            });
        } catch (e) {
            return res.status(400).send({
                message: "Error during update user"
            });
        }
    }

    static async login(req: any, res: any) {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send({
                message: "Please provide username and password"
            });
        }
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        const user = await User.findOne({where: {email, password: passwordHash}});
        if(!user){
            return res.status(400).send({
                message: "User not found"
            });
        }
        //remove password
        const userRes: {password?: string} = {...user};
        const TOKEN = process.env.TOKEN;
        delete userRes.password;
        const token = jwt.sign({userRes}, TOKEN, { algorithm: 'HS256', expiresIn: '1h' });
        return res.json({user: userRes, token: token});
    }

    static async getUsers(req: any, res: any) {
        const users = await User.find();
        if(!users){
            return res.status(400).send({
                message: "Users not found"
            });
        }
        //remove password
        users.forEach((user: any) => {
            delete user.password;
        })
        return res.json(users)
    }

    static async deleteUser(req: any, res: any) {
        try {
            const {id} = req.params;
            const user = await User.findOne({where: {id}});
            if (!user) {
                return res.status(200).send({
                    message: "User not found"
                });
            }
            if(await user.remove())
                return res.json({message: "User deleted"})
            else
                return res.status(400).send({
                    message: "Error during delete user"
                });
        } catch (e) {
            return res.status(400).send({
                message: "Error during delete user"
            });
        }
    }

}