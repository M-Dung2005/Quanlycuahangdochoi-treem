import React from 'react';
import { useApp } from '../../context/AppContext';
import { vnd, productImgUrl } from '../../utils/helpers';

function ProductModal({ product, onClose }) {
    const { addToCart } = useApp();

    if (!product) return null;

    return (
        <div className="modal product-detail open" onClick={onClose} role="presentation">
            <div className="modal-container mdl-cnt" onClick={(e) => e.stopPropagation()} id="product-detail-content">
                <button type="button" className="modal-close close-popup" onClick={onClose} aria-label="Đóng">
                    <i className="fa-thin fa-xmark"></i>
                </button>
                <div className="modal-header">
                    <img className="product-image" src={productImgUrl(product.img)} alt={product.title} />
                </div>
                <div className="modal-body">
                    <h2 className="product-title">{product.title}</h2>
                    <div className="product-control">
                        <div className="priceBox">
                            <span className="current-price">{vnd(product.price)}</span>
                        </div>
                    </div>
                    <p className="product-description">{product.desc || 'Đang cập nhật mô tả.'}</p>
                </div>
                <div className="modal-footer">
                    <div className="price-total">
                        <span className="thanhtien">Đơn giá</span>
                        <span className="price">{vnd(product.price)}</span>
                    </div>
                    <div className="modal-footer-control">
                        <button
                            type="button"
                            className="button-dathangngay"
                            onClick={() => {
                                addToCart(product);
                                onClose();
                            }}
                        >
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
