import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

 const TopBar = ({
  title,
  onBackPress,
  onSearchPress,
  onCartPress,
  onWishlistPress,
  cartItemsCount,
  showBackButton = true,
}) => (
  <View style={styles.headerWrapper}>
    <View style={styles.headerContent}>

      {/* Back Button */}
      <View style={styles.leftBox}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <View style={styles.centerBox}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
      </View>

      {/* Right Icons */}
      <View style={styles.rightBox}>

        <TouchableOpacity onPress={onSearchPress} style={styles.iconBox}>
          <Ionicons name="search-outline" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onWishlistPress} style={styles.iconBox}>
          <Ionicons name="heart-outline" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onCartPress} style={styles.iconBox}>
          <Ionicons name="cart-outline" size={22} color="#000" />
          {cartItemsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>

    </View>
  </View>
);

export default TopBar

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,

    borderBottomColor: "#eaeaea",
    borderBottomWidth: 1,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  leftBox: {
    width: 50,
    height: 42,
    justifyContent: "center",
  },

  backBtn: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#f4f5f7",
  },

  centerBox: {
    flex: 1,
    paddingHorizontal: 6,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.3,
  },

  rightBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 38,
    height: 38,
    marginLeft: 14,
    borderRadius: 50,
    backgroundColor: "#f4f5f7",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#ff3c3c",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
