import { ChangeEvent, FormEvent, useState } from 'react';
import './addtask.css'

const API_BASE: string = "http://localhost:8080/";

interface AddTaskProps {
  token: string | null;
}

interface NewTask {
  title: string | undefined;
  description: string | undefined;
  price: string | undefined;
}

async function addTask(token: string | null, new_task: NewTask) {
  if(token) {
    return fetch(API_BASE + "api/new-task", {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(new_task)
    })
      .then(data => data.json())
  }
}

export default function AddTask({ token }: AddTaskProps) {
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const addedTask = await addTask(token, {
      title,
      description,
      price
    });

    if(addedTask.error) {
      alert(addedTask.error);

    }
  };

  return (
    <div className="login-wrapper">
      <p className="bold-text">Create a new task</p>
      <form onSubmit={handleSubmit}>
        <label className="login-label">
          <input className="login-input" placeholder="Enter task title" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
        </label>
        <label className="login-label">
          <input className="login-input" placeholder="Enter task description" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
        </label>
        <label className="login-label">
          <input className="login-input" placeholder="Enter task price" type="number" onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} />
        </label>
        <div>
          <button className="login-submit" type="submit"><p className="bold-text">Continue</p></button>
        </div>
      </form>
    </div>
  );
}
