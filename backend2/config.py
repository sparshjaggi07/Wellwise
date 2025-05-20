from pymongo import MongoClient

class Config:
    MONGO_URI = 'mongodb+srv://anshshrivastav032:l8P8CjZ52HpTpjMn@cluster0.tpy8oty.mongodb.net/depression?connectTimeoutMS=30000'

    def connect_mongodb(self):
        try:
            # Connect to MongoDB
            client = MongoClient(self.MONGO_URI)
            db = client.get_database()
            print(f"Successfully connected to MongoDB at {self.MONGO_URI}")
            return db
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
