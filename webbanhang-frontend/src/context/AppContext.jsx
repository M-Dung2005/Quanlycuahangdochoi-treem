import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axiosClient from '../api/axios';
import { normalizeUser, normalizeProduct } from '../utils/helpers';

const AppContext = createContext();

const initialState = {
    user: null,
    cart: [],
    isCartOpen: false,
    toast: null
};

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

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    // Lấy thông tin User khi khởi chạy (nếu có token)
    useEffect(() => {
        const fetchUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const userData = await axiosClient.get('/auth/me');
                    dispatch({ type: 'LOGIN', payload: normalizeUser(userData) });
                } catch {
                    dispatch({ type: 'LOGOUT' });
                }
            }
        };
        fetchUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN', payload: normalizeUser(userData) });
        showToast('Đăng nhập thành công!', 'success');
    };

    // Cập nhật user trong context mà không show toast (dùng khi refresh sau update profile)
    const silentLogin = (userData, token) => {
        if (token) localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN', payload: normalizeUser(userData) });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        showToast('Đã đăng xuất', 'info');
    };

    // addToCart nhận cả product từ API mới (có tieuDe/hinhAnh/gia) hoặc đã normalize
    const addToCart = (product) => {
        const p = normalizeProduct(product);
        const existIdx = state.cart.findIndex(item => item.id === p.id);
        const newCart = [...state.cart];

        if (existIdx >= 0) {
            newCart[existIdx].soluong += 1;
        } else {
            newCart.push({
                id:     p.id,
                title:  p.title,
                img:    p.img,
                price:  p.price,
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

    const clearCart = () => dispatch({ type: 'SET_CART', payload: [] });
    const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

    const showToast = (message, type = 'success') => {
        dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
        setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    };

    return (
        <AppContext.Provider value={{
            ...state,
            login, silentLogin, logout,
            addToCart, removeFromCart, updateCartQty, clearCart, toggleCart,
            showToast
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
