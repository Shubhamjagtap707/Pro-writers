import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';

const templates = [
  {
    id: 'novel',
    badge: 'Classic',
    badgeBg: 'bg-[#0b1326]/80',
    badgeText: 'text-[#c0c1ff]',
    title: 'Novel',
    titleColor: 'text-[#e1e0ff]',
    desc: 'A sprawling canvas for epic narratives. Features chapter-based navigation, world-building wiki integration, and character dossiers.',
    meta: '350+ Pages Capacity',
    featured: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtlCqs7L9HIWihrlQY9AYvAXfmV1ASnWXNxDtbDeUkU027P9CpSBRtkRN6baBhTea-5ll54zU_j2tBhsmPCZw6lvtQrBqvV49V0C21yNqvTxFVh68CuHvgahgpiVW0OaNGnW09Et5ga15hSkoxJPeDrVQuU6ClmmCWxPGo49HS64WC5KpjpP9TcOQbtK3_qG1nnWxl2s12Xt4xZMNuwlTjHEEFkAZZejeUM9PnCxka3gGBMR6jFgTU_UeW_xz7pcKGHtNR5IIB39kU',
  },
  {
    id: 'screenplay',
    badge: 'Industry Standard',
    badgeBg: 'bg-[#c0c1ff]/20',
    badgeText: 'text-[#c0c1ff]',
    title: 'Screenplay',
    titleColor: 'text-[#c0c1ff]',
    desc: 'The standard for the silver screen. Automates professional Courier Prime formatting, character cues, and scene transitions.',
    meta: 'Final Draft™ Compatible Export',
    metaIcon: 'movie_edit',
    featured: true,
    img: '',
  },
  {
    id: 'series',
    badge: 'World Builder',
    badgeBg: 'bg-[#ffb783]/20',
    badgeText: 'text-[#ffb783]',
    title: 'Epic Series',
    titleColor: 'text-[#ffb783]',
    desc: 'The ultimate architect tool. Connect multiple novels into a shared universe with synchronized characters and world lore.',
    meta: 'Cross-Project Database',
    metaIcon: 'hub',
    featured: false,
    img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Templates() {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [seriesName, setSeriesName] = useState('');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowSetup(true);
  };

  const { createProject, createSeries, series } = useProjectStore();
  const seriesList = Object.values(series);

  const handleCreate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedTemplate || !projectName.trim()) return;

    if (selectedTemplate === 'series') {
      if (!seriesName.trim()) return;
      const seriesId = createSeries(seriesName.trim());
      const slug = createProject('novel', projectName.trim(), seriesId);
      navigate(`/${slug}/editor`);
    } else {
      // Use selectedSeriesId if provided, otherwise it's a standalone book
      const slug = createProject(selectedTemplate, projectName.trim(), selectedSeriesId || undefined);
      navigate(`/${slug}/editor`);
    }
  };

  const closeModal = () => {
    setShowSetup(false);
    setSelectedTemplate(null);
    setProjectName('');
    setSeriesName('');
    setSelectedSeriesId('');
  };

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Scrollable Content */}
      <section className="page-content py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-16">
            <span className="font-label text-xs font-bold text-[#ffb783] tracking-[0.3em] uppercase block mb-4">Architecture of Story</span>
            <h2 className="font-body text-5xl md:text-6xl text-[#dae2fd] leading-tight">Template Library</h2>
            <p className="font-body text-xl text-[#c7c4d7] mt-6 max-w-2xl leading-relaxed">
              Choose a vessel for your narrative. Each template is meticulously crafted to honor the traditions of its medium.
            </p>
          </header>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((tpl, i) => (
              <motion.div
                key={tpl.id}
                onClick={() => handleTemplateSelect(tpl.id)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-500 ease-out ${
                  tpl.featured
                    ? 'bg-[#171f33] border border-[#c0c1ff]/10 shadow-[0_25px_50px_-12px_rgba(99,102,241,0.15)]'
                    : 'bg-[#131b2e] hover:bg-[#171f33] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_40px_60px_-20px_rgba(47,46,190,0.15)]'
                }`}
              >
                {/* Card Image / Preview */}
                <div className="h-64 relative overflow-hidden bg-[#0b1326]">
                  {tpl.featured ? (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full h-full bg-white/5 rounded p-6 font-mono text-[10px] text-slate-300 leading-tight space-y-4 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <div className="uppercase font-bold tracking-widest text-[#c0c1ff]/60">INT. MIDNIGHT ATELIER - NIGHT</div>
                        <div>The WRITER sits before a glowing screen. The cursor blinks like a heartbeat.</div>
                        <div className="text-center w-1/2 mx-auto mt-4">
                          <div className="uppercase font-bold">Writer</div>
                          <div>"This formatting is perfect."</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      src={tpl.img} alt={tpl.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent" />
                  <div className={`absolute top-6 left-6 px-3 py-1 rounded-full backdrop-blur-md text-[10px] font-bold tracking-widest uppercase ${tpl.badgeBg} ${tpl.badgeText} ${tpl.featured ? 'ring-1 ring-[#c0c1ff]/30' : ''}`}>
                    {tpl.badge}
                  </div>
                </div>

                {/* Card Body */}
                <div className={`p-8 flex-1 flex flex-col ${tpl.featured ? 'bg-gradient-to-b from-[#171f33] to-[#222a3d]' : ''}`}>
                  <h3 className={`font-body text-3xl mb-4 ${tpl.titleColor}`}>{tpl.title}</h3>
                  <p className={`font-body text-lg text-[#c7c4d7] leading-relaxed flex-1 ${tpl.featured ? 'italic' : ''}`}>{tpl.desc}</p>
                  {tpl.featured ? (
                    <div className="mt-8 p-4 rounded-xl bg-[#8083ff]/10 border border-[#c0c1ff]/5 flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#c0c1ff]">{tpl.metaIcon}</span>
                      <span className="font-label text-xs font-semibold text-[#c0c1ff] tracking-wide">{tpl.meta}</span>
                    </div>
                  ) : (
                    <div className="mt-8 flex items-center justify-between">
                      <span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">{tpl.meta}</span>
                      <button className="w-10 h-10 rounded-full bg-[#222a3d] flex items-center justify-center text-[#c0c1ff] group-hover:bg-[#c0c1ff] group-hover:text-[#1000a9] transition-all duration-300">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Stats */}
          <footer className="mt-24 py-12 border-t border-[#464554]/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-12">
              {[{ label: 'Total Words', value: '124,082' }, { label: 'Active Projects', value: '4' }].map(stat => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-label text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
                  <span className="font-body text-3xl text-[#dae2fd]">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-full bg-[#d97721]/20 border border-[#ffb783]/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ffb783] shadow-[0_0_8px_rgba(255,183,131,0.6)]" />
                <span className="text-[10px] font-bold text-[#ffb783] uppercase tracking-widest">Writing Streak: 12 Days</span>
              </div>
            </div>
          </footer>
        </div>
      </section>

      {/* Project Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1326]/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#131b2e] border border-[#2d3449] rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
          >
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-500 hover:text-[#dae2fd] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h3 className="font-body text-3xl text-[#dae2fd] mb-2">
              {selectedTemplate === 'series' ? 'Envisage your Series' : 'Name your project'}
            </h3>
            <p className="text-sm text-[#c7c4d7] mb-8 font-label">
              {selectedTemplate === 'series' 
                ? 'Create a shared universe for multiple manuscripts.' 
                : 'Every great manuscript starts with a working title.'}
            </p>
            
            <form onSubmit={handleCreate} className="space-y-6">
              {selectedTemplate === 'series' && (
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Series Title</label>
                  <input
                    autoFocus
                    type="text"
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    placeholder="e.g. A Song of Ice and Fire"
                    className="w-full bg-[#171f33] border border-[#2d3449] focus:border-[#ffb783] focus:ring-1 focus:ring-[#ffb783] rounded-xl px-4 py-3 text-[#dae2fd] placeholder-slate-600 outline-none transition-all font-body text-lg"
                  />
                </div>
              )}

              {/* Series Picker for Standalone Templates */}
              {selectedTemplate !== 'series' && seriesList.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest block text-[#ffb783]">Link to Universe (Optional)</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {/* Standalone Option */}
                    <div 
                      onClick={() => setSelectedSeriesId('')}
                      className={`flex-shrink-0 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                        selectedSeriesId === '' 
                        ? 'bg-[#c0c1ff]/10 border-[#c0c1ff] shadow-[0_0_15px_rgba(192,193,255,0.2)]' 
                        : 'bg-[#0b1326] border-[#2d3449] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">article</span>
                        <span className={`text-xs font-bold ${selectedSeriesId === '' ? 'text-[#c0c1ff]' : 'text-slate-400'}`}>Standalone</span>
                      </div>
                    </div>

                    {/* Series Options */}
                    {seriesList.map(s => (
                      <div 
                        key={s.id}
                        onClick={() => setSelectedSeriesId(s.id)}
                        className={`flex-shrink-0 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                          selectedSeriesId === s.id 
                          ? 'bg-[#ffb783]/10 border-[#ffb783] shadow-[0_0_15px_rgba(255,183,131,0.2)]' 
                          : 'bg-[#0b1326] border-[#2d3449] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#ffb783]">hub</span>
                          <span className={`text-xs font-bold ${selectedSeriesId === s.id ? 'text-[#ffb783]' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">
                  {selectedTemplate === 'series' ? 'Title of Book 1' : 'Project Title'}
                </label>
                <input
                  autoFocus={selectedTemplate !== 'series'}
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={selectedTemplate === 'series' ? 'e.g. A Game of Thrones' : 'e.g. The Winds of Winter'}
                  className="w-full bg-[#171f33] border border-[#2d3449] focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] rounded-xl px-4 py-3 text-[#dae2fd] placeholder-slate-600 outline-none transition-all font-body text-lg"
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-[#c7c4d7] bg-[#222a3d] hover:bg-[#2d3449] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!projectName.trim() || (selectedTemplate === 'series' && !seriesName.trim())}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm text-[#1000a9] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                    selectedTemplate === 'series' 
                      ? 'bg-gradient-to-br from-[#ffb783] to-[#d97721]' 
                      : 'bg-gradient-to-br from-[#c0c1ff] to-[#8083ff]'
                  }`}
                >
                  {selectedTemplate === 'series' ? 'Forge Series' : 'Start Writing'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
