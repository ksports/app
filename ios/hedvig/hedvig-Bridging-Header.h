//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTAsyncLocalStorage.h>
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif
#import <Firebase.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
#import <CodePush/CodePush.h>
#import <react-native-branch/RNBranch.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import <ReactNativeNavigation/RNNReactView.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <Lottie/Lottie.h>
#import "ReactNativeConfig.h"

@interface RCTAsyncLocalStorage (Private)
- (void)multiGet:(NSArray<NSString *> *)keys callback:(RCTResponseSenderBlock)callback;
- (void)multiSet:(NSArray<NSArray<NSString *> *> *)kvPairs callback:(RCTResponseSenderBlock)callback;
@end

@interface LocalStorage : RCTAsyncLocalStorage
@end
