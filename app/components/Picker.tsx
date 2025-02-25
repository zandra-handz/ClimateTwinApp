import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Animated, { Easing, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// Define the props type to include labels and values
interface PickerProps {
  items: { label: string; value: string; nickname: string }[];  // Array of label/value pairs
  onSelect: (selectedItem: string) => void;  // Callback to notify parent of selection
}

const Picker = forwardRef((props: PickerProps, ref) => {
  const { items, onSelect } = props;
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  // Reanimated shared value for animating the width of the entire component (button + list)
  const widthAnim = useSharedValue(120);  // Initial width for the button

  // Reanimated shared value for animating the height of the list
  const heightAnim = useSharedValue(0);

  // Exposing the selected value to the parent using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue,  // Method to get the selected value
  }));

  // Handle button selection and call onSelect
  const handleButtonPress = (data: Record<string, any>) => {
    setSelectedValue(data.id);
    onSelect(data); // Forward the selected value to the parent
    setIsListVisible(false); // Hide the list after selection
    heightAnim.value = withTiming(0, { duration: 200 }); // Collapse the list
    widthAnim.value = withTiming(120, { duration: 200 }); // Reset component width to original size
  };

  // Toggle the visibility of the list and animate height and component width
  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
    if (!isListVisible) {
      heightAnim.value = withTiming(200, { duration: 300, easing: Easing.ease }); // Expand the list
      widthAnim.value = withTiming(300, { duration: 300, easing: Easing.ease }); // Expand component width
    } else {
      heightAnim.value = withTiming(0, { duration: 200 }); // Collapse the list
      widthAnim.value = withTiming(120, { duration: 200 }); // Reset component width
    }
  };

  // Animated style for the container (button + list)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value,
      position: 'absolute',  // Position the button on the right side
      right: 0,              // Align to the right of the screen
    };
  });

  // Animated style for the list container
  const listStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      overflow: 'hidden', // Ensure that content is hidden when collapsed
    };
  });

  // Animated style for the option buttons
  const optionButtonStyle = useAnimatedStyle(() => {
    return {
      width: widthAnim.value, // Sync the width of option buttons with the main button
    };
  });

  return (
    <View style={styles.container}>
      {/* Animated container to toggle width for the button and the list */}
      <Animated.View style={animatedStyle}>
        {/* Conditionally render the button when the list is hidden */}
        {!isListVisible && (
          <Button
            title={selectedValue ? `Selected: ${selectedValue}` : 'Select a Friend'}
            onPress={toggleListVisibility}
          />
        )}
      </Animated.View>

      {/* Animated list container */}
      <Animated.View style={[listStyle]}>
        {/* Conditionally render the list of friends */}
        {isListVisible && items && items.map((item) => (
          <Animated.View key={item.id} style={optionButtonStyle}>
            <Button
              title={item.nickname}
              onPress={() => handleButtonPress(item)}
            />
          </Animated.View>
        ))}

        {/* Close button to hide the list */}
        {isListVisible && (
          <Animated.View style={optionButtonStyle}>
            <Button title="Close" onPress={toggleListVisibility} />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
});

// Styles to position the container on the right side of the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align to the top of the screen
    alignItems: 'flex-end',       // Align to the right of the screen
    padding: 10,
  },
});

export default Picker;
