import React, { useState, useEffect } from "react";
import type { Screen } from "../App";
import {
  loadProfiles,
  createProfile,
  setCurrentProfile,
  deleteProfile,
  getCurrentProfile,
  type UserProfile,
} from "../utils/profileManager";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [currentProfile, setCurrentProfileState] = useState<UserProfile | null>(
    null
  );

  useEffect(() => {
    loadProfilesData();
  }, []);

  const loadProfilesData = () => {
    const loadedProfiles = loadProfiles();
    const current = getCurrentProfile();
    setProfiles(loadedProfiles);
    setCurrentProfileState(current);
  };

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = createProfile(newProfileName.trim());
      setCurrentProfile(newProfile.id);
      setNewProfileName("");
      setShowCreateForm(false);
      loadProfilesData();
    }
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile.id);
    setCurrentProfileState(profile);
    onNavigate("menu");
  };

  const handleDeleteProfile = (profileId: string) => {
    if (
      window.confirm(
        "Sei sicuro di voler eliminare questo profilo? Tutti i dati saranno persi."
      )
    ) {
      deleteProfile(profileId);
      loadProfilesData();
    }
  };

  if (showCreateForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            ✨ Crea Nuovo Profilo
          </h1>

          <div className="space-y-6">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Inserisci il nome..."
              className="w-full p-4 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === "Enter" && handleCreateProfile()}
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
                className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                ✅ Crea
              </button>

              <button
                onClick={() => setShowCreateForm(false)}
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
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          👥 Scegli il tuo Profilo
        </h1>

        {currentProfile && (
          <div className="mb-6 p-4 bg-green-100 rounded-lg text-center">
            <p className="text-lg text-green-800">
              Profilo attuale: <strong>{currentProfile.name}</strong>{" "}
              {currentProfile.avatar}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                currentProfile?.id === profile.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{profile.avatar}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {profile.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>🎮 Giochi: {profile.gamesPlayed}</p>
                  <p>🏆 Punteggio: {profile.totalScore}</p>
                  <p>
                    📅 Creato:{" "}
                    {new Date(profile.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfile(profile.id);
                  }}
                  className="mt-3 text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️ Elimina
                </button>
              </div>
            </div>
          ))}

          {/* Pulsante per creare nuovo profilo */}
          <div
            className="p-6 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 flex flex-col items-center justify-center"
            onClick={() => setShowCreateForm(true)}
          >
            <div className="text-6xl mb-4">➕</div>
            <h3 className="text-xl font-bold text-gray-600">Nuovo Profilo</h3>
            <p className="text-sm text-gray-500">Clicca per creare</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate("menu")}
            disabled={!currentProfile}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {currentProfile
              ? "🚀 Continua al Gioco"
              : "Seleziona un profilo per continuare"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
