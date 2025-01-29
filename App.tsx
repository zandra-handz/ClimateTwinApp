import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Stack } from 'expo-router';  // Expo Router's Stack component
import { LinearGradient } from 'expo-linear-gradient';
 

export default function App() {
  return (
    <View style={{ flex: 1 }}> 
      <StatusBar style="dark"
            translucent={true}
            backgroundColor="transparent"  /> 
      <Stack />
    </View>
  );
}
