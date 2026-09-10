export type ApplicationCategory = "document" | "file" | "media" | "system" | "utility";

export type ApplicationStatus = "available" | "disabled" | "unavailable";

export interface ApplicationManifest {
  key: string;
  name: string;
  category: ApplicationCategory;
  description: string;
  entry: string;
  link: `/tribios/library/${string}`;
  status: ApplicationStatus;
  queueable: boolean;
}
