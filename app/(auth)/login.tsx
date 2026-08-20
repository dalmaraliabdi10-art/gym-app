import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';

type Mode = 'password' | 'otp_email' | 'otp_code';

function showError(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
}

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const trimmedEmail = email.trim().toLowerCase();

  const handlePasswordSignIn = async () => {
    if (!trimmedEmail.includes('@')) {
      showError('Ogiltig e-post', 'Ange en giltig e-postadress.');
      return;
    }
    if (password.length < 6) {
      showError('För kort lösenord', 'Lösenordet måste vara minst 6 tecken.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login credentials')) {
        showError(
          'Felaktig inloggning',
          'Användaren finns inte eller lösenordet är fel. Klicka "Skapa konto" för att registrera dig.',
        );
      } else {
        showError('Inloggning misslyckades', error.message);
      }
    }
  };

  const handleSignUp = async () => {
    if (!trimmedEmail.includes('@')) {
      showError('Ogiltig e-post', 'Ange en giltig e-postadress.');
      return;
    }
    if (password.length < 6) {
      showError('För kort lösenord', 'Lösenordet måste vara minst 6 tecken.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });
    setLoading(false);
    if (error) {
      showError('Kunde inte skapa konto', error.message);
      return;
    }
    showError(
      'Konto skapat',
      'Om e-postbekräftelse är på i Supabase: kolla inboxen. Annars är du redan inloggad.',
    );
  };

  const sendCode = async () => {
    if (!trimmedEmail.includes('@')) {
      showError('Ogiltig e-post', 'Ange en giltig e-postadress.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      showError('Kunde inte skicka kod', error.message);
      return;
    }
    setMode('otp_code');
  };

  const verifyCode = async () => {
    if (code.trim().length < 6) {
      showError('Ofullständig kod', 'Koden ska vara 6 siffror.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: code.trim(),
      type: 'email',
    });
    setLoading(false);
    if (error) showError('Fel kod', error.message);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>gym-app</Text>

        {mode === 'password' && (
          <>
            <Text style={styles.subtitle}>Logga in eller skapa konto</Text>
            <TextInput
              style={styles.input}
              placeholder="E-post"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Lösenord (minst 6 tecken)"
              placeholderTextColor="#888"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePasswordSignIn}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Logga in</Text>}
            </Pressable>
            <Pressable
              style={[styles.buttonSecondary, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Skapa konto</Text>
            </Pressable>
            <Pressable onPress={() => setMode('otp_email')} disabled={loading}>
              <Text style={styles.link}>Logga in med engångskod istället</Text>
            </Pressable>
          </>
        )}

        {mode === 'otp_email' && (
          <>
            <Text style={styles.subtitle}>Få en engångskod via mejl</Text>
            <TextInput
              style={styles.input}
              placeholder="din@email.se"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={sendCode}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Skicka kod</Text>}
            </Pressable>
            <Pressable onPress={() => setMode('password')} disabled={loading}>
              <Text style={styles.link}>Använd lösenord istället</Text>
            </Pressable>
          </>
        )}

        {mode === 'otp_code' && (
          <>
            <Text style={styles.subtitle}>Vi skickade en kod till {trimmedEmail}</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor="#888"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              editable={!loading}
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={verifyCode}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Logga in</Text>}
            </Pressable>
            <Pressable onPress={() => setMode('otp_email')} disabled={loading}>
              <Text style={styles.link}>Använd annan e-post</Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  inner: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: '#fff', fontSize: 36, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#aaa', fontSize: 15, textAlign: 'center', marginBottom: 8 },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    padding: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonSecondary: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonSecondaryText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  link: { color: '#60a5fa', fontSize: 14, textAlign: 'center', marginTop: 8 },
});
