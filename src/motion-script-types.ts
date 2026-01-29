import { z } from 'zod';

// === Enums ===

export const templateTypeSchema = z.enum(['showcase', 'social', 'detail_story']);
export type TemplateType = z.infer<typeof templateTypeSchema>;

export const transitionTypeSchema = z.enum([
  'fade',
  'slide-left',
  'slide-right',
  'slide-up',
  'dissolve',
]);
export type TransitionType = z.infer<typeof transitionTypeSchema>;

export const calloutPositionSchema = z.enum([
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
]);
export type CalloutPosition = z.infer<typeof calloutPositionSchema>;

export const calloutAnimationSchema = z.enum([
  'fade-in',
  'slide-up',
  'slide-left',
  'slide-right',
  'typewriter',
  'scale-pop',
]);
export type CalloutAnimation = z.infer<typeof calloutAnimationSchema>;

export const calloutStyleSchema = z.enum([
  'headline',
  'badge',
  'caption',
  'feature-tag',
  'minimal',
]);
export type CalloutStyle = z.infer<typeof calloutStyleSchema>;

// === Camera ===

export const zoomConfigSchema = z.object({
  from: z.number().min(0.8).max(2.0),
  to: z.number().min(0.8).max(2.0),
});
export type ZoomConfig = z.infer<typeof zoomConfigSchema>;

export const panConfigSchema = z.object({
  from: z.number().min(-30).max(30),
  to: z.number().min(-30).max(30),
});
export type PanConfig = z.infer<typeof panConfigSchema>;

// === Callout ===

export const calloutSchema = z.object({
  text: z.string(),
  subtitle: z.string().optional(),
  position: calloutPositionSchema,
  startFrame: z.number().int().min(0),
  durationFrames: z.number().int().min(5),
  animation: calloutAnimationSchema,
  style: calloutStyleSchema,
});
export type Callout = z.infer<typeof calloutSchema>;

// === Scene ===

export const sceneSchema = z.object({
  imageUrl: z.string(),
  durationFrames: z.number().int().min(15).max(180),
  zoom: zoomConfigSchema,
  panX: panConfigSchema.optional(),
  panY: panConfigSchema.optional(),
  easing: z.enum(['linear', 'easeIn', 'easeOut', 'easeInOut']).optional().default('easeInOut'),
  transition: transitionTypeSchema,
  transitionDurationFrames: z.number().int().min(5).max(45),
  callouts: z.array(calloutSchema).max(3),
  _analysis: z.object({
    detectedAngle: z.string().optional(),
    detectedFeatures: z.array(z.string()).optional(),
    recommendedFocus: z.string().optional(),
  }).optional(),
});
export type Scene = z.infer<typeof sceneSchema>;

// === Intro / Outro ===

export const introAnimationSchema = z.enum(['fade-reveal', 'slide-up-reveal', 'scale-reveal']);

export const introSceneSchema = z.object({
  type: z.literal('intro'),
  durationFrames: z.number().int().min(15).max(90),
  brandName: z.string().optional(),
  productName: z.string(),
  tagline: z.string().optional(),
  animation: introAnimationSchema,
});
export type IntroScene = z.infer<typeof introSceneSchema>;

export const outroAnimationSchema = z.enum(['fade-reveal', 'slide-up-reveal', 'specs-cascade']);

export const outroSceneSchema = z.object({
  type: z.literal('outro'),
  durationFrames: z.number().int().min(15).max(90),
  headline: z.string(),
  subline: z.string().optional(),
  lifestyleLine: z.string().optional(),
  ctaText: z.string().optional(),
  animation: outroAnimationSchema,
});
export type OutroScene = z.infer<typeof outroSceneSchema>;

// === Full Motion Script ===

export const motionScriptSchema = z.object({
  version: z.literal(1),
  template: templateTypeSchema,
  fps: z.number().int().min(24).max(60).default(30),
  width: z.number().int().default(1080),
  height: z.number().int().default(1080),
  backgroundColor: z.string().default('#f5f5f5'),
  textColor: z.string().default('#1a1a1a'),
  accentColor: z.string().default('#3b82f6'),
  productName: z.string().optional(),
  brandName: z.string().optional(),
  dimensions: z.string().optional(),
  intro: introSceneSchema.optional(),
  scenes: z.array(sceneSchema).min(1).max(6),
  outro: outroSceneSchema.optional(),
  totalDurationFrames: z.number().int(),
});
export type MotionScript = z.infer<typeof motionScriptSchema>;

// === Helper ===

export function calculateTotalDuration(script: MotionScript): number {
  let total = 0;
  if (script.intro) total += script.intro.durationFrames;
  for (let i = 0; i < script.scenes.length; i++) {
    total += script.scenes[i].durationFrames;
    if (i < script.scenes.length - 1) {
      total -= script.scenes[i].transitionDurationFrames;
    }
  }
  if (script.outro) total += script.outro.durationFrames;
  return total;
}
