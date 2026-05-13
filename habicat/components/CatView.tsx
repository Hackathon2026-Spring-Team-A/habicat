import { View, Text, Image, StyleSheet } from 'react-native';

const CAT_IMAGES: Record<1 | 2 | 3, any> = {
  1: require('../assets/images/cat1.png'),
  2: require('../assets/images/cat2.png'),
  3: require('../assets/images/cat3.png'),
};

type Props = {
  streakDays: number;
  catStage: 1 | 2 | 3;
};

export default function CatView({ streakDays, catStage }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>運動の内容をデータベースから取得し ここで表示する</Text>

      <Image
        source={CAT_IMAGES[catStage]}
        style={styles.catImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 24,
  },
  catImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
});