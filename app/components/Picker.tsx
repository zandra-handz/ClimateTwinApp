import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Button, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { Easing, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useGlobalStyles } from '../../src/context/GlobalStylesContext';
import { TouchableOpacityComponent } from 'react-native';
// Define the props type to include labels and values
interface PickerProps {
  items: { label: string; value: string; username: string }[];  
  onSelect: (selectedItem: string) => void; 
}

const Picker = forwardRef((props: PickerProps, ref) => {
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
    console.log(data);
    onSelect(data); 
    setIsListVisible(false);  
    heightAnim.value = withTiming(0, { duration: 200 });  
    widthAnim.value = withTiming(120, { duration: 200 }); 
  };
 
  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
    if (!isListVisible) {
      heightAnim.value = withTiming(200, { duration: 300, easing: Easing.ease }); 
      widthAnim.value = withTiming(200, { duration: 300, easing: Easing.ease });  
    } else {
      heightAnim.value = withTiming(0, { duration: 200 });  
      widthAnim.value = withTiming(120, { duration: 200 });  
    }
  };
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value,
      position: 'absolute',   
      right: 0,              
    };
  });
 
  const listStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      overflow: 'hidden', 
    };
  });
 
  const optionButtonStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value,  
    };
  });

  return (
    <View style={[appContainerStyles.pickerContainer, themeStyles.darkestBackground]}>  
      <Animated.View style={[animatedStyle]}> 
        {!isListVisible && (
          <TouchableOpacity style={[appContainerStyles.pickerButtonContainer, themeStyles.darkestBackground]} onPress={toggleListVisibility}>
            <Text style={themeStyles.primaryText}>
            {selectedName ? `Give to ${selectedName}` : 'Give to...'}
            </Text>
            
            </TouchableOpacity>
        )}
      </Animated.View>
      
      <Animated.View style={[listStyle, {padding: 10, borderRadius: 20}]}> 
      <ScrollView>
        {isListVisible && items && items.map((item) => (
    
          <Animated.View key={item.id} style={optionButtonStyle}>
            <Button
              title={item.username}
              onPress={() => handleButtonPress(item)}
            />
          </Animated.View>
  
        ))}
        </ScrollView>
 
        {isListVisible && (
          <View style={{position: 'absolute', right: 0, width: 60}} >
            <Button title="Close" onPress={toggleListVisibility} />
          </View>
        )}
      </Animated.View> 
       
    </View>
  );
});
  

export default Picker;
