import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axiosClient from '../api/axios';

const AppContext = createContext();

// Khởi tạo State ban đầu
const initialState = {
    user: null,         // Object thông tin user sau khi login (hoặc kiểm tra token)
    cart: [],           // Mảng sản phẩm giỏ hàng: [{ id, title, img, price, soluong }]
    isCartOpen: false,  // Quản lý đóng/mở sidebar giỏ hàng
    toast: null         // Thông báo: { type, message }
};

// Khôi phục giỏ hàng từ localStorage
const initCart = () => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
};

initialState.cart = initCart();

const appReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
            
        case 'LOGOUT':
            localStorage.removeItem('token');
            return { ...state, user: null };

        case 'SET_CART':
            return { ...state, cart: action.payload };
            
        case 'TOGGLE_CART':
            return { ...state, isCartOpen: !state.isCartOpen };
            
        case 'SHOW_TOAST':
            return { ...state, toast: action.payload };
            
        case 'HIDE_TOAST':
            return { ...state, toast: null };
            
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Lưu cart vào localStorage mỗi khi State cart thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    // Lấy thông tin User khi khởi chạy (nếu có token)
    useEffect(() => {
        const fetchUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const userData = await axiosClient.get('/auth/me');
                    dispatch({ type: 'LOGIN', payload: userData });
                } catch (error) {
                    console.log('Token hết hạn hoặc lỗi:', error);
                    dispatch({ type: 'LOGOUT' });
                }
            }
        };
        fetchUser();
    }, []);

    // Các hàm Actions dễ dùng
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN', payload: userData });
        showToast('Đăng nhập thành công!', 'success');
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        showToast('Đã đăng xuất', 'info');
    };

    const addToCart = (product) => {
        const existIdx = state.cart.findIndex(item => item.id === product.id);
        const newCart = [...state.cart];

        if (existIdx >= 0) {
            newCart[existIdx].soluong += 1;
        } else {
            newCart.push({
                id: product.id,
                title: product.title,
                img: product.img,
                price: product.price,
                soluong: 1
            });
        }
        dispatch({ type: 'SET_CART', payload: newCart });
        showToast('Thêm vào giỏ hàng thành công', 'success');
    };

    const removeFromCart = (id) => {
        const newCart = state.cart.filter(item => item.id !== id);
        dispatch({ type: 'SET_CART', payload: newCart });
    };

    const updateCartQty = (id, change) => {
        const newCart = state.cart.map(item => {
            if (item.id === id) {
                const newQty = item.soluong + change;
                return { ...item, soluong: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        dispatch({ type: 'SET_CART', payload: newCart });
    };

    const clearCart = () => {
        dispatch({ type: 'SET_CART', payload: [] });
    };

    const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

    const showToast = (message, type = 'success') => { // success, error, warning, info
        dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
        // Tự động tắt sau 3 giây
        setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    };

    return (
        <AppContext.Provider value={{ 
            ...state, 
            login, logout, 
            addToCart, removeFromCart, updateCartQty, clearCart, toggleCart, 
            showToast 
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
