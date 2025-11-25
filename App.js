import StackNavigation from './navigations/StackNavigation';
import StackBottomNavigation from './navigations/StackBottomNavigation';
import { NavigationIndependentTree } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <NavigationIndependentTree>
              <StackNavigation />
            </NavigationIndependentTree>
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
