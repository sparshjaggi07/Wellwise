from flask import Blueprint, request, jsonify
from models.model_phq9 import PHQ9

phq9_bp = Blueprint('History', __name__ )

@phq9_bp.route('/save_phq', methods=['POST'])
def save_userdata():

    data = request.get_json()

    userSub = data.get('usersub')
    q1 = data.get('phq1')
    q2 = data.get('phq2')
    q3 = data.get('phq3')
    q4 = data.get('phq4')
    q5 = data.get('phq5')
    q6 = data.get('phq6')
    q7 = data.get('phq7')
    q8 = data.get('phq8')
    q9 = data.get('phq9')

    exist =  PHQ9.get(userSub)

    if exist:
        PHQ9.update(userSub, {
            "phq1" : q1,
            "phq2" : q2,
            "phq3" : q3,
            "phq4" : q4,
            "phq5" : q5,
            "phq6" : q6,
            "phq7" : q7,
            "phq8" : q8,
            "phq9" : q9 
        })

        updated_detail = PHQ9.get(userSub)
        return jsonify({
            "message" : "updated successfully",
            "updated_data" : updated_detail
        }),200
    else:
        new_data = PHQ9.create(userSub, None, None, q1, q2, q3, q4, q5, q6, q7, q8, q9)
        return jsonify({
            "message" : "new user_data created",
            "details" : new_data
        }), 200


@phq9_bp.route('/phq9_score', methods=['POST'])
def calculate_score():

    data = request.get_json()
    usersub = data.get('usersub')

    phq_data = PHQ9.get(usersub)

    if not phq_data:
        return jsonify({"error": "User history data not found"}), 404


    q1 = phq_data["phq1"]
    q2 = phq_data["phq2"]
    q3 = phq_data["phq3"]
    q4 = phq_data["phq4"]
    q5 = phq_data["phq5"]
    q6 = phq_data["phq6"]
    q7 = phq_data["phq7"]
    q8 = phq_data["phq8"]
    q9 = phq_data["phq9"]

    total_score = (q1+q2+q3+q4+q5+q6+q7+q8+q9)/15.0

    PHQ9.update(usersub, {"phq9_score" : total_score})

    update = PHQ9.get(usersub)

    return jsonify({"message": "Total score calculated successfully!", "updated data" : update}), 200


