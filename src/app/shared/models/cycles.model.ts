import { StructureCycles } from './structure-cycles.model';

export interface Cycles {
  name: string;
  availableEntities: number;
  priority: string;
  structure: StructureCycles[];
}
