import { useState, useEffect } from 'react';
import { FlightInfoCard } from './components/FlightInfoCard';
import { ChecklistTable } from './components/ChecklistTable';
import {
  getChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  ChecklistItemResponse,
} from './api/api';

export interface ChecklistItem {
  id: string;
  name: string;
  status: 'Completed' | 'Pending';
  comment: string;
}

export interface FlightInfo {
  flightNumber: string;
  badge: string;
  date: string;
  filedBy: string;
  filingTime: string;
  departureLocation: string;
  departureTime: string;
  arrivalLocation: string;
  estimatedArrival: string;
}

// Default checklist items (used if database is empty)
const INITIAL_CHECKS = [
  'Check Digital Sky for airspace clearance',
  'WINDY DATA – at 0m alt, at 100m alt',
  'Anemometer wind speed & Wind Direction',
  'Inform the GC to power up the aircraft',
  'Choose the respective mission',
  'Write and read the mission',
  'Reconfirm UAV heading and WP heading',
  'Check WP numbering & altitudes',
];

export default function App() {
  const [flightInfo, setFlightInfo] = useState<FlightInfo>({
    flightNumber: '',
    badge: 'L 01',
    date: '',
    filedBy: '',
    filingTime: '',
    departureLocation: '',
    departureTime: '',
    arrivalLocation: '',
    estimatedArrival: '',
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load checklist items from backend on component mount
  useEffect(() => {
    loadChecklists();
  }, []);

  async function loadChecklists() {
    try {
      setLoading(true);
      setError(null);
      const items = await getChecklists();

      // If database is empty, initialize with default items
      if (items.length === 0) {
        const defaultItems = await Promise.all(
          INITIAL_CHECKS.map((title) =>
            createChecklist({ title, comment: '', status: 'pending' })
          )
        );
        setChecklistItems(
          defaultItems.map((item) => ({
            id: item.id.toString(),
            name: item.title,
            status: item.status === 'completed' ? 'Completed' : 'Pending',
            comment: item.comment || '',
          }))
        );
      } else {
        // Map backend items to frontend format
        setChecklistItems(
          items.map((item) => ({
            id: item.id.toString(),
            name: item.title,
            status: item.status === 'completed' ? 'Completed' : 'Pending',
            comment: item.comment || '',
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load checklists:', err);
      setError(
        'Failed to load checklist. Make sure backend is running on http://localhost:4000'
      );
    } finally {
      setLoading(false);
    }
  }

  const handleFlightInfoChange = (field: keyof FlightInfo, value: string) => {
    setFlightInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = async () => {
    const title = prompt('Enter checklist item title:');
    if (!title || !title.trim()) return;

    try {
      const newItem = await createChecklist({
        title: title.trim(),
        comment: '',
        status: 'pending',
      });

      setChecklistItems((prev) => [
        ...prev,
        {
          id: newItem.id.toString(),
          name: newItem.title,
          status: 'Pending',
          comment: newItem.comment || '',
        },
      ]);
    } catch (err) {
      console.error('Failed to create item:', err);
      alert('Failed to create checklist item. Please try again.');
    }
  };

  const handleEditItem = async (id: string) => {
    const item = checklistItems.find((item) => item.id === id);
    if (!item) return;

    const newName = prompt('Edit check name:', item.name);
    if (!newName || !newName.trim()) return;

    try {
      const updated = await updateChecklist(Number(id), {
        title: newName.trim(),
      });

      setChecklistItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name: updated.title } : item
        )
      );
    } catch (err) {
      console.error('Failed to update item:', err);
      alert('Failed to update checklist item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteChecklist(Number(id));
      setChecklistItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete checklist item. Please try again.');
    }
  };

  const handleStatusChange = async (
    id: string,
    status: 'Completed' | 'Pending'
  ) => {
    try {
      const backendStatus = status === 'Completed' ? 'completed' : 'pending';
      await updateChecklist(Number(id), { status: backendStatus });

      setChecklistItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleCommentChange = async (id: string, comment: string) => {
    // Update UI immediately
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, comment } : item))
    );

    // Debounce: save to backend after 500ms
    setTimeout(async () => {
      try {
        await updateChecklist(Number(id), { comment });
      } catch (err) {
        console.error('Failed to update comment:', err);
        alert('Failed to save comment. Please try again.');
      }
    }, 500);
  };

  const handleSaveChecklist = async () => {
    setSaving(true);
    try {
      // Save all checklist items to ensure they're persisted
      await Promise.all(
        checklistItems.map((item) =>
          updateChecklist(Number(item.id), {
            title: item.name,
            comment: item.comment,
            status: item.status === 'Completed' ? 'completed' : 'pending',
          })
        )
      );

      console.log('Flight Info:', flightInfo);
      console.log('Checklist Items:', checklistItems);
      alert('Checklist saved successfully!');
    } catch (err) {
      console.error('Failed to save checklist:', err);
      alert('Failed to save checklist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2B2D31] text-white flex items-center justify-center">
        <p>Loading checklist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2B2D31] text-white px-4 py-8 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="tracking-wider text-5xl">PRE-FLIGHT CHECKLIST</h1>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Flight Information Card */}
        <FlightInfoCard
          flightInfo={flightInfo}
          onFlightInfoChange={handleFlightInfoChange}
        />

        {/* Preflight Checks Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2>Preflight Checks</h2>
            <button
              onClick={handleAddItem}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              + Add Item
            </button>
          </div>

          <ChecklistTable
            items={checklistItems}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onStatusChange={handleStatusChange}
            onCommentChange={handleCommentChange}
          />
        </section>

        {/* Save Button */}
        <div className="flex justify-start">
          <button
            onClick={handleSaveChecklist}
            disabled={saving}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-12 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Checklist'}
          </button>
        </div>
      </div>
    </div>
  );
}


