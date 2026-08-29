import { useState } from 'react';
import { Link } from 'react-router-dom';
import { askAssistant } from '../services/assistantService';

function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm the NovaCart AI shopping assistant. Ask me about products, and I'll help you find what you need." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const question = input;
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const result = await askAssistant(question);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: result.answer, sources: result.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="text-blue-400 text-sm">&larr; Back to products</Link>
        <h1 className="text-white text-xl font-bold mt-2">NovaCart AI Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p>{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                  Sources: {msg.sources.map((s) => s.title).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm">Assistant is thinking...</p>}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-800 max-w-2xl mx-auto w-full flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Assistant;