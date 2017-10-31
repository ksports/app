import { combineReducers } from "redux"
import helloReducer from "./hello"
import insuranceReducer from "./insurance"
import chatReducer from "./chat"
import mockedChatReducer from "./mock/chat"
import authenticationReducer from "./authentication"
import assetTrackerReducer from "./assetTracker"
import userReducer from "./user"
import cashbackReducer from "./cashback"
import statusMessageReducer from "./statusMessage"
import dialogReducer from "./dialog"
import bankIdReducer from "./bankid"
import uploadReducer from "./upload"

const rootReducer = (additionalReducers = {}) =>
  combineReducers(
    Object.assign(
      {
        hello: helloReducer,
        insurance: insuranceReducer,
        chat: chatReducer,
        mockedChat: mockedChatReducer,
        authentication: authenticationReducer,
        assetTracker: assetTrackerReducer,
        user: userReducer,
        cashback: cashbackReducer,
        statusMessage: statusMessageReducer,
        dialog: dialogReducer,
        bankid: bankIdReducer,
        upload: uploadReducer
      },
      additionalReducers
    )
  )

export default rootReducer
