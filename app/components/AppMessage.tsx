import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { useGlobalStyles } from '../context/GlobalStylesContext';
import { useAppMessage } from '../context/AppMessageContext'; 

//simple temporary popup message to let user know if action was successful
//does not affect flow of app
//I'm not super in love with this approach but it will be useful
//and speed along development

//...except then i threw it in a context which i'm also not sure of/might change
// now this is just a UI for the message context, nothing gets passed into this
//BUT it is responsible for nulling out the message after the animation finishes


const AppMessage = ({   
  delay = 0,  
  resultsDisplayDuration = 1600, // Duration to show results message (default 3 seconds)
  messageDelay = 0, // Delay before the message appears (2 seconds)
}) => { 
  const [showResultsMessage, setShowResultsMessage] = useState(false); // State for showing results message
  const { appMessageData, hideAppMessage } = useAppMessage();
  const { themeStyles } = useGlobalStyles();
  
  const translateY = useRef(new Animated.Value(-100)).current; // Start off-screen, above the view

  useEffect(() => {
    let timeout;
    let resultsTimeout;

    timeout = setTimeout(() => { 
      if (messageData.result) { 
        setShowResultsMessage(true); 
        
        setTimeout(() => {
          // Slide in
          Animated.timing(translateY, {
            toValue: 0, 
            duration: 120,  
            useNativeDriver: true,
          }).start();
        }, 200);

        resultsTimeout = setTimeout(() => {  
          // Slide back up
          Animated.timing(translateY, {
            toValue: -120, 
            duration: 120, 
            useNativeDriver: true,
          }).start(() => endAnimation()); // Hide when done
        }, resultsDisplayDuration);
      }
    }, messageDelay); // Delay before showing message

    return () => {
      clearTimeout(timeout);
      clearTimeout(resultsTimeout);
    };
  }, [messageDelay, delay, messageData, resultsDisplayDuration, translateY]);

  const endAnimation = () => {
    setShowResultsMessage(false);
    hideAppMessage();
  };

  if (!showResultsMessage) return null;

  return (
    <View style={styles.container}> 
      {showResultsMessage && (
        <Animated.View
          style={[ 
            styles.textContainer, themeStyles.secondaryBackground,
            {  
              // (sliding)
              transform: [{ translateY: translateY }], 
            },
          ]}
        >
          <Text style={[styles.loadingTextBold, themeStyles.primaryText]}>
            {appMessageData.resultsMessage}
          </Text>
        </Animated.View>
      )} 
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,  
    left: 0, 
    //transform: [{ translateX: '-50%' }, { translateY: '-50%' }], // Offsets by 50% of the element's width/height
    zIndex: 10000,
    elevation: 10000,
    width: '100%', // Adjust width as needed
    padding: 10,
    height: 'auto',
    minHeight: 80,
    maxHeight: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20, 
  },
  textContainer: { 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    alignContent: 'center',
    borderRadius: 20,
    paddingVertical: '3%',
    paddingHorizontal: '4%', 
    zIndex: 10000,
    elevation: 10000,
  }, 
  loadingTextBold: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingBottom: 0,
  },
});

export default AppMessage;