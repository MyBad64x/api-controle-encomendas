# api-controle-encomendas
# API REST - Controle de Encomendas (Node.js & Express)

Uma API REST completa desenvolvida para gerenciar de forma dinâmica o fluxo de pedidos e encomendas de uma confeitaria artesanal. O projeto simula operações de um banco de dados na memória do servidor para realizar o ciclo completo de um CRUD.

---

## Tecnologias Utilizadas

* **Node.js** (Ambiente de execução JavaScript no servidor)
* **Express** (Framework minimalista para rotas e requisições HTTP)
* **Thunder Client / Postman** (Ferramentas para testes de endpoints)
* **JavaScript (ES6+)**

---

## Funcionalidades

A API aceita e responde requisições puramente em formato **JSON** na porta `3000` (`http://localhost:3000`), contendo as seguintes rotas:

| Método | Rota | Descrição | Status HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/encomendas` | Lista todas as encomendas cadastradas. | `200 OK` |
| **POST** | `/encomendas` | Cadastra um novo pedido (Cliente, Doce, Qtd, Valor). | `201 Created` |
| **PUT** | `/encomendas/:id` | Atualiza o status de um pedido específico por ID. | `200 OK` / `404` |
| **DELETE** | `/encomendas/:id` | Remove uma encomenda do sistema através do ID. | `200 OK` / `404` |

---

## Como Executar e Testar Localmente

Se você quiser baixar e rodar este projeto na sua máquina, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/MyBad64xapi-controle-encomendas.git](https://github.com/MyBad64x/api-controle-encomendas.git)
