import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Cat, BookOpen, User } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CalendarView from './components/CalendarView';
import CatView from './components/CatView';
import UserView from './components/UserView';
import ReportListView from './components/ReportListView';
import { useReports } from './hooks/useReports';

const Tab = createBottomTabNavigator();

function AppTabs() {
  const { reports, addReport, streakDays, catStage, totalCount } = useReports();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'ホーム')    return <Home color={color} size={size} />;
          if (route.name === 'ネコ')      return <Cat color={color} size={size} />;
          if (route.name === '日報一覧')  return <BookOpen color={color} size={size} />;
          if (route.name === 'ユーザー')  return <User color={color} size={size} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="ホーム">
        {() => <CalendarView reports={reports} onSubmit={addReport} />}
      </Tab.Screen>
      <Tab.Screen name="ネコ">
        {() => <CatView streakDays={streakDays} catStage={catStage} />}
      </Tab.Screen>
      <Tab.Screen name="ユーザー">
        {() => <UserView streakDays={streakDays} totalCount={totalCount} />}
      </Tab.Screen>
      <Tab.Screen name="日報一覧">
        {() => <ReportListView reports={reports} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}