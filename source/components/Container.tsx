import * as React from 'react';
import icon from '../assets/icons/logo.png';
import disabledLogo from '../assets/icons/disabledLogo.png';
import './styles.scss'

const Container: React.FC = () => {
  return (
    <div>
      <div className="ideamarket-hover-alert fixed  block text-center overflow-auto bg-extension-light-2 dark:bg-extension-dark-2 text-black dark:text-white">
        <div className="ideamarket-unlisted-container">
          Unlisted
        </div>
        <div  className="ideamarket-listed-container">
          <div className="inline-block">
            <div className="ideamarket-listed-rank">17</div>
            <div>Rank</div>
          </div>
          <div className="inline-block bg-extension-light-1 dark:bg-extension-dark-1">
            <div className="ideamarket-listed-price">$2.41</div>
            <div className="ideamarket-listed-day-change">+5.73%</div>
          </div>
        </div>
        <div className="ideamarket-alert-bottom bg-extension-light-1 dark:bg-extension-dark-1">
          <a href="https://ideamarket.com" target="_blank" rel="noreferrer">
            <button className="ideamarket-button ideamarket-unlisted-button rounded-lg text-white border-none cursor-pointer font-bold">List</button>
          </a>
          <a href="https://ideamarket.com" target="_blank" rel="noreferrer">
            <button className="ideamarket-button ideamarket-listed-button rounded-lg text-white border-none cursor-pointer font-bold">Buy</button>
          </a>
          <div className="ideamarket-powered-by-text font-bold">Powered by <span className="text-black dark:text-white">Ideamarket</span></div>
        </div>
      </div>
      <div className="ideamarket-listing flex justify-center absolute cursor-pointer items-center">
        <span className="ideamarket-rank"></span>
        <img className="logo listed-logo" src={icon}/>
        <img className="logo unlisted-logo" src={disabledLogo}/>
      </div>
    </div>
  );
};

export default Container;