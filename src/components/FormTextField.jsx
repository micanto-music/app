import {Text, TextInput, View, StyleSheet} from "react-native";
import {COLORS} from "../styles/styles";

export default function FormTextField( {label, errors=[], ...rest}) {
    return (
        <View>
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput style={styles.textInput}
                autoCapitalize="none"
                placeholderTextColor={COLORS.lightGray}
                {...rest}
            />
            {errors.map((err) =>{
                return <Text key={err} style={styles.error}>{err}</Text>
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        color: "#ffffff",
        marginTop: 10,
    },
    textInput: {
        marginTop: 4,
        color: "#ffffff",
        backgroundColor: "#161828",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#4b5564",
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    error: {
        color: COLORS.error
    }
});
