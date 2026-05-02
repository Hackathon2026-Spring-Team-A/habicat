import { Calendar } from "react-native-calendars";
import { View, Text, TouchableOpacity } from "react-native";

export default function CalendarViews () {
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
                        onPress={() => console.log(date)}
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
                            {/* スタンプをここに後で追加 */}
                        </View>

                    </TouchableOpacity>
                )}
            />
        </View>
    );
}