import { useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const Calculator = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
      setQuantities({ ...quantities, [product._id]: 100 }); // Default 100g
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const updateQuantity = (productId, quantity) => {
    setQuantities({ ...quantities, [productId]: parseFloat(quantity) || 0 });
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    selectedProducts.forEach((product) => {
      const quantity = quantities[product._id] || 0;
      const multiplier = quantity / 100; // Convert to per 100g basis

      totalCalories += (product.nutrition?.calories || 0) * multiplier;
      totalProtein += (product.nutrition?.protein || 0) * multiplier;
      totalCarbs += (product.nutrition?.carbs || 0) * multiplier;
      totalFat += (product.nutrition?.fat || 0) * multiplier;
      totalFiber += (product.nutrition?.fiber || 0) * multiplier;
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
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Products</h2>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {product.nutrition?.calories || 0} cal per 100g
                    </p>
                  </div>
                  <button
                    onClick={() => addProduct(product)}
                    disabled={selectedProducts.find((p) => p._id === product._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedProducts.find((p) => p._id === product._id)
                      ? 'Added'
                      : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Selected Products</h2>
            {selectedProducts.length === 0 ? (
              <p className="text-gray-500">No products selected</p>
            ) : (
              <div className="space-y-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 border rounded"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Quantity (g)</label>
                        <input
                          type="number"
                          value={quantities[product._id] || 0}
                          onChange={(e) => updateQuantity(product._id, e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded ml-2"
                          min="0"
                        />
                      </div>
                      <button
                        onClick={() => removeProduct(product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
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

