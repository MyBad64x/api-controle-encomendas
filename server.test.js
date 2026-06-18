const request = require('supertest');
const app = require('./server');

describe('Testes da API de controle de encomendas', () => {

    //teste de listagem
    it('Deve listar todas as encomendas com status 200 (GET /encomendas)', async () => {
        const res = await request(app).get('/encomendas');
        expect(res.statusCode) .toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    //teste 2: criação de encomenda valida com zoid e rastreio
    it('Deve criar uma encomenda e gerar código de rastreio (POST /encomendas)', async () => {
        const novaencomenda = {
            cliente: "Carlos Silva",
            doce: "Pastéis de Nata",
            quantidade: 12,
            valor: 24.00
        };

        const res = await request(app)
            .post('/encomendas')
            .send(novaencomenda);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.cliente).toEqual("Carlos Silva");
    });
});