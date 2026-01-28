import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch, categoriesQuery.isLoading]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            if (!priceFilter) return true;
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    filteredProductsQuery.isLoading,
    dispatch,
    priceFilter,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand || []));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input field
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row gap-4">
          <div className="rounded-xl shadow-2xl border p-4 mt-2 mb-2"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderColor: 'rgba(71, 85, 105, 0.5)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <h2 className="text-base font-bold text-center py-2.5 rounded-full mb-3 shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#f1f5f9'
              }}
            >
              Filter by Categories
            </h2>

            <div className="p-4 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`category-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />

                    <label
                      htmlFor={`category-${c._id}`}
                      className="ml-2 text-sm font-medium text-slate-200 cursor-pointer hover:text-blue-400 transition-colors"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-base font-bold text-center py-2.5 rounded-full mb-3 shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                color: '#f1f5f9'
              }}
            >
              Filter by Brands
            </h2>

            <div className="p-4">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-4">
                  <input
                    type="radio"
                    id={`brand-${brand}`}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 focus:ring-pink-500 focus:ring-2 cursor-pointer"
                  />

                  <label
                    htmlFor={`brand-${brand}`}
                    className="ml-2 text-sm font-medium text-slate-200 cursor-pointer hover:text-pink-400 transition-colors"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="text-base font-bold text-center py-2.5 rounded-full mb-3 shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#f1f5f9'
              }}
            >
              Filter by Price
            </h2>

            <div className="p-4 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-slate-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  borderColor: 'rgba(71, 85, 105, 0.8)',
                  color: '#f1f5f9'
                }}
              />
            </div>

            <div className="p-4 pt-0">
              <button
                className="w-full py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff'
                }}
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="p-3 flex-1">
            <h2 className="text-2xl font-bold text-center mb-4 text-slate-100">
              {products?.length} Products
            </h2>
            <div className="flex flex-wrap gap-4">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
