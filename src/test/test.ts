import {expect} from "chai";
import axios from 'axios';
import {beforeEach} from "mocha";
const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Remplacez par l'URL de votre serveur Express.js
});

let token: string;
let user_id: number;
let product_id: number;
let order_id: number;
let review_id: number;

describe('/ping', () => {
    it('should return pong', async () => {
        expect('pong').equal('pong')
    })
})

describe('Create User Route', () => {
    it('Devrait créer un nouvel utilisateur avec les informations fournies', async () => {
        const userPayload = {
            username: 'admin',
            password: '0000',
            phone: '0664674495',
            email: 'mathisbrouard@gmail.com',
            roleId: 1,
            address: {
                street: 'Rue ane',
                zipcode: 61000,
                country: 'France',
                number: 2,
                city: 'Alencon',
            },
        };

        const response = await api.post('/user', userPayload);

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        expect(response.data.username).to.equal(userPayload.username);

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

describe('Put User Route', () => {
    beforeEach('Assurer la connexion et la création d\'utilisateur', async () => {
        const loginPayload = {
            email: 'mathisbrouard@gmail.com',
            password: '0000',
        };
        const loginResponse = await api.post('/login', loginPayload);
        token = loginResponse.data.token;
});
    it('Devrait modifier un utilisateur', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const putPayload = {
            username: "adminModified",
        };
        const response = await api.put(`/user/update`, putPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('username');
        expect(response.data.username).to.equal(putPayload.username);
    });
})



describe('Create product Route', () => {
    it('Devrait créer un nouveau produit avec les informations fournies', async () => {
        const productPayload = {
            name: "Un vélo tout simple",
            brand: "Une marque toute simple",
            weight: 14000,
            description: "Une description toute simple pour un vélo tout simple",
            price: 499,
            quantity: 1000,
            category: 1,
            image: "data:image/png;base64,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"
        }
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.post('/product', productPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        product_id = response.data.id;
    })
})

describe('Update Product Route', () => {
    it('Devrait mettre à jour un produit', async () => {
        const productPayload = {
            name: "Un vélo tout simple2",
            brand: "Une marque toute simple2",
            weight: 140001,
            description: "Une description toute simple pour un vélo tout simple2",
            price: 501,
            quantity: 1001,
            category: 1
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.put(`/products/${product_id}`, productPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        product_id = response.data.id;
    })
})

describe('Get Product filtered Route', () => {
    it('Devrait récupérer un tableau de produit selon un filtre', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.get(`/products?name=Un%20vélo%20tout%20simple2&category=1&min_price=500`);
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');
        expect(response.data).to.have.lengthOf.to.greaterThanOrEqual(1);
    })
})

describe('Create order Route', () => {
    it('Devrait créer une commande de produit', async () => {
        const orderPayload = {
            orders: [{
                productId: product_id,
                quantity: 1
            }]
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.post('/order', orderPayload);
        expect(response.status).to.equal(200);
        expect(response.data[0]).to.have.property('id');
        order_id = response.data[0].id;
    })
});

describe('Increase order count Route', () => {
    it('Devrait modifier une commande de produit', async () => {
        const orderPayload = {
            id: order_id,
            increase: true
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.put(`/order/${order_id}`, orderPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        expect(response.data.quantity).to.equal(2);
        order_id = response.data.id;
    })
});

describe('Decrease order count Route', () => {
    it('Devrait modifier une commande de produit', async () => {
        const orderPayload = {
            id: order_id,
            decrease: true
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.put(`/order/${order_id}`, orderPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        expect(response.data.quantity).to.equal(1);
        order_id = response.data.id;
    })
});

describe('Create review Route', () => {
    it('Devrait créer une review', async () => {
        const reviewPayload = {
            productId: product_id,
            rating: 5,
            comment: "Excellent produit"
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.post('/review', reviewPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        review_id = response.data.id;
    })
})

describe('Get all reviews Route', () => {
    it('Devrait récupérer toutes les reviews', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.get(`/reviews`);
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');
        expect(response.data).to.have.lengthOf.to.greaterThanOrEqual(1);
    })
})

describe('Update review Route', () => {
    it('Devrait mettre à jour une review', async () => {
        const reviewPayload = {
            rating: 2,
            description: "En fait c'est pas si bien"
        };
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.put(`/review/${review_id}`, reviewPayload);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        expect(response.data.rating).to.equal(2);
        expect(response.data.description).to.equal("En fait c'est pas si bien");
    })
})

describe('Delete review Route', () => {
    it('Devrait supprimer une review', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.delete(`/review/${review_id}`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('message');
        expect(response.data.message).to.equal('Review deleted');
    })
});




describe('Remove Order Route', () => {
    it('Devrait supprimer une commande', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.delete(`/order/${order_id}`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('message');
        expect(response.data.message).to.equal('Order deleted');
    });
});

describe('Remove Product Route', () => {
    it('Devrait supprimer un produit', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.delete(`/products/${product_id}`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('message');
        expect(response.data.message).to.equal('Product deleted');
    });
});


describe('Remove User Route', () => {
    it('Devrait supprimer un utilisateur', async () => {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.delete(`/user/${user_id}`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('message');
        expect(response.data.message).to.equal('User deleted');
    });
});

