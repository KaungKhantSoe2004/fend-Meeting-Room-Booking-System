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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl text-gray-800 mb-1">Admin Dashboard</h2>
        <p className="text-gray-500">Manage users and monitor all bookings</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg text-gray-800 mb-4">Create New User</h3>
          <form onSubmit={createUser} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800">Name:</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-800"
                placeholder="Enter user name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-800">Role:</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-800"
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="p-2 bg-gray-800 text-white border-none rounded cursor-pointer hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        <div className="col-span-2 bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg text-gray-800 mb-4">Manage Users</h3>
          {users.length === 0 ? (
            <p className="text-gray-400 text-center py-5">No users found</p>
          ) : (
            <div className="flex flex-col gap-2">
              {users.map(u => (
                <div key={u.id} className="p-4 border border-gray-200 rounded flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{u.name}</span>
                    <span className={`px-2 py-1 rounded text-white text-xs capitalize ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {u.id !== user.id && (
                      <>
                        <select
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          value={u.role}
                          className="p-1 border border-gray-300 rounded text-xs focus:outline-none"
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-2 py-1 bg-red-500 text-white border-none rounded cursor-pointer text-xs hover:bg-red-600"
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

        <div className="col-span-3 bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg text-gray-800 mb-4">All Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-5">No bookings found</p>
          ) : (
            <div className="flex flex-col gap-2">
              {bookings.map(booking => (
                <div key={booking.id} className="p-4 border border-gray-200 rounded flex justify-between items-center bg-white">
                  <div className="grid grid-cols-4 gap-2 flex-1">
                    <div><strong>User:</strong> {booking.user_name || `User ${booking.userId}`}</div>
                    <div><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</div>
                    <div><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</div>
                    <div><strong>Created:</strong> {new Date(booking.created_at).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="px-2 py-1 bg-red-500 text-white border-none rounded cursor-pointer text-xs hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 mt-5 p-2 bg-red-50 rounded">{error}</div>}
      {success && <div className="text-green-600 mt-5 p-2 bg-green-50 rounded">{success}</div>}
    </div>
  );
}