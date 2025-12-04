// src/api/api.js
export async function getChecklists() {
    // TEMP: return mock data until backend is ready
    return {
      data: [
        { id: 1, title: 'Example item', comment: 'Mock item', status: 'pending' },
      ],
    };
  }
  
  export async function createChecklist(body) {
    return {
      data: { id: Date.now(), status: 'pending', ...body },
    };
  }
  
  export async function updateChecklist(id, body) {
    return {
      data: { id, title: 'Updated title', comment: 'Updated comment', status: body.status },
    };
  }
  
  export async function deleteChecklist(id) {
    return { data: true };
  }
  