import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface AddMemorySheetProps {
  visible: boolean;
  onClose: () => void;
  theme: RoleTheme;
  onAdd: (memory: { title: string; date: string; photo: string }) => void;
}

export function AddMemorySheet({ visible, onClose, theme, onAdd }: AddMemorySheetProps) {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📷');

  const emojiOptions = ['📷', '🏖️', '🎂', '🎄', '🎒', '🎨', '🏆', '🎵', '📚'];

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      date: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
      photo: selectedEmoji,
    });
    setTitle('');
    setSelectedEmoji('📷');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surfaceContainer }]}>
          <View style={[styles.handle, { backgroundColor: theme.outlineVariant }]} />
          <Text style={[styles.title, { color: theme.onSurface }]}>Add Memory</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surfaceContainerLow, color: theme.onSurface, borderRadius: theme.roundness.md, borderColor: theme.outlineVariant }]}
            placeholder="Memory title..."
            placeholderTextColor={theme.onSurfaceVariant}
            value={title}
            onChangeText={setTitle}
          />
          <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Choose Icon</Text>
          <View style={styles.emojiGrid}>
            {emojiOptions.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => setSelectedEmoji(emoji)}
                style={[styles.emojiBtn, {
                  backgroundColor: selectedEmoji === emoji ? theme.primaryContainer : theme.surfaceContainerLow,
                  borderColor: selectedEmoji === emoji ? theme.primary : theme.outlineVariant,
                  borderRadius: theme.roundness.md,
                }]}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={handleAdd} style={[styles.addBtn, { backgroundColor: theme.primary, borderRadius: theme.roundness.full }]}>
            <Text style={[styles.addText, { color: theme.onPrimary }]}>Add Memory</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { borderWidth: 1, padding: 14, fontSize: 16, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  emojiBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emojiText: { fontSize: 24 },
  addBtn: { paddingVertical: 14, alignItems: 'center' },
  addText: { fontSize: 16, fontWeight: '600' },
});
