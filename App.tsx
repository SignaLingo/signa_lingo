import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";

export default function App() {
	const [text, setText] = useState<string>('')
	return (
		<View style={styles.view} >
			<TextInput placeholder="Type here to translate!" onChangeText={(newText: string) => setText(newText)} defaultValue={text} />
		</View>
  );
}

const styles = StyleSheet.create({
	view: {
		padding: 10
	},
	textInput: {
		height: 40,
	},
	text: {
		padding: 10,
		fontSize: 42
	}
})
