import { useState, useEffect } from 'react';
import { getChecklists, createChecklist, updateChecklist, deleteChecklist } from './api/api';

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

function App() {
  const [flightNumber, setFlightNumber] = useState('');
  const [leg, setLeg] = useState('L 01');
  const [date, setDate] = useState('');
  const [filedBy, setFiledBy] = useState('');
  const [filingTime, setFilingTime] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');

  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          INITIAL_CHECKS.map(title => 
            createChecklist({ title, comment: '', status: 'pending' })
          )
        );
        setChecks(defaultItems);
      } else {
        // Map backend items to frontend format (title -> label)
        setChecks(items.map(item => ({
          id: item.id,
          label: item.title,
          status: item.status,
          comment: item.comment || '',
        })));
      }
    } catch (err) {
      console.error('Failed to load checklists:', err);
      setError('Failed to load checklist. Make sure backend is running on http://localhost:4000');
    } finally {
      setLoading(false);
    }
  }

  // Toggle status (pending <-> completed) and save to backend
  async function toggleStatus(id) {
    const item = checks.find(c => c.id === id);
    if (!item) return;

    const newStatus = item.status === 'pending' ? 'completed' : 'pending';
    
    try {
      // Optimistically update UI
      setChecks(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );

      // Save to backend
      await updateChecklist(id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert on error
      setChecks(prev =>
        prev.map(c => (c.id === id ? { ...c, status: item.status } : c))
      );
      alert('Failed to update status. Please try again.');
    }
  }

  // Update comment and save to backend (with debounce-like behavior)
  let commentTimeout;
  async function updateComment(id, value) {
    // Update UI immediately
    setChecks(prev =>
      prev.map(item => (item.id === id ? { ...item, comment: value } : item))
    );

    // Clear previous timeout
    if (commentTimeout) clearTimeout(commentTimeout);

    // Save to backend after 500ms of no typing
    commentTimeout = setTimeout(async () => {
      try {
        await updateChecklist(id, { comment: value });
      } catch (err) {
        console.error('Failed to update comment:', err);
        alert('Failed to save comment. Please try again.');
      }
    }, 500);
  }

  // Add a new checklist item
  async function handleAddItem() {
    const title = prompt('Enter checklist item title:');
    if (!title || !title.trim()) return;

    try {
      const newItem = await createChecklist({
        title: title.trim(),
        comment: '',
        status: 'pending',
      });
      
      setChecks(prev => [
        ...prev,
        {
          id: newItem.id,
          label: newItem.title,
          status: newItem.status,
          comment: newItem.comment || '',
        },
      ]);
    } catch (err) {
      console.error('Failed to create item:', err);
      alert('Failed to create checklist item. Please try again.');
    }
  }

  // Delete a checklist item
  async function handleDeleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteChecklist(id);
      setChecks(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete checklist item. Please try again.');
    }
  }

  // Save all flight info and checklist (form submission)
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      // Save all checklist items to ensure they're persisted
      await Promise.all(
        checks.map(item =>
          updateChecklist(item.id, {
            title: item.label,
            comment: item.comment,
            status: item.status,
          })
        )
      );

      console.log('Preflight checklist saved:', {
        flightNumber,
        leg,
        date,
        filedBy,
        filingTime,
        departureLocation,
        departureTime,
        arrivalLocation,
        arrivalTime,
        checks,
      });

      alert('Checklist saved successfully!');
    } catch (err) {
      console.error('Failed to save checklist:', err);
      alert('Failed to save checklist. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <p>Loading checklist...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '30px auto',
        fontFamily: 'Arial, sans-serif',
        padding: '0 16px',
      }}
    >
      <h1 style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        PRE-FLIGHT CHECKLIST
      </h1>

      {error && (
        <div
          style={{
            padding: 12,
            backgroundColor: '#ffebee',
            color: '#c62828',
            marginBottom: 16,
            borderRadius: 4,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Flight info header */}
        <div
          style={{
            border: '1px solid #000',
            padding: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
              fontWeight: 'bold',
            }}
          >
            <div>
              FLIGHT NUMBER:&nbsp;
              <input
                value={flightNumber}
                onChange={e => setFlightNumber(e.target.value)}
                style={{ width: 120, marginRight: 8 }}
                placeholder="Outbound F___"
              />
              {leg}
            </div>
            <div>
              DATE:&nbsp;
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Filed By</div>
              <input
                value={filedBy}
                onChange={e => setFiledBy(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Filing Time</div>
              <input
                value={filingTime}
                onChange={e => setFilingTime(e.target.value)}
                style={{ width: '100%' }}
                placeholder="HH:MM"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Departure Location</div>
              <input
                value={departureLocation}
                onChange={e => setDepartureLocation(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Departure Time</div>
              <input
                value={departureTime}
                onChange={e => setDepartureTime(e.target.value)}
                style={{ width: '100%' }}
                placeholder="HH:MM"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Arrival Location</div>
              <input
                value={arrivalLocation}
                onChange={e => setArrivalLocation(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Est. Arrival Time</div>
              <input
                value={arrivalTime}
                onChange={e => setArrivalTime(e.target.value)}
                style={{ width: '100%' }}
                placeholder="HH:MM"
              />
            </div>
          </div>
        </div>

        {/* Preflight checks table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>Preflight Checks</h2>
          <button
            type="button"
            onClick={handleAddItem}
            style={{
              padding: '6px 12px',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            + Add Item
          </button>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 16,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #000',
                  padding: 8,
                  width: '45%',
                  textAlign: 'left',
                }}
              >
                CHECKS
              </th>
              <th
                style={{
                  border: '1px solid #000',
                  padding: 8,
                  width: '15%',
                }}
              >
                STATUS
              </th>
              <th
                style={{
                  border: '1px solid #000',
                  padding: 8,
                  width: '30%',
                  textAlign: 'left',
                }}
              >
                COMMENT(S)
              </th>
              <th
                style={{
                  border: '1px solid #000',
                  padding: 8,
                  width: '10%',
                }}
              >
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {checks.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ border: '1px solid #000', padding: 16, textAlign: 'center' }}>
                  No checklist items. Click "Add Item" to create one.
                </td>
              </tr>
            ) : (
              checks.map(item => (
                <tr key={item.id}>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: 8,
                      verticalAlign: 'top',
                    }}
                  >
                    {item.label}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: 8,
                      textAlign: 'center',
                      verticalAlign: 'top',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleStatus(item.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor:
                          item.status === 'completed' ? '#4caf50' : '#f0ad4e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      {item.status === 'completed' ? 'Completed' : 'Pending'}
                    </button>
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: 8,
                      verticalAlign: 'top',
                    }}
                  >
                    <textarea
                      value={item.comment}
                      onChange={e => updateComment(item.id, e.target.value)}
                      rows={2}
                      style={{ width: '100%', fontSize: 12 }}
                      placeholder="Add comment..."
                    />
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: 8,
                      textAlign: 'center',
                      verticalAlign: 'top',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save Checklist'}
        </button>
      </form>
    </div>
  );
}

export default App;
