import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>GrowTogether - Coming Soon!</Text>
          <Text style={{ marginTop: 20 }}>Full app will be available after build testing</Text>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
