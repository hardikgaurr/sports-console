import { Sport } from '../models/sport.model';

const now = new Date().toISOString();

export const SPORTS_SEED: Sport[] = [
  {
    id: crypto.randomUUID(),
    name: 'Football',
    description: 'Association football',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Cricket',
    description: 'International cricket',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Basketball',
    description: 'Professional basketball',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Tennis',
    description: 'Professional tennis',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Badminton',
    description: 'Competitive badminton',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Hockey',
    description: 'Field hockey',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
];
