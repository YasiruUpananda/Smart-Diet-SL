import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: quantity,
        })
      );
      toast.success('Product added to cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-600 hover:text-green-700"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-green-600 font-bold mb-4">
            Rs. {product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.nutrition && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Nutrition Information (per 100g)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>{' '}
                  <span className="font-semibold">{product.nutrition.calories} cal</span>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>{' '}
                  <span className="font-semibold">{product.nutrition.protein}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Carbs:</span>{' '}
                  <span className="font-semibold">{product.nutrition.carbs}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Fat:</span>{' '}
                  <span className="font-semibold">{product.nutrition.fat}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Fiber:</span>{' '}
                  <span className="font-semibold">{product.nutrition.fiber}g</span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

