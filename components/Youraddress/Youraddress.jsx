import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../Firebase/Firebase";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Toast from "react-native-toast-message";

export const Youraddress = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    phone: "",
    pincode: "",
    deliveryInstructions: "",
    isDefault: false,
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

const validateForm = () => {
  const requiredFields = [
    "firstName",
    "lastName",
    "addressLine1",
    "city",
    "state",
    "pincode",
    "phone",
  ];
  
  // Check for empty required fields
  const emptyFields = requiredFields.filter(field => {
    const value = formData[field].toString().trim();
    return value === "";
  });
  
  if (emptyFields.length > 0) {
    const fieldNames = {
      firstName: "First Name",
      lastName: "Last Name",
      addressLine1: "Address Line 1",
      city: "City",
      state: "State",
      pincode: "Pincode",
      phone: "Mobile Number",
    };
    
    Alert.alert(
      "Missing Information",
      `Please fill in the following required fields:\n\n• ${emptyFields.map(field => fieldNames[field]).join("\n• ")}`,
      [{ text: "OK" }]
    );
    return false;
  }
  
  // Validate mobile number (10 digits)
  if (!/^\d{10}$/.test(formData.phone)) {
    Alert.alert(
      "Invalid Mobile Number",
      "Mobile number must be exactly 10 digits",
      [{ text: "OK", onPress: () => handleInputChange("phone", "") }]
    );
    return false;
  }
  
  // Validate pincode (6 digits)
  if (!/^\d{6}$/.test(formData.pincode)) {
    Alert.alert(
      "Invalid Pincode",
      "Pincode must be exactly 6 digits",
      [{ text: "OK", onPress: () => handleInputChange("pincode", "") }]
    );
    return false;
  }
  
  // Optional: Validate pincode matches auto-filled city/state
  if (formData.city === "" || formData.state === "") {
    Alert.alert(
      "Invalid Pincode",
      "Please enter a valid Indian pincode to auto-fill city and state",
      [{ text: "OK" }]
    );
    return false;
  }
  
  return true;
};

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      phone: "",
      pincode: "",
      deliveryInstructions: "",
      isDefault: false,
    });
  };

const handleSubmit = async () => {
  if (formData.phone.length < 10) {
    alert("Phone number should be 10 digits")
    return;
  }
  
  if (!validateForm()) {
    Toast.show({
      type: "error",
      text1: "Failed to Submit",
      text2: "Please fill all required fields",
      position: "bottom",
      visibilityTime: 5000,
    });
    return;
  }

  setLoading(true);

  if (user) {
    try {
      const userRef = doc(db, "milesusers", user.uid);
      const userDoc = await getDoc(userRef);

      let updatedAddresses = userDoc.exists()
        ? [...(userDoc.data()?.addresses || [])]
        : [];

      // EDIT MODE: Update existing address
      if (formData.id) {
        updatedAddresses = updatedAddresses.map((addr) => {
          // If this is the address being edited
          if (addr.id === formData.id) {
            // If setting as default, update all addresses
            if (formData.isDefault) {
              updatedAddresses = updatedAddresses.map((a) => ({
                ...a,
                isDefault: false,
              }));
            }
            
            return {
              ...addr,
              ...formData,
              // Ensure ID remains the same
              id: formData.id,
            };
          }
          return addr;
        });
      } 
      // ADD MODE: Add new address
      else {
        // If setting as default or first address
        if (formData.isDefault || updatedAddresses.length === 0) {
          updatedAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
        }

        const addressData = {
          ...formData,
          id: Date.now().toString(),
          isDefault: formData.isDefault || updatedAddresses.length === 0,
          createdAt: new Date().toISOString(),
        };

        updatedAddresses.push(addressData);
      }

      await updateDoc(userRef, { addresses: updatedAddresses });

      setSavedAddresses(updatedAddresses);
      setModalVisible(false);
      Toast.show({
        type: "success",
        text1: formData.id ? "Address Updated" : "Address Saved Successfully",
        position: "bottom",
        visibilityTime: 2000,
      });
      resetForm();
    } catch (error) {
      console.error("Error saving address: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to Save",
        text2: "Failed to save address",
        position: "bottom",
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  }
};

  const handleMakeDefault = async (addressId) => {
    try {
      const userRef = doc(db, "milesusers", user.uid);

      const updatedAddresses = savedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      await updateDoc(userRef, { addresses: updatedAddresses });
      setSavedAddresses(updatedAddresses);

      Toast.show({
        type: "success",
        text1: "Default Address Set",
        text2: "This address is now your default.",
        position: "bottom",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Error setting default address: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to Set",
        text2: "Failed to set default address",
        position: "bottom",
        visibilityTime: 5000,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "milesusers", currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const addresses = doc.data().addresses || [];
            setSavedAddresses(addresses);
          }
        });
        return unsubscribeSnapshot;
      } else {
        setSavedAddresses([]);
      }
    });
    return unsubscribe;
  }, []);

  const handleEditAddress = (address) => {
    setFormData({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      phone: address.phone || "",
      pincode: address.pincode || "",
      deliveryInstructions: address.deliveryInstructions || "",
      isDefault: address.isDefault || false,
      id: address.id, // Keep the original ID for editing
    });
    setModalVisible(true);
  };

  const handleDeleteAddress = async (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const userRef = doc(db, "milesusers", user.uid);
              const updatedAddresses = savedAddresses.filter(
                (addr) => addr.id !== addressId
              );

              // If deleting default, make first address default
              const deletedAddress = savedAddresses.find(
                (a) => a.id === addressId
              );
              if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
                updatedAddresses[0].isDefault = true;
              }

              await updateDoc(userRef, { addresses: updatedAddresses });
              setSavedAddresses(updatedAddresses);

              Toast.show({
                type: "success",
                text1: "Address Deleted Successfully",
                position: "bottom",
                visibilityTime: 2000,
              });
            } catch (error) {
              console.error("Error deleting address: ", error);
              Toast.show({
                type: "error",
                text1: "Failed to delete address",
                text2: error.message,
                position: "bottom",
                visibilityTime: 5000,
              });
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.addressCard}>
      <View style={styles.cardHeader}>
        <View style={styles.addressHeader}>
          <View style={styles.addressIconContainer}>
            <Text style={styles.addressIcon}>A</Text>
          </View>
          <View style={styles.addressTitleContainer}>
            <Text style={styles.addressName}>
              {`${item.firstName} ${item.lastName}`}
            </Text>
            <Text style={styles.phoneNumber}>{item.phone}</Text>
          </View>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.addressDetails}>
        <Text style={styles.addressText}>{item.addressLine1}</Text>
        {item.addressLine2 && (
          <Text style={styles.addressText}>{item.addressLine2}</Text>
        )}
        <Text style={styles.addressText}>
          {`${item.city}, ${item.state}, ${item.pincode}`}
        </Text>
        <Text style={styles.addressText}>{item.country}</Text>

     
      </View>

      <View style={styles.addressActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditAddress(item)}
        >
          <Text style={[styles.actionText, styles.editText]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Remove</Text>
        </TouchableOpacity>

        {!item.isDefault && savedAddresses.length > 1 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.defaultButton]}
            onPress={() => handleMakeDefault(item.id)}
          >
            <Text style={[styles.actionText, styles.defaultButtonText]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
useEffect(() => {
  const fetchAddressFromPincode = async () => {
    if (formData.pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
        const data = await response.json();
        
        // Check if the API returned a valid result
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0]; // Get the first matching result
          
          // Update the form fields with the API data
          setFormData(prev => ({
            ...prev,
            city: postOffice.District || prev.city,
            state: postOffice.State || prev.state,
          }));
        } else {
          Toast.show({
            type: "error",
            text1: "Pincode Not Found",
            text2: "Please check the entered pincode",
            position: "bottom",
            visibilityTime: 2000,
          });
        }
      } catch (error) {
        console.error("Error fetching pincode details: ", error);
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Failed to fetch address details",
          position: "bottom",
          visibilityTime: 3000,
        });
      }
    }
  };

  fetchAddressFromPincode();
}, [formData.pincode]); // Dependency on pincode
  
  useEffect(() => {
  const validateAndFetchPincode = async () => {
    const pincode = formData.pincode.trim();
    
    if (pincode.length === 6) {
      // Validate pincode is numeric
      if (!/^\d{6}$/.test(pincode)) {
        Alert.alert(
          "Invalid Pincode",
          "Pincode must contain only numbers",
          [{ text: "OK", onPress: () => handleInputChange("pincode", "") }]
        );
        return;
      }
      
      setLoading(true);
      
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          
          setFormData(prev => ({
            ...prev,
            city: postOffice.District || prev.city,
            state: postOffice.State || prev.state,
          }));
          
          Toast.show({
            type: "success",
            text1: "Address Found",
            text2: "City and state auto-filled",
            position: "bottom",
            visibilityTime: 2000,
          });
        } else {
          Alert.alert(
            "Invalid Pincode",
            "No address found for this pincode. Please enter a valid Indian pincode.",
            [{ text: "OK" }]
          );
          // Clear city and state if pincode is invalid
          setFormData(prev => ({
            ...prev,
            city: "",
            state: ""
          }));
        }
      } catch (error) {
        console.error("Error fetching pincode details: ", error);
        Alert.alert(
          "Network Error",
          "Failed to validate pincode. Please check your connection.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    }
  };

  validateAndFetchPincode();
}, [formData.pincode]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
    

        <FlatList
          data={savedAddresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📍</Text>
              </View>
              <Text style={styles.emptyText}>No saved addresses</Text>
              <Text style={styles.emptySubtext}>
                Add your first address to get started
              </Text>
            </View>
          }
        />

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+ Add New Address</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Address Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {formData.id ? "Edit Address" : "Add New Address"}
            </Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <ScrollView
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>First Name*</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="John"
                    value={formData.firstName}
                    onChangeText={(text) =>
                      handleInputChange("firstName", text)
                    }
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Last Name*</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChangeText={(text) => handleInputChange("lastName", text)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number*</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address Line 1*</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="House No, Building, Street"
                  value={formData.addressLine1}
                  onChangeText={(text) =>
                    handleInputChange("addressLine1", text)
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address Line 2 (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Area, Colony, Landmark"
                  value={formData.addressLine2}
                  onChangeText={(text) =>
                    handleInputChange("addressLine2", text)
                  }
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Pincode*</Text>
                <TextInput
  style={styles.modalInput}
  placeholder="560001"
  keyboardType="number-pad"
  value={formData.pincode}
  onChangeText={(text) => {
    // Only allow numeric input up to 6 digits
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) {
      handleInputChange("pincode", numericText);
    }
  }}
  maxLength={6}
/>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>City*</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Bangalore"
                    value={formData.city}
                    onChangeText={(text) => handleInputChange("city", text)}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>State*</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Karnataka"
                    value={formData.state}
                    onChangeText={(text) => handleInputChange("state", text)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Country*</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="India"
                    value={formData.country}
                    onChangeText={(text) => handleInputChange("country", text)}
                    editable={false}
                  />
                </View>
              </View>

             

              <View style={styles.defaultToggle}>
                <View>
                  <Text style={styles.defaultToggleText}>
                    Set as default address
                  </Text>
                  <Text style={styles.defaultToggleSubtext}>
                    Your default address will be used for all orders
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#E0E0E0", true: "#d32f2f" }}
                  thumbColor={formData.isDefault ? "#fff" : "#f5f5f5"}
                  ios_backgroundColor="#E0E0E0"
                  value={formData.isDefault}
                  onValueChange={(value) =>
                    handleInputChange("isDefault", value)
                  }
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {formData.id ? "Update Address" : "Save Address"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  addressTitleContainer: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#666",
  },
  defaultBadge: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  addressDetails: {
    paddingLeft: 52, // Align with address icon
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 4,
  },
  instructionsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d32f2f",
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  addressActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: "#ffebee",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
  },
  defaultButton: {
    backgroundColor: "#ffebee",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  editText: {
    color: "#d32f2f",
  },
  deleteText: {
    color: "#d32f2f",
  },
  defaultButtonText: {
    color: "#d32f2f",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 36,
    color: "#d32f2f",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
  
    left: 0,
    right: 0,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  addButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  closeButtonText: {
    fontSize: 28,
    color: "#666",
    fontWeight: "300",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  modalInput: {
    height: 48,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
  },
  defaultToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  defaultToggleText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  defaultToggleSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#999",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});