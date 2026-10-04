import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Minus, 
  Plus, 
  Sparkles,
  Heart,
  Maximize2,
  X,
  Calculator,
  Share2
} from 'lucide-react';
import { productService } from '../services/productService';
import { buildWhatsAppUrl, CONTACT_PHONE_DISPLAY } from '../utils/whatsapp';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const { toggleWishlist, isInWishlist, showToast } = useWishlist();

  useEffect(() => {
    const fetched = productService.getProductById(id);
    setProduct(fetched);
    setAllProducts(productService.getAllProducts());
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center p-8 glass-panel rounded-3xl max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Garment Not Found</h2>
          <p className="text-slate-400 text-xs mb-4">The product ID "{id}" does not exist in our current catalogue.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
          >
            Back to All Garments
          </button>
        </div>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const [quantity, setQuantity] = useState(product.minBulkQty || 1);
  const [customNotes, setCustomNotes] = useState('');
  
  // Modals state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);

  // Size calculator state
  const [chestInput, setChestInput] = useState('');
  const [calculatedSize, setCalculatedSize] = useState('');

  const isSaved = isInWishlist(product.id);

  const whatsappUrl = buildWhatsAppUrl({
    product,
    selectedSize,
    selectedColor,
    quantity,
    message: customNotes
  });

  const handleCalculateSize = (e) => {
    e.preventDefault();
    const chest = parseFloat(chestInput);
    if (isNaN(chest) || chest <= 0) return;

    let rec = 'M';
    if (chest <= 37) rec = 'S';
    else if (chest <= 39) rec = 'M';
    else if (chest <= 41) rec = 'L';
    else if (chest <= 43) rec = 'XL';
    else rec = 'XXL';

    setCalculatedSize(rec);
    setSelectedSize(rec);
    showToast(`Recommended size ${rec} based on ${chest}" chest measurement!`, 'success');
  };

  const handleShareProduct = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Share/Wishlist */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Garments</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProduct}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-rose-400'
              }`}
              title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl glass-panel group">
              <img
                src={activeImage || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700 hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
                title="Expand view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute top-4 left-4">
                <span className="bg-slate-900/90 text-indigo-300 border border-indigo-500/20 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                  {product.category || 'Garment'}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
                <span>Garment Code: {product.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {product.rating} ({product.reviewsCount} reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Unit Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-semibold flex items-center gap-1 ${product.availability ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {product.availability ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Direct Tiruppur Dispatch</span>
              </div>
            </div>

            {/* Colors */}
            {product.colors && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Color Option: <strong className="text-indigo-300">{selectedColor}</strong>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        selectedColor === color.name
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Select Size:</span>
                <button
                  onClick={() => setShowSizeCalculator(!showSizeCalculator)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Smart Size Fit Advisor</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                      selectedSize === size
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {showSizeCalculator && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-xs space-y-3 animate-in fade-in duration-200">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-indigo-400" />
                      Chest Size Advisor
                    </span>
                    <button onClick={() => setShowSizeCalculator(false)} className="text-slate-500 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleCalculateSize} className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Chest size in inches (e.g. 40)"
                      value={chestInput}
                      onChange={(e) => setChestInput(e.target.value)}
                      className="bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 text-xs flex-1 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shrink-0"
                    >
                      Calculate
                    </button>
                  </form>

                  {calculatedSize && (
                    <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      ✓ Best Fit: <strong>Size {calculatedSize}</strong> automatically selected!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Quantity:</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Special Instructions / Customization:</label>
              <textarea
                rows={2}
                placeholder="Custom printing / delivery location details..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3 hidden sm:block">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm py-4 rounded-2xl shadow-xl transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-emerald-400/20" />
                <span>Enquire & Order on WhatsApp</span>
              </a>

              <a
                href={`tel:${CONTACT_PHONE_DISPLAY}`}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs py-3 rounded-2xl transition-all"
              >
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>Call Shop Directly ({CONTACT_PHONE_DISPLAY})</span>
              </a>
            </div>

          </div>
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage || product.images?.[0]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-slate-800"
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              More Garments in Catalogue
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
