'use client';

import { Beer, Clock3, ArrowDown, ArrowRight, ArrowUpRight, MapPin, PackageCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';

function PourScene({ storyRef, progressRef }: {
  storyRef: React.RefObject<HTMLElement | null>;
  progressRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const story = storyRef.current;
    if (!canvas || !story) return;

    let disposed = false;
    let frame = 0;
    let renderer: import('three').WebGLRenderer | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let cleanup: (() => void) | undefined;

    void import('three').then((THREE) => {
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-4, 4, 2.6, -2.6, 0.1, 50);
      camera.position.set(0, 0, 12);
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      scene.add(new THREE.HemisphereLight(0xfff3d3, 0x17352c, 2.1));
      const keyLight = new THREE.DirectionalLight(0xffe1a0, 3.3);
      keyLight.position.set(-3, 6, 7);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0xf6aa42, 18, 12);
      rimLight.position.set(2.2, 1.2, 3);
      scene.add(rimLight);

      const product = new THREE.Group();
      scene.add(product);

      const canArtwork = document.createElement('canvas');
      canArtwork.width = 1024;
      canArtwork.height = 512;
      const context = canArtwork.getContext('2d');
      if (context) {
        context.fillStyle = '#183d32';
        context.fillRect(0, 0, 1024, 512);
        context.fillStyle = '#dca94f';
        context.fillRect(0, 0, 1024, 24);
        context.fillRect(0, 488, 1024, 24);
        context.textAlign = 'center';
        context.fillStyle = '#f8edce';
        context.font = 'bold 46px Georgia';
        context.fillText('DRINKDROP  /  SMALL BATCH', 512, 154);
        context.fillStyle = '#e8b958';
        context.font = 'bold 104px Georgia';
        context.fillText('GOLDEN HOUR', 512, 290);
        context.fillStyle = '#f8edce';
        context.font = '34px Arial';
        context.fillText('LAGER  ·  5% ALC/VOL', 512, 370);
      }
      const labelTexture = new THREE.CanvasTexture(canArtwork);
      labelTexture.colorSpace = THREE.SRGBColorSpace;

      const can = new THREE.Group();
      const canBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 1.14, 64, 1, false),
        new THREE.MeshStandardMaterial({ map: labelTexture, metalness: 0.48, roughness: 0.29 })
      );
      can.add(canBody);
      const canTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.345, 0.345, 0.035, 64),
        new THREE.MeshStandardMaterial({ color: 0xb9b7a8, metalness: 0.8, roughness: 0.22 })
      );
      canTop.position.y = 0.58;
      can.add(canTop);
      can.position.set(-0.84, 1.03, 0.05);
      can.rotation.z = -0.72;
      product.add(can);

      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.43, 1.72, 72, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0xe4f0dc,
          metalness: 0.03,
          roughness: 0.045,
          transmission: 0.35,
          transparent: true,
          opacity: 0.29,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      glass.position.set(0.42, -0.25, 0.3);
      glass.renderOrder = 2;
      product.add(glass);

      const ringMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf4f0dc,
        metalness: 0.04,
        roughness: 0.06,
        transparent: true,
        opacity: 0.55,
        clearcoat: 1
      });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.548, 0.025, 12, 72), ringMaterial);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0.42, 0.62, 0.3);
      rim.renderOrder = 3;
      product.add(rim);
      const foot = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 12, 72), ringMaterial);
      foot.rotation.x = Math.PI / 2;
      foot.position.set(0.42, -1.12, 0.3);
      foot.renderOrder = 3;
      product.add(foot);

      const beer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.475, 0.37, 1.48, 64),
        new THREE.MeshStandardMaterial({ color: 0xd98924, roughness: 0.22, metalness: 0.04 })
      );
      beer.position.set(0.42, -1.12, 0.3);
      beer.scale.y = 0.001;
      beer.renderOrder = 1;
      product.add(beer);

      const foam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 0.1, 64),
        new THREE.MeshStandardMaterial({ color: 0xffe8ac, roughness: 0.78 })
      );
      foam.position.set(0.42, -0.38, 0.3);
      foam.scale.y = 0.001;
      product.add(foam);

      const streamMaterial = new THREE.MeshStandardMaterial({
        color: 0xe9a431,
        emissive: 0x713907,
        emissiveIntensity: 0.2,
        roughness: 0.2,
        metalness: 0.08
      });
      let streamGeometry = new THREE.BufferGeometry();
      const stream = new THREE.Mesh(streamGeometry, streamMaterial);
      stream.visible = false;
      stream.renderOrder = 1;
      product.add(stream);

      const bubbleMaterial = new THREE.MeshStandardMaterial({ color: 0xffdc80, transparent: true, opacity: 0.6 });
      const bubbles = Array.from({ length: 10 }, (_, index) => {
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.025 + (index % 3) * 0.009, 12, 10), bubbleMaterial);
        bubble.position.set(0.31 + (index % 4) * 0.075, -1.02 + index * 0.12, 0.38);
        product.add(bubble);
        return bubble;
      });

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let scrollProgress = 0;
      let lastStreamLevel = -1;

      const updateProgress = () => {
        const distance = Math.max(story.offsetHeight - window.innerHeight, 1);
        scrollProgress = THREE.MathUtils.clamp(-story.getBoundingClientRect().top / distance, 0, 1);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${scrollProgress})`;
          progressRef.current.parentElement?.setAttribute('aria-valuenow', String(Math.round(scrollProgress * 100)));
        }
      };

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / Math.max(height, 1);
        const verticalSpan = width < 680 ? 5.1 : 5.25;
        camera.left = -verticalSpan * aspect / 2;
        camera.right = verticalSpan * aspect / 2;
        camera.top = verticalSpan / 2;
        camera.bottom = -verticalSpan / 2;
        camera.updateProjectionMatrix();
        renderer?.setSize(width, height, false);
        product.position.x = width < 680 ? 1.15 : 1.28;
        product.position.y = 0;
        product.scale.setScalar(width < 420 ? 0.76 : width < 680 ? 0.88 : 1);
        updateProgress();
      };

      const animate = (time: number) => {
        const level = scrollProgress;
        const fillHeight = 1.48 * level;
        beer.scale.y = Math.max(level, 0.001);
        beer.position.y = -1.12 + fillHeight / 2;
        const surface = -1.12 + fillHeight;
        foam.position.y = surface + 0.015;
        foam.scale.y = level > 0.83 ? Math.min((level - 0.83) * 6, 1) : 0.001;
        stream.visible = level > 0.025 && level < 0.98;

        if (stream.visible && Math.abs(level - lastStreamLevel) > 0.002) {
          const mouth = new THREE.Vector3(-0.43, 1.42, 0.12);
          const landing = new THREE.Vector3(0.42, surface + 0.06, 0.3);
          const curve = new THREE.CubicBezierCurve3(
            mouth,
            new THREE.Vector3(-0.08, 0.94, 0.2),
            new THREE.Vector3(0.46, Math.max(surface + 0.5, 0.72), 0.34),
            landing
          );
          const nextGeometry = new THREE.TubeGeometry(curve, 28, 0.047, 10, false);
          stream.geometry = nextGeometry;
          streamGeometry.dispose();
          streamGeometry = nextGeometry;
          lastStreamLevel = level;
        }

        bubbles.forEach((bubble, index) => {
          const range = Math.max(fillHeight - 0.08, 0.04);
          const rise = (time * 0.00018 + index * 0.137) % 1;
          bubble.visible = level > 0.12 && rise < level;
          bubble.position.y = -1.04 + rise * range;
          bubble.position.x = 0.42 + Math.sin(index * 7.3) * (0.11 + rise * 0.16);
        });

        if (!reducedMotion.matches) {
          can.rotation.z = -0.72 + Math.sin(time * 0.00045) * 0.012;
        }
        renderer?.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('scroll', updateProgress, { passive: true });
      resize();
      frame = window.requestAnimationFrame(animate);

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', updateProgress);
        resizeObserver?.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        labelTexture.dispose();
        renderer?.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [progressRef, storyRef]);

  return <canvas ref={canvasRef} className="pour-canvas" aria-hidden="true" />;
}

export function LandingExperience() {
  const storyRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  return (
    <main className="landing-page">
      <section className="pour-story" ref={storyRef} aria-label="DrinkDrop beer pour">
        <div className="pour-stage">
          <PourScene storyRef={storyRef} progressRef={progressRef} />
          <div className="stage-grain" aria-hidden="true" />
          <header className="landing-nav">
            <a className="landing-brand" href="#top" aria-label="DrinkDrop home">
              <span className="brand-mark"><Beer size={20} strokeWidth={2.2} /></span>
              <span>drinkdrop<span className="brand-period">.</span></span>
            </a>
            <nav aria-label="Main navigation">
              <a href="#how-it-works">The good stuff</a>
              <a className="nav-login" href="/login">Sign in <ArrowUpRight size={15} /></a>
            </nav>
          </header>

          <div id="top" className="hero-copy">
            <p className="eyebrow"><span /> THE NEIGHBOURHOOD DRINKS RUN</p>
            <h1>A better<br />pour. <em>Any hour.</em></h1>
            <p className="hero-description">Cold favourites, right when the moment calls for them. Your local drinks run just found a shorter route.</p>
            <div className="hero-actions">
              <a className="button-primary" href="/login">Get started <ArrowRight size={17} /></a>
              <a className="text-link" href="#how-it-works">Take a look <ArrowDown size={16} /></a>
            </div>
          </div>

          <div className="hero-note">
            <span className="note-icon"><Clock3 size={18} /></span>
            <span><b>Here for the late ones</b><small>Open around the clock</small></span>
          </div>

          <div className="scene-caption"><span className="caption-rule" /> GOLDEN HOUR / LAGER</div>
          <div className="scroll-prompt"><span>SCROLL TO POUR</span><ArrowDown size={15} /></div>
          <div className="pour-meter" role="progressbar" aria-label="Pour progression" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <span ref={progressRef} />
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-heading">
          <p className="eyebrow eyebrow-light"><span /> THE SHORT VERSION</p>
          <h2>Good drinks.<br /><em>Good timing.</em></h2>
          <p className="how-intro">From the first tap to the first sip, keep the whole drinks run refreshingly simple.</p>
        </div>
        <div className="steps-list">
          <article className="step-row">
            <span className="step-number">01</span>
            <div><h3>Pick your pour</h3><p>Find beer, mixers, and cold favourites in one place.</p></div>
            <Beer className="step-icon" strokeWidth={1.5} />
          </article>
          <article className="step-row">
            <span className="step-number">02</span>
            <div><h3>Set the drop</h3><p>Choose where your order should meet you.</p></div>
            <MapPin className="step-icon" strokeWidth={1.5} />
          </article>
          <article className="step-row">
            <span className="step-number">03</span>
            <div><h3>Get back to it</h3><p>Your evening has better things to do than make a drinks run.</p></div>
            <PackageCheck className="step-icon" strokeWidth={1.5} />
          </article>
        </div>
      </section>

      <section className="last-call">
        <div className="last-call-copy">
          <p className="eyebrow"><span /> THE NEXT ROUND IS CLOSER</p>
          <h2>Make room<br />for <em>the good stuff.</em></h2>
        </div>
        <a className="round-link" href="/login" aria-label="Get started with DrinkDrop"><ArrowUpRight size={28} /></a>
        <div className="last-call-stamp"><Clock3 size={16} /> 24 / 7</div>
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href="#top"><span className="brand-mark"><Beer size={18} /></span><span>drinkdrop<span className="brand-period">.</span></span></a>
        <p>Good drinks, on your time.</p>
        <a href="/login">Sign in <ArrowUpRight size={14} /></a>
      </footer>
    </main>
  );
}