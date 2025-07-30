from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from typing import Optional
from sqlalchemy.orm import Session
import models
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the JWT secret from environment variables
JWT_SECRET = os.getenv("JWT_SECRET")

if not JWT_SECRET:
    raise Exception("JWT_SECRET not set in environment variables")

# Konfiguracija za enkripciju lozinke
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funkcija za autentifikaciju korisnika
def authenticate_user(db: Session, username: str, password: str) -> Optional[models.User]:
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return None
    if not pwd_context.verify(password, user.password):
        return None
    return user

# Funkcija za generisanje JWT tokena
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)  # Token će isteći za 15 minuta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt
