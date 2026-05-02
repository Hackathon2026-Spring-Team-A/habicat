import { Calendar } from "react-native-calendars";
import { View } from "react-native";

export default function CalendarViews () {
    return (
        <View>
            <Calendar
                onDayPress={(day) => {
                    console.log(day);
                }}
            />
        </View>
    );
}