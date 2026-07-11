import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart, FaLeaf } from "react-icons/fa";
import { useCart } from "@/lib/cart-context";
import { listPublishedProducts, type Product } from "@/lib/products";

const sortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const { addItem } = useCart();

  useEffect(() => {
    listPublishedProducts().then(({ data, error }) => {
      if (error) toast.error("Couldn't load the marketplace", { description: error });
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category_name)))],
    [products]
  );

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.image_url ?? "/placeholder.svg",
      category: product.category_name,
    });
    toast.success(`Added "${product.title}" to cart`);
  };

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category_name === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Marketplace — Nyuzi"
        description="Shop unique upcycled products with transparent impact."
      />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-semibold text-center md:text-left">
          Marketplace
        </h1>
        <p className="mt-2 text-muted-foreground text-center md:text-left max-w-2xl">
          Discover one-of-a-kind pieces crafted from reclaimed materials — shop,
          support, and make an impact.
        </p>

        {loading ? (
          <p className="mt-12 text-center text-muted-foreground">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            No products are live yet — check back soon.
          </p>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground hover:border-primary hover:text-primary"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-border bg-card text-foreground px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
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
                  className="group rounded-lg overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-muted">
                    <img
                      src={p.image_url ?? "/placeholder.svg"}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {p.impact_label && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 bg-gold text-gold-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
                        <FaLeaf /> {p.impact_label}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{p.category_name}</div>
                    <h3 className="mt-1 font-display font-semibold text-lg text-foreground">
                      {p.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        ${p.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(p)}
                        className="bg-primary text-primary-foreground hover:bg-primary-dark flex items-center gap-2"
                      >
                        <FaShoppingCart /> Add to cart
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
