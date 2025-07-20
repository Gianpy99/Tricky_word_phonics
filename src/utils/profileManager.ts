// Sistema di gestione profili utente
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  totalScore: number;
  gamesPlayed: number;
  favoriteWords: string[];
}

const PROFILES_KEY = "tricky_words_profiles";
const CURRENT_PROFILE_KEY = "current_profile_id";

// Carica tutti i profili
export const loadProfiles = (): UserProfile[] => {
  try {
    const saved = localStorage.getItem(PROFILES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Errore nel caricamento dei profili:", error);
    return [];
  }
};

// Salva tutti i profili
export const saveProfiles = (profiles: UserProfile[]): void => {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Errore nel salvataggio dei profili:", error);
  }
};

// Crea un nuovo profilo
export const createProfile = (name: string): UserProfile => {
  const newProfile: UserProfile = {
    id: Date.now().toString(),
    name,
    avatar: getRandomAvatar(),
    createdAt: new Date().toISOString(),
    totalScore: 0,
    gamesPlayed: 0,
    favoriteWords: [],
  };

  const profiles = loadProfiles();
  profiles.push(newProfile);
  saveProfiles(profiles);

  return newProfile;
};

// Ottieni profilo corrente
export const getCurrentProfile = (): UserProfile | null => {
  try {
    const currentId = localStorage.getItem(CURRENT_PROFILE_KEY);
    if (!currentId) return null;

    const profiles = loadProfiles();
    return profiles.find((p) => p.id === currentId) || null;
  } catch (error) {
    console.error("Errore nel caricamento profilo corrente:", error);
    return null;
  }
};

// Imposta profilo corrente
export const setCurrentProfile = (profileId: string): void => {
  localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
};

// Aggiorna profilo
export const updateProfile = (updatedProfile: UserProfile): void => {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === updatedProfile.id);
  if (index !== -1) {
    profiles[index] = updatedProfile;
    saveProfiles(profiles);
  }
};

// Aggiorna il punteggio del profilo corrente
export const updateCurrentProfileScore = (gameScore: number): void => {
  const currentProfile = getCurrentProfile();
  if (currentProfile) {
    const updatedProfile = {
      ...currentProfile,
      totalScore: currentProfile.totalScore + gameScore,
      gamesPlayed: currentProfile.gamesPlayed + 1,
    };
    updateProfile(updatedProfile);
  }
};

// Avatar casuali
const AVATARS = ["👦", "👧", "🧒", "👶", "🦄", "🐱", "🐶", "🐸", "🦊", "🐼"];

const getRandomAvatar = (): string => {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
};

// Elimina profilo
export const deleteProfile = (profileId: string): void => {
  const profiles = loadProfiles();
  const filtered = profiles.filter((p) => p.id !== profileId);
  saveProfiles(filtered);

  // Se era il profilo corrente, rimuovi la selezione
  const currentId = localStorage.getItem(CURRENT_PROFILE_KEY);
  if (currentId === profileId) {
    localStorage.removeItem(CURRENT_PROFILE_KEY);
  }
};
