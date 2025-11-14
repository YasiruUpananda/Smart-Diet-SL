const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Smart Diet SL</h3>
            <p className="text-gray-400">
              Your trusted nutrition advisor for healthy Sri Lankan diets.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/diet-plans" className="hover:text-white transition">
                  Diet Plans
                </a>
              </li>
              <li>
                <a href="/calculator" className="hover:text-white transition">
                  Calculator
                </a>
              </li>
              <li>
                <a href="/sri-lankan-plates" className="hover:text-white transition">
                  Generate Plate
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@smartdiet.lk</p>
            <p className="text-gray-400">Phone: +94 11 234 5678</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Smart Diet SL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

