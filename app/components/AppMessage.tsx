import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { useGlobalStyles } from '../context/GlobalStylesContext';
import { useAppMessage } from '../context/AppMessageContext';

const AppMessage = ({
  delay = 0,
  resultsDisplayDuration = 1600, // Duration to show results message (default 3 seconds)
  messageDelay = 0, // Delay before the message appears (2 seconds)
}) => {
  const { messageQueue, removeMessage } = useAppMessage();
  const { themeStyles } = useGlobalStyles();
  const [showResultsMessage, setShowResultsMessage] = useState(false);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (messageQueue.length > 0) {
      const message = messageQueue[0]; // Get the first message in the queue

      let timeout;
      let resultsTimeout;

      timeout = setTimeout(() => {
        if (message.result) {
          setShowResultsMessage(true);
          setTimeout(() => {
            // Slide in animation
            Animated.timing(translateY, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }).start();
          }, 200);

          resultsTimeout = setTimeout(() => {
            // Slide back up animation
            Animated.timing(translateY, {
              toValue: -120,
              duration: 120,
              useNativeDriver: true,
            }).start(() => {
              removeMessage(); // Remove the message from the queue once it's finished
              setShowResultsMessage(false);
            });
          }, resultsDisplayDuration);
        }
      }, messageDelay); // Delay before showing the message

      return () => {
        clearTimeout(timeout);
        clearTimeout(resultsTimeout);
      };
    }
  }, [messageQueue, messageDelay, resultsDisplayDuration, translateY, removeMessage]);

  if (!showResultsMessage || messageQueue.length === 0) return null;

  return (
    <View style={[styles.container]}>
      <Animated.View
        style={[styles.textContainer, themeStyles.darkerBackground, { transform: [{ translateY }] }]}
      >
        <Text style={[styles.loadingTextBold, themeStyles.primaryText]}>
          {messageQueue[0]?.resultsMessage}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 10000,
    elevation: 10000,
    width: '100%',
    padding: 10,
    height: 'auto',
    minHeight: 100,
    maxHeight: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    paddingVertical: '3%',
    paddingHorizontal: '4%',
  },
  loadingTextBold: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 0,
  },
});

export default AppMessage;
