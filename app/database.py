from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

# Azure SQL connection string components
username = "production"
password = "Clorox77"
server = "ticket1.database.windows.net"
database = "tracker"
driver = "ODBC Driver 17 for SQL Server"

# Encode password and driver correctly
connection_string = (
    f"mssql+pyodbc://{username}:{quote_plus(password)}@{server}/{database}"
    f"?driver={quote_plus(driver)}"
)

# Create the engine
engine = create_engine(connection_string, fast_executemany=True)

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency function for DB session (used in routers)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()