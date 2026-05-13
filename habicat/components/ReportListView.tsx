import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ReportRecord } from '../hooks/useReports';

type Props = {
  reports: ReportRecord;
};

export default function ReportListView({ reports }: Props) {
  const items = Object.entries(reports)
    .sort((a, b) => b[0].localeCompare(a[0]));

  const formatDate = (str: string) => {
    const [y, m, d] = str.split('-');
    return `${y}年${parseInt(m)}月${parseInt(d)}日`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>日報一覧</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>まだ日報がありません</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={([date]) => date}
          renderItem={({ item: [date, memo] }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{formatDate(date)}</Text>
              <Text style={styles.memo}>{memo}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 60,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 6,
  },
  memo: {
    fontSize: 14,
    color: '#333',
    lineHeight: 21,
  },
});