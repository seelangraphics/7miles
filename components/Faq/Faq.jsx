import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');
import { useNavigation } from "@react-navigation/native";


const FAQItem = ({ item, isOpen, onToggle,}) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  return (
    <View style={[styles.faqItem, isOpen && styles.itemOpen]}>
      <TouchableOpacity
        style={styles.questionRow}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.questionContent}>
          <View style={styles.numberCircle}>
            <Text style={styles.number}>{item.id}</Text>
          </View>
          <Text style={styles.question}>{item.question}</Text>
        </View>
        <Text style={styles.icon}>{isOpen ? '−' : '+'}</Text>
      </TouchableOpacity>

      <Animated.View style={{ height: heightInterpolate, overflow: 'hidden' }}>
        <View 
          style={styles.answerWrapper}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.answerDivider} />
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const FAQSection = ({ data = defaultFAQData }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const navigation = useNavigation(); 
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>
          Get answers to common questions about our product
        </Text>
      </View>

      {/* FAQ List */}
      <ScrollView 
        style={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item, index) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </ScrollView>

      {/* Support Section */}
      <View style={styles.support}>
        <Text style={styles.supportText}>
          Need more help? Our team is here for you.
        </Text>
        <TouchableOpacity       onPress={() => navigation.navigate("Help")} style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Default FAQ Data
const defaultFAQData = [
  {
    id: 1,
    question: "What is Kumkumathi Oil and why should I use it?",
    answer: "Kumkumathi Oil is a luxurious Ayurvedic formulation made with saffron and other skin-nourishing herbs. It is known for brightening the skin, reducing pigmentation, and enhancing natural glow."
  },
  {
    id: 2,
    question: "How do I apply Kumkumathi Oil?",
    answer: "Cleanse your face thoroughly and apply a few drops at night. Massage gently until absorbed. Leave overnight for best results."
  },
  {
    id: 3,
    question: "Is this oil only for women?",
    answer: "No, Kumkumathi Oil is suitable for everyone. Men can also benefit from its skin-brightening and nourishing properties."
  },
  {
    id: 4,
    question: "Can I use Kumkumathi Oil daily?",
    answer: "Yes, absolutely. For best results, use it every night. It can also be applied before makeup for a natural finish."
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    padding: width > 768 ? 30 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: width > 768 ? 32 : 26,
    fontWeight: '700',
    color: '#5A3921',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: width > 768 ? 16 : 14,
    color: '#7D5C3E',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  list: {
    flex: 1,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 184, 150, 0.3)',
    overflow: 'hidden',
  },
  itemOpen: {
    borderColor: 'rgba(232, 184, 150, 0.6)',
    shadowColor: '#5A3921',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(232, 184, 150, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(232, 184, 150, 0.4)',
  },
  number: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5A3921',
  },
  question: {
    flex: 1,
    fontSize: width > 768 ? 17 : 15,
    fontWeight: '600',
    color: '#5A3921',
    lineHeight: 22,
  },
  icon: {
    fontSize: 22,
    fontWeight: '300',
    color: '#5A3921',
    width: 30,
    textAlign: 'center',
  },
  answerWrapper: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  answerDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#E8B896',
    marginBottom: 16,
    opacity: 0.6,
  },
  answer: {
    fontSize: width > 768 ? 15 : 14,
    color: '#7D5C3E',
    lineHeight: 22,
    opacity: 0.9,
  },
  support: {
    backgroundColor: 'rgba(232, 184, 150, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(232, 184, 150, 0.2)',
    borderStyle: 'dashed',
  },
  supportText: {
    fontSize: 15,
    color: '#7D5C3E',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: '#5A3921',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 160,
  },
  supportButtonText: {
    color: '#FFF9F0',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

// Main Component
const FAQScreen = () => {
  return <FAQSection />;
};

// Export both components
export default FAQScreen;
export { FAQSection, defaultFAQData };