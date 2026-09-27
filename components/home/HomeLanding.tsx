import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Beer,
  Check,
  Citrus,
  Clock3,
  CupSoda,
  Droplets,
  GlassWater,
  MapPin,
  PackageCheck,
  Route,
  ShieldCheck,
  Store,
  Truck,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { getHomeData, type HomeCategory, type HomeProduct } from '@/lib/home-data';
import { HomeNavbar } from './HomeNavbar';
import styles from './home.module.css';

function categoryIcon(name: string): LucideIcon {
  const value = name.toLowerCase();
  if (value.includes('water')) return Droplets;
  if (value.includes('juice')) return Citrus;
  if (value.includes('energy')) return Zap;
  if (value.includes('beer')) return Beer;
  if (value.includes('wine') || value.includes('spirit')) return GlassWater;
  if (value.includes('snack')) return PackageCheck;
  return CupSoda;
}

function CategoryTile({ category, index }: { category: HomeCategory; index: number }) {
  const Icon = categoryIcon(category.name);
  const image = category.imageUrl || category.productImageUrl;
  return (
    <Link href="/customer" className={`${styles.categoryCard} ${styles[`categoryTone${index % 6}`]}`}>
      <span className={styles.categoryImage}>
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 640px) 45vw, (max-width: 1000px) 28vw, 17vw" unoptimized />
        ) : (
          <Icon size={37} strokeWidth={1.45} aria-hidden="true" />
        )}
      </span>
      <span className={styles.categoryLabel}>{category.name}</span>
      <ArrowUpRight className={styles.categoryArrow} size={17} aria-hidden="true" />
    </Link>
  );
}

function ProductCard({ product, currency }: { product: HomeProduct; currency: string }) {
  return (
    <article className={styles.productCard}>
      <Link href="/customer" className={styles.productImage} aria-label={`View ${product.name} in the customer shop`}>
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 44vw, 240px" unoptimized />
        ) : (
          <CupSoda size={46} strokeWidth={1.35} aria-hidden="true" />
        )}
        <span className={styles.availableBadge}><span /> Available</span>
      </Link>
      <div className={styles.productDetails}>
        {product.brand && <p className={styles.productBrand}>{product.brand}</p>}
        <h3><Link href="/customer">{product.name}</Link></h3>
        <p className={styles.productSize}>{[product.size, product.unit].filter(Boolean).join(' ') || 'Listed by a local dealer'}</p>
        <div className={styles.productBuyRow}>
          <strong>{currency} {product.price.toLocaleString('en-NP')}</strong>
          <Link href="/customer" className={styles.productView} aria-label={`View ${product.name}`}><ArrowRight size={17} /></Link>
        </div>
      </div>
    </article>
  );
}

export default async function HomeLanding() {
  const data = await getHomeData();
  const benefits = [
    { icon: Truck, title: 'Nearby delivery', detail: 'From dealers around Butwal' },
    { icon: ShieldCheck, title: 'Clear pricing', detail: 'See dealer prices before ordering' },
    { icon: Store, title: 'Local businesses', detail: 'Discover drinks from nearby stores' },
    { icon: Route, title: 'Order updates', detail: 'Check your orders in one place' },
  ];

  return (
    <main className={styles.homePage} id="home">
      <HomeNavbar
        systemName={data.systemName}
        tagline={data.tagline}
        logoUrl={data.logoUrl}
        location={data.businessAddress}
        openStatus={data.openStatus}
        openLabel={data.openLabel}
      />

      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/home/butwal-night.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroBackground}
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroLights} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.locationPill}><MapPin size={15} /> {data.businessAddress}</p>
            <h1 id="hero-title">Your Favorite Drinks <span>Delivered Fast!</span></h1>
            <p className={styles.heroDescription}>Cold drinks, juices, energy drinks, water and more, all in one place. Find a nearby dealer and order for home.</p>
            <ul className={styles.benefitList} aria-label="DrinkDrop benefits">
              {benefits.slice(0, 3).map(({ icon: Icon, title, detail }) => (
                <li key={title}>
                  <span className={styles.benefitIcon}><Icon size={17} /></span>
                  <span><b>{title}</b><small>{detail}</small></span>
                </li>
              ))}
            </ul>
            <Link href="/customer" className={styles.locationFinder}>
              <span className={styles.finderPin}><MapPin size={19} /></span>
              <span className={styles.finderCopy}><small>Choose your delivery location</small><b>{data.businessAddress}</b></span>
              <span className={styles.finderButton}>Find drinks <ArrowRight size={17} /></span>
            </Link>
            <p className={styles.finderNote}>Set or update your address in the customer shop.</p>
          </div>

          <div className={styles.drinkShowcase} aria-label="A selection of soft drinks and bottled water">
            <div className={styles.showcaseGlow} aria-hidden="true" />
            <div className={styles.drinkPhoto}>
              <Image
                src="/home/drinks-lineup.webp"
                alt="Cold 7UP and Pepsi bottles in a chilled drink display"
                width={717}
                height={400}
                priority
                sizes="(max-width: 760px) 90vw, 46vw"
              />
            </div>
            <div className={styles.waterPhoto}>
              <Image
                src="/home/water-bottle.webp"
                alt="Chilled bottle of water covered with condensation"
                width={750}
                height={1000}
                priority
                sizes="(max-width: 760px) 27vw, 14vw"
              />
            </div>
            <div className={styles.showcaseTag}><span className={styles.liveDot} /> COLD PICKS, CLOSE BY</div>
            <div className={styles.cityPhotoCredit}>
              Butwal evening photo: <a href="https://commons.wikimedia.org/wiki/File:Evening_View_of_Butwal_from_Nuwakot.jpg" target="_blank" rel="noreferrer">Mithun Kunwar, CC BY-SA 4.0</a>
            </div>
          </div>
        </div>
        <div className={styles.heroBottom}><span>बुटवल · LUMBINI, NEPAL</span><span>LOCAL DRINKS, A SHORTER ROUTE</span></div>
      </section>

      <section className={styles.categorySection} id="categories" aria-labelledby="category-title">
        <div className={styles.sectionTopline}><span className={styles.sectionEyebrow}>A good place to start</span><Link href="/customer">Browse the shop <ArrowRight size={16} /></Link></div>
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>SHOP BY CATEGORY</p><h2 id="category-title">Popular categories</h2></div>
          <span className={styles.categoryCount}>{data.categories.length} categories</span>
        </div>
        <div className={styles.categoryGrid}>
          {data.categories.map((category, index) => <CategoryTile key={category.id} category={category} index={index} />)}
        </div>
      </section>

      <section className={styles.whySection} aria-labelledby="why-title">
        <Image src="/home/butwal-night.webp" alt="" fill sizes="100vw" className={styles.whyBackground} />
        <div className={styles.whyOverlay} aria-hidden="true" />
        <div className={styles.whyInner}>
          <div className={styles.whyHeading}><p className={styles.kickerLight}>MADE FOR YOUR SIDE OF TOWN</p><h2 id="why-title">Why choose {data.systemName}?</h2><p>Fast to browse. Rooted in Butwal.</p></div>
          <div className={styles.whyGrid}>
            {benefits.map(({ icon: Icon, title, detail }, index) => (
              <article key={title} className={styles.whyItem}>
                <span className={styles.whyIcon}>{index === 1 ? <Wallet size={20} /> : <Icon size={20} />}</span>
                <div><h3>{index === 1 ? 'Dealer-set prices' : title}</h3><p>{index === 1 ? (data.deliveryFee !== null ? `Delivery fee ${data.currencySymbol} ${data.deliveryFee.toLocaleString('en-NP')}` : detail) : detail}</p></div>
                <Check className={styles.whyCheck} size={16} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.availableSection} id="available" aria-labelledby="available-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>FROM ACTIVE LOCAL LISTINGS</p><h2 id="available-title">Available nearby</h2><p className={styles.sectionSubheading}>Prices come from dealers with stock available to order.</p></div>
          <Link className={styles.textAction} href="/customer">View shop <ArrowRight size={16} /></Link>
        </div>
        {data.products.length ? (
          <div className={styles.productGrid}>{data.products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} currency={data.currencySymbol} />)}</div>
        ) : (
          <div className={styles.catalogEmpty}>
            <span className={styles.emptyIcon}><CupSoda size={24} /></span>
            <div><h3>Local dealers are preparing their listings</h3><p>Available drinks will appear here as soon as a nearby dealer adds stock.</p></div>
            <Link href="/customer">Open the shop <ArrowRight size={16} /></Link>
          </div>
        )}
      </section>

      <section className={styles.localStrip}>
        <div className={styles.localStamp}>BUTWAL<br /><span>♥</span><br />NEPAL</div>
        <div><p className={styles.kickerLight}>YOUR CITY, YOUR LOCAL STORES</p><h2>Butwal ko<br /><em>pahilo choice.</em></h2><p>One simple place to discover drinks from the dealers around you.</p></div>
        <Link href="/customer" className={styles.localAction}>Find local drinks <ArrowRight size={17} /></Link>
        <span className={styles.localHills} aria-hidden="true" />
      </section>

      <section className={styles.stepsSection} aria-labelledby="steps-title">
        <div className={styles.sectionHeading}><div><p className={styles.kicker}>FOUR STEPS, NO DETOURS</p><h2 id="steps-title">How it works</h2></div></div>
        <div className={styles.stepsGrid}>
          {[
            { icon: CupSoda, title: 'Choose your drinks', detail: 'Browse active listings and prices.' },
            { icon: MapPin, title: 'Set your location', detail: 'Add a delivery address in the customer shop.' },
            { icon: Store, title: 'Nearby dealer prepares', detail: 'Your order goes to a local drinks dealer.' },
            { icon: Truck, title: 'Get it delivered', detail: 'Follow updates from your order page.' },
          ].map(({ icon: Icon, title, detail }, index) => (
            <article key={title} className={styles.stepItem}>
              <span className={styles.stepNumber}>0{index + 1}</span><span className={styles.stepIcon}><Icon size={21} /></span>
              <h3>{title}</h3><p>{detail}</p>
              {index < 3 && <ArrowRight className={styles.stepConnector} size={17} aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.trackingSection} aria-labelledby="tracking-title">
        <div className={styles.trackingCopy}><p className={styles.kicker}>NO GUESSING WHERE IT WENT</p><h2 id="tracking-title">Your order,<br /><em>one place.</em></h2><p>Open your orders to check the latest status updates from your dealer and rider.</p><Link href="/orders" className={styles.primaryButton}>Track an order <ArrowRight size={17} /></Link></div>
        <div className={styles.routeIllustration} aria-label="Illustration of a local dealer, rider and delivery destination">
          <div className={styles.mapRoad} aria-hidden="true" />
          <span className={`${styles.mapPin} ${styles.dealerPin}`}><Store size={17} /><b>Dealer</b></span>
          <span className={`${styles.mapPin} ${styles.riderPin}`}><Truck size={17} /><b>Rider</b></span>
          <span className={`${styles.mapPin} ${styles.homePin}`}><MapPin size={18} /><b>You</b></span>
          <span className={styles.mapLabel}>BUTWAL · RUPANDEHI</span>
          <span className={styles.mapRoadLabel}>TINau corridor</span>
        </div>
      </section>

      <section className={styles.marketplaceSection} id="marketplace">
        <div><p className={styles.kicker}>THE DRINKDROP WAY</p><h2>Local dealers.<br /><em>One easy platform.</em></h2></div>
        <p className={styles.marketplaceText}>We bring nearby beverage dealers together so you can check what is available, compare listed prices, and place an order from one customer shop.</p>
        <Link href="/customer" className={styles.textAction}>Discover local listings <ArrowRight size={16} /></Link>
      </section>

      <section className={styles.trustSection} aria-label="Customer experience details">
        <div><ShieldCheck size={20} /><span><b>Adult-only service</b><small>Age check before entry</small></span></div>
        <div><Store size={20} /><span><b>Dealer listings</b><small>Stock and prices shown from dealer inventory</small></span></div>
        <div><Clock3 size={20} /><span><b>{data.openLabel}</b><small>Based on configured business hours</small></span></div>
      </section>

      <footer className={styles.footer} id="contact">
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Link className={styles.brand} href="/">
              {data.logoUrl ? <Image src={data.logoUrl} alt="" width={34} height={34} unoptimized className={styles.brandImage} /> : <span className={styles.brandMark}><Beer size={19} /></span>}
              <span className={styles.brandWords}><b>{data.systemName}</b><small>{data.tagline}</small></span>
            </Link>
            <p>Good drinks, local dealers, delivered around Butwal.</p>
            <p className={styles.footerImageCredit}>Butwal evening: <a href="https://commons.wikimedia.org/wiki/File:Evening_View_of_Butwal_from_Nuwakot.jpg" target="_blank" rel="noreferrer">Mithun Kunwar, CC BY-SA 4.0</a>, resized. Bottles: <a href="https://commons.wikimedia.org/wiki/File:Pepsi_Tailand.JPG" target="_blank" rel="noreferrer">MOs810, CC BY-SA 4.0</a>, resized/cropped.</p>
          </div>
          <div className={styles.footerColumn}><h2>Explore</h2><Link href="/">Home</Link><Link href="/customer">Shop</Link><Link href="/orders">Track order</Link><Link href="#marketplace">About DrinkDrop</Link></div>
          <div className={styles.footerColumn}><h2>Account</h2><Link href="/login">Login</Link><Link href="/signup">Create account</Link><Link href="/customer">Customer shop</Link></div>
          <div className={styles.footerColumn}><h2>Visit or call</h2><span>{data.businessAddress}</span>{data.phone && <a href={`tel:${data.phone}`}>{data.phone}</a>}{data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}</div>
        </div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {data.systemName}. All rights reserved.</span><span>Please enjoy responsibly. 18+ only.</span><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">Photo license details</a></div>
      </footer>
    </main>
  );
}