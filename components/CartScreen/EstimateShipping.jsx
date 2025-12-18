import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function EstimateShipping({ productPrice }) {
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("");
  const [shipping, setShipping] = useState(null);

  const countries = [{ label: "India", value: "India" }];

  const states = [
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Kerala", value: "Kerala" },
    { label: "Karnataka", value: "Karnataka" },
  ];

  const calculateShipping = () => {
    if (pincode.length !== 6) {
      setShipping("Enter valid 6 digit pin code");
      return;
    }

    if (productPrice > 200) {
      setShipping("Standard: ₹0.00 (Free shipping)");
    } else {
      setShipping("Standard: ₹40.00");
    }
  };

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Estimate Shipping</Text>

      <Dropdown
        data={countries}
        labelField="label"
        valueField="value"
        value="India"
        style={styles.dropdown}
        placeholder="Country"
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        disabled
      />

      <Dropdown
        data={states}
        labelField="label"
        valueField="value"
        value={state}
        style={styles.dropdown}
        placeholder="State / Province"
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        onChange={(item) => setState(item.value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Postal / ZIP Code"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        maxLength={6}
        value={pincode}
        onChangeText={setPincode}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={calculateShipping}
        disabled={pincode.length === 0}
      >
        <Text
          style={[
            styles.buttonText,
            pincode.length === 0 && styles.buttonDisabled,
          ]}
        >
          Calculate Shipping
        </Text>
      </TouchableOpacity>

      {shipping && (
        <View style={styles.message}>
          <Text style={styles.msgText}>{shipping}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#f3eeea",
    padding: 16,
    borderRadius: 12,
    paddingBottom:50,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#d2c1e2",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  dropdown: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d2c1e2",
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  placeholder: {
    fontSize: 13.5,
    color: "#9CA3AF",
  },
  selectedText: {
    fontSize: 13.5,
    color: "#333",
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d2c1e2",
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 13.5,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13.5,
  },
  buttonDisabled: {
    color: "#9CA3AF",
  },
  message: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#d6433c",
  },
  msgText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13.5,
  },
});
