export function Topbar({ user, onSwitchUser }) {
  return (
    <div className="bg-gray-800 text-white px-5 py-3 flex justify-between items-center shadow-md">
      <div>
        <h2 className="text-xl font-semibold m-0">Meeting Room Booking System</h2>
      </div>
      <div className="flex items-center gap-5">
        <span>
          Logged in as: <strong>{user.name}</strong> ({user.role})
        </span>
        <button 
          onClick={onSwitchUser} 
          className="px-4 py-1 bg-red-500 text-white border-none rounded cursor-pointer hover:bg-red-600"
        >
          Switch User
        </button>
      </div>
    </div>
  );
}