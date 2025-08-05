import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

username = os.getenv("DB_USER", "production@ticket1")
password = os.getenv("DB_PASS", "Clorox77")
server = os.getenv("DB_SERVER", "ticket1.database.windows.net")
database = os.getenv("DB_NAME", "tracker")
driver = "ODBC Driver 17 for SQL Server"

connection_string = (
    f"mssql+pyodbc://{username}:{quote_plus(password)}@{server}/{database}"
    f"?driver={quote_plus(driver)}"
)

engine = create_engine(connection_string, fast_executemany=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()