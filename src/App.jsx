import { useState, useEffect } from "react";
import { Topbar } from "./components/Topbar";
import { ChooseUserPage } from "./pages/ChooseUserPage";
import { UserPage } from "./pages/UserPage";
import { OwnerPage } from "./pages/OwnerPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse user from localStorage");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleSelectUser = (user) => {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleSwitchUser = () => {
    // Clear user from localStorage
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <ChooseUserPage onSelect={handleSelectUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar user={currentUser} onSwitchUser={handleSwitchUser} />
      <main className="p-5">
        {currentUser.role === "admin" && <AdminPage user={currentUser} />}
        {currentUser.role === "owner" && <OwnerPage user={currentUser} />}
        {currentUser.role === "user" && <UserPage user={currentUser} />}
      </main>
    </div>
  );
}