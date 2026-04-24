const API_URL = 'http://localhost:3000/tasks';


const taskForm = document.getElementById('taskForm');
const pedingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');

//CARREGAR TAREFAS
async function loadTasks() {
    pedingTasks.innerHTML = '';
    completedTasks.innerHTML = '';

    const res = await fetch(API_URL);
    const tasks = await res.json();

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${task.description}</span>
            <div>
            ${
                task.completed 
                ? `
                <button class="action toggle" onclick="toggleTask(${task.id}, ${task.completed})">Reabrir</button>
                <button class="action delete" onclick="deleteTask(${task.id})">Excluir</button>
                `
                :`
                <button class="action toggle" onclick="toggleTask(${task.id}, ${task.completed})">Concluir</button>
                <button class="action edit" onclick="editTask(${task.id}, ${task.description})"> Editar</button>
                <button class="action delete" onclick="deleteTask(${task.id})" >Excluir</button>
                `
            }
            </div>
        `;

        if(task.completed) {
            completedTasks.appendChild(li);
        } else {
            pedingTasks.appendChild(li);
        }
    })
}

//ADICIONAR TAREFAS
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( {description} )
    });

    taskForm.reset();
    loadTasks();

});






//EDITAR tarefas
// async function editTask(id, currentDescription) {

//     const newDesc = prompt('Editar descrição: ', currentDescription);
//     if(newDesc && newDesc.trim() !== '') {
//         await fetch(`${API_URL}/${id}`,{

//             method: "PUT",
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({description: newDesc, completed: false})
//         })
//     }

// }