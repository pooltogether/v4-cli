// @ts-nocheck
import {Status} from '../../types'

function createStatus(): Status {
  return {
    status: 'LOADING',
    createdAt: Date.now(),
  }
}

export default createStatus
