import { z } from 'zod';

export const productSpinSchema = z.object({
  images: z.array(z.string()).min(1).max(6),
  productName: z.string().optional().default(''),
  brandName: z.string().optional().default(''),
  dimensions: z.string().optional().default(''),
  backgroundColor: z.string().optional().default('#f5f5f5'),
  textColor: z.string().optional().default('#1a1a1a'),
  transitionDuration: z.number().min(5).max(60).optional().default(20),
  holdDuration: z.number().min(15).max(90).optional().default(40),
});

export type ProductSpinProps = z.infer<typeof productSpinSchema>;
