const express = require('express');
const mysql = require('mysql2/promise.js');

const app = express();
const PORT = 3000;

app.use(express.json());

// config do DB
const dbConfig = {

    host: 'localhost',
    user: 'root',
    password: '102030abcdE#',
    database: 'todo_app',
    // port: 3306
}

app.post('/tasks', async(req, res)=>{

    try {
        const conection = await mysql.createConnection(dbConfig);
        const { description } = req.body;

        const [result] = await conection.execute(
            'INSERT INTO tasks (description) VALUES (?)',
            [description]
        );

        await conection.end();
        console.log(description);
        res.status(201).json({id: result.insertId, description, completed: false});

    } catch (error) {
        console.error('Erro ao criar tarefa: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
})




app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

app.get('/tasks', async (req, res)=>{

    try {
        const conection = await mysql.createConnection(dbConfig);
        const [rows] = await conection.execute('SELECT * FROM tasks');
        await conection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar tarefas: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }

})