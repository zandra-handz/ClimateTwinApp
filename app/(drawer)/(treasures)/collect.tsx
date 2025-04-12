import { View, Text, Keyboard, Dimensions, FlatList,   Animated } from "react-native";
import React, {
  useEffect,
  useLayoutEffect,

  useRef,
  useState,
  useCallback,
} from "react";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import useTreasures from "@/app/hooks/useTreasures";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextInputLine from "@/app/components/TextInputLine";
import TextInputBlock from "@/app/components/TextInputBlock";
import GroqItem from "@/app/components/GroqComponents/GroqItem";
import { useFocusEffect } from "expo-router"; 
  

const collect = () => {
  const { name, topic, base, query, index } = useLocalSearchParams<{
    name: string | null;
    topic: string | null;
    base: string | null;
    query: string | null;
    index: string | null;
  }>();

  const { descriptor, additional, noteEdit, placeSaver: placeSaverString } = useLocalSearchParams();

  const placeSaver = placeSaverString ? Number(placeSaverString) : 0;  
  

// useEffect(() => {


//   if (descriptorTextRef.current && descriptor) {
//     descriptorTextRef.current.setText(descriptor);
//   }
//   if (additionalTextRef.current && additional) {
//     additionalTextRef.current.setText(additional);
//   }
//   if (editedTextRef.current && noteEdit) {
//     editedTextRef.current.setText(noteEdit);
//   }
  
// }, []);

  const iNaturalistIndex = index ? Number(index) : null; 

  const locationData = { name, topic, base };

    const [fadeAnim] = useState(new Animated.Value(0));   

  
  

  const { themeStyles, appContainerStyles, avgPhotoColor, handleAvgPhotoColor } = useGlobalStyles();
  const [isMinimized, setIsMinimized] = useState(false);
  const { showAppMessage } = useAppMessage();

  const { handleCollectTreasure, collectTreasureMutation } = useTreasures();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useRouter();

  const descriptorTextRef = useRef(null);
  const additionalTextRef = useRef(null);
  const editedTextRef = useRef(null);

  const [viewableIndex, setViewableIndex] = useState(null);

  useFocusEffect(
    React.useCallback(() => {

      if (descriptorTextRef.current && descriptor) {
        descriptorTextRef.current.setText(descriptor);
      }
      if (additionalTextRef.current && additional) {
        additionalTextRef.current.setText(additional);
      }
      if (editedTextRef.current && noteEdit) {
        editedTextRef.current.setText(noteEdit);
      }
      //openKeyboard();

      if (placeSaver) {
        handlePlaceSaver(placeSaver);
      } else {
        
      handleStart();
      
    }

      return () => { 
       // resetFields();
      };
    }, [])
  );
 
  
  useEffect(() => {
    console.log('collect screen color animation triggered');
    
    Animated.timing(fadeAnim, {
      toValue: avgPhotoColor ? 1 : 0,  
      duration: 1000,                 
      useNativeDriver: false,       
    }).start();
  }, [avgPhotoColor]);
 
  // const openKeyboard = () => {
  //   if (descriptorTextRef.current) {
  //     descriptorTextRef.current.focusText();
  //   }
  // }; 

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
      // console.log(text);
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

  const handleBack = () => {
    router.replace({
      pathname: "(treasures)/interact", // Go back to the previous screen
      params: {
        name,
        topic,
        base,
        query,
        index,
        descriptor: descriptorTextRef.current?.getText() || "",
        additional: additionalTextRef.current?.getText() || "",
        noteEdit: editedTextRef.current?.getText() || "",
        placeSaver: focusedIndex || 0,
      },
    });
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
      : inputData
          .slice(0, index)
          .reduce((acc, cur) => acc + cur.height + SPACER, 0)
  );
  const flatListRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setFocusedIndex(viewableItems[0].index);
    }
  }, []);

  const handlePlaceSaver = (saved) => {
    setTimeout(() => {
    flatListRef.current?.scrollToIndex({ index: saved, animated: true,         // Using the callback to focus after scrolling
      onScrollToIndexFailed: (error) => {
        // Handle failure (if any) by logging or retrying
        console.error("Scroll failed:", error);
      }, });
    
    if (saved === 1 && editedTextRef.current) {
      editedTextRef.current.focusText();
    } else if (saved === 2 && additionalTextRef.current) {
      additionalTextRef.current.focusText();
    } else if (descriptorTextRef.current) {
      descriptorTextRef.current.focusText();
    }
    }, 300);
    setFocusedIndex(saved);
  };

  const handleStart = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });

    if (descriptorTextRef.current) {
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
      <View style={{ marginBottom: SPACER }}>
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
      <View style={{ marginBottom: SPACER }}>
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
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        // Using the callback to focus after scrolling
        onScrollToIndexFailed: (error) => {
          // Handle failure (if any) by logging or retrying
          console.error("Scroll failed:", error);
        },
      });

      // Delay focusing to ensure scrolling has completed
      setTimeout(() => {
        if (nextIndex === 1 && editedTextRef.current) {
          editedTextRef.current.focusText();
        } else if (nextIndex === 2 && additionalTextRef.current) {
          additionalTextRef.current.focusText();
        } else {
          console.log("Refs not ready yet");
        }
      }, 300); // Adjust the timeout if necessary
    }

    setFocusedIndex(nextIndex);
  };

  const resetFields = () => { 
    if (descriptorTextRef && descriptorTextRef.current) {
      descriptorTextRef.current.clearText();
    }
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.clearText();
    }
    if (additionalTextRef && additionalTextRef.current) {
      additionalTextRef.current.clearText();
    }
  };

  const handleCollect = () => { 
    console.log(locationData);
    if (locationData && editedTextRef.current) {
      const parsedValue = JSON.parse(locationData?.base);
      const firstString = parsedValue[0]; 
      handleCollectTreasure(
        firstString,
        descriptorTextRef.current.getText(),
        editedTextRef.current.getText(),
        additionalTextRef.current.getText()
      );
      resetFields();
    }
  };

  return (
    <>  
      
    <Animated.View
      style={[
        appContainerStyles.screenContainer,
      //  themeStyles.primaryBackground,
       
      
      { 
        // backgroundColor: avgPhotoColor ? avgPhotoColor :  themeStyles.primaryBackground.backgroundColor
        backgroundColor: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [themeStyles.primaryBackground.backgroundColor, avgPhotoColor ? avgPhotoColor : themeStyles.primaryBackground.backgroundColor], 
        }),
      },
      ]}
    > 
     
      <View style={appContainerStyles.innerFlexStartContainer}>
     
        <FlatList
          ref={flatListRef}
          data={inputData}
          showsVerticalScrollIndicator={false}
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
      <ActionsFooter
        height={isKeyboardVisible ? 40 : 46}
        onPressLeft={handleBack}
        labelLeft={"Back"}
        onPressRight={handleCollect}
        labelRight={"Collect"}
      />
    </Animated.View>
     
    </>
  );
};

export default collect;
