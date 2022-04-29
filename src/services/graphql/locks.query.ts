import { gql } from '@apollo/client';

const exploreLocks = gql`
  query Locks($userId: String!, $offset: Int, $limit: Int) {
    api_locks_aggregate {
      aggregate {
        count
      }
    }
    api_locks(
      where: { userId: { _eq: $userId } }
      limit: $limit
      offset: $offset
      order_by: { id: desc }
    ) {
      id
      name
      chainId
      network
      cid
      userId
      createdAt
      lockType
      status
    }
  }
`;

export default exploreLocks;
