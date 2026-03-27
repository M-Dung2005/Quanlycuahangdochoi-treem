import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axios';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import Pagination from '../components/Pagination/Pagination';
import ProductModal from '../components/ProductModal/ProductModal';
import SearchBar from '../components/SearchBar/SearchBar';
import { removeVietnameseTones } from '../utils/helpers';
import { useApp } from '../context/AppContext';

function HomePage() {
    const { showToast } = useApp();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = useState(false);
    const itemsPerPage = 12;

    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const isAdvanceSearchQuery = searchParams.get('advanceSearch');

    useEffect(() => {
        if (isAdvanceSearchQuery === '1') setIsAdvanceSearchOpen(true);
    }, [isAdvanceSearchQuery]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = '/products';
                const queryParts = [];
                if (categoryQuery) queryParts.push(`category=${encodeURIComponent(categoryQuery)}`);
                if (queryParts.length > 0) {
                    url += `?${queryParts.join('&')}`;
                }
                const data = await axiosClient.get(url);
                const list = Array.isArray(data) ? data : [];
                setProducts(list);

                let finalData = list;
                if (searchQuery) {
                    finalData = list.filter((p) =>
                        removeVietnameseTones(p.title || '').includes(removeVietnameseTones(searchQuery))
                    );
                }
                setFilteredProducts(finalData);
                setCurrentPage(1);
            } catch (error) {
                console.error('Lỗi lấy sản phẩm:', error);
                const msg =
                    error?.message ||
                    'Không kết nối được máy chủ. Hãy chạy backend (npm run dev trong webbanhang-backend) và kiểm tra database.';
                showToast(msg, 'error');
                setProducts([]);
                setFilteredProducts([]);
            }
        };
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ refetch khi query đổi
    }, [categoryQuery, searchQuery]);

    const handleAdvancedSearch = (params) => {
        let rs = [...products];
        if (params.category && params.category !== 'Tất cả') {
            rs = rs.filter((p) => p.category === params.category);
        }
        if (params.search) {
            rs = rs.filter((p) =>
                removeVietnameseTones(p.title).includes(removeVietnameseTones(params.search))
            );
        }
        if (params.minPrice) {
            rs = rs.filter((p) => p.price >= parseInt(params.minPrice, 10));
        }
        if (params.maxPrice) {
            rs = rs.filter((p) => p.price <= parseInt(params.maxPrice, 10));
        }
        if (params.sortMode === 1) {
            rs.sort((a, b) => a.price - b.price);
        } else if (params.sortMode === 2) {
            rs.sort((a, b) => b.price - a.price);
        }
        setFilteredProducts(rs);
        setCurrentPage(1);
        setIsAdvanceSearchOpen(false);
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    let gridTitle = categoryQuery
        ? categoryQuery
        : searchQuery
          ? `Kết quả tìm kiếm: "${searchQuery}"`
          : 'Khám phá sản phẩm của chúng tôi';

    const showHero = !categoryQuery && !searchQuery;

    return (
        <main className="main-wrapper">
            {showHero && (
                <div className="container">
                    <div className="home-slider">
                        <img src="/assets/img/MD ToyStore_bg.png" alt="MD ToyStore" />
                    </div>
                    <div className="home-service" id="home-service">
                        <div className="home-service-item">
                            <div className="home-service-item-icon">
                                <i className="fa-light fa-person-carry-box"></i>
                            </div>
                            <div className="home-service-item-content">
                                <h4 className="home-service-item-content-h">GIAO HÀNG NHANH</h4>
                                <p className="home-service-item-content-desc">Cho tất cả đơn hàng</p>
                            </div>
                        </div>
                        <div className="home-service-item">
                            <div className="home-service-item-icon">
                                <i className="fa-light fa-shield-heart"></i>
                            </div>
                            <div className="home-service-item-content">
                                <h4 className="home-service-item-content-h">SẢN PHẨM AN TOÀN</h4>
                                <p className="home-service-item-content-desc">Cam kết chất lượng</p>
                            </div>
                        </div>
                        <div className="home-service-item">
                            <div className="home-service-item-icon">
                                <i className="fa-light fa-headset"></i>
                            </div>
                            <div className="home-service-item-content">
                                <h4 className="home-service-item-content-h">HỖ TRỢ 24/7</h4>
                                <p className="home-service-item-content-desc">Tất cả ngày trong tuần</p>
                            </div>
                        </div>
                        <div className="home-service-item">
                            <div className="home-service-item-icon">
                                <i className="fa-light fa-circle-dollar"></i>
                            </div>
                            <div className="home-service-item-content">
                                <h4 className="home-service-item-content-h">HOÀN LẠI TIỀN</h4>
                                <p className="home-service-item-content-desc">Nếu không hài lòng</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ProductGrid
                title={gridTitle}
                products={currentProducts}
                onOpenDetail={(product) => setSelectedProduct(product)}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {isAdvanceSearchOpen && (
                <SearchBar
                    onSearch={handleAdvancedSearch}
                    onClose={() => setIsAdvanceSearchOpen(false)}
                />
            )}
        </main>
    );
}

export default HomePage;
