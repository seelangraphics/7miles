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
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
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
    mobileNo: "",
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
      "mobileNo",
    ];
    return requiredFields.every((field) => formData[field].trim() !== "");
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
      mobileNo: "",
      pincode: "",
      deliveryInstructions: "",
      isDefault: false,
    });
  };

  const handleSubmit = async () => {
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
        await updateDoc(userRef, { addresses: updatedAddresses });

        setSavedAddresses(updatedAddresses);
        setModalVisible(false);
        Toast.show({
          type: "success",
          text1: "Address Saved Successfully",
          position: "bottom",
          visibilityTime: 2000,
        });
        resetForm();
      } catch (error) {
        console.error("Error adding address: ", error);
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
      mobileNo: address.mobileNo || "",
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
    <TouchableOpacity style={styles.addressCard}>
      <View style={styles.cardHeader}>
        <View style={styles.addressHeader}>
          <Ionicons name="location-sharp" size={20} color="#4F46E5" />
          <Text style={styles.addressName}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#fff" />
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
        <Text style={styles.phoneText}>📱 {item.mobileNo}</Text>

        {item.deliveryInstructions && (
          <View style={styles.instructionsContainer}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.instructionsText}>
              {item.deliveryInstructions}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(item)}
        >
          <Ionicons name="create-outline" size={14} color="#4F46E5" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Ionicons name="trash-outline" size={14} color="#EF4444" />
          <Text style={[styles.actionText, { color: "#EF4444" }]}>Remove</Text>
        </TouchableOpacity>

        {!item.isDefault && savedAddresses.length > 1 && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleMakeDefault(item.id)}
            >
              <Ionicons name="star-outline" size={14} color="#F59E0B" />
              <Text style={[styles.actionText, { color: "#F59E0B" }]}>
                Set as Default
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Addresses</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={savedAddresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="location-off" size={50} color="#E0E0E0" />
              <Text style={styles.emptyText}>No saved addresses</Text>
              <Text style={styles.emptySubtext}>
                Add your first address to get started
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
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
              <AntDesign name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {formData.id ? "Edit Address" : "Add New Address"}
            </Text>
            <View style={{ width: 24 }} />
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
                  value={formData.mobileNo}
                  onChangeText={(text) => handleInputChange("mobileNo", text)}
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
                    onChangeText={(text) => handleInputChange("pincode", text)}
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Delivery Instructions (Optional)
                </Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="e.g., Leave at front door, Call before delivery, etc."
                  value={formData.deliveryInstructions}
                  onChangeText={(text) =>
                    handleInputChange("deliveryInstructions", text)
                  }
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
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
                  trackColor={{ false: "#E0E0E0", true: "#4F46E5" }}
                  thumbColor={formData.isDefault ? "white" : "white"}
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
                <>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                  <Text style={styles.saveButtonText}>
                    {formData.id ? "Update Address" : "Save Address"}
                  </Text>
                </>
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
    backgroundColor: "#F9FAFB",
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  defaultBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  addressDetails: {
    gap: 6,
  },
  addressText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  phoneText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
    lineHeight: 16,
  },
  addressActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: "#E5E7EB",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalContent: {
    flex: 1,
    padding: 16,
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
    color: "#374151",
    marginBottom: 8,
  },
  modalInput: {
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    color: "#111827",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  defaultToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  defaultToggleText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  defaultToggleSubtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    height: 56,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
