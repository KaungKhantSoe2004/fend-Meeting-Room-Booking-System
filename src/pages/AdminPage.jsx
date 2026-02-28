import { useState, useEffect } from "react";

export function AdminPage({ user }) {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchBookings()
    ]);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to fetch users");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/bookings", {
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

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'user-id': user.id.toString(),
          'user-role': user.role
        },
        body: JSON.stringify({
          name: newUserName,
          role: newUserRole
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setSuccess("User created successfully!");
      setNewUserName("");
      setNewUserRole("user");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? Their bookings will also be deleted.")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          'user-id': user.id.toString(),
          'user-role': user.role
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setSuccess("User deleted successfully!");
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'user-id': user.id.toString(),
          'user-role': user.role
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      setSuccess("User role updated successfully!");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/deleteBookings/${bookingId}`, {
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

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-500';
      case 'owner': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl text-gray-800 mb-1">Admin Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-500">Manage users and monitor all bookings</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">Create New User</h3>
          <form onSubmit={createUser} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800 text-sm sm:text-base">Name:</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-800 w-full"
                placeholder="Enter user name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800 text-sm sm:text-base">Role:</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-800 w-full"
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="p-2 bg-gray-800 text-white border-none rounded cursor-pointer hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">Manage Users</h3>
          {users.length === 0 ? (
            <p className="text-gray-400 text-center py-5 text-sm sm:text-base">No users found</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {users.map(u => (
                <div key={u.id} className="p-3 sm:p-4 border border-gray-200 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                    <span className="font-medium text-sm sm:text-base">{u.name}</span>
                    <span className={`px-2 py-1 rounded text-white text-xs capitalize w-fit ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center w-full sm:w-auto">
                    {u.id !== user.id && (
                      <>
                        <select
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          value={u.role}
                          className="p-1 border border-gray-300 rounded text-xs focus:outline-none flex-1 sm:flex-none"
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-3 py-1.5 bg-red-500 text-white border-none rounded cursor-pointer text-xs hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-3 bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">All Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-5 text-sm sm:text-base">No bookings found</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {bookings.map(booking => (
                <div key={booking.id} className="p-3 sm:p-4 border border-gray-200 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1 w-full">
                    <div className="text-xs sm:text-sm"><strong>User:</strong> {booking.user_name || `User ${booking.userId}`}</div>
                    <div className="text-xs sm:text-sm"><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</div>
                    <div className="text-xs sm:text-sm"><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</div>
                    <div className="text-xs sm:text-sm"><strong>Created:</strong> {new Date(booking.created_at).toLocaleString()}</div>
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
      </div>
    </div>
  );
}