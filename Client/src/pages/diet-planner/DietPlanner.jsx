import { useLanguage } from '../../contexts/LanguageContext';

const DietPlanner = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Diet Planner</h1>
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">
          AI Diet Planner feature is coming soon!
        </p>
        <p className="text-gray-500">
          This feature will help you create personalized diet plans based on your goals and preferences.
        </p>
      </div>
    </div>
  );
};

export default DietPlanner;

