import type { ReactNode } from 'react';
import ScrollMask from '../react-bits/scroll-mask';

interface Props {
  src: string;
  alt: string;
  children?: ReactNode;
}

/**
 * The river tents, opened through an iris as the page scrolls: the camp revealed the way
 * the river is first seen through the trees. The only scroll-linked moment on the page.
 */
export default function StayReveal({ src, alt, children }: Props) {
  return (
    <ScrollMask
      variant="iris"
      src={src}
      alt={alt}
      scrollLength={1.2}
      settle={0.8}
      smooth={0.12}
      feather={12}
      zoom={1.1}
      radius={6}
      overlay={0.28}
      background="var(--natural-white)"
      revealContent
      calm={false}
    >
      {children}
    </ScrollMask>
  );
}
