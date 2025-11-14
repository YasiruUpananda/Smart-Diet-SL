import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchDietPlans();
  }, [category]);

  const fetchDietPlans = async () => {
    try {
      setLoading(true);
      const params = category ? `?category=${category}` : '';
      const { data } = await api.get(`/diet-plans${params}`);
      setDietPlans(data);
    } catch (error) {
      toast.error('Failed to fetch diet plans');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'weight-loss',
    'weight-gain',
    'diabetic',
    'vegetarian',
    'general',
    'athletic',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recommended Diet Plans</h1>

      {/* Category Filter */}
      <div className="mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value === 'all' ? '' : e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'all' ? '' : cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading diet plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {plan.image && (
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {plan.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{plan.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Calories:</span>
                    <span className="font-semibold">{plan.totalCalories} cal</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Meals:</h4>
                  <div className="space-y-1 text-sm">
                    {plan.meals.breakfast && (
                      <div>
                        <span className="font-medium">Breakfast:</span>{' '}
                        {plan.meals.breakfast.name}
                      </div>
                    )}
                    {plan.meals.lunch && (
                      <div>
                        <span className="font-medium">Lunch:</span> {plan.meals.lunch.name}
                      </div>
                    )}
                    {plan.meals.dinner && (
                      <div>
                        <span className="font-medium">Dinner:</span> {plan.meals.dinner.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && dietPlans.length === 0 && (
        <p className="text-center text-gray-500 py-12">No diet plans available</p>
      )}
    </div>
  );
};

export default DietPlans;

