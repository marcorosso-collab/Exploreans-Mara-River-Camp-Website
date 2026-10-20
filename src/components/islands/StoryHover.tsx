import HoverPreview, { type HoverTarget } from '../react-bits/hover-preview';

interface Props {
  text: string;
  targets: { text: string; image: string; alt: string }[];
}

/**
 * "What you will live": the place named in plain words, with the photograph of each one
 * a hover away. Slow, small rotations only (Brand Bible ch. 07: slow fades, no bounce).
 */
export default function StoryHover({ text, targets }: Props) {
  const items: HoverTarget[] = targets.map((t) => ({ text: t.text, imageUrl: t.image, altText: t.alt }));
  return (
    <HoverPreview
      content={text}
      targets={items}
      imagePosition="above"
      imageWidth={280}
      imageHeight={200}
      enterSpeed={0.35}
      exitSpeed={0.3}
      maxRotation={4}
      maxOffset={10}
      targetPadding={2}
      imageBorderRadius="6px"
      showImageShadow
      className="story-hover"
    />
  );
}
