import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Beer, Clock3, MapPin, ShieldCheck, Wine } from 'lucide-react';

const categories = [
  { name: 'Beer', detail: 'Local lagers & craft', icon: Beer, tone: 'category-beer' },
  { name: 'Whisky', detail: 'Blended & single malt', icon: Wine, tone: 'category-whisky' },
  { name: 'Wine', detail: 'Red, white & sparkling', icon: Wine, tone: 'category-wine' },
  { name: 'More spirits', detail: 'Rum, gin & vodka', icon: ArrowUpRight, tone: 'category-spirits' },
];

const nepaliBrands = ['Gorkha', 'Nepal Ice', 'Barahsinghe', 'Arna', 'Khukuri Rum'];

export function StorefrontLanding() {
  return (
    <main className="storefront" id="top">
      <div className="storefront-ribbon">
        <ShieldCheck size={15} /> 18+ ONLY <span className="ribbon-divider" /> Drink responsibly
      </div>
      <header className="storefront-header">
        <Link href="/" className="storefront-logo" aria-label="DrinkDrop home">
          <span className="storefront-mark"><Beer size={20} strokeWidth={2.1} /></span>
          <span>drinkdrop<span>.</span></span>
        </Link>
        <nav className="storefront-nav" aria-label="Shop navigation">
          <Link href="#categories">Shop drinks</Link>
          <Link href="#nepali-picks">Nepali favourites</Link>
          <Link href="#delivery">Delivery</Link>
        </nav>
        <div className="storefront-actions">
          <Link href="/login" className="storefront-signin">Sign in</Link>
          <Link href="/signup" className="storefront-account">Create account <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <section className="shop-hero" aria-labelledby="shop-title">
        <div className="shop-hero-copy">
          <p className="shop-eyebrow"><span /> YOUR NEIGHBOURHOOD DRINKS STORE</p>
          <h1 id="shop-title">Good company.<br /><em>Good drinks.</em></h1>
          <p className="shop-intro">Nepali favourites and familiar pours, brought a little closer to home.</p>
          <div className="shop-hero-links">
            <Link className="shop-primary" href="/customer">Browse the store <ArrowRight size={17} /></Link>
            <a className="shop-secondary" href="#categories">Explore drinks <ArrowDown size={15} /></a>
          </div>
          <div className="shop-location"><MapPin size={16} /><span>Serving Butwal and nearby communities</span></div>
        </div>
        <div className="shop-hero-visual">
          <div className="hero-photo-wrap">
            <Image
              className="hero-brand-photo"
              src="/brands/barahsinghe-craft-lager.jpg"
              alt="Barahsinghe Craft Lager, a Nepal-brewed craft beer"
              width={900}
              height={1350}
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
            />
          </div>
          <div className="hero-photo-caption"><span className="caption-dot" /> FROM NEPAL, FOR YOUR TABLE</div>
          <div className="delivery-note"><Clock3 size={18} /><span><b>A smoother drinks run</b><small>Browse local options in one place</small></span></div>
          <span className="hero-stamp">GOOD<br />NEPALI<br />POURS</span>
        </div>
      </section>

      <section className="shop-benefits" id="delivery" aria-label="DrinkDrop service details">
        <div><MapPin size={19} /><span><b>Local discovery</b><small>Find nearby options</small></span></div>
        <div><ShieldCheck size={19} /><span><b>Adults only</b><small>18+ age check at entry</small></span></div>
        <div><Clock3 size={19} /><span><b>Easy ordering</b><small>From browse to doorstep</small></span></div>
      </section>

      <section className="category-section" id="categories">
        <div className="section-heading">
          <div><p className="shop-eyebrow"><span /> FIND YOUR POUR</p><h2>Shop by <em>kind</em></h2></div>
          <Link href="/customer" className="section-link">See the store <ArrowRight size={16} /></Link>
        </div>
        <div className="category-grid">
          {categories.map(({ name, detail, icon: Icon, tone }) => (
            <Link key={name} className={`category-tile ${tone}`} href="/customer">
              <span className="category-icon"><Icon size={21} strokeWidth={1.7} /></span>
              <span className="category-copy"><b>{name}</b><small>{detail}</small></span>
              <ArrowUpRight className="category-arrow" size={17} />
            </Link>
          ))}
        </div>
      </section>

      <section className="nepali-section" id="nepali-picks">
        <div className="nepali-copy">
          <p className="shop-eyebrow shop-eyebrow-light"><span /> BREWED & ROOTED HERE</p>
          <h2>A little closer<br />to <em>home.</em></h2>
          <p>From crisp local lagers to small-batch craft, discover names that have found their way onto Nepali tables.</p>
          <div className="brand-list" aria-label="Nepali drinks brands">
            {nepaliBrands.map(brand => <span key={brand}>{brand}</span>)}
          </div>
          <Link href="/customer" className="nepali-link">Explore local drinks <ArrowRight size={16} /></Link>
        </div>
        <div className="nepali-image-wrap">
          <Image
            src="/brands/barahsinghe-craft-lager.jpg"
            alt="Barahsinghe Craft Lager, a Nepal-brewed craft beer"
            width={900}
            height={1350}
            sizes="(max-width: 760px) 90vw, 42vw"
            className="nepali-image"
          />
          <span className="image-label">CRAFTED IN NEPAL</span>
        </div>
      </section>

      <section className="storefront-cta">
        <div><p className="shop-eyebrow"><span /> YOUR NEXT DRINKS RUN</p><h2>Make it an easy one.</h2></div>
        <Link href="/signup" className="shop-primary">Join DrinkDrop <ArrowRight size={17} /></Link>
      </section>

      <footer className="storefront-footer">
        <Link href="/" className="storefront-logo"><span className="storefront-mark"><Beer size={18} /></span><span>drinkdrop<span>.</span></span></Link>
        <p>Good drinks, on your time. Please enjoy responsibly.</p>
        <Link href="/login">Sign in <ArrowUpRight size={14} /></Link>
      </footer>
    </main>
  );
}