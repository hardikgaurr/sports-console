import { Sport } from './sport.model';
import { GoverningBody } from './governing-body.model';
import { Organisation } from './organisation.model';
import { Participant } from './participant.model';

export interface SportsCatalogue {
  sports: Sport[];

  governingBodies: GoverningBody[];

  organisations: Organisation[];

  participants: Participant[];
}
