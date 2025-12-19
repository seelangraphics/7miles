import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";

const { height} = Dimensions.get("window");

const AddressPage = ({ route }) => {
  const [addresses, setAddresses] = useState([]);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const { priceDetails } = route.params || {};
  const { cartItems = [], getCartTotal } = useCart();
  const navigation = useNavigation();

  const shipping =
    priceDetails?.shipping

  const finalTotal =
    priceDetails?.finalTotal
  

  const emptyForm = {
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  };
  const [form, setForm] = useState(emptyForm);

  const uid = auth.currentUser?.uid;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const formAnim = useRef(new Animated.Value(height)).current; // Separate animation for form
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAddresses();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchAddresses = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, "milesusers", uid);
      const snap = await getDoc(userRef);
      const list = snap.data()?.addresses || [];
      setAddresses(list);
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to load addresses" });
    }
  };

  const openBottomSheet = () => {
    setShowChangeModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowChangeModal(false);
      setSelectedId(null);
    });
  };

  const openFormModal = () => {
    setShowForm(true);
    formAnim.setValue(height);
    Animated.timing(formAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFormModal = () => {
    Animated.timing(formAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
    });
  };

  const handleAddAddress = () => {
    setForm(emptyForm);
    setEditId(null);
    openFormModal();
  };

  const handleEditAddress = (address) => {
    setForm(address);
    setEditId(address.id);
    openFormModal();
  };

  const saveAddress = async () => {
    if (!uid) return;

    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      Toast.show({ type: "error", text1: "Please fill all required fields" });
      return;
    }

    try {
      const userRef = doc(db, "milesusers", uid);
      const snap = await getDoc(userRef);
      let list = snap.data()?.addresses || [];

      if (editId) {
        const existingAddress = list.find((a) => a.id === editId);
        if (existingAddress) {
          list = list.map((a) =>
            a.id === editId ? { ...existingAddress, ...form } : a
          );
          Toast.show({ type: "success", text1: "✓ Address updated" });
        }
      } else {
        list.push({
          id: Date.now().toString(),
          ...form,
          isDefault: list.length === 0,
          createdAt: new Date().toISOString(),
        });
        Toast.show({ type: "success", text1: "✓ Address added" });
      }

      await updateDoc(userRef, { addresses: list });
      closeFormModal();
      fetchAddresses();
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to save address" });
    }
  };

  const deliverHere = async () => {
    if (!uid || !selectedId) return;
    try {
      const userRef = doc(db, "milesusers", uid);
      const updated = addresses.map((a) => ({
        ...a,
        isDefault: a.id === selectedId,
      }));
      await updateDoc(userRef, { addresses: updated });
      Toast.show({ type: "success", text1: "✓ Default address updated" });
      closeBottomSheet();
      fetchAddresses();
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to update address" });
    }
  };

  const handleContinue = () => {
    const defaultAddress = addresses.find((a) => a.isDefault);
    if (!defaultAddress) {
      Toast.show({ type: "error", text1: "Please select a delivery address" });
      return;
    }
    if (cartItems.length === 0) {
      Toast.show({ type: "error", text1: "Your cart is empty" });
      return;
    }
    navigation.navigate("payment", {
      address: defaultAddress,
      shippingaddress:shipping,
      totalAmount: finalTotal,
      cartItems,
      
    });
  };

  const deleteAddress = async (id) => {
    if (!uid) return;
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const userRef = doc(db, "milesusers", uid);
              const snap = await getDoc(userRef);
              let list = snap.data()?.addresses || [];
              list = list.filter((a) => a.id !== id);

              // If we're deleting the default address, make the first one default
              const deletedAddress = addresses.find((a) => a.id === id);
              if (deletedAddress?.isDefault && list.length > 0) {
                list[0].isDefault = true;
              }

              await updateDoc(userRef, { addresses: list });
              Toast.show({ type: "success", text1: "✓ Address deleted" });
              fetchAddresses();
            } catch (error) {
              Toast.show({ type: "error", text1: "Failed to delete address" });
            }
          },
        },
      ]
    );
  };

  const defaultAddress = addresses.find((a) => a.isDefault);
  const otherAddresses = addresses.filter((a) => !a.isDefault);

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Delivery Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity onPress={openBottomSheet}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {defaultAddress ? (
              <View style={styles.selectedCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.defaultTag}>
                    <Ionicons name="checkmark-circle" size={12} color="#fff" />
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => handleEditAddress(defaultAddress)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={14}
                        color="#d6433c"
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => deleteAddress(defaultAddress.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color="#EF4444"
                      />
                    </TouchableOpacity> */}
                  </View>
                </View>

                <View style={styles.addressDetails}>
                  <Text style={styles.name}>
                    {defaultAddress.firstName} {defaultAddress.lastName}
                  </Text>
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={12} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {defaultAddress.phone}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#6B7280"
                    />
                    <Text style={styles.detailText}>
                      {defaultAddress.addressLine1}
                    </Text>
                  </View>
                  {defaultAddress.addressLine2 ? (
                    <View style={styles.detailRow}>
                      <Ionicons name="home-outline" size={12} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {defaultAddress.addressLine2}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="business-outline"
                      size={12}
                      color="#6B7280"
                    />
                    <Text style={styles.detailText}>
                      {defaultAddress.city}, {defaultAddress.state} -{" "}
                      {defaultAddress.pincode}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.emptyCard}
                onPress={handleAddAddress}
              >
                <Ionicons name="add-circle-outline" size={24} color="#d6433c" />
                <Text style={styles.emptyText}>Add Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Order Items Section */}
          {cartItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Order Items ({cartItems.length})
              </Text>
              {cartItems.map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={
                        typeof item.image === "string"
                          ? { uri: item.image }
                          : item.image
                      }
                      style={styles.itemImage}
                    />
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Text style={styles.itemPrice}>₹{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    ₹{getCartTotal().toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Price Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                ₹{getCartTotal().toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>₹{shipping}</Text>
            </View>

            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{finalTotal}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.bottomPrice}>₹{finalTotal}</Text>
            <Text style={styles.bottomLabel}>Total</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!defaultAddress || cartItems.length === 0) &&
                styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!defaultAddress || cartItems.length === 0}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
            <Ionicons name="arrow-forward" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Address Selection Modal */}
      <Modal visible={showChangeModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeBottomSheet}
          />
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Select Address</Text>
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() => {
                  closeBottomSheet();
                  setTimeout(() => {
                    handleAddAddress();
                  }, 300);
                }}
              >
                <Ionicons name="add" size={12} color="#fff" />
                <Text style={styles.addAddressText}>ADD NEW</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={false}
            >
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressOption,
                    address.isDefault && styles.defaultOption,
                  ]}
                  onPress={() => setSelectedId(address.id)}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.optionLeft}>
                      <Ionicons
                        name={
                          selectedId === address.id
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={12}
                        color="#d6433c"
                      />
                      <Text style={styles.optionName}>
                        {address.firstName} {address.lastName}
                      </Text>
                      {address.isDefault && (
                        <View style={styles.optionTag}>
                          <Text style={styles.optionTagText}>DEFAULT</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.optionActions}>
                      <TouchableOpacity
                        onPress={() => {
                          closeBottomSheet();
                          setTimeout(() => {
                            handleEditAddress(address);
                          }, 300);
                        }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={12}
                          color="#d6433c"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteAddress(address.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={12}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.optionPhone}>{address.phone}</Text>
                  <Text style={styles.optionAddress}>
                    {address.addressLine1}
                  </Text>
                  {address.addressLine2 && (
                    <Text style={styles.optionAddress}>
                      {address.addressLine2}
                    </Text>
                  )}
                  <Text style={styles.optionLocation}>
                    {address.city}, {address.state} - {address.pincode}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedId && (
              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.deliverButton}
                  onPress={deliverHere}
                >
                  <Ionicons name="checkmark-circle" size={12} color="#fff" />
                  <Text style={styles.deliverText}>DELIVER HERE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeSheet}
                  onPress={closeBottomSheet}
                >
                  <Text style={styles.closeText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Add/Edit Address Modal - SIMPLIFIED */}
      <Modal visible={showForm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeFormModal}
          />
          <Animated.View
            style={[
              styles.formSheet,
              { transform: [{ translateY: formAnim }] },
            ]}
          >
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editId ? "Edit Address" : "Add Address"}
              </Text>
              <TouchableOpacity onPress={closeFormModal}>
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContent}
              showsVerticalScrollIndicator={false}
            >
              {Object.keys(emptyForm).map((key) => (
                <View key={key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {key === "addressLine1"
                      ? "Address Line 1 *"
                      : key === "addressLine2"
                      ? "Address Line 2"
                      : key === "pincode"
                      ? "PIN Code *"
                      : key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1") +
                        " *"}
                  </Text>
                  <TextInput
                    placeholder={
                      key === "firstName"
                        ? "First Name"
                        : key === "lastName"
                        ? "Last Name"
                        : key === "phone"
                        ? "Phone Number"
                        : key === "addressLine1"
                        ? "House no., Building, Street"
                        : key === "addressLine2"
                        ? "Apartment, Suite, etc."
                        : key === "city"
                        ? "City"
                        : key === "state"
                        ? "State"
                        : key === "pincode"
                        ? "PIN Code"
                        : ""
                    }
                    style={styles.input}
                    value={form[key]}
                    onChangeText={(v) => setForm({ ...form, [key]: v })}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={
                      key === "phone" || key === "pincode"
                        ? "phone-pad"
                        : "default"
                    }
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.formFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeFormModal}
              >
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveAddress}>
                <Text style={styles.saveBtnText}>SAVE ADDRESS</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default AddressPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3eeea", // Changed to specified bg color
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#f3eeea",
  },
  headerTitle: {
    fontSize: 15, // Header font size
    fontWeight: "700",
    color: "#d2c1e2", // Header text color
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15, // Header font size
    fontWeight: "700",
    color: "#e74c3c",
    letterSpacing: 0.5,
  },
  changeText: {
    fontSize: 13.5, // Normal font size
    color: "#e74c3c", // Using same purple color
    fontWeight: "600",
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#e5d9f2", // Light purple border
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  defaultTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000", // Black for buttons
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  defaultText: {
    color: "#fff", // White text on black button
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionIcon: {
    padding: 4,
  },
  addressDetails: {
    gap: 6,
  },
  name: {
    fontSize: 13.5, // Normal font size
    fontWeight: "600",
    color: "#000", // Black text
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  detailText: {
    fontSize: 13.5, // Normal font size
    color: "#000", // Black text
    flex: 1,
    lineHeight: 16,
  },
  emptyCard: {
    borderWidth: 2,
    borderColor: "#d2c1e2", // Purple border
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
  },
  emptyText: {
    fontSize: 13.5, // Normal font size
    color: "#d2c1e2", // Purple text
    fontWeight: "600",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3eeea", 
  },
  itemImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  itemImage: {
    width: 68,
    height: 68,
    borderRadius: 6,
    backgroundColor: "#f3eeea",
  },
  quantityBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#000", 
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: "#fff", 
    fontSize: 10,
    fontWeight: "700",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#d2c1e2",
  },
  itemTotal: {
    fontSize: 13.5, 
    fontWeight: "700",
    color: "#000",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 13.5,
    color: "#000", 
  },
  priceValue: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5d9f2",
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#e74c3c", 
  },
  totalValue: {
    fontSize: 15, 
    fontWeight: "700",
    color: "#000",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5d9f2", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  bottomPrice: {
    fontSize: 15, 
    fontWeight: "700",
    color: "#000", 
  },
  bottomLabel: {
    fontSize: 11,
    color: "#666",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000", 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#999",
    shadowColor: "#999",
  },
  continueText: {
    color: "#fff", 
    fontSize: 13.5, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000cc",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "#f3eeea",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  sheetHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0d0ec",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#d2c1e2",
    borderRadius: 2,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    position: "absolute",
    right: 20,
    top: 20,
  },
  addAddressText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sheetContent: {
    padding: 20,
    maxHeight: "70%",
    backgroundColor: "#f3eeea",
  },
  addressOption: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  defaultOption: {
    borderColor: "#000",
    backgroundColor: "#f9f9f9",
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  optionTag: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 6,
  },
  optionTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  optionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  optionPhone: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
  },
  optionAddress: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 2,
  },
  optionLocation: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  sheetFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0d0ec",
    backgroundColor: "#fff",
  },
  deliverButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  deliverText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  closeSheet: {
    padding: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
  formSheet: {
    backgroundColor: "#f3eeea",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0d0ec",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  formContent: {
    padding: 20,
    maxHeight: "70%",
    backgroundColor: "#f3eeea",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fff",
  },
  inputFocus: {
    borderColor: "#000",
  },
  formFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0d0ec",
    gap: 12,
    backgroundColor: "#fff",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cancelBtnText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});