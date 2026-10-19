import DappledLight from '../react-bits/dappled-light';

/**
 * Explore within: the shade of the trees moving over a Linen ground, the midday hour at
 * the camp. Quiet by design: low contrast, slow wind, Basalt shadow on Linen light.
 */
export default function WithinShade() {
  return (
    <DappledLight
      plant="olive"
      placement="top-right"
      scale={1.15}
      density={0.9}
      depth={0.6}
      softness={1.3}
      shadowStrength={0.5}
      lightColor="#EFE7D6"
      shadowColor="#2B2B26"
      backgroundColor="#EFE7D6"
      window="off"
      intensity={0.7}
      bloom={0.2}
      wind={0.35}
      windSpeed={0.6}
      clouds={0.2}
      breeze
      grain={0.08}
      intro
      dpr={1.5}
    />
  );
}
