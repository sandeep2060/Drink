'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Beer, Menu, MapPin, Search, ShoppingBag, X } from 'lucide-react';
import styles from './home.module.css';

type HomeNavbarProps = {
  systemName: string;
  tagline: string;
  logoUrl: string | null;
  location: string;
  openStatus: 'open' | 'closed' | 'unknown';
  openLabel: string;
};

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#categories' },
  { label: 'Available now', href: '#available' },
  { label: 'Track order', href: '/orders' },
  { label: 'About us', href: '#marketplace' },
  { label: 'Contact', href: '#contact' },
];

export function HomeNavbar({ systemName, tagline, logoUrl, location, openStatus, openLabel }: HomeNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 26);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-menu"
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link className={styles.brand} href="/" aria-label={`${systemName} home`}>
            {logoUrl ? (
              <Image src={logoUrl} alt="" width={34} height={34} unoptimized className={styles.brandImage} />
            ) : (
              <span className={styles.brandMark}><Beer size={19} strokeWidth={2} /></span>
            )}
            <span className={styles.brandWords}><b>{systemName}</b><small>{tagline}</small></span>
          </Link>

          <nav className={styles.desktopLinks} aria-label="Main navigation">
            {navigation.map(link => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </nav>

          <div className={styles.navActions}>
            <Link href="/customer" className={styles.locationButton} aria-label={`Delivery area ${location}; ${openLabel}`}>
              <MapPin size={15} />
              <span><b>{location}</b><small className={styles[`status_${openStatus}`]}>{openStatus === 'unknown' ? openLabel : openLabel}</small></span>
              <span className={`${styles.statusDot} ${styles[`dot_${openStatus}`]}`} aria-hidden="true" />
            </Link>
            <Link href="/customer" className={styles.iconButton} aria-label="Search drinks"><Search size={18} /></Link>
            <Link href="/login" className={`${styles.iconButton} ${styles.accountButton}`} aria-label="Sign in"><ArrowUpRight size={18} /></Link>
            <Link href="/customer" className={`${styles.iconButton} ${styles.cartButton}`} aria-label="Open customer shop"><ShoppingBag size={18} /></Link>
          </div>
        </div>
      </header>

      <div className={`${styles.drawerBackdrop} ${menuOpen ? styles.drawerBackdropOpen : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <nav id="home-mobile-menu" className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        <div className={styles.drawerHeading}>
          <span>Explore DrinkDrop</span>
          <button type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)}><X size={19} /></button>
        </div>
        {navigation.map(link => (
          <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={16} /></Link>
        ))}
        <Link className={styles.drawerLogin} href="/login" onClick={() => setMenuOpen(false)}>Login <ArrowUpRight size={16} /></Link>
        <div className={styles.drawerLocation}><MapPin size={16} />{location}<span className={`${styles.statusDot} ${styles[`dot_${openStatus}`]}`} /></div>
      </nav>
    </>
  );
}