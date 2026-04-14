# 👷‍♂️ Workforce Management System

> A dedicated platform bridging the gap between employers and daily wage workers (painters, carpenters, plumbers, etc.) in rural areas for emergency and daily employment needs.

---

## 📖 Overview

The **Workforce Management System** is a robust Django-based RESTful API designed specifically to empower rural communities. It streamlines the process of hiring daily wage laborers for immediate or short-term needs, ensuring fair wage management and a seamless connection between job seekers and clients.

## ✨ Key Features
- **Role-Based Access**: Distinct profiles for Job Seekers (Workers), Clients , and Contractors.
- **Job Lifecycle Management**: Post emergency daily wage jobs, apply, and track application statuses easily.
- **Secure Authentication**: Token-based authentication with OTP (One-Time Password) multi-factor support.
- **Portfolio Integration**: Workers can securely showcase their past work to attract better opportunities.

## 🛠️ Technical Stack
- **Framework**: Django 5.x & Django Rest Framework (DRF)
- **Database**: PostgreSQL
- **Security**: DRF Authtoken & Custom OTP Logic

---

## 🚀 Getting Started (Local Setup)

Follow these simple steps to set up the project on your local machine for development. 

### Prerequisites
- **Python** (v3.10 or higher)
- **PostgreSQL** (Ensure a local database server is running)
- **Git**

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/Dinojan007/workforce.git
cd workforce/jobfinder
```

### 2. Set Up a Virtual Environment
It is highly recommended to use a virtual environment to isolate your project dependencies.
```bash
python -m venv venv

# Activate on macOS/Linux:
source venv/bin/activate
# Activate on Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
Install all required Python packages:
```bash
pip install -r requirements.txt
```

### 4. Configure the Database
The project relies on PostgreSQL. You can set up your configuration by exporting environment variables in your terminal before running the server:

*On macOS/Linux:*
```bash
export DB_NAME="jobfinder_db"
export DB_USER="myuser"
export DB_PASSWORD="mypassword"
export DB_HOST="localhost"
```

*On Windows (Command Prompt):*
```cmd
set DB_NAME=jobfinder_db
set DB_USER=myuser
set DB_PASSWORD=mypassword
set DB_HOST=localhost
```

### 5. Initialize Database & Run the Server
Apply the database schemas and start the development server:
```bash
python manage.py migrate
python manage.py runserver
```

🎉 The application should now be accessible at:
- **API Base URL**: `http://localhost:8000/`
- **Admin Interface**: `http://localhost:8000/admin/`

---

## 📁 Repository Structure

- **`authentication/`**: Handles user registration, login, and secure OTP verification.
- **`jobs/`**: Core logic for creating job postings, applying, and managing application statuses.
- **`company/`**: Manages employer organization details, branches, and contact information.
- **`users/`**: Manages detailed user personal profiles, designations, and portfolios.

---

<p align="center">
  <i>Designed to support the backbone of our communities: the daily wage earners.</i>
</p>