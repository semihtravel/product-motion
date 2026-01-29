import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import type { MotionScript, TransitionType } from './motion-script-types';
import { ScriptedScene } from './components/ScriptedScene';
import { IntroSequence } from './components/IntroSequence';
import { OutroSequence } from './components/OutroSequence';
import { ProgressBar } from './components/ProgressBar';

function getTransitionPresentation(type: TransitionType) {
  switch (type) {
    case 'fade':
    case 'dissolve':
      return fade();
    case 'slide-left':
      return slide({ direction: 'from-right' });
    case 'slide-right':
      return slide({ direction: 'from-left' });
    case 'slide-up':
      return slide({ direction: 'from-bottom' });
    default:
      return fade();
  }
}

export const MotionVideo: React.FC<{ motionScript: MotionScript }> = ({ motionScript }) => {
  const {
    backgroundColor,
    textColor,
    accentColor,
    scenes,
    intro,
    outro,
  } = motionScript;

  // Calculate scene section duration (all scenes minus overlapping transitions)
  let sceneSectionDuration = 0;
  for (let i = 0; i < scenes.length; i++) {
    sceneSectionDuration += scenes[i].durationFrames;
    if (i < scenes.length - 1) {
      sceneSectionDuration -= scenes[i].transitionDurationFrames;
    }
  }

  const introEnd = intro ? intro.durationFrames : 0;
  const outroStart = introEnd + sceneSectionDuration;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Intro */}
      {intro && (
        <Sequence from={0} durationInFrames={intro.durationFrames}>
          <IntroSequence
            intro={intro}
            textColor={textColor}
            backgroundColor={backgroundColor}
          />
        </Sequence>
      )}

      {/* Scenes with transitions */}
      <Sequence from={introEnd} durationInFrames={sceneSectionDuration}>
        <TransitionSeries>
          {scenes.map((scene, index) => {
            const isLast = index === scenes.length - 1;
            return (
              <React.Fragment key={index}>
                <TransitionSeries.Sequence durationInFrames={scene.durationFrames}>
                  <ScriptedScene
                    scene={scene}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    accentColor={accentColor}
                  />
                </TransitionSeries.Sequence>
                {!isLast && (
                  <TransitionSeries.Transition
                    presentation={getTransitionPresentation(scene.transition)}
                    timing={linearTiming({
                      durationInFrames: scene.transitionDurationFrames,
                    })}
                  />
                )}
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </Sequence>

      {/* Outro */}
      {outro && (
        <Sequence from={outroStart} durationInFrames={outro.durationFrames}>
          <OutroSequence
            outro={outro}
            textColor={textColor}
            backgroundColor={backgroundColor}
            accentColor={accentColor}
          />
        </Sequence>
      )}

      {/* Progress bar */}
      <ProgressBar color={accentColor} />
    </AbsoluteFill>
  );
};
