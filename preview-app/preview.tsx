import React from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { ProductSpin } from '../src/ProductSpin';
import { MotionVideo } from '../src/MotionVideo';
import type { ProductSpinProps } from '../src/types';
import type { MotionScript } from '../src/motion-script-types';

// ============================================
// Legacy mode: Simple ProductSpin via query params
// ============================================

function getParams(): ProductSpinProps {
  const params = new URLSearchParams(window.location.search);
  const imagesRaw = params.get('images') || '';
  const images = imagesRaw ? imagesRaw.split(',').map(decodeURIComponent) : [];

  return {
    images,
    productName: params.get('productName') || '',
    brandName: params.get('brandName') || '',
    dimensions: params.get('dimensions') || '',
    backgroundColor: params.get('backgroundColor') || '#f5f5f5',
    textColor: params.get('textColor') || '#1a1a1a',
    transitionDuration: parseInt(params.get('transitionDuration') || '20', 10),
    holdDuration: parseInt(params.get('holdDuration') || '40', 10),
  };
}

// ============================================
// State
// ============================================

let currentProps = getParams();
let currentScript: MotionScript | null = null;
let reactRoot: ReturnType<typeof createRoot> | null = null;

function getRoot() {
  const container = document.getElementById('player-container');
  if (!container) return null;
  if (!reactRoot) {
    reactRoot = createRoot(container);
  }
  return reactRoot;
}

// ============================================
// Message handlers
// ============================================

window.addEventListener('message', (event) => {
  if (event.data?.type === 'motionScript') {
    currentScript = event.data.script as MotionScript;
    renderMotionVideo();
  } else if (event.data?.type === 'updateProps') {
    currentProps = { ...currentProps, ...event.data.props };
    currentScript = null; // Switch back to legacy mode
    renderLegacyPlayer();
  }
});

// Signal to parent that preview app is ready
window.addEventListener('load', () => {
  window.parent.postMessage({ type: 'previewReady' }, '*');
});

// ============================================
// Renderers
// ============================================

function renderLegacyPlayer() {
  const root = getRoot();
  if (!root) return;

  const { images, transitionDuration, holdDuration } = currentProps;
  const imageCount = Math.max(images.length, 1);
  const totalDuration =
    imageCount * holdDuration - Math.max(0, imageCount - 1) * transitionDuration;

  root.render(
    <Player
      component={ProductSpin}
      inputProps={currentProps}
      durationInFrames={Math.max(totalDuration, 30)}
      fps={30}
      compositionWidth={1080}
      compositionHeight={1080}
      style={{ width: '100%', height: '100%' }}
      loop
      autoPlay
      controls
    />
  );
}

function renderMotionVideo() {
  const root = getRoot();
  if (!root || !currentScript) return;

  root.render(
    <Player
      component={MotionVideo}
      inputProps={{ motionScript: currentScript }}
      durationInFrames={Math.max(currentScript.totalDurationFrames, 30)}
      fps={currentScript.fps || 30}
      compositionWidth={currentScript.width || 1080}
      compositionHeight={currentScript.height || 1080}
      style={{ width: '100%', height: '100%' }}
      playbackRate={0.85}
      loop
      autoPlay
      controls
    />
  );
}

// ============================================
// Initial render
// ============================================

// Check if we have query params (legacy mode) or wait for postMessage (script mode)
if (currentProps.images.length > 0) {
  renderLegacyPlayer();
} else {
  // Show empty state, wait for postMessage
  const root = getRoot();
  if (root) {
    root.render(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#666',
          fontFamily: '-apple-system, sans-serif',
          fontSize: 16,
        }}
      >
        Waiting for motion script...
      </div>
    );
  }
}
