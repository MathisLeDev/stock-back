import {NextFunction, Request, Response} from "express";
const jwt = require('jsonwebtoken');
import dotenv from "dotenv";
dotenv.config();
const encodedtoken = process.env.TOKEN

export const JwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.path)
    if(req.path !== '/api/login' && req.path !== '/ping' && !req.path.startsWith('/api/products') && req.path !== '/api/user' && req.path !== '/api/search' && req.path !== '/api/categories' && req.path !== '/user/ping' && req.path !== '/admin/ping') {
    if(req.headers.authorization){
        //remove Bearer from token
        const token = req.headers.authorization = req.headers.authorization?.replace('Bearer ', '');
        //next if route is login
            jwt.verify(token, encodedtoken, (err: any, decoded: any) => {
                if (err) {
                    res.status(401).send({
                        message: "Invalid token"
                    });
                } else {
                    //add user to request

                    // @ts-ignore
                    req.user = decoded.userRes;
                    console.log("decoded")

                    next();
                }
            })
        } else {
        res.status(401).send({
            message: "No token"
        });
        }
    } else {
        next();


    }

}
