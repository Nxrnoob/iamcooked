// src/pages/About.jsx
import React from 'react';
import styles from '../About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>About iamcooked</h1>
      <div className={styles.text}>
        <p>
          After realizing just how much of my life Ive spent watching anime, movies, and series —
          even when Im clearly cooked for tomorrows exam — I knew I had a bit of a PRO-blem.
        </p>

        <p>
          I ignored my poor eyes begging for sleep, chose episodes over rest, and binged like my life depended on it.
        </p>

        <p>
          You know that moment when someone asks, <em>“How’s your break going?”</em><br />
          And your answer is basically:<br />
          <strong>" As usual Wake up (at lunch), binge, sleep, repeat uhh."</strong><br />
        </p>

        <p>
          I like to note my things like what i watch time to time and i seen the list going bigger and bigger and i thought "what would be my Total watch time?"

        </p>
        <p>  
          That curiosity (and maybe guilt) sparked this project.
        </p>

        <p>
          <strong>iamcooked</strong> is basically me turning my binge sessions into something sorta aesthetic and kinda useful — now you can finally say 'yeah, I’m cooked and here’s proof.' why? you may ask , idk man i built it so just use it
        </p>
      </div>
    </div>
  );
};

export default About;

