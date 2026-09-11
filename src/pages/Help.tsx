import { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'How do I create a new project?',
    a: 'Click the "New Project" button in the sidebar or use the keyboard shortcut Ctrl+N. You\'ll be prompted to choose a template and give your project a name.',
  },
  {
    q: 'How does the AI Muse Lab work?',
    a: 'The AI Muse Lab uses a fine-tuned language model trained on literary works. Provide context about your genre, tone, and characters to get tailored suggestions.',
  },
  {
    q: 'Can I export my manuscript to Word or PDF?',
    a: 'Yes! Navigate to any project and click "Export" in the top navigation. You can export to DOCX, PDF, EPUB, and Final Draft formats.',
  },
  {
    q: 'What is the Continuity Checker?',
    a: 'The Continuity Checker scans your manuscript for logical inconsistencies — like characters appearing in two places at once, or objects that disappear between scenes.',
  },
  {
    q: 'How do I invite collaborators?',
    a: 'Go to Project Settings and click "Invite Collaborator". Enter their email and set permissions (View, Comment, or Edit).',
  },
];

const docs = [
  { icon: 'book_2', title: 'Getting Started', desc: 'Set up your first project and learn the basics.', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: 'auto_awesome', title: 'AI Features Guide', desc: 'Master the Muse Lab, Critique Engine, and Autocomplete.', color: 'text-tertiary', bg: 'bg-tertiary/10' },
  { icon: 'group', title: 'Collaboration', desc: 'Real-time co-writing, comments, and version control.', color: 'text-secondary', bg: 'bg-secondary/10' },
  { icon: 'file_download', title: 'Export & Publish', desc: 'All supported formats and publishing integrations.', color: 'text-[#4ade80]', bg: 'bg-[#4ade80]/10' },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      <div className="page-content space-y-16">
        {/* Hero */}
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-container mb-6"
          >
            <span className="material-symbols-outlined text-on-primary text-4xl">help_outline</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl font-body text-on-surface mb-4"
          >How can we help?</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-on-surface-variant font-body text-xl max-w-2xl mx-auto"
          >Browse our documentation, read FAQs, or reach out to our support team directly.</motion.p>
        </div>

        {/* Documentation Cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-sm tracking-widest uppercase text-slate-500 mb-6">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc, i) => (
              <motion.button
                key={doc.title}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-start gap-5 p-6 bg-surface-container-low rounded-2xl text-left group hover:bg-surface-container transition-all border border-transparent hover:border-primary/10"
              >
                <div className={`w-12 h-12 rounded-xl ${doc.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${doc.color}`}>{doc.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{doc.title}</h3>
                  <p className="text-sm text-slate-400 font-label">{doc.desc}</p>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors ml-auto flex-shrink-0 mt-1">arrow_forward</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-sm tracking-widest uppercase text-slate-500 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-surface-container-low rounded-2xl overflow-hidden border border-transparent hover:border-primary/10 transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-body text-lg text-on-surface">{faq.q}</span>
                  <span className={`material-symbols-outlined text-primary transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-6 text-on-surface-variant font-body text-lg leading-relaxed border-t border-outline-variant/10 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-[2rem] p-10 border border-primary/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">support_agent</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Contact Support</h3>
                <p className="text-sm text-slate-400">Response within 24 hours</p>
              </div>
            </div>
            <div className="space-y-4">
              <textarea
                className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface placeholder-slate-600 resize-none focus:ring-1 focus:ring-primary/40 outline-none font-body text-lg"
                placeholder="Describe your issue or question..."
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">send</span>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
