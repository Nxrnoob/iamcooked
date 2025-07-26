import React from 'react';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from '../NavBar.module.css';

interface NavBarProps {
  onMenuClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.navBar}>
      {location.pathname !== '/' ? (
        <button className={styles.navButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
      ) : (
        <div className={styles.navButtonPlaceholder} />
      )}
      <Link to="/" className={styles.titleLink}>
        <h1 className={styles.title}>iamcooked</h1>
      </Link>
      <button className={styles.navButton} onClick={onMenuClick}>
        <FaBars />
      </button>
    </div>
  );
};

export default NavBar;
