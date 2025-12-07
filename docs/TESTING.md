# Testing Strategy & Framework

## Overview
This document outlines the testing approach for the Preflight Checklist CRUD application, including unit tests, integration tests, and testing frameworks.

## Testing Frameworks

### Backend Testing
- **Framework**: Jest (JavaScript testing framework)
- **Why Jest**: 
  - Built-in test runner and assertion library
  - Easy mocking and async support
  - Works well with Node.js/Express
  - Zero configuration for simple projects

### Frontend Testing
- **Framework**: React Testing Library (RTL) + Jest
- **Why RTL**:
  - Tests components from user perspective
  - Encourages accessible, maintainable code
  - Works seamlessly with Jest
  - Industry standard for React testing

### Integration Testing
- **Framework**: Supertest (for API endpoint testing)
- **Why Supertest**:
  - Simple HTTP assertions
  - Works with Express apps
  - Can test full request/response cycle

## Test Structure

### Backend Tests (`backend/tests/`)

#### 1. Unit Tests for API Routes
```
tests/
  ├── routes/
  │   ├── checklists.test.js    # CRUD endpoint tests
  │   └── health.test.js         # Health check endpoint
  └── utils/
      └── validation.test.js     # Input validation helpers
```

**Example Test Cases:**
- `GET /api/checklists` - Returns all items
- `POST /api/checklists` - Creates new item with validation
- `PUT /api/checklists/:id` - Updates existing item
- `DELETE /api/checklists/:id` - Deletes item
- Error handling (404, 400, 500)

#### 2. Database Integration Tests
- Test Prisma operations
- Verify data persistence
- Test transaction rollback on errors

### Frontend Tests (`frontend/src/`)

#### 1. Component Tests
```
src/
  ├── __tests__/
  │   ├── App.test.jsx          # Main app component
  │   ├── ChecklistForm.test.jsx # Form interactions
  │   └── ChecklistList.test.jsx # List rendering
```

**Example Test Cases:**
- Renders checklist items from API
- Toggles item status (pending ↔ completed)
- Updates comments
- Creates new checklist item
- Deletes checklist item
- Handles loading and error states

#### 2. API Client Tests
- Mock axios calls
- Test error handling
- Verify request/response formats

## Test Execution

### Running Tests

**Backend:**
```bash
cd backend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
```

**Frontend:**
```bash
cd frontend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
```

## Test Coverage Goals

- **Backend**: 80%+ coverage on API routes
- **Frontend**: 70%+ coverage on components
- **Critical paths**: 100% coverage (CRUD operations)

## Block Diagram: Testing Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TESTING LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐            │
│  │  Unit Tests  │         │Integration   │            │
│  │              │         │   Tests      │            │
│  │  - Routes    │         │              │            │
│  │  - Utils     │         │  - API       │            │
│  │  - Validators│         │  - Database  │            │
│  └──────┬───────┘         └──────┬───────┘            │
│         │                        │                     │
│         └────────┬───────────────┘                     │
│                  │                                     │
│         ┌────────▼────────┐                           │
│         │   Jest Runner   │                           │
│         └────────┬────────┘                           │
│                  │                                     │
└──────────────────┼─────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐         ┌────▼────┐
    │Backend │         │Frontend │
    │  API   │         │  React  │
    └────────┘         └─────────┘
```

## Example Test Implementation (Framework Only)

### Backend Test Example Structure
```javascript
// backend/tests/routes/checklists.test.js
import request from 'supertest';
import app from '../../src/server.js';
import { PrismaClient } from '@prisma/client';

describe('GET /api/checklists', () => {
  it('should return all checklist items', async () => {
    const response = await request(app)
      .get('/api/checklists')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('POST /api/checklists', () => {
  it('should create a new checklist item', async () => {
    const newItem = {
      title: 'Test Item',
      comment: 'Test comment',
      status: 'pending'
    };
    
    const response = await request(app)
      .post('/api/checklists')
      .send(newItem)
      .expect(201);
    
    expect(response.body.title).toBe('Test Item');
  });
  
  it('should reject invalid data', async () => {
    const response = await request(app)
      .post('/api/checklists')
      .send({}) // Missing required title
      .expect(400);
  });
});
```

### Frontend Test Example Structure
```javascript
// frontend/src/__tests__/App.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as api from '../api/api';

jest.mock('../api/api');

describe('App Component', () => {
  it('renders checklist items', async () => {
    api.getChecklists.mockResolvedValue([
      { id: 1, title: 'Test Item', status: 'pending', comment: '' }
    ]);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });
  
  it('toggles item status', async () => {
    // Test implementation
  });
});
```

## Continuous Integration

Tests should run automatically on:
- Pre-commit hooks (optional)
- Pull requests
- Before deployment

## Notes

- **No actual test code implementation** - This document provides the framework and structure only
- Tests should be written after core functionality is complete
- Use test databases (separate from production)
- Mock external dependencies (database, API calls)

