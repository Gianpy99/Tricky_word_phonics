#!/usr/bin/env python3
"""
Simple HTTP Server for Coral TPU Speech Analysis
No external dependencies required - uses only Python standard library
"""

import json
import random
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import socketserver

class SpeechAnalysisHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/health':
            self.health_check()
        elif parsed_path.path == '/get-word-list':
            self.get_word_list()
        elif parsed_path.path == '/model-info':
            self.model_info()
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/analyze-speech':
            self.analyze_speech()
        else:
            self.send_error(404, "Endpoint not found")
    
    def health_check(self):
        """Health check endpoint"""
        response = {
            "status": "healthy",
            "coral_tpu": "demo_mode",
            "server": "simple_http",
            "timestamp": "2025-07-20T14:00:00Z"
        }
        self.send_json_response(response)
    
    def get_word_list(self):
        """Get available words for practice"""
        words_by_difficulty = {
            "easy": ["the", "was", "you", "they", "said", "have", "like", "so", "do", "some"],
            "medium": ["come", "were", "there", "little", "one", "when", "out", "what", "water", "who"],
            "hard": ["school", "called", "looked", "asked", "could", "people", "your", "right", "know", "thought"]
        }
        
        response = {
            "words": words_by_difficulty,
            "total_words": sum(len(words) for words in words_by_difficulty.values())
        }
        self.send_json_response(response)
    
    def model_info(self):
        """Get information about the model"""
        response = {
            "model_loaded": False,
            "demo_mode": True,
            "message": "Running in demo mode - no model files required"
        }
        self.send_json_response(response)
    
    def analyze_speech(self):
        """Analyze speech pronunciation"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract request data
            target_word = data.get('target_word', '').lower()
            difficulty = data.get('difficulty', 'medium')
            
            if not target_word:
                self.send_error(400, "Missing target_word")
                return
            
            # Demo analysis
            analysis = self.demo_analysis(target_word, difficulty)
            
            response = {
                "success": True,
                "analysis": analysis,
                "word": target_word,
                "difficulty": difficulty
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            error_response = {
                "success": False,
                "error": str(e),
                "analysis": self.fallback_analysis(target_word if 'target_word' in locals() else "unknown")
            }
            self.send_json_response(error_response, status_code=500)
    
    def demo_analysis(self, target_word, difficulty_level="medium"):
        """Simulate realistic speech analysis"""
        
        # Simulate accuracy based on word difficulty
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
            "improvement_tips": self.get_improvement_tips(accuracy, target_word),
            "timing_analysis": {
                "duration": round(random.uniform(0.8, 2.5), 2),
                "pace_rating": "good" if random.choice([True, False]) else "too_fast"
            },
            "audio_quality": "good",
            "processing_method": "demo_mode"
        }
    
    def get_threshold_by_difficulty(self, difficulty):
        """Get accuracy threshold based on difficulty level"""
        thresholds = {
            "easy": 70,
            "medium": 75,
            "hard": 80
        }
        return thresholds.get(difficulty, 75)
    
    def generate_ai_feedback(self, accuracy, word, difficulty):
        """Generate AI-powered feedback"""
        if accuracy >= 90:
            return f"🌟 Perfetto! Hai pronunciato '{word}' in modo eccellente!"
        elif accuracy >= 80:
            return f"🎉 Ottimo! Quasi perfetto su '{word}'. Continua così!"
        elif accuracy >= 70:
            return f"👍 Bene! '{word}' è pronunciato abbastanza bene. Prova ancora!"
        elif accuracy >= 60:
            return f"💪 Non male! '{word}' può essere migliorato. Ascolta e riprova!"
        else:
            return f"🔄 Riprova! Ascolta attentamente '{word}' e pronuncia lentamente."
    
    def phonetic_breakdown(self, word, accuracy):
        """Provide phonetic analysis"""
        phonetic_map = {
            "the": "/ðə/",
            "was": "/wɒz/",
            "said": "/sed/",
            "school": "/skuːl/",
            "thought": "/θɔːt/",
            "come": "/kʌm/",
            "were": "/wɜːr/",
            "there": "/ðeər/",
            "little": "/ˈlɪtəl/",
            "water": "/ˈwɔːtər/"
        }
        
        phonetic = phonetic_map.get(word.lower(), f"/{word}/")
        
        if accuracy >= 80:
            return f"Pronuncia fonetica corretta: {phonetic}"
        else:
            return f"Lavora sulla pronuncia: {phonetic} - Ascolta il suono e ripeti lentamente"
    
    def get_improvement_tips(self, accuracy, word):
        """Get personalized improvement tips"""
        tips = []
        
        if accuracy < 70:
            tips.append("🗣️ Parla più chiaramente e lentamente")
            tips.append("🎧 Ascolta la pronuncia più volte")
        
        if accuracy < 80:
            tips.append("📱 Avvicinati al microfono")
            tips.append("🔄 Ripeti la parola sillaba per sillaba")
        
        if len(word) > 5:
            tips.append("📝 Dividi la parola in parti più piccole")
        
        return tips
    
    def fallback_analysis(self, target_word):
        """Fallback analysis when something fails"""
        return {
            "is_correct": True,
            "accuracy_score": 75.0,
            "confidence": 0.75,
            "feedback": f"⚠️ Analisi base completata per '{target_word}'.",
            "phonetic_breakdown": f"Pronuncia la parola '{target_word}' chiaramente",
            "improvement_tips": ["Riprova con la registrazione"],
            "audio_quality": "unknown",
            "processing_method": "fallback"
        }
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(json_data.encode('utf-8'))

    def log_message(self, format, *args):
        """Custom log message format"""
        print(f"🌐 {self.address_string()} - {format % args}")

def run_server(port=5000):
    """Run the HTTP server"""
    server_address = ('', port)
    
    print("🚀 Starting Simple HTTP Speech Analysis Server...")
    print(f"🌐 Server URL: http://localhost:{port}")
    print("📡 Available endpoints:")
    print(f"   • GET  /health")
    print(f"   • GET  /get-word-list") 
    print(f"   • GET  /model-info")
    print(f"   • POST /analyze-speech")
    print("✨ Demo mode active - no dependencies required!")
    print("🎯 Ready for phonics practice!")
    
    try:
        httpd = HTTPServer(server_address, SpeechAnalysisHandler)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
