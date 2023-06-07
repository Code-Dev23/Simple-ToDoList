const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Configurazione del JSON Server
const router = jsonServer.router('db.json');
app.use('/api', router);

// Aggiungi un gestore di route per l'HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});