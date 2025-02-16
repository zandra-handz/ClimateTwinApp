import { View, Text, Animated } from 'react-native'
import React from 'react'
import { SlideInRight, SlideOutLeft } from 'react-native-reanimated';


const CardAnimationWrapper = ({children}) => {
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} >
      {children}
    </Animated.View>
  )
}

export default CardAnimationWrapper