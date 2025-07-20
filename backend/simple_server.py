# Simplified Speech Analysis Server for Phonics Game
import os
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

class SimplifiedSpeechAnalyzer:
    def __init__(self):
        """Initialize the simplified speech analyzer for demo mode"""
        print("🎯 Initialized Simplified Speech Analyzer in Demo Mode")
        
    def demo_analysis(self, target_word, difficulty_level="medium"):
        """Simulate speech analysis for demo purposes"""
        # Simulate realistic accuracy based on word difficulty
        difficulty_scores = {
            "easy": random.uniform(75, 95),
            "medium": random.uniform(65, 85), 
            "hard": random.uniform(55, 75)
        }
        
        accuracy = difficulty_scores.get(difficulty_level, random.uniform(60, 80))
        threshold = self.get_threshold_by_difficulty(difficulty_level)
        is_correct = accuracy >= threshold
        
        return {
            "is_correct": is_correct,
            "accuracy_score": round(accuracy, 1),
            "confidence": round(accuracy / 100, 3),
            "feedback": self.generate_ai_feedback(accuracy, target_word, difficulty_level),
            "phonetic_breakdown": self.phonetic_breakdown(target_word, accuracy),
            "improvement_tips": self.get_improvement_tips(target_word, accuracy),
            "timing_analysis": {
                "duration": round(random.uniform(0.8, 2.5), 2),
                "pace_rating": "good" if random.choice([True, False]) else "too_fast"
            },
            "audio_quality": "good",
            "processing_method": "demo_mode"
        }
    
    def get_threshold_by_difficulty(self, difficulty_level):
        """Get accuracy threshold based on difficulty"""
        thresholds = {
            "easy": 70.0,
            "medium": 75.0,
            "hard": 80.0
        }
        return thresholds.get(difficulty_level, 75.0)
    
    def generate_ai_feedback(self, accuracy, word, difficulty_level):
        """Generate encouraging feedback for children"""
        if accuracy >= 85:
            return f"🌟 Eccellente! '{word}' è pronunciato perfettamente! Sei bravissimo!"
        elif accuracy >= 75:
            return f"👍 Bene! '{word}' è pronunciato abbastanza bene. Prova ancora!"
        elif accuracy >= 60:
            return f"💪 Non male! '{word}' può essere migliorato. Ascolta e riprova!"
        else:
            return f"🔄 Riprova! Ascolta attentamente '{word}' e pronuncia lentamente."
    
    def phonetic_breakdown(self, word, accuracy):
        """Provide phonetic analysis of the word"""
        phonetic_map = {
            "the": "/ðə/",
            "was": "/wɒz/",
            "said": "/sed/",
            "school": "/skuːl/",
            "thought": "/θɔːt/",
            "where": "/weə/",
            "what": "/wɒt/",
            "who": "/huː/",
            "why": "/waɪ/",
            "when": "/wen/"
        }
        
        phonetic = phonetic_map.get(word.lower(), f"/{word}/")
        
        if accuracy >= 80:
            return f"Pronuncia fonetica corretta: {phonetic}"
        else:
            return f"Prova a pronunciare: {phonetic}"
    
    def get_improvement_tips(self, word, accuracy):
        """Provide specific tips for pronunciation improvement"""
        tips = {
            "the": "Usa la lingua tra i denti per il suono 'th'",
            "was": "Pronuncia 'woz' con la 'o' aperta",
            "said": "Non dire 'sayed', ma 'sed'",
            "school": "Allunga il suono 'oo'",
            "thought": "Combina 'th' e 'ought'"
        }
        
        tip = tips.get(word.lower(), f"Ascolta attentamente e ripeti '{word}' lentamente")
        
        if accuracy < 70:
            return f"💡 Suggerimento: {tip}"
        else:
            return "✨ Continua così!"

# Initialize analyzer
speech_analyzer = SimplifiedSpeechAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "mode": "simplified_demo",
        "timestamp": str(np.datetime64('now'))
    })

@app.route('/analyze-speech', methods=['POST'])
def analyze_speech():
    """Main endpoint for speech analysis"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract parameters
        audio_data = data.get('audio_data')  # Base64 encoded audio (not used in demo)
        target_word = data.get('word', 'test')
        difficulty_level = data.get('difficulty', 'medium')
        
        print(f"🎯 Analyzing word: '{target_word}' (difficulty: {difficulty_level})")
        
        # Perform demo analysis
        result = speech_analyzer.demo_analysis(target_word, difficulty_level)
        
        print(f"✅ Analysis complete: {result['accuracy_score']}% accuracy")
        
        return jsonify({
            "success": True,
            "analysis": result
        })
        
    except Exception as e:
        print(f"❌ Error in speech analysis: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "analysis": {
                "is_correct": False,
                "accuracy_score": 0,
                "feedback": "Si è verificato un errore. Riprova!",
                "processing_method": "error_fallback"
            }
        }), 500

@app.route('/words/difficulty/<level>', methods=['GET'])
def get_words_by_difficulty(level):
    """Get words by difficulty level"""
    words_db = {
        "easy": ["cat", "dog", "sun", "run", "fun", "big", "red", "bed"],
        "medium": ["the", "was", "said", "what", "when", "where", "who"],
        "hard": ["school", "thought", "through", "enough", "laugh", "caught"]
    }
    
    words = words_db.get(level, words_db["medium"])
    return jsonify({"words": words})

@app.route('/stats/update', methods=['POST'])
def update_stats():
    """Update player statistics"""
    try:
        data = request.get_json()
        # In a real implementation, this would save to a database
        print(f"📊 Stats update: {data}")
        return jsonify({"success": True, "message": "Stats updated"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Simplified Speech Analysis Server...")
    print("🎯 Running in Demo Mode")
    print("🌐 Server will be available at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
