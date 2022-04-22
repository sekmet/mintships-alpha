import { gql } from '@apollo/client';

const ME = gql`
  query Me($userId: String!) {
    users(
      where: { _or: [{ username: { _eq: $userId } }, { id: { _eq: $userId } }] }
    ) {
      id
      username
      email
      bio
      instagramUsername
      twitterUsername
      websiteUrl
      createdAt
    }
  }
`;

export default ME;
