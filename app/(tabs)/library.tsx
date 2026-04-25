import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Övningsbibliotek byggs i milstolpe 3.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#888', fontSize: 14 },
});
