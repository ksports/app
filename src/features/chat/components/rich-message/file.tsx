import * as React from 'react';
import { TouchableOpacity, Linking, View } from 'react-native';
import styled from '@sampettersson/primitives';
import path from 'path';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { File } from 'src/components/icons/File';

import {
  StyledDefaultUserMessageText,
  StyledUserChatMessage,
} from '../../styles/chat';
import { Spacing } from 'src/components/Spacing';

import { isImageMessage } from './utils';
import { Props } from './types';
import { ImageMessage } from './image';
import { TextMessage } from './text';

const Content = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const FileQuery = gql`
  query File($key: String!) {
    file(key: $key) {
      signedUrl
    }
  }
`;

interface Data {
  file: {
    signedUrl: string;
  };
}

export const FileMessage: React.SFC<Props> = ({
  message,
  withMargin,
  index,
  fromUser,
}) => {
  const key = message.body.key;
  const extension = path.extname(key || '');

  return (
    <Query<Data>
      query={FileQuery}
      variables={{
        key: key,
      }}
    >
      {({ data, loading, error }) => {
        if (error) {
          return (
            <TextMessage
              fromUser
              message={{
                ...message,
                body: { text: 'Kunde inte ladda fil...' },
              }}
              withMargin={withMargin}
              index={index}
            />
          );
        }

        if (loading || !data) {
          return (
            <TextMessage
              fromUser
              message={{ ...message, body: { text: 'Laddar...' } }}
              withMargin={withMargin}
              index={index}
            />
          );
        }

        if (isImageMessage(data!.file.signedUrl)) {
          return (
            <ImageMessage
              fromUser
              message={{ ...message, body: { text: data!.file.signedUrl } }}
              withMargin={withMargin}
              index={index}
            />
          );
        }

        return (
          <TouchableOpacity
            accessibilityLabel="Ladda ner fil"
            accessibilityComponentType="button"
            onPress={() => Linking.openURL(data!.file.signedUrl)}
          >
            <StyledUserChatMessage withMargin={withMargin}>
              <Content>
                <File width={20} height={25} />
                <Spacing width={5} />
                <StyledDefaultUserMessageText fromUser={fromUser}>
                  {extension.replace('.', '')} fil uppladdad
                </StyledDefaultUserMessageText>
              </Content>
            </StyledUserChatMessage>
          </TouchableOpacity>
        );
      }}
    </Query>
  );
};
