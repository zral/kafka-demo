import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    await fetch('/api/producer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    setMessage('');
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/consumer/messages');
      const data = await res.json();
      setMessages(data);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </div>
  );
}

export default App;