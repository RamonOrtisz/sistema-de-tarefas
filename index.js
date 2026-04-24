const express = require('express');
const mysql = require('mysql2/promise.js');

const app = express();
const PORT = 3000;

app.use(express.json());

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// config do DB
require('dotenv').config();
const dbConfig = {

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
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

app.put('/tasks/:id', async (req, res)=> {
    try {
        const conection = await mysql.createConnection(dbConfig);

        const { id } = req.params;
        const { description, completed } = req.body;
        const [result] = await conection.execute(
            'UPDATE tasks SET description = ?, completed = ? WHERE id = ?',
            [description, completed, id]
        );
        await conection.end();

        if(result.affectedRows === 0) {
            return res.status(404).json({error: 'Tarefa não encontrada'});
        } 
        res.json({message: 'Tarefa atualizada com sucesso'});



    } catch (error) {
        console.error('Erro ao atualizar tarefas: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }

})

app.delete('/tasks/:id', async (req, res)=> {
    try {
        const conection = await mysql.createConnection(dbConfig);
        const {id} = req.params;
        const [result] = await conection.execute(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        )
        await conection.end()

        if(result.affectedRows === 0) {
            return res.status(404).json({error: 'Tarefa não encontrada'});
        } 
        res.json({message: 'Tarefa deletada com sucesso'});

    } catch (error) {
        console.error('Erro ao deletar tarefas: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
})





app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});