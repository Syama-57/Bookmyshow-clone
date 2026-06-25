# 🎟️ BookMyShow Clone - Full-Stack Application

A dynamic, full-stack movie ticket booking application featuring an interactive visual seating layout, dynamic API showtime filtering, and safe server-side transaction handling.

## 🚀 Key Architectural Features
- **Decoupled Architecture:** React SPA frontend communicating with a scalable Django REST Framework API.
- **Interactive Seating Grid:** Custom coordinate layout state engine handling real-time price subtotal generation.
- **Relational Integrity:** Clean database normalization schema mapping Movies -> Theatres -> Shows -> Bookings.
- **Fail-Safe Processing:** Server-side price calculation preventing client-side data manipulation vulnerabilities.

## 🛠️ Tech Stack
- **Frontend:** ReactJS, Axios, Modern CSS Grid
- **Backend:** Python, Django, Django REST Framework (DRF)
- **Database:** SQLite3
- **Environment & Controls:** Git, Pip Virtual Environments, Cross-Origin Resource Sharing (CORS) Configuration

## 🏃‍♂️ How to Run Locally

### 1. Clone & Enter Workspace
```bash
git clone <your-repo-url>
cd book-my-show-portfolio