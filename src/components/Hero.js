import Image from "next/image";

export default function Hero() {
  return (
    <main className="hero" id="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="line line-1">COMPUTING.</span>
          <span className="line line-2">STUDENTS.</span>
          <span className="line line-3">IMPACT.</span>
        </h1>
        <p className="hero-subtitle">
          Empowering the next generation of innovators.
          <br />
          Creating meaningful change.
        </p>
      </div>

      {/* Robot arm background image */}
      <div className="hero-image" aria-hidden="true">
        <Image
          src="/assets/robot-arm.png"
          alt="Industrial robotic arm"
          width={700}
          height={700}
          priority
        />
      </div>

    </main>
  );
}
