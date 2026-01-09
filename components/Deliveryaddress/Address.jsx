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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const AddressPage = ({ route }) => {
  const [addresses, setAddresses] = useState([]);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const { priceDetails } = route.params || {};
  const { cartItems = [], getCartTotal } = useCart();
  const navigation = useNavigation();

  const shipping = priceDetails?.shipping;
  const finalTotal = priceDetails?.finalTotal;

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
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeValid, setPincodeValid] = useState(false);

  const uid = auth.currentUser?.uid;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const formAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAddresses();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
console.log("cart-item",cartItems)
  // Pincode validation effect
  useEffect(() => {
    const validatePincode = async () => {
      const pincode = form.pincode.trim();
      
      if (pincode.length === 6) {
        // Basic numeric validation
        if (!/^\d{6}$/.test(pincode)) {
          setPincodeError("Pincode must contain only numbers");
          setPincodeValid(false);
          return;
        }
        
        setPincodeLoading(true);
        setPincodeError("");
        
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = await response.json();
          
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            
            setForm((prev) => ({
              ...prev,
              city: postOffice.District || prev.city,
              state: postOffice.State || prev.state,
            }));
            
            setPincodeValid(true);
            setPincodeError("");
            
            Toast.show({
              type: "success",
              text1: "✓ Address found",
              text2: "City & State auto-filled",
              position: "bottom",
              visibilityTime: 2000,
            });
          } else {
            setPincodeError("Invalid pincode. No address found.");
            setPincodeValid(false);
            setForm((prev) => ({
              ...prev,
              city: "",
              state: "",
            }));
            
            Alert.alert(
              "Invalid Pincode",
              "Please enter a valid Indian postal code",
              [{ text: "OK" }]
            );
          }
        } catch (error) {
          console.error("Error fetching pincode:", error);
          setPincodeError("Failed to validate pincode. Check internet connection.");
          setPincodeValid(false);
          
          Alert.alert(
            "Network Error",
            "Unable to validate pincode. Please try again.",
            [{ text: "OK" }]
          );
        } finally {
          setPincodeLoading(false);
        }
      } else {
        setPincodeValid(false);
        setPincodeError("");
      }
    };
    
    // Debounce to prevent too many API calls
    const timer = setTimeout(validatePincode, 800);
    return () => clearTimeout(timer);
  }, [form.pincode]);

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
      setPincodeError("");
      setPincodeValid(false);
    });
  };

  const handleAddAddress = () => {
    setForm(emptyForm);
    setEditId(null);
    setPincodeError("");
    setPincodeValid(false);
    openFormModal();
  };

  const handleEditAddress = (address) => {
    setForm(address);
    setEditId(address.id);
    // Check if pincode was previously validated
    if (address.pincode && address.city && address.state) {
      setPincodeValid(true);
    }
    openFormModal();
  };

  const validateFormFields = () => {
    // Check all required fields
    const requiredFields = [
      { field: "firstName", name: "First Name" },
      { field: "lastName", name: "Last Name" },
      { field: "phone", name: "Phone Number" },
      { field: "addressLine1", name: "Address Line 1" },
      { field: "city", name: "City" },
      { field: "state", name: "State" },
      { field: "pincode", name: "Pincode" },
    ];

    const emptyFields = requiredFields.filter(({ field }) => {
      return !form[field] || form[field].toString().trim() === "";
    });

    if (emptyFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in:\n\n${emptyFields
          .map(({ name }) => `• ${name}`)
          .join("\n")}`,
        [{ text: "OK" }]
      );
      return false;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(form.phone)) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number must be exactly 10 digits",
        [{ text: "OK" }]
      );
      return false;
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(form.pincode)) {
      Alert.alert(
        "Invalid Pincode",
        "Pincode must be exactly 6 digits",
        [{ text: "OK" }]
      );
      return false;
    }

    // Validate pincode has been verified
    if (!pincodeValid) {
      Alert.alert(
        "Invalid Pincode",
        "Please wait for pincode validation or enter a valid pincode",
        [{ text: "OK" }]
      );
      return false;
    }

    // Check if city and state are filled (should be if pincode is valid)
    if (!form.city.trim() || !form.state.trim()) {
      Alert.alert(
        "Address Error",
        "Please enter a valid pincode to auto-fill city and state",
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  };

  const saveAddress = async () => {
    if (!uid) return;
    
    if (!validateFormFields()) {
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
      Alert.alert(
        "Save Failed",
        error.message || "Failed to save address. Please try again.",
        [{ text: "OK" }]
      );
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
      shippingaddress: shipping,
      totalAmount: finalTotal,
      cartItems,
    });
  };

  const deleteAddress = async (id) => {
    if (!uid) return;
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
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
    ]);
  };
const handleProductPress = (item) => {
    // Prepare product object with all required fields
    const productDetails = {
      id: item.id || item.name,
      name: item.name,
      image: item.image,
      quantity:item.quantity,
      sale_price: item.sale_price,
      regular_price: item.regular_price || item.sale_price,
      category: item.category || "Hair Care",
      brand: item.brand || item.Brand || "Unknown Brand",
      benefits: item.benefits || item.Benefits || "Unknown Brand",
      description: item.detailed_description || "No description available",
      hair_type: item.hair_type || item.hairType || "",
      save: item.save || Math.round(((item.regular_price || item.sale_price) - item.sale_price) || 0)
    };
    
    navigation.navigate("ProductDetails", { product: productDetails });
  };
  const defaultAddress = addresses.find((a) => a.isDefault);
  const otherAddresses = addresses.filter((a) => !a.isDefault);

  // Update the pincode input with validation UI
  const renderFormInputs = () => {
    return (
      <>
        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name *</Text>
          <TextInput
            placeholder="First Name"
            style={[
              styles.input,
              !form.firstName.trim() && styles.invalidInput,
            ]}
            value={form.firstName}
            onChangeText={(v) => setForm({ ...form, firstName: v })}
            placeholderTextColor="#9CA3AF"
          />
          {!form.firstName.trim() && (
            <Text style={styles.errorText}>Required field</Text>
          )}
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name *</Text>
          <TextInput
            placeholder="Last Name"
            style={[
              styles.input,
              !form.lastName.trim() && styles.invalidInput,
            ]}
            value={form.lastName}
            onChangeText={(v) => setForm({ ...form, lastName: v })}
            placeholderTextColor="#9CA3AF"
          />
          {!form.lastName.trim() && (
            <Text style={styles.errorText}>Required field</Text>
          )}
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            placeholder="10-digit mobile number"
            style={[
              styles.input,
              form.phone.length > 0 &&
                form.phone.length !== 10 &&
                styles.invalidInput,
              form.phone.length === 10 && styles.validInput,
            ]}
            value={form.phone}
            onChangeText={(v) => {
              const numeric = v.replace(/[^0-9]/g, "").slice(0, 10);
              setForm({ ...form, phone: numeric });
            }}
            placeholderTextColor="#9CA3AF"
            maxLength={10}
            keyboardType="phone-pad"
          />
          {form.phone.length > 0 && form.phone.length !== 10 && (
            <Text style={styles.errorText}>Must be 10 digits</Text>
          )}
        </View>

        {/* Address Line 1 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address Line 1 *</Text>
          <TextInput
            placeholder="House no., Building, Street"
            style={[
              styles.input,
              !form.addressLine1.trim() && styles.invalidInput,
            ]}
            value={form.addressLine1}
            onChangeText={(v) => setForm({ ...form, addressLine1: v })}
            placeholderTextColor="#9CA3AF"
          />
          {!form.addressLine1.trim() && (
            <Text style={styles.errorText}>Required field</Text>
          )}
        </View>

        {/* Address Line 2 (Optional) */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address Line 2 (Optional)</Text>
          <TextInput
            placeholder="Apartment, Suite, etc."
            style={styles.input}
            value={form.addressLine2}
            onChangeText={(v) => setForm({ ...form, addressLine2: v })}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Pincode with Validation */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PIN Code *</Text>
          <View style={styles.pincodeContainer}>
            <TextInput
              placeholder="6-digit pincode"
              style={[
                styles.input,
                styles.pincodeInput,
                pincodeError && styles.invalidInput,
                pincodeValid && styles.validInput,
              ]}
              value={form.pincode}
              onChangeText={(v) => {
                const numeric = v.replace(/[^0-9]/g, "").slice(0, 6);
                setForm({ ...form, pincode: numeric });
              }}
              placeholderTextColor="#9CA3AF"
              maxLength={6}
              keyboardType="number-pad"
            />
            {pincodeLoading && (
              <ActivityIndicator
                size="small"
                color="#d6433c"
                style={styles.pincodeLoader}
              />
            )}
          </View>
          {pincodeError ? (
            <Text style={styles.errorText}>{pincodeError}</Text>
          ) : pincodeValid ? (
            <Text style={styles.successText}>✓ Valid pincode</Text>
          ) : form.pincode.length === 6 ? (
            <Text style={styles.infoText}>Validating pincode...</Text>
          ) : null}
        </View>

        {/* City (auto-filled) */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City *</Text>
          <TextInput
            placeholder="City"
            style={[
              styles.input,
              !form.city.trim() && styles.invalidInput,
              form.city.trim() && styles.validInput,
            ]}
            value={form.city}
            onChangeText={(v) => setForm({ ...form, city: v })}
            placeholderTextColor="#9CA3AF"
            editable={!pincodeValid}
          />
          {!form.city.trim() && (
            <Text style={styles.errorText}>Will auto-fill from pincode</Text>
          )}
        </View>

        {/* State (auto-filled) */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>State *</Text>
          <TextInput
            placeholder="State"
            style={[
              styles.input,
              !form.state.trim() && styles.invalidInput,
              form.state.trim() && styles.validInput,
            ]}
            value={form.state}
            onChangeText={(v) => setForm({ ...form, state: v })}
            placeholderTextColor="#9CA3AF"
            editable={!pincodeValid}
          />
          {!form.state.trim() && (
            <Text style={styles.errorText}>Will auto-fill from pincode</Text>
          )}
        </View>
      </>
    );
  };

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Delivery Address Section - Your existing code remains unchanged */}
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
                      {/* <Ionicons name="create-outline" size={14} color="#d6433c" /> */}
                      <Text color="#000000"  style>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.addressDetails}>
                  <Text style={styles.name}>
                    {defaultAddress.firstName} {defaultAddress.lastName}
                  </Text>
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={12} color="#6B7280" />
                    <Text style={styles.detailText}>{defaultAddress.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={12} color="#6B7280" />
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
                    <Ionicons name="business-outline" size={12} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {defaultAddress.city}, {defaultAddress.state} -{" "}
                      {defaultAddress.pincode}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.emptyCard} onPress={handleAddAddress}>
                <Ionicons name="add-circle-outline" size={24} color="#d6433c" />
                <Text style={styles.emptyText}>Add Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Order Items Section - Your existing code remains unchanged */}
     {cartItems.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Order Items ({cartItems.length})
    </Text>

    {cartItems.map((item, index) => {
      const itemTotal = item.cartQty * item.sale_price;

      return (
        <View key={index} style={styles.itemCard}>
          <TouchableOpacity onPress={() => handleProductPress(item)}>
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
          </TouchableOpacity>

          <View style={styles.itemDetails}>
            <TouchableOpacity onPress={() => handleProductPress(item)}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.qtyText}>
                Qty: {item.cartQty}
              </Text>
            </TouchableOpacity>

            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemPrice}>
              ₹{item.sale_price} 
            </Text>
          </View>

          <Text style={styles.itemTotal}>
            ₹{itemTotal}
          </Text>
        </View>
      );
    })}
  </View>
)}


          {/* Price Details Section - Your existing code remains unchanged */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                ₹{getCartTotal().toFixed(2)}
              </Text>
            </View>
            {/* <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>₹{shipping}</Text>
            </View> */}

            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{finalTotal}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar - Your existing code remains unchanged */}
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
             <Text style={styles.bottomLabel}>Total</Text>
            <Text style={styles.bottomPrice}>₹{finalTotal}</Text>
           
          </View>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!defaultAddress || cartItems.length === 0) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!defaultAddress || cartItems.length === 0}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
            <Ionicons name="arrow-forward" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Address Selection Modal - Your existing code remains unchanged */}
      <Modal visible={showChangeModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeBottomSheet}
          />
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
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

            <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
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
                        <Ionicons name="create-outline" size={12} color="#d6433c" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteAddress(address.id)}>
                        <Ionicons name="trash-outline" size={12} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.optionPhone}>{address.phone}</Text>
                  <Text style={styles.optionAddress}>{address.addressLine1}</Text>
                  {address.addressLine2 && (
                    <Text style={styles.optionAddress}>{address.addressLine2}</Text>
                  )}
                  <Text style={styles.optionLocation}>
                    {address.city}, {address.state} - {address.pincode}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedId && (
              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.deliverButton} onPress={deliverHere}>
                  <Ionicons name="checkmark-circle" size={12} color="#fff" />
                  <Text style={styles.deliverText}>DELIVER HERE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeSheet} onPress={closeBottomSheet}>
                  <Text style={styles.closeText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Add/Edit Address Modal - UPDATED with validation */}
 <Modal visible={showForm} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <TouchableOpacity style={styles.overlayTouchable} onPress={closeFormModal} />
    <Animated.View style={[styles.formSheet, { transform: [{ translateY: formAnim }] }]}>
      <View style={styles.formHeader}>
        <View style={styles.formTitleContainer}>
          {/* <Ionicons name="location-outline" size={20} color="#d6433c" /> */}
          <Text style={styles.formTitle}>
            {editId ? "Edit Address" : "Add New Address"}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={closeFormModal}
        >
          <Ionicons name="close-circle" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.formContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContentContainer}
      >
        {renderFormInputs()}
        
        <View style={styles.formNote}>
          <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
          {/* <Text style={styles.noteText}>
            All fields marked with * are mandatory. Pincode validation is required.
          </Text> */}
        </View>
      </ScrollView>

      <View style={styles.formFooter}>
        <TouchableOpacity 
          style={[styles.formButton, styles.cancelBtn]} 
          onPress={closeFormModal}
        >
          {/* <Ionicons name="close-outline" size={16} color="#374151" /> */}
          <Text style={styles.cancelBtnText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.formButton, 
            styles.saveBtn,
            (!pincodeValid ||
              !form.firstName.trim() ||
              !form.lastName.trim() ||
              !form.phone ||
              form.phone.length !== 10 ||
              !form.addressLine1.trim() ||
              !form.city.trim() ||
              !form.state.trim()) &&
              styles.disabledSaveBtn,
          ]}
          onPress={saveAddress}
          disabled={
            !pincodeValid ||
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.phone ||
            form.phone.length !== 10 ||
            !form.addressLine1.trim() ||
            !form.city.trim() ||
            !form.state.trim()
          }
        >
          {/* <Ionicons name="checkmark-outline" size={16} color="#fff" /> */}
          <Text style={styles.saveBtnText}>
            {editId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
          </Text>
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
    color: "#59585A",
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
 
    height:100,
    
  },
  priceContainer: {
    alignItems: "flex-start",
       bottom: 20,
    
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
    bottom: 20,
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