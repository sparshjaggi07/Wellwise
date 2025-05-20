import os
import pickle
import re
import numpy as np
from flask import Blueprint, request, jsonify
from models.model_sentiment import Sentiment
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import nltk
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer


nltk.download('punkt')
nltk.download('punkt_tab')


sentiment_bp = Blueprint('sentiment', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BASE_DIR, '../ml')
VECTOR_PATH = os.path.join(ML_DIR, 'tfidf_vectorizer.pkl')
MODEL_PATH = os.path.join(ML_DIR, 'trained_model.pkl')
LABEL_ENCODER_PATH = os.path.join(ML_DIR, 'label_encoder.pkl')

try:
    vectorizer = pickle.load(open(VECTOR_PATH, 'rb'))
    logreg = pickle.load(open(MODEL_PATH, 'rb'))
    label_encoder = pickle.load(open(LABEL_ENCODER_PATH, 'rb'))
except Exception as e:
    print(f"Error loading model files: {e}")
    raise RuntimeError("Failed to load model files.")

def preprocess_text(text):
    stemmer = PorterStemmer()
    text = str(text).lower()
    text = re.sub(r'http[s]?://\S+', '', text)
    text = re.sub(r'\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    stemmed_tokens = ' '.join(stemmer.stem(token) for token in tokens)
    return stemmed_tokens

def predict_status(text):
    preprocessed_text = preprocess_text(text)
    text_tfidf = vectorizer.transform([preprocessed_text])
    num_features = np.array([[len(text), len(re.findall(r'\.', text))]])
    combined_features = hstack([text_tfidf, num_features])
    prediction = logreg.predict(combined_features)
    return prediction[0]

@sentiment_bp.route('/save_text', methods=['POST'])
def save_sentiment():
    data = request.get_json()
    
    usersub = data.get('usersub')
    s1_text = data.get('s1')
    s2_text = data.get('s2')

    sentiment_data = {
        "usersub": usersub,
        "ml_s1": None,
        "ml_s2": None,
        "s1": {"text": s1_text, "score": None},
        "s2": {"text": s2_text, "score": None},
        "total_score": None
    }

    existing_sentiment = Sentiment.get(usersub)

    if existing_sentiment:
        Sentiment.update(usersub, {
            "ml_s1": sentiment_data["ml_s1"],
            "ml_s2": sentiment_data["ml_s2"],
            "s1": sentiment_data["s1"],
            "s2": sentiment_data["s2"],
            "total_score": sentiment_data["total_score"]
        })
        
        updated_sentiment = Sentiment.get(usersub)  
        return jsonify({
            "message": "Sentiment data updated successfully!",
            "updated_sentiment": updated_sentiment
        }), 200
    else:
        Sentiment.create(usersub, None, None, None, s1_text, s2_text, None, None)
        
        new_sentiment = Sentiment.get(usersub)
        return jsonify({
            "message": "Sentiment data saved successfully!",
            "new_sentiment": new_sentiment
        }), 201


@sentiment_bp.route('/process_sentiment', methods=['POST'])
def process_sentiment():
    data = request.get_json()
    
    usersub = data.get('usersub')

    sentiment_data = Sentiment.get(usersub)
    
    if not sentiment_data:
        return jsonify({"error": "User sentiment data not found"}), 404

    s1_text = sentiment_data['s1']['text']
    s2_text = sentiment_data['s2']['text']

    predicted_status1 = predict_status(s1_text)
    original_status1 = label_encoder.inverse_transform([predicted_status1])[0]

    predicted_status2 = predict_status(s2_text)
    original_status2 = label_encoder.inverse_transform([predicted_status2])[0]

    Sentiment.update(usersub, {"ml_s1": original_status1, "ml_s2": original_status2})

    return jsonify({
        "message": "Sentiment data processed successfully!",
        "ml_s1": original_status1,
        "ml_s2": original_status2
    }), 200



@sentiment_bp.route('/sentiment_score', methods=['POST'])
def calculate_score():

    data = request.get_json()
    usersub = data.get('usersub')

    sentiment_data = Sentiment.get(usersub)
    if not sentiment_data:
        return jsonify({"error": "User sentiment data not found"}), 404

    prediction_point = {
        "Normal" :0,
        "Depression":3.5,
        "Suicidal": 4,
        "Anxiety": 0.7,
        "Bipolar": 1,
        "Stress": 1.5,
        "Personality disorder":0.5
    }

    ml_s1 = sentiment_data["ml_s1"]
    ml_s2 = sentiment_data["ml_s2"]
    
    score1 = prediction_point.get(ml_s1,0)
    score2 = prediction_point.get(ml_s2,0)

    total_score = (score1+score2)/8.0
    
    updated_sentiment = {
        "usersub": usersub,
        "ml_s1": ml_s1,
        "ml_s2": ml_s2,
        "s1": {"text": sentiment_data['s1']['text'], "score": score1},
        "s2": {"text": sentiment_data['s2']['text'], "score": score2},
        "total_score": total_score
    }

    Sentiment.update(usersub, updated_sentiment)

    update = Sentiment.get(usersub)

    return jsonify({"message": "Total score calculated successfully!", "updated data" : update}), 200

