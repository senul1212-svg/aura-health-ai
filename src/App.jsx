import React, { useState } from 'react';
import { 
  Search, Stethoscope, Activity, ShieldAlert, Bot, Send, User, 
  BookOpen, Sparkles, HeartPulse, Brain, Zap, Thermometer, 
  Info, ChevronRight, X, RefreshCw, Flame, Eye, Sun, Moon, 
  CheckCircle2, AlertTriangle, Menu, Droplet 
} from 'lucide-react';

// --- COMPREHENSIVE DISEASE DATABASE ---
const DISEASE_DATABASE = [
  {
    id: "coronary-artery-disease",
    name: "Coronary Artery Disease (CAD)",
    category: "Cardiovascular",
    symptoms: ["chest pain", "shortness of breath", "fatigue", "lightheadedness"],
    description: "Narrowed heart arteries reducing blood flow to the heart muscle.",
    severity: "High",
    urgency: "Seek medical evaluation promptly"
  },
  {
    id: "hypertension",
    name: "Hypertension (High Blood Pressure)",
    category: "Cardiovascular",
    symptoms: ["headache", "shortness of breath", "nosebleeds", "dizziness"],
    description: "Persistently high arterial blood pressure, often symptomless in early stages.",
    severity: "Moderate to High",
    urgency: "Routine medical checkup and lifestyle adjustment"
  },
  {
    id: "stroke",
    name: "Stroke / Cerebrovascular Event",
    category: "Cardiovascular",
    symptoms: ["facial drooping", "arm weakness", "slurred speech", "sudden numbness"],
    description: "Interrupted blood flow or bleeding within brain tissue.",
    severity: "Critical",
    urgency: "Emergency care required immediately (Call emergency services)"
  },
  {
    id: "pneumonia",
    name: "Lower Respiratory Infection / Pneumonia",
    category: "Respiratory",
    symptoms: ["cough with phlegm", "fever", "chills", "difficulty breathing", "chest pain"],
    description: "Infection inflaming air sacs in one or both lungs.",
    severity: "Moderate to Severe",
    urgency: "Requires medical diagnosis and potential antibiotic/antiviral therapy"
  },
  {
    id: "copd",
    name: "Chronic Obstructive Pulmonary Disease (COPD)",
    category: "Respiratory",
    symptoms: ["chronic cough", "wheezing", "chest tightness", "shortness of breath"],
    description: "Progressive lung condition causing airflow blockage and breathing issues.",
    severity: "High",
    urgency: "Long-term medical management required"
  },
  {
    id: "asthma",
    name: "Bronchial Asthma",
    category: "Respiratory",
    symptoms: ["wheezing", "breathlessness", "chest tightness", "nighttime coughing"],
    description: "Chronic inflammation of the airways causing reversible airflow obstruction.",
    severity: "Moderate to High",
    urgency: "Manage with inhalers and seek urgent care during severe flare-ups"
  },
  {
    id: "type-2-diabetes",
    name: "Type 2 Diabetes Mellitus",
    category: "Metabolic",
    symptoms: ["increased thirst", "frequent urination", "unexplained weight loss", "fatigue"],
    description: "Chronic condition impairing the body's ability to process blood glucose.",
    severity: "Moderate to High",
    urgency: "Requires clinical blood testing (HbA1c) and lifestyle/pharmacological plan"
  },
  {
    id: "iron-deficiency-anemia",
    name: "Iron Deficiency Anemia",
    category: "Nutritional / Hematologic",
    symptoms: ["extreme fatigue", "pale skin", "cold hands and feet", "brittle nails", "dizziness"],
    description: "Lack of sufficient healthy red blood cells due to insufficient iron levels.",
    severity: "Mild to Moderate",
    urgency: "Blood count testing and dietary/iron supplementation"
  },
  {
    id: "hypothyroidism",
    name: "Hypothyroidism",
    category: "Endocrine",
    symptoms: ["fatigue", "weight gain", "dry skin", "sensitivity to cold", "muscle weakness"],
    description: "Underactive thyroid gland producing insufficient thyroid hormone.",
    severity: "Moderate",
    urgency: "Medical evaluation for hormone replacement therapy"
  },
  {
    id: "tuberculosis",
    name: "Tuberculosis (TB)",
    category: "Infectious",
    symptoms: ["persistent cough lasting >3 weeks", "coughing up blood", "night sweats", "fever"],
    description: "Contagious bacterial infection primarily affecting the lungs.",
    severity: "High",
    urgency: "Requires strict antibiotic regimen under medical supervision"
  },
  {
    id: "malaria",
    name: "Malaria",
    category: "Infectious",
    symptoms: ["high fever", "shivering chills", "profuse sweating", "headache", "nausea"],
    description: "Mosquito-borne parasitic infection affecting red blood cells.",
    severity: "High",
    urgency: "Immediate antimalarial treatment required"
  },
  {
    id: "migraine",
    name: "Migraine",
    category: "Neurological",
    symptoms: ["throbbing headache", "nausea", "sensitivity to light", "sensitivity to sound"],
    description: "Recurrent neurological condition causing severe throbbing head pain.",
    severity: "Moderate",
    urgency: "Targeted medication and trigger management"
  },
  {
    id: "osteoarthritis",
    name: "Osteoarthritis",
    category: "Musculoskeletal",
    symptoms: ["joint pain", "stiffness", "reduced flexibility", "grating sensation in joints"],
    description: "Degenerative joint disease caused by breakdown of joint cartilage.",
    severity: "Moderate",
    urgency: "Physical therapy, joint care, and pain management"
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your Aura AI Medical Operator. Describe any symptoms, discomforts, or deficiency suspicions you are experiencing.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'Cardiovascular', 'Respiratory', 'Metabolic', 'Nutritional / Hematologic', 'Endocrine', 'Infectious', 'Neurological', 'Musculoskeletal'];

  const filteredDiseases = DISEASE_DATABASE.filter(disease => {
    const matchesCategory = selectedCategory === 'All' || disease.category === selectedCategory;
    const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          disease.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', content: textToSend }];
    setChatMessages(newMessages);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    // Reads securely from your local .env file (VITE_GEMINI_API_KEY)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are an expert, empathetic Medical Symptom Analysis AI Operator integrated into AuraHealth. Assess user-reported symptoms, nutritional deficiencies, and physical discomforts. Provide structured, clear response with markdown formatting:
1. **Assessment & Follow-up Questions**: Briefly acknowledge and ask 1-2 key clarifying questions.
2. **Identifiable Conditions / Deficiencies**: List 2 to 3 most probable matching conditions.
3. **Recommended Next Steps & Self-Care**: Practical, non-medical recommendations.
4. **Emergency Warning Signs**: When to seek immediate emergency care.
Maintain a professional, objective, and supportive tone. Include a disclaimer that this is AI-assisted information and not a formal diagnosis.`;

    const formattedContents = newMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...formattedContents
          ]
        })
      });

      const data = await response.json();
      let aiText = "I'm sorry, I couldn't process your symptoms right now. Please try again or consult a healthcare professional directly.";

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered a connection issue. Please verify your API setup and network connection." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AuraHealth AI
              </h1>
              <p className="text-xs text-cyan-400 font-medium">Diagnostic Knowledge Engine</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-slate-400">System Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Operator Chat */}
        <section className="lg:col-span-7 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-950 border border-cyan-800/50 rounded-lg text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-100">Aura AI Medical Operator</h2>
                <p className="text-xs text-slate-400">Describe symptoms or deficiency suspicions</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-medium">
              Online
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 max-h-[500px]">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-slate-800/70 border border-slate-700/60 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-sm p-3 bg-slate-800/40 rounded-xl w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Analyzing symptoms...</span>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={() => handleSendMessage("I feel constant tiredness, cold hands, and dry skin. What deficiency could this be?")}
              className="text-xs bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <span>💡 Fatigue & Cold Hands</span>
            </button>
            <button 
              onClick={() => handleSendMessage("I have a throbbing headache and light sensitivity.")}
              className="text-xs bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <span>💡 Throbbing Headache</span>
            </button>
            <button 
              onClick={() => handleSendMessage("What are the differences between Vitamin D deficiency and Iron deficiency?")}
              className="text-xs bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <span>💡 Vitamin D vs Iron Deficiency</span>
            </button>
          </div>

          {/* Input Form */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe symptoms, duration, or suspected deficiencies..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-100 placeholder-slate-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-xl transition-colors shadow-lg shadow-cyan-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            Powered by Gemini AI • Always verify with qualified medical doctors.
          </p>
        </section>

        {/* Right Column: Disease Reference Library */}
        <section className="lg:col-span-5 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800">
            <div className="p-2 bg-blue-950 border border-blue-800/50 rounded-lg text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100">Medical Knowledge Library</h2>
              <p className="text-xs text-slate-400">Explore core disease classifications</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search diseases or symptoms..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-100 placeholder-slate-500"
              />
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-cyan-500 text-slate-950 font-semibold' 
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Disease Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[500px]">
            {filteredDiseases.map((disease) => (
              <div key={disease.id} className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-200 text-sm">{disease.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    disease.severity.includes('High') || disease.severity.includes('Critical')
                      ? 'bg-red-950/60 border-red-800 text-red-400'
                      : 'bg-amber-950/60 border-amber-800 text-amber-400'
                  }`}>
                    {disease.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{disease.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {disease.symptoms.map((sym, i) => (
                    <span key={i} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {sym}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-cyan-400/90 font-medium flex items-center space-x-1">
                  <ChevronRight className="w-3 h-3" />
                  <span>{disease.urgency}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;