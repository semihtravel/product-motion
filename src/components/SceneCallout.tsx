import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import type { Callout } from '../motion-script-types';
import { FONT_FAMILY_BODY, FONT_FAMILY_HEADLINE } from '../fonts';
import { adjustColor } from '../utils';

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'top-left': { position: 'absolute', top: 60, left: 60 },
  'top-center': { position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { position: 'absolute', top: 60, right: 60 },
  'center-left': { position: 'absolute', top: '50%', left: 60, transform: 'translateY(-50%)' },
  'center': { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  'center-right': { position: 'absolute', top: '50%', right: 60, transform: 'translateY(-50%)' },
  'bottom-left': { position: 'absolute', bottom: 60, left: 60 },
  'bottom-center': { position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { position: 'absolute', bottom: 60, right: 60 },
};

interface StyleSet {
  container: React.CSSProperties;
  text: React.CSSProperties;
  subtitle?: React.CSSProperties;
}

function getVisualStyle(
  style: Callout['style'],
  textColor: string,
  accentColor: string,
): StyleSet {
  switch (style) {
    case 'headline':
      return {
        container: {},
        text: {
          fontFamily: FONT_FAMILY_HEADLINE,
          fontSize: 44,
          fontWeight: 700,
          color: textColor,
          textShadow: `0 2px 4px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12)`,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        },
        subtitle: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 20,
          fontWeight: 400,
          color: textColor,
          opacity: 0.65,
          letterSpacing: '0.02em',
          marginTop: 8,
        },
      };

    case 'badge':
      return {
        container: {
          background: `linear-gradient(135deg, ${accentColor}, ${adjustColor(accentColor, -20)})`,
          padding: '10px 24px',
          borderRadius: 28,
          boxShadow: `0 4px 16px ${accentColor}40, 0 2px 4px rgba(0,0,0,0.1)`,
        },
        text: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 22,
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '0.03em',
        },
        subtitle: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 15,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.01em',
          marginTop: 2,
        },
      };

    case 'caption':
      return {
        container: {
          backgroundColor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '12px 20px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        },
        text: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 24,
          fontWeight: 500,
          color: textColor,
        },
        subtitle: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 16,
          fontWeight: 400,
          color: textColor,
          opacity: 0.6,
          marginTop: 4,
        },
      };

    case 'feature-tag':
      return {
        container: {
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          padding: '8px 16px',
          borderRadius: 8,
          borderLeft: `3px solid ${accentColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        },
        text: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 20,
          fontWeight: 600,
          color: accentColor,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
        },
        subtitle: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 14,
          fontWeight: 400,
          color: textColor,
          opacity: 0.6,
          textTransform: 'none' as const,
          letterSpacing: '0.01em',
          marginTop: 2,
        },
      };

    case 'minimal':
    default:
      return {
        container: {},
        text: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 26,
          fontWeight: 300,
          color: textColor,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
        },
        subtitle: {
          fontFamily: FONT_FAMILY_BODY,
          fontSize: 16,
          fontWeight: 300,
          color: textColor,
          opacity: 0.5,
          letterSpacing: '0.06em',
          marginTop: 4,
        },
      };
  }
}

export const SceneCallout: React.FC<{
  callout: Callout;
  textColor: string;
  accentColor: string;
  sceneDuration: number;
}> = ({ callout, textColor, accentColor, sceneDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - callout.startFrame;
  if (relativeFrame < 0 || relativeFrame > callout.durationFrames) return null;

  // Main text display (for typewriter)
  const fullText = callout.text;
  let displayText = fullText;

  // Animation
  let opacity = 1;
  let extraTransform = '';

  switch (callout.animation) {
    case 'fade-in': {
      opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
      break;
    }
    case 'slide-up': {
      opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
      const y = spring({
        frame: relativeFrame, fps, from: 30, to: 0,
        durationInFrames: 22,
        config: { damping: 10, stiffness: 120, mass: 0.8 },
      });
      extraTransform = `translateY(${y}px)`;
      break;
    }
    case 'slide-left': {
      opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
      const x = spring({
        frame: relativeFrame, fps, from: 40, to: 0,
        durationInFrames: 22,
        config: { damping: 10, stiffness: 120, mass: 0.8 },
      });
      extraTransform = `translateX(${x}px)`;
      break;
    }
    case 'slide-right': {
      opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
      const xr = spring({
        frame: relativeFrame, fps, from: -40, to: 0,
        durationInFrames: 22,
        config: { damping: 10, stiffness: 120, mass: 0.8 },
      });
      extraTransform = `translateX(${xr}px)`;
      break;
    }
    case 'scale-pop': {
      const scaleVal = spring({
        frame: relativeFrame, fps, from: 0.2, to: 1,
        durationInFrames: 18,
        config: { damping: 7, stiffness: 180, mass: 0.6 },
      });
      opacity = interpolate(relativeFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
      extraTransform = `scale(${scaleVal})`;
      break;
    }
    case 'typewriter': {
      const chars = Math.floor(
        interpolate(relativeFrame, [0, fullText.length * 3], [0, fullText.length], {
          extrapolateRight: 'clamp',
        })
      );
      displayText = fullText.slice(0, chars);
      opacity = 1;
      break;
    }
  }

  // Fade out near end
  const fadeOut = interpolate(
    relativeFrame,
    [callout.durationFrames - 15, callout.durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  opacity *= fadeOut;

  // Subtitle staggered opacity
  const subtitleOpacity = callout.subtitle
    ? interpolate(relativeFrame, [8, 22], [0, 1], { extrapolateRight: 'clamp' }) * fadeOut
    : 0;

  const positionStyle = POSITION_STYLES[callout.position] || POSITION_STYLES['bottom-left'];
  const styles = getVisualStyle(callout.style, textColor, accentColor);

  return (
    <div style={{ ...positionStyle, opacity, transform: extraTransform, zIndex: 10 }}>
      <div style={styles.container}>
        <div style={styles.text}>
          {displayText}
          {callout.animation === 'typewriter' && (
            <span style={{ opacity: frame % 15 < 8 ? 1 : 0, color: accentColor }}>|</span>
          )}
        </div>
        {callout.subtitle && styles.subtitle && (
          <div style={{ ...styles.subtitle, opacity: subtitleOpacity }}>
            {callout.subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
