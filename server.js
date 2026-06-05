const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bem-vindo a API de controle de encomendas!');
});

//Banco de dados
let encomendas = [
    {id: 1, cliente: "Fulana de tal", doce: "Bolo de Aniversáio", quantidade: 1, valor: 150.00, status: "Pendente" },
    {id: 2, cliente: "Fulano de tal", doce: "Brigadeiros Gourmet", quantidade: 50, valor: 100.00, status: "Pronto" }
];

//rota para listar encomendas
app.get('/encomendas', (req, res) => {
    res.json(encomendas);
})

//criar uma nova encomenda
app.post('/encomendas', (req, res) => {
    const { cliente, doce, quantidade, valor} = req.body;

    //confirmação para o cliente enviar os dados
    if (!cliente || !doce || !quantidade || !valor) {
        return res.status(400).json({ erro: "Por favor, preencha todos os campos do pedido"})
    }

    const novaencomenda = {
        id: encomendas.length + 1,
        cliente,
        doce,
        quantidade,
        valor,
        status: "Pendente"
    };
    encomendas.push(novaencomenda);
    res.status(201).json(novaencomenda);
})

//atualizar status de um pedido
app.put('/encomendas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido fornecido na URL." });
    }

    const encomenda = encomendas.find(e => e.id === id);

    if (!encomenda) {
        return res.status(404).json({ erro : `Encomenda com o ID ${id} não encontrada.`});
    }

    if (status) {
        encomenda.status = status;
    }

    res.json({ mensagem: "Status atualizado com sucesso!", encomenda });
});

//remover um pedido
app.delete('/encomendas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido fornecido na URL."});
    };

    const index = encomendas.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Encomenda não encontrada."});
    };

    encomendas.splice(index, 1);
    res.json({ mensagem: "Encomenda removida com sucesso!"});
});

//inicializa o servidor na porta 3000
app.listen(PORT, () => {
    console.log(`Servidor de encomendas rodando em http://localhost:${PORT}`);
});