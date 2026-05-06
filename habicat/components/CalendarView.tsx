import { useState } from 'react';
import { Calendar } from "react-native-calendars";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Ellipse } from 'react-native-svg';
import ReportModal from './ReportModal';

// 猫の足跡スタンプコンポーネント
const CatPaw = () => (
    <Svg width="24" height="24" viewBox="0 0 36 36">
        {/* 大きい肉球 */}
        <Ellipse cx="18" cy="24" rx="7" ry="5.5" fill="#60a5fa" />
        {/* 小さい肉球 x3 */}
        <Ellipse cx="10" cy="16" rx="3.2" ry="2.5" fill="#60a5fa" />
        <Ellipse cx="18" cy="13" rx="3.2" ry="2.5" fill="#60a5fa" />
        <Ellipse cx="26" cy="16" rx="3.2" ry="2.5" fill="#60a5fa" />
    </Svg>
);

export default function CalendarViews () {

const [reports, setReports] = useState<Record<string, string>>({});
const [modalVisible, setModalVisible] = useState(false);
const [selectedDate, setSelectedDate] = useState('');

const handleDayPress = (dateString: string) => {
    setSelectedDate(dateString);
    setModalVisible(true);
};

const handleSubmit = (memo: string) => {
    setReports(prev => ({ ...prev, [selectedDate]: memo }));
    setModalVisible(false);
};

    return (
        <View style={{ paddingTop: 20, paddingHorizontal: 16 }}>
            <Calendar
                style={{
                    borderRadius: 12,
                    elevation: 3,
                    shadowColor: '#000',
                }}
                theme={{
                    textSectionTitleColor: '#111',      // 曜日ヘッダーのデフォルト色
                    textSectionTitleDisabledColor: '#ccc',
                    dayTextColor: '#111',
                    todayTextColor: '#fff',
                    selectedDayTextColor: '#2a2929',
                } as any}
                monthFormat={'yyyy年 M月'}
                hideExtraDays={true}
                onDayPress={(day) => {
                    console.log(day);
                }}
                dayComponent={({ date, state }) => (
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            minHeight: 30,
                            alignItems: 'center',
                            paddingTop: 8,
                            paddingBottom: 8,
                        }}
                        onPress={() => handleDayPress(date?.dateString ?? '')}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: (() => {
                                    if (state === 'disabled') return '#ccc';
                                    if (state === 'today') return '#fff';
                                    const dow = new Date(date?.dateString ?? '').getDay();
                                    if (dow === 0) return '#ef4444'; // 日曜：赤
                                    if (dow === 6) return '#60a5fa'; // 土曜：青
                                    return '#111';
                                })(),
                                backgroundColor:
                                    state === 'today' ? '#4F46E5' : 'transparent',
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                textAlign: 'center',
                                lineHeight: 26,
                                overflow: 'hidden',
                            }}
                        >
                            {date?.day}
                        </Text>

                        {/* 日報提出済みなら足跡を表示 */}
                         <View style={{ height: 28, marginTop: 4, justifyContent: 'center' }}>
                            {reports[date?.dateString ?? ''] !== undefined && <CatPaw />}
                        </View>

                    </TouchableOpacity>
                )}
            />
            <ReportModal
                visible={modalVisible}
                dateString={selectedDate || '2026-01-01'}
                existingMemo={reports[selectedDate] ?? null}
                onSubmit={handleSubmit}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}