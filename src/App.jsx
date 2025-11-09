import React, { useState } from 'react';
import { Search, TrendingUp, Star, ExternalLink, Calendar, Globe, Sparkles, Package, BarChart3, ShoppingCart, Key, AlertCircle, CheckCircle, Zap } from 'lucide-react';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [products, setProducts] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    aliexpress: '',
    ebay: '',
    amazon: '',
    etsy: ''
  });
  const [activeAPIs, setActiveAPIs] = useState([]);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('all');

  const demoProducts = [
    {
      id: 1,
      name: 'Smart Wireless Earbuds Pro',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      price: 29.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviews: 15234,
      orders: 45000,
      supplier: 'TechWorld Store',
      category: 'Electronics',
      trend: 'rising',
      trendScore: 92,
      source: 'Demo'
    },
    {
      id: 2,
      name: 'LED Strip Lights RGB 10M',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
      price: 15.99,
      originalPrice: 35.99,
      rating: 4.6,
      reviews: 8932,
      orders: 32000,
      supplier: 'HomeLED Official',
      category: 'Home & Garden',
      trend: 'hot',
      trendScore: 88,
      source: 'Demo'
    },
    {
      id: 3,
      name: 'Minimalist Leather Wallet',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
      price: 12.99,
      originalPrice: 29.99,
      rating: 4.7,
      reviews: 6543,
      orders: 18500,
      supplier: 'Fashion Hub',
      category: 'Fashion',
      trend: 'stable',
      trendScore: 75,
      source: 'Demo'
    },
    {
      id: 4,
      name: 'Portable Phone Tripod Stand',
      image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
      price: 18.50,
      originalPrice: 39.99,
      rating: 4.9,
      reviews: 12876,
      orders: 28000,
      supplier: 'GadgetPro Store',
      category: 'Accessories',
      trend: 'rising',
      trendScore: 85,
      source: 'Demo'
    }
  ];

  const adData = {
    totalAds: 247,
    firstSeen: '2024-08-15',
    lastSeen: '2024-11-07',
    activeAds: 18,
    topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
    avgRuntime: '45 days',
    examples: [
      {
        id: 1,
        platform: 'Facebook',
        startDate: '2024-10-01',
        status: 'Active',
        countries: ['US', 'CA', 'UK'],
        preview: 'Limited Time Offer! Get 50% OFF',
        link: 'https://facebook.com/ads/library'
      },
      {
        id: 2,
        platform: 'Instagram',
        startDate: '2024-09-15',
        status: 'Active',
        countries: ['US', 'AU'],
        preview: 'Transform Your Space Today',
        link: 'https://facebook.com/ads/library'
      }
    ]
  };

  const validateKeys = () => {
    const active = [];
    if (apiKeys.aliexpress.length > 20) active.push('AliExpress');
    if (apiKeys.ebay.length > 20) active.push('eBay');
    if (apiKeys.amazon.length > 20) active.push('Amazon');
    if (apiKeys.etsy.length > 20) active.push('Etsy');
    
    if (active.length > 0) {
      setActiveAPIs(active);
      setShowApiKeyInput(false);
      setErrorMsg('');
    } else {
      setErrorMsg('Vui lòng nhập ít nhất 1 API key hợp lệ!');
    }
  };

  // AliExpress Search
  const searchAliExpress = async (query) => {
    try {
      const response = await fetch(`https://aliexpress-datahub.p.rapidapi.com/item_search?q=${encodeURIComponent(query)}&page=1`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKeys.aliexpress,
          'X-RapidAPI-Host': 'aliexpress-datahub.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('AliExpress API error');

      const data = await response.json();
      if (data.result?.resultList) {
        return data.result.resultList.map((item, idx) => {
          const product = item.item || {};
          const sku = product.sku || {};
          const def = sku.def || {};
          const store = product.store || {};
          
          return {
            id: `ali-${product.itemId || idx}`,
            name: product.title || 'Unknown Product',
            image: product.imageUrl || 'https://via.placeholder.com/400',
            price: parseFloat(def.price || 0),
            originalPrice: parseFloat(def.originalPrice || def.price || 0),
            rating: parseFloat(product.averageStar || 0),
            reviews: parseInt(product.reviewCount || 0),
            orders: parseInt(product.sales || 0),
            supplier: store.storeName || 'AliExpress Store',
            category: product.categoryName || 'General',
            trend: Math.random() > 0.5 ? 'rising' : 'stable',
            trendScore: Math.floor(Math.random() * 30 + 70),
            productUrl: product.itemUrl || '#',
            source: 'AliExpress'
          };
        });
      }
      return [];
    } catch (err) {
      console.error('AliExpress search failed:', err);
      return [];
    }
  };

  // eBay Search
  const searchEbay = async (query) => {
    try {
      const response = await fetch(`https://ebay-search-result.p.rapidapi.com/search/${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKeys.ebay,
          'X-RapidAPI-Host': 'ebay-search-result.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('eBay API error');

      const data = await response.json();
      if (data.results) {
        return data.results.slice(0, 20).map((item, idx) => ({
          id: `ebay-${item.itemId || idx}`,
          name: item.title || 'Unknown Product',
          image: item.image || 'https://via.placeholder.com/400',
          price: parseFloat(item.price?.value || 0),
          originalPrice: parseFloat(item.price?.value || 0),
          rating: parseFloat(item.rating || 4.5),
          reviews: parseInt(item.reviews || Math.floor(Math.random() * 1000)),
          orders: parseInt(item.sold || Math.floor(Math.random() * 5000)),
          supplier: item.seller || 'eBay Seller',
          category: item.category || 'General',
          trend: Math.random() > 0.5 ? 'rising' : 'stable',
          trendScore: Math.floor(Math.random() * 30 + 70),
          productUrl: item.link || '#',
          source: 'eBay'
        }));
      }
      return [];
    } catch (err) {
      console.error('eBay search failed:', err);
      return [];
    }
  };

  // Amazon Search
  const searchAmazon = async (query) => {
    try {
      const response = await fetch(`https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKeys.amazon,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('Amazon API error');

      const data = await response.json();
      if (data.data?.products) {
        return data.data.products.slice(0, 20).map((item, idx) => ({
          id: `amz-${item.asin || idx}`,
          name: item.product_title || 'Unknown Product',
          image: item.product_photo || 'https://via.placeholder.com/400',
          price: parseFloat(item.product_price || 0),
          originalPrice: parseFloat(item.product_original_price || item.product_price || 0),
          rating: parseFloat(item.product_star_rating || 0),
          reviews: parseInt(item.product_num_ratings || 0),
          orders: Math.floor(Math.random() * 10000),
          supplier: 'Amazon',
          category: item.product_category || 'General',
          trend: Math.random() > 0.5 ? 'rising' : 'stable',
          trendScore: Math.floor(Math.random() * 30 + 70),
          productUrl: item.product_url || '#',
          source: 'Amazon'
        }));
      }
      return [];
    } catch (err) {
      console.error('Amazon search failed:', err);
      return [];
    }
  };

  // Etsy Search
  const searchEtsy = async (query) => {
    try {
      const response = await fetch(`https://etsy2.p.rapidapi.com/search?query=${encodeURIComponent(query)}&limit=20`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKeys.etsy,
          'X-RapidAPI-Host': 'etsy2.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('Etsy API error');

      const data = await response.json();
      if (data.results) {
        return data.results.map((item, idx) => ({
          id: `etsy-${item.listing_id || idx}`,
          name: item.title || 'Unknown Product',
          image: item.image_url || 'https://via.placeholder.com/400',
          price: parseFloat(item.price || 0),
          originalPrice: parseFloat(item.price || 0),
          rating: parseFloat(item.rating || 4.8),
          reviews: parseInt(item.num_favorers || 0),
          orders: Math.floor(Math.random() * 1000),
          supplier: item.shop_name || 'Etsy Shop',
          category: 'Handmade',
          trend: 'stable',
          trendScore: Math.floor(Math.random() * 20 + 75),
          productUrl: item.url || '#',
          source: 'Etsy'
        }));
      }
      return [];
    } catch (err) {
      console.error('Etsy search failed:', err);
      return [];
    }
  };

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      setErrorMsg('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    if (activeAPIs.length === 0) {
      setTimeout(() => {
        setProducts(demoProducts);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const searchPromises = [];
      
      if (activeAPIs.includes('AliExpress') && (selectedAPI === 'all' || selectedAPI === 'aliexpress')) {
        searchPromises.push(searchAliExpress(searchQuery));
      }
      if (activeAPIs.includes('eBay') && (selectedAPI === 'all' || selectedAPI === 'ebay')) {
        searchPromises.push(searchEbay(searchQuery));
      }
      if (activeAPIs.includes('Amazon') && (selectedAPI === 'all' || selectedAPI === 'amazon')) {
        searchPromises.push(searchAmazon(searchQuery));
      }
      if (activeAPIs.includes('Etsy') && (selectedAPI === 'all' || selectedAPI === 'etsy')) {
        searchPromises.push(searchEtsy(searchQuery));
      }

      const results = await Promise.allSettled(searchPromises);
      const allProducts = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      if (allProducts.length > 0) {
        setProducts(allProducts);
        setErrorMsg('');
      } else {
        throw new Error('Không tìm thấy sản phẩm nào từ các API. Hiển thị demo data.');
      }
    } catch (err) {
      setErrorMsg(err.message);
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!selectedProduct) return;
    
    setGeneratingAI(true);
    
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Generate a compelling product description for: ${selectedProduct.name}. Category: ${selectedProduct.category}. Price: $${selectedProduct.price}. Make it 150-200 words, SEO-optimized, with benefits and call-to-action. No markdown.`
          }]
        })
      });

      const data = await res.json();
      const text = data.content.filter(i => i.type === 'text').map(i => i.text).join('\n');
      setAiDescription(text);
    } catch (err) {
      setAiDescription('Không thể tạo mô tả AI. Vui lòng thử lại sau.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const getTrendColor = (trend) => {
    if (trend === 'hot') return 'text-red-500';
    if (trend === 'rising') return 'text-green-500';
    return 'text-gray-500';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'hot') return '🔥';
    if (trend === 'rising') return '📈';
    return '➡️';
  };

  const getSourceBadgeColor = (source) => {
    switch(source) {
      case 'AliExpress': return 'bg-red-100 text-red-700';
      case 'eBay': return 'bg-yellow-100 text-yellow-700';
      case 'Amazon': return 'bg-orange-100 text-orange-700';
      case 'Etsy': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const displayProducts = products.length > 0 ? products : demoProducts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Multi-API Setup</h2>
                <p className="text-sm text-gray-600">Kết nối nhiều marketplace để tìm sản phẩm tốt nhất!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold mb-2">🚀 Hỗ trợ 4 nền tảng:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>✅ <strong>AliExpress</strong> - Giá tốt, dropshipping</div>
                <div>✅ <strong>eBay</strong> - Đa dạng, auction</div>
                <div>✅ <strong>Amazon</strong> - Chất lượng cao</div>
                <div>✅ <strong>Etsy</strong> - Handmade, unique</div>
              </div>
              <p className="text-xs text-gray-600 mt-2">💡 Nhập ít nhất 1 API key để bắt đầu. Càng nhiều càng tốt!</p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  🔴 AliExpress (RapidAPI - "AliExpress Datahub")
                </label>
                <input
                  type="text"
                  value={apiKeys.aliexpress}
                  onChange={(e) => setApiKeys({...apiKeys, aliexpress: e.target.value})}
                  placeholder="Optional - Paste RapidAPI key..."
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  🟡 eBay (RapidAPI - "eBay Search Result")
                </label>
                <input
                  type="text"
                  value={apiKeys.ebay}
                  onChange={(e) => setApiKeys({...apiKeys, ebay: e.target.value})}
                  placeholder="Optional - Paste RapidAPI key..."
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  🟠 Amazon (RapidAPI - "Real-Time Amazon Data")
                </label>
                <input
                  type="text"
                  value={apiKeys.amazon}
                  onChange={(e) => setApiKeys({...apiKeys, amazon: e.target.value})}
                  placeholder="Optional - Paste RapidAPI key..."
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  🟣 Etsy (RapidAPI - "Etsy")
                </label>
                <input
                  type="text"
                  value={apiKeys.etsy}
                  onChange={(e) => setApiKeys({...apiKeys, etsy: e.target.value})}
                  placeholder="Optional - Paste RapidAPI key..."
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={validateKeys}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg"
              >
                Connect APIs
              </button>
              <button
                onClick={() => {
                  setShowApiKeyInput(false);
                  setProducts(demoProducts);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
              >
                Skip (Demo)
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              📚 Hướng dẫn lấy API key: <a href="https://rapidapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">RapidAPI.com</a>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Product Intelligence Hub</h1>
                <p className="text-gray-600">Multi-platform product research & analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {activeAPIs.length > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{activeAPIs.length} API{activeAPIs.length > 1 ? 's' : ''} Connected</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowApiKeyInput(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100"
                >
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Demo Mode</span>
                </button>
              )}
              
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
              >
                Settings
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={activeAPIs.length > 0 ? `Search ${activeAPIs.join(', ')}...` : "Search demo products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            <button
              onClick={searchProducts}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {activeAPIs.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedAPI('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAPI === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All ({activeAPIs.length})
              </button>
              {activeAPIs.includes('AliExpress') && (
                <button
                  onClick={() => setSelectedAPI('aliexpress')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAPI === 'aliexpress' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                >
                  AliExpress
                </button>
              )}
              {activeAPIs.includes('eBay') && (
                <button
                  onClick={() => setSelectedAPI('ebay')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAPI === 'ebay' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
                >
                  eBay
                </button>
              )}
              {activeAPIs.includes('Amazon') && (
                <button
                  onClick={() => setSelectedAPI('amazon')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAPI === 'amazon' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
                >
                  Amazon
                </button>
              )}
              {activeAPIs.includes('Etsy') && (
                <button
                  onClick={() => setSelectedAPI('etsy')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAPI === 'etsy' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                >
                  Etsy
                </button>
              )}
            </div>
          )}

          {errorMsg && !loading && (
            <div className="mt-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">Thông báo</p>
                  <p className="text-sm text-orange-700">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!selectedProduct ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {activeAPIs.length > 0 && products.length > 0 ? 'Search Results' : 'Trending Products'}
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {displayProducts.length} Products
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setAiDescription('');
                  }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-200 overflow-hidden group"
                >
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSourceBadgeColor(p.source)}`}>
                        {p.source}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <span className="text-lg">{getTrendIcon(p.trend)}</span>
                      <span className={`text-sm font-bold ${getTrendColor(p.trend)}`}>{p.trendScore}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">{p.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{p.rating}</span>
                      <span className="text-gray-500 text-sm">({p.reviews.toLocaleString()})</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold">${p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-sm text-gray-400 line-through">${p.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-3">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="font-medium">{p.orders.toLocaleString()} orders</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                ← Back to Search
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search other products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedProduct(null);
                      searchProducts();
                    }
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    searchProducts();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSourceBadgeColor(selectedProduct.source)}`}>
                      {selectedProduct.source}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{selectedProduct.category}</span>
                    <span className="text-2xl">{getTrendIcon(selectedProduct.trend)}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-xl mb-4" />

                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{selectedProduct.rating}</span>
                    <span className="text-gray-600">({selectedProduct.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold">${selectedProduct.price}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-xl text-gray-400 line-through">${selectedProduct.originalPrice}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <div className="text-sm text-gray-600">Orders</div>
                      <div className="text-2xl font-bold text-blue-600">{selectedProduct.orders.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                      <div className="text-sm text-gray-600">Trend</div>
                      <div className="text-2xl font-bold text-green-600">{selectedProduct.trendScore}/100</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Package className="w-5 h-5" />
                    <span>{selectedProduct.supplier}</span>
                  </div>

                  {selectedProduct.productUrl && selectedProduct.productUrl !== '#' && (
                    <a
                      href={selectedProduct.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      View on {selectedProduct.source} →
                    </a>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-pink-600" />
                    <h3 className="text-xl font-bold">Ad Intelligence</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600">Total Ads</div>
                      <div className="text-3xl font-bold text-blue-600">{adData.totalAds}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600">Active</div>
                      <div className="text-3xl font-bold text-green-600">{adData.activeAds}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600">Runtime</div>
                      <div className="text-2xl font-bold text-purple-600">{adData.avgRuntime}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {adData.examples.map((ad) => (
                      <div key={ad.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{ad.platform}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{ad.status}</span>
                            </div>
                            <div className="text-sm text-gray-600">Started: {ad.startDate}</div>
                          </div>
                          <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                        <p className="text-gray-700">{ad.preview}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://www.facebook.com/ads/library"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View All Ads in Facebook Ad Library →
                  </a>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white sticky top-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6" />
                    <h3 className="text-xl font-bold">AI Description</h3>
                  </div>

                  {!aiDescription ? (
                    <div className="text-center py-8">
                      <p className="mb-6 text-purple-100">Generate SEO-optimized descriptions with Claude AI</p>
                      <button
                        onClick={generateDescription}
                        disabled={generatingAI}
                        className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl disabled:opacity-50"
                      >
                        {generatingAI ? 'Generating...' : 'Generate Description'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4 max-h-96 overflow-y-auto">
                        <p className="text-white whitespace-pre-wrap leading-relaxed">{aiDescription}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiDescription);
                            alert('Copied!');
                          }}
                          className="flex-1 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setAiDescription('')}
                          className="flex-1 py-2 bg-white text-purple-600 rounded-lg font-medium"
                        >
                          New
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h4 className="font-semibold mb-3">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-100">Profit Margin:</span>
                        <span className="font-bold">
                          {selectedProduct.originalPrice > selectedProduct.price 
                            ? `${Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-100">Source:</span>
                        <span className="font-bold">{selectedProduct.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-100">Competition:</span>
                        <span className="font-bold">Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;