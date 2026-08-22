import styles from "../Loader.module.css";

const EcgCanvas = ({
  pathRef,
  timelineTrackRef,
  timelineBeamRef,
  energyOrbGroupRef,
  ripple1Ref,
  ripple2Ref,
}) => {
  return (
    <div className={styles.svgWrapper}>
      <svg viewBox="0 0 1600 400" xmlns="http://www.w3.org/2000/svg" className={styles.svgElement}>
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--teal-500)" />
            <stop offset="40%" stopColor="var(--teal-200)" />
            <stop offset="80%" stopColor="var(--teal-300)" />
            <stop offset="100%" stopColor="var(--teal-400)" />
          </linearGradient>

          <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--teal-500)" />
            <stop offset="100%" stopColor="var(--teal-300)" />
          </linearGradient>

          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* SCENE 01 & 03: ECG Path */}
        <path
          ref={pathRef}
          className={styles.ecgPath}
          d="M0,200 L15,206 L30,196 L48,204 L68,197 L90,200
             C96,188 102,188 108,190 C110,192 112,200 114,200
             L124,200 L130,208 L138,110 L148,245 L156,200 L164,200
             C172,178 180,178 184,180 C190,182 198,200 204,200
             L214,205 L226,196 L241,203 L258,197 L275,206 L292,198 L310,204 L328,197 L340,200
             C346,192 352,192 358,194 C360,196 362,200 364,200
             L374,200 L380,205 L388,145 L398,225 L406,200 L414,200
             C422,190 430,190 434,188 C440,186 448,200 454,200
             L470,207 L488,195 L505,203 L525,196 L548,206 L570,197 L595,204 L620,195 L648,205 L675,198 L700,203 L720,197 L740,200
             C746,186 752,186 758,188 C761,192 763,197 764,200
             L774,200 L780,210 L788,70 L798,270 L806,200 L814,200
             C822,180 830,175 835,175 C842,175 848,200 854,200
             L868,206 L885,195 L902,204 L920,196 L940,207 L960,197 L980,204 L1000,195 L1020,205 L1040,200
             C1046,182 1052,182 1058,185 C1061,188 1063,197 1064,200
             L1074,200 L1080,215 L1088,15 L1098,310 L1106,200 L1114,200
             C1122,178 1130,165 1136,165 C1144,165 1150,200 1154,200
             L1600,200"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* SCENE 04: SVG Base Track Line */}
        <line
          ref={timelineTrackRef}
          x1="150"
          y1="200"
          x2="1450"
          y2="200"
          className={styles.timelineTrack}
          strokeLinecap="round"
        />

        {/* SCENE 05: Glowing Progress Laser Beam */}
        <line
          ref={timelineBeamRef}
          x1="150"
          y1="200"
          x2="1450"
          y2="200"
          className={styles.timelineBeam}
          strokeLinecap="round"
        />

        {/* SCENE 05: Energy Orb travelling along timeline */}
        <g ref={energyOrbGroupRef} className={styles.energyOrbGroup}>
          <circle ref={ripple1Ref} r="18" fill="none" stroke="var(--teal-300)" strokeWidth="1.5" opacity="0.6" />
          <circle ref={ripple2Ref} r="10" fill="none" stroke="var(--teal-200)" strokeWidth="2" opacity="0.8" />
          <circle r="6" fill="var(--gray-0)" filter="url(#laserGlow)" />
        </g>
      </svg>
    </div>
  );
};

export default EcgCanvas;
