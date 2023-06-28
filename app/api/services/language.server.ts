import { db } from '~/api/services/db.server';

export async function getAllLanguages() {
  const languages = await db.language.findMany();
  return languages;
}
