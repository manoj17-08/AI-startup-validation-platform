import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ListChecks, Zap } from 'lucide-react';

interface InputSectionProps {
    onSubmit: (idea: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit }) => {
    const [mode, setMode] = useState<'vague' | 'detailed'>('vague');
    const [idea, setIdea] = useState('');
    
    const [coreConcept, setCoreConcept] = useState('');
    const [targetUsers, setTargetUsers] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [monetization, setMonetization] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'vague') {
            if (idea.trim()) {
                onSubmit(idea);
            }
        } else {
            if (coreConcept.trim() || targetUsers.trim() || problemStatement.trim() || monetization.trim()) {
                const combined = `
Core Concept:
${coreConcept}

Target Users:
${targetUsers}

Problem Statement:
${problemStatement}

Monetization / Business Model:
${monetization}
                `.trim();
                onSubmit(combined);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
                    <Sparkles size={16} />
                    <span>AI-Powered Startup Validator</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-6 pb-2">
                    Validate Your Next <br /> Big Idea
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                    Instant feedback from a team of AI experts. Determine your startup's fate in seconds.
                </p>
            </motion.div>

            {/* Mode Switcher */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 mb-8 z-10 relative"
            >
                <button
                    onClick={() => setMode('vague')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        mode === 'vague' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <Zap size={16} />
                    Quick Idea
                </button>
                <button
                    onClick={() => setMode('detailed')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        mode === 'detailed' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <ListChecks size={16} />
                    Detailed Blueprint
                </button>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="w-full max-w-2xl relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-6 overflow-hidden">
                    
                    <AnimatePresence mode="wait">
                        {mode === 'vague' ? (
                            <motion.div
                                key="vague"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="Describe your startup idea vaguely..."
                                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-lg px-6 py-4 outline-none placeholder:text-slate-500 focus:border-blue-500/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white p-4 h-[60px] rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 w-16 group/btn"
                                >
                                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detailed"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-blue-400">1. 💡 Startup Idea (Core Concept)</label>
                                    <input
                                        type="text"
                                        value={coreConcept}
                                        onChange={(e) => setCoreConcept(e.target.value)}
                                        placeholder="A platform that helps students find internships using AI matching"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl text-white px-4 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-emerald-400">2. 🎯 Target Users</label>
                                    <input
                                        type="text"
                                        value={targetUsers}
                                        onChange={(e) => setTargetUsers(e.target.value)}
                                        placeholder="College students in Tier-2 cities looking for internships"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl text-white px-4 py-3 outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-red-400">3. 😖 Problem Statement</label>
                                    <input
                                        type="text"
                                        value={problemStatement}
                                        onChange={(e) => setProblemStatement(e.target.value)}
                                        placeholder="Students struggle to find relevant internships and waste time applying blindly"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl text-white px-4 py-3 outline-none placeholder:text-slate-600 focus:border-red-500/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-purple-400">4. 💰 Monetization / Business Model</label>
                                    <input
                                        type="text"
                                        value={monetization}
                                        onChange={(e) => setMonetization(e.target.value)}
                                        placeholder="Freemium model with paid premium matching features"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl text-white px-4 py-3 outline-none placeholder:text-slate-600 focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                                
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                    >
                                        Validate Detailed Blueprint
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.form>
        </div>
    );
};
