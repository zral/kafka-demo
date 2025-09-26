import React, { useState, useEffect } from 'react';

function App() {
  // Node.js services
  const [nodeMessage, setNodeMessage] = useState('');
  const [nodeMessages, setNodeMessages] = useState([]);
  const [nodeError, setNodeError] = useState('');
  const sendNodeMessage = async () => {
    await fetch('/api/node-producer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: nodeMessage })
    });
    setNodeMessage('');
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/node-consumer/messages');
        if (!res.ok) {
          setNodeError('Node.js consumer not available');
          setNodeMessages([]);
          return;
        }
        const data = await res.json();
        setNodeMessages(data);
        setNodeError('');
      } catch (e) {
        setNodeError('Node.js consumer not available');
        setNodeMessages([]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Python services
  const [pyMessage, setPyMessage] = useState('');
  const [pyMessages, setPyMessages] = useState([]);
  const [pyError, setPyError] = useState('');
  const sendPyMessage = async () => {
    await fetch('/api/producer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: pyMessage })
    });
    setPyMessage('');
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/consumer/messages');
        if (!res.ok) {
          setPyError('Python consumer not available');
          setPyMessages([]);
          return;
        }
        const data = await res.json();
        setPyMessages(data);
        setPyError('');
      } catch (e) {
        setPyError('Python consumer not available');
        setPyMessages([]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      <div>
        <h2>Node.js Producer/Consumer</h2>
        <input value={nodeMessage} onChange={e => setNodeMessage(e.target.value)} />
        <button onClick={sendNodeMessage}>Send</button>
        {nodeError && <div style={{color:'red'}}>{nodeError}</div>}
        <ul>
          {nodeMessages.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
      <div>
        <h2>Python Producer/Consumer</h2>
        <input value={pyMessage} onChange={e => setPyMessage(e.target.value)} />
        <button onClick={sendPyMessage}>Send</button>
        {pyError && <div style={{color:'red'}}>{pyError}</div>}
        <ul>
          {pyMessages.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;