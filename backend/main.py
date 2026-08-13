import os
import hashlib
import uuid
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape
from typing import List, Optional
import json
from datetime import datetime, timedelta

import models, schemas, auth
from fastapi.security import OAuth2PasswordRequestForm
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gia Lai Deforestation Web GIS API")

@app.on_event("startup")
def seed_admin():
    db = next(get_db())
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        hashed_password = auth.get_password_hash("Admin@123")
        db_user = models.User(
            username="admin", 
            email="admin@gialai.gov.vn",
            full_name="System Administrator",
            organization="Gia Lai DARD",
            hashed_password=hashed_password, 
            role="admin"
        )
        db.add(db_user)
        db.commit()

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="api_uploads")

def hash_ip(ip: str) -> str:
    # Use a secret salt in production
    salt = "gialai_secret_salt_2026"
    return hashlib.sha256(f"{ip}{salt}".encode('utf-8')).hexdigest()

ABOUT_FILE = os.path.join(UPLOAD_DIR, "about.json")

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role = "user"
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        email=user.email,
        full_name=user.full_name,
        organization=user.organization,
        hashed_password=hashed_password, 
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/api/about")
def get_about():
    if os.path.exists(ABOUT_FILE):
        with open(ABOUT_FILE, "r") as f:
            return json.load(f)
    return {} # Return empty, frontend fallback takes over

@app.post("/api/about")
def update_about(data: dict, current_user: models.User = Depends(auth.require_admin)):
    with open(ABOUT_FILE, "w", encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
    return {"status": "success"}

@app.post("/api/reports", response_model=schemas.ReportResponse)
async def create_report(
    request: Request,
    lat: float = Form(...),
    lon: float = Form(...),
    comment: str = Form(None),
    image_url_str: str = Form(None, alias="image_url"),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_optional_user)
):
    # Hash User IP
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_ip_hash = hash_ip(client_ip)
    
    # Rate Limiting: Max 3 reports per 10 minutes per IP
    ten_minutes_ago = datetime.utcnow() - timedelta(minutes=10)
    report_count = db.query(models.FieldReport).filter(
        models.FieldReport.user_ip_hash == user_ip_hash,
        models.FieldReport.created_at >= ten_minutes_ago
    ).count()

    if report_count >= 3:
        raise HTTPException(status_code=429, detail="Too Many Requests. Please wait 10 minutes.")

    image_url = image_url_str
    if file:
        # Validate image extension
        ext = file.filename.split('.')[-1].lower()
        if ext not in ['jpg', 'jpeg', 'png']:
            raise HTTPException(status_code=400, detail="Only JPG or PNG images allowed")
        
        # Save file to disk
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # URL for frontend to access (served via /api/uploads route)
        image_url = f"/api/uploads/{filename}"

    # Create PostGIS point (Lon, Lat is standard for EWKT)
    pt_wkt = f"POINT({lon} {lat})"
    geom = WKTElement(pt_wkt, srid=4326)

    new_report = models.FieldReport(
        geom=geom,
        comment=comment,
        image_url=image_url,
        user_id=current_user.id if current_user else None,
        user_ip_hash=user_ip_hash
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return schemas.ReportResponse(
        id=new_report.id,
        lat=lat,
        lon=lon,
        comment=new_report.comment,
        image_url=new_report.image_url,
        created_at=new_report.created_at
    )

@app.get("/api/reports", response_model=List[schemas.ReportResponse])
def get_reports(
    db: Session = Depends(get_db)
):
    reports = db.query(models.FieldReport).all()
    res = []
    for r in reports:
        # Extract lat/lon from PostGIS geometry
        pt = to_shape(r.geom)
        res.append(schemas.ReportResponse(
            id=r.id,
            lat=pt.y,
            lon=pt.x,
            comment=r.comment,
            image_url=r.image_url,
            created_at=r.created_at
        ))
    return res

@app.post("/api/contact", response_model=schemas.ContactResponse)
def create_contact_message(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    new_msg = models.ContactMessage(
        name=contact.name,
        email=contact.email,
        organization=contact.organization,
        message=contact.message
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@app.get("/api/contact", response_model=List[schemas.ContactResponse])
def get_contact_messages(db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_admin)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()

@app.get("/")
def read_root():
    return {"status": "Gia Lai Web GIS Backend is running!"}
