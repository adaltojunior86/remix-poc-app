import { Resource, Language } from '@prisma/client';

export interface IModule {
  id: number;
  key: string;
}

export interface IResourceLanguage {
  value: string;
  languageId: number;
}

export interface IResource extends Resource {
  module: IModule;
  translations: IResourceLanguage[];
}

export type { Language };
