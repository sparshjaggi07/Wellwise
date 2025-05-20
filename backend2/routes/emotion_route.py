from flask import Blueprint, Response, jsonify
import cv2
from deepface import DeepFace
import json
from datetime import datetime
import time
import threading
import matplotlib.pyplot as plt

emotion_detection = Blueprint('emotion_detection', __name__)

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize the video capture object
cap = None
processing = False
emotion_counts = {}
capture_interval = 0  # Set a reasonable capture interval
last_capture_time = None

def process_frame():
    global cap, processing, last_capture_time, emotion_counts
    while processing:
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        current_time = time.time()
        if current_time - last_capture_time >= capture_interval:
            for (x, y, w, h) in faces:
                face_roi = rgb_frame[y:y + h, x:x + w]
                result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                emotion = result[0]['dominant_emotion']
                if emotion in emotion_counts:
                    emotion_counts[emotion] += 1
                else:
                    emotion_counts[emotion] = 1

                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(frame, f"Emotion: {emotion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            last_capture_time = current_time

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@emotion_detection.route('/start_session', methods=['GET'])
def start_session():
    global cap, processing, last_capture_time, emotion_counts
    cap = cv2.VideoCapture(0)
    processing = True
    last_capture_time = time.time()
    emotion_counts = {}
    threading.Thread(target=process_frame).start()
    return jsonify({"status": "session started"})

@emotion_detection.route('/stop_session', methods=['GET'])
def stop_session():
    global cap, processing, emotion_counts
    processing = False
    if cap:
        cap.release()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"detected_emotion_counts_{timestamp}.json"
    with open(output_file, 'w') as json_file:
        json.dump(emotion_counts, json_file)
    plot_emotion_distribution(emotion_counts, timestamp)
    return jsonify({"status": "session stopped", "emotion_counts": emotion_counts})

@emotion_detection.route('/video_feed')
def video_feed():
    return Response(process_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

def plot_emotion_distribution(emotion_counts, timestamp):
    plt.figure(figsize=(10, 6))
    plt.bar(emotion_counts.keys(), emotion_counts.values(), color='blue')
    plt.xlabel("Emotions")
    plt.ylabel("Count")
    plt.title("Emotion Distribution")
    plt.xticks(rotation=45)
    plot_output_file = f"emotion_distribution_{timestamp}.png"
    plt.savefig(plot_output_file)
    plt.show()
    print(f"Emotion distribution graph saved to {plot_output_file}")