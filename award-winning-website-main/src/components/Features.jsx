import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Spline from '@splinetool/react-spline';

function SplineNoWatermark() {
  useEffect(() => {
    if (!document.querySelector('script[data-spline]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@0.9.518/build/spline-viewer.js';
      script.setAttribute('data-spline', 'true');
      document.body.appendChild(script);
    }
    const removeLogo = () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo && logo.parentElement) {
          logo.parentElement.removeChild(logo);
        }
      }
    };
    removeLogo();
    const interval = setInterval(removeLogo, 500);
    setTimeout(() => clearInterval(interval), 5000);
  }, []);

  return (
    <spline-viewer url="https://prod.spline.design/YPSqfHVgvacOrEQ1/scene.splinecode" style={{ width: '100%', height: '440px', display: 'block' }}></spline-viewer>
  );
}

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon, videoPosition }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        className={
          videoPosition === 'bottom-right'
            ? 'absolute bottom-0 right-0 w-2/3 h-2/3 object-contain z-0'
            : videoPosition === 'bottom-left'
            ? 'absolute bottom-0 left-0 w-1/3 h-1/3 object-contain z-0'
            : 'absolute left-0 top-0 size-full object-cover object-center'
        }
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">
          02
        </p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Our Services
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={
            <>
              AI-Powered Threat Detection
            </>
          }
          description="Real-time monitoring and instant response to cyber threats using advanced machine learning."
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <div className="relative size-full flex flex-col justify-between p-5 text-blue-50">
            <div>
              <h1 className="bento-title special-font">Automated Code Security</h1>
              <p className="mt-3 max-w-64 text-xs md:text-base">Our app reviews and hardens your codebase, ensuring best-in-class security protocols are always in place.</p>
            </div>
            <div className="flex justify-center items-center w-full mt-2" style={{height: '100%'}}>
              <div className="w-full max-h-full" style={{maxWidth: '600px'}}>
                <SplineNoWatermark />
              </div>
            </div>
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src="videos/feature-3.mp4"
            title={
              <>
                Vulnerability Assessment
              </>
            }
            description="Comprehensive scans to identify and patch weaknesses before attackers can exploit them."
            videoPosition="bottom-left"
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src="videos/feature-4.mp4"
            title={
              <>
                Security Consulting
              </>
            }
            description="Expert advice and custom solutions for businesses of all sizes, from startups to enterprises."
            videoPosition="bottom-right"
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 col-span-2 flex items-center justify-center">
          <div className="flex w-full h-full flex-col items-start justify-between bg-violet-300 p-8 rounded-md">
            <h1 className="bento-title special-font text-black text-6xl leading-tight">
              MORE<br />COMING<br />SOON.
            </h1>
            <TiLocationArrow className="self-end text-black" style={{ fontSize: '3rem', marginTop: 'auto' }} />
          </div>
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
