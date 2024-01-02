import { FormEvent } from 'react';
import './taskcard.css'
import { Link } from 'react-router-dom';

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
    <Link to={`/task/` + (task.id)}>
      <div className="task-container">
        <div className="task-header-wrapper">
          <p className="task-header">{task.task_title}</p>
          <p className="task-price">{`$${(Math.round(task.task_price * 100) / 100).toFixed(2)}`}</p>
        </div>
        <p className="task-description">{task.task_description}</p>
        <button className="bold-text task-claim-button" onClick={handleClaim}>Claim</button>
      </div>
    </Link>
  )
}

export default TaskCard;
  