import { motion } from 'framer-motion';

const archived = [
  {
    title: 'The Obsidian Chronicles',
    genre: 'Fantasy',
    words: '112,400',
    chapters: 28,
    archivedDate: 'Feb 12, 2025',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-DVvhQWc2v_lSDddNrKP2_93fleGCS9jApfArg_yH-vOqFLAud0lPaQ9u4Vomf2-GvnXu8L5TYOG-vLeOW65mHbcaffipMdhZ5EOhAZtKQAYFxyXSrOkwoz2bjhhHUBVhKFLkmCGHWolQiEffl58NX_TfIrHuL7AOolcz7jes1ZSDOG-gIX6KxcXDpi5SBgnoY5pkol8e4PLsyD5r1diDLEPlilJgRGCmQJ71YfpN6GJkKJisEWzhCPzD1GMvkFq4w5Z4qG_uyy4U',
  },
  {
    title: 'Letters Never Sent',
    genre: 'Literary Fiction',
    words: '54,200',
    chapters: 14,
    archivedDate: 'Nov 3, 2024',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7L69-0hKqNOoaoaO4B8bWNqp_72aRo5-ubuMoMsQSgNHIQP1tHMX5sZF4ggWQUAY02c1pKCgy2CdGy-zQQlwmvEOXaK_7WTEtcLNyu4f3C8s5iOALLU7DLobadopBej0ncAhdx_TAo7zCXDZ4VSCUKjK00DNswrozFVwPTbXsZW1O2IrHEpHu2fVXMF8AMEzMErId_5bZlzQJYHKFTUQrKginIGYf-l7K7xesa3Ii4UPMT1oaVVp5EzuVQMHx4Sxl68rDqXfE8hn',
  },
  {
    title: 'The Cartographer\'s Dream',
    genre: 'Steampunk',
    words: '89,100',
    chapters: 22,
    archivedDate: 'Sep 18, 2024',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiIXMSQhFaWEQ5OaZMF4dX6X_FFkLqSL6GFmtlqDfc8Iiyt3XnF9MeyE7nNHYq4vhvRdI12oftaxbaiF484UGxaRGsdVQX6ykkzMsqu2_3b2sNm9w8OzAiF4Jb-5Q8l6W7_bIta9L-vueeOmNoA_fyZJzi0UcfQ8JUUv-ysEDa86rODIhm5mphVUC07hLzKMGPeTEZgYqZ0hh_JXqrdCUbb7LNVeznQ3y3EQP9KMMqEZfpD6ZBHuFdlonKs67wxot2l0bnnJioehBF',
  },
  {
    title: 'Voices in the Static',
    genre: 'Sci-Fi',
    words: '71,600',
    chapters: 19,
    archivedDate: 'Jul 7, 2024',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsfjsRoFN87sbIS1zhNWPARoURMPfE5I6fmIQ82pQzirBUFsdHUUzI1WmNY_V4cfjZyWHVrwBQnITIIBdtaP9_nJ-yLzyN657XifpOTzj8AyhVUBoy2c08aOui168aJoBDeFjuGFkaWpjvK0d3Lhd0Jwnw_g5UAjebO89MCp-X9gQyG6kQr0sruLbOIECTGDkWHjd6Dyxjd-1U2g0qIqnSAKITEdaLsWLeasvcwnTlq1ZLW4SykmGG2x4rvq5AEtPKoGPczBRJEhEN',
  },
];

export default function Archive() {
  const search = '';
  const filtered = archived;

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      <div className="page-content">
        {/* Hero Header */}
        <div className="mb-12">
          <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 block">The Vault of Completed Works</span>
          <h1 className="text-5xl font-body text-on-surface mb-4">Project Archive</h1>
          <p className="text-on-surface-variant font-body text-lg max-w-xl">Every completed manuscript, preserved in amber ink. Browse, restore, or export your past creations.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Archived Projects', value: '12', icon: 'inventory_2', color: 'text-primary' },
            { label: 'Total Words', value: '843k', icon: 'edit_note', color: 'text-tertiary' },
            { label: 'Oldest Project', value: '2022', icon: 'history', color: 'text-secondary' },
            { label: 'Latest Archive', value: 'Feb 2025', icon: 'calendar_month', color: 'text-[#4ade80]' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-surface-container-low rounded-2xl p-6 flex items-center gap-4"
            >
              <div className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
                <p className={`font-body text-2xl ${stat.color}`}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Archive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-surface-container-low rounded-[2rem] overflow-hidden group cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700"
                  src={project.img} alt={project.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 rounded-full bg-surface/80 backdrop-blur text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {project.genre}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-body text-xl text-on-surface mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Archived {project.archivedDate}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Words</p>
                    <p className="text-on-surface font-body">{project.words}</p>
                  </div>
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Chapters</p>
                    <p className="text-on-surface font-body">{project.chapters}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">restore</span> Restore
                  </button>
                  <button className="py-2 px-3 text-xs font-bold text-slate-400 bg-surface-container-high rounded-xl hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">file_download</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">search_off</span>
            <p className="font-body text-xl text-slate-400">No archived projects match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
