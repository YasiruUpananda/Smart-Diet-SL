import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateAdminProduct, getAdminProducts } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { products } = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vegetables',
    stock: '',
    isAvailable: true,
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
    },
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    'vegetables',
    'fruits',
    'grains',
    'proteins',
    'dairy',
    'spices',
    'other',
  ];

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setFormData({
        name: foundProduct.name || '',
        description: foundProduct.description || '',
        price: foundProduct.price || '',
        category: foundProduct.category || 'vegetables',
        stock: foundProduct.stock || '',
        isAvailable: foundProduct.isAvailable !== undefined ? foundProduct.isAvailable : true,
        nutrition: {
          calories: foundProduct.nutrition?.calories || '',
          protein: foundProduct.nutrition?.protein || '',
          carbs: foundProduct.nutrition?.carbs || '',
          fat: foundProduct.nutrition?.fat || '',
          fiber: foundProduct.nutrition?.fiber || '',
        },
      });
      setImagePreview(foundProduct.image || '');
    }
  }, [products, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setFormData({
        ...formData,
        nutrition: {
          ...formData.nutrition,
          [nutritionField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleImageChange = (file, preview) => {
    setImage(file);
    setImagePreview(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        nutrition: {
          calories: parseFloat(formData.nutrition.calories) || 0,
          protein: parseFloat(formData.nutrition.protein) || 0,
          carbs: parseFloat(formData.nutrition.carbs) || 0,
          fat: parseFloat(formData.nutrition.fat) || 0,
          fiber: parseFloat(formData.nutrition.fiber) || 0,
        },
      };

      if (image) {
        productData.image = image;
      } else if (imagePreview && !image) {
        productData.image = imagePreview;
      }

      await dispatch(updateAdminProduct({ id, productData })).unwrap();
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (Rs.) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Available */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Product Available
            </label>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image *
            </label>
            <ImageUpload
              onImageChange={handleImageChange}
              preview={imagePreview}
            />
          </div>

          {/* Nutrition Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Nutrition Information (per 100g)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  name="nutrition.calories"
                  value={formData.nutrition.calories}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein (g)
                </label>
                <input
                  type="number"
                  name="nutrition.protein"
                  value={formData.nutrition.protein}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  name="nutrition.carbs"
                  value={formData.nutrition.carbs}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat (g)
                </label>
                <input
                  type="number"
                  name="nutrition.fat"
                  value={formData.nutrition.fat}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiber (g)
                </label>
                <input
                  type="number"
                  name="nutrition.fiber"
                  value={formData.nutrition.fiber}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;