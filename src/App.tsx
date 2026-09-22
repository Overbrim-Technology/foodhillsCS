import React, { useState, useEffect, useMemo } from 'react';
import { getImageUrl } from './catalog/images';
import { loadCatalog } from './catalog/store';
import { formatPrice } from './formatters';
import type { CartItem, Product } from './types';
import { 
  ShoppingCart, 
  Leaf, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Search,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  Info,
  Store,
} from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  
  // Filters & Cart State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modals & Sliders
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null); // 'checkout' | 'success'

  const categories = useMemo(() => {
    const productCategories = products
      .map(product => product.category)
      .filter(Boolean);
    return ['All', ...Array.from(new Set(productCategories))];
  }, [products]);

  const loadStoreData = async () => {
    setIsLoading(true);
    setUsingMock(false);
    const catalog = await loadCatalog('/api/catalog');
    setProducts(catalog.products);
    setUsingMock(catalog.usingMock);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'All' || 
        product.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const generateWhatsAppMessage = () => {
    let text = `*New Order from FoodHills Camp Shop*\n\n`;
    cart.forEach((item, i) => {
      text += `${i + 1}. *${item.name}* x ${item.quantity}\n   Price: ${formatPrice(item.price * item.quantity)} (${item.unit || 'unit'})\n`;
    });
    text += `\n*Total Order Amount:* ${formatPrice(cartTotal)}`;
    text += `\n\nPlease confirm availability and delivery to camp.`;
    return encodeURIComponent(text);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans">
      
      {/* HEADER NAVBAR */}
      {}
      <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-emerald-100 hover:bg-emerald-700 transition"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 p-2 rounded-xl shadow-inner text-amber-300">
                  <Leaf size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-wide leading-tight">
                    FoodHills <span className="font-light text-emerald-200">Camp Shop</span>
                  </h1>
                  <p className="text-[10px] text-emerald-200 hidden sm:block tracking-wider uppercase">Direct Farm Produce</p>
                </div>
              </div>
            </div>

            {/* Search Input - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
              <input 
                type="text" 
                placeholder="Search cow meat, rice, tomatoes, garri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-emerald-950/40 border border-emerald-600/50 rounded-full text-sm text-white placeholder-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-emerald-900 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sheet Integration Settings Button */}
              <button 
                onClick={() => window.open('/admin', '_blank', 'noopener,noreferrer')}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
                title="Open admin portal"
              >
                <span className="hidden sm:inline">Admin</span>
              </button>

              {/* Cart Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline text-sm">Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-emerald-900 text-amber-300 text-xs px-2 py-0.5 rounded-full font-black border border-amber-400">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Input - Mobile Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" size={16} />
              <input 
                type="text" 
                placeholder="Search store items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-emerald-950/40 border border-emerald-600/50 rounded-lg text-sm text-white placeholder-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER & STATUS */}
      {}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-emerald-700/50 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2">
              <Store size={14} /> Camp-Shop Vendor Portal Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Fresh Food Produce & Camp Supplies
            </h2>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-2xl">
              Order livestock, fresh vegetables, grains, eggs, and tubers directly supplied to FoodHills camps at official wholesale rates.
            </p>
          </div>

          {usingMock && (
            <div className="bg-amber-500/10 border border-amber-400/30 p-3 rounded-xl flex items-start gap-2 max-w-sm text-xs text-amber-200">
              <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div><strong className="text-amber-300">Demo Mode Active:</strong> The live catalog is not configured yet. An administrator can add vendor sources through the admin portal.</div>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* CATEGORY NAV TABS */}
        {}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 font-medium shrink-0 hidden sm:block">
            Showing <span className="font-bold text-stone-800">{filteredProducts.length}</span> items
          </div>
        </div>

        {/* PRODUCT GRID */}
        {}
        {isLoading ? (
          <div className="py-20 text-center text-emerald-800">
            <RefreshCw className="animate-spin mx-auto mb-3" size={32} />
            <p className="font-semibold text-stone-600">Syncing FoodHills inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-md mx-auto my-8 shadow-sm">
            <AlertCircle className="mx-auto text-amber-500 mb-3" size={40} />
            <h3 className="text-lg font-bold text-stone-800">No produce found</h3>
            <p className="text-stone-500 text-sm mt-1">
              We couldn't find anything matching "{searchQuery}" in {activeCategory}.
            </p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const inCart = cart.find(item => item.id === product.id);
              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img 
                      src={getImageUrl(product.image_filename, product.name)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback placeholder on error
                        e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/0f766e?text=${encodeURIComponent(product.name)}`;
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {product.name}
                      </h3>
                      {product.unit && (
                        <p className="text-xs text-stone-400 mt-0.5">Unit: {product.unit}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block leading-none">Price</span>
                        <span className="text-lg font-black text-emerald-800">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg shadow-xs transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-extrabold text-emerald-950 px-1.5">
                            {inCart.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs hover:shadow transition flex items-center gap-1.5 active:scale-95"
                        >
                          <Plus size={16} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-500" size={18} />
            <span className="font-bold text-stone-200">FoodHills Camp Shop</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-stone-500 text-center md:text-right">
            Feast Like Royalty
          </p>
        </div>
      </footer>

      {/* SHOPPING CART SLIDE-OVER */}
      {}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <ShoppingCart size={22} className="text-amber-300" />
                <h2 className="font-bold text-lg">Your Camp Basket</h2>
                <span className="bg-emerald-900 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartItemCount} items
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <ShoppingCart size={48} className="mx-auto text-stone-300 mb-3" />
                  <p className="text-stone-600 font-semibold">Your basket is empty</p>
                  <p className="text-xs text-stone-400 mt-1">Add livestock, grains, or vegetables to proceed.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-stone-50 border border-stone-200 p-3 rounded-xl gap-3">
                    <img 
                      src={getImageUrl(item.image_filename, item.name)}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg shrink-0 bg-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-stone-800 truncate">{item.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-stone-600 hover:text-emerald-800"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-stone-600 hover:text-emerald-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="flex justify-between items-center text-stone-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-emerald-900 border-t border-stone-200 pt-2">
                  <span>Total Order</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <a 
                  href={`https://wa.me/?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <PhoneCall size={18} /> Place Order via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}