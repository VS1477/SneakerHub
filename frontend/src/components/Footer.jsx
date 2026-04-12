import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3><span className="logo-icon">👟</span> SNEAKER<span className="logo-accent">HUB</span></h3>
          <p>Your ultimate destination for premium sneakers. Discover the latest drops and iconic classics.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Shop</h4>
          <Link to="/shop?brand=Nike">Nike</Link>
          <Link to="/shop?brand=Adidas">Adidas</Link>
          <Link to="/shop?brand=Jordan">Jordan</Link>
          <Link to="/shop?brand=New Balance">New Balance</Link>
        </div>
        <div className="footer-section">
          <h4>Help</h4>
          <a href="#">Shipping & Returns</a>
          <a href="#">FAQ</a>
          <a href="#">Contact Us</a>
          <a href="#">Size Guide</a>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 SneakerHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
