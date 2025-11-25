import { View, Text, TouchableOpacity } from "react-native";

const Chip = ({ label, onClose }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 4,
      }}
    >
      <Text style={{ marginRight: 8 }}>{label}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Chip;
