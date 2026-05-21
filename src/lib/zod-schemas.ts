import { z } from 'zod';

export const authSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const shippingSchema = z.object({
  full_name: z.string().min(2),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  province: z.string().min(2),
  postal_code: z.string().min(3),
  country: z.string().default('PH'),
  notes: z.string().optional(),
  saveAddress: z.boolean().optional()
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  compare_price: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().int().min(0),
  category_id: z.string().uuid().nullable().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true)
});

export type ShippingInput = z.infer<typeof shippingSchema>;
