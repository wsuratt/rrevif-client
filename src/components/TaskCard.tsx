import { FormEvent } from 'react';
import './taskcard.css'

const API_BASE: string = "http://localhost:8080/";

interface TaskCardProps {
  task: any,
  token: string | null;
}

interface TaskId {
  task_id: string | undefined;
}

async function updateTaskSolver(token: string | null, task_id: TaskId) {
  console.log(task_id);
  if(token) {
    return fetch(API_BASE + "api/update-task-solver", {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task_id)
    })
      .then(data => data.json())
  }
}

const TaskCard = ({ task, token }: TaskCardProps) => {
  const handleClaim = async (e: FormEvent) => {
    e.preventDefault();

    const task_id = task.id;
    
    const updatedTask = await updateTaskSolver(token, {
      task_id
    });

    if(updatedTask.error) {
      alert(updatedTask.error);

    }
  };

  return (
    <a>
      <div className="task-container">
        <h1>{task.task_title}</h1>
        <p>{task.task_description}</p>
        <p>{task.task_price}</p>
      </div>
      <div>
        <button onClick={handleClaim}><p className="bold-text">Claim</p></button>
      </div>
    </a>
  )
}

export default TaskCard;
  