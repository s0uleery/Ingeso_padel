// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { UserPage } from "./pages/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminPage />
          }
        />
        <Route
          path="/user"
          element={
            <UserPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

