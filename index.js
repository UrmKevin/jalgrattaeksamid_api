const express = require('express');
const cors = require('cors');  // Подключение библиотеки cors
const app = express();
const port = 8080;
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

// Использование cors как middleware
app.use(cors());

app.use(express.json());

const eksamid = [
    { id: 1, koht: "Pealinn tee 32", eksamineerija: "Alice Mandragorava", aeg: "2023-01-16 11:23:20" },
    { id: 2, koht: "Paldiski tee 10", eksamineerija: "Danila Oranra", aeg: "2023-03-22 14:36:21" },
    { id: 3, koht: "Vikkerkaare 10", eksamineerija: "Artur Korob", aeg: "2023-08-01 18:45:12" },
    { id: 4, koht: "Lasnamae 2", eksamineerija: "Emma Poluska", aeg: "2023-04-12 08:15:20" },
    { id: 5, koht: "Tartu tee 5", eksamineerija: "Sander Mru", aeg: "2023-09-05 21:10:22" }
];

app.get('/eksamid', (req, res) => {
    res.send(eksamid);
});

app.get('/eksamid/:id', (req, res) => {
    if (typeof eksamid[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "User not found" });
    }
    res.send(eksamid[req.params.id - 1]);
});

app.post('/eksamid', (req, res) => {
    if (!req.body.koht || !req.body.eksamineerija || !req.body.aeg) {
        return res.status(400).send({ error: 'One or all params are missing' });
    }
    let user = {
        id: eksamid.length + 1,
        koht: req.body.koht,
        eksamineerija: req.body.eksamineerija,
        aeg: req.body.aeg,
    };
    eksamid.push(user);

    res.status(201)
        .location(`${getBaseUrl(req)}/eksamid/${eksamid.length}`)
        .send(user);
});

app.delete('/eksamid/:id', (req, res) => {
    if (typeof eksamid[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "User not found" });
    }

    eksamid.splice(req.params.id - 1, 1);

    res.status(204).send({ error: "No content" });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`;
}
