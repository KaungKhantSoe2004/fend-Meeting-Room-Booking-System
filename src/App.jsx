import { useState } from "react";
import { Topbar } from "./components/Topbar";
import { ChooseUserPage } from "./pages/ChooseUserPage";
import { UserPage } from "./pages/UserPage";
import { OwnerPage } from "./pages/OwnerPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) return <ChooseUserPage onSelect={setCurrentUser} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar user={currentUser} onSwitchUser={() => setCurrentUser(null)} />
      <main className="p-5">
        {currentUser.role === "admin" && <AdminPage user={currentUser} />}
        {currentUser.role === "owner" && <OwnerPage user={currentUser} />}
        {currentUser.role === "user" && <UserPage user={currentUser} />}
      </main>
    </div>
  );
}