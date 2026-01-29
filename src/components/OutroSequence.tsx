import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import type { OutroScene } from '../motion-script-types';
import { FONT_FAMILY_BODY, FONT_FAMILY_HEADLINE } from '../fonts';
import { adjustColor } from '../utils';

export const OutroSequence: React.FC<{
  outro: OutroScene;
  textColor: string;
  backgroundColor: string;
  accentColor: string;
}> = ({ outro, textColor, backgroundColor, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glass card wrapper shared by all animation styles
  const GlassCard: React.FC<{ opacity: number; children: React.ReactNode }> = ({ opacity, children }) => (
    <div style={{
      opacity,
      backgroundColor: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 20,
      padding: '48px 56px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
      maxWidth: '80%',
    }}>
      {children}
    </div>
  );

  // Accent line between headline and subline
  const AccentLine: React.FC<{ opacity: number }> = ({ opacity }) => (
    <div style={{
      width: 50,
      height: 2,
      background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
      marginTop: 16,
      marginBottom: 16,
      opacity,
    }} />
  );

  const renderFadeReveal = () => {
    const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const lifestyleOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
    const headlineOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
    const lineOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: 'clamp' });
    const sublineOpacity = interpolate(frame, [22, 35], [0, 1], { extrapolateRight: 'clamp' });
    const ctaOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });

    return (
      <GlassCard opacity={cardOpacity}>
        {outro.lifestyleLine && (
          <div style={{
            opacity: lifestyleOpacity * 0.6,
            fontSize: 16,
            fontWeight: 500,
            color: textColor,
            fontFamily: FONT_FAMILY_BODY,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            marginBottom: 16,
          }}>
            {outro.lifestyleLine}
          </div>
        )}

        <div style={{
          opacity: headlineOpacity,
          fontSize: 48,
          fontWeight: 700,
          color: textColor,
          fontFamily: FONT_FAMILY_HEADLINE,
          letterSpacing: '-0.02em',
        }}>
          {outro.headline}
        </div>

        {outro.subline && (
          <>
            <AccentLine opacity={lineOpacity} />
            <div style={{
              fontSize: 24,
              fontWeight: 400,
              color: textColor,
              fontFamily: FONT_FAMILY_BODY,
              opacity: sublineOpacity * 0.7,
            }}>
              {outro.subline}
            </div>
          </>
        )}

        {outro.ctaText && (
          <div style={{
            opacity: ctaOpacity,
            fontSize: 20,
            fontWeight: 600,
            color: '#fff',
            background: `linear-gradient(135deg, ${accentColor}, ${adjustColor(accentColor, -25)})`,
            padding: '14px 36px',
            borderRadius: 30,
            marginTop: 28,
            boxShadow: `0 4px 20px ${accentColor}50`,
            fontFamily: FONT_FAMILY_BODY,
            letterSpacing: '0.02em',
          }}>
            {outro.ctaText}
          </div>
        )}
      </GlassCard>
    );
  };

  const renderSlideUpReveal = () => {
    const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

    const lifestyleY = spring({ frame: Math.max(0, frame - 3), fps, from: 30, to: 0, durationInFrames: 18 });
    const lifestyleOpacity = interpolate(frame, [3, 16], [0, 1], { extrapolateRight: 'clamp' });

    const headlineY = spring({ frame: Math.max(0, frame - 10), fps, from: 40, to: 0, durationInFrames: 18, config: { damping: 10, stiffness: 120 } });
    const headlineOpacity = interpolate(frame, [10, 22], [0, 1], { extrapolateRight: 'clamp' });

    const lineOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' });

    const sublineY = spring({ frame: Math.max(0, frame - 22), fps, from: 30, to: 0, durationInFrames: 18 });
    const sublineOpacity = interpolate(frame, [22, 34], [0, 1], { extrapolateRight: 'clamp' });

    const ctaY = spring({ frame: Math.max(0, frame - 32), fps, from: 25, to: 0, durationInFrames: 15, config: { damping: 8, stiffness: 150 } });
    const ctaOpacity = interpolate(frame, [32, 42], [0, 1], { extrapolateRight: 'clamp' });

    return (
      <GlassCard opacity={cardOpacity}>
        {outro.lifestyleLine && (
          <div style={{
            opacity: lifestyleOpacity * 0.6,
            transform: `translateY(${lifestyleY}px)`,
            fontSize: 16, fontWeight: 500, color: textColor,
            fontFamily: FONT_FAMILY_BODY, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, marginBottom: 16,
          }}>
            {outro.lifestyleLine}
          </div>
        )}

        <div style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: 48, fontWeight: 700, color: textColor,
          fontFamily: FONT_FAMILY_HEADLINE, letterSpacing: '-0.02em',
        }}>
          {outro.headline}
        </div>

        {outro.subline && (
          <>
            <AccentLine opacity={lineOpacity} />
            <div style={{
              opacity: sublineOpacity * 0.7,
              transform: `translateY(${sublineY}px)`,
              fontSize: 24, fontWeight: 400, color: textColor,
              fontFamily: FONT_FAMILY_BODY,
            }}>
              {outro.subline}
            </div>
          </>
        )}

        {outro.ctaText && (
          <div style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            fontSize: 20, fontWeight: 600, color: '#fff',
            background: `linear-gradient(135deg, ${accentColor}, ${adjustColor(accentColor, -25)})`,
            padding: '14px 36px', borderRadius: 30, marginTop: 28,
            boxShadow: `0 4px 20px ${accentColor}50`,
            fontFamily: FONT_FAMILY_BODY, letterSpacing: '0.02em',
          }}>
            {outro.ctaText}
          </div>
        )}
      </GlassCard>
    );
  };

  const renderSpecsCascade = () => {
    const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

    // Lifestyle line first
    const lifestyleOpacity = outro.lifestyleLine
      ? interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' })
      : 0;
    const lifestyleX = spring({ frame: Math.max(0, frame - 5), fps, from: 50, to: 0, durationInFrames: 20, config: { damping: 10, stiffness: 100 } });

    // Build cascade items
    const items: { text: string; type: 'headline' | 'subline' | 'cta' }[] = [];
    items.push({ text: outro.headline, type: 'headline' });
    if (outro.subline) items.push({ text: outro.subline, type: 'subline' });
    if (outro.ctaText) items.push({ text: outro.ctaText, type: 'cta' });

    return (
      <GlassCard opacity={cardOpacity}>
        {outro.lifestyleLine && (
          <div style={{
            opacity: lifestyleOpacity * 0.6,
            transform: `translateX(${lifestyleX}px)`,
            fontSize: 16, fontWeight: 500, color: textColor,
            fontFamily: FONT_FAMILY_BODY, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, marginBottom: 16,
            alignSelf: 'flex-start',
          }}>
            {outro.lifestyleLine}
          </div>
        )}

        {items.map((item, i) => {
          const delay = 12 + i * 12;
          const itemOpacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' });
          const itemX = spring({ frame: Math.max(0, frame - delay), fps, from: 60, to: 0, durationInFrames: 20, config: { damping: 10, stiffness: 100 } });

          if (item.type === 'cta') {
            return (
              <div key={i} style={{
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
                fontSize: 20, fontWeight: 600, color: '#fff',
                background: `linear-gradient(135deg, ${accentColor}, ${adjustColor(accentColor, -25)})`,
                padding: '14px 36px', borderRadius: 30, marginTop: 24,
                boxShadow: `0 4px 20px ${accentColor}50`,
                fontFamily: FONT_FAMILY_BODY, letterSpacing: '0.02em',
              }}>
                {item.text}
              </div>
            );
          }

          const isHeadline = item.type === 'headline';

          return (
            <React.Fragment key={i}>
              <div style={{
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
                fontSize: isHeadline ? 44 : 24,
                fontWeight: isHeadline ? 700 : 400,
                color: textColor,
                fontFamily: isHeadline ? FONT_FAMILY_HEADLINE : FONT_FAMILY_BODY,
                letterSpacing: isHeadline ? '-0.02em' : '0.02em',
              }}>
                {item.text}
              </div>
              {/* Accent line after headline */}
              {isHeadline && items.length > 1 && (
                <AccentLine opacity={interpolate(frame, [delay + 8, delay + 18], [0, 1], { extrapolateRight: 'clamp' })} />
              )}
            </React.Fragment>
          );
        })}
      </GlassCard>
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
      {outro.animation === 'fade-reveal' && renderFadeReveal()}
      {outro.animation === 'slide-up-reveal' && renderSlideUpReveal()}
      {outro.animation === 'specs-cascade' && renderSpecsCascade()}
    </AbsoluteFill>
  );
};
