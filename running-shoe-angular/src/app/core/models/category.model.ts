import { ExperienceType } from './running-shoe.model';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  experienceType: ExperienceType;
  active?: boolean;
}

