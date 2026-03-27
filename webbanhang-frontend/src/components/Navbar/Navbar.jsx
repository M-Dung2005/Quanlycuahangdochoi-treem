import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Navbar() {
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || '';

    const items = [
        { label: 'Trang chủ', path: '/', key: 'home' },
        { label: 'LEGO', path: '/?category=LEGO', key: 'LEGO' },
        { label: 'Siêu Robot', path: '/?category=Siêu Robot', key: 'Siêu Robot' },
        { label: 'GUNDAM', path: '/?category=GUNDAM', key: 'GUNDAM' },
        { label: 'Xe đồ chơi', path: '/?category=Xe đồ chơi', key: 'Xe đồ chơi' },
        { label: 'Búp bê', path: '/?category=Búp bê', key: 'Búp bê' },
        { label: 'Động vật', path: '/?category=Động vật', key: 'Động vật' },
        { label: 'Đồ chơi khác', path: '/?category=Đồ chơi khác', key: 'Đồ chơi khác' },
    ];

    return (
        <nav className="header-bottom">
            <div className="container">
                <ul className="menu-list">
                    {items.map((item) => {
                        const active =
                            item.key === 'home'
                                ? !currentCategory
                                : currentCategory === item.key;
                        return (
                            <li className={`menu-list-item ${active ? 'active' : ''}`} key={item.key}>
                                <Link to={item.path} className="menu-link">
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
