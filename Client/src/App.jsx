import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Calculator from './pages/calculator/Calculator';
import DietPlans from './pages/diet-plans/DietPlans';
import DietPlanner from './pages/diet-planner/DietPlanner';
import Profile from './pages/profile/Profile';
import MealLogging from './pages/meal-logging/MealLogging';
import SriLankanPlates from './pages/sri-lankan-plates/SriLankanPlates';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/diet-plans" element={<DietPlans />} />
              <Route path="/diet-planner" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
              <Route path="/meal-logging" element={<ProtectedRoute><MealLogging /></ProtectedRoute>} />
              <Route path="/sri-lankan-plates" element={<SriLankanPlates />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
