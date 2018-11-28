import * as React from 'react';
import { Image, TouchableOpacity, AsyncStorage } from 'react-native';
import styled from '@sampettersson/primitives';
import { Store } from 'src/setupApp';
import { Mutation } from 'react-apollo';
import { RestartOfferContainer } from '../features/chat/containers/restartOffer';
import { deleteToken } from 'src/graphql/context';
import { setLayout } from 'src/navigation/layouts/setLayout';
import gql from 'graphql-tag';
import { getChatLayout } from 'src/navigation/layouts/chatLayout';
import { ModalDialog } from './ModalDialog';
import { Delayed } from './Delayed';
import { TranslationsConsumer } from 'src/components/translations/consumer';

const RestartButton = styled(TouchableOpacity)({});

const LOGOUT_MUTATION = gql`
  mutation LogoutMutation {
    logout
  }
`;

export const RestartOfferChat: React.SFC = () => (
  <Mutation mutation={LOGOUT_MUTATION}>
    {(logout, { client }) => (
      <RestartOfferContainer>
        {(state) => (
          <>
            <RestartButton
              onPress={() => {
                state.updateModalVisibility(true);
              }}
            >
              <Image
                source={require('../../assets/icons/navigation/topBar/ios/restart.png')}
              />
            </RestartButton>

            <Delayed
              mountChildren={state.showModal}
              mountChildrenAfter={100}
              unmountChildrenAfter={100}
            >
              <ModalDialog
                title={
                  <TranslationsConsumer textKey="RESTART_OFFER_CHAT_TITLE">
                    {(text) => text}
                  </TranslationsConsumer>
                }
                paragraph={
                  <TranslationsConsumer textKey="RESTART_OFFER_CHAT_PARAGRAPH">
                    {(text) => text}
                  </TranslationsConsumer>
                }
                confirmButtonTitle={
                  <TranslationsConsumer textKey="RESTART_OFFER_CHAT_BUTTON_CONFIRM">
                    {(text) => text}
                  </TranslationsConsumer>
                }
                dismissButtonTitle={
                  <TranslationsConsumer textKey="RESTART_OFFER_CHAT_BUTTON_DISMISS">
                    {(text) => text}
                  </TranslationsConsumer>
                }
                onConfirm={async () => {
                  state.updateModalVisibility(false);
                  await logout();
                  deleteToken();
                  Store.dispatch({ type: 'DELETE_TOKEN' });
                  Store.dispatch({ type: 'DELETE_TRACKING_ID' });
                  Store.dispatch({ type: 'AUTHENTICATE' });
                  await AsyncStorage.removeItem(
                    '@hedvig:alreadySeenMarketingCarousel',
                  );
                  await setLayout(getChatLayout());
                  setTimeout(() => {
                    client.resetStore();
                  }, 200);
                }}
                onDismiss={() => {
                  state.updateModalVisibility(false);
                }}
              />
            </Delayed>
          </>
        )}
      </RestartOfferContainer>
    )}
  </Mutation>
);
