# Full-Stack Movie Ticket Booking Platform (BookMyShow Clone)

A responsive, end-to-end cinema ticket booking web application mimicking core production workflows. The platform bridges a dynamic, reactive user interface with a secure, token-authenticated backend architecture.

## 🚀 Key Features

*   **Dynamic Movie Marketplace:** Browse recommended movie entries with active server-side search querying and language filtering (`Malayalam`, `English`, `Hindi`, `Tamil`).
*   **Gatekeeped Booking Workflow:** Browsing is public, but access to movie details, calendar dates, showtimes, and seat layouts is programmatically restricted to authenticated users. Unregistered guests are seamlessly redirected to an intuitive sign-in screen.
*   **Secure Authentication:** Integrated stateless session management using **JSON Web Tokens (JWT)** via Django REST Framework SimpleJWT.
*   **Interactive Multi-Tier Seat Map:** A dynamic, grid-based seating engine that splits seats into `Executive` and `Dress Circle` tiers with aisle gap configurations, tracking real-time selections up to user-specified ticket quantities while auto-disabling pre-booked coordinates.
*   **Live Order Summary:** Sticky total calculation bar with transactional booking posting handled securely via Axios headers.

---

## 🛠️ Tech Stack

**Frontend:**
*   React (Functional Components & Hooks)
*   Axios (HTTP Client)
*   HTML5 / CSS3 (Responsive Inline Layouts)

**Backend:**
*   Django & Django REST Framework
*   SimpleJWT (Authentication)
*   SQLite / PostgreSQL

---

## 📁 Project Architecture

```text
├── backend/                  # Django Web Application
│   ├── core/                 # Project configuration (settings, URLs)
│   ├── bookings/             # Application logic (views, models, routes)
│   └── manage.py
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── App.jsx           # Core UI Dashboard and State Engine
    │   └── main.jsx
    ├── package.json
    └── vite.config.js


  ⚙️ Installation & Setup
1. Backend Setup (Django)

cd backend
python -m venv venv
source venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py createsuperuser
python manage.py runserver


2. Frontend Setup (React)

cd frontend
npm install
npm run dev

🔒 API Endpoints Documented

HTTP MethodEndpointDescriptionAuth RequiredGET/api/movies/Fetch filtered movie catalogNoPOST/api/token/Obtain JWT Access/Refresh tokensNoGET/api/movies/<id>/shows/Retrieve showtimes filtered by target dateYesPOST/api/bookings/create/Log seat reservations to databaseYes

👤 Author
GitHub: @syama-57

