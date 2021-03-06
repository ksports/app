import { combineReducers } from 'redux';
import insuranceReducer from './insurance';
import chatReducer from './chat';
import mockedChatReducer from './mock/chat';
import authenticationReducer from './authentication';
import userReducer from './user';
import cashbackReducer from './cashback';
import dialogReducer from './dialog';
import bankIdReducer from './bankid';
import uploadReducer from './upload';
import paymentReducer from './payment';

const rootReducer = (additionalReducers = {}) =>
  combineReducers(
    Object.assign(
      {
        insurance: insuranceReducer,
        chat: chatReducer,
        mockedChat: mockedChatReducer,
        authentication: authenticationReducer,
        user: userReducer,
        cashback: cashbackReducer,
        dialog: dialogReducer,
        deprecatedBankId: bankIdReducer,
        upload: uploadReducer,
        payment: paymentReducer,
      },
      additionalReducers,
    ),
  );

export default rootReducer;
