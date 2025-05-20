from flask import Blueprint, request, jsonify
from models.model_history import History

history_bp = Blueprint('history_bp', __name__ )

@history_bp.route('/save_history', methods=['POST'])
def save_userdata():

    data = request.get_json()

    userSub = data.get('usersub')
    q1 = data.get('q1')
    q2 = data.get('q2')
    q3 = data.get('q3')
    q4 = data.get('q4')
    q5 = data.get('q5')

    exist =  History.get(userSub)

    if exist:
        History.update(userSub, {
            "q1" : q1,
            "q2" : q2,
            "q3" : q3,
            "q4" : q4,
            "q5" : q5 
        })

        updated_detail = History.get(userSub)
        return jsonify({
            "message" : "updated successfully",
            "updated_data" : updated_detail
        }),200
    else:
        new_data = History.create(userSub, None, q1, q2, q3, q4, q5)
        return jsonify({
            "message" : "new user_data created",
            "details" : new_data
        }), 200


@history_bp.route('/history_score', methods=['POST'])
def calculate_score():

    data = request.get_json()
    usersub = data.get('usersub')

    History_data = History.get(usersub)

    if not History_data:
        return jsonify({"error": "User history data not found"}), 404


    q1 = History_data["q1"]
    q2 = History_data["q2"]
    q3 = History_data["q3"]
    q4 = History_data["q4"]
    q5 = History_data["q5"]

    total_score = (q1+q2+q3+q4+q5)/15.0

    History.update(usersub, {"history_score" : total_score})

    update = History.get(usersub)

    return jsonify({"message": "Total score calculated successfully!", "updated data" : update}), 200


