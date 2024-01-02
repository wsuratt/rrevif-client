import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './addtask.css'
import { createQR, encodeURL } from '@solana/pay';

const API_BASE: string = "http://localhost:8080/";

interface AddTaskProps {
  token: string | null;
  switchPopup: () => void;
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

export default function AddTask({ token, switchPopup }: AddTaskProps) {
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [qrCode, setQrCode] = useState<string>();
  const [count, setCount] = useState<string>('');

  useEffect(() => {
    generateQr();
  }, []);

  const generateQr = async () => {
    const apiUrl = `${window.location.protocol}/${window.location.host}/api/pay`;
    const label = 'label';
    const message = 'message';
    const url = encodeURL({ link: new URL(apiUrl), label, message });
    const qr = createQR(url);
    const qrBlob = await qr.getRawData('png');
    if (!qrBlob) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setQrCode(event.target.result);
      }
    };
    reader.readAsDataURL(qrBlob);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    switchPopup();
    
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
    <div className="add-task-wrapper">
      <div>
      <p className="bold-text">Create a new task</p>
      </div>
      <button className="x-button" onClick={switchPopup}>x</button>
      <form onSubmit={handleSubmit}>
        <label className="add-task-label">
          <input className="add-task-input" placeholder="Enter task title" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
        </label>
        <label className="add-task-label">
          <input className="add-task-input" placeholder="Enter task description" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
        </label>
        <label className="add-task-label">
          <input className="add-task-input" placeholder="Enter task price" type="number" onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} />
        </label>
        {qrCode && (
          <img
            src={qrCode}
            style={{ position: "relative", background: "white", width: 200, height: 200 }}
            alt="QR Code"
          />
        )}
        <div>
          <button className="add-task-submit" type="submit"><p className="bold-text">Continue</p></button>
        </div>
      </form>
    </div>
  );
}
