import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const translations = {
    en: {
      // Common
      home: 'Home',
      products: 'Products',
      dietPlans: 'Diet Plans',
      calculator: 'Calculator',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      // Amma's Kitchen
      ammasKitchen: "Amma's Kitchen",
      buildYourPlate: 'Build Your Plate',
      // Daily Tips
      dailyTip: 'Daily Tip',
      oneChange: 'One Change Today',
      // Meal Logging
      logMeal: 'Log Meal',
      takePhoto: 'Take Photo',
      // Plates
      generatePlate: 'Generate Plate',
      busyLifeHack: 'Busy Life Hack',
    },
    si: {
      // Common
      home: 'මුල් පිටුව',
      products: 'නිෂ්පාදන',
      dietPlans: 'ආහාර සැලසුම්',
      calculator: 'ගණකය',
      profile: 'පැතිකඩ',
      login: 'පිවිසීම',
      register: 'ලියාපදිංචි වන්න',
      // Amma's Kitchen
      ammasKitchen: 'අම්මාගේ අවන්',
      buildYourPlate: 'ඔබේ තහඩුව සාදන්න',
      // Daily Tips
      dailyTip: 'දිනපතා ඉඟිය',
      oneChange: 'අද එක වෙනසක්',
      // Meal Logging
      logMeal: 'ආහාර සටහන් කරන්න',
      takePhoto: 'ඡායාරූපයක් ගන්න',
      // Plates
      generatePlate: 'තහඩුවක් සාදන්න',
      busyLifeHack: 'කාර්යබහුල ජීවිතයේ උපක්‍රමය',
    },
    ta: {
      // Common
      home: 'வீடு',
      products: 'தயாரிப்புகள்',
      dietPlans: 'உணவு திட்டங்கள்',
      calculator: 'கணிப்பான்',
      profile: 'சுயவிவரம்',
      login: 'உள்நுழைய',
      register: 'பதிவு செய்',
      // Amma's Kitchen
      ammasKitchen: 'அம்மாவின் சமையலறை',
      buildYourPlate: 'உங்கள் தட்டை உருவாக்கவும்',
      // Daily Tips
      dailyTip: 'தினசரி உதவிக்குறிப்பு',
      oneChange: 'இன்று ஒரு மாற்றம்',
      // Meal Logging
      logMeal: 'உணவை பதிவு செய்',
      takePhoto: 'படம் எடு',
      // Plates
      generatePlate: 'தட்டை உருவாக்கவும்',
      busyLifeHack: 'பிஸிய வாழ்க்கை தந்திரம்',
    },
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


