import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart, FaLeaf, FaTint, FaRecycle } from "react-icons/fa";
import { useCart } from "@/lib/cart-context";

// Example placeholder images
import denimTote from "@/assets/products/denim-tote.jpg";
import patchworkJacket from "@/assets/products/patchwork-jacket.jpg";
import reclaimedTee from "@/assets/products/reclaimed-tee.jpg";
import leatherWallet from "@/assets/products/leather-wallet.jpg";

const products = [
  {
    id: 1,
    title: "Upcycled Denim Tote",
    price: 42,
    impact: 12,
    impactLabel: "12 L water saved",
    category: "Bags",
    img: denimTote,
    impactIcon: <FaTint className="text-primary" />,
  },
  {
    id: 2,
    title: "Patchwork Jacket",
    price: 120,
    impact: 0.3,
    impactLabel: "0.3 kg CO₂ avoided",
    category: "Clothing",
    img: patchworkJacket,
    impactIcon: <FaLeaf className="text-primary" />,
  },
  {
    id: 3,
    title: "Reclaimed Tee",
    price: 28,
    impact: 0.1,
    impactLabel: "0.1 m³ landfill reduced",
    category: "Clothing",
    img: reclaimedTee,
    impactIcon: <FaRecycle className="text-primary" />,
  },
  {
    id: 4,
    title: "Leather Offcut Wallet",
    price: 36,
    impact: 1,
    impactLabel: "Reclaimed leather",
    category: "Accessories",
    img: leatherWallet,
    impactIcon: <FaRecycle className="text-primary" />,
  },
];

const categories = ["All", "Bags", "Clothing", "Accessories"];
const sortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "impact-asc", label: "Impact: Low to High" },
  { value: "impact-desc", label: "Impact: High to Low" },
];

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const { addItem } = useCart();

  const handleAddToCart = (product: (typeof products)[number]) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      category: product.category,
    });
    toast.success(`Added "${product.title}" to cart`);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "impact-asc":
        return a.impact - b.impact;
      case "impact-desc":
        return b.impact - a.impact;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen relative bg-white text-gray-900">
      <Seo
        title="Marketplace — Nyuzi"
        description="Shop unique upcycled products with transparent impact."
      />

      {/* Gradient edges */}
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary via-green-500 to-primary-light" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary-light via-green-500 to-primary" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl font-extrabold text-center md:text-left text-primary">
          Marketplace
        </h1>
        <p className="mt-2 text-gray-600 text-center md:text-left max-w-2xl">
          Discover one-of-a-kind pieces crafted from reclaimed materials — shop,
          support, and make an impact.
        </p>

        {/* Filters and Sort */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 ${selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-primary bg-transparent text-primary px-3 py-2 text-sm outline-none hover:bg-primary hover:text-white transition"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white text-gray-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((p) => (
            <article
              key={p.id}
              className="rounded-xl overflow-hidden border-2 border-primary bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative w-full h-56">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-gold text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {p.impactIcon} {p.impactLabel}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between h-36">
                <div>
                  <h3 className="font-semibold text-lg text-primary">
                    {p.title}
                  </h3>
                  <div className="mt-1 text-sm text-gray-600">{p.category}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">
                    ${p.price}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(p)}
                    className="bg-primary text-white hover:bg-primary-dark flex items-center gap-2"
                  >
                    <FaShoppingCart /> Add to cart
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;


