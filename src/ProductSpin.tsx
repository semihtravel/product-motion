import React from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ProductImage } from './components/ProductImage';
import { TextOverlay } from './components/TextOverlay';
import { ProgressBar } from './components/ProgressBar';
import type { ProductSpinProps } from './types';
import { productSpinSchema } from './types';

export { productSpinSchema };

export const ProductSpin: React.FC<ProductSpinProps> = ({
  images,
  productName,
  brandName,
  dimensions,
  backgroundColor,
  textColor,
  transitionDuration,
  holdDuration,
}) => {
  const { fps } = useVideoConfig();

  if (!images || images.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: textColor,
            fontSize: 36,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            opacity: 0.5,
          }}
        >
          Upload images to preview
        </span>
      </AbsoluteFill>
    );
  }

  // Build the title text
  const titleText = [brandName, productName].filter(Boolean).join(' — ');

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Image transitions */}
      <TransitionSeries>
        {images.map((src, index) => {
          const isLast = index === images.length - 1;
          const zoomDirection = index % 2 === 0 ? 'in' : 'out';

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={holdDuration}>
                <ProductImage
                  src={src}
                  backgroundColor={backgroundColor}
                  zoomDirection={zoomDirection as 'in' | 'out'}
                  holdDuration={holdDuration}
                />
              </TransitionSeries.Sequence>

              {/* Add crossfade transition between images (not after last) */}
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({
                    durationInFrames: transitionDuration,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {/* Text overlays */}
      {titleText && (
        <TextOverlay
          text={titleText}
          position="top-left"
          color={textColor}
          delay={5}
          fontSize={38}
        />
      )}

      {dimensions && (
        <TextOverlay
          text={dimensions}
          position="bottom-right"
          color={textColor}
          delay={15}
          fontSize={28}
        />
      )}

      {/* Progress bar */}
      <ProgressBar color="#3b82f6" />
    </AbsoluteFill>
  );
};
