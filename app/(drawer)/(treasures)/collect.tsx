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
import TextInputLine from "@/app/components/TextInputLine";
import TextInputBlock from "@/app/components/TextInputBlock";
import Groq from "@/app/components/Groq";
import useLLMScripts from "@/app/llm/useLLMScripts";
import useAsyncStorageCache from "../../hooks/useAsyncStorageCache";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";
import { useUser } from "@/app/context/UserContext";

const collect = () => {
  const { id } = useLocalSearchParams<{ id: number }>();
  const { base } = useLocalSearchParams<{ base: string | null }>();
  const { user } = useUser();
  const { lastLocationId, lastLatAndLong } = useSurroundingsWS();
  const { yourRoleIsBrilliantNaturalistAndPainter, findMeAWindTreasure } =
    useLLMScripts();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();

  const { getCache } = useAsyncStorageCache(user.id, lastLocationId);

  const [cachedHistory, setCachedHistory] = useState(null);

  const { handleCollectTreasure, collectTreasureMutation } = useTreasures();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useRouter();

  const { width, height } = Dimensions.get("window");

  const descriptorTextRef = useRef(null);

  const editedTextRef = useRef(null);

  const oneThirdHeight = height / 3;
  const oneHalfHeight = height / 2;

  const [prompt, setPrompt] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchCache = async () => {
      const cachedData = await getCache();
      if (cachedData && cachedData.history) {
       // console.log("Fetched cached history:", cachedData.history);
        setCachedHistory(cachedData.history);
      } else {
      //  console.log("No cached history found.");
      }
    };

    fetchCache();
  }, [getCache, base]);

  useEffect(() => {
    if (cachedHistory) {
      let roleData = yourRoleIsBrilliantNaturalistAndPainter();
      let promptData = findMeAWindTreasure(
        lastLatAndLong.latitude,
        lastLatAndLong.longitude,
        cachedHistory
      );
      setPrompt(promptData);
      setRole(roleData);
    }
  }, [cachedHistory]);

  useEffect(() => {
    if (collectTreasureMutation.isSuccess) {
      showAppMessage(true, null, `Treasure collected!`);
      router.back();
    }
  }, [collectTreasureMutation.isSuccess]);

  useEffect(() => {
    if (collectTreasureMutation.isError) {
      showAppMessage(true, null, `Oops! Treasure not collected.`);
    }
  }, [collectTreasureMutation.isError]);

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

  const updateDescriptorString = (text) => {
    if (descriptorTextRef && descriptorTextRef.current) {
      descriptorTextRef.current.setText(text);
      console.log("in parent", descriptorTextRef.current.getText());
    }
  };

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.setText(text);
      console.log("in parent", editedTextRef.current.getText());
    }
  };

  const handleCollect = () => {
    if (base && id && editedTextRef.current) {
      const parsedValue = JSON.parse(base);
      const firstString = parsedValue[0];
      console.log("attempting to collect treasure", base);
      handleCollectTreasure(
        firstString,
        descriptorTextRef.current.getText(),
        editedTextRef.current.getText(),
        null
      );
    }
  };

  return (
    <>
      {/* <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      /> */}
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
          <View style={{ flex: 1, flexGrow: 1}}>

            <View style={{marginBottom: 10}}>
              <TextInputLine
                width={"100%"}
                height={100}
                ref={descriptorTextRef}
                autoFocus={false}
                title={"Treasure name"}
                //helperText={!isKeyboardVisible ? null : "Press enter to exit"}
                // iconColor={
                //   !isKeyboardVisible ? themeStyles.primaryText.color : "red"
                // }
                mountingText={""}
                onTextChange={updateDescriptorString}
                multiline={false}
              /> 
              
              
            </View>
            
            <TextInputBlock
              width={"100%"}
              height={!isKeyboardVisible ? oneThirdHeight : oneHalfHeight}
              ref={editedTextRef}
              autoFocus={false}
              title={"Description of treasure"}
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
     
        {prompt &&
          role &&
          lastLocationId &&
          lastLatAndLong &&
          !isKeyboardVisible && (
            <Groq
              givenRole={role}
              prompt={prompt}
              title={"Treasure found by Groq"}
              cacheKey={base}
              userId={user.id}
            />
          )}
        {!isKeyboardVisible && (
          <ActionsFooter
            height={isKeyboardVisible ? 40 : 66}
            onPressLeft={() => router.replace("(treasures)")}
            labelLeft={"Cancel"}
            onPressRight={handleCollect}
            labelRight={"Send"}
          />
        )}
      </View>
    </>
  );
};

export default collect;
