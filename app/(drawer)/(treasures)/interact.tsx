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

import GoToItemButton from "@/app/components/GoToItemButton";
  

const interact = () => {
    const { 
      name, topic, base, query, index, 
      descriptor, additional, noteEdit, placeSaver 
    } = useLocalSearchParams<{
      name: string | null;
      topic: string | null;
      base: string | null;
      query: string | null;
      index: string | null;
      descriptor: string | null;
      additional: string | null;
      noteEdit: string | null;
      placeSaver: string | null;
    }>();

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
 

  useFocusEffect(
    React.useCallback(() => {
      handleAvgPhotoColor(null);  
    

      return () => {
        handleAvgPhotoColor(null); 
        resetFields(); // can we use this here after refactoring?
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
  

  const handleCollectATreasure = () => {
    if (topic) {
      router.push({
        pathname: "(treasures)/collect",
        params: {
          name, // Pass `name` directly, not wrapped in locationData
          topic,
          base,
          query,
          index,
          descriptor,
          additional,
          noteEdit,
          placeSaver
        },
      });
    }
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
     
      
 
        <GroqItem
        //locationParamsData={locationData}
          name={name}
          title={"Make believe with Groq"}
          base={base}
          topic={topic}
          query={query}
          isMinimized={false} 
          isKeyboardVisible={false}
          index={iNaturalistIndex}
          goToCollect={handleCollectATreasure}
          collectInProgress={descriptor || noteEdit || additional}
        /> 
        </View>
      <ActionsFooter 
        onPressLeft={() => router.replace('(exploretabs)')}
        labelLeft={"Back"}
        onPressRight={handleCollectATreasure}
        labelRight={"Collect"} 
      />
    </Animated.View>
     
    </>
  );
};

export default interact;
