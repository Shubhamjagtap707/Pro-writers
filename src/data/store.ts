// ─── Mock Data Store ────────────────────────────────────────────────────────
// All demo data pre-populated from the UI screen designs

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  type: 'novel' | 'screenplay' | 'short-story' | 'poetry';
  wordCount: number;
  targetWords: number;
  progress: number;
  lastUpdated: string;
  coverImage?: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  act: string;
  title: string;
  synopsis: string;
  wordCount: number;
  beat: 'INCITING INCIDENT' | 'NORMAL' | 'TURNING POINT' | 'MIDPOINT' | 'DARK NIGHT' | 'CLIMAX' | '';
  content: string;
}

export interface Character {
  id: string;
  name: string;
  archetype: string;
  role: 'Protagonist' | 'Antagonist' | 'NPC' | 'Supporting';
  quote: string;
  trait: string;
  habit: string;
  lastSeen: string;
  tags: string[];
  backstory: string;
  goals: string[];
  connections: { name: string; role: string; type: string }[];
  wordCount: number;
  complexityScore: 'High' | 'Medium' | 'Low';
  avatar?: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'EXT' | 'INT';
  timeOfDay: 'NIGHT' | 'DAY' | 'DAWN' | 'DUSK';
  description: string;
  characters: number;
  scenes: string[];
  spatialDensity: number;
}

// ─── Projects ───────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 'whispers',
    title: 'Whispers of the Everlasting Night',
    subtitle: 'Chapter 14: The Convergence of Shadows and Dust',
    genre: 'NOVEL',
    type: 'novel',
    wordCount: 68400,
    targetWords: 100000,
    progress: 68,
    lastUpdated: '2h ago',
    chapters: [
      { id: 'ch1', act: 'ACT I', title: 'The Silent Call', synopsis: 'Elias discovers the antique inkwell that never runs dry. A strange shadow begins to follow his pen across the parchment.', wordCount: 1200, beat: 'INCITING INCIDENT', content: 'The fog didn\'t just roll into the harbor; it possessed it. It was a thick, spectral entity that swallowed the masts of the docked schooners and silenced the rhythmic lapping of the black water against the rotted wood of Pier 9. Silas leaned against a rusted bollard, his breath blooming in the cold air like a phantom flower.\n\nHe pulled his collar tighter. The letter in his pocket felt heavier than it should—a physical weight of secrets and ink. It was a summons he couldn\'t ignore, written in a hand he hadn\'t seen in over a decade. "The shadow is lengthening," it had said. Nothing more.\n\nA bell tolled in the distance, muffled and mourning. Silas checked his watch. 12:04 AM. The contact was late, or perhaps they were already here, watching from the safety of the grey veil. In this city, you never truly knew if you were the hunter or the game until the trap was already sprung.\n\nA soft click echoed behind him. Not the sound of a gun, but the sound of a lighter. A tiny flame bloomed ten paces to his left, illuminating a pair of sharp, intelligent eyes and a shock of silver hair. "You still stand in the light, Silas," a voice rasped, rich with the history of too many cigarettes and too few regrets. "A dangerous habit for a man with your history."' },
      { id: 'ch2', act: 'ACT I', title: 'Threshold of Whispers', synopsis: 'The studio space begins to physically shift. Doors lead to corridors that weren\'t there yesterday. Julian warns Elias of the...', wordCount: 2450, beat: 'NORMAL', content: '' },
      { id: 'ch3', act: 'ACT I', title: 'Into the Inkwell', synopsis: 'Literal immersion. Elias spills the ink and finds himself drowning in a sea of liquid language. First encounter with the...', wordCount: 3100, beat: 'TURNING POINT', content: '' },
      { id: 'ch4', act: 'ACT II', title: 'The Archive of Wills', synopsis: 'Millions of unfinished manuscripts line the obsidian shelves. The Curator explains the rules of the Nocturnal Atelier.', wordCount: 4000, beat: 'NORMAL', content: '' },
      { id: 'ch5', act: 'ACT II', title: 'Peak of Persuasion', synopsis: 'Climbing the metaphorical mountain of writer\'s block. Each step requires a sacrifice of a memory.', wordCount: 3800, beat: 'MIDPOINT', content: '' },
      { id: 'ch6', act: 'ACT II', title: 'The Ink-Stained Mirror', synopsis: 'Elias sees his own life played back in prose. The realization that he is merely a character in someone else\'s Suite.', wordCount: 5500, beat: 'MIDPOINT', content: '' },
      { id: 'ch7', act: 'ACT III', title: 'The Final Word', synopsis: 'The climax approaches. Every word written now erases one from the past.', wordCount: 2100, beat: 'CLIMAX', content: '' },
    ],
  },
  {
    id: 'neon-haiku',
    title: 'Neon Haiku',
    subtitle: 'Poetry Collection',
    genre: 'POETRY COLLECTION',
    type: 'poetry',
    wordCount: 4200,
    targetWords: 5000,
    progress: 84,
    lastUpdated: '1d ago',
    chapters: [],
  },
  {
    id: 'alchemist',
    title: "The Alchemist's Ledger",
    subtitle: 'Historical Non-Fiction',
    genre: 'HISTORICAL NON-FICTION',
    type: 'novel',
    wordCount: 12000,
    targetWords: 30000,
    progress: 40,
    lastUpdated: '3d ago',
    chapters: [],
  },
];

// ─── Characters ─────────────────────────────────────────────────────────────
export const characters: Character[] = [
  {
    id: 'elias-vance',
    name: 'Elias Vance',
    archetype: 'The Truth Seeker',
    role: 'Protagonist',
    quote: '"The truth isn\'t found in what people say, but in the echoes of what they choose to forget."',
    trait: 'Hyperthymesia',
    habit: 'Taps a silver pocket watch that no longer ticks when anxious.',
    lastSeen: 'Chapter 14: The Velvet Void',
    tags: ['THE RELUCTANT SEER'],
    backstory: 'Born into the fading nobility of the Mid-Rim, Silas was groomed for a life of bureaucratic leisure. That ended the night the Spire fell. He escaped with nothing but the clothes on his back and the burden of knowing exactly why the shields failed.',
    goals: ['Recover the lost archives from the Obsidian Spire.', 'Find the sister he abandoned ten years ago.'],
    connections: [
      { name: 'Elara Thorne', role: 'Sister / Estranged', type: 'family' },
      { name: 'Vaelin Nox', role: 'Mentor / Antagonist', type: 'conflict' },
    ],
    wordCount: 14203,
    complexityScore: 'High',
  },
  {
    id: 'isabella-thorne',
    name: 'Isabella Thorne',
    archetype: 'The Sovereign',
    role: 'Antagonist',
    quote: '"Power is just order given shape."',
    trait: 'Strategic brilliance',
    habit: 'Never sits with her back to a door.',
    lastSeen: 'Chapter 10: The Glass Council',
    tags: ['RUTHLESS', 'CALCULATED'],
    backstory: 'Rose from obscurity through sheer political acumen. Controls three of the five High Houses without anyone knowing her name.',
    goals: ['Consolidate control over the High Council.', 'Erase evidence of the original Spire collapse.'],
    connections: [
      { name: 'Elias Vance', role: 'Primary Target', type: 'conflict' },
      { name: 'Mina Grey', role: 'Reluctant Ally', type: 'ally' },
    ],
    wordCount: 8940,
    complexityScore: 'High',
  },
  {
    id: 'mina-grey',
    name: 'Mina Grey',
    archetype: 'Ghost Specialist',
    role: 'Supporting',
    quote: '"I don\'t haunt places. I haunt outcomes."',
    trait: 'Empathic intelligence',
    habit: 'Leaves copper coins at every location she visits.',
    lastSeen: 'Chapter 12: Shadow Market',
    tags: ['ACTIVE ALLY'],
    backstory: 'Former operative of the Undercurrent, now freelance. Her loyalty is to outcomes, not people.',
    goals: ['Survive long enough to leave the city.', 'Find the truth about her missing handler.'],
    connections: [
      { name: 'Elias Vance', role: 'Client / Unlikely Ally', type: 'ally' },
      { name: 'Isabella Thorne', role: 'Former Employer', type: 'conflict' },
    ],
    wordCount: 5210,
    complexityScore: 'Medium',
  },
  {
    id: 'arthur-penhaligon',
    name: 'Arthur Penhaligon',
    archetype: 'The Librarian',
    role: 'NPC',
    quote: '"Time would never be wasted on someone who reads."',
    trait: 'Eidetic memory for texts',
    habit: 'Smells every book before opening it.',
    lastSeen: 'Chapter 6: The Vault',
    tags: [],
    backstory: 'Keeper of the Archive of Wills. Has read every unfinished manuscript ever written. Possibly immortal.',
    goals: ['Protect the archive from those who would weaponize its contents.'],
    connections: [
      { name: 'Elias Vance', role: 'Guide', type: 'ally' },
    ],
    wordCount: 2890,
    complexityScore: 'Low',
  },
];

// ─── Locations ───────────────────────────────────────────────────────────────
export const locations: Location[] = [
  { id: 'docks', name: 'Midnight at the Docks', type: 'EXT', timeOfDay: 'NIGHT', description: 'The harbor district at 12AM. Thick fog rolls in from the sea, swallowing the masts of docked vessels.', characters: 2, scenes: ['Scene 42-45'], spatialDensity: 85 },
  { id: 'blackwood', name: 'Blackwood Manor', type: 'EXT', timeOfDay: 'NIGHT', description: 'The Thorne Estate. Three characters converge here. A centuries-old building with impossible geometry.', characters: 3, scenes: ['Scene 22', 'Scene 31'], spatialDensity: 62 },
  { id: 'shattered-glass', name: 'The Shattered Glass', type: 'INT', timeOfDay: 'DAY', description: 'Observation deck above the city. A single character witnesses the cascade.', characters: 1, scenes: ['Scene 38'], spatialDensity: 20 },
  { id: 'wailing-woods', name: 'Wailing Woods', type: 'EXT', timeOfDay: 'DAWN', description: 'Outer perimeter. No active characters. Significant for Act III.', characters: 0, scenes: [], spatialDensity: 5 },
];

// ─── Writing Stats ───────────────────────────────────────────────────────────
export const writingStats = {
  wordsToday: 1248,
  dailyTarget: 2000,
  streakDays: 14,
  weeklyData: [
    { day: 'M', words: 1200 },
    { day: 'T', words: 2800 },
    { day: 'W', words: 3100 },
    { day: 'T', words: 1900 },
    { day: 'F', words: 2400 },
    { day: 'S', words: 800 },
    { day: 'S', words: 600 },
  ],
  wordsPerHour: 842,
  activeTime: '4h 12m',
  focusScore: 92,
  draftCompletion: 18.4,
  totalWords: 142804,
};

// ─── Arc Data ────────────────────────────────────────────────────────────────
export const arcData = Array.from({ length: 24 }, (_, i) => ({
  chapter: `CH ${String(i + 1).padStart(2, '0')}`,
  tension: Math.sin(i * 0.4) * 30 + 50 + (i > 15 ? (i - 15) * 4 : 0),
  sentiment: Math.cos(i * 0.35 + 0.5) * 25 + 50,
}));

// ─── AI Suggestions ──────────────────────────────────────────────────────────
export const plotTwists = [
  '"The secret isn\'t what they found in the cellar, but why it was breathing."',
  '"She had been writing the letters to herself all along—a future version trying to warn the past."',
  '"The map was accurate. It was the territory that had changed."',
  '"The only person who knew the killer\'s identity was the victim—who left the clue in the last word they ever wrote."',
  '"The lighthouse hadn\'t been staffed in forty years. The light still turned."',
];

export const scratchpadNotes = [
  { id: '1', text: '"A clock that only ticks when no one is looking at it."', type: 'Idea Bin', time: '2m ago' },
  { id: '2', text: '"Silas doesn\'t fear death, he fears the silence after the final breath."', type: 'Dialogue Suggestion', time: '1h ago' },
  { id: '3', text: 'Consider: What if the Archive only accepts manuscripts that were never meant to be finished?', type: 'Plot Hook', time: '3h ago' },
];
