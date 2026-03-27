import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-top-content">
                        <div className="footer-top-img">
                            <img src="/assets/img/MDtoystore.png" alt="MD ToyStore" />
                        </div>
                        <div className="footer-top-subbox">
                            <div className="footer-top-subs">
                                <h2 className="footer-top-subs-title">Đăng ký nhận tin</h2>
                                <p className="footer-top-subs-text">Nhận thông tin mới nhất từ chúng tôi</p>
                            </div>
                            <form className="form-ground" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" className="form-ground-input" placeholder="Nhập email của bạn" />
                                <button type="submit" className="form-ground-btn">
                                    <span>ĐĂNG KÝ</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget-area">
                <div className="container">
                    <div className="widget-row">
                        <div className="widget-row-col-1">
                            <h3 className="widget-title">Về chúng tôi</h3>
                            <div className="widget-row-col-content">
                                <p>
                                    MD ToyStore là thương hiệu được thành lập vào năm 2025 với tiêu chí đặt chất lượng sản phẩm lên hàng đầu.
                                </p>
                            </div>
                            <div className="widget-social">
                                <div className="widget-social-item">
                                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                                </div>
                                <div className="widget-social-item">
                                    <a href="#"><i className="fab fa-twitter"></i></a>
                                </div>
                                <div className="widget-social-item">
                                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                                </div>
                                <div className="widget-social-item">
                                    <a href="#"><i className="fab fa-whatsapp"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="widget-row-col">
                            <h3 className="widget-title">Liên kết</h3>
                            <ul className="widget-contact">
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Về chúng tôi</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Sản Phẩm</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Điều khoản</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Liên hệ</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Tin tức</span></a>
                                </li>
                            </ul>
                        </div>
                        <div className="widget-row-col">
                            <h3 className="widget-title">Sản Phẩm</h3>
                            <ul className="widget-contact">
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>LEGO</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>GUNDAM</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Xe đồ chơi</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Búp bê</span></a>
                                </li>
                                <li className="widget-contact-item">
                                    <a href="#"><i className="fa-regular fa-arrow-right"></i><span>Động vật</span></a>
                                </li>
                            </ul>
                        </div>
                        <div className="widget-row-col-1">
                            <h3 className="widget-title">Liên hệ</h3>
                            <div className="contact">
                                <div className="contact-item">
                                    <div className="contact-item-icon">
                                        <i className="fa-regular fa-location-dot"></i>
                                    </div>
                                    <div className="contact-content">
                                        <span>Nhân Hòa, Mỹ Hào, Hưng Yên</span>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon">
                                        <i className="fa-regular fa-phone"></i>
                                    </div>
                                    <div className="contact-content contact-item-phone">
                                        <span>0123 456 789</span>
                                        <br />
                                        <span>0334 377 742</span>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon">
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <div className="contact-content conatct-item-email">
                                        <span>abc@toystore.com</span>
                                        <br />
                                        <span>Mdtoystore@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap">
                <div className="container">
                    <div className="copyright-content">
                        <p>Copyright 2025 MD ToyStore. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
            <div className="back-to-top">
                <a href="#"><i className="fa-regular fa-arrow-up"></i></a>
            </div>
        </footer>
    );
}

export default Footer;
