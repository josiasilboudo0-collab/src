import React, { useState, useEffect } from 'react';
import { BookOpen, Presentation as PptIcon, Plus, BrainCircuit, Loader2, BarChart3, Moon, Sun, Zap } from 'lucide-react';
import { generateExpertStructure, writeExpertChapter } from './geminiService';
import { jsPDF } from 'jspdf';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [genSubject, setGenSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const session = localStorage.getItem('genia_session');
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  const handleLogin = (email: string) => {
    const user = { uid: "123", email, quota: 1, plan: 'free' };
    setCurrentUser(user);
    localStorage.setItem('genia_session', JSON.stringify(user));
  };

  const generateEbook = async () => {
    if (!genSubject) return;
    setIsGenerating(true);
    try {
      setStatusMessage("Analyse du sujet...");
      const structure = await generateExpertStructure(genSubject, 'ebook', 'français');
      const doc = new jsPDF();
      doc.text(genSubject, 10, 10);
      doc.save("mon-ebook.pdf");
      alert("Téléchargement réussi !");
    } catch (e) {
      alert("Erreur");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <BrainCircuit className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-6">Geni AI Studio</h1>
        <input type="email" id="email" placeholder="votre@email.com" className="w-full p-4 border rounded-xl mb-4" />
        <button onClick={() => handleLogin((document.getElementById('email') as any).value)} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Démarrer</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="font-black text-xl mb-8 flex items-center gap-2"><BrainCircuit /> GENI AI</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('generate')} className="w-full text-left p-3 font-bold bg-blue-600 text-white rounded-lg">Créer</button>
          <button onClick={() => setActiveTab('pro')} className="w-full text-left p-3 font-bold text-slate-400">Premium</button>
        </nav>
      </aside>
      <main className="flex-grow p-12 text-center">
        <h1 className="text-3xl font-black mb-8">Nouveau Projet</h1>
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
          <input value={genSubject} onChange={(e) => setGenSubject(e.target.value)} placeholder="Sujet de l'ebook..." className="w-full p-4 bg-slate-100 rounded-xl mb-6 font-bold" />
          <button onClick={generateEbook} disabled={isGenerating} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
            {isGenerating ? statusMessage : "Générer mon Ebook"}
          </button>
        </div>
      </main>
    </div>
  );
}
