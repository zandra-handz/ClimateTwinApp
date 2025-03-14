import { View, Text, Keyboard, Dimensions, FlatList } from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useFocusEffect } from "expo-router";
import ActionsFooter from "@/app/components/ActionsFooter";
import { StatusBar } from "expo-status-bar";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import useTreasures from "@/app/hooks/useTreasures";
import { useAppMessage } from "../../context/AppMessageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextInputLine from "@/app/components/TextInputLine";
import TextInputBlock from "@/app/components/TextInputBlock";
import Groq from "@/app/components/GroqComponents/Groq";
import useLLMScripts from "@/app/llm/useLLMScripts";
import useAsyncStorageCache from "../../hooks/useAsyncStorageCache";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";
import { useUser } from "@/app/context/UserContext";
import KeyboardOpenFooter from "@/app/components/Scaffolding/KeyboardOpenFooter";

const collect = () => {
  const { name, topic, base } = useLocalSearchParams<{ 
    name: string | null; 
    topic: string | null; 
    base: string | null; 
  }>();
  const { user } = useUser();
  const { lastLocationId, lastLatAndLong } = useSurroundingsWS();
  const {latitude, longitude} = lastLatAndLong;
  const {
    yourRoleIsBrilliantNaturalistAndPainter,
    findMeAWindTreasure,
    yourRoleIsExpertBotanist,
    findMeAPlant,
  } = useLLMScripts();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const [isMinimized, setIsMinimized] = useState(false);
  const { showAppMessage } = useAppMessage();

  const { getCache } = useAsyncStorageCache(user?.id, lastLocationId);

  const [cachedHistory, setCachedHistory] = useState(null);

  const { handleCollectTreasure, collectTreasureMutation } = useTreasures();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useRouter();

  const descriptorTextRef = useRef(null);
  const additionalTextRef = useRef(null);
  const editedTextRef = useRef(null);

  const [viewableIndex, setViewableIndex] = useState(null);

  const openKeyboard = () => {
    if (descriptorTextRef.current) {
      descriptorTextRef.current.focusText();
    }
  };

  const [prompt, setPrompt] = useState(null);
  const [role, setRole] = useState(null);

  const [cacheChecked, setCacheChecked ] = useState(false);

  const handleFullScreenToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
      Keyboard.dismiss();
    } else {
      setIsMinimized(true);
      openKeyboard();
      handleStart();
    }
  };

  useEffect(() => {
    setPrompt(null);
    setRole(null);
    setIsMinimized(false);

  }, []);

  useFocusEffect(
    useCallback(() => {
      setPrompt(null);
      setIsMinimized(false);
   
      setRole(null);

      const fetchCache = async () => {
        const cachedData = await getCache();
        if (cachedData?.history) {
          setCachedHistory(cachedData.history);
        }
        setCacheChecked(true);
      };

      

      fetchCache();
    }, [getCache, base])
  );

  useEffect(() => {
    if (cacheChecked && cachedHistory && topic && lastLatAndLong) {
      console.log(lastLatAndLong);
      if (topic === "plants") {
        console.log('setting prompt for plants!');
        let roleData = yourRoleIsExpertBotanist();
        let promptData = findMeAPlant(
          lastLatAndLong[0],
          lastLatAndLong[1],
          cachedHistory
        );
        setPrompt(promptData);
        console.log(`prompt in parent:`, promptData);
        setRole(roleData);
      } else {
        let roleData = yourRoleIsBrilliantNaturalistAndPainter();
        let promptData = findMeAWindTreasure(
          lastLatAndLong[0],
          lastLatAndLong[1],
          cachedHistory
        );
        setPrompt(promptData);
        setRole(roleData);
      }
    }
  }, [cacheChecked, cachedHistory, topic, lastLatAndLong]);

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
      console.log(text);
      descriptorTextRef.current.setText(text);
    }
  };

  const updateAdditionalString = (text) => {
    if (additionalTextRef && additionalTextRef.current) {
    //  console.log(text);
      additionalTextRef.current.setText(text);
    }
  };

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
    //  console.log(text);
      editedTextRef.current.setText(text);
   //   console.log("in parent", editedTextRef.current.getText());
    }
  };

  const ITEM_HEIGHT = 160;
  const SPACER = 16;

  const inputData = [
    {
      key: "treasureName",
      component: "TextInputLine",
      height: ITEM_HEIGHT,
      title: "Treasure name",
      onTextChange: updateDescriptorString,
      onSubmitEditing: () => console.log("Treasure name submitted"),
    },
    {
      key: "description",
      component: "TextInputBlock",
      height: ITEM_HEIGHT,
      title: "Description of treasure",
      helperText: !isKeyboardVisible ? null : "Press enter to exit",
      onTextChange: updateNoteEditString,
      onSubmitEditing: () => console.log("Description submitted"),
    },
    {
      key: "additionalData",
      component: "TextInputBlock",
      height: ITEM_HEIGHT,
      title: "Additional data",
      helperText: !isKeyboardVisible ? null : "Press enter to exit",
      onTextChange: updateAdditionalString,
      onSubmitEditing: () => console.log("Additional data submitted"),
    },
  ];

  const snapOffsets = inputData.map((item, index) =>
    index === 0
      ? 0
      : inputData.slice(0, index).reduce((acc, cur) => acc + cur.height + SPACER, 0)
  );
  const flatListRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setFocusedIndex(viewableItems[0].index);
    }
  }, []);

  const handleStart = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
   
    console.log("should be focusing text input of the first field here");
    if (descriptorTextRef.current) {
      console.log("should be focusing text input of the first field heeeere");
      descriptorTextRef.current.focusText();
    }
    setFocusedIndex(0);
  
  };

  const renderItem = ({ item, index }) => {
    const inputRef =
      index === 0
        ? descriptorTextRef
        : index === 1
        ? editedTextRef
        : additionalTextRef;

    return item.component === "TextInputLine" ? ( 
      <View style={{marginBottom: SPACER}}>
        <TextInputLine
          ref={inputRef}
          title={item.title}
          onTextChange={item.onTextChange}
          mountingText={""}
          height={ITEM_HEIGHT}
          onSubmitEditing={() => handleNext(index)}
        /> 
        </View>
         
    ) : ( 
      <View style={{marginBottom: SPACER}}>
        <TextInputBlock
          ref={inputRef}
          title={item.title}
          helperText={null}
          onTextChange={item.onTextChange}
          mountingText={""}
          multiline={false}
          height={ITEM_HEIGHT}
          onSubmitEditing={() => handleNext(index)}
        />  
        </View>
    );
  };

  const handleNext = (index) => {
    const currentItem = inputData[index];
    currentItem.onSubmitEditing();

    const nextIndex = index + 1;
    if (nextIndex < inputData.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
     

      if (nextIndex === 1 && editedTextRef.current) {
        console.log("editedTextRef.current is available");
        editedTextRef.current.focusText();
      } else if (nextIndex === 2 && additionalTextRef.current) {
        console.log("additionalTextRef.current is available");
        additionalTextRef.current.focusText();
      } else {
        console.log("Refs not ready yet");
      }

      setFocusedIndex(nextIndex);
    }
  };

  const handleCollect = () => {
    console.log("handle collect");
    if (base && topic && editedTextRef.current) {
      const parsedValue = JSON.parse(base);
      const firstString = parsedValue[0];
      console.log("attempting to collect treasure", base);
      handleCollectTreasure(
        firstString,
        descriptorTextRef.current.getText(),
        editedTextRef.current.getText(),
        additionalTextRef.current.getText()
      );
      descriptorTextRef.current.clearText();
      editedTextRef.current.clearText();
      additionalTextRef.current.clearText();
    }
  };

  return (
    <View
      style={[
        appContainerStyles.screenContainer,
        themeStyles.primaryBackground,
        { paddingTop: 10 },
      ]}
    >
      <View style={appContainerStyles.innerFlexStartContainer}>

        <FlatList
          ref={flatListRef}
          data={inputData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          scrollEnabled={true}
          snapToOffsets={snapOffsets}
          snapToAlignment="start"
          decelerationRate="fast"  
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
          ListFooterComponent={<View style={{ height: 700 }}></View>}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT + SPACER,
            offset: snapOffsets[index],
            index,
          })}
        />
      </View>

      {cacheChecked && prompt && base && lastLocationId && (
 
        <Groq
          name={name}
          givenRole={role}
          prompt={prompt}
          title={"Treasure found by Groq"}
          cacheKey={base}
          topic={topic}
          userId={user?.id}
          isMinimized={isMinimized}
          fullScreenToggle={handleFullScreenToggle}
          isKeyboardVisible={isKeyboardVisible}
        />
      )}
      {/* {!isKeyboardVisible && ( */}
      <ActionsFooter
        height={isKeyboardVisible ? 40 : 66}
        onPressLeft={() => router.back()}
        labelLeft={"Back"}
        onPressRight={handleCollect}
        labelRight={"Collect"}
        onPressCenter={isMinimized ? handleFullScreenToggle : null}
        labelCenter={"Groq"}
      />
    </View>
  );
};

export default collect;
