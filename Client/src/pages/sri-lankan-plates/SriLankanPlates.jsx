import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const SriLankanPlates = () => {
  const { language, t } = useLanguage();
  const [goal, setGoal] = useState('weight-loss');
  const [calories, setCalories] = useState(2000);
  const [plate, setPlate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyLifeOnly, setBusyLifeOnly] = useState(false);

  const generatePlate = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('goal', goal);
      params.append('calories', calories);
      if (language !== 'en') params.append('language', language);

      const { data } = await api.get(`/sri-lankan-plates/generate?${params.toString()}`);
      setPlate(data);
    } catch (error) {
      toast.error('Failed to generate plate');
    } finally {
      setLoading(false);
    }
  }, [goal, calories, language]);

  useEffect(() => {
    generatePlate();
  }, [generatePlate]);

  const goals = [
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'diabetes', label: 'Diabetes Management' },
    { value: 'weight-gain', label: 'Weight Gain' },
    { value: 'general-health', label: 'General Health' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('generatePlate')}</h1>
      <p className="text-gray-600 mb-6">
        Get personalized Sri Lankan meal plates based on your health goals
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {goals.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Calories
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || 2000)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1000"
              max="4000"
              step="100"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={busyLifeOnly}
                onChange={(e) => setBusyLifeOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{t('busyLifeHack')}</span>
            </label>
          </div>
        </div>

        <button
          onClick={generatePlate}
          disabled={loading}
          className="mt-4 w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate New Plate'}
        </button>
      </div>

      {plate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              {plate.displayName || plate.name?.en || plate.name}
            </h2>
            {plate.isBusyLifeFriendly && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {t('busyLifeHack')}
              </span>
            )}
          </div>

          {plate.displayDescription && (
            <p className="text-gray-600 mb-4">{plate.displayDescription}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plate Items */}
            <div>
              <h3 className="font-semibold mb-3">Plate Contents:</h3>
              <div className="space-y-2">
                {plate.items?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.portion}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round(item.nutrition?.calories || 0)} cal
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Summary */}
            <div>
              <h3 className="font-semibold mb-3">Nutrition Summary:</h3>
              <div className="bg-green-50 p-4 rounded space-y-2">
                <div className="flex justify-between">
                  <span>Total Calories:</span>
                  <span className="font-semibold">
                    {Math.round(plate.totalNutrition?.calories || 0)} cal
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Protein:</span>
                  <span>{Math.round(plate.totalNutrition?.protein || 0)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Carbs:</span>
                  <span>{Math.round(plate.totalNutrition?.carbs || 0)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fat:</span>
                  <span>{Math.round(plate.totalNutrition?.fat || 0)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fiber:</span>
                  <span>{Math.round(plate.totalNutrition?.fiber || 0)}g</span>
                </div>
              </div>

              {plate.substitutions && plate.substitutions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Suggested Substitutions:</h4>
                  <ul className="space-y-1 text-sm">
                    {plate.substitutions.map((sub, index) => (
                      <li key={index} className="text-gray-600">
                        <span className="font-medium">{sub.original}</span> →{' '}
                        <span className="font-medium text-green-600">{sub.substitute}</span>
                        {sub.reason && (
                          <span className="text-gray-500 ml-2">({sub.reason})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plate.prepTime > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">Prep Time:</span> {plate.prepTime} minutes
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SriLankanPlates;

