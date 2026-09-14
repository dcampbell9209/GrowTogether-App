import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { spacing, colors } from '@/styles';

export interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  multiline?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 500,
  showCharacterCount = false,
  multiline = true,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(trimmedMessage);
      setMessage('');
      inputRef.current?.blur();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    if (text.length <= maxLength) {
      setMessage(text);
      
      // Notify parent about typing status
      if (onTyping) {
        const isTyping = text.length > 0;
        onTyping(isTyping);
      }
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 && !isSending && !disabled;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <View style={styles.container}>
      {/* Character count */}
      {showCharacterCount && (
        <View style={styles.characterCountContainer}>
          <Text 
            variant="bodySmall" 
            style={[
              styles.characterCount,
              isNearLimit && styles.characterCountWarning
            ]}
          >
            {characterCount}/{maxLength}
          </Text>
        </View>
      )}

      {/* Input area */}
      <View style={[styles.inputContainer, disabled && styles.inputDisabled]}>
        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={message}
          onChangeText={handleTextChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant}
          editable={!disabled}
          multiline={multiline}
          maxLength={maxLength}
          autoCapitalize="sentences"
          autoCorrect={true}
          autoComplete="off"
          returnKeyType="send"
          blurOnSubmit={false}
        />

        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonInactive,
          ]}
          onPress={handleSendMessage}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          {isSending ? (
            <MaterialIcons 
              name="hourglass-empty" 
              size={20} 
              color={colors.onPrimary} 
            />
          ) : (
            <MaterialIcons 
              name="send" 
              size={20} 
              color={canSend ? colors.onPrimary : colors.onSurfaceVariant} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Typing indicator (if implemented) */}
      {/* Could be expanded to show when other person is typing */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  characterCountContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  characterCount: {
    opacity: 0.6,
    fontSize: 12,
  },
  characterCountWarning: {
    color: colors.warning,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.borderRadius.large,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    maxHeight: 120,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: colors.onSurface,
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
    elevation: 2,
  },
  sendButtonInactive: {
    backgroundColor: colors.surfaceVariant,
  },
});

export default MessageInput;





