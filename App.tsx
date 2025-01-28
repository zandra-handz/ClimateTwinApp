import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Stack } from 'expo-router';  // Expo Router's Stack component
import { LinearGradient } from 'expo-linear-gradient';
 

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Expo StatusBar */}
      <StatusBar style="dark" />
      {/* Expo Router's Stack will manage the navigation automatically */}
      <Stack />
    </View>
  );
}
