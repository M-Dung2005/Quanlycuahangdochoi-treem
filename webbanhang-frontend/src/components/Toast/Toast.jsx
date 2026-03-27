import React from 'react';
import { useApp } from '../../context/AppContext';

function Toast() {
    const { toast } = useApp();

    if (!toast) return null;

    const icons = {
        success: 'fa-check',
        error: 'fa-xmark',
        warning: 'fa-exclamation',
        info: 'fa-info'
    };

    return (
        <div id="toast">
            <div className={`toast toast--${toast.type}`}>
                <div className="toast__icon">
                    <i className={`fa-light ${icons[toast.type] || 'fa-info'}`}></i>
                </div>
                <div className="toast__body">
                    <h3 className="toast__title">
                        {toast.type === 'success' ? 'Thành công' : 
                         toast.type === 'error' ? 'Lỗi' : 
                         toast.type === 'warning' ? 'Cảnh báo' : 'Thông báo'}
                    </h3>
                    <p className="toast__msg">{toast.message}</p>
                </div>
                <div className="toast__close">
                    <i className="fa-light fa-xmark"></i>
                </div>
            </div>
        </div>
    );
}

export default Toast;
