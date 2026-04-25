import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Progress-grafer byggs i milstolpe 6.</Text>
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
