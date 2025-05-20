from flask import Blueprint, request, jsonify
from models.model_user import UserData
from models.model_emotion import OpenCV
from models.model_history import History
from models.model_phq9 import PHQ9
from models.model_sentiment import Sentiment


user_bp = Blueprint('User', __name__ )

@user_bp.route('/save_userData', methods=['POST'])
def save_userdata():

    data = request.get_json()

    userSub = data.get('usersub')
    name = data.get('name')
    age = data.get('age')
    gender = data.get('gender')

    exist =  UserData.get(userSub)

    if exist:
        UserData.update(userSub, {
            "name" : name,
            "age" : age,
            "gender" : gender
        })

        updated_detail = UserData.get(userSub)
        return jsonify({
            "message" : "updated successfully",
            "updated_data" : updated_detail
        }),200
    else:
        new_data = UserData.create(userSub, name, age, gender, None)
        return jsonify({
            "message" : "new user_data created",
            "details" : new_data
        }), 200
    

    
@user_bp.route('/depression_score', methods=['POST'])
def depression_score():
    data = request.get_json()
    usersub = data.get('usersub')

    user_data = UserData.get(usersub)
    user_history = History.find(usersub)
    user_phq9 = PHQ9.find(usersub)
    user_emotion = OpenCV.find(usersub)
    user_sentiment = Sentiment.find(usersub)

    if not (user_data and user_history and user_phq9 and user_emotion and user_sentiment):
        return jsonify({"message": "No user data found"}), 404

    weights = {
        "history_wt": 0.2,
        "phq9_wt": 0.5,
        "sentiment_wt": 0.2,
        "opencv_wt": 0.1
    }

    history_score = user_history["history_score"]
    phq9_score = user_phq9["phq9_score"]
    emotion_score = user_emotion["emotion_score"]
    sentiment_score = user_sentiment["total_score"]

    depression_score = (
        (weights["history_wt"] * history_score) +
        (weights["phq9_wt"] * phq9_score) +
        (weights["opencv_wt"] * emotion_score) +
        (weights["sentiment_wt"] * sentiment_score)
    )

    UserData.update(usersub, {"mental_health_score": depression_score})

    new_data = UserData.get(usersub)

    return jsonify({
        "message": "Successfully scored",
        "status": new_data
    }), 201



 
    







    

    