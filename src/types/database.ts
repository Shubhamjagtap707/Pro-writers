export interface Series {
  id: string;
  created_at: string;
  title: string;
  description?: string;
}

export interface Project {
  id: string; // uuid
  created_at: string;
  title: string;
  slug: string;
  genre: string;
  template: string;
  series_id?: string; // optional link to a series
  last_edited_at: string;
}

export interface Chapter {
  id: string; // uuid
  project_id: string; // foreign key
  title: string;
  sort_order: number;
}

export interface Scene {
  id: string; // uuid
  chapter_id: string; // foreign key
  project_id: string; // denormalized for easier querying
  title: string;
  content: string;
  word_count: number;
  sort_order: number;
  notes?: string;
}

export interface Character {
  id: string; // uuid
  project_id: string; // fk (can be a dummy if shared across series)
  series_id?: string; // link to shared series database
  name: string;
  role: string;
  archetype: string;
  avatarUrl: string;
  color: string;
  // Detailed attributes
  titles?: { id: string; title: string }[];
  background?: string;
  appearance?: string;
  personality?: string;
  quirksAndFlaws?: string;
  internalConflict?: string;
  externalConflict?: string;
  weaponsAndSkills?: string;
  roleInStory?: string;
  themes?: string;
  timeline?: string;
  fateAndLegacy?: string;
  connections?: string;
  relationshipArcs?: { id: string; content: string }[];
  otherRelationships?: string;
  canonChoices?: { id: string; element: string; choice: string }[];
  allegiances?: { id: string; factionId: string; rank: string }[];
}

export interface Faction {
  id: string; // uuid
  project_id: string; // fk
  series_id?: string;
  name: string;
  motto: string;
  description: string;
  emblemUrl: string;
  parentFactionId?: string;
  history?: string;
  politicalInfluence?: string;
  goals?: string;
  roles?: { id: string; title: string; characterId?: string }[];
}

export interface WorldItem {
  id: string; // uuid
  project_id: string; // fk
  series_id?: string; // link to shared series database
  name: string;
  category: 'Location' | 'Item' | 'Lore';
  description: string;
  imageUrl: string;
}
