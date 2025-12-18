import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, onApply, products = [], activeFilters = {} }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    priceRange: null,
    discount: [],
    hairType: [],
  });

  // Initialize with active filters
  useEffect(() => {
    if (activeFilters && Object.keys(activeFilters).length > 0) {
      setSelectedFilters(activeFilters);
    }
  }, [activeFilters]);

  // Extract filter options from products
  const extractFilterOptions = () => {
    // Ensure products is an array
    const productsArray = Array.isArray(products) ? products : [];
    
    const brands = [];
    const hairTypes = [];
    
    // Try to extract brands and hair types from various possible field names
    productsArray.forEach(product => {
      if (!product) return;
      
      // Try different possible brand field names
      const brand = product.brand || product.Brand || product.product_brand || product.brand_name;
      if (brand && !brands.includes(brand)) {
        brands.push(brand);
      }
      
      // Try different possible hair type field names
      const hairType = product.hair_type || product.hairType || product.hair || 
                      product.hairtype || product.type || product.product_type;
      if (hairType && !hairTypes.includes(hairType)) {
        hairTypes.push(hairType);
      }
    });

    return { 
      brands: brands.sort(), 
      hairTypes: hairTypes.sort() 
    };
  };

  const { brands, hairTypes } = useMemo(() => extractFilterOptions(), [products]);

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: 'Over ₹5000', min: 5000, max: 100000 },
  ];

  const discountRanges = [
    { label: '10% & above', value: 10 },
    { label: '20% & above', value: 20 },
    { label: '30% & above', value: 30 },
    { label: '40% & above', value: 40 },
    { label: '50% & above', value: 50 },
  ];

  const toggleBrand = (brand) => {
    setSelectedFilters(prev => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter(b => b !== brand)
        : [...prev.brand, brand]
    }));
  };

  const toggleHairType = (type) => {
    setSelectedFilters(prev => ({
      ...prev,
      hairType: prev.hairType.includes(type)
        ? prev.hairType.filter(t => t !== type)
        : [...prev.hairType, type]
    }));
  };

  const selectPriceRange = (range) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange?.min === range.min ? null : range
    }));
  };

  const toggleDiscount = (discountValue) => {
    setSelectedFilters(prev => ({
      ...prev,
      discount: prev.discount.includes(discountValue)
        ? prev.discount.filter(d => d !== discountValue)
        : [...prev.discount, discountValue]
    }));
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilters({
      brand: [],
      priceRange: null,
      discount: [],
      hairType: [],
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += selectedFilters.brand?.length || 0;
    count += selectedFilters.hairType?.length || 0;
    count += selectedFilters.discount?.length || 0;
    if (selectedFilters.priceRange) count++;
    return count;
  };

  // Early return if products is not an array
  if (!Array.isArray(products)) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Filters</Text>
              {getActiveFilterCount() > 0 && (
                <Text style={styles.filterCount}>({getActiveFilterCount()})</Text>
              )}
            </View>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Brand Filter - Only show if we have brands */}
            {brands.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Brand</Text>
                <View style={styles.filterGrid}>
                  {brands.map(brand => (
                    <TouchableOpacity
                      key={brand}
                      style={[
                        styles.filterChip,
                        selectedFilters.brand?.includes(brand) && styles.filterChipSelected
                      ]}
                      onPress={() => toggleBrand(brand)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedFilters.brand?.includes(brand) && styles.filterChipTextSelected
                      ]}>
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Hair Type Filter - Only show if we have hair types */}
            {hairTypes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Type</Text>
                <View style={styles.filterGrid}>
                  {hairTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterChip,
                        selectedFilters.hairType?.includes(type) && styles.filterChipSelected
                      ]}
                      onPress={() => toggleHairType(type)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedFilters.hairType?.includes(type) && styles.filterChipTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Price Range Filter - Always show */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.filterGrid}>
                {priceRanges.map(range => (
                  <TouchableOpacity
                    key={range.label}
                    style={[
                      styles.priceChip,
                      selectedFilters.priceRange?.min === range.min && styles.priceChipSelected
                    ]}
                    onPress={() => selectPriceRange(range)}
                  >
                    <Text style={[
                      styles.priceChipText,
                      selectedFilters.priceRange?.min === range.min && styles.priceChipTextSelected
                    ]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Discount Filter - Always show */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discount</Text>
              <View style={styles.filterGrid}>
                {discountRanges.map(discount => (
                  <TouchableOpacity
                    key={discount.label}
                    style={[
                      styles.discountChip,
                      selectedFilters.discount?.includes(discount.value) && styles.discountChipSelected
                    ]}
                    onPress={() => toggleDiscount(discount.value)}
                  >
                    <Text style={[
                      styles.discountChipText,
                      selectedFilters.discount?.includes(discount.value) && styles.discountChipTextSelected
                    ]}>
                      {discount.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.applyButton,
                getActiveFilterCount() === 0 && styles.applyButtonDisabled
              ]}
              onPress={handleApply}
              disabled={getActiveFilterCount() === 0}
            >
              <Text style={styles.applyButtonText}>
                Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterCount: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  resetText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  filterChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  priceChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flex: 1,
    minWidth: '45%',
  },
  priceChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  priceChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  priceChipTextSelected: {
    color: '#fff',
  },
  discountChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  discountChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  discountChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  discountChipTextSelected: {
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;