import React, { useState } from 'react';

function SearchBar({ onSearch, onClose }) {
    const [advancedParams, setAdvancedParams] = useState({
        search: '',
        category: 'Tất cả',
        minPrice: '',
        maxPrice: '',
    });

    const handleChange = (e) => {
        setAdvancedParams({ ...advancedParams, [e.target.name]: e.target.value });
    };

    const applySearch = (sortMode) => {
        onSearch({ ...advancedParams, sortMode });
    };

    const categories = [
        'Tất cả',
        'LEGO',
        'Siêu Robot',
        'GUNDAM',
        'Xe đồ chơi',
        'Búp bê',
        'Động vật',
    ];

    return (
        <div className="advanced-search open">
            <div className="container">
                <div className="advanced-search-category">
                    <span>Phân loại </span>
                    <select
                        name="category"
                        id="advanced-search-category-select"
                        value={advancedParams.category}
                        onChange={handleChange}
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="advanced-search-price">
                    <span>Giá từ</span>
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="tối thiểu"
                        value={advancedParams.minPrice}
                        onChange={handleChange}
                    />
                    <span>đến</span>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="tối đa"
                        value={advancedParams.maxPrice}
                        onChange={handleChange}
                    />
                    <button type="button" id="advanced-search-price-btn" onClick={() => applySearch()}>
                        <i className="fa-light fa-magnifying-glass-dollar"></i>
                    </button>
                </div>
                <div className="advanced-search-control">
                    <button type="button" id="sort-ascending" onClick={() => applySearch(1)}>
                        <i className="fa-regular fa-arrow-up-short-wide"></i>
                    </button>
                    <button type="button" id="sort-descending" onClick={() => applySearch(2)}>
                        <i className="fa-regular fa-arrow-down-wide-short"></i>
                    </button>
                    <button type="button" id="reset-search" onClick={() => applySearch(0)}>
                        <i className="fa-light fa-arrow-rotate-right"></i>
                    </button>
                    <button type="button" onClick={onClose}>
                        <i className="fa-light fa-xmark"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
