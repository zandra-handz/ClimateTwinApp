import { View, Keyboard  } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ActionsFooter from "@/app/components/ActionsFooter"; 
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
 
import { useTreasures } from "@/src/context/TreasuresContext";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import { useLocalSearchParams, useRouter } from "expo-router";  
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
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const {   handleGiftTreasure, giftTreasureMutation } = useTreasures();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
 

  const editedTextRef = useRef(null);
 

  const [selectedFriendProfile, setSelectedFriendProfile] = useState<Friend | null>(null);


  useEffect(() => {
    if (giftTreasureMutation.isSuccess) {
      showAppMessage(true, null, `${descriptor} sent!`);
     // router.replace('/(treasures)');
      router.back();
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
    //  console.log("in parent", editedTextRef.current.getText());
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
 
          <View style={{  height: 500 }}>
            <TextInputBlock 
              ref={editedTextRef}
              autoFocus={true}
              title={"Add a message?"}
              helperText={!isKeyboardVisible ? "Press enter to exit" : "Press enter to exit"}
              iconColor={
                !isKeyboardVisible ? themeStyles.primaryText.color : "red"
              }
              mountingText={""}
              onTextChange={updateNoteEditString}
              multiline={false}
            />
          </View>
  
        </View>
 

        
   
      </View> 
        

  <ActionsFooter 
    onPressLeft={() => router.back()}
    labelLeft={"Cancel"}
    onPressRight={handleGift}
    labelRight={"Send"}
  /> 
    </>
  );
};

export default give;
