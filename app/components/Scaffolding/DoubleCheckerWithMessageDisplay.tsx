import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Modal, 
  Text, 
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import TextInputLine from "@/app/components/TextInputLine";
import TextInputBlockForModal from "@/app/components/TextInputBlockForModal";

const DoubleCheckerWithMessageDisplay = ({
  isVisible = false,
  toggleVisible,
  singleQuestionText = "single question goes here",
  optionalText = '',
  noButtonText = "go back",
  message='message here'
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
const [ timedAutoFocus, setTimedAutoFocus ] = useState<boolean>(false);
  const messageRef = useRef(null);

  const updateMessage = (text) => {
    if (messageRef && messageRef.current) {
        messageRef.current.setText(text);
    }
  }

  const handleOnPress = () => {
    if (messageRef && messageRef.current) {
        onPress(messageRef.current.getText())

  } else {
    onPress(null);
  }}

  useEffect(() => {
    if (isVisible && !timedAutoFocus) {
      const timer = setTimeout(() => {
        console.log('setting timedAutoFocus after delay');
        setTimedAutoFocus(true);
      }, 100); // short delay
  
      return () => {
        console.log('clearing timeout');
        clearTimeout(timer);
        setTimedAutoFocus(false); // reset autofocus when isVisible changes or unmounts
      };
    } 
    // else {
    //   setTimedAutoFocus(false); // also reset when isVisible becomes false
    // }
  }, [isVisible]);
  

  const textBlockHeight = 100;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={appContainerStyles.dCBackgroundContainer}>
        <View
          style={[
            appContainerStyles.doubleCheckerWithMessageDisplayContainer,
            themeStyles.darkestBackground,
            { borderColor: "teal" },
          ]}
        >
          <View style={[appContainerStyles.doubleCheckerQuestionContainer, {marginBottom: 10}]}>
            <Text numberOfLines={1} style={[appFontStyles.dCQuestionText, themeStyles.primaryText]}>
              {singleQuestionText}
            </Text>
            {optionalText && (
                
            <Text style={[appFontStyles.dCOptionalText, themeStyles.primaryText]}>
              {optionalText} 
            </Text> 
            
        )}
          </View> 
                <View style={{ width: '100%', height: textBlockHeight   }}>
                    <ScrollView contentContainerStyle={{ width: '100%', height: textBlockHeight   }} >
                  <Text>{message}</Text>
                  
                        
                  </ScrollView>
                </View>

          <View style={appContainerStyles.doubleCheckerButtonRow}>
            <TouchableOpacity
              style={[
                appContainerStyles.dCNoButton,
                themeStyles.darkestBackground,
                { borderColor: "transparent" },
              ]}
              onPress={toggleVisible}
            >
              <Text style={[appFontStyles.dCButtonText, themeStyles.primaryText]}>{noButtonText}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                appContainerStyles.dCYesButton,
                themeStyles.darkestBackground,
                { borderColor: "transparent" },
              ]}
              onPress={handleOnPress}
            >
              <Text style={[appFontStyles.dCButtonText, themeStyles.primaryText]}>{yesButtonText}</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DoubleCheckerWithMessageDisplay;
