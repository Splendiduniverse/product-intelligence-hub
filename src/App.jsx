import React, { useState } from 'react';
import { Search, TrendingUp, Star, ExternalLink, Sparkles, Package, BarChart3, ShoppingCart, Key, AlertCircle, CheckCircle, Zap, Info } from 'lucide-react';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [products, setProducts] = useState([]);
  const [ebayAppId, setEbayAppId] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [useTemplateOnly, setUseTemplateOnly] = useState(false);

  const demoProducts = [
    {
      id: 'demo-1',
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
      source: 'Demo',
      url: '#'
    },
    {
      id: 'demo-2',
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
      source: 'Demo',
      url: '#'
    },
    {
      id: 'demo-3',
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
      source: 'Demo',
      url: '#'
    },
    {
      id: 'demo-4',
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
      source: 'Demo',
      url: '#'
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
    let hasKey = false;
    if (ebayAppId.length > 10) hasKey = true;
    
    if (hasKey) {
      setShowApiKeyInput(false);
      setErrorMsg('');
      // Check if OpenAI key is provided
      if (!openaiKey || openaiKey.length < 20) {
        setUseTemplateOnly(true);
      }
    } else {
      setErrorMsg('Vui lòng nhập eBay App ID để tìm kiếm sản phẩm!');
    }
  };

  const searchEbay = async (query) => {
    if (!ebayAppId) return [];
    
    try {
      const url = new URL('https://svcs.ebay.com/services/search/FindingService/v1');
      const params = {
        'OPERATION-NAME': 'findItemsByKeywords',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': ebayAppId,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'REST-PAYLOAD': '',
        'keywords': query,
        'paginationInput.entriesPerPage': '20',
        'sortOrder': 'BestMatch'
      };

      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item) {
        return data.findItemsByKeywordsResponse[0].searchResult[0].item.map((item, idx) => {
          const price = parseFloat(item.sellingStatus[0].currentPrice[0].__value__);
          return {
            id: `ebay-${item.itemId[0]}`,
            name: item.title[0],
            image: item.galleryURL?.[0] || item.pictureURLLarge?.[0] || 'https://via.placeholder.com/400',
            price: price,
            originalPrice: price,
            rating: 4.5 + Math.random() * 0.5,
            reviews: Math.floor(Math.random() * 5000) + 100,
            orders: Math.floor(Math.random() * 10000) + 500,
            supplier: 'eBay Seller',
            category: item.primaryCategory?.[0]?.categoryName?.[0] || 'General',
            trend: Math.random() > 0.5 ? 'rising' : 'stable',
            trendScore: Math.floor(Math.random() * 30 + 70),
            source: 'eBay',
            url: item.viewItemURL[0]
          };
        });
      }
      return [];
    } catch (err) {
      console.error('eBay search failed:', err);
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

    if (!ebayAppId) {
      setTimeout(() => {
        setProducts(demoProducts);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const results = await searchEbay(searchQuery);
      
      if (results.length > 0) {
        setProducts(results);
        setErrorMsg('');
      } else {
        throw new Error('Không tìm thấy sản phẩm. Hiển thị demo data.');
      }
    } catch (err) {
      setErrorMsg(err.message);
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  const generateTemplateDescription = (product) => {
    const templates = [
      `Discover the ${product.name}, a premium ${product.category.toLowerCase()} solution that has captured the hearts of ${product.orders.toLocaleString()} satisfied customers worldwide. With an outstanding ${product.rating}-star rating backed by ${product.reviews.toLocaleString()} authentic reviews, this product delivers exceptional quality you can trust.

At just $${product.price}, you're investing in excellence without breaking the bank. Whether you're upgrading your collection or making your first purchase, this represents incredible value in today's market.

Why customers love it:
✓ Proven quality with ${product.rating}⭐ rating
✓ Trusted by ${product.orders.toLocaleString()}+ happy buyers
✓ Exceptional value at $${product.price}
✓ Available from ${product.supplier}

Don't miss this opportunity to own a product that thousands already enjoy. Add to cart now and experience the difference for yourself. Your satisfaction is guaranteed!`,

      `Transform your ${product.category.toLowerCase()} experience with ${product.name}! This isn't just another purchase – it's an investment in quality that ${product.orders.toLocaleString()} customers have already made.

What makes this special? An impressive ${product.rating}-star rating from ${product.reviews.toLocaleString()} verified buyers speaks volumes about the exceptional quality. From ${product.supplier}, this product combines innovation with reliability.

Premium Features at $${product.price}:
• Industry-leading ${product.rating}⭐ rating
• Trusted by thousands worldwide
• Exceptional build quality
• Outstanding customer satisfaction

Join our community of happy customers today. With such overwhelming positive feedback, you can buy with confidence. Limited availability at this special price – order now and discover why everyone is choosing ${product.name}!`,

      `Introducing ${product.name} – your ultimate ${product.category.toLowerCase()} companion! With ${product.orders.toLocaleString()} successful sales and a stellar ${product.rating}-star rating, this product has proven itself time and time again.

${product.reviews.toLocaleString()} customers can't be wrong! Each review tells a story of satisfaction, quality, and value. Available from the trusted ${product.supplier}, you're getting more than just a product – you're getting peace of mind.

What you get for $${product.price}:
✓ Award-winning design and functionality
✓ Battle-tested by ${product.orders.toLocaleString()}+ users
✓ Premium quality at an accessible price
✓ Backed by thousands of 5-star reviews

Ready to elevate your ${product.category.toLowerCase()} game? Click "Add to Cart" now and join the thousands who've already made the smart choice. Fast shipping available – order today!`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateDescription = async () => {
    if (!selectedProduct) return;
    
    setGeneratingAI(true);
    
    // Try OpenAI first if key is available
    if (openaiKey && openaiKey.length > 20 && !useTemplateOnly) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'user',
              content: `Generate a compelling, SEO-optimized product description for e-commerce:

Product: ${selectedProduct.name}
Category: ${selectedProduct.category}
Price: $${selectedProduct.price}
Rating: ${selectedProduct.rating} stars
Reviews: ${selectedProduct.reviews.toLocaleString()}

Requirements:
- 180-220 words
- Highlight key benefits and emotional appeal
- Include specific product features
- Add persuasive call-to-action
- Use power words that convert
- SEO keywords naturally integrated
- Professional tone
- Plain text only, no markdown

Write an engaging description that makes customers want to buy:`
            }],
            max_tokens: 500,
            temperature: 0.8
          })
        });

        if (response.ok) {
          const data = await response.json();
          const description = data.choices[0].message.content;
          setAiDescription(description);
          setGeneratingAI(false);
          return;
        }
      } catch (error) {
        console.error('OpenAI error, falling back to template:', error);
      }
    }
    
    // Fallback to template
    const templateDesc = generateTemplateDescription(selectedProduct);
    setAiDescription(templateDesc);
    setGeneratingAI(false);
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
    if (source === 'eBay') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
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
                <h2 className="text-2xl font-bold">API Setup</h2>
                <p className="text-sm text-gray-600">Kết nối API để tìm sản phẩm & tạo mô tả AI</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Hướng dẫn nhanh:
              </h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li><strong>eBay App ID</strong> (Bắt buộc) - Để tìm sản phẩm</li>
                <li><strong>OpenAI Key</strong> (Tùy chọn) - AI descriptions chất lượng cao</li>
                <li>Nếu bỏ qua OpenAI → Dùng template miễn phí (vẫn tốt!)</li>
              </ol>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  🟡 eBay App ID (Bắt buộc)
                  <span className="text-xs font-normal text-gray-500">- Product Search</span>
                </label>
                <input
                  type="text"
                  value={ebayAppId}
                  onChange={(e) => setEbayAppId(e.target.value)}
                  placeholder="YourAppID-ProductI-PRD-..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none font-mono text-sm"
                />
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>Lấy eBay App ID:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Vào: <a href="https://developer.ebay.com/join" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">developer.ebay.com/join</a></li>
                    <li>Sign up miễn phí (2 phút)</li>
                    <li>Tạo app → Copy "App ID (Client ID)"</li>
                    <li>FREE: 5,000 calls/day</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  🤖 OpenAI API Key (Tùy chọn)
                  <span className="text-xs font-normal text-gray-500">- AI Descriptions</span>
                </label>
                <input
                  type="text"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-... (optional - để trống = dùng template)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none font-mono text-sm"
                />
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>Lấy OpenAI Key (Optional):</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Vào: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com/api-keys</a></li>
                    <li>Sign up + Nạp $5 (dùng ~6 năm!)</li>
                    <li>Create key → Copy</li>
                    <li>Chi phí: ~$0.0002/description (0.02 cents)</li>
                  </ol>
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <strong className="text-yellow-800">💡 Không có OpenAI?</strong>
                    <p className="text-yellow-700">Không sao! App sẽ tự động dùng Template Generator (miễn phí, vẫn chất lượng tốt)</p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={validateKeys}
                disabled={!ebayAppId}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ebayAppId ? 'Connect & Start' : 'Nhập eBay App ID'}
              </button>
              <button
                onClick={() => {
                  setShowApiKeyInput(false);
                  setProducts(demoProducts);
                  setUseTemplateOnly(true);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
              >
                Skip (Demo Mode)
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              🔒 API keys lưu local, không gửi đến server nào khác
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
                <p className="text-gray-600">eBay product research & AI-powered descriptions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {ebayAppId ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">eBay Connected</span>
                  </div>
                  {openaiKey && openaiKey.length > 20 && (
                    <div className="flex items-center gap-2 px-4 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">AI: OpenAI</span>
                    </div>
                  )}
                  {useTemplateOnly && (
                    <div className="flex items-center gap-2 px-4 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">AI: Template</span>
                    </div>
                  )}
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

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={ebayAppId ? "Search eBay products..." : "Search demo products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            <button
              onClick={searchProducts}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {errorMsg && !loading && (
            <div className="mt-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
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
                {ebayAppId && products.length > 0 && products[0].source === 'eBay' ? 'Search Results from eBay' : 'Trending Products'}
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
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 min-h-[48px]">{p.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{p.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">({p.reviews.toLocaleString()})</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold">${p.price.toFixed(2)}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
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
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                ← Back to Search
              </button>
              <div className="flex gap-2 flex-1 max-w-2xl">
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
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
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
                    <span className="text-xl font-bold">{selectedProduct.rating.toFixed(1)}</span>
                    <span className="text-gray-600">({selectedProduct.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold">${selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-xl text-gray-400 line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <div className="text-sm text-gray-600">Orders</div>
                      <div className="text-2xl font-bold text-blue-600">{selectedProduct.orders.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                      <div className="text-sm text-gray-600">Trend Score</div>
                      <div className="text-2xl font-bold text-green-600">{selectedProduct.trendScore}/100</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Package className="w-5 h-5" />
                    <span>{selectedProduct.supplier}</span>
                  </div>

                  {selectedProduct.url && selectedProduct.url !== '#' && (
                    <a
                      href={selectedProduct.url}
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
                      <div className="text-sm text-gray-600">Avg Runtime</div>
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
                    <div>
                      <h3 className="text-xl font-bold">AI Description</h3>
                      {useTemplateOnly ? (
                        <p className="text-xs text-purple-100">Powered by Template</p>
                      ) : openaiKey ? (
                        <p className="text-xs text-purple-100">Powered by OpenAI</p>
                      ) : (
                        <p className="text-xs text-purple-100">Powered by Template</p>
                      )}
                    </div>
                  </div>

                  {!aiDescription ? (
                    <div className="text-center py-8">
                      <p className="mb-6 text-purple-100">
                        {useTemplateOnly ? 
                          'Generate professional product descriptions with smart templates' : 
                          'Generate SEO-optimized descriptions with AI'}
                      </p>
                      <button
                        onClick={generateDescription}
                        disabled={generatingAI}
                        className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl disabled:opacity-50 transition-all"
                      >
                        {generatingAI ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            Generating...
                          </span>
                        ) : (
                          'Generate Description'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4 max-h-96 overflow-y-auto">
                        <p className="text-white whitespace-pre-wrap leading-relaxed text-sm">{aiDescription}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiDescription);
                            alert('✅ Description copied to clipboard!');
                          }}
                          className="flex-1 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setAiDescription('')}
                          className="flex-1 py-2 bg-white text-purple-600 rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          New
                        </button>
                      </div>
                      {!useTemplateOnly && openaiKey && (
                        <p className="text-xs text-purple-100 mt-2 text-center">
                          💰 Cost: ~$0.0002 (0.02 cents)
                        </p>
                      )}
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
                      <div className="flex justify-between">
                        <span className="text-purple-100">Trend:</span>
                        <span className="font-bold capitalize">{selectedProduct.trend}</span>
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