const express = require('express');
const { z } = require('zod');
const app = express();
const PORT = 3000;
app.use(express.json());
//validação para encomenda usando zod
const encomendaschema = z.object({
    cliente: z.string().min(3, { message: "O nome do cliente deve ter pelo menos 3 caracteres"}),
    doce: z.string().min(1, { message: "o nome do doce é obrigatório"}),
    quantidade: z.number().int().positive({ message: "a quantidade deve ser um numero maior que zero"}),
    valor: z.number().positive({ message: "o valor deve ser um numero maior que zero"})
});

//validacao do status da encomenda
const atualizastatuseschema = z.object({
    status: z.enum(["Pendente", "Pronto", "Enviado"], {
        errorMap: () => ({ message: "O status deve ser exatamente: 'Pendente', 'Pronto' ou 'Enviado' "})
    })
})

//gerar o código de rastreio automático
function gerarcodigorastreio() {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letra1 = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    const letra2 = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    const numeros = Math.floor(100000000 + Math.random() * 900000000);
    return `${letra1}${letra2}${numeros}BR`;
}

app.get('/', (req, res) => {
    res.send('Bem-vindo a API de controle de encomendas!');
});

//Banco de dados
let encomendas = [
    {id: 1, cliente: "Fulana de tal", doce: "Bolo de Aniversário", quantidade: 1, valor: 150.00, status: "Pendente", codigorastreio: "PA123456789BR" },
    {id: 2, cliente: "Fulano de tal", doce: "Brigadeiros Gourmet", quantidade: 50, valor: 100.00, status: "Pronto", codigorastreio: "RE987654321BR" }
];

//rota para listar encomendas
app.get('/encomendas', (req, res) => {
    res.json(encomendas);
})

app.get('/encomendas/rastreio/:codigo', (req, res) => {
    const codigobusca = req.params.codigo.toUpperCase();
    const encomenda = encomendas.find(e => e.codigorastreio === codigobusca);

    if (!encomenda) {
        return res.status(404).json({ erro: `Encomenda com o codigo de rastreio ${codigobusca} não encontrada.`})
    }
    res.json(encomenda);
})

//criar uma nova encomenda
app.post('/encomendas', (req, res) => {
    
    //safeparse valida a requisição sem derrubar o servidor inteiro case resulte em erro
    const validacao = encomendaschema.safeParse(req.body);

    if (!validacao.success) {
        return res.status(400).json({
            erro: "Dados de envio inválidos",
            detalhes: validacao.error.flatten().fieldErrors
        });
    }

    const { cliente, doce, quantidade, valor } = validacao.data;

    const novaencomenda = {
        id: encomendas.length + 1,
        cliente,
        doce,
        quantidade,
        valor,
        status: "Pendente",
        codigorastreio: gerarcodigorastreio()
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

    const validacao = atualizastatuseschema.safeParse(req.body);

    if (!validacao.success) {
        return res.status(400).json({
            erro: "Status inválido",
            detalhes: validacao.error.flatten().fieldErrors
        });
    }

    encomenda.status = validacao.data.status;
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
 if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor de encomendas rodando em http://localhost:${PORT}`);
    });
 }

module.exports = app;