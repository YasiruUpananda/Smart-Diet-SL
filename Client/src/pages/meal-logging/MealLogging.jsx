import { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const MealLogging = () => {
  const { language, t } = useLanguage();
  const [mealType, setMealType] = useState('breakfast');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [recognizedItems, setRecognizedItems] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Simulate image recognition (in production, this would call an AI service)
      simulateImageRecognition(file);
    }
  };

  const simulateImageRecognition = (file) => {
    // This is a placeholder - in production, you'd call an image recognition API
    setTimeout(() => {
      const mockRecognitions = [
        { name: 'Rice & Fish Curry', confidence: 0.85, estimatedPortion: 'Medium portion' },
        { name: 'Dhal', confidence: 0.75, estimatedPortion: '1 cup' },
      ];
      setRecognizedItems(mockRecognitions);
      toast.success('Meal recognized! Please verify and add any missing items.');
    }, 1000);
  };

  const addManualItem = () => {
    setManualItems([
      ...manualItems,
      {
        name: '',
        portion: '',
        calories: 0,
      },
    ]);
  };

  const updateManualItem = (index, field, value) => {
    const updated = [...manualItems];
    updated[index][field] = value;
    setManualItems(updated);
  };

  const removeManualItem = (index) => {
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image && manualItems.length === 0) {
      toast.error('Please add an image or manual items');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('mealType', mealType);
      formData.append('recognizedItems', JSON.stringify(recognizedItems));
      formData.append('manualItems', JSON.stringify(manualItems));
      formData.append('notes', notes);

      await api.post('/meal-logs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Meal logged successfully!');
      
      // Reset form
      setImage(null);
      setImagePreview(null);
      setImageUrl(null);
      setRecognizedItems([]);
      setManualItems([]);
      setNotes('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('logMeal')}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Meal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('takePhoto')}
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setImageUrl(null);
                    setRecognizedItems([]);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}

            {/* Recognized Items */}
            {recognizedItems.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Recognized Items:</h3>
                <ul className="space-y-2">
                  {recognizedItems.map((item, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">
                        ({item.estimatedPortion}, {Math.round(item.confidence * 100)}% confidence)
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Please verify and add any missing items below
                </p>
              </div>
            )}
          </div>

          {/* Manual Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Items Manually
              </label>
              <button
                type="button"
                onClick={addManualItem}
                className="text-sm text-green-600 hover:text-green-700"
              >
                + Add Item
              </button>
            </div>
            {manualItems.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={item.name}
                  onChange={(e) => updateManualItem(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Portion"
                  value={item.portion}
                  onChange={(e) => updateManualItem(index, 'portion', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={item.calories}
                  onChange={(e) => updateManualItem(index, 'calories', parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeManualItem(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Any additional notes about your meal..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging...' : 'Log Meal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealLogging;

