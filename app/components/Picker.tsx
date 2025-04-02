import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Button, ScrollView, StyleSheet } from 'react-native';
import Animated, { Easing, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useGlobalStyles } from '../context/GlobalStylesContext';
// Define the props type to include labels and values
interface PickerProps {
  items: { label: string; value: string; username: string }[];  
  onSelect: (selectedItem: string) => void; 
}

const Picker = forwardRef((props: PickerProps, ref) => {
  const { items, onSelect } = props;
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
 
  const widthAnim = useSharedValue(120);  
 
  const heightAnim = useSharedValue(0);
 
  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue,  
  }));
 
  const handleButtonPress = (data: Record<string, any>) => {
    setSelectedValue(data.id);
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
      widthAnim.value = withTiming(300, { duration: 300, easing: Easing.ease });  
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
    <View style={styles.container}>  
      <Animated.View style={animatedStyle}> 
        {!isListVisible && (
          <Button
            title={selectedValue ? `Selected: ${selectedValue}` : 'Select a Friend'}
            onPress={toggleListVisibility}
          />
        )}
      </Animated.View>
      <ScrollView>
      <Animated.View style={[listStyle]}> 
        {isListVisible && items && items.map((item) => (
    
          <Animated.View key={item.id} style={optionButtonStyle}>
            <Button
              title={item.username}
              onPress={() => handleButtonPress(item)}
            />
          </Animated.View>
          
            
        
        ))}
 
        {isListVisible && (
          <Animated.View style={optionButtonStyle}>
            <Button title="Close" onPress={toggleListVisibility} />
          </Animated.View>
        )}
      </Animated.View>
      </ScrollView>
       
    </View>
  );
});
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',     
    padding: 10, 
  },
});

export default Picker;
