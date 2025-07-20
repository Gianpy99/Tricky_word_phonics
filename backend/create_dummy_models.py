# Create a dummy TensorFlow Lite model for testing
import tensorflow as tf
import numpy as np
import os

def create_dummy_speech_model():
    """Create a simple dummy model for testing the TPU integration"""
    
    # Create a simple sequential model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(13, 100, 1)),  # MFCC input: 13 features, 100 time steps
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(1, activation='sigmoid')  # Output: pronunciation quality score
    ])
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    # Create some dummy training data
    X_dummy = np.random.random((100, 13, 100, 1))
    y_dummy = np.random.randint(0, 2, (100, 1))
    
    # Train for just 1 epoch to get some weights
    model.fit(X_dummy, y_dummy, epochs=1, verbose=0)
    
    return model

def convert_to_tflite(model, output_path):
    """Convert the Keras model to TensorFlow Lite format"""
    
    # Convert the model
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optimize for Edge TPU (optional)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.target_spec.supported_types = [tf.float16]
    
    # Convert
    tflite_model = converter.convert()
    
    # Save the model
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"✅ Dummy TFLite model saved to: {output_path}")
    print(f"📊 Model size: {len(tflite_model) / 1024:.1f} KB")

def create_models_directory():
    """Create the models directory and dummy models"""
    
    models_dir = "models"
    os.makedirs(models_dir, exist_ok=True)
    
    # Create dummy speech recognition model
    print("🤖 Creating dummy speech recognition model...")
    speech_model = create_dummy_speech_model()
    convert_to_tflite(speech_model, os.path.join(models_dir, "speech_model_edgetpu.tflite"))
    
    # Create a simple README for the models
    with open(os.path.join(models_dir, "README.md"), "w") as f:
        f.write("""# AI Models Directory

## Current Models

### speech_model_edgetpu.tflite
- **Purpose**: Dummy speech recognition model for testing
- **Input**: MFCC features (13, 100, 1)
- **Output**: Pronunciation quality score (0-1)
- **Note**: This is a dummy model for testing. Replace with a real trained model for production.

## Real Model Training

To create a real speech recognition model:

1. **Data Collection**: Record audio samples with correct pronunciations
2. **Feature Extraction**: Convert audio to MFCC features
3. **Model Training**: Train a CNN/RNN model for speech analysis
4. **Edge TPU Compilation**: Use Google's Edge TPU Compiler
5. **Model Replacement**: Replace the dummy model with your trained model

## Model Requirements

- **Input Format**: MFCC features (13 coefficients, 100 time steps, 1 channel)
- **Output Format**: Single float value (0.0 to 1.0) representing pronunciation quality
- **File Format**: TensorFlow Lite (.tflite)
- **Edge TPU**: Optional compilation for faster inference
""")
    
    print(f"📁 Models directory created at: {models_dir}")
    print(f"📖 See {models_dir}/README.md for more information")

if __name__ == "__main__":
    print("🛠️  Setting up dummy AI models for testing...")
    create_models_directory()
    print("✅ Setup complete! You can now test the application.")
    print("⚠️  Remember: These are dummy models. For production, use real trained models.")
