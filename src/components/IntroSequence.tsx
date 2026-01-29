import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import type { IntroScene } from '../motion-script-types';
import { FONT_FAMILY_BODY, FONT_FAMILY_HEADLINE } from '../fonts';

export const IntroSequence: React.FC<{
  intro: IntroScene;
  textColor: string;
  backgroundColor: string;
}> = ({ intro, textColor, backgroundColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitOpacity = interpolate(
    frame,
    [intro.durationFrames - 15, intro.durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const renderFadeReveal = () => {
    const brandOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });

    // Decorative line reveal
    const lineWidth = spring({
      frame: Math.max(0, frame - 12), fps, from: 0, to: 60,
      durationInFrames: 20,
      config: { damping: 12, stiffness: 100 },
    });
    const lineOpacity = interpolate(frame, [12, 22], [0, 0.3], { extrapolateRight: 'clamp' });

    // Word-by-word reveal for product name
    const words = intro.productName.split(' ');

    // Tagline
    const taglineOpacity = intro.tagline
      ? interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
      : 0;

    return (
      <>
        {intro.brandName && (
          <div style={{
            opacity: Math.min(brandOpacity, exitOpacity),
            fontSize: 24,
            fontWeight: 500,
            color: textColor,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            fontFamily: FONT_FAMILY_BODY,
            marginBottom: 16,
          }}>
            {intro.brandName}
          </div>
        )}

        <div style={{
          width: lineWidth,
          height: 2,
          backgroundColor: textColor,
          opacity: Math.min(lineOpacity, exitOpacity),
          marginBottom: 20,
        }} />

        <div style={{
          display: 'flex',
          gap: 16,
          opacity: exitOpacity,
          flexWrap: 'wrap' as const,
          justifyContent: 'center',
        }}>
          {words.map((word, i) => {
            const wordDelay = 15 + i * 6;
            const wordOpacity = interpolate(frame, [wordDelay, wordDelay + 10], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const wordY = spring({
              frame: Math.max(0, frame - wordDelay), fps, from: 25, to: 0,
              durationInFrames: 18,
              config: { damping: 12, stiffness: 100 },
            });
            return (
              <span key={i} style={{
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                display: 'inline-block',
                fontSize: 54,
                fontWeight: 700,
                color: textColor,
                fontFamily: FONT_FAMILY_HEADLINE,
                letterSpacing: '-0.02em',
              }}>
                {word}
              </span>
            );
          })}
        </div>

        {intro.tagline && (
          <div style={{
            opacity: Math.min(taglineOpacity, exitOpacity) * 0.65,
            fontSize: 22,
            fontWeight: 400,
            color: textColor,
            fontFamily: FONT_FAMILY_BODY,
            letterSpacing: '0.04em',
            marginTop: 16,
          }}>
            {intro.tagline}
          </div>
        )}
      </>
    );
  };

  const renderSlideUpReveal = () => {
    const brandY = spring({ frame: Math.max(0, frame - 5), fps, from: 40, to: 0, durationInFrames: 18, config: { damping: 12, stiffness: 100 } });
    const brandOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' });

    const lineWidth = spring({
      frame: Math.max(0, frame - 14), fps, from: 0, to: 60,
      durationInFrames: 20,
      config: { damping: 12, stiffness: 100 },
    });
    const lineOpacity = interpolate(frame, [14, 24], [0, 0.3], { extrapolateRight: 'clamp' });

    const productY = spring({ frame: Math.max(0, frame - 18), fps, from: 50, to: 0, durationInFrames: 20, config: { damping: 10, stiffness: 100 } });
    const productOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: 'clamp' });

    const taglineY = spring({ frame: Math.max(0, frame - 30), fps, from: 30, to: 0, durationInFrames: 18 });
    const taglineOpacity = intro.tagline
      ? interpolate(frame, [30, 42], [0, 1], { extrapolateRight: 'clamp' })
      : 0;

    return (
      <>
        {intro.brandName && (
          <div style={{
            opacity: Math.min(brandOpacity, exitOpacity),
            transform: `translateY(${brandY}px)`,
            fontSize: 24, fontWeight: 500, color: textColor,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            fontFamily: FONT_FAMILY_BODY, marginBottom: 16,
          }}>
            {intro.brandName}
          </div>
        )}

        <div style={{
          width: lineWidth, height: 2, backgroundColor: textColor,
          opacity: Math.min(lineOpacity, exitOpacity), marginBottom: 20,
        }} />

        <div style={{
          opacity: Math.min(productOpacity, exitOpacity),
          transform: `translateY(${productY}px)`,
          fontSize: 54, fontWeight: 700, color: textColor,
          fontFamily: FONT_FAMILY_HEADLINE, letterSpacing: '-0.02em',
        }}>
          {intro.productName}
        </div>

        {intro.tagline && (
          <div style={{
            opacity: Math.min(taglineOpacity, exitOpacity) * 0.65,
            transform: `translateY(${taglineY}px)`,
            fontSize: 22, fontWeight: 400, color: textColor,
            fontFamily: FONT_FAMILY_BODY, letterSpacing: '0.04em', marginTop: 16,
          }}>
            {intro.tagline}
          </div>
        )}
      </>
    );
  };

  const renderScaleReveal = () => {
    const brandScale = spring({ frame: Math.max(0, frame - 3), fps, from: 0.5, to: 1, durationInFrames: 15, config: { damping: 10 } });
    const brandOpacity = interpolate(frame, [3, 15], [0, 1], { extrapolateRight: 'clamp' });

    const lineWidth = spring({
      frame: Math.max(0, frame - 12), fps, from: 0, to: 60,
      durationInFrames: 20,
      config: { damping: 12, stiffness: 100 },
    });
    const lineOpacity = interpolate(frame, [12, 22], [0, 0.3], { extrapolateRight: 'clamp' });

    const productScale = spring({ frame: Math.max(0, frame - 15), fps, from: 0.5, to: 1, durationInFrames: 18, config: { damping: 10 } });
    const productOpacity = interpolate(frame, [15, 28], [0, 1], { extrapolateRight: 'clamp' });

    const taglineOpacity = intro.tagline
      ? interpolate(frame, [30, 42], [0, 1], { extrapolateRight: 'clamp' })
      : 0;

    return (
      <>
        {intro.brandName && (
          <div style={{
            opacity: Math.min(brandOpacity, exitOpacity),
            transform: `scale(${brandScale})`,
            fontSize: 24, fontWeight: 500, color: textColor,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            fontFamily: FONT_FAMILY_BODY, marginBottom: 16,
          }}>
            {intro.brandName}
          </div>
        )}

        <div style={{
          width: lineWidth, height: 2, backgroundColor: textColor,
          opacity: Math.min(lineOpacity, exitOpacity), marginBottom: 20,
        }} />

        <div style={{
          opacity: Math.min(productOpacity, exitOpacity),
          transform: `scale(${productScale})`,
          fontSize: 54, fontWeight: 700, color: textColor,
          fontFamily: FONT_FAMILY_HEADLINE, letterSpacing: '-0.02em',
        }}>
          {intro.productName}
        </div>

        {intro.tagline && (
          <div style={{
            opacity: Math.min(taglineOpacity, exitOpacity) * 0.65,
            fontSize: 22, fontWeight: 400, color: textColor,
            fontFamily: FONT_FAMILY_BODY, letterSpacing: '0.04em', marginTop: 16,
          }}>
            {intro.tagline}
          </div>
        )}
      </>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_FAMILY_BODY,
      }}
    >
      {/* Subtle top/bottom gradient vignette */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
        background: `linear-gradient(180deg, ${backgroundColor}CC 0%, transparent 100%)`,
        pointerEvents: 'none' as const,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: `linear-gradient(0deg, ${backgroundColor}CC 0%, transparent 100%)`,
        pointerEvents: 'none' as const,
      }} />

      {intro.animation === 'fade-reveal' && renderFadeReveal()}
      {intro.animation === 'slide-up-reveal' && renderSlideUpReveal()}
      {intro.animation === 'scale-reveal' && renderScaleReveal()}
    </AbsoluteFill>
  );
};
