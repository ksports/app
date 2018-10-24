import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, TextInput, Platform } from 'react-native';
import firebase from 'react-native-firebase';

import { chatActions, dialogActions } from '../../../../hedvig-redux';
import { StyledTextInputContainer } from '../styles/chat';
import * as selectors from '../state/selectors';
import { SendButton } from '../components/Button';

import { colors } from '@hedviginsurance/brand';
import { Provider } from '../components/upload/context';
import { Picker } from '../components/upload/picker';
import { Buttons } from '../components/pickers/buttons';
import { Picker as GiphyPicker } from '../components/giphy-picker/picker';
import { Provider as GiphyProvider } from '../components/giphy-picker/context';

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    alignSelf: 'stretch',
    height: 40,
    paddingTop: 10,
    paddingRight: 16,
    paddingBottom: 10,
    paddingLeft: 16,
    marginRight: 8,
    backgroundColor: colors.WHITE,
    borderColor: colors.PURPLE,
    borderWidth: 1,
    borderRadius: 24,
    fontSize: 16,
    overflow: 'hidden',
  },
});

class ChatTextInput extends React.Component {
  static propTypes = {
    message: PropTypes.object, // TODO Better definition for the shape of a message - should be reusable
    onChange: PropTypes.func.isRequired,
    isSending: PropTypes.bool,
    inputValue: PropTypes.string,
  };

  static defaultProps = {
    isSending: false,
    inputValue: '',
  };

  state = {
    height: 0,
  };

  _send = (message) => {
    if (this.props.message.header.shouldRequestPushNotifications) {
      this.props.requestPushNotifications();
    }
    if (!this.props.isSending) {
      const inputValue = String(
        typeof message === 'string' ? message : this.props.inputValue,
      );
      this._onTextChange('');
      this.props.send(this.props.message, inputValue);
    }
  };

  _handleContentSizeChange = (event) => {
    if (event && event.nativeEvent && event.nativeEvent.contentSize) {
      this.setState({ height: event.nativeEvent.contentSize.height });
    }
  };

  _onTextChange = (text) => {
    this.props.onChange(text);
  };

  render() {
    const { isSending, inputValue } = this.props;
    return (
      <Provider>
        <GiphyProvider>
          <StyledTextInputContainer>
            <Buttons />
            <TextInput
              ref={(ref) => (this.ref = ref)}
              style={[
                styles.textInput,
                { height: Math.max(40, this.state.height) },
              ]}
              autoFocus
              placeholder="Skriv här..."
              value={inputValue}
              underlineColorAndroid="transparent"
              onChangeText={this._onTextChange}
              multiline
              returnKeyType="send"
              enablesReturnKeyAutomatically
              blurOnSubmit
              onSubmitEditing={this._send}
              editable={!isSending}
              onContentSizeChange={this._handleContentSizeChange}
            />
            <SendButton
              onPress={this._send}
              disabled={!(inputValue && inputValue.length > 0 && !isSending)}
            />
          </StyledTextInputContainer>
          <Picker sendMessage={this._send} />
          <GiphyPicker sendMessage={this._send} />
        </GiphyProvider>
      </Provider>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    message: state.chat.messages[0],
    isSending: selectors.isSendingChatMessage(state),
    inputValue: selectors.getInputValue(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (value) =>
      dispatch({ type: 'CHAT/SET_INPUT_VALUE', payload: value }),
    send: (message, text) =>
      dispatch(
        chatActions.sendChatResponse(message, {
          text,
        }),
      ),
    requestPushNotifications: async () => {
      if (Platform.OS === 'android') {
        return dispatch({
          type: 'PUSH_NOTIFICATIONS/REQUEST_PUSH',
        });
      }

      const enabled = await firebase.messaging().hasPermission();

      if (!enabled) {
        dispatch(
          dialogActions.showDialog({
            title: 'Notifikationer',
            paragraph:
              'Slå på notiser så att du inte missar när Hedvig svarar!',
            confirmButtonTitle: 'Slå på',
            dismissButtonTitle: 'Inte nu',
            onConfirm: () =>
              dispatch({
                type: 'PUSH_NOTIFICATIONS/REQUEST_PUSH',
              }),
            onDismiss: () => {},
          }),
        );
      } else {
        dispatch({
          type: 'PUSH_NOTIFICATIONS/REQUEST_PUSH',
        });
      }
    },
  };
};

const ChatTextInputContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatTextInput);

export default ChatTextInputContainer;
