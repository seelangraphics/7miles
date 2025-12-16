// data.js
export const products = [
  {
    id: 1,
    title: "KUMXUMATHI NIGHT ROUTINE",
    size: "50 ml",
    originalPrice: "₹310.00",
    discountedPrice: "₹270.00",
    image: require('../../assets/BundleComponent/kumkumathi_21.webp'), // Replace with your actual image path
  },
  {
    id: 2,
    title: "ALOE VERA GEL",
    size: "100gm",
    originalPrice: "₹220.00",
    discountedPrice: "₹180.00",
    image: require('../../assets/BundleComponent/alovera_gel.webp'), // Replace with your actual image path
  },
  {
    id: 3,
    title: "ROSE WATER",
    size: "100 ml",
    originalPrice: "₹175.00",
    discountedPrice: "₹180.00", // Note: This shows discounted price is higher - might be intentional
    image: require('../../assets/BundleComponent/rose_water.avif'), // Replace with your actual image path
  },
];

export const bundleInfo = {
  title: "Bundle & Save",
  description: "Build Your Own Basket",
  totalSavings: "₹105.00",
  buttonText: "Add All To Cart",
   bannerImage: require('../../assets/BundleComponent/15.webp'), 
};