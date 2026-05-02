import { useState } from 'react';
import { Calendar } from "react-native-calendars";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Ellipse } from 'react-native-svg';

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

    const [stamped, setStamped] = useState<Set<string>>(new Set());

    const toggleStamp = (dateString: string) => {
            setStamped(prev => {
                const next = new Set(prev);
                next.has(dateString) ? next.delete(dateString) : next.add(dateString);
                return next;
            });
    };

    return (
        <View style={{ paddingTop: 20, paddingHorizontal: 16 }}>
            <Calendar
                style={{
                    borderRadius: 12,
                    elevation: 3,
                    shadowColor: '#000',
                }}
                monthFormat={'yyyy M月'}
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
                        onPress={() => toggleStamp(date?.dateString ?? '')}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color:
                                    state === 'disabled' ? '#ccc' :
                                    state === 'today'    ? '#fff' : '#111',
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

                         <View style={{ height: 28, marginTop: 4, justifyContent: 'center' }}>
                            {stamped.has(date?.dateString ?? '') && <CatPaw />}
                        </View>

                    </TouchableOpacity>
                )}
            />
        </View>
    );
}