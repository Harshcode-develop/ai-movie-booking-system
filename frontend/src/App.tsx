import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import AuthModal from "./components/Navbar/AuthModal";
import ChatSidebar from "./components/ChatSidebar/ChatSidebar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import "./index.css";

const AppContent = () => {
  const { isAuthModalOpen, closeAuthModal, openAuthModal } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
        <Navbar onOpenAuth={openAuthModal} />
        <main className="flex-1 pt-[60px]">
          <AnimatedRoutes />
        </main>
        <ChatSidebar />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
