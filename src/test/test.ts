import {expect} from "chai";
import axios from 'axios';
import {beforeEach} from "mocha";
const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Remplacez par l'URL de votre serveur Express.js
});

let token: string;
let user_id: number;
let alert_id: number;

describe('/ping', () => {
    it('should return pong', async () => {
        expect('pong').equal('pong')
    })
})

describe('Create User Route', () => {
    it('Devrait créer un nouvel utilisateur avec les informations fournies', async () => {
        const userPayload = {
            firstName: "Mathis",
            lastName: "Brouard",
            password: "0000",
            email: "mathisbrouard@test.com"
        }

        const response = await api.post('/user', userPayload);

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        expect(response.data.firstName).to.equal(userPayload.firstName);

        user_id = response.data.id;
    });
});

describe('Login Route', () => {
    it('Devrait retourner un token JWT valide', async () => {
        const loginPayload = {
            email: 'mathisbrouard@gmail.com',
            password: '0000',
        };

        const response = await api.post('/login', loginPayload);

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('token');

        token = response.data.token;
    });
});


describe('Create alert', () => {
    it("Devrait créer une alerte et creer l'action si elle n'existe pas", async () => {
        const alertPayload = {
            companyId: "binance",
            value: 10,
            shouldWeLower: true
        }
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.post('/alert', alertPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        alert_id = response.data.id;
    })
});



describe('Get user alert on a stock', () => {
    it('Devrait renvoyer les alertes définie sur une action en particulier', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.get(`/alert?companyName=binance`);
        expect(response.status).to.equal(200);
    });
});

describe('Delete alert', () => {
    it('Devrait supprimer une alerte', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.patch(`/alert?alertId=${alert_id}`);
        expect(response.status).to.equal(200);
    });
});

describe('Delete User', () => {
    it('Devrait supprimer un utilisateur', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.delete(`/user/${user_id}`);
        expect(response.status).to.equal(200);
    });
});

