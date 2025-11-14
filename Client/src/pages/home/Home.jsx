import { Link } from 'react-router-dom';
import DailyTip from '../../components/common/DailyTip';
import { useLanguage } from '../../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Smart Diet SL</h1>
          <p className="text-xl mb-8">
            Your trusted nutrition advisor for healthy Sri Lankan diets
          </p>
          <div className="space-x-4 mb-6">
            <Link
              to="/calculator"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition inline-block"
            >
              Calculate Nutrition
            </Link>
            <Link
              to="/diet-plans"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition inline-block"
            >
              {t('dietPlans')}
            </Link>
            <Link
              to="/sri-lankan-plates"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition inline-block"
            >
              {t('generatePlate')}
            </Link>
          </div>
          <div className="max-w-2xl mx-auto">
            <DailyTip />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Nutrition Calculator</h3>
              <p className="text-gray-600">
                Calculate your daily nutrition intake with our easy-to-use calculator
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Diet Plans</h3>
              <p className="text-gray-600">
                Follow personalized diet plans designed for Sri Lankan cuisine
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">Traditional Foods</h3>
              <p className="text-gray-600">
                Discover authentic Sri Lankan traditional foods and their nutritional benefits
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

