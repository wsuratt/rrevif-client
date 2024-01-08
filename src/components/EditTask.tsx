import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './addtask.css'
import './review.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const API_BASE: string = "http://localhost:8080/";

interface EditTaskProps {
  token: string | null;
  setPopup: (arg0: boolean) => void;
  task: any[]
} 

interface EditedTask {
  title: string | undefined;
  description: string | undefined;
  price: string | undefined;
}

async function editTask(token: string | null, task_id: string, edited_task: EditedTask) {
  if(token) {
    return fetch(API_BASE + "api/task/edit" + task_id, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(edited_task)
    })
      .then(data => data.json())
  }
}

export default function EditTask({ token, setPopup, task }: EditTaskProps) {
  const [title, setTitle] = useState<string>(task[0]?.task_title);
  const [price, setPrice] = useState<string>(task[0]?.task_price);
  const [description, setDescription] = useState<string>(task[0]?.task_description);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPopup(false);
    const editedTask = await editTask(token, task[0]?.id, {
      title, 
      description, 
      price,
    });
    if(editedTask.error) {
      alert(editedTask.error);
    }
  };

  return (
    <>
      <div className="profile-dimmed" />
      <div className="add-task-wrapper">
        <div>
          <p className="bold-text">{`Edit ${title}`}</p>
        </div>
        <button className="x-button" onClick={e => setPopup(false)}><FontAwesomeIcon className='button-icon' icon={faXmark}/></button>
        <form onSubmit={handleSubmit}>
          <label className='add-task-label'>
            <input required className="add-task-input" placeholder="Enter task title" value={title} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
          </label>
          <label className='add-task-label'>
            <input required className="add-task-input" placeholder="Enter task description" value={description} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
          </label>
          <label className='add-task-label'>
            <input required className="add-task-input" placeholder="Enter task title" value={price} type="number" onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} />
          </label>
          <div>
            <button className="add-task-submit" type="submit"><p className="bold-text">Submit Changes</p></button>
          </div>
        </form>
      </div>
    </>
  )
}
