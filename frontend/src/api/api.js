// src/api/api.js - API client for backend CRUD operations
import axios from 'axios';

// Backend API base URL (backend runs on port 4000)
const API_BASE = 'http://localhost:4000/api';

// Get all checklist items
export async function getChecklists() {
  const response = await axios.get(`${API_BASE}/checklists`);
  return response.data; // Returns array of items
}

// Create a new checklist item
export async function createChecklist(item) {
  const response = await axios.post(`${API_BASE}/checklists`, item);
  return response.data; // Returns created item
}

// Update an existing checklist item
export async function updateChecklist(id, updates) {
  const response = await axios.put(`${API_BASE}/checklists/${id}`, updates);
  return response.data; // Returns updated item
}

// Delete a checklist item
export async function deleteChecklist(id) {
  await axios.delete(`${API_BASE}/checklists/${id}`);
  return true;
}
