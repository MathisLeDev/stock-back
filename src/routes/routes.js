"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const alertController_1 = require("../controllers/alertController");
const router = express_1.default.Router();
router.get('/ping', (req, res) => {
    res.send('pong');
});
router.get('/api/user', userController_1.UserController.getUser);
router.post('/api/user', userController_1.UserController.createUser);
router.put('/api/user/update', userController_1.UserController.updateUser);
router.delete('/api/user/:id', userController_1.UserController.deleteUser);
router.get('/api/users', userController_1.UserController.getUsers);
router.post('/api/login', userController_1.UserController.login);
router.get('/user/ping', (req, res) => {
    return res.status(401).send({
        message: "Acces denied. You don't have the required role."
    });
});
router.post('/api/alert', alertController_1.AlertController.createAlert);
router.get('/api/alert', alertController_1.AlertController.getAlerts);
router.patch('/api/alert', alertController_1.AlertController.deleteAlert);
router.get('/admin/ping', (req, res) => {
    res.send('pong');
});
exports.default = router;
