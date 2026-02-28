import { useState, useEffect } from "react";

export function ChooseUserPage({ onSelect }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/public/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-500';
      case 'owner': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center py-10 text-gray-500">Loading users...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-red-500 mt-2 p-2 bg-red-50 rounded">{error}</div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl text-gray-800 mb-2">Choose Your Role</h1>
        <p className="text-gray-500 mb-8">Select a user to continue</p>
        
        <div className="flex flex-col gap-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              className="p-4 border border-gray-200 rounded bg-white cursor-pointer text-left w-full hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">{user.name}</span>
                <span className={`px-2 py-1 rounded text-white text-xs capitalize ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}