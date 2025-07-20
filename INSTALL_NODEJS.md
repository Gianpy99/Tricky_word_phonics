# 🚨 INSTALLAZIONE NODEJS RICHIESTA

## Node.js NON è installato sul sistema

Per far funzionare l'applicazione di lettura, devi prima installare Node.js:

### 📥 Download e Installazione

1. **Vai su**: https://nodejs.org/
2. **Scarica**: La versione LTS (Long Term Support) - attualmente 20.x.x
3. **Esegui**: Il file .msi scaricato
4. **Segui**: Le istruzioni dell'installer (lascia tutte le opzioni di default)
5. **Riavvia**: PowerShell/Terminal dopo l'installazione

### ✅ Verifica Installazione

Dopo l'installazione, riapri PowerShell e verifica:

```bash
node --version    # Dovrebbe mostrare v20.x.x
npm --version     # Dovrebbe mostrare 10.x.x
```

### 🎯 Poi potrai avviare l'app:

```bash
cd "c:\Development\AI_CoralTPU_Phonics\Tricky_word_phonics"
npm install       # Installa dipendenze
npm run dev       # Avvia applicazione
```

---

## 🤖 INTEGRAZIONE CORAL TPU

Una volta che Node.js funziona, integreremo il tuo Coral TPU per:

1. **Analisi Audio Avanzata**: Modelli di machine learning per valutazione pronuncia
2. **Riconoscimento Vocale Migliorato**: AI locale invece di Web Speech API
3. **Feedback Personalizzato**: Analisi più sofisticata degli errori di pronuncia

### Preparazione per Coral TPU:
- Python + TensorFlow Lite
- Modelli pre-addestrati per speech recognition
- API backend per comunicare con l'app React

**Procedi con l'installazione di Node.js e poi torneremo sull'integrazione Coral TPU! 🚀**
