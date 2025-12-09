// src/api/api.ts - API client for backend CRUD operations
import axios from 'axios';

// Backend API base URL - uses environment variable in production, localhost in development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface ChecklistItemResponse {
  id: number;
  flightId: number | null;
  title: string;
  comment: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Get all checklist items
export async function getChecklists(): Promise<ChecklistItemResponse[]> {
  try {
    const response = await axios.get(`${API_BASE}/checklists`);
    return response.data;
  } catch (error) {
    console.error('API Error fetching checklists:', error);
    throw error;
  }
}

// Create a new checklist item
export async function createChecklist(item: {
  title: string;
  comment?: string;
  status?: 'pending' | 'completed';
}): Promise<ChecklistItemResponse> {
  try {
    const response = await axios.post(`${API_BASE}/checklists`, item);
    return response.data;
  } catch (error) {
    console.error('API Error creating checklist:', error);
    throw error;
  }
}

// Update an existing checklist item
export async function updateChecklist(
  id: number,
  updates: {
    title?: string;
    comment?: string;
    status?: 'pending' | 'completed';
  }
): Promise<ChecklistItemResponse> {
  try {
    const response = await axios.put(`${API_BASE}/checklists/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('API Error updating checklist:', error);
    throw error;
  }
}

// Delete a checklist item
export async function deleteChecklist(id: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE}/checklists/${id}`);
  } catch (error) {
    console.error('API Error deleting checklist:', error);
    throw error;
  }
}


