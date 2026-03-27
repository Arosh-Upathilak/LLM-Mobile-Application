import React from 'react'
import NotificationScreen from '@/screens/notification/notification.screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const NotificationIndex = () => {
  return (
     <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationScreen />
    </GestureHandlerRootView>
  )
}

export default NotificationIndex