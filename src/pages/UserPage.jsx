import { useState, useEffect } from "react";

export function UserPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/bookings", {
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });
      const data = await res.json();
      console.log(data, 'is data');
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError("Failed to fetch bookings");
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3000/api/user/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'user-id': user.id.toString(),
          'user-role': user.role
        },
        body: JSON.stringify({
          userId: user.id,
          startTime,
          endTime
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setSuccess("Booking created successfully!");
      setStartTime("");
      setEndTime("");
      fetchBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/user/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete booking");
      }

      setSuccess("Booking deleted successfully!");
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const isOwnBooking = (booking) => {
    return booking.user_id === user.id || 
           booking.userId === user.id || 
           booking.userid === user.id;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl text-gray-800 mb-1">My Bookings</h2>
        <p className="text-sm sm:text-base text-gray-500">Create and manage your meeting room bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">Create New Booking</h3>
          <form onSubmit={createBooking} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800 text-sm sm:text-base">Start Time:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800 text-sm sm:text-base">End Time:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="p-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </form>
          {error && <div className="text-red-500 mt-2 p-2 bg-red-50 rounded text-sm sm:text-base">{error}</div>}
          {success && <div className="text-green-600 mt-2 p-2 bg-green-50 rounded text-sm sm:text-base">{success}</div>}
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">All Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-5 text-sm sm:text-base">No bookings found</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {bookings.map(booking => {
                const isOwnedByUser = isOwnBooking(booking);
                
                return (
                  <div 
                    key={booking.id || booking.booking_id} 
                    className={`p-3 sm:p-4 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white ${
                      isOwnedByUser ? 'border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="text-xs sm:text-sm">
                        <strong>Start:</strong> {new Date(booking.start_time || booking.startTime).toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm">
                        <strong>End:</strong> {new Date(booking.end_time || booking.endTime).toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm">
                        <strong>Created:</strong> {new Date(booking.created_at || booking.createdAt).toLocaleString()}
                      </div>
                      {isOwnedByUser && (
                        <div className="text-xs text-blue-600 mt-1">Your booking</div>
                      )}
                    </div>
                    
                    {isOwnedByUser && (
                      <button
                        onClick={() => deleteBooking(booking.id || booking.booking_id)}
                        className="px-3 py-1.5 bg-red-500 text-white border-none rounded cursor-pointer text-xs sm:text-sm hover:bg-red-600 transition-colors w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}