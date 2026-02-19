import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type BacklogEntry = {
  id: string;
  name: string;
  quantity: number;
  status: 'unpainted' | 'in_progress' | 'painted';
};

const STATUS_COLORS: Record<BacklogEntry['status'], string> = {
  unpainted:   '#3d3d6b',
  in_progress: '#7a5200',
  painted:     '#1a5c35',
};

const STATUS_BORDER: Record<BacklogEntry['status'], string> = {
  unpainted:   '#5a5a9a',
  in_progress: '#d4a017',
  painted:     '#2ecc71',
};

function seededOffset(id: string, range: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  return ((hash % (range * 2 * 100)) / 100 - range);
}

function getScene(count: number): { bg: string; label: string } {
  if (count === 0)  return { bg: '#1a1a2e', label: '' };
  if (count < 4)   return { bg: '#1a2a1a', label: '🌲 Forest floor...' };
  if (count < 8)   return { bg: '#1a1a3a', label: '🏙️ Above the rooftops...' };
  if (count < 12)  return { bg: '#0a0f2a', label: '☁️ Above the clouds...' };
  if (count < 18)  return { bg: '#050518', label: '🌙 Edge of atmosphere...' };
  return             { bg: '#000005', label: '🚀 Lost in space...' };
}

// ─── Animated box component ───────────────────────────────────────────────────

type BoxProps = {
  item: BacklogEntry;
  index: number;
  isNew: boolean;
  onCycleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

function AnimatedBox({ item, index, isNew, onCycleStatus, onDelete }: BoxProps) {
  const wobbleRange = 4 + index * 1.5;
  const offsetX    = seededOffset(item.id + 'x', wobbleRange);
  const boxWidth   = 260 + seededOffset(item.id + 'w', 20);
  const boxHeight  = 62  + seededOffset(item.id + 'h', 10);

  // New boxes start above the screen and fall into place
  const translateY = useSharedValue(isNew ? -SCREEN_H : 0);

  useEffect(() => {
    if (isNew) {
      // Accelerating fall, overshoot by 8px, then snap back — "thud on contact"
      translateY.value = withSequence(
        withTiming(8, { duration: 320, easing: Easing.in(Easing.quad) }),
        withSpring(0, { damping: 18, stiffness: 600, mass: 0.8 }),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.boxWrapper, animStyle]}>
      <ReanimatedSwipeable
        renderRightActions={() => (
          <Pressable
            style={[styles.deleteAction, { height: boxHeight }]}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        )}
        onSwipeableOpen={() => onDelete(item.id)}
      >
        <Pressable
          onPress={() => onCycleStatus(item.id)}
          style={[
            styles.box,
            {
              backgroundColor: STATUS_COLORS[item.status],
              borderColor:     STATUS_BORDER[item.status],
              width:      boxWidth,
              height:     boxHeight,
              marginLeft: (SCREEN_W - boxWidth) / 2 + offsetX,
            },
          ]}
        >
          <Text style={styles.boxTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.boxInfo}>
            {item.quantity} mini{item.quantity !== 1 ? 's' : ''} · {item.status.replace('_', ' ')}
          </Text>
        </Pressable>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [entries, setEntries] = useState<BacklogEntry[]>([]);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('backlog-entries');
        if (saved) setEntries(JSON.parse(saved));
      } catch { /* ignore */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('backlog-entries', JSON.stringify(entries));
      } catch { /* ignore */ }
    })();
  }, [entries]);

  const cycleStatus = (id: string) => {
    const next = {
      unpainted:   'in_progress',
      in_progress: 'painted',
      painted:     'unpainted',
    } as const;
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, status: next[e.status] } : e))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const addEntry = () => {
    if (!newName.trim()) return;
    const entry: BacklogEntry = {
      id: Date.now().toString(),
      name: newName.trim(),
      quantity: parseInt(newQuantity) || 1,
      status: 'unpainted',
    };
    setEntries(prev => [...prev, entry]);
    setNewEntryId(entry.id);
    setModalVisible(false);
    setNewName('');
    setNewQuantity('');
    // scroll to top to show the newest box landing on the pile
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 150);
  };

  const scene = getScene(entries.length);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={[styles.container, { paddingBottom: insets.bottom }]}
        resizeMode="cover"
      >
        {/* scene colour tint darkens/shifts as pile grows */}
        <View style={[styles.sceneTint, { backgroundColor: scene.bg }]} />

        <Text style={styles.title}>🗡️ Backlog Goblin</Text>
        {scene.label ? (
          <Text style={styles.sceneLabel}>{scene.label}</Text>
        ) : (
          <Text style={styles.subtitle}>
            {entries.length === 0
              ? 'No boxes yet...'
              : `${entries.length} box${entries.length !== 1 ? 'es' : ''} in the pile`}
          </Text>
        )}

        <ScrollView
          ref={scrollRef}
          style={styles.stackScroll}
          contentContainerStyle={styles.stackContent}
          showsVerticalScrollIndicator={false}
        >
          {[...entries].reverse().map((item, index) => (
            <AnimatedBox
              key={item.id}
              item={item}
              index={entries.length - 1 - index} // height from bottom: top of pile = max wobble
              isNew={item.id === newEntryId}
              onCycleStatus={cycleStatus}
              onDelete={deleteEntry}
            />
          ))}
        </ScrollView>

        <View style={styles.goblinArea}>
          <Text style={styles.goblin}>🧌</Text>
          <Text style={styles.goblinLabel}>
            {entries.length === 0
              ? 'Nothing to carry yet...'
              : entries.length < 5
                ? 'This is fine.'
                : entries.length < 10
                  ? 'Getting heavy...'
                  : entries.length < 15
                    ? 'Struggling...'
                    : '💀 Send help'}
          </Text>
        </View>

        <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>+ Throw on the pile</Text>
        </Pressable>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add to the Pile</Text>
              <TextInput
                style={styles.input}
                placeholder="Squad name"
                placeholderTextColor="#666"
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                style={styles.input}
                placeholder="Number of minis"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={newQuantity}
                onChangeText={setNewQuantity}
              />
              <Pressable style={styles.button} onPress={addEntry}>
                <Text style={styles.buttonText}>Add to pile</Text>
              </Pressable>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  sceneTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eee',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  sceneLabel: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 6,
    marginBottom: 8,
  },
  stackScroll: {
    flex: 1,
  },
  stackContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  boxWrapper: {
    width: '100%',
    overflow: 'visible',
    marginBottom: 3,
  },
  box: {
    borderRadius: 4,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  boxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#eee',
  },
  boxInfo: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 4,
    marginBottom: 3,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  goblinArea: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  goblin: {
    fontSize: 52,
  },
  goblinLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#4a5568',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a4e',
    padding: 24,
    borderRadius: 16,
    width: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#eee',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a2e',
    padding: 14,
    borderRadius: 8,
    color: '#eee',
    marginBottom: 12,
    fontSize: 16,
  },
  cancelText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});
