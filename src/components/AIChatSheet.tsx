import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface AIChatSheetProps {
  visible: boolean;
  onClose: () => void;
  theme: RoleTheme;
}

const aiResponses: Record<string, string> = {
  'task': 'I can help you manage tasks! You have several pending tasks. Would you like me to prioritize them by due date or priority level?',
  'event': 'Your family has upcoming events this week. Emma\'s recital is on September 28th at 6 PM. Would you like me to set a reminder?',
  'health': 'Grandma has a checkup on September 20th. Emma has a vaccination coming up on October 15th. All health records are up to date!',
  'finance': 'Your family spending this month totals $319.50. Groceries are the largest expense at $125.50. You\'re within budget!',
  'default': 'I\'m your Family AI Assistant! I can help with tasks, events, health records, finances, and more. What would you like to know?',
};

export function AIChatSheet({ visible, onClose, theme }: AIChatSheetProps) {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Hello! I\'m your Family AI Assistant. How can I help you today?', isUser: false },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, isUser: true }]);
    setInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = aiResponses.default;
      if (lower.includes('task') || lower.includes('chore')) response = aiResponses.task;
      else if (lower.includes('event') || lower.includes('calendar') || lower.includes('schedule')) response = aiResponses.event;
      else if (lower.includes('health') || lower.includes('doctor') || lower.includes('medical')) response = aiResponses.health;
      else if (lower.includes('money') || lower.includes('finance') || lower.includes('budget') || lower.includes('expense')) response = aiResponses.finance;
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    }, 800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surfaceContainer }]}>
          <View style={styles.header}>
            <View style={[styles.aiIcon, { backgroundColor: theme.primary, borderRadius: theme.roundness.md }]}>
              <Icon name="ai" size={20} color={theme.onPrimary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, { color: theme.onSurface }]}>Family AI</Text>
              <Text style={[styles.headerSubtitle, { color: theme.onSurfaceVariant }]}>Always here to help</Text>
            </View>
            <Pressable onPress={onClose}>
              <Icon name="back" size={20} color={theme.onSurfaceVariant} />
            </Pressable>
          </View>

          <View style={[styles.messagesContainer, { backgroundColor: theme.surfaceContainerLow }]}>
            {messages.map((msg, i) => (
              <View key={i} style={[styles.messageBubble, {
                backgroundColor: msg.isUser ? theme.primary : theme.surfaceContainerHigh,
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                borderRadius: theme.roundness.md,
              }]}>
                <Text style={[styles.messageText, { color: msg.isUser ? theme.onPrimary : theme.onSurface }]}>{msg.text}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.inputRow, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.full }]}>
            <TextInput
              style={[styles.input, { color: theme.onSurface }]}
              placeholder="Ask me anything..."
              placeholderTextColor={theme.onSurfaceVariant}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
            />
            <Pressable onPress={handleSend} style={[styles.sendBtn, { backgroundColor: theme.primary, borderRadius: theme.roundness.full }]}>
              <Icon name="back" size={18} color={theme.onPrimary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { height: '80%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  aiIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  messagesContainer: { flex: 1, padding: 12, borderRadius: 12, marginBottom: 12 },
  messageBubble: { maxWidth: '80%', padding: 12, marginBottom: 8 },
  messageText: { fontSize: 14, lineHeight: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 4, paddingLeft: 16 },
  input: { flex: 1, fontSize: 14, paddingVertical: 10 },
  sendBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', margin: 4 },
});
