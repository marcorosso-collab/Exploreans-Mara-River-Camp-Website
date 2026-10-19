import LoupeImage from '../react-bits/loupe-image';

interface Props {
  src: string;
  zoomSrc: string;
  alt: string;
}

/**
 * The place, specifically (Brand Bible ch. 04): an aerial of the river below camp, with a
 * loupe to find the pod of hippos in the shallows. On touch, press and drag.
 */
export default function LookCloser({ src, zoomSrc, alt }: Props) {
  return (
    <LoupeImage
      src={src}
      zoomSrc={zoomSrc}
      alt={alt}
      aspectRatio={16 / 10}
      radius={6}
      mode="lens"
      zoom={2.6}
      minZoom={1.5}
      maxZoom={4}
      boost={1.6}
      wheelZoom="off"
      lensSize={220}
      shape="circle"
      rim="hairline"
      rimWidth={1.5}
      rimColor="#FAFAF5"
      shadow={0.35}
      dim={0.18}
      reticle="none"
      showZoom={false}
      smoothing={0.28}
      hideCursor
      touchOffset={84}
    />
  );
}
