import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  Phone, 
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
import { useStore } from '../context/StoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);
  const [chestInput, setChestInput] = useState('');
  const [calculatedSize, setCalculatedSize] = useState('');

  const { toggleWishlist, isInWishlist, showToast } = useWishlist();
  const { settings } = useStore();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    Promise.all([productService.getProductById(id), productService.getAllProducts()])
      .then(([fetched, products]) => {
        if (!active) return;
        setProduct(fetched);
        setAllProducts(products);
        setActiveImage(fetched?.images?.[0] || '');
        setSelectedSize(fetched?.sizes?.[0] || 'M');
        setSelectedColor(fetched?.colors?.[0]?.name || '');
        setQuantity(fetched?.minBulkQty || 1);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || 'Product information could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-20 flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-sand-300 rounded-3xl max-w-md shadow-xl">
          <h2 className="text-2xl font-bold text-charcoal mb-2">{loading ? 'Loading product…' : 'Garment Not Found'}</h2>
          <p className="text-charcoal-500 text-xs mb-4">{loadError || (loading ? 'Please wait while we load this product.' : `The product ID "${id}" does not exist in our current catalogue.`)}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-olive hover:bg-olive-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-olive/20"
          >
            Back to All Garments
          </button>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  const whatsappUrl = buildWhatsAppUrl({
    product,
    selectedSize,
    selectedColor,
    quantity,
    message: customNotes,
    phoneNumber: settings.whatsapp,
    businessName: settings.businessName
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
    <div className="min-h-screen bg-ivory pt-24 pb-28 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Share/Wishlist */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 hover:text-olive transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Garments</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProduct}
              className="p-2 rounded-xl bg-white hover:bg-sand-50 text-charcoal-600 hover:text-olive border border-sand-300 transition-colors shadow-2xs"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-xl border transition-all shadow-2xs ${
                isSaved
                  ? 'bg-olive text-white border-olive'
                  : 'bg-white text-charcoal-600 border-sand-300 hover:text-olive'
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
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand-100 border border-sand-300 shadow-xl group">
              <img
                src={activeImage || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md text-charcoal border border-sand-300 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-md"
                title="Expand view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute top-4 left-4">
                <span className="bg-white/95 text-olive border border-sand-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md backdrop-blur-md">
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
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white shadow-2xs ${
                      activeImage === img ? 'border-olive ring-2 ring-olive/30' : 'border-sand-300 opacity-70 hover:opacity-100'
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
              <div className="flex items-center gap-2 text-xs font-semibold text-olive mb-1">
                <span>Garment Code: {product.productCode || product.id}</span>
                {product.rating > 0 && <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
                {product.name}
              </h1>

              <p className="text-charcoal-600 text-xs sm:text-sm mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white border border-sand-300 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-400 block font-medium">Unit Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-charcoal">{product.price == null ? 'Ask for price' : `₹${product.price}`}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-charcoal-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-semibold flex items-center gap-1 ${product.availability ? 'text-olive' : 'text-rose-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {product.availability ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">Direct Tiruppur Dispatch</span>
              </div>
            </div>

            {/* Colors */}
            {product.colors && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-charcoal-700">
                  Color Option: <strong className="text-olive">{selectedColor}</strong>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        selectedColor === color.name
                          ? 'bg-sand-100 border-olive text-charcoal font-semibold ring-2 ring-olive/20'
                          : 'bg-white border-sand-300 text-charcoal-600 hover:text-charcoal'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-sand-300" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-charcoal-700">Select Size:</span>
                <button
                  onClick={() => setShowSizeCalculator(!showSizeCalculator)}
                  className="text-olive hover:underline font-semibold flex items-center gap-1"
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
                        ? 'bg-olive text-white border-olive shadow-md shadow-olive/20'
                        : 'bg-white text-charcoal border-sand-300 hover:border-sand-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {showSizeCalculator && (
                <div className="p-4 rounded-2xl bg-white border border-sand-300 text-xs space-y-3 shadow-md animate-in fade-in duration-200">
                  <div className="font-bold text-charcoal flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-olive" />
                      Chest Size Advisor
                    </span>
                    <button onClick={() => setShowSizeCalculator(false)} className="text-charcoal-400 hover:text-charcoal">✕</button>
                  </div>

                  <form onSubmit={handleCalculateSize} className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Chest size in inches (e.g. 40)"
                      value={chestInput}
                      onChange={(e) => setChestInput(e.target.value)}
                      className="bg-sand-50/80 text-charcoal p-2.5 rounded-xl border border-sand-300 text-xs flex-1 focus:outline-none focus:border-olive focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-olive hover:bg-olive-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shrink-0"
                    >
                      Calculate
                    </button>
                  </form>

                  {calculatedSize && (
                    <div className="text-xs text-olive font-semibold bg-sand-100 p-2 rounded-xl border border-sand-300">
                      ✓ Best Fit: <strong>Size {calculatedSize}</strong> automatically selected!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal-700 block">Quantity:</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-sand-300 rounded-xl p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-charcoal-500 hover:text-charcoal hover:bg-sand-50 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-charcoal-500 hover:text-charcoal hover:bg-sand-50 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 block">Special Instructions / Customization:</label>
              <textarea
                rows={2}
                placeholder="Custom printing / delivery location details..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-white text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive shadow-2xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3 hidden sm:block">
              <a
                href={whatsappUrl || '/contact'}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-olive/20 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Enquire & Order on WhatsApp</span>
              </a>

              <a
                href={`tel:${settings.phone || CONTACT_PHONE_DISPLAY}`}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-sand-50 text-charcoal border border-sand-300 font-semibold text-xs py-3 rounded-2xl transition-all shadow-2xs"
              >
                <Phone className="w-4 h-4 text-olive" />
                <span>{settings.phone ? `Call Shop Directly (${settings.phone})` : 'Phone number not provided'}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-white text-charcoal border border-sand-300 hover:bg-sand-50"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage || product.images?.[0]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-sand-300 shadow-2xl"
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-sand-300">
            <h3 className="text-2xl font-bold text-charcoal mb-8 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-olive" />
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
