export interface ModuleDefinition {
  name: string;
  title: string;
  purpose: string;
  path: string;
  description: string;
  cover: string;
  descriptionHero: string;
}

export type ModuleEntries = readonly (readonly [string, ModuleDefinition])[];

export type ModuleName<T extends ModuleEntries> = T[number][0];
