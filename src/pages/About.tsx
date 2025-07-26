import React from 'react';
import styles from '../About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>About iamcooked</h1>
      <p className={styles.text}>
        This is a placeholder for the about page. You can write about your site here.
      </p>
    </div>
  );
};

export default About;
