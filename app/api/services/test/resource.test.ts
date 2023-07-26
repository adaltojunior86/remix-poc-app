import { it, expect, describe, vi } from 'vitest';
import { findById } from '../resource.server';
import { db } from '../__mocks__/db.server';

vi.mock('../db.server');

describe('testing resources api', () => {
  it('Should return resource by id', async () => {
    db.resource.findFirst.mockResolvedValue({
      id: 1,
      key: 'test',
      moduleId: 1,
    });

    const resource = await findById(1);
    expect(resource).toEqual({
      id: 1,
      key: 'test',
      moduleId: 1,
    });
  });

  it('Should throw error if resource not found', async () => {
    db.resource.findFirst.mockResolvedValue(null);
    await expect(findById(1)).rejects.toThrowError('Resource not found');
  });
});
