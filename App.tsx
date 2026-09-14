import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Index from './app/index';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Index />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
