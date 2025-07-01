import React from 'react';
import './StoreHeader.scss';

interface StoreHeaderProps {
  bannerUrl: string;
  logoUrl: string;
  storeName: string;
  description: string;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
  bannerUrl,
  logoUrl,
  storeName,
  description
}) => {
  return (
    <div className="store-header__container">
      <img src={bannerUrl} alt="Store banner" className="store-header__banner" />
      <div className="store-header__info">
        <img src={logoUrl} alt="Store logo" className="store-header__logo" />
        <div className="store-header__text">
          <h1 className="store-header__name">{storeName}</h1>
          <p className="store-header__desc">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
