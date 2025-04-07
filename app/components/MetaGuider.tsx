import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useGlobalStyles } from '../context/GlobalStylesContext';

const MetaGuider = ({ title, message, onPress, isVisible = false, dismissLabel = 'Dismiss' }) => {
  const { themeStyles } = useGlobalStyles();

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.messageBox, themeStyles.darkerBackground]}>
        {title && (
          <Text style={[styles.titleText, themeStyles.primaryText]}>
            {title}
          </Text>
        )}
        {message && (
          <Text style={[styles.messageText, themeStyles.primaryText]}>
            {message}
          </Text>
        )}
        <TouchableOpacity onPress={onPress} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, themeStyles.primaryText]}>
            {dismissLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 50,
    flex: 1,
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 10000,
    elevation: 10000,
    alignItems: 'center',
  },
  messageBox: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MetaGuider;
