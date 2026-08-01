import { Sport } from '../models/sport.model';

const now = new Date().toISOString();

export const SPORT_IDS = {
  football: 'sport-football',
  cricket: 'sport-cricket',
  basketball: 'sport-basketball',
  tennis: 'sport-tennis',
  badminton: 'sport-badminton',
  hockey: 'sport-hockey',
} as const;

export const SPORTS_SEED: Sport[] = [
  {
    id: SPORT_IDS.football,
    name: 'Football',
    description: 'Association football',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SPORT_IDS.cricket,
    name: 'Cricket',
    description: 'International cricket',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SPORT_IDS.basketball,
    name: 'Basketball',
    description: 'Professional basketball',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SPORT_IDS.tennis,
    name: 'Tennis',
    description: 'Professional tennis',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SPORT_IDS.badminton,
    name: 'Badminton',
    description: 'Competitive badminton',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SPORT_IDS.hockey,
    name: 'Hockey',
    description: 'Field hockey',
    governingBodyCount: 1,
    createdAt: now,
    updatedAt: now,
  },
];
