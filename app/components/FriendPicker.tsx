import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
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
import Avatar from "./FriendsComponents/Avatar";

interface PickerProps {
  items: { label: string; value: string; username: string; id: string }[];
  onSelect: (selectedItem: any) => void;
}

const FriendPicker = forwardRef((props: PickerProps, ref) => {
  const { items, onSelect } = props;
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const [showScrollView, setShowScrollView] = useState<boolean>(false);
  const widthAnim = useSharedValue(120);
  const heightAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

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
    },
  }));
  const openList = () => {
    setIsListVisible(true);
    opacityAnim.value = withTiming(1, {
      duration: 100,
      easing: Easing.ease,
    });
    heightAnim.value = withTiming(280, {
      duration: 200,
      easing: Easing.ease,
    });
    widthAnim.value = withTiming(160, { duration: 200, easing: Easing.ease });
    setShowScrollView(true);
  };

  const closeList = () => {
    setShowScrollView(false);
    opacityAnim.value = withTiming(0, {
      duration: 110,
      easing: Easing.ease,
    });
    heightAnim.value = withTiming(
      0,
      { duration: 140 },
      () => runOnJS(setIsListVisible)(false) // only hide after animation finishes
    );
    widthAnim.value = withTiming(0, { duration: 110 });
  };

  const toggleListVisibility = () => {
    if (!isListVisible) openList();
    else closeList();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value,
      opacity: opacityAnim.value,
      position: "absolute",
      right: 0,
    };
  });

  const listStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      opacity: opacityAnim.value,
      overflow: "hidden",
      transform: [{ translateY: -heightAnim.value }],
      top: -20,
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
          backgroundColor: themeStyles.darkerBackground,

          borderRadius: 20,
        },
      ]}
    >
      {!isListVisible && (
        <View style={{ position: "absolute", right: 0, width: 60 }}>
          <SendButton
            onPress={toggleListVisibility}
            backgroundColor={themeStyles.darkerBackground.backgroundColor}
          />
        </View>
      )}

      {isListVisible && (
        <Animated.View style={[animatedStyle]}>
          <View
            style={{
              position: "absolute",
              right: 0,
              width: 60,
              zIndex: 10000,
              elevation: 10000,
            }}
          >
            <CloseButton
              onPress={toggleListVisibility}
              backgroundColor={"orange"}
            />
          </View>
        </Animated.View>
      )}

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
          {showScrollView && (
            <View style={{ height: 200, width: "100%" }}>


                         
          {/* <ScrollView showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            fadingEdgeLength={1} // doing anything? 
            keyboardShouldPersistTaps="handled">
              <View style={appContainerStyles.pickerButtonsHeaderContainer}>
                <Text style={[appFontStyles.dCQuestionText, themeStyles.primaryText]}>Give treasure to </Text>
              </View>
            {items.map((item) => (
              <Animated.View key={item.id} style={optionButtonStyle}>
                <View style={{ marginVertical: 2 }}>
                  <TouchableOpacity
                    style={[
                      appContainerStyles.pickerButtonContainer,
                      themeStyles.darkerBackground,
                      { borderColor: themeStyles.primaryText.color}
                    ]}
                    onPress={() => handleButtonPress(item)}
                  >
                    {item.friend_profile?.avatar &&
                    <View style={{paddingRight: 10}}>
                    <Avatar image={item.friend_profile.avatar} size={26} />
                    
                      
                    </View>
                    }
                    <Text style={themeStyles.primaryText}>{item.username}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </ScrollView> */}
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                  <View style={appContainerStyles.pickerButtonsHeaderContainer}>
                    <Text
                      style={[
                        appFontStyles.dCQuestionText,
                        themeStyles.primaryText,
                      ]}
                    >
                      Give treasure to
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <Animated.View key={item.id} style={optionButtonStyle}>
                    <View style={{ marginVertical: 2 }}>
                      <TouchableOpacity
                        style={[
                          appContainerStyles.pickerButtonContainer,
                          themeStyles.darkerBackground,
                          { borderColor: themeStyles.primaryText.color },
                        ]}
                        onPress={() => handleButtonPress(item)}
                      >
                        {item.friend_profile?.avatar && (
                          <View style={{ paddingRight: 10 }}>
                            <Avatar
                              image={item.friend_profile.avatar}
                              size={26}
                            />
                          </View>
                        )}
                        <Text style={themeStyles.primaryText}>
                          {item.username}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}
              />
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
});

export default FriendPicker;
