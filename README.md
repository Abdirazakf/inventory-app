# Game Inventory Web Application

A full-stack game inventory management system built with PostgreSQL, Express.js, React, and Node.js. The application allows users to search, view, edit, and manage video game information with a modern, responsive interface.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)

Live Page: https://inventory-app-pykr.onrender.com/ 

## 🎮 Features

- **Search & Discovery**: Search for games with intelligent database-first lookup and automatic API fallback
- **Game Management**: Full CRUD operations for game entries
- **Dynamic Theming**: 13+ beautiful themes powered by DaisyUI
- **Responsive Design**: Mobile-first UI that works seamlessly across all devices
- **Real-time Feedback**: Toast notifications for user actions
- **External API Integration**: Automatic game data fetching from GameBrain API when not found locally
- **Smart Updates**: Update only the fields you want while preserving existing data

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL with connection pooling
- **Validation**: express-validator
- **CORS**: Configured for cross-origin requests

### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: TailwindCSS 4.1.17 + DaisyUI 4.12.23
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite 7.2.4

### Database Schema
- **Games**: Main game information
- **Genres**: Game categories
- **Developers**: Game development studios
- **Platforms**: Gaming platforms (PlayStation, Xbox, PC, etc.)
- **Game_Platforms**: Many-to-many relationship table

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager
- GameBrain API key (for external game data)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Abdirazakf/inventory-app.git
cd inventory-app
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

Or install separately:

```bash
npm run install:backend
npm run install:frontend
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_STRING=postgresql://username:password@localhost:5432/inventory_db

# Server Configuration
PORT=3000
NODE_ENV=development

# External API
API_KEY=your_gamebrain_api_key_here
```

### 4. Database Setup

Initialize the database schema and seed with sample data:

```bash
cd backend
node db/populatedb.js
```

### 5. Run the Application

#### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

#### Production Mode

```bash
# Build the frontend
npm run build:frontend

# Start the production server
npm start
```

The application will be available at:
- Frontend: `http://localhost:5173` (development)
- Backend API: `http://localhost:3000`

## 📁 Project Structure

```
inventory-app/
├── backend/
│   ├── controllers/
│   │   └── gameController.js      # Request handlers
│   ├── db/
│   │   ├── pool.js                # Database connection
│   │   ├── queries.js             # Database queries
│   │   └── populatedb.js          # Database initialization
│   ├── routes/
│   │   └── gameRouter.js          # API routes
│   ├── services/
│   │   └── gameAPI.js             # External API integration
│   ├── app.js                     # Express application
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameCard.jsx       # Game display card
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   └── ThemeSelector.jsx  # Theme switcher
│   │   ├── pages/
│   │   │   ├── Homepage.jsx       # Main game list page
│   │   │   └── Games.jsx          # Game detail/edit page
│   │   ├── states/
│   │   │   ├── useGameStore.js    # Game state management
│   │   │   └── useThemeStore.js   # Theme state management
│   │   ├── constants/
│   │   │   └── index.js           # App constants
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # App entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── package.json                    # Root package.json
```

## 🔌 API Endpoints

### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/games` | Get all games |
| GET | `/games/search?q={query}` | Search for games |
| GET | `/games/:id` | Get game by ID |
| PATCH | `/games/:id` | Update game |
| DELETE | `/games/:id` | Delete game |

### Example Requests

**Search for a game:**
```bash
curl http://localhost:3000/games/search?q=elden%20ring
```

**Update a game:**
```bash
curl -X PATCH http://localhost:3000/games/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 49.99, "rating": 9.5}'
```

**Delete a game:**
```bash
curl -X DELETE http://localhost:3000/games/1
```

## 🎨 Available Themes

The application includes 13 carefully curated themes:
- Pastel
- Retro
- Coffee
- Forest
- Cyberpunk
- Synthwave
- Luxury
- Autumn
- Valentine
- Aqua
- Business
- Night
- Dracula

Access the theme selector from the palette icon in the navigation bar.

## 🔍 Key Features Explained

### Intelligent Search
The application implements a smart search strategy:
1. First searches the local PostgreSQL database
2. If no results found, automatically queries the GameBrain API
3. Saves API results to the database for future searches
4. Returns formatted results to the user

### Update Logic
The update functionality only modifies fields that contain new values:
- Empty or null fields are ignored
- Preserves existing data integrity
- Validates input before database updates
- Handles foreign key relationships (genres, developers)

### State Management
Uses Zustand for lightweight, efficient state management:
- Game list state
- Current game details
- Search query
- Form data
- Loading and error states
- Theme preferences (persisted to localStorage)

## 🌐 Deployment

The application is configured for deployment on Render.com.

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your repository
3. Configure environment variables:
   - `DB_STRING`: PostgreSQL connection string
   - `API_KEY`: GameBrain API key
   - `NODE_ENV`: production
   - `PORT`: (Render provides this automatically)

4. Build command: `npm run install:backend`
5. Start command: `node app.js`

### Frontend Deployment

The frontend is served by the backend in production:
- Build command: `npm run build:frontend`
- Static files served from `backend/../frontend/dist`
- React Router handled via Express fallback route

### Database Setup on Render

1. Create a PostgreSQL database on Render
2. Copy the internal database URL
3. Run the population script:
   ```bash
   node backend/db/populatedb.js
   ```

## 🧪 Testing

The application includes validation for:
- Search queries (1-255 characters)
- Game IDs (positive integers)
- Prices (positive numbers)
- Ratings (0-10 range)
- Release years (valid years)
- Image URLs (valid URL format)

## 🔒 Security Features

- Input validation on all endpoints
- SQL injection prevention via parameterized queries
- CORS configuration for cross-origin requests
- Environment variable protection for sensitive data
- SSL/TLS for database connections in production

## 🐛 Known Issues & Limitations

- External API rate limiting may affect search functionality
- Images are loaded from external URLs (no local storage)
- Single-user system (no authentication/authorization)

## 🔄 Future Enhancements

- [ ] User authentication and authorization
- [ ] Game wishlist feature
- [ ] Advanced filtering and sorting
- [ ] Bulk import/export functionality
- [ ] User reviews and ratings
- [ ] Image upload capability
- [ ] Platform-specific game libraries

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

- GitHub: [@Abdirazakf](https://github.com/Abdirazakf)

## 🙏 Acknowledgments

- [GameBrain API](https://gamebrain.co) for game data
- [DaisyUI](https://daisyui.com) for beautiful UI components
- [Lucide](https://lucide.dev) for icons

---

**Built with ❤️ using the PERN Stack**

