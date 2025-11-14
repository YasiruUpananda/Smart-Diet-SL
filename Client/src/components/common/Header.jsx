import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { language, changeLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center">
            <span>🥗</span>
            <span className="ml-2">Smart Diet SL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Main Links */}
            <Link
              to="/"
              className="px-3 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
            >
              {t('home')}
            </Link>
            <Link
              to="/diet-plans"
              className="px-3 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
            >
              {t('dietPlans')}
            </Link>
            {isAuthenticated && (
              <Link
                to="/diet-planner"
                className="px-3 py-2 rounded hover:bg-green-700 transition text-sm font-semibold"
              >
                AI Diet Planner
              </Link>
            )}

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 rounded hover:bg-green-700 transition text-sm font-medium flex items-center">
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link
                    to="/calculator"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsMenuOpen(false)}
                  >
                    {t('calculator')}
                  </Link>
                  <Link
                    to="/sri-lankan-plates"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsMenuOpen(false)}
                  >
                    {t('generatePlate')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1 border-l border-green-500 pl-3 ml-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  language === 'en'
                    ? 'bg-white text-green-600'
                    : 'hover:bg-green-700'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('si')}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  language === 'si'
                    ? 'bg-white text-green-600'
                    : 'hover:bg-green-700'
                }`}
                title="සිංහල"
              >
                සිං
              </button>
              <button
                onClick={() => changeLanguage('ta')}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  language === 'ta'
                    ? 'bg-white text-green-600'
                    : 'hover:bg-green-700'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 border-l border-green-500 pl-3 ml-2">
                {/* User Dropdown */}
                <div className="relative group">
                  <button className="px-3 py-2 rounded hover:bg-green-700 transition text-sm font-medium flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {user?.name?.split(' ')[0] || 'Account'}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('profile')}
                      </Link>
                      <Link
                        to="/meal-logging"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('logMeal')}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-green-500 pl-3 ml-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded bg-white text-green-600 hover:bg-green-50 transition text-sm font-medium"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded hover:bg-green-700 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-green-500 pt-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-3 py-2 rounded hover:bg-green-700 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                to="/diet-plans"
                className="px-3 py-2 rounded hover:bg-green-700 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dietPlans')}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/diet-planner"
                  className="px-3 py-2 rounded hover:bg-green-700 transition font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Diet Planner
                </Link>
              )}

              {/* Mobile Tools Section */}
              <div>
                <button
                  onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-green-700 transition flex items-center justify-between"
                >
                  <span>Tools</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      toolsMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {toolsMenuOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    <Link
                      to="/calculator"
                      className="block px-3 py-2 rounded hover:bg-green-700 transition"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setToolsMenuOpen(false);
                      }}
                    >
                      {t('calculator')}
                    </Link>
                    <Link
                      to="/sri-lankan-plates"
                      className="block px-3 py-2 rounded hover:bg-green-700 transition"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setToolsMenuOpen(false);
                      }}
                    >
                      {t('generatePlate')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Language Switcher */}
              <div className="flex items-center space-x-2 pt-2 border-t border-green-500">
                <span className="px-3 py-2 text-sm">Language:</span>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'en'
                      ? 'bg-white text-green-600'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('si')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'si'
                      ? 'bg-white text-green-600'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  සිං
                </button>
                <button
                  onClick={() => changeLanguage('ta')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'ta'
                      ? 'bg-white text-green-600'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  தமிழ்
                </button>
              </div>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-green-500">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <Link
                    to="/meal-logging"
                    className="block px-3 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('logMeal')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded hover:bg-green-700 transition text-red-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-green-500 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded hover:bg-green-700 transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded bg-white text-green-600 hover:bg-green-50 transition text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

