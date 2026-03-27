import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

function ProductGrid({ products, title, onOpenDetail }) {
    if (!products || products.length === 0) {
        return (
            <div className="container" id="trangchu">
                <div className="home-title-block">
                    <h2 className="home-title">{title}</h2>
                </div>
                <div className="no-result">
                    <i className="fa-light fa-magnifying-glass"></i>
                    <h3 className="no-result-h">Không có sản phẩm</h3>
                    <p className="no-result-p">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" id="trangchu">
            <div className="home-title-block">
                <h2 className="home-title">{title}</h2>
            </div>
            <div className="home-products">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onClickDetail={onOpenDetail} />
                ))}
            </div>
        </div>
    );
}

export default ProductGrid;
