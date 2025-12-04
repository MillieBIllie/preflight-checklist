import { useState } from 'react';

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

  const [checks, setChecks] = useState(
    INITIAL_CHECKS.map((label, idx) => ({
      id: idx + 1,
      label,
      status: 'pending', // pending | completed
      comment: '',
    })),
  );

  function toggleStatus(id) {
    setChecks(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'pending' ? 'completed' : 'pending' }
          : item,
      ),
    );
  }

  function updateComment(id, value) {
    setChecks(prev =>
      prev.map(item =>
        item.id === id ? { ...item, comment: value } : item,
      ),
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    // For now just log; later you can POST to backend
    console.log('Preflight checklist submitted:', {
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
    alert('Checklist captured in console. Wire this to your backend next.');
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
        <h2 style={{ marginBottom: 8 }}>Preflight Checks</h2>

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
                  width: '50%',
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
                  width: '35%',
                  textAlign: 'left',
                }}
              >
                COMMENT(S)
              </th>
            </tr>
          </thead>
          <tbody>
            {checks.map(item => (
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
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Save Checklist
        </button>
      </form>
    </div>
  );
}

export default App;
