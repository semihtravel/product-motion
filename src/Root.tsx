import React from 'react';
import { Composition } from 'remotion';
import { ProductSpin } from './ProductSpin';
import { productSpinSchema } from './types';
import { MotionVideo } from './MotionVideo';
import type { MotionScript } from './motion-script-types';

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
];

// Demo motion script for Remotion Studio preview
const DEMO_SCRIPT: MotionScript = {
  version: 1,
  template: 'showcase',
  fps: 30,
  width: 1080,
  height: 1080,
  backgroundColor: '#f5f5f5',
  textColor: '#1a1a1a',
  accentColor: '#3b82f6',
  productName: 'Milano 3-Seat Sofa',
  brandName: 'Bellona',
  dimensions: '200 × 85 × 90 cm',
  intro: {
    type: 'intro',
    durationFrames: 60,
    brandName: 'Bellona',
    productName: 'Milano 3-Seat Sofa',
    tagline: 'Designed for Modern Living',
    animation: 'fade-reveal',
  },
  scenes: [
    {
      imageUrl: DEMO_IMAGES[0],
      durationFrames: 75,
      zoom: { from: 1.0, to: 1.06 },
      easing: 'easeInOut',
      transition: 'fade',
      transitionDurationFrames: 30,
      callouts: [
        {
          text: 'Premium Comfort',
          subtitle: 'Engineered for All-Day Relaxation',
          position: 'bottom-left',
          startFrame: 15,
          durationFrames: 50,
          animation: 'fade-in',
          style: 'badge',
        },
      ],
    },
    {
      imageUrl: DEMO_IMAGES[1],
      durationFrames: 70,
      zoom: { from: 1.05, to: 1.0 },
      easing: 'easeInOut',
      transition: 'slide-left',
      transitionDurationFrames: 25,
      callouts: [
        {
          text: 'Solid Oak Frame',
          subtitle: 'Built to Last a Lifetime',
          position: 'top-right',
          startFrame: 12,
          durationFrames: 45,
          animation: 'slide-up',
          style: 'caption',
        },
      ],
    },
    {
      imageUrl: DEMO_IMAGES[2],
      durationFrames: 80,
      zoom: { from: 1.0, to: 1.08 },
      panX: { from: -5, to: 5 },
      easing: 'easeOut',
      transition: 'fade',
      transitionDurationFrames: 25,
      callouts: [],
    },
  ],
  outro: {
    type: 'outro',
    durationFrames: 75,
    headline: 'Milano 3-Seat Sofa',
    subline: '200 × 85 × 90 cm',
    lifestyleLine: 'The Perfect Centerpiece for Your Living Room',
    ctaText: 'Shop Now',
    animation: 'specs-cascade',
  },
  totalDurationFrames: 0, // Will be calculated
};

// Calculate demo script total duration
DEMO_SCRIPT.totalDurationFrames = (() => {
  let total = 0;
  if (DEMO_SCRIPT.intro) total += DEMO_SCRIPT.intro.durationFrames;
  for (let i = 0; i < DEMO_SCRIPT.scenes.length; i++) {
    total += DEMO_SCRIPT.scenes[i].durationFrames;
    if (i < DEMO_SCRIPT.scenes.length - 1) {
      total -= DEMO_SCRIPT.scenes[i].transitionDurationFrames;
    }
  }
  if (DEMO_SCRIPT.outro) total += DEMO_SCRIPT.outro.durationFrames;
  return total;
})();

export const RemotionRoot: React.FC = () => {
  const holdDuration = 40;
  const transitionDuration = 20;
  const imageCount = DEMO_IMAGES.length;
  const totalDuration =
    imageCount * holdDuration - (imageCount - 1) * transitionDuration;

  return (
    <>
      {/* Legacy: Simple crossfade spin */}
      <Composition
        id="ProductSpin"
        component={ProductSpin}
        schema={productSpinSchema}
        durationInFrames={totalDuration}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          images: DEMO_IMAGES,
          productName: 'Milano 3-Seat Sofa',
          brandName: 'Bellona',
          dimensions: '200 × 85 × 90 cm',
          backgroundColor: '#f5f5f5',
          textColor: '#1a1a1a',
          transitionDuration: transitionDuration,
          holdDuration: holdDuration,
        }}
      />

      {/* New: AI Motion Script driven video */}
      <Composition
        id="MotionVideo"
        component={MotionVideo}
        durationInFrames={DEMO_SCRIPT.totalDurationFrames}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          motionScript: DEMO_SCRIPT,
        }}
      />
    </>
  );
};
