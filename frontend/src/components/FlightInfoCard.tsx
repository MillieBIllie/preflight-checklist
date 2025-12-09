import { FlightInfo } from '../App';

interface FlightInfoCardProps {
  flightInfo: FlightInfo;
  onFlightInfoChange: (field: keyof FlightInfo, value: string) => void;
}

export function FlightInfoCard({ flightInfo, onFlightInfoChange }: FlightInfoCardProps) {
  return (
    <div className="bg-[#1E1F22] border border-[#3F4147] rounded-xl p-6 md:p-8 mb-8 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Number */}
        <div className="flex flex-col">
          <label htmlFor="flightNumber" className="text-sm text-gray-400 mb-2">
            Flight Number
          </label>
          <div className="flex gap-3 items-center">
            <input
              id="flightNumber"
              type="text"
              placeholder="Outbound F___"
              value={flightInfo.flightNumber}
              onChange={(e) => onFlightInfoChange('flightNumber', e.target.value)}
              className="flex-1 bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
            />
            <span className="bg-[#3B82F6] text-white px-3 py-2 rounded-md text-sm">
              {flightInfo.badge}
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm text-gray-400 mb-2">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={flightInfo.date}
            onChange={(e) => onFlightInfoChange('date', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>

        {/* Filed By */}
        <div className="flex flex-col">
          <label htmlFor="filedBy" className="text-sm text-gray-400 mb-2">
            Filed By
          </label>
          <input
            id="filedBy"
            type="text"
            value={flightInfo.filedBy}
            onChange={(e) => onFlightInfoChange('filedBy', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>

        {/* Filing Time */}
        <div className="flex flex-col">
          <label htmlFor="filingTime" className="text-sm text-gray-400 mb-2">
            Filing Time
          </label>
          <input
            id="filingTime"
            type="time"
            value={flightInfo.filingTime}
            onChange={(e) => onFlightInfoChange('filingTime', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>

        {/* Departure Location */}
        <div className="flex flex-col">
          <label htmlFor="departureLocation" className="text-sm text-gray-400 mb-2">
            Departure Location
          </label>
          <input
            id="departureLocation"
            type="text"
            value={flightInfo.departureLocation}
            onChange={(e) => onFlightInfoChange('departureLocation', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>

        {/* Departure Time */}
        <div className="flex flex-col">
          <label htmlFor="departureTime" className="text-sm text-gray-400 mb-2">
            Departure Time
          </label>
          <input
            id="departureTime"
            type="time"
            value={flightInfo.departureTime}
            onChange={(e) => onFlightInfoChange('departureTime', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>

        {/* Arrival Location */}
        <div className="flex flex-col">
          <label htmlFor="arrivalLocation" className="text-sm text-gray-400 mb-2">
            Arrival Location
          </label>
          <input
            id="arrivalLocation"
            type="text"
            value={flightInfo.arrivalLocation}
            onChange={(e) => onFlightInfoChange('arrivalLocation', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>

        {/* Est. Arrival Time */}
        <div className="flex flex-col">
          <label htmlFor="estimatedArrival" className="text-sm text-gray-400 mb-2">
            Est. Arrival Time
          </label>
          <input
            id="estimatedArrival"
            type="time"
            value={flightInfo.estimatedArrival}
            onChange={(e) => onFlightInfoChange('estimatedArrival', e.target.value)}
            className="bg-[#2B2D31] border border-[#3F4147] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}


