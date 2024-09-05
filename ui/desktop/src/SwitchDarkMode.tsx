import React, { useState, useEffect } from 'react';
import './style/switch_dark_mode.css';

const svgMoon = new URL(`./assets/moon.svg`, import.meta.url).href;
const svgSun = new URL(`./assets/sun.svg`, import.meta.url).href;

function SwitchDarkMode() {
  // Initialize theme based on localStorage
  const [isDark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    // Apply the saved theme when the component mounts
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const darkModeHandler = () => {
    setDark(!isDark);
    document.body.classList.toggle('dark'); // Save the theme to localStorage
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  return (
    // https://uiverse.io/andrew-demchenk0/honest-stingray-90
    <label className="switch" htmlFor="checkbox">
           {' '}
      <span className="moon">
                <img src={svgMoon} alt="moon" />     {' '}
      </span>
           {' '}
      <span className="sun">
                <img src={svgSun} alt="sun" />     {' '}
      </span>
            <input id="checkbox" type="checkbox" className="input" checked={isDark} onChange={darkModeHandler} />
            <span className="slider" />   {' '}
    </label>
  );
}

export default SwitchDarkMode;
