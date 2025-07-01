import React, { useState, useRef } from 'react';
import { FaShareSquare, FaWhatsapp, FaFacebookF, FaCheck, FaLink } from 'react-icons/fa';
import './ShareMenu.scss';

const ShareMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="share-menu-wrapper" ref={menuRef}>
      <button className="icon-button" onClick={() => setIsOpen((prev) => !prev)}>
        <FaShareSquare />
        Share
      </button>

      {isOpen && (
        <div className="share-menu-dropdown">
          <button onClick={handleCopyLink}>
            {copied ? <FaCheck /> : <FaLink />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
            Facebook
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
