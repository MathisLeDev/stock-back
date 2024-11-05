import express from 'express'
import {UserController} from "../controllers/userController";
import {AlertController} from "../controllers/alertController";

const router = express.Router()

router.get('/ping', (req, res) => {
    res.send('pong')
})

router.get('/api/user', UserController.getUser);

router.post('/api/user',  UserController.createUser);

router.put('/api/user/update',  UserController.updateUser);

router.delete('/api/user/:id',  UserController.deleteUser);

router.get('/api/users',  UserController.getUsers);

router.post('/api/login',  UserController.login);

router.get('/user/ping', (req, res) => {
    return res.status(401).send({
        message: "Acces denied. You don't have the required role."
    });
});

router.post('/api/alert', AlertController.createAlert)

router.get('/api/alert', AlertController.getAlerts)

router.patch('/api/alert', AlertController.deleteAlert)

router.get('/admin/ping', (req, res) => {
    res.send('pong')
});


export default router