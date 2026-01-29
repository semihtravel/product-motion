import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface TextOverlayProps {
  text: string;
  position: 'top-left' | 'bottom-right' | 'bottom-left' | 'top-right';
  color: string;
  delay?: number;
  fontSize?: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  position,
  color,
  delay = 0,
  fontSize = 36,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (!text) return null;

  // Fade in with spring at the start
  const fadeIn = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 20,
  });

  // Fade out near the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Slide in from edge
  const slideIn = spring({
    frame: frame - delay,
    fps,
    from: 20,
    to: 0,
    durationInFrames: 25,
  });

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    ...(position.includes('top') ? { top: 40 } : { bottom: 40 }),
    ...(position.includes('left') ? { left: 40 } : { right: 40 }),
  };

  const isLeft = position.includes('left');

  return (
    <div
      style={{
        ...positionStyle,
        opacity,
        transform: `translateX(${isLeft ? -slideIn : slideIn}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '10px 20px',
          borderRadius: 8,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 600,
            letterSpacing: -0.5,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
