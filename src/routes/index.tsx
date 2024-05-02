import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { useEffect, useState } from 'react';
import { NotificationWillDisplayEvent, OSNotification, OneSignal } from 'react-native-onesignal';
import { Notification } from '../components/Notification';

export function Routes() {
  const { colors } = useTheme();

  const [notification, setNotification ] = useState<OSNotification>()

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  useEffect(()=>{

    const handleNotifications = (event: NotificationWillDisplayEvent): void =>{
      event.preventDefault()
      const response = event.getNotification()

      setNotification(response)
    }

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleNotifications
    )


    return () =>{
        OneSignal.Notifications.removeEventListener(
          'foregroundWillDisplay',
          handleNotifications
        )
    }

  },[])

  return (
    <NavigationContainer theme={theme}>
      <AppRoutes />
     {
      notification?.body && ( <Notification onClose={() => setNotification(undefined)} title={notification.body}/> )
     }
    </NavigationContainer>
  );
}