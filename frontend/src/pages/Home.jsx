import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaRobot, FaShoppingBag } from "react-icons/fa";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    API.get("/products/")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const filteredProducts = useMemo(() => {
  let data = [...products];

  data = data.filter((product) => {
  const keyword = search.toLowerCase();

  return (
    product.title.toLowerCase().includes(keyword) ||
    product.category.toLowerCase().includes(keyword)
  );
})


  data = data.filter((product) =>
    selectedCategory === "All"
      ? true
      : product.category.toLowerCase() ===
        selectedCategory.toLowerCase()
  );

  if (sortBy === "low") {
    data.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "high") {
    data.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "newest") {
    data.sort((a, b) => b.id - a.id);
  }

  return data;

}, [products, search, selectedCategory, sortBy]);

  const categories = [
  "All",
  ...new Set(products.map((p) => p.category)),
];  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Hero Section */}

        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl text-white p-10 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                AI Powered Student Marketplace
              </span>

              <h1 className="text-4xl lg:text-5xl font-extrabold mt-6 leading-tight">
                Buy & Sell Products
                <br />
                Smarter with AI
              </h1>

              <p className="mt-5 text-blue-100 text-lg">
                Discover affordable products from students, generate AI
                descriptions, negotiate prices intelligently, and make buying
                easier than ever.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/20 px-5 py-3 rounded-xl flex items-center gap-2">
                  <FaShoppingBag />
                  Student Marketplace
                </div>

                <div className="bg-white/20 px-5 py-3 rounded-xl flex items-center gap-2">
                  <FaRobot />
                  Gemini AI Powered
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
                alt="Students"
                className="rounded-3xl shadow-2xl h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
          <div className="relative">
            <FaSearch className="absolute left-5 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}

          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full transition font-medium ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-blue-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Price Sorting */}

<div className="mt-6 flex justify-end">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
  >
    <option value="default">Sort By</option>
    <option value="low">Price : Low → High</option>
    <option value="high">Price : High → Low</option>
    <option value="newest">Newest First</option>
  </select>
</div>

        {/* Section Heading */}

        <div className="flex justify-between items-center mt-10 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
  Latest Products

  <span className="ml-3 text-base bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
    {filteredProducts.length} Items
  </span>
</h2>

            <p className="text-gray-500 mt-1">
              {filteredProducts.length} Product
              {filteredProducts.length !== 1 && "s"} Found
            </p>
          </div>
        </div>

        {/* Product Grid */}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <h3 className="text-2xl font-bold text-gray-700">
              No Products Found
            </h3>

            <p className="text-gray-500 mt-3">
              Try changing the search text or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;