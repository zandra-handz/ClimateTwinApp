import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, Ref, forwardRef } from 'react';
import { Text, Pressable, View } from 'react-native';

type Icon = ComponentProps<typeof FontAwesome>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
};

export const TabButton = forwardRef(
  ({ icon, children, isFocused, ...props }: TabButtonProps, ref: Ref<View>) => {
    return (
      <Pressable
        ref={ref}
        {...props}
        style={[
          {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 5,
            padding: 10,
          },
          isFocused ? { backgroundColor: 'white' } : undefined,
        ]}>
        <FontAwesome name={icon} />
        <Text style={[{ fontSize: 16 }, isFocused ? { color: 'white' } : undefined]}>
          {children}
        </Text>
      </Pressable>
    );
  }
);
