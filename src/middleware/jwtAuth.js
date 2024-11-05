"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtMiddleware = void 0;
const jwt = require('jsonwebtoken');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const encodedtoken = process.env.TOKEN;
const JwtMiddleware = (req, res, next) => {
    var _a;
    console.log(req.method, req.path);
    if (req.path !== '/api/login' && req.path !== '/ping' && !req.path.startsWith('/api/products') && req.path !== '/api/user' && req.path !== '/api/search' && req.path !== '/api/categories' && req.path !== '/user/ping' && req.path !== '/admin/ping') {
        if (req.headers.authorization) {
            //remove Bearer from token
            const token = req.headers.authorization = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            //next if route is login
            jwt.verify(token, encodedtoken, (err, decoded) => {
                if (err) {
                    res.status(401).send({
                        message: "Invalid token"
                    });
                }
                else {
                    //add user to request
                    // @ts-ignore
                    req.user = decoded.userRes;
                    console.log("decoded");
                    next();
                }
            });
        }
        else {
            res.status(401).send({
                message: "No token"
            });
        }
    }
    else {
        next();
    }
};
exports.JwtMiddleware = JwtMiddleware;
