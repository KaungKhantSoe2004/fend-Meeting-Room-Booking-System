import { useState, useEffect } from "react";

export function OwnerPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [usageSummary, setUsageSummary] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchBookings(),
      fetchUsers(),
      fetchUsageSummary()
    ]);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("https://booking.z256600-ll9lz.ps02.zwhhosting.com/api/owner/bookings", {
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });
      const data = await res.json();
      setBookings(data);
    } catch {
      setError("Failed to fetch bookings");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://booking.z256600-ll9lz.ps02.zwhhosting.com/api/owner/users", {
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });
      const data = await res.json();
      const nonAdminUsers = data.filter(u => u.role !== 'admin');
      setUsers(nonAdminUsers);
    } catch {
      setError("Failed to fetch users");
    }
  };

  const fetchUsageSummary = async () => {
    try {
      const res = await fetch("https://booking.z256600-ll9lz.ps02.zwhhosting.com/api/owner/usage-summary", {
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });
      const data = await res.json();
      setUsageSummary(data);
    } catch {
      setError("Failed to fetch usage summary");
    }
  };

  const fetchUserBookings = async (userId) => {
    if (!userId) return;
    
    try {
      const res = await fetch(`https://booking.z256600-ll9lz.ps02.zwhhosting.com/api/owner/bookingsByUser/${userId}`, {
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });
      const data = await res.json();
      setUserBookings(data);
    } catch {
      setError("Failed to fetch user bookings");
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://booking.z256600-ll9lz.ps02.zwhhosting.com/api/owner/createBookings", {
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
      fetchAllData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`https://booking.z256600-ll9lz.ps02.zwhhosting.com/api/owner/deleteBookings/${bookingId}`, {
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
      fetchAllData();
      if (selectedUserId) {
        fetchUserBookings(selectedUserId);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl text-gray-800 mb-1">Owner Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-500">Manage all bookings and view usage statistics</p>
      </div>

      {error && (
        <div className="mb-5 text-red-500 p-3 bg-red-50 rounded border border-red-200 text-sm sm:text-base">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-5 text-green-600 p-3 bg-green-50 rounded border border-green-200 text-sm sm:text-base">
          {success}
        </div>
      )}

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
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-yellow-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800 text-sm sm:text-base">End Time:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-yellow-500 w-full"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="p-2 bg-yellow-500 text-white border-none rounded cursor-pointer hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </form>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">Usage Summary</h3>
          {usageSummary.length === 0 ? (
            <p className="text-gray-400 text-center py-5 text-sm sm:text-base">No usage data available</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {usageSummary.map(summary => (
                <div key={summary.user_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium text-sm sm:text-base">{summary.user_name}</span>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm">
                    {summary.total_bookings} bookings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">All Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-5 text-sm sm:text-base">No bookings found</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {bookings.map(booking => (
                <div key={booking.id} className="p-3 sm:p-4 border border-gray-200 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="text-xs sm:text-sm"><strong>User:</strong> {booking.user_name || `User ${booking.userId}`}</div>
                    <div className="text-xs sm:text-sm"><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</div>
                    <div className="text-xs sm:text-sm"><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="px-3 py-1.5 bg-red-500 text-white border-none rounded cursor-pointer text-xs sm:text-sm hover:bg-red-600 transition-colors w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">View Bookings by User</h3>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-800 text-sm sm:text-base">Select User:</label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                fetchUserBookings(e.target.value);
              }}
              className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-yellow-500 w-full"
            >
              <option value="">Choose a user...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          {selectedUserId && (
            <div className="mt-5">
              <h4 className="font-medium mb-3 text-sm sm:text-base">Bookings for selected user</h4>
              {userBookings.length === 0 ? (
                <p className="text-gray-400 text-center py-5 text-sm sm:text-base">No bookings for this user</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {userBookings.map(booking => (
                    <div key={booking.id} className="p-3 sm:p-4 border border-gray-200 rounded bg-white">
                      <div className="text-xs sm:text-sm"><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</div>
                      <div className="text-xs sm:text-sm"><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}