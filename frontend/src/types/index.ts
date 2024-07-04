export * from './drizzle';
export * from './auth';
export * from './bill';
export * from './calendar';
export * from './calendar-event';
export * from './call';
export * from './client';
export * from './client-vehicle';
export * from './company';
export * from './contact';
export * from './driver-license';
export * from './message';
export * from './price';
export * from './price-condition';
export * from './service';
export * from './towing';

/* Put all simple reusable types here */

/**
 * Utility type to deeply make all properties in T optional.
 */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
