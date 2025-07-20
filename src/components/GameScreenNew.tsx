import React, { useState, useEffect } from "react";
import type { Screen } from "../App";
import {
  updateWordResult,
  updateBestStreak,
  incrementGamesPlayed,
} from "../utils/statsManager";
import {
  getSelectedWords,
  getSelectedWordList,
} from "../utils/wordListManager";
import {
  getCurrentProfile,
  updateCurrentProfileScore,
} from "../utils/profileManager";

interface GameScreenProps {
  onNavigate: (screen: Screen) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onNavigate }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [selectedWordList, setSelectedWordList] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  // Carica le parole selezionate e il profilo corrente
  useEffect(() => {
    const words = getSelectedWords();
    const wordList = getSelectedWordList();
    const profile = getCurrentProfile();

    setGameWords(words);
    setSelectedWordList(wordList);
    setCurrentProfile(profile);
  }, []);

  // Test del microfono avanzato
  const testMicrophone = () => {
    console.log("🔧 === TEST MICROFONO AVANZATO ===");
    setFeedback("🔧 Testing microfono...");

    // Test 1: Verifica supporto API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = "❌ API MediaDevices non supportata da questo browser.";
      console.error(msg);
      setFeedback(msg);
      return;
    }

    console.log("✅ API MediaDevices supportata");

    // Test 2: Verifica supporto Speech Recognition
    const hasSpeechRecognition =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    console.log("Speech Recognition supportato:", hasSpeechRecognition);

    if (!hasSpeechRecognition) {
      const msg = "❌ Speech Recognition non supportato. Usa Chrome o Edge.";
      console.error(msg);
      setFeedback(msg);
      return;
    }

    console.log("✅ Speech Recognition supportato");

    // Test 3: Test microfono con parametri ottimizzati
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      })
      .then((stream) => {
        console.log("✅ Microfono funziona! Stream:", stream);
        console.log("Tracce audio:", stream.getAudioTracks());

        // Test livello audio
        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        mediaStreamSource.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        let testCount = 0;
        const testInterval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
          console.log(`📊 Livello audio: ${volume}`);

          testCount++;
          if (testCount >= 10) {
            clearInterval(testInterval);
            stream.getTracks().forEach((track) => track.stop());
            audioContext.close();

            if (volume > 0) {
              setFeedback(
                "✅ Microfono perfetto! Audio rilevato con livello: " +
                  volume.toFixed(1)
              );
            } else {
              setFeedback(
                "⚠️ Microfono collegato ma nessun audio rilevato. Parla più forte!"
              );
            }

            setTimeout(() => setFeedback(""), 5000);
          }
        }, 100);
      })
      .catch((error) => {
        console.error("❌ Errore test microfono:", error);
        let msg = "❌ Test microfono fallito: ";

        switch (error.name) {
          case "NotAllowedError":
            msg +=
              "Permesso negato. Clicca sull'icona del microfono nell'URL e consenti l'accesso.";
            break;
          case "NotFoundError":
            msg += "Nessun microfono trovato. Collega un microfono e riprova.";
            break;
          case "NotReadableError":
            msg += "Microfono occupato da un'altra applicazione.";
            break;
          case "OverconstrainedError":
            msg += "Configurazione microfono non supportata.";
            break;
          default:
            msg += error.message || "Errore sconosciuto.";
        }

        setFeedback(msg);
        setTimeout(() => setFeedback(""), 8000);
      });
  };

  // Inizia il gioco
  const startGame = () => {
    if (gameWords.length === 0) {
      setFeedback(
        "❌ Nessuna lista di parole selezionata! Vai nelle impostazioni per selezionarne una."
      );
      return;
    }

    setGameStarted(true);
    setCurrentWordIndex(0);
    setScore(0);
    setGameOver(false);
    setTimeLeft(10);
    setCurrentWord(gameWords[0]);
    setUserInput("");
    setFeedback("🎯 Gioco iniziato! Premi 'Parla' quando sei pronto");
    setCurrentStreak(0);
    setStartTime(Date.now());
  };

  // Timer per il gioco
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !gameOver) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, gameOver]);

  // Tempo scaduto
  const handleTimeUp = () => {
    const timeSpent = 10; // Tempo massimo scaduto
    // Registra come risposta sbagliata
    updateWordResult(currentWord, false, timeSpent);
    setCurrentStreak(0); // Reset della serie
    setFeedback("Tempo scaduto! ⏰");
    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  // Prossima parola
  const nextWord = () => {
    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentWord(gameWords[currentWordIndex + 1]);
      setUserInput("");
      setTimeLeft(10);
      setFeedback("✨ Nuova parola! Premi 'Parla' quando sei pronto");
      setStartTime(Date.now()); // Reset del tempo per la nuova parola
    } else {
      // Fine gioco
      setGameOver(true);
      incrementGamesPlayed(); // Registra che un gioco è stato completato
      updateBestStreak(currentStreak); // Aggiorna la miglior serie
      updateCurrentProfileScore(score); // Aggiorna il punteggio del profilo
      setFeedback(
        `Gioco finito! Punteggio finale: ${score}/${gameWords.length}`
      );
    }
  };

  // Controlla la risposta
  const checkAnswer = () => {
    const userText = userInput.toLowerCase().trim();
    const correctWord = currentWord.toLowerCase().trim();
    const timeSpent = (Date.now() - startTime) / 1000; // Tempo in secondi

    console.log(`Confronto: "${userText}" vs "${correctWord}"`);

    const isCorrect = userText === correctWord;

    // Registra il risultato nelle statistiche
    updateWordResult(currentWord, isCorrect, timeSpent);

    if (isCorrect) {
      setScore(score + 1);
      setCurrentStreak(currentStreak + 1);
      setFeedback("🎉 Corretto! Ottimo lavoro!");
    } else {
      setCurrentStreak(0); // Reset della serie se sbaglia
      setFeedback(
        `❌ Sbagliato! Hai scritto "${userInput}" ma la parola era "${currentWord}"`
      );
    }

    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  // Pronuncia la parola
  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord);

      // Cerca una voce inglese
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (voice) =>
          voice.lang.includes("en-") ||
          voice.name.toLowerCase().includes("english")
      );

      if (englishVoice) {
        utterance.voice = englishVoice;
        console.log("Usando voce inglese:", englishVoice.name);
      } else {
        console.log("Voce inglese non trovata, uso voce predefinita");
      }

      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Riconoscimento vocale con controllo manuale
  const startListening = () => {
    console.log("🎤 === INIZIO RICONOSCIMENTO VOCALE ===");
    console.log(
      "Browser supporta Speech Recognition?",
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    );

    // Controlla se il browser supporta il riconoscimento vocale
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      const errorMsg =
        "❌ Riconoscimento vocale non supportato da questo browser. Prova con Chrome/Edge.";
      console.error(errorMsg);
      setFeedback(errorMsg);
      return;
    }

    // Prima fermiamo eventuali riconoscimenti attivi
    if (isListening) {
      console.log("⚠️ Riconoscimento già attivo, salto...");
      return;
    }

    // Richiedi i permessi per il microfono
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("🔍 Richiedo permessi microfono...");
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        .then(() => {
          console.log(
            "✅ Permessi microfono concessi, avvio riconoscimento..."
          );
          startSpeechRecognition();
        })
        .catch((error) => {
          console.error("❌ Errore permessi microfono:", error);
          setFeedback(
            `❌ Permesso microfono negato: ${error.message}. Abilita il microfono nelle impostazioni del browser.`
          );
        });
    } else {
      console.log(
        "⚠️ Navigator.mediaDevices non disponibile, provo direttamente..."
      );
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    try {
      console.log("🚀 Inizializzo Speech Recognition...");

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        throw new Error("SpeechRecognition non disponibile");
      }

      const recognition = new SpeechRecognition();
      console.log("📋 Speech Recognition creato:", recognition);

      // Configurazione migliorata
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en"; // English generico per migliore accuratezza
      recognition.maxAlternatives = 5; // Più alternative per migliorare precisione

      console.log("⚙️ Configurazione Speech Recognition:");
      console.log("- continuous:", recognition.continuous);
      console.log("- interimResults:", recognition.interimResults);
      console.log("- lang:", recognition.lang);
      console.log("- maxAlternatives:", recognition.maxAlternatives);

      recognition.onstart = () => {
        console.log("🎤 Riconoscimento vocale AVVIATO!");
        setIsListening(true);
        setFeedback("🎤 Sto ascoltando... Parla ora!");
      };

      recognition.onresult = (event: any) => {
        console.log("📝 === RISULTATO RICONOSCIMENTO ===");
        console.log("Event completo:", event);
        console.log("Numero di risultati:", event.results?.length);

        if (event.results && event.results.length > 0) {
          // Prova tutte le alternative
          const alternatives = [];
          for (let i = 0; i < event.results[0].length; i++) {
            alternatives.push({
              transcript: event.results[0][i].transcript,
              confidence: event.results[0][i].confidence,
            });
          }

          console.log("🎯 Tutte le alternative:", alternatives);

          const bestResult = alternatives[0];
          const transcript = bestResult.transcript.trim();

          console.log("✅ Migliore trascrizione:", transcript);
          console.log("🎯 Confidenza:", bestResult.confidence);

          setUserInput(transcript);
          setFeedback(
            `✅ Ho sentito: "${transcript}" (confidenza: ${(
              bestResult.confidence * 100
            ).toFixed(1)}%) - Controllo...`
          );
          setIsListening(false);
          setIsProcessing(true);

          // Controlla automaticamente la risposta dopo 1 secondo
          setTimeout(() => {
            const isCorrect =
              transcript.toLowerCase().trim() === currentWord.toLowerCase();
            const timeSpent = (Date.now() - startTime) / 1000;

            console.log(
              `🔍 Confronto: "${transcript.toLowerCase()}" vs "${currentWord.toLowerCase()}" = ${isCorrect}`
            );

            updateWordResult(currentWord, isCorrect, timeSpent);

            if (isCorrect) {
              setScore((prev) => prev + 1);
              setCurrentStreak((prev) => prev + 1);
              setFeedback("🎉 Corretto! Ottimo lavoro!");
            } else {
              setCurrentStreak(0);
              setFeedback(
                `❌ Sbagliato! Hai detto "${transcript}" ma la parola era "${currentWord}"`
              );
            }
            setIsProcessing(false);

            setTimeout(() => {
              nextWord();
            }, 2000);
          }, 1000);
        } else {
          console.log("❌ Nessun risultato nel riconoscimento");
          setIsListening(false);
          setFeedback("❌ Non ho sentito nulla, premi 'Parla' per riprovare");
        }
      };

      recognition.onerror = (event: any) => {
        console.error("💥 === ERRORE RICONOSCIMENTO VOCALE ===");
        console.error("Tipo errore:", event.error);
        console.error("Event completo:", event);

        let errorMessage = "😕 Errore nel riconoscimento vocale: ";

        switch (event.error) {
          case "no-speech":
            errorMessage += "Nessun parlato rilevato. Prova di nuovo!";
            break;
          case "audio-capture":
            errorMessage += "Microfono non disponibile o non funziona.";
            break;
          case "not-allowed":
            errorMessage +=
              "Permesso microfono negato. Clicca sull'icona del microfono nell'URL.";
            break;
          case "network":
            errorMessage +=
              "Errore di rete. Controlla la connessione internet.";
            break;
          case "service-not-allowed":
            errorMessage += "Servizio di riconoscimento non consentito.";
            break;
          default:
            errorMessage += `${event.error} - Prova a ricaricare la pagina.`;
        }

        setFeedback(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("🏁 Riconoscimento vocale TERMINATO");
        setIsListening(false);
        // Controllo completamente manuale - nessun riavvio automatico
      };

      console.log("🎯 Avvio il riconoscimento...");
      recognition.start();
    } catch (error) {
      console.error("💥 Errore nell'avvio del riconoscimento vocale:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setFeedback(`❌ Errore critico: ${errorMessage}. Ricarica la pagina.`);
      setIsListening(false);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            👤 Profilo Richiesto
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Devi selezionare un profilo prima di giocare!
          </p>
          <button
            onClick={() => onNavigate("profiles")}
            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            👥 Vai ai Profili
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Tricky Words Game
          </h1>

          <div className="mb-6 p-4 bg-blue-100 rounded-lg">
            <p className="text-lg text-blue-800 mb-2">
              👤 Giocatore: <strong>{currentProfile.name}</strong>{" "}
              {currentProfile.avatar}
            </p>
            {selectedWordList && (
              <p className="text-md text-blue-700">
                📚 Lista: <strong>{selectedWordList.name}</strong> (
                {gameWords.length} parole)
              </p>
            )}
          </div>

          <p className="text-lg text-gray-600 mb-8">
            🎤 Controllo manuale del riconoscimento vocale
            <br />⏰ Hai 10 secondi per ogni parola.
          </p>

          <div className="space-y-4">
            <button
              onClick={startGame}
              disabled={gameWords.length === 0}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              🎯 Inizia Lettura ({gameWords.length} parole)
            </button>

            <button
              onClick={testMicrophone}
              className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🎤 Testa Microfono
            </button>

            <button
              onClick={() => onNavigate("menu")}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              ← Torna al Menu
            </button>
          </div>

          {/* Feedback per il test del microfono */}
          {feedback && (
            <div className="mt-4 text-lg font-medium text-gray-700 p-3 bg-gray-100 rounded-lg">
              {feedback}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            🏆 Gioco Completato!
          </h1>

          <div className="text-6xl mb-6">🎉</div>

          <p className="text-2xl text-purple-600 font-bold mb-4">
            Punteggio: {score}/{gameWords.length}
          </p>

          <p className="text-lg text-gray-600 mb-8">
            {score >= gameWords.length * 0.8
              ? "Eccellente! Sei molto bravo! 🌟"
              : score >= gameWords.length * 0.6
              ? "Buon lavoro! Continua così! 👍"
              : "Continuare a praticare! 💪"}
          </p>

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🔄 Gioca Ancora
            </button>

            <button
              onClick={() => onNavigate("menu")}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              ← Torna al Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
        {/* Header con punteggio e timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold text-gray-700">
            Parola {currentWordIndex + 1}/{gameWords.length}
          </div>
          <div className="text-lg font-semibold text-purple-600">
            Punteggio: {score}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-red-500 mb-2">
            ⏱️ {timeLeft}s
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Parola corrente */}
        <div className="mb-8">
          <h2 className="text-2xl text-gray-600 mb-4">
            📖 Ripeti questa parola:
          </h2>
          <div className="text-5xl font-bold text-purple-600 mb-4">
            {currentWord}
          </div>

          {/* Pulsante per sentire la pronuncia */}
          <button
            onClick={speakWord}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors mb-4 mr-4"
          >
            🔊 Pronuncia
          </button>

          {/* Pulsante per iniziare l'ascolto */}
          <button
            onClick={startListening}
            disabled={isListening || isProcessing}
            className={`px-8 py-4 rounded-full font-bold text-lg transition-colors mb-4 ${
              isListening || isProcessing
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isListening
              ? "🎤 Ascolto..."
              : isProcessing
              ? "⏳ Elaboro..."
              : "🎤 Parla"}
          </button>
        </div>

        {/* Stato del riconoscimento vocale */}
        <div className="mb-6">
          {isListening && (
            <div className="bg-red-100 p-4 rounded-lg animate-pulse">
              <p className="text-red-800 font-bold">🎤 Sto ascoltando...</p>
              <p className="text-red-600">Parla chiaramente!</p>
            </div>
          )}

          {isProcessing && (
            <div className="bg-yellow-100 p-4 rounded-lg animate-bounce">
              <p className="text-yellow-800 font-bold">
                ⏳ Elaborando la tua risposta...
              </p>
            </div>
          )}

          {!isListening && !isProcessing && (
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-blue-800 font-bold">
                🎯 Premi il bottone "Parla" quando sei pronto!
              </p>
            </div>
          )}
        </div>

        {/* Input manuale di backup */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Backup: scrivi qui se l'ascolto non funziona..."
            className="w-full p-4 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            onKeyPress={(e) =>
              e.key === "Enter" && userInput.trim() && checkAnswer()
            }
          />

          <div className="flex gap-4">
            <button
              onClick={startListening}
              disabled={isListening || isProcessing}
              className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${
                isListening
                  ? "bg-red-500 text-white cursor-not-allowed animate-pulse"
                  : isProcessing
                  ? "bg-yellow-500 text-white cursor-not-allowed animate-bounce"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isListening
                ? "🎤 Ascoltando..."
                : isProcessing
                ? "⏳ Elaborando..."
                : "🎤 Riavvia Ascolto"}
            </button>

            <button
              onClick={checkAnswer}
              disabled={!userInput.trim() || isProcessing}
              className="flex-1 bg-purple-500 text-white py-3 px-6 rounded-full font-bold hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ✓ Controlla Manuale
            </button>
          </div>

          {/* Informazioni per il debug */}
          <div className="text-sm text-gray-500 text-center mb-4">
            💡 Modalità: English | Controllo manuale con bottone
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-lg font-medium text-gray-700 mb-6 p-3 bg-gray-100 rounded-lg">
            {feedback}
          </div>
        )}

        {/* Pulsante per tornare al menu */}
        <button
          onClick={() => onNavigate("menu")}
          className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          ← Torna al Menu
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
