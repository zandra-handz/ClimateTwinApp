import { View, Text, Keyboard, Dimensions, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ActionsFooter from "@/app/components/ActionsFooter";
import { StatusBar } from "expo-status-bar";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import useTreasures from "@/app/hooks/useTreasures";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFriends from "../../hooks/useFriends";
import Picker from "@/app/components/Picker";
import TextInputBlock from "@/app/components/TextInputBlock";


interface Friend {
  id: number;
  username: string;
}

const give = () => {
  const { id } = useLocalSearchParams<{ id: number }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const { friendId } = useLocalSearchParams<{ friendId: string | null }>();

  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { friends, friendsDropDown } = useFriends();  
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const { viewingTreasure, handleGiftTreasure, giftTreasureMutation } = useTreasures();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  

  const { width, height } = Dimensions.get("window");

  const editedTextRef = useRef(null);

  const oneThirdHeight = height / 3;
  const oneHalfHeight = height / 2;

  const [selectedFriendProfile, setSelectedFriendProfile] = useState<Friend | null>(null);


  useEffect(() => {
    if (giftTreasureMutation.isSuccess) {
      showAppMessage(true, null, `${descriptor} sent!`);
      router.replace('(treasures)/');
    }

  }, [giftTreasureMutation.isSuccess]);


  useEffect(() => {
    if (giftTreasureMutation.isError) {
      showAppMessage(true, null, `Oops! ${descriptor} not sent.`);
    }

  }, [giftTreasureMutation.isError]);


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


  const handleFriendSelect = (selectedValue: Friend) => {
    setSelectedFriendProfile(selectedValue); 
  };

  const handleGift = () => {
    if (friendId && id) {
      //console.log("attempting to send treasure", friendId, id);
      handleGiftTreasure(id, friendId, editedTextRef.current.getText());
    }
  };

  return (
    <> 
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {/* {!isKeyboardVisible && (
            <Picker
              items={friends} // Passing label/value pairs (friendsDropDown)
              onSelect={handleFriendSelect} // Handling the selection
            />
          )} */}
          <View style={{ flex: 1,  marginBottom: 10 }}>
            <TextInputBlock
              width={"100%"}
              height={'100%'}
              ref={editedTextRef}
              autoFocus={true}
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
  
        </View>
 
        <ActionsFooter 
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
