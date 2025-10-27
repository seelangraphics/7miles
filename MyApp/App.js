// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import TopNavigation from './Componets/Nav/TopNavigation';
import SearchBar from './Componets/Nav/SearchBar';
import BottomNavigation from './Componets/BottomNavigation/BottomNavigation';

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchPress = () => {
    setShowSearch(true);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleSearch = (text) => {
    console.log('Searching for:', text);
    setSearchQuery(text);
  };

  const handleCartPress = () => {
    setActiveTab('cart');
  };

  const handleCategoryPress = (category, type) => {
    console.log(`${type} category pressed:`, category);
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (showSearch) {
      return (
        <View style={styles.content}>
          <Text style={styles.contentText}>Search Results for: {searchQuery}</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Welcome to 7 Miles</Text>
              <Text>Your beauty and wellness destination</Text>
            </View>
          </ScrollView>
        );
      case 'categories':
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Categories Screen</Text>
          </View>
        );
      case 'myorders':
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>My Orders Screen</Text>
          </View>
        );
      case 'help':
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Help Screen</Text>
          </View>
        );
      case 'account':
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Account Screen</Text>
          </View>
        );
      case 'cart':
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Cart Screen</Text>
          </View>
        );
      default:
        return (
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Welcome to 7 Miles</Text>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Top Navigation */}
      {!showSearch ? (
        <TopNavigation
          onSearchPress={handleSearchPress}
          onCategoryPress={handleCategoryPress}
          onCartPress={handleCartPress}
        />
      ) : (
        <SearchBar
          onSearch={handleSearch}
          onClose={handleSearchClose}
          placeholder="Search products..."
        />
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  section: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});