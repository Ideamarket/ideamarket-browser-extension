import * as React from 'react';
import icon from '../assets/icons/logo.png';
import disabledLogo from '../assets/icons/disabledLogo.png';
import './styles.scss'

const Container: React.FC = () => {
  return (
    <div className="ideamarket-listing">
      <span className="ideamarket-rank"></span>
      <img className="logo listed-logo" src={icon}/>
      <img className="logo notlisted-logo" src={disabledLogo}/>
    </div>
  );
};

export default Container;