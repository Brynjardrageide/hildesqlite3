document.addEventListener("DOMContentLoaded", () => {
    getAllData();


});

// async function getAllData() {
//     const fetch_response = await fetch('/api/tasks');
//     const data = await fetch_response.json();
//     console.log(data);
// }

// fetch('/api/tasks').then(response => response.json())
// .then(data => {
//         if (data.tasks && data.tasks.length > 0) {
//             const taskList = document.getElementById('taskList');
//             console.log(data.tasks.length);

//             data.tasks.forEach(task => {
//                 const div = document.createElement('div');
//                 div.textContent = `${task.title}, ${task.description}, ${task.due_date}, ${task.status}`;
//                 div.classList.add("task");
//                 taskList.appendChild(div);
//             });
            
//         } else {
//             console.log('No tasks found.');
//         }
//     })
//     .catch(error => console.error('Error:', error));