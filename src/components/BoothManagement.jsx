import { useState, useEffect } from 'react';
import { BiCheck, BiX, BiMap } from 'react-icons/bi';

export default function BoothManagement({ eventId, selectedBooths = [], onBoothsUpdate }) {
  const [booths, setBooths] = useState([
    { id: 'A1', status: 'available', price: 500 },
    { id: 'A2', status: 'available', price: 500 },
    { id: 'A3', status: 'available', price: 500 },
    { id: 'B1', status: 'available', price: 750 },
    { id: 'B2', status: 'available', price: 750 },
    { id: 'C1', status: 'available', price: 1000 },
  ]);
  
  const [selected, setSelected] = useState(selectedBooths);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate total price of selected booths
    const total = selected.reduce((sum, boothId) => {
      const booth = booths.find(b => b.id === boothId);
      return sum + (booth?.price || 0);
    }, 0);
    setTotalPrice(total);
  }, [selected, booths]);

  const toggleBooth = (boothId) => {
    setSelected(prev => 
      prev.includes(boothId)
        ? prev.filter(id => id !== boothId)
        : [...prev, boothId]
    );
  };

  const handleConfirm = () => {
    onBoothsUpdate(selected);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const getBoothStatus = (boothId) => {
    if (selected.includes(boothId)) return 'selected';
    const booth = booths.find(b => b.id === boothId);
    return booth?.status || 'available';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Booth Selection</h3>
        
        {/* Booth Layout Visualization */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Event Floor Plan</h4>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-500 mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {booths.map((booth) => {
              const status = getBoothStatus(booth.id);
              const isSelected = selected.includes(booth.id);
              
              return (
                <div 
                  key={booth.id}
                  onClick={() => status === 'available' && toggleBooth(booth.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center
                    ${status === 'selected' 
                      ? 'bg-blue-100 border-blue-500' 
                      : status === 'booked' 
                        ? 'bg-gray-200 border-gray-400 cursor-not-allowed' 
                        : 'bg-green-100 border-green-500 hover:bg-green-200'}`}
                >
                  <span className="font-medium">Booth {booth.id}</span>
                  <span className="text-sm">${booth.price}</span>
                  {isSelected && (
                    <div className="mt-2 text-blue-600">
                      <BiCheck size={24} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Booths Summary */}
        {selected.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Selected Booths ({selected.length})</h4>
            <div className="space-y-2">
              {selected.map(boothId => {
                const booth = booths.find(b => b.id === boothId);
                return (
                  <div key={boothId} className="flex justify-between items-center">
                    <span>Booth {boothId}</span>
                    <div className="flex items-center space-x-4">
                      <span>${booth?.price || 0}</span>
                      <button 
                        onClick={() => toggleBooth(boothId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <BiX size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 mt-2 border-t border-blue-200 font-medium flex justify-between">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setSelected([])}
          disabled={selected.length === 0}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Selection
        </button>
        <button
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Booths
        </button>
      </div>

      {/* Success Message */}
      {showConfirmation && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
          <BiCheck size={20} />
          <span>Booths selected successfully!</span>
        </div>
      )}
    </div>
  );
}
