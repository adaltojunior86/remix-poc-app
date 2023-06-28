import { db } from '~/api/services/db.server';

export async function getAllModules() {
  const modules = await db.module.findMany();
  return modules;
}

export async function getModuleById(id: number) {
  const module = await db.module.findUnique({
    where: { id },
  });
  return module;
}
