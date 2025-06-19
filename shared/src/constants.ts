import type { Digit, Operation } from './types';

export const SERVER_PORT = 3001;

// Environment-aware configuration
const isDevelopment = process.env.NODE_ENV !== 'production';
export const SERVER_ORIGIN = isDevelopment 
  ? "http://localhost:5173" 
  : "https://maxnumber.framal.xyz";

export const SERVER_URL = isDevelopment 
  ? "http://localhost:3001" 
  : "https://maxnumber.framal.xyz";
export const ALL_DIGIT_CARDS : Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const ALL_OPERATION_CARDS : Operation[] = ["*", "+", "-", "/"];
export const NUMBER_DIGIT_CARDS_IN_GAME = 8;
export const NUMBER_OPERATION_CARDS_IN_GAME = 6;
