import {Status} from '../../types'

export interface SuccessStats {
    prizeLength: number;
    amountsTotal: string;
}

function updateStatusSuccess(createdAt: number, meta: SuccessStats): Status {
  const now = Date.now()
  return {
    status: 'SUCCESS',
    createdAt: createdAt,
    updatedAt: now,
    runtime: now - createdAt,
    meta: meta,
  }
}

export default updateStatusSuccess
