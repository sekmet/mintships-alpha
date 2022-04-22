import { gql } from '@apollo/client';

const removeLock = gql`
  mutation RemoveLock($lockId: Int!) {
    delete_api_locks_by_pk(id: $lockId) {
      id
      userId
      status
    }
  }
`;

export default removeLock;
