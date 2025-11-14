import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const Calculator = () => {
  const { language, t } = useLanguage();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get('/traditional-foods');
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const name = food.name?.[language] || food.name?.en || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const addFood = (food) => {
    if (!selectedFoods.find((f) => f._id === food._id)) {
      setSelectedFoods([...selectedFoods, food]);
      const defaultAmount = food.servingSize?.amount || 100;
      setQuantities({ ...quantities, [food._id]: defaultAmount });
    }
  };

  const removeFood = (foodId) => {
    setSelectedFoods(selectedFoods.filter((f) => f._id !== foodId));
    const newQuantities = { ...quantities };
    delete newQuantities[foodId];
    setQuantities(newQuantities);
  };

  const updateQuantity = (foodId, quantity) => {
    setQuantities({ ...quantities, [foodId]: parseFloat(quantity) || 0 });
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    selectedFoods.forEach((food) => {
      const quantity = quantities[food._id] || 0;
      const servingSize = food.servingSize?.amount || 100;
      const multiplier = quantity / servingSize; // Convert to per serving basis

      totalCalories += (food.nutrition?.calories || 0) * multiplier;
      totalProtein += (food.nutrition?.protein || 0) * multiplier;
      totalCarbs += (food.nutrition?.carbs || 0) * multiplier;
      totalFat += (food.nutrition?.fat || 0) * multiplier;
      totalFiber += (food.nutrition?.fiber || 0) * multiplier;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
    };
  };

  const nutrition = calculateNutrition();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nutrition Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Food Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Traditional Foods</h2>
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            {loading ? (
              <div className="text-center py-8">Loading foods...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredFoods.map((food) => {
                  const foodName = food.name?.[language] || food.name?.en || 'Unknown';
                  return (
                    <div
                      key={food._id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{foodName}</h3>
                        <p className="text-sm text-gray-600">
                          {food.nutrition?.calories || 0} cal per {food.servingSize?.amount || 100}{food.servingSize?.unit || 'g'}
                        </p>
                      </div>
                      <button
                        onClick={() => addFood(food)}
                        disabled={selectedFoods.find((f) => f._id === food._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedFoods.find((f) => f._id === food._id)
                          ? 'Added'
                          : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Foods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Selected Foods</h2>
            {selectedFoods.length === 0 ? (
              <p className="text-gray-500">No foods selected</p>
            ) : (
              <div className="space-y-4">
                {selectedFoods.map((food) => {
                  const foodName = food.name?.[language] || food.name?.en || 'Unknown';
                  const unit = food.servingSize?.unit || 'g';
                  return (
                    <div
                      key={food._id}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{foodName}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Quantity ({unit})</label>
                          <input
                            type="number"
                            value={quantities[food._id] || 0}
                            onChange={(e) => updateQuantity(food._id, e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded ml-2"
                            min="0"
                          />
                        </div>
                        <button
                          onClick={() => removeFood(food._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Nutrition Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded">
                <div className="text-sm text-gray-600">Calories</div>
                <div className="text-2xl font-bold text-green-600">{nutrition.calories}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="text-sm text-gray-600">Protein</div>
                <div className="text-2xl font-bold text-blue-600">{nutrition.protein}g</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded">
                <div className="text-sm text-gray-600">Carbohydrates</div>
                <div className="text-2xl font-bold text-yellow-600">{nutrition.carbs}g</div>
              </div>
              <div className="p-4 bg-orange-50 rounded">
                <div className="text-sm text-gray-600">Fat</div>
                <div className="text-2xl font-bold text-orange-600">{nutrition.fat}g</div>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <div className="text-sm text-gray-600">Fiber</div>
                <div className="text-2xl font-bold text-purple-600">{nutrition.fiber}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

