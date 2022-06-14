import { Status } from '../../types';

function updateStatusFailure(createdAt: number, error: Error): Status {
  const now = Date.now();
  return {
    status: 'FAILURE',
    createdAt: createdAt,
    updatedAt: now,
    runtime: now - createdAt,
    error: error,
  };
}

export default updateStatusFailure;
