// ChatBotComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [conversationStarters, setConversationStarters] = useState([]);

    useEffect(() => {
        // Fetch chatbot config to get conversation starters
        axios.get('http://localhost:5000/chat/config')
        .then(response => {
            setConversationStarters(response.data.conversation_starters);
        })
        .catch(error => console.error('Error fetching config:', error));
    }, []);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);

        axios.post('http://localhost:5000/chat/message', {
        message: input
        })
        .then(response => {
            const botReply = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botReply]);
            setInput('');
        })
        .catch(error => console.error('Error sending message:', error));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Well Wise Chatbot</h1>
            <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Conversation Starters:</h2>
            <div className="flex flex-wrap gap-2">
                {conversationStarters.map((starter, index) => (
                <button
                    key={index}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setInput(starter)}
                >
                    {starter}
                </button>
                ))}
            </div>
            </div>
            <div className="h-64 overflow-y-auto border p-4 rounded mb-4">
            {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}> 
                <span className={msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}>
                    {msg.content}
                </span>
                </div>
            ))}
            </div>
            <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded"
            />
            <button
                onClick={handleSendMessage}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Send
            </button>
            </div>
        </div>
        </div>
    );
};

export default ChatBotComponent;