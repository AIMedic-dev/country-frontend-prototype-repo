import { gql } from '@apollo/client';
export const SEND_MESSAGE = gql`
  mutation Chat($content: String!) {
    Chat(content: $content) {
      answer
    }
  }
`;
