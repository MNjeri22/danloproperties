import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const enquiries = sqliteTable('enquiries', {
 id: text('id').primaryKey(), createdAt: integer('created_at').notNull(), status: text('status').notNull().default('new'),
 name: text('name').notNull(), email: text('email').notNull(), phone: text('phone').notNull().default(''),
 type: text('type').notNull(), propertyId: text('property_id').notNull().default(''), propertyLabel: text('property_label').notNull().default(''),
 message: text('message').notNull(), visitDate: text('visit_date').notNull().default(''), visitTime: text('visit_time').notNull().default(''),
 emailStatus: text('email_status').notNull().default('pending'), emailProviderId: text('email_provider_id'), emailAttemptedAt: integer('email_attempted_at'), emailAttempts: integer('email_attempts').notNull().default(0), sourceHash: text('source_hash').notNull(), contactedAt: integer('contacted_at'),
}, table=>[index('enquiry_created_idx').on(table.createdAt),index('enquiry_source_idx').on(table.sourceHash,table.createdAt)]);
