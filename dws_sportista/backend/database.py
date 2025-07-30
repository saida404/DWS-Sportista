import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Učitajte URL baze podataka iz .env datoteke
from dotenv import load_dotenv
load_dotenv()

# Postavite URL baze podataka
DATABASE_URL = os.environ.get("DATABASE_URL")

# Kreirajte instancu `create_engine` sa asyncpg
engine = create_engine(DATABASE_URL, echo=True, future=True)

# Kreirajte session factory za rad s bazom podataka
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

# Deklarirajte Base klasu
Base = declarative_base()
