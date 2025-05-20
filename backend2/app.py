from flask import Flask
from config import Config
from db import mongo
from routes.sentiment_route import sentiment_bp
from routes.user_route import user_bp
from routes.phq9_route import phq9_bp
from routes.history_route import history_bp
from routes.emotion_route import emotion_detection
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
mongo.init_app(app)

CORS(app)

app.register_blueprint(sentiment_bp)
app.register_blueprint(user_bp)
app.register_blueprint(phq9_bp)
app.register_blueprint(history_bp)
app.register_blueprint(emotion_detection)

if __name__ == '__main__':
    app.run(debug=True)
