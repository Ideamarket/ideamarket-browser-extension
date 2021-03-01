import * as React from 'react';
import icon from '../assets/icons/logo.png';
import disabledLogo from '../assets/icons/disabledLogo.png';
import './styles.scss'

const Container: React.FC = () => {
  return (
    <div>
      <div className="ideamarket-hover-alert">
        <div className="ideamarket-unlisted-container">
          Unlisted
        </div>
        <div  className="ideamarket-listed-container">
          <div>
            <div>17</div>
            <div>Rank</div>
          </div>
          <div>
            <div>$2.41</div>
            <div>+5.73%</div>
          </div>
        </div>
        <div className="ideamarket-alert-bottom">
          <a href="https://ideamarket.com" target="_blank" rel="noreferrer">
            <button className="ideamarket-button ideamarket-unlisted-button">List</button>
          </a>
          <a href="https://ideamarket.com" target="_blank" rel="noreferrer">
            <button className="ideamarket-button ideamarket-listed-button">Buy</button>
          </a>
          <div className="ideamarket-powered-by-text">Powered by <span>Ideamarket</span></div>
        </div>
      </div>
      <div className="ideamarket-listing">
        <span className="ideamarket-rank"></span>
        <img className="logo listed-logo" src={icon}/>
        <img className="logo notlisted-logo" src={disabledLogo}/>
      </div>
    </div>
  );
};

export default Container;