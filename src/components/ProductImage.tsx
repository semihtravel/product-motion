import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from 'remotion';

interface ProductImageProps {
  src: string;
  backgroundColor: string;
  zoomDirection: 'in' | 'out';
  holdDuration: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  backgroundColor,
  zoomDirection,
  holdDuration,
}) => {
  const frame = useCurrentFrame();

  // Ken Burns: gentle zoom in or out over the hold duration
  const scale =
    zoomDirection === 'in'
      ? interpolate(frame, [0, holdDuration], [1.0, 1.06], {
          extrapolateRight: 'clamp',
        })
      : interpolate(frame, [0, holdDuration], [1.06, 1.0], {
          extrapolateRight: 'clamp',
        });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={src}
          maxRetries={3}
          style={{
            maxWidth: '85%',
            maxHeight: '85%',
            objectFit: 'contain',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
