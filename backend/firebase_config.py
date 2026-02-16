import os
import firebase_admin
from firebase_admin import credentials, firestore, auth

def initialize_firebase():
    """
    環境変数からFirebase Admin SDKを初期化する。
    すでに初期化されている場合は何もしない。
    """
    if firebase_admin._apps:
        return firebase_admin.get_app()

    project_id = os.getenv("FIREBASE_PROJECT_ID")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")

    if not all([project_id, client_email, private_key]):
        print("Warning: Firebase environment variables are missing. Firebase features will not work.")
        return None

    # Replace literal \n with actual newlines if necessary (common issue with env vars)
    if private_key:
        private_key = private_key.replace("\\n", "\n")

    cred_dict = {
        "type": "service_account",
        "project_id": project_id,
        "private_key_id": "ignored-by-sdk", # SDK doesn't strictly need this if private_key is valid
        "private_key": private_key,
        "client_email": client_email,
        "client_id": "ignored-by-sdk",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email}"
    }

    try:
        cred = credentials.Certificate(cred_dict)
        app = firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully.")
        return app
    except Exception as e:
        print(f"Failed to initialize Firebase Admin SDK: {e}")
        return None

def get_firestore_client():
    if not firebase_admin._apps:
        initialize_firebase()
    if firebase_admin._apps:
        return firestore.client()
    return None

def verify_token(id_token: str):
    if not firebase_admin._apps:
        initialize_firebase()
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None
