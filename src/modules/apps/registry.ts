import type { ModuleDefinition, ModuleEntries, ModuleName } from "@/shared/types/modules";

import { Tribios } from "./Tribios/registry";

export const appEntries = [["tribios", Tribios]] as const satisfies ModuleEntries;

export type AppName = ModuleName<typeof appEntries>;

export const appModulesMap = new Map<AppName, ModuleDefinition>(appEntries);
