import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import SendButton from "./Scaffolding/SendButton";
import CloseButton from "./Scaffolding/CloseButton";

interface PickerProps {
  items: { label: string; value: string; username: string; id: string }[];
  onSelect: (selectedItem: any) => void;
}

const FriendPicker = forwardRef((props: PickerProps, ref) => {
  const { items, onSelect } = props;
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  const widthAnim = useSharedValue(120);
  const heightAnim = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue,
  }));

  const handleButtonPress = (data: Record<string, any>) => {
    setSelectedValue(data.id);
    setSelectedName(data.username);
    onSelect(data);
    closeList();
  };
  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue,
    resetPicker: () => {
      widthAnim.value = 120;
      heightAnim.value = 0;
      setIsListVisible(false);
      setSelectedValue(null);
      setSelectedName(null);
    }
  }));
  const openList = () => {
    setIsListVisible(true);
    heightAnim.value = withTiming(200, {
      duration: 300,
      easing: Easing.ease,
    });
    widthAnim.value = withTiming(160, { duration: 300, easing: Easing.ease });
  };

  const closeList = () => {
    heightAnim.value = withTiming(
      0,
      { duration: 200 },
      () => runOnJS(setIsListVisible)(false) // only hide after animation finishes
    );
    widthAnim.value = withTiming(120, { duration: 200 });
  };


  

  const toggleListVisibility = () => {
    if (!isListVisible) openList();
    else closeList();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value,
      position: "absolute",
      right: 0,
    };
  });

  const listStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      overflow: "hidden",
      transform: [{ translateY: -heightAnim.value }],
    };
  });

  const optionButtonStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value,
    };
  });

  return (
    <View
      style={[
        appContainerStyles.pickerContainer,
        {
          backgroundColor:   themeStyles.darkerBackground,
            
          borderRadius: 20,
        },
      ]}
    >
      <Animated.View style={[animatedStyle]}>
        {!isListVisible ? (
          <View style={{ position: "absolute", right: 0, width: 60}}>
            <SendButton onPress={toggleListVisibility} backgroundColor={themeStyles.darkerBackground.backgroundColor} />
          </View>
        ) : (
          <View
            style={{
              position: "absolute",
              right: 0,
              width: 60,
              zIndex: 10000,
              elevation: 10000,
              
            }}
          >
            <CloseButton onPress={toggleListVisibility} backgroundColor={themeStyles.darkerBackground} />
          </View>
        )}
      </Animated.View>

      {isListVisible && (
        <Animated.View
          style={[
            listStyle,
            {
              backgroundColor: themeStyles.darkerBackground.backgroundColor, 
              padding: 10,
              borderRadius: 20,
              
              position: "absolute",
              right: 0,
              // no bottom here to avoid pushing it too far
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <Animated.View key={item.id} style={optionButtonStyle}>
                <View style={{marginVertical: 2}}>
                  
                <TouchableOpacity
                  style={[
                    appContainerStyles.pickerButtonContainer,
                    themeStyles.darkerBackground,
                  ]}
                  onPress={() => handleButtonPress(item)}
                >
                  <Text>{item.username}</Text>
                </TouchableOpacity>
                
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
});

export default FriendPicker;
