import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './addtask.css'
import { createQR, encodeURL } from '@solana/pay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const API_BASE: string = "http://localhost:8080/";

interface AddTaskProps {
  token: string | null;
  switchPopup: () => void;
}

interface NewTask {
  title: string | undefined;
  category: string | undefined;
  description: string | undefined;
  price: string | undefined;
  reference: string | undefined;
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

function timeout(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

export default function AddTask({ token, switchPopup }: AddTaskProps) {
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [category, setCategory] = useState<string>("Content");;
  const [price, setPrice] = useState<string | undefined>();
  const [qrCode, setQrCode] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [paymentVerified, setPaymentVerified] = useState<boolean>();

  useEffect(() => {
    generateQr();
  }, []);

  const generateQr = async () => {
    // 1 - Send a POST request to our backend and log the response URL
    const res = await fetch(API_BASE + 'api/payment', { method: 'POST' });
    const { url, ref } = await res.json();
    // 2 - Generate a QR Code from the URL and generate a blob
    const qr = createQR(url);
    const qrBlob = await qr.getRawData('png');
    if (!qrBlob) return;
    // 3 - Convert the blob to a base64 string (using FileReader) and set the QR code state
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setQrCode(event.target.result);
      }
    };
    reader.readAsDataURL(qrBlob);
    // 4 - Set the reference state
    setReference(ref);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const addedTask = await addTask(token, {
      title,
      category,
      description,
      price,
      reference
    });

    if(addedTask.error) {
      alert(addedTask.error);
    } else {
      setPaymentVerified(true);
      await timeout(2000);
      switchPopup();
    }
  };

  return (
    <div className="add-task-wrapper">
      <div>
      <p className="bold-text">Create a new task</p>
      </div>
      <button className="x-button" onClick={switchPopup}><FontAwesomeIcon className="button-icon" icon={faXmark} /></button>
      <form>
        <label className="add-task-label">
          <input required className="add-task-input" placeholder="Enter task title" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
        </label>
        <label className="add-task-label">
          Task Category:
          <select className="add-task-dropdown" onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}>
            <option value="Content">Content</option>
            <option value="Development">Development</option>
          </select>
        </label>
        <label className="add-task-label">
          <input required className="add-task-input" placeholder="Enter task description" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
        </label>
        <label className="add-task-label">
          <input required className="add-task-input" placeholder="Enter task price" type="number" onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} />
        </label>
        <div className="qr-container">
          {paymentVerified ? (
            <p className="payment-verified-text">Verified</p>
          ) : (
            <p className="payment-not-verified-text">Not Verified</p>
          )}
        {qrCode && (
          <img
            src={qrCode}
            style={{ position: "relative", background: "white", width: 200, height: 200 }}
            alt="QR Code"
          />
        )}
        </div>
        <div>
          <button className="add-task-submit" onClick={handleSubmit}><p className="bold-text">Verify Payment and Continue</p></button>
        </div>
      </form>
    </div>
  );
}
