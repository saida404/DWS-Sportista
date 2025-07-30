from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
import jwt
from jwt import PyJWTError
from typing import Optional, List
from sqlalchemy import and_, desc, asc
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

# dotenv stvari
from dotenv import load_dotenv
load_dotenv()
JWT_SECRET = os.environ.get("JWT_SECRET")


from jwt_utils import authenticate_user, create_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# Dodajemo CORS middleware za omogućavanje cross-origin requests
origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Konfiguracija za enkripciju lozinke
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funkcija za dohvat sesije baze podataka
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ruta za login
@app.post("/users/login")
async def login_for_access_token(user: models.UserLoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, user.username, user.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token({"sub": user.username, "role": user.role, "matches_played": user.matches_played, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}



@app.post("/users/create")
async def create_user(user: models.UserCreateRequest, db: Session = Depends(get_db)):
    # Log incoming request data
    print(user.model_dump())

    # Hash the password before saving to the database
    hashed_password = pwd_context.hash(user.password)
    
    # Replace the original password with the hashed version
    user_data = user.model_dump()
    user_data["password"] = hashed_password
    
    try:
        # Create a new user with the hashed password
        db_user = models.User(**user_data)
        
        # Save the user to the database
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    except Exception as e:
        # Log any errors that occur
        print(f"Error creating user: {e}")
        raise HTTPException(status_code=422, detail=str(e))

# Ruta za slanje prijave za postanak menadzera
@app.post("/users/manager-application", response_model=models.ManagerApplicationRequest, status_code=status.HTTP_201_CREATED)
async def create_manager_request(request: models.ManagerApplicationRequest, db: Session = Depends(get_db)):
    # Ensure the user exists
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new manager request entry
    db_request = models.ManagerRequest(
        user_id=request.user_id,
        request_date=request.request_date,
        reason=request.reason,
        status=request.status,
        admin_notes=request.admin_notes,
        approval_date=request.approval_date
    )

    db.add(db_request)
    db.commit()
    db.refresh(db_request)

    return db_request


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            print("username")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError:
        print("jwt")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@app.post("/users/me", response_model=models.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/users-all", response_model=List[models.UserResponse2])
def get_all_users(db: Session = Depends(get_db)):
    try:
        users = db.query(models.User).all()
        if not users:
            raise HTTPException(status_code=404, detail="No users found")

        users_response = [
            models.UserResponse2(
                 id=user.id,
                username=user.username,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                merit=user.merit 
            )
            for user in users
        ]

        return users_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#dohvacanje info o terenima za tebelu TereniTable
@app.get("/courts/table")
def get_courts_and_owners(db: Session = Depends(get_db)):
    try:
        courts = db.query(models.Court).all()
        court_owners = db.query(models.CourtOwner).all()

        court_data = []
        for court in courts:
            owner = next((owner for owner in court_owners if owner.court_id == court.id), None)
            if owner:
                owner_user = db.query(models.User).filter(models.User.id == owner.user_id).first()
                court_data.append({
                    "id": court.id,
                    "name": court.name,
                    "owner_first_name": owner_user.first_name,
                    "owner_last_name": owner_user.last_name,
                    "court_type": court.court_type
                })
            else:
                  court_data.append({
                    "id": court.id,
                    "name": court.name,
                    "court_type": court.court_type,
                    "owner_first_name": None,
                    "owner_last_name": None
                })

        return court_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Ruta za dobavljanje najnovijih terena
@app.get("/courts/latest", response_model=List[models.CourtWithSports])
def get_latest_courts(db: Session = Depends(get_db)):
    try:
        # Query to fetch the three latest courts
        latest_courts = db.query(models.Court).order_by(desc(models.Court.id)).limit(3).all()
        
        # Fetch sports names for each court
        result = []
        for court in latest_courts:
            sports = db.query(models.CourtSport).filter(models.CourtSport.court_id == court.id).all()
            sport_names = [db.query(models.Sport.name).filter(models.Sport.id == sport.sport_id).first()[0] for sport in sports]
            result.append(models.CourtWithSports(
                id=court.id,
                court_type=court.court_type,
                city=court.city,
                name=court.name,
                image_link=court.image_link,
                sports=sport_names  # Corrected field to sport_names
            ))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Ruta za dobavljanje svih terena, od najstarijeg do najnovijeg
@app.get("/courts/all", response_model=List[models.CourtWithSports])
def get_all_courts(db: Session = Depends(get_db)):
    try:
        all_courts = db.query(models.Court).order_by(asc(models.Court.id)).all()
        
        result = []
        for court in all_courts:
            sports = db.query(models.CourtSport).filter(models.CourtSport.court_id == court.id).all()
            sport_names = [db.query(models.Sport.name).filter(models.Sport.id == sport.sport_id).first()[0] for sport in sports]
            result.append(models.CourtWithSports(
                id=court.id,
                court_type=court.court_type,
                city=court.city,
                name=court.name,
                image_link=court.image_link,
                sports=sport_names 
            ))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

#dohvacanje ukupnog broja terena
@app.get("/courts/count")
def get_court_count(db: Session = Depends(get_db)):
    try:
        court_count = db.query(models.Court).count()
        return  {"court_number": court_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# dohvacanje svih menadzera
@app.get("/users/managers", response_model=List[models.ManagerResponse])
def get_all_managers(db: Session = Depends(get_db)):
    try:
        managers = db.query(models.User).filter(models.User.role == "manager").all()
        if not managers:
            raise HTTPException(status_code=404, detail="No managers found")

        # Transformacija rezultata u ManagerResponse objekte
        managers_response = [
            models.ManagerResponse(
                id=manager.id,
                first_name=manager.first_name,
                last_name=manager.last_name,
                email=manager.email
            )
            for manager in managers
        ]

        return managers_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Ruta za dobavljanje specificnog terena
@app.get("/courts/{court_id}", response_model=models.CourtWithSports)
def get_court_by_id(court_id: int, db: Session = Depends(get_db)):
    try:
        court = db.query(models.Court).filter(models.Court.id == court_id).first()
        if not court:
            raise HTTPException(status_code=404, detail="Court not found")

        sports = db.query(models.CourtSport).filter(models.CourtSport.court_id == court.id).all()
        sport_names = [db.query(models.Sport.name).filter(models.Sport.id == sport.sport_id).first()[0] for sport in sports]

        return models.CourtWithSports(
            id=court.id,
            court_type=court.court_type,
            city=court.city,
            name=court.name,
            image_link=court.image_link,
            sports=sport_names
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Ruta za dodavanje novog terena
@app.post("/courts/create", status_code=status.HTTP_201_CREATED)
async def create_court(court: models.CourtCreateRequest, db: Session = Depends(get_db)):
    try:
        db_sport = db.query(models.Sport).filter(models.Sport.name == court.sport_type).first()
        if not db_sport:
            raise HTTPException(status_code=404, detail="Sport not found")

        db_court = models.Court(
            court_type=court.court_type,
            city=court.city,
            name=court.name,
            image_link=court.image_link
        )

        db.add(db_court)
        db.commit()
        db.refresh(db_court)

        db_court_sport = models.CourtSport(
            court_id=db_court.id,
            sport_id=db_sport.id
        )
        db.add(db_court_sport)
        db.commit()

        return {"message": "Teren uspješno dodan!"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

# Ruta za brisanje terena
@app.delete("/courts/delete/{court_id}", status_code=status.HTTP_200_OK)
async def delete_court(court_id: int, db: Session = Depends(get_db)):
    try:
        court = db.query(models.Court).filter(models.Court.id == court_id).first()
        if court is None:
            raise HTTPException(status_code=404, detail="Teren nije pronađen")

        db.delete(court)
        db.commit()

        return {"message": "Teren uspješno obrisan"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.post("/appointments/create", status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: models.AppointmentCreateRequest, db: Session = Depends(get_db)):
    try:
        # Query the court based on the provided name
        db_court = db.query(models.Court).filter(models.Court.name == appointment.court_name).first()
        if not db_court:
            raise HTTPException(status_code=404, detail="Court not found")

        # Query the sport based on the provided name
        db_sport = db.query(models.Sport).filter(models.Sport.name == appointment.sport).first()
        if not db_sport:
            raise HTTPException(status_code=404, detail="Sport not found")

        # Create the appointment using the retrieved IDs
        db_appointment = models.Appointment(
            start_time=appointment.start_time,
            end_time=appointment.end_time,
            court_id=db_court.id,
            sport_id=db_sport.id,
            available_slots=appointment.available_slots,
            cancelled=False
        )

        # Add and commit the appointment to the database
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)

        return {"message": "Termin uspješno dodan!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
# Ruta za brisanje termina
@app.delete("/appointments/delete/{appointment_id}", status_code=status.HTTP_200_OK)
async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    try:
        appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
        if appointment is None:
            raise HTTPException(status_code=404, detail="Termin nije pronađen")

        db.delete(appointment)
        db.commit()

        return {"message": "Termin uspješno obrisan"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
#dohvacanje ukupnog broja terena
@app.get("/appointments/count")
def get_appointment_count(db: Session = Depends(get_db)):
    try:
        appointment_count = db.query(models.Appointment).count()
        return  {"appointment_number": appointment_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Ruta za dobivanje svih termina za fudbal
@app.get("/appointments/football", response_model=List[models.CourtAppointment])
def get_football_appointments(db: Session = Depends(get_db)):
    try:
        # dohvacanje id-a od football
        football_sport = db.query(models.Sport).filter(models.Sport.name == "Football").first()
        if not football_sport:
            raise HTTPException(status_code=404, detail="Sport 'fudbal' nije pronađen.")

        # dohvacanje svih termina za football
        football_appointments = db.query(models.Appointment) \
                                  .filter(and_(models.Appointment.sport_id == football_sport.id,
                                               models.Appointment.cancelled == False)).all()

        
        result = []
        for appointment in football_appointments:
            court = db.query(models.Court).filter(models.Court.id == appointment.court_id).first()
            result.append(models.CourtAppointment(
                id = court.id,
                name=court.name,
                location=court.city,
                sport=football_sport.name,
                image_link=court.image_link,
                court_type=court.court_type,
                start_time=appointment.start_time
            ))
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/appointments/basketball", response_model=List[models.CourtAppointment])
def get_basketball_appointments(db: Session = Depends(get_db)):
    try:
        # Fetching basketball sport ID
        basketball_sport = db.query(models.Sport).filter(models.Sport.name == "Basketball").first()
        if not basketball_sport:
            raise HTTPException(status_code=404, detail="Sport 'Basketball' nije pronađen.")

        # Fetching all basketball appointments
        basketball_appointments = db.query(models.Appointment) \
                                    .filter(and_(models.Appointment.sport_id == basketball_sport.id,
                                                 models.Appointment.cancelled == False)).all()

        result = []
        for appointment in basketball_appointments:
            court = db.query(models.Court).filter(models.Court.id == appointment.court_id).first()
            result.append(models.CourtAppointment(
                id=court.id,
                name=court.name,
                location=court.city,
                sport=basketball_sport.name,
                image_link=court.image_link,
                court_type=court.court_type,
                start_time=appointment.start_time
            ))
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
#dohvacanje ukupnog broja korisnika
@app.get("/users/count")
def get_user_count(db: Session = Depends(get_db)):
    try:
        user_count = db.query(models.User).count()
        return {"user_number": user_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# dohvacanje svih termina za odbojku
@app.get("/appointments/volleyball", response_model=List[models.CourtAppointment])
def get_volleyball_appointments(db: Session = Depends(get_db)):
    try:
        # Fetching volleyball sport ID
        volleyball_sport = db.query(models.Sport).filter(models.Sport.name == "Volleyball").first()
        if not volleyball_sport:
            raise HTTPException(status_code=404, detail="Sport 'Volleyball' nije pronađen.")

        # Fetching all volleyball appointments
        volleyball_appointments = db.query(models.Appointment) \
                                    .filter(and_(models.Appointment.sport_id == volleyball_sport.id,
                                                 models.Appointment.cancelled == False)).all()

        result = []
        for appointment in volleyball_appointments:
            court = db.query(models.Court).filter(models.Court.id == appointment.court_id).first()
            result.append(models.CourtAppointment(
                id=court.id,
                name=court.name,
                location=court.city,
                sport=volleyball_sport.name,
                image_link=court.image_link,
                court_type=court.court_type,
                start_time=appointment.start_time
            ))
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Ruta za dohvacanje termina za odredjeni teren
@app.get("/appointments/{court_id}", response_model=List[models.AppointmentResponse])
def fetch_terms(court_id: int, db: Session = Depends(get_db)):
    try:
        appointments = db.query(models.Appointment).join(models.Sport).filter(models.Appointment.court_id == court_id).all()
        if not appointments:
            raise HTTPException(status_code=404, detail="Termini nisu pronađeni")

        appointment_responses = [
            models.AppointmentResponse(
                id=appointment.id,
                start_time=appointment.start_time,
                end_time=appointment.end_time,
                court_id=appointment.court_id,
                sport=appointment.sport.name,
                available_slots=appointment.available_slots,
                cancelled=appointment.cancelled
            )
            for appointment in appointments
        ]
        
        return appointment_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ruta za dodavanje rezervacija
@app.post("/reservations/create", status_code=status.HTTP_201_CREATED)
def create_reservation(reservation: models.ReservationCreateRequest, db: Session = Depends(get_db)):
    try:
        appointment = db.query(models.Appointment).filter(models.Appointment.id == reservation.appointment_id).first()
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        if appointment.available_slots < reservation.number_of_players:
            raise HTTPException(status_code=400, detail="Not enough available slots")
        
        appointment.available_slots -= reservation.number_of_players

        db.add(appointment)
        db.commit()
        db.refresh(appointment)

        new_reservation = models.Reservation(
            appointment_id=reservation.appointment_id,
            user_id=reservation.user_id,
            number_of_players=reservation.number_of_players
        )

        db.add(new_reservation)
        db.commit()
        db.refresh(new_reservation)

        return {"message": "Rezervijacija uspješno dodana!"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reservations/user", response_model=List[models.ReservationWithAppointment])
def get_user_reservations(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        reservations = db.query(
            models.Reservation.id.label('reservation_id'),
            models.Reservation.appointment_id,
            models.Reservation.user_id,
            models.Reservation.number_of_players,
            models.Appointment.start_time,
            models.Appointment.end_time,
            models.Appointment.sport_id,
            models.Appointment.available_slots,
            models.Court.name.label('court_name')
        ).join(
            models.Appointment, models.Reservation.appointment_id == models.Appointment.id
        ).join(
            models.Court, models.Appointment.court_id == models.Court.id
        ).filter(
            models.Reservation.user_id == current_user.id
        ).all()

        if not reservations:
            print("No reservations found for user")

        for res in reservations:
            print(f"Reservation: {res}")

        return [models.ReservationWithAppointment(
            reservation_id=r.reservation_id,
            appointment_id=r.appointment_id,
            user_id=r.user_id,
            number_of_players=r.number_of_players,
            start_time=r.start_time,
            end_time=r.end_time,
            sport=str(r.sport_id),
            available_slots=r.available_slots,
            court_name=r.court_name
        ) for r in reservations]
    except Exception as e:
        print(f"Error fetching reservations for user {current_user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.delete("/reservations/{id}")
def delete_reservation(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == id, models.Reservation.user_id == current_user.id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    
    appointment = db.query(models.Appointment).filter(models.Appointment.id == reservation.appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    
    appointment.available_slots += reservation.number_of_players
    
    db.delete(reservation)
    db.commit()
    
    return {"message": "Reservation deleted"}


# Ruta za dohvacanje zahtjeva za menadžere
@app.get("/manager-applications", response_model=List[models.ManagerApplicationResponse])
def get_manager_applications(db: Session = Depends(get_db)):
    try:
        # Query the database for all manager application requests
        applications = db.query(models.ManagerRequest).all()
        if not applications:
            raise HTTPException(status_code=404, detail="No manager applications found")

        response = []
        for application in applications:
            # Query the database for the user associated with the application
            user = db.query(models.User).filter(models.User.id == application.user_id).first()
            if not user:
                continue  # Skip this application if the user is not found

            # Append the application details to the response list
            response.append(
                models.ManagerApplicationResponse(
                    user_id=user.id,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    request_date=application.request_date,
                    reason=application.reason
                )
            )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Ruta za povećanje merit vrijednosti
@app.put("/usersIM/{user_id}/increase_merit", response_model=models.MeritUpdate)
def increase_merit(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.merit < 5:
            user.merit += 1
            db.commit()
            db.refresh(user)
     

    return {"merit": user.merit}


# Funkcija za slanje email poruke
def send_email(subject, body, to_email):
    from_email = "your-email@example.com"  # Email adresa sa koje se šalje poruka
    password = "your-email-password"       # Lozinka za email adresu

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.example.com', 587)  # SMTP server i port (primer)
    server.starttls()
    server.login(from_email, password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()

# Ruta za smanjenje merit vrijednoti
@app.put("/usersDM/{user_id}/decrease_merit", response_model=models.MeritUpdate)
def decrease_merit(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.merit > 1:
        user.merit -= 1
        db.commit()
        db.refresh(user)
  
    

    return {"merit": user.merit}

  
#Odobravanje zahtjeva za menadžera
@app.put("/manager-applications/{id}/approve")
def approve_manager_application(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = "manager"

    manager_request = db.query(models.ManagerRequest).filter(models.ManagerRequest.user_id == id).first()
    if manager_request:
        db.delete(manager_request)

    db.commit()
    db.refresh(user)

    return {"message": f"Application with ID {id} approved. Role set to manager"}
   
# Odbijanje zahtjeva za menadžera
@app.delete("/manager-applications/{id}/reject")
def reject_manager_application(id: int, db: Session = Depends(get_db)):
    manager_request = db.query(models.ManagerRequest).filter(models.ManagerRequest.user_id == id).first()
    if not manager_request:
        raise HTTPException(status_code=404, detail="Manager request not found")

    db.delete(manager_request)
    db.commit()


    return {"message": f"Application with ID {id} rejected. Manager request deleted"}

#Brisanje menadžera i postavljanje na korisnika
@app.put("/managers/{id}/remove")
def remove_manager(id: int, db: Session = Depends(get_db)):
   
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Provjera je li korisnik zaista menadžer
    if user.role != "manager":
        raise HTTPException(status_code=400, detail="User is not a manager")

    # Promjena uloge korisnika na "user"
    user.role = "user"

    # Brisanje iz tabele menadžera (ako postoji)
    manager_request = db.query(models.ManagerRequest).filter(models.ManagerRequest.user_id == id).first()
    if manager_request:
        db.delete(manager_request)

    db.commit()
    db.refresh(user)

    return {"message": f"User with ID {id} is no longer a manager"}



@app.delete("/users/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": f"User with ID {id} has been deleted"}


# Ruta za dohvacanje termina za odredjeni teren
@app.get("/appointments-all", response_model=List[models.AppointmentResponse])
def fetch_terms(db: Session = Depends(get_db)):
    try:
        appointments = db.query(models.Appointment).join(models.Sport).filter().all()
        if not appointments:
            raise HTTPException(status_code=404, detail="Termini nisu pronađeni")

        appointment_responses = [
            models.AppointmentResponse(
                id=appointment.id,
                start_time=appointment.start_time,
                end_time=appointment.end_time,
                court_id=appointment.court_id,
                sport=appointment.sport.name,
                available_slots=appointment.available_slots,
                cancelled=appointment.cancelled
            )
            for appointment in appointments
        ]
        
        return appointment_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))