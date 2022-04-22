import { gql } from '@apollo/client';

const lockDetails = gql`
  query LockDetails($lockId: Int!) {
    api_locks_by_pk(id: $lockId) {
      id
      name
      description
      userId
      contractAddress
      tokenId
      thumbnailUrl
      chainId
      contentMimeType
      cid
      cUrl
      lockType
      timeoutHours
      status
      secretKey
      network
    }
  }
`;

export default lockDetails;
