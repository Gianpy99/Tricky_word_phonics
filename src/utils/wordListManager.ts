// Sistema di gestione liste di parole personalizzate
export interface WordList {
  id: string;
  name: string;
  words: string[];
  createdAt: string;
  difficulty: "facile" | "medio" | "difficile";
  isDefault: boolean;
}

const WORD_LISTS_KEY = "tricky_words_lists";
const SELECTED_LIST_KEY = "selected_word_list";

// Liste di parole predefinite
const DEFAULT_WORD_LISTS: WordList[] = [
  {
    id: "default-common",
    name: "Parole Comuni (Sight Words)",
    words: [
      "I",
      "is",
      "the",
      "put",
      "pull",
      "full",
      "as",
      "and",
      "has",
      "his",
      "her",
      "go",
      "no",
      "to",
      "into",
      "she",
      "push",
      "he",
      "of",
      "we",
      "me",
      "be",
      "my",
      "by",
      "all",
      "are",
      "sure",
      "pure",
      "was",
      "you",
      "they",
      "said",
      "so",
      "have",
      "like",
      "some",
      "come",
      "love",
      "do",
      "were",
      "here",
      "little",
      "says",
      "there",
      "when",
      "what",
      "one",
      "out",
      "today",
    ],
    createdAt: new Date().toISOString(),
    difficulty: "facile",
    isDefault: true,
  },
  {
    id: "default-basic",
    name: "Parole Base",
    words: [
      "cat",
      "dog",
      "house",
      "tree",
      "book",
      "chair",
      "table",
      "water",
      "apple",
      "happy",
      "sun",
      "moon",
    ],
    createdAt: new Date().toISOString(),
    difficulty: "facile",
    isDefault: true,
  },
  {
    id: "default-medium",
    name: "Parole Medie",
    words: [
      "elephant",
      "computer",
      "holiday",
      "beautiful",
      "important",
      "different",
      "together",
      "another",
      "because",
      "something",
      "children",
      "morning",
    ],
    createdAt: new Date().toISOString(),
    difficulty: "medio",
    isDefault: true,
  },
  {
    id: "default-tricky",
    name: "Parole Difficili (Default)",
    words: [
      "thought",
      "through",
      "enough",
      "rough",
      "laugh",
      "cough",
      "island",
      "knife",
      "gnome",
      "wrist",
      "psychology",
      "school",
      "receive",
      "believe",
      "achieve",
      "science",
      "friend",
      "weird",
    ],
    createdAt: new Date().toISOString(),
    difficulty: "difficile",
    isDefault: true,
  },
];

// Carica tutte le liste di parole
export const loadWordLists = (): WordList[] => {
  try {
    const saved = localStorage.getItem(WORD_LISTS_KEY);
    const customLists = saved ? JSON.parse(saved) : [];

    // Combina liste predefinite con quelle personalizzate
    const allLists = [...DEFAULT_WORD_LISTS, ...customLists];
    return allLists;
  } catch (error) {
    console.error("Errore nel caricamento delle liste:", error);
    return DEFAULT_WORD_LISTS;
  }
};

// Salva solo le liste personalizzate (non quelle predefinite)
export const saveCustomWordLists = (lists: WordList[]): void => {
  try {
    const customLists = lists.filter((list) => !list.isDefault);
    localStorage.setItem(WORD_LISTS_KEY, JSON.stringify(customLists));
  } catch (error) {
    console.error("Errore nel salvataggio delle liste:", error);
  }
};

// Crea una nuova lista personalizzata
export const createWordList = (
  name: string,
  words: string[],
  difficulty: "facile" | "medio" | "difficile"
): WordList => {
  const newList: WordList = {
    id: `custom-${Date.now()}`,
    name,
    words: words.filter((word) => word.trim().length > 0),
    createdAt: new Date().toISOString(),
    difficulty,
    isDefault: false,
  };

  const allLists = loadWordLists();
  allLists.push(newList);
  saveCustomWordLists(allLists);

  return newList;
};

// Aggiorna una lista esistente
export const updateWordList = (updatedList: WordList): void => {
  if (updatedList.isDefault) return; // Non modificare liste predefinite

  const allLists = loadWordLists();
  const index = allLists.findIndex((list) => list.id === updatedList.id);
  if (index !== -1) {
    allLists[index] = updatedList;
    saveCustomWordLists(allLists);
  }
};

// Elimina una lista personalizzata
export const deleteWordList = (listId: string): void => {
  const allLists = loadWordLists();
  const listToDelete = allLists.find((list) => list.id === listId);

  if (!listToDelete || listToDelete.isDefault) return; // Non eliminare liste predefinite

  const filteredLists = allLists.filter((list) => list.id !== listId);
  saveCustomWordLists(filteredLists);

  // Se era la lista selezionata, ripristina quella predefinita
  const selectedListId = getSelectedWordListId();
  if (selectedListId === listId) {
    setSelectedWordList("default-tricky");
  }
};

// Ottieni la lista di parole selezionata
export const getSelectedWordList = (): WordList | null => {
  try {
    const selectedId =
      localStorage.getItem(SELECTED_LIST_KEY) || "default-tricky";
    const allLists = loadWordLists();
    return allLists.find((list) => list.id === selectedId) || allLists[0];
  } catch (error) {
    console.error("Errore nel caricamento lista selezionata:", error);
    return DEFAULT_WORD_LISTS[0];
  }
};

// Ottieni solo l'ID della lista selezionata
export const getSelectedWordListId = (): string => {
  return localStorage.getItem(SELECTED_LIST_KEY) || "default-tricky";
};

// Imposta la lista di parole selezionata
export const setSelectedWordList = (listId: string): void => {
  localStorage.setItem(SELECTED_LIST_KEY, listId);
};

// Ottieni le parole della lista selezionata
export const getSelectedWords = (): string[] => {
  const selectedList = getSelectedWordList();
  return selectedList ? selectedList.words : DEFAULT_WORD_LISTS[0].words;
};
