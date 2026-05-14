import { View, Text, StyleSheet } from 'react-native';

type Props = {
  streakDays: number;
  totalCount: number;
};

export default function UserView({ streakDays, totalCount }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ユーザー情報編集画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 24,
  },
});