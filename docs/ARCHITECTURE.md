# Architecture Documentation

## System Overview

The Preflight Checklist application is a full-stack CRUD (Create, Read, Update, Delete) web application built with React (frontend) and Node.js/Express (backend), using PostgreSQL as the database.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                    (Browser / User)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      FRONTEND LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Single Page App                    │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │   App.jsx    │  │  api/api.js  │                │  │
│  │  │              │  │              │                │  │
│  │  │ - State      │  │ - Axios      │                │  │
│  │  │ - UI         │  │ - API calls  │                │  │
│  │  │ - Handlers   │  │ - Error      │                │  │
│  │  └──────┬───────┘  └──────┬───────┘                │  │
│  │         │                 │                         │  │
│  │         └────────┬────────┘                         │  │
│  └──────────────────┼──────────────────────────────────┘  │
│                     │                                      │
│                     │ REST API (JSON)                      │
└─────────────────────┼──────────────────────────────────────┘
                      │
                      │ HTTP Requests
                      │
┌─────────────────────▼──────────────────────────────────────┐
│                      BACKEND LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Server                        │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │         API Routes (REST)                    │   │  │
│  │  │                                              │   │  │
│  │  │  GET    /api/checklists      (Read)         │   │  │
│  │  │  POST   /api/checklists      (Create)        │   │  │
│  │  │  PUT    /api/checklists/:id  (Update)        │   │  │
│  │  │  DELETE /api/checklists/:id  (Delete)        │   │  │
│  │  └──────────────────┬───────────────────────────┘   │  │
│  │                     │                                │  │
│  │  ┌──────────────────▼───────────────────────────┐   │  │
│  │  │         Business Logic                        │   │  │
│  │  │  - Validation                                 │   │  │
│  │  │  - Error Handling                             │   │  │
│  │  │  - Data Transformation                        │   │  │
│  │  └──────────────────┬───────────────────────────┘   │  │
│  │                     │                                │  │
│  │  ┌──────────────────▼───────────────────────────┐   │  │
│  │  │         Prisma ORM                            │   │  │
│  │  │  - Database Client                            │   │  │
│  │  │  - Query Builder                              │   │  │
│  │  │  - Type Safety                                │   │  │
│  │  └──────────────────┬───────────────────────────┘   │  │
│  └─────────────────────┼──────────────────────────────────┘  │
│                       │                                      │
│                       │ SQL Queries                          │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                    DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                      │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │         Tables                                │   │   │
│  │  │                                              │   │   │
│  │  │  ChecklistItem                                │   │   │
│  │  │  - id (PK)                                    │   │   │
│  │  │  - flightId                                   │   │   │
│  │  │  - title                                      │   │   │
│  │  │  - comment                                    │   │   │
│  │  │  - status                                     │   │   │
│  │  │  - createdAt                                  │   │   │
│  │  │  - updatedAt                                  │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Component Interactions

### 1. Frontend Components

#### App.jsx (Main Component)
- **Purpose**: Root component managing application state
- **Responsibilities**:
  - Flight information state (flight number, date, locations, etc.)
  - Checklist items state
  - User interactions (toggle status, update comments, add/delete items)
  - Form submission
- **Dependencies**: `api/api.js`

#### api/api.js (API Client)
- **Purpose**: HTTP client for backend communication
- **Responsibilities**:
  - Axios configuration
  - API endpoint calls (GET, POST, PUT, DELETE)
  - Error handling
- **Dependencies**: Axios library

### 2. Backend Components

#### server.js (Express Server)
- **Purpose**: HTTP server and request routing
- **Responsibilities**:
  - CORS configuration
  - JSON body parsing
  - Route handling
  - Error middleware
- **Dependencies**: Express, Prisma Client

#### Routes (API Endpoints)
- **Purpose**: Handle CRUD operations
- **Endpoints**:
  - `GET /api/checklists` - Retrieve all items
  - `POST /api/checklists` - Create new item
  - `PUT /api/checklists/:id` - Update existing item
  - `DELETE /api/checklists/:id` - Delete item
- **Responsibilities**:
  - Request validation
  - Database operations via Prisma
  - Response formatting
  - Error handling

#### Prisma Client
- **Purpose**: Database ORM (Object-Relational Mapping)
- **Responsibilities**:
  - Type-safe database queries
  - Schema management
  - Migration handling
- **Dependencies**: PostgreSQL database

### 3. Database Schema

#### ChecklistItem Model
```prisma
model ChecklistItem {
  id        Int      @id @default(autoincrement())
  flightId  Int?
  title     String
  comment   String   @default("")
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Data Flow

### Create Operation Flow
```
User Input → App.jsx → api/api.js → POST /api/checklists 
→ server.js → Prisma → PostgreSQL → Response → Frontend Update
```

### Read Operation Flow
```
Component Mount → App.jsx → api/api.js → GET /api/checklists 
→ server.js → Prisma → PostgreSQL → Response → State Update → UI Render
```

### Update Operation Flow
```
User Action → App.jsx → api/api.js → PUT /api/checklists/:id 
→ server.js → Prisma → PostgreSQL → Response → State Update → UI Update
```

### Delete Operation Flow
```
User Action → App.jsx → api/api.js → DELETE /api/checklists/:id 
→ server.js → Prisma → PostgreSQL → Response → State Update → UI Update
```

## Technology Stack

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **CSS**: Inline styles (can be migrated to CSS modules or styled-components)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Prisma**: ORM for database access
- **PostgreSQL**: Relational database

### Development Tools
- **Git**: Version control
- **npm**: Package manager
- **Docker**: Containerization (for deployment)

## Security Considerations

1. **Input Validation**: All user inputs validated on backend
2. **CORS**: Configured for frontend origin only
3. **SQL Injection**: Prevented by Prisma ORM (parameterized queries)
4. **Error Handling**: Generic error messages to prevent information leakage

## Scalability Considerations

1. **Database Indexing**: Add indexes on frequently queried fields
2. **Caching**: Implement Redis for frequently accessed data
3. **Load Balancing**: Multiple backend instances behind load balancer
4. **CDN**: Serve frontend static assets via CDN

## Future Enhancements

1. **Authentication**: User login and authorization
2. **Multi-flight Support**: Manage multiple flight checklists
3. **Export/Import**: PDF export, CSV import
4. **Real-time Updates**: WebSocket for collaborative editing
5. **Mobile App**: React Native version

