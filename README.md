# Workforce

> A dedicated platform bridging the gap between employers and daily wage workers (painters, carpenters, plumbers, etc.) in rural areas for emergency and daily employment needs.

---

## 📖 Overview

The **Workforce Management System** is a robust Django-based RESTful API designed specifically to empower rural communities. It streamlines the process of hiring daily wage laborers for immediate or short-term needs, ensuring fair wage management and a seamless connection between job seekers and clients.

## Key Features
- **Role-Based Access**: Distinct profiles for Job Seekers (Workers), Clients , and Contractors.
- **Job Lifecycle Management**: Post emergency daily wage jobs, apply, and track application statuses easily.
- **Secure Authentication**: Token-based authentication with OTP (One-Time Password) multi-factor support.
- **Portfolio Integration**: Workers can securely showcase their past work to attract better opportunities.
- **High-Performance Caching**: Redis-backed caching layer for frequently accessed data (job listings, worker profiles) to reduce database load and improve response times.

## 🛠️ Technical Stack
- **Framework**: Django 5.x & Django Rest Framework (DRF)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Security**: DRF Authtoken & Custom OTP Logic

---

## Getting Started (Local Setup)

Follow these simple steps to set up the project on your local machine for development. 

### Prerequisites
- **Python** (v3.10 or higher)
- **PostgreSQL** (Ensure a local database server is running)
- **Redis** (Ensure a local Redis server is running — v6.x or higher recommended)
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

> This includes `django-redis` for integrating Redis as the Django cache backend.

### 4. Configure the Database & Redis
The project relies on PostgreSQL and Redis. You can set up your configuration by exporting environment variables in your terminal before running the server:

*On macOS/Linux:*
```bash
export DB_NAME="jobfinder_db"
export DB_USER="myuser"
export DB_PASSWORD="mypassword"
export DB_HOST="localhost"

export REDIS_HOST="localhost"
export REDIS_PORT="6379"
export REDIS_DB="1"
# Optional, if your Redis instance requires auth:
export REDIS_PASSWORD=""
```

*On Windows (Command Prompt):*
```cmd
set DB_NAME=jobfinder_db
set DB_USER=myuser
set DB_PASSWORD=mypassword
set DB_HOST=localhost

set REDIS_HOST=localhost
set REDIS_PORT=6379
set REDIS_DB=1
set REDIS_PASSWORD=
```

In `settings.py`, the cache backend is configured to use these variables, for example:
```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6379')}/{os.getenv('REDIS_DB', '1')}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": os.getenv("REDIS_PASSWORD", ""),
        },
    }
}
```

### 5. Start Redis
Make sure your local Redis server is running before starting the app:
```bash
redis-server
```

### 6. Initialize Database & Run the Server
Apply the database schemas and start the development server:
```bash
python manage.py migrate
python manage.py runserver
```

🎉 The application should now be accessible at:
- **API Base URL**: `http://localhost:8000/`
- **Admin Interface**: `http://localhost:8000/admin/`

---

## 🐳 Getting Started (Docker Setup)

If you prefer running the project in containers instead of a local environment, use Docker Compose. This spins up the Django app, PostgreSQL, and Redis together.

### Prerequisites
- **Docker**
- **Docker Compose**

### 1. Clone the Repository
```bash
git clone https://github.com/Dinojan007/workforce.git
cd workforce/jobfinder
```

### 2. Configure Environment Variables
Create a `.env` file in the project root (same folder as `manage.py`):
```env
DB_NAME=jobfinder_db
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=db

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=1
REDIS_PASSWORD=
```

> Note: `DB_HOST` and `REDIS_HOST` use the service names (`db`, `redis`) from `docker-compose.yml`, not `localhost`.

### 3. Add a `docker-compose.yml`
If one isn't already in the repo, create it at the project root:
```yaml
version: "3.9"

services:
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 4. Add a `Dockerfile`
If one isn't already in the repo, create it at the project root:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
```

### 5. Build and Run the Containers
```bash
docker-compose up --build
```

### 6. Apply Migrations
In a separate terminal, run migrations inside the running `web` container:
```bash
docker-compose exec web python manage.py migrate
```

The application should now be accessible at:
- **API Base URL**: `http://localhost:8000/`
- **Admin Interface**: `http://localhost:8000/admin/`

To stop the containers:
```bash
docker-compose down
```

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