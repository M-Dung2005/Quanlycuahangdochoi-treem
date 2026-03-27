import React from 'react';
import { useApp } from '../../context/AppContext';
import { vnd, productImgUrl } from '../../utils/helpers';

function ProductCard({ product, onClickDetail }) {
    const { addToCart } = useApp();

    return (
        <div className="col-product">
            <div className="card-product">
                <div className="card-header">
                    <a
                        href="#"
                        className="card-image-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onClickDetail(product);
                        }}
                    >
                        <img src={productImgUrl(product.img)} alt={product.title} className="card-image" />
                    </a>
                </div>
                <div className="card-content">
                    <h4 className="card-title-link">{product.title}</h4>
                </div>
                <div className="card-footer">
                    <div className="product-price">
                        <span className="current-price">{vnd(product.price)}</span>
                    </div>
                    <div className="product-buy">
                        <button
                            type="button"
                            className="card-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        >
                            <i className="fa-light fa-basket-shopping"></i> Thêm giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
