// Main entry point - exports everything!
export * from './database';
export * from './utils';
export * from './book';
export * from './member';
export * from './checkout';
export * from './reports';

// Initialize the database
import { initDB } from './database';
initDB();

