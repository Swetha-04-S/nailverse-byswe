
import { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/api";
import { ArrowLeft, Plus, Pencil, Trash2, Package } from "lucide-react";
import "./Admin.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Press-on Nails",
  image: "",
  stock: "",
  isAvailable: true
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      setMessage("Could not load products. Check the backend.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
        setMessage("Product updated successfully!");
      } else {
        await addProduct(productData);
        setMessage("Product added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "Press-on Nails",
      image: product.image || "",
      stock: product.stock ?? "",
      isAvailable: product.isAvailable ?? true
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      setMessage("Product deleted successfully!");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await loadProducts();
    } catch (error) {
      setMessage("Could not delete product.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a href="/" className="admin-back">
          <ArrowLeft size={18} /> Back to website
        </a>
        <p>NAILVERSE BY SWE</p>
        <h1>Product Dashboard</h1>
        <span>Manage your nail collection</span>
      </header>

      <section className="admin-content">
        <div className="admin-form-card">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          {message && <p className="admin-message">{message}</p>}

          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Product name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Pink Pearl Nails"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product"
                required
              />
            </label>

            <div className="admin-form-row">
              <label>
                Price (₹)
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Stock
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Press-on Nails</option>
                <option>Gel Extensions</option>
                <option>Nail Art</option>
                <option>Gel Polish</option>
              </select>
            </label>

            <label>
              Product image URL
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </label>

            <label className="admin-checkbox">
              <input
                name="isAvailable"
                type="checkbox"
                checked={form.isAvailable}
                onChange={handleChange}
              />
              Product is available
            </label>

            <div className="admin-form-actions">
              <button type="submit" disabled={loading}>
                <Plus size={17} />
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingId && (
                <button type="button" className="admin-cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-card">
          <div className="admin-list-heading">
            <div>
              <h2>Product Inventory</h2>
              <p>{products.length} products in your collection</p>
            </div>
            <Package size={28} />
          </div>

          {products.length === 0 ? (
            <p>No products found. Add your first product above.</p>
          ) : (
            <div className="admin-product-list">
              {products.map((product) => (
                <article className="admin-product" key={product._id}>
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300"
                    }
                    alt={product.name}
                  />

                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <strong>₹{product.price}</strong>
                    <small>Stock: {product.stock}</small>
                    <small>
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </small>
                  </div>

                  <div className="admin-product-actions">
                    <button onClick={() => handleEdit(product)} aria-label="Edit product">
                      <Pencil size={17} />
                    </button>
                    <button
                      className="admin-delete"
                      onClick={() => handleDelete(product._id)}
                      aria-label="Delete product"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Admin;
