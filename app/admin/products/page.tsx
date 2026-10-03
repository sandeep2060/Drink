'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Beer,
  CheckCircle2,
  CupSoda,
  Droplets,
  Edit2,
  Filter,
  Plus,
  Power,
  Search,
  Sparkles,
  Trash2,
  Wine,
  X,
  Zap,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import {
  Product,
  ProductCategory,
  addCatalogProduct,
  deleteCatalogProduct,
  getCatalogProducts,
  toggleCatalogProductStatus,
  updateCatalogProduct,
} from '@/lib/catalog-store';

const ALL_CATEGORIES: ProductCategory[] = [
  'Beer & Craft',
  'Whiskey & Spirits',
  'Wine',
  'Soft Drinks & Soda',
  'Energy & Juice',
  'Water & Mixers',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [toast, setToast] = useState<string | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Beer & Craft');
  const [size, setSize] = useState('650ml Bottle');
  const [unit, setUnit] = useState('bottle');
  const [price, setPrice] = useState(350);
  const [costPrice, setCostPrice] = useState(270);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [alcoholic, setAlcoholic] = useState(true);
  const [abv, setAbv] = useState<number | undefined>(5.0);
  const [chilled, setChilled] = useState(true);
  const [popular, setPopular] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dealerName, setDealerName] = useState('Butwal Central Liquors (Traffic Chowk)');

  useEffect(() => {
    loadProducts();
    window.addEventListener('drinkdrop_storage_update', loadProducts);
    return () => window.removeEventListener('drinkdrop_storage_update', loadProducts);
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching Supabase products:', err);
    }
    setProducts(getCatalogProducts());
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleOpenCreate() {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setCategory('Beer & Craft');
    setSize('650ml Bottle');
    setUnit('bottle');
    setPrice(350);
    setCostPrice(270);
    setStockQuantity(50);
    setAlcoholic(true);
    setAbv(5.0);
    setChilled(true);
    setPopular(false);
    setDescription('');
    setImageUrl('/brands/barahsinghe-craft-lager.webp');
    setDealerName('Butwal Central Liquors (Traffic Chowk)');
    setIsModalOpen(true);
  }

  function handleOpenEdit(p: Product) {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setSize(p.size);
    setUnit(p.unit);
    setPrice(p.price);
    setCostPrice(p.costPrice || Math.round(p.price * 0.78));
    setStockQuantity(p.stockQuantity);
    setAlcoholic(p.alcoholic);
    setAbv(p.abv);
    setChilled(p.chilled || false);
    setPopular(p.popular || false);
    setDescription(p.description);
    setImageUrl(p.imageUrl || '');
    setDealerName(p.dealerName || 'Butwal Central Liquors (Traffic Chowk)');
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || price <= 0) return;

    if (editingProduct) {
      updateCatalogProduct(editingProduct.id, {
        name: name.trim(),
        brand: brand.trim(),
        category,
        size: size.trim(),
        unit: unit.trim(),
        price: Number(price),
        costPrice: Number(costPrice),
        stockQuantity: Number(stockQuantity),
        alcoholic,
        abv: alcoholic && abv ? Number(abv) : undefined,
        chilled,
        popular,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        dealerName: dealerName.trim(),
      });
      showToast(`Updated product: ${name}`);
    } else {
      addCatalogProduct({
        name: name.trim(),
        brand: brand.trim(),
        category,
        size: size.trim(),
        unit: unit.trim(),
        price: Number(price),
        costPrice: Number(costPrice),
        stockQuantity: Number(stockQuantity),
        alcoholic,
        abv: alcoholic && abv ? Number(abv) : undefined,
        chilled,
        popular,
        active: true,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        dealerName: dealerName.trim(),
      });
      showToast(`Created & listed new product: ${name}`);
    }

    setIsModalOpen(false);
    loadProducts();
  }

  function handleDelete(id: string, productName: string) {
    if (confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      deleteCatalogProduct(id);
      loadProducts();
      showToast(`Removed ${productName}`);
    }
  }

  function handleToggle(id: string) {
    toggleCatalogProductStatus(id);
    loadProducts();
  }

  const filtered = products.filter(p => {
    if (selectedCat !== 'All' && p.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppShell title="Products & Inventory" subtitle="Manage drinks catalog, pricing, and stock for Butwal">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drinks or brands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Categories ({products.length})</option>
            {ALL_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({products.filter(p => p.category === cat).length})
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Add Drink Product
        </button>
      </div>

      {/* Catalog Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Size & Vol</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Dealer Depot</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No products matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              className="object-contain"
                              sizes="40px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Beer size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.brand}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {p.category}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3">
                      <div>{p.size}</div>
                      {p.abv && <div className="text-[10px] text-amber-700 font-bold">{p.abv}% ABV</div>}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <div className="font-black text-slate-900">Rs. {p.price.toLocaleString('en-NP')}</div>
                      {p.costPrice && (
                        <div className="text-[10px] text-slate-400">Cost: Rs. {p.costPrice}</div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold ${
                          p.stockQuantity > 20
                            ? 'text-emerald-700'
                            : p.stockQuantity > 0
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}
                      >
                        {p.stockQuantity} in stock
                      </span>
                    </td>

                    {/* Dealer Depot */}
                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate" title={p.dealerName}>
                      {p.dealerName?.split('(')[0] || 'Central Depot'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(p.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          p.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        <Power size={11} />
                        {p.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Drink to Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Barahsinghe Craft Pilsner"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="e.g. Barahsinghe, Gorkha, Tuborg"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  >
                    {ALL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Size / Package</label>
                  <input
                    type="text"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    placeholder="e.g. 650ml Bottle, 500ml Can, 750ml"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (Rs.)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cost Price (Rs.)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={e => setCostPrice(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              {/* Alcoholic & ABV & Chilled */}
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={alcoholic}
                    onChange={e => setAlcoholic(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span>18+ Alcoholic</span>
                </label>

                {alcoholic && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">ABV %:</span>
                    <input
                      type="number"
                      step="0.1"
                      value={abv || ''}
                      onChange={e => setAbv(Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-200 bg-white p-1 text-xs outline-none"
                      placeholder="5.0"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={chilled}
                    onChange={e => setChilled(e.target.checked)}
                    className="h-4 w-4 rounded text-cyan-600"
                  />
                  <span className="flex items-center gap-1">
                    <Droplets size={12} className="text-cyan-600" /> Served Chilled
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Dealer Depot
                </label>
                <select
                  value={dealerName}
                  onChange={e => setDealerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                >
                  <option value="Butwal Central Liquors (Traffic Chowk)">Butwal Central Liquors (Traffic Chowk)</option>
                  <option value="Lumbini Beverage Hub (Kalikanagar)">Lumbini Beverage Hub (Kalikanagar)</option>
                  <option value="Highway Cold Store (Milanchowk)">Highway Cold Store (Milanchowk)</option>
                  <option value="Golpark Beer & Spirits (Golpark)">Golpark Beer & Spirits (Golpark)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Notes on taste, hops, brewing process, ingredients, etc."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none resize-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL / Asset</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="/brands/barahsinghe-craft-lager.webp or /home/drinks-lineup.webp"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  {editingProduct ? 'Save Changes' : 'Create & List Drink'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
