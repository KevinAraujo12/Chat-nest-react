import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';

const socket = io();

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = () => {
    if (username) {
      setIsLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message) {
      socket.emit('message', { username, message });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className='container'>
      <h2 className='title'>Chat - 💬</h2>

      {!isLoggedIn ? (
        <div className='loginContainer'>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome:"
            className='input'
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />
          <button onClick={handleLogin} className='button'>Entrar</button>
        </div>
      ) : (
        <div className='chatContainer'>
          <div className='messageContainer'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className="message"
                style={{
                  alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.username === username ? '#d1f5d3' : '#d1e7ff',
                }}
              >
                <strong className='username'>{msg.username}:</strong>
                <p className='text'>{msg.message}</p>
              </div>
            ))}
            {}
            <div ref={messagesEndRef} />
          </div>
          <div className='inputContainer'>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem"
              className='input'
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage} className='button'>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
