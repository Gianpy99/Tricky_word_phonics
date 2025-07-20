import React, { useState, useEffect } from "react";
import type { Screen } from "../App";
import {
  loadWordLists,
  createWordList,
  updateWordList,
  deleteWordList,
  getSelectedWordListId,
  setSelectedWordList,
  type WordList,
} from "../utils/wordListManager";

interface WordListScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WordListScreen: React.FC<WordListScreenProps> = ({ onNavigate }) => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [selectedListId, setSelectedListIdState] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<WordList | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListWords, setNewListWords] = useState("");
  const [newListDifficulty, setNewListDifficulty] = useState<
    "facile" | "medio" | "difficile"
  >("medio");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const lists = loadWordLists();
    const selected = getSelectedWordListId();
    setWordLists(lists);
    setSelectedListIdState(selected);
  };

  const handleCreateList = () => {
    if (newListName.trim() && newListWords.trim()) {
      const wordsArray = newListWords
        .split(/[,\n]/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      createWordList(newListName.trim(), wordsArray, newListDifficulty);
      resetForm();
      loadData();
    }
  };

  const handleUpdateList = () => {
    if (showEditForm && newListName.trim() && newListWords.trim()) {
      const wordsArray = newListWords
        .split(/[,\n]/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      const updatedList: WordList = {
        ...showEditForm,
        name: newListName.trim(),
        words: wordsArray,
        difficulty: newListDifficulty,
      };

      updateWordList(updatedList);
      resetForm();
      loadData();
    }
  };

  const handleSelectList = (listId: string) => {
    setSelectedWordList(listId);
    setSelectedListIdState(listId);
  };

  const handleDeleteList = (listId: string) => {
    const list = wordLists.find((l) => l.id === listId);
    if (
      list &&
      window.confirm(`Sei sicuro di voler eliminare la lista "${list.name}"?`)
    ) {
      deleteWordList(listId);
      loadData();
    }
  };

  const handleEditList = (list: WordList) => {
    setShowEditForm(list);
    setNewListName(list.name);
    setNewListWords(list.words.join(", "));
    setNewListDifficulty(list.difficulty);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setShowEditForm(null);
    setNewListName("");
    setNewListWords("");
    setNewListDifficulty("medio");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-100 text-green-800";
      case "medio":
        return "bg-yellow-100 text-yellow-800";
      case "difficile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "😊";
      case "medio":
        return "🤔";
      case "difficile":
        return "😤";
      default:
        return "📚";
    }
  };

  if (showCreateForm || showEditForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {showEditForm ? "✏️ Modifica Lista" : "✨ Crea Nuova Lista"}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Nome della Lista
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Es: Parole di Casa"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Difficoltà
              </label>
              <select
                value={newListDifficulty}
                onChange={(e) =>
                  setNewListDifficulty(
                    e.target.value as "facile" | "medio" | "difficile"
                  )
                }
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="facile">😊 Facile</option>
                <option value="medio">🤔 Medio</option>
                <option value="difficile">😤 Difficile</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Parole (una per riga o separate da virgole)
              </label>
              <textarea
                value={newListWords}
                onChange={(e) => setNewListWords(e.target.value)}
                placeholder="thought&#10;through&#10;enough&#10;&#10;oppure: cat, dog, house"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-40 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Parole rilevate:{" "}
                {
                  newListWords.split(/[,\n]/).filter((w) => w.trim().length > 0)
                    .length
                }
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={showEditForm ? handleUpdateList : handleCreateList}
                disabled={!newListName.trim() || !newListWords.trim()}
                className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {showEditForm ? "💾 Salva Modifiche" : "✅ Crea Lista"}
              </button>

              <button
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                ❌ Annulla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          📚 Gestione Liste di Parole
        </h1>

        <div className="mb-8 text-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ➕ Crea Nuova Lista
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {wordLists.map((list) => (
            <div
              key={list.id}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedListId === list.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {list.name}
                </h3>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getDifficultyColor(
                    list.difficulty
                  )}`}
                >
                  {getDifficultyEmoji(list.difficulty)}{" "}
                  {list.difficulty.charAt(0).toUpperCase() +
                    list.difficulty.slice(1)}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>📝 Parole: {list.words.length}</p>
                  <p>
                    📅 Creata:{" "}
                    {new Date(list.createdAt).toLocaleDateString("it-IT")}
                  </p>
                  {list.isDefault && (
                    <p className="text-blue-600 font-medium">
                      ⭐ Lista Predefinita
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4 max-h-20 overflow-y-auto">
                <strong>Anteprima:</strong> {list.words.slice(0, 8).join(", ")}
                {list.words.length > 8 && "..."}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleSelectList(list.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    selectedListId === list.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                  }`}
                >
                  {selectedListId === list.id
                    ? "✅ Selezionata"
                    : "🎯 Seleziona"}
                </button>

                <div className="flex gap-2">
                  {!list.isDefault && (
                    <>
                      <button
                        onClick={() => handleEditList(list)}
                        className="flex-1 text-blue-600 hover:text-blue-800 text-sm py-1"
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="flex-1 text-red-600 hover:text-red-800 text-sm py-1"
                      >
                        🗑️ Elimina
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate("menu")}
            className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Torna al Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordListScreen;
