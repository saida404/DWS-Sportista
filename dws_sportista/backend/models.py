from datetime import datetime
from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, Integer, String, Enum, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from typing import List, Optional
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field
from enum import Enum as PydanticEnum

Base = declarative_base()

# Define association table for many-to-many relationship between courts and managers
court_owner_association = Table('court_owner_association', Base.metadata,
    Column('court_id', ForeignKey('courts.id'), primary_key=True),
    Column('user_id', ForeignKey('users.id'), primary_key=True)
)

# Define association table for many-to-many relationship between courts and sports
court_sport_association = Table('court_sport_association', Base.metadata,
    Column('court_id', ForeignKey('courts.id'), primary_key=True),
    Column('sport_id', ForeignKey('sports.id'), primary_key=True)
)

# Enum for fitness level
class FitnessLevel(str, PydanticEnum):
    amateur = 'amateur'
    professional = 'professional'

# Enum for user roles
class UserRole(str, PydanticEnum):
    user = 'user'
    admin = 'admin'
    manager = 'manager'

# Enum for sports activities
class SportsActivity(str, PydanticEnum):
    football = 'football'
    basketball = 'basketball'
    tennis = 'tennis'
    volleyball = 'volleyball'

# SQLAlchemy model for users
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    city = Column(String)
    fitness_level = Column(String)  # Adjust as needed
    matches_played = Column(Integer, default=0)
    role = Column(String)  # Adjust as needed
    preferred_sport = Column(String)  # Adjust as needed
    merit = Column(Integer, default=3)
    profile_pic = Column(String, default=None)

    # Relationship with courts as owners
    courts_owned = relationship("Court", secondary=court_owner_association, back_populates="managers")

# Pydantic model for user base
class UserBase(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str
    city: str
    fitness_level: FitnessLevel
    matches_played: int
    role: UserRole
    preferred_sport: SportsActivity
    merit: int
    profile_pic: str

# Pydantic model for user creation request
class UserCreateRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str
    city: str
    fitness_level: FitnessLevel
    role: UserRole = UserRole.user
    preferred_sport: SportsActivity
    merit: int
    profile_pic: Optional[str] = None

# Pydantic model for user login request
class UserLoginRequest(BaseModel):
    username: str
    password: str

# SQLAlchemy model for manager requests
class ManagerRequest(Base):
    __tablename__ = 'manager_requests'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    request_date = Column(DateTime, default=datetime.now)
    reason = Column(Text, nullable=False)
    status = Column(String(20), default='Pending')
    admin_notes = Column(Text, nullable=True)
    approval_date = Column(DateTime, nullable=True)

    user = relationship("User")

# Pydantic model for manager application request
class ManagerApplicationRequest(BaseModel):
    user_id: int
    request_date: datetime = Field(default_factory=datetime.now)
    reason: str
    status: Optional[str] = Field(default='Pending')
    admin_notes: Optional[str] = None
    approval_date: Optional[datetime] = None

    class Config:
        from_attributes = True

# Pydantic model for user response
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    city: str
    fitness_level: Optional[str]
    preferred_sport: Optional[str]
    matches_played: Optional[int]
    merit: int
    profile_pic: Optional[str] = None

    class Config:
        from_attributes = True

# Pydantic model for court appointment
class CourtAppointment2(BaseModel):
    id: int
    name: str
    location: str
    sport: str
    court_type: str
    start_time: datetime
    available_slots: int

# Model for fetching user data (for admin panel)
class UserResponse2(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    merit: int

    class Config:
        from_attributes = True

# Pydantic model for manager response
class ManagerResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True

# SQLAlchemy model for appointments
class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    court_id = Column(Integer, ForeignKey('courts.id'))
    sport_id = Column(Integer, ForeignKey('sports.id'))
    available_slots = Column(Integer)
    cancelled = Column(Boolean)

    sport = relationship("Sport")
    court = relationship("Court")
    reservations = relationship("Reservation", back_populates="appointment")

# Pydantic model for appointments
class AppointmentBase(BaseModel):
    start_time: datetime
    end_time: datetime
    court_id: int
    sport_id: int
    available_slots: int
    cancelled: bool

# Pydantic model for appointment response
class AppointmentResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    court_id: int
    sport: str
    available_slots: int
    cancelled: bool

    class Config:
        from_attributes = True

class ReservationWithAppointment(BaseModel):
    reservation_id: int
    appointment_id: int
    user_id: int
    number_of_players: int
    start_time: datetime
    end_time: datetime
    court_name: str
    sport: str  # Ensure that this matches the attribute name in the query

    class Config:
        from_attributes = True

# Pydantic model for appointment creation request
class AppointmentCreateRequest(BaseModel):
    start_time: datetime
    end_time: datetime
    court_name: str
    sport: str
    available_slots: int

# SQLAlchemy model for court owners
class CourtOwner(Base):
    __tablename__ = 'court_owner'
    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, ForeignKey('courts.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

# Pydantic model for court owners
class CourtOwnerBase(BaseModel):
    court_id: int
    user_id: int

# SQLAlchemy model for court sports
class CourtSport(Base):
    __tablename__ = 'court_sport'
    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, ForeignKey('courts.id'))
    sport_id = Column(Integer, ForeignKey('sports.id'))

# Pydantic model for court sports
class CourtSportBase(BaseModel):
    court_id: int
    sport_id: int

# SQLAlchemy model for courts
class Court(Base):
    __tablename__ = 'courts'
    id = Column(Integer, primary_key=True, index=True)
    court_type = Column(String)
    city = Column(String)
    name = Column(String)
    image_link = Column(String)

    # Relationship with managers
    managers = relationship("User", secondary=court_owner_association, back_populates="courts_owned")

    # Relationship with sports
    sports = relationship("Sport", secondary=court_sport_association, back_populates="courts")

# Pydantic model for courts
class CourtBase(BaseModel):
    court_type: str
    city: str
    name: str
    image_link: str

# Pydantic model for creating a new court
class CourtCreateRequest(BaseModel):
    name: str
    city: str
    court_type: str
    sport_type: str
    image_link: str

    class Config:
        from_attributes = True

# Pydantic model to return court and its sports, used in API response
class CourtWithSports(CourtBase):
    id: int
    sports: List[str]

    class Config:
        from_attributes = True

# Pydantic model for creating a reservation
class ReservationCreateRequest(BaseModel):
    appointment_id: int
    user_id: int
    number_of_players: int

# SQLAlchemy model for sports
class Sport(Base):
    __tablename__ = 'sports'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    # Relationship with courts
    courts = relationship("Court", secondary=court_sport_association, back_populates="sports")

# Pydantic model for sports
class SportBase(BaseModel):
    name: str

# SQLAlchemy model for reservations
class Reservation(Base):
    __tablename__ = 'reservations'
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey('appointments.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    number_of_players = Column(Integer)

    appointment = relationship("Appointment", back_populates="reservations")
    user = relationship("User")


# Pydantic model for reservations
class ReservationBase(BaseModel):
    id: int
    appointment_id: int
    user_id: int
    number_of_players: int

    class Config:
        from_attributes = True

# Pydantic model for court appointment
class CourtAppointment(BaseModel):
    id: int
    name: str
    location: str
    sport: str
    image_link: str
    court_type: str
    start_time: datetime

# Model for manager reservation response
class ManagerApplicationResponse(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    request_date: datetime
    reason: str

    class Config:
        from_attributes = True

# Model for merit update
class MeritUpdate(BaseModel):
    merit: int
