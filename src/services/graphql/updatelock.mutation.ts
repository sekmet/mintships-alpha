import { gql } from '@apollo/client';

const updateLock = gql`
  mutation UpdateLock($lockId: Int!, $changes: api_locks_set_input!) {
    update_api_locks_by_pk(pk_columns: { id: $lockId }, _set: $changes) {
      id
      name
      cid
      userId
      createdAt
      lockType
      status
    }
  }
`;

export default updateLock;
