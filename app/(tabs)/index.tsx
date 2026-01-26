import AsyncStorage from '@react-native-async-storage/async-storage'; // Define what a backlog entry looks like
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Swipeable } from 'react-native-gesture-handler';
type BacklogEntry = {
  id: string;
  name: string;
  quantity: number;
  status: 'unpainted' | 'in_progress' | 'painted';
};

export default function HomeScreen() {
  const [entries, setEntries] = useState<BacklogEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');


  useEffect(() => {
    const loadEntries = async () => {
      try {
        const saved = await AsyncStorage.getItem('backlog-entries');
        if (saved) {
          setEntries(JSON.parse(saved));
        }
      }
      catch (e) {
        console.log('Failed to load entries');
      }
    };
    loadEntries();

  }, []);

  useEffect(() => {
    const saveEntries = async () => {
      try {
        await AsyncStorage.setItem('backlog-entries', JSON.stringify(entries));
      }
      catch (e) {
        console.log('Failed to save entries');
      }
    };
    saveEntries();

  }, [entries]);

  const cycleStatus = (id: string) => {
    setEntries(entries.map(entry => {

      if (entry.id == id) {
        const nextStatus = {
          unpainted: 'in_progress',
          in_progress: 'painted',
          painted: 'unpainted',
        } as const;
        return { ...entry, status: nextStatus[entry.status] };
      }
      return entry;
    }))
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  }

  const addEntry = () => {
    if (!newName.trim()) {
      return;
    }

    const newEntry: BacklogEntry = {
      id: Date.now().toString(),
      name: newName,
      quantity: parseInt(newQuantity) || 1,
      status: 'unpainted',
    };
    setEntries([...entries, newEntry]);
    setModalVisible(false);
    setNewName('');
    setNewQuantity('');
  };


  const renderRightActions = (id: string) => (
    <Pressable style={styles.deleteAction} onPress={() => deleteEntry(id)}>
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🗡️ Backlog Goblin</Text>
        <Text style={styles.subtitle}>{entries.length} squads in the pile</Text>

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}
              onSwipeableOpen={() => deleteEntry(item.id)}
            >
              <Pressable style={styles.card} onPress={() => cycleStatus(item.id)}>

                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardInfo}>
                  {item.quantity} minis • {item.status}
                </Text>
              </Pressable>
            </Swipeable>
          )
          }
        />

        < Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>+ Add Squad</Text>
        </Pressable >
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Squad</Text>

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
                <Text style={styles.buttonText}>Add Squad</Text>
              </Pressable>

              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View >
    </GestureHandlerRootView>

  );
}



const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#eee',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#2a2a4e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#eee',
  },
  cardInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4a5568',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
