import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Modal, Text, TouchableOpacity, Alert } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { Friend } from "@/src/types/useFriendsTypes";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import TextInputLine from "@/app/components/TextInputLine";
import TextInputBlockForModal from "@/app/components/TextInputBlockForModal";

import FriendPickerEmbedded from "../FriendPickerEmbedded";

const DoubleCheckerWithMessageAndPicker = ({
  isVisible = false,
  toggleVisible,
  singleQuestionText = "single question goes here",
  optionalText = "",
  noButtonText = "go back",
  yesButtonText = "yes",
  onPress = () => console.log("No onpress integrated for double checker"),
}) => {

  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const [timedAutoFocus, setTimedAutoFocus] = useState<boolean>(false);
  const messageRef = useRef(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | undefined>(
    undefined
  );

  const { user } = useUser();

  const defaultMessage = `${user?.username} sent you a gift!`;

  const updateMessage = (text) => {
    if (messageRef && messageRef.current) {
      messageRef.current.setText(text);
    }
  };

  const handleOnPress = () => {
    if (!selectedFriend || !selectedFriend?.friend) {
      return Alert.alert("Error", "Please select a friend first!");
    }
    let message = "None";
    if (messageRef && messageRef.current) {
      message = messageRef.current.getText();

      onPress(messageRef.current.getText(), selectedFriend.friend);
    } else {
      console.log("Oops, no message");
    }
  };

  const handleFriendSelect = (selectedValue: Friend) => {
    console.log(`Friend selected: `, selectedValue.friend_profile?.username);
    // handleGoToGiveScreen(selectedValue.friend);
    setSelectedFriend(selectedValue);
    if (messageRef && messageRef.current && messageRef.current.getText()) {
        messageRef.current.setText(messageRef.current.getText());
    }
  };
  useEffect(() => {
    if (isVisible && !timedAutoFocus) {
      const timer = setTimeout(() => {
        console.log("setting timedAutoFocus after delay");
        setTimedAutoFocus(true);
      }, 100); // short delay

      return () => {
        console.log("clearing timeout");
        clearTimeout(timer);
        setTimedAutoFocus(false); // reset autofocus when isVisible changes or unmounts
      };
    }
    // else {
    //   setTimedAutoFocus(false); // also reset when isVisible becomes false
    // }
  }, [isVisible]);

  const textBlockHeight = 120;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={appContainerStyles.dCBackgroundContainer}>
        <View
          style={[
            appContainerStyles.doubleCheckerWithMessageContainer,
            themeStyles.darkestBackground,
            { borderColor: "teal" },
          ]}
        >
          <View
            style={[
              appContainerStyles.doubleCheckerQuestionContainer,
              { marginBottom: 10 },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[appFontStyles.dCQuestionText, themeStyles.primaryText]}
            >
              {singleQuestionText}
            </Text>
            {optionalText && (
              <Text
                style={[appFontStyles.dCOptionalText, themeStyles.primaryText]}
              >
                {optionalText}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%", height: textBlockHeight }}>
              <FriendPickerEmbedded onSelect={handleFriendSelect} />
            </View>

            <View style={{ width: "50%", height: textBlockHeight }}>
              <TextInputBlockForModal
                ref={messageRef}
                // title={`Message`}
                helperText={null}
                autoFocus={false}
                onTextChange={updateMessage}
                mountingText={defaultMessage}
                multiline={true}
                height={textBlockHeight}
                timedAutoFocus={timedAutoFocus}
                // onSubmitEditing={() => handleNext(index)}
              />
            </View>
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
              <Text
                style={[appFontStyles.dCButtonText, themeStyles.primaryText]}
              >
                {noButtonText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                appContainerStyles.dCYesButton,
                themeStyles.darkestBackground,
                { borderColor: "transparent" },
              ]}
              onPress={handleOnPress}
            >
              <Text
                style={[appFontStyles.dCButtonText, themeStyles.primaryText]}
              >
                {yesButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DoubleCheckerWithMessageAndPicker;
