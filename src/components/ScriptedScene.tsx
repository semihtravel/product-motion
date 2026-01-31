import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing } from 'remotion';
import type { Scene } from '../motion-script-types';
import { SceneCallout } from './SceneCallout';

const EASING_MAP = {
  linear: Easing.linear,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
};

export const ScriptedScene: React.FC<{
  scene: Scene;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}> = ({ scene, backgroundColor, textColor, accentColor }) => {
  const frame = useCurrentFrame();
  const easing = EASING_MAP[scene.easing || 'easeInOut'];

  // Zoom interpolation
  const scale = interpolate(
    frame,
    [0, scene.durationFrames],
    [scene.zoom.from, scene.zoom.to],
    { extrapolateRight: 'clamp', easing }
  );

  // Pan X
  const translateX = scene.panX
    ? interpolate(
        frame,
        [0, scene.durationFrames],
        [scene.panX.from, scene.panX.to],
        { extrapolateRight: 'clamp', easing }
      )
    : 0;

  // Pan Y
  const translateY = scene.panY
    ? interpolate(
        frame,
        [0, scene.durationFrames],
        [scene.panY.from, scene.panY.to],
        { extrapolateRight: 'clamp', easing }
      )
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          willChange: 'transform',
        }}
      >
        <Img
          src={scene.imageUrl}
          maxRetries={3}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Cinematic vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Callouts */}
      {scene.callouts.map((callout, i) => (
        <SceneCallout
          key={i}
          callout={callout}
          textColor={textColor}
          accentColor={accentColor}
          sceneDuration={scene.durationFrames}
        />
      ))}
    </AbsoluteFill>
  );
};
