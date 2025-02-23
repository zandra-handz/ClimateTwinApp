import { View, Text, Keyboard, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ActionsFooter from "@/app/components/ActionsFooter";
import { StatusBar } from "expo-status-bar";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import useTreasures from "@/app/hooks/useTreasures";
import { useAppMessage } from "../../context/AppMessageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFriends from "../../hooks/useFriends";
import Picker from "@/app/components/Picker";

import TextInputBlock from "@/app/components/TextInputBlock";

const give = () => {
  const { id } = useLocalSearchParams<{ id: number }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { friends, friendsDropDown } = useFriends(); // Assuming friendsDropDown is already a list of { label, value }
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const { viewingTreasure, handleGiftTreasure } = useTreasures();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { width, height } = Dimensions.get("window");

  const editedTextRef = useRef(null);

  const oneThirdHeight = height / 3;
  const oneHalfHeight = height / 2;

  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.setText(text);
      console.log("in parent", editedTextRef.current.getText());
    }
  };

  const handleFriendSelect = (selectedValue: number) => {
    setSelectedFriend(selectedValue);
    console.log("Selected Friend:", selectedValue);
  };

  const handleGift = () => {
    if (selectedFriend && id) {
      console.log("attempting to send treasure", selectedFriend, id);
      handleGiftTreasure(id, selectedFriend, editedTextRef.current.getText());
    }
  };

  return (
    <>
      <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      />
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {!isKeyboardVisible && (
            <Picker
              items={friends} // Passing label/value pairs (friendsDropDown)
              onSelect={handleFriendSelect} // Handling the selection
            />
          )}
          <View style={{ flex: 1, flexGrow: 1 }}>
            <TextInputBlock
              width={"100%"}
              height={!isKeyboardVisible ? oneThirdHeight : oneHalfHeight}
              ref={editedTextRef}
              autoFocus={false}
              title={"Add a message?"}
              helperText={!isKeyboardVisible ? null : "Press enter to exit"}
              iconColor={
                !isKeyboardVisible ? themeStyles.primaryText.color : "red"
              }
              mountingText={""}
              onTextChange={updateNoteEditString}
              multiline={false}
            />
          </View>

          {/* Optionally, display the selected friend */}
          {selectedFriend && <Text>Selected Friend: {selectedFriend}</Text>}
        </View>

        <ActionsFooter
          height={isKeyboardVisible ? 40 : 80}
          onPressLeft={() => router.replace("(treasures)")}
          labelLeft={"Cancel"}
          onPressRight={handleGift}
          labelRight={"Send"}
        />
      </View>
    </>
  );
};

export default give;
