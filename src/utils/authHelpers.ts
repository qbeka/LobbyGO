import { Alert } from 'react-native';
import { useAppStore } from '../stores/appStore';

export const useAuthCheck = () => {
  const { user, isBrowsingWithoutAccount } = useAppStore();

  const requireAuth = (action: string, onAuthSuccess?: () => void) => {
    if (!user || isBrowsingWithoutAccount) {
      Alert.alert(
        'Sign In Required',
        `Please sign in to ${action}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => {
              // TODO: Navigate to auth screen or show auth modal
              console.log('Navigate to auth');
            },
          },
        ]
      );
      return false;
    }
    
    if (onAuthSuccess) {
      onAuthSuccess();
    }
    return true;
  };

  return { requireAuth, isAuthenticated: !!user && !isBrowsingWithoutAccount };
};

export const requireAuthForAction = (action: string): boolean => {
  const { user, isBrowsingWithoutAccount } = useAppStore.getState();
  
  if (!user || isBrowsingWithoutAccount) {
    Alert.alert(
      'Sign In Required',
      `Please sign in to ${action}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign In',
          onPress: () => {
            // TODO: Navigate to auth screen
            console.log('Navigate to auth');
          },
        },
      ]
    );
    return false;
  }
  
  return true;
};
