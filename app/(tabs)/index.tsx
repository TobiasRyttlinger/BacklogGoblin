import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';

// Define what a backlog entry looks like
type BacklogEntry = {
  id: string;
  name: string;
  quantity: number;
  status: 'unpainted' | 'in_progress' | 'painted';
};

export default function HomeScreen() {
  const [entries, setEntries] = useState<BacklogEntry[]>([
    { id: '1', name: 'Space Marines Squad', quantity: 10, status: 'unpainted' },
    { id: '2', name: 'Ork Boyz', quantity: 20, status: 'in_progress' },
    { id: '3', name: 'Necron Warriors', quantity: 12, status: 'painted' },
  ]);


  const [modalVisible,setModalVisible] = useState(false);

  const [newName,setNewName] = useState('');
  const [newQuantity,setNewQuantity] = useState('');

  const addEntry = () => {

if(!newName.trim()){
   return;
  }

    const newEntry: BacklogEntry = {
        id: Date.now().toString(),
        name: 'new squad',
        quantity: 5,
        status: 'unpainted',
    };
    setEntries([...entries,newEntry]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗡️ Backlog Goblin</Text>
      <Text style={styles.subtitle}>{entries.length} squads in the pile</Text>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardInfo}>
              {item.quantity} minis • {item.status}
            </Text>
          </View>
        )}
      />

      <Pressable style={styles.button} onPress = {addEntry}>
        <Text style={styles.buttonText}>+ Add Squad</Text>
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
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
