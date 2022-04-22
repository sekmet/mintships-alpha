import { gql } from '@apollo/client';

const newLock = gql`
  mutation NewLock($lock: api_locks_insert_input!) {
    insert_api_locks(objects: [$lock]) {
      returning {
        id
        userId
        name
        thumbnailUrl
        cid
        status
        createdAt
      }
    }
  }
`;

export default newLock;
