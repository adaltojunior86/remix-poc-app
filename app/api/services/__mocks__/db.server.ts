import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import type { db as Database } from '~/api/services/db.server';

const db = mockDeep<typeof Database>();

beforeEach(() => {
  mockReset(db);
});

export { db };
