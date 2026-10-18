import { pgTable, text, varchar, integer, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const simulations = pgTable('simulations', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: text('title').notNull(),
  clientName: varchar('client_name', { length: 128 }).default('Guest Client'),
  userPhoto: text('user_photo'),
  hairStyleId: varchar('hair_style_id', { length: 64 }).notNull(),
  hairStyleName: varchar('hair_style_name', { length: 128 }).notNull(),
  hairCategory: varchar('hair_category', { length: 64 }),
  colorHex: varchar('color_hex', { length: 16 }).notNull(),
  colorName: varchar('color_name', { length: 128 }).notNull(),
  colorFamily: varchar('color_family', { length: 64 }).default('natural'),
  secondaryColorHex: varchar('secondary_color_hex', { length: 16 }),
  baseHairLevel: integer('base_hair_level').default(3),
  targetHairLevel: integer('target_hair_level').default(7),
  hairLength: varchar('hair_length', { length: 32 }).default('medium'),
  hairTexture: varchar('hair_texture', { length: 32 }).default('medium'),
  grayPercentage: integer('gray_percentage').default(0),
  formulaJson: jsonb('formula_json').notNull(),
  frontImage: text('front_image'),
  sideImage: text('side_image'),
  backImage: text('back_image'),
  aiAnalysisJson: jsonb('ai_analysis_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const colorPresets = pgTable('color_presets', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  hex: varchar('hex', { length: 16 }).notNull(),
  level: integer('level').notNull(),
  family: varchar('family', { length: 64 }).notNull(),
  description: text('description'),
  undertone: varchar('undertone', { length: 64 }),
})

export const hairStyles = pgTable('hair_styles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  gender: varchar('gender', { length: 32 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  length: varchar('length', { length: 32 }).notNull(),
  description: text('description'),
  texture: varchar('texture', { length: 64 }).default('wavy'),
  trending: integer('trending').default(0),
})

export type Simulation = typeof simulations.$inferSelect
export type NewSimulation = typeof simulations.$inferInsert
export type ColorPreset = typeof colorPresets.$inferSelect
export type HairStyle = typeof hairStyles.$inferSelect
