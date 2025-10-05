// Governorates and their shipping costs
export const GOVERNORATES = [
  { name: 'القاهرة', value: 'cairo', shipping: 75 },
  { name: 'كفر الشيخ', value: 'kafr_el_sheikh', shipping: 75 },
  { name: 'مرسى مطروح', value: 'marsa_matrouh', shipping: 110 },
  { name: 'الإسماعيلية', value: 'ismailia', shipping: 80 },
  { name: 'السويس', value: 'suez', shipping: 85 },
  { name: 'بورسعيد', value: 'port_said', shipping: 80 },
  { name: 'الشرقية', value: 'sharqia', shipping: 75 },
  { name: 'الفيوم', value: 'fayoum', shipping: 85 },
  { name: 'بني سويف', value: 'beni_suef', shipping: 85 },
  { name: 'المنيا', value: 'minya', shipping: 100 },
  { name: 'أسيوط', value: 'assiut', shipping: 110 },
  { name: 'الجيزة', value: 'giza', shipping: 75 },
  { name: 'سوهاج', value: 'sohag', shipping: 115 },
  { name: 'قنا', value: 'qena', shipping: 125 },
  { name: 'أسوان', value: 'aswan', shipping: 125 },
  { name: 'الأقصر', value: 'luxor', shipping: 125 },
  { name: 'البحر الأحمر', value: 'red_sea', shipping: 115 },
  { name: 'الوادي الجديد', value: 'new_valley', shipping: 125 },
  { name: 'شمال سيناء', value: 'north_sinai', shipping: 100 },
  { name: 'جنوب سيناء', value: 'south_sinai', shipping: 110 },
  { name: 'الإسكندرية', value: 'alexandria', shipping: 80 },
  { name: 'البحيرة', value: 'beheira', shipping: 75 },
  { name: 'قليوبية', value: 'qalyubia', shipping: 75 },
  { name: 'المنوفية', value: 'monufia', shipping: 75 },
  { name: 'دمياط', value: 'dakahlia', shipping: 80 },
  { name: 'الدقهلية', value: 'dakahlia', shipping: 75 },
  { name: 'الغربية', value: 'gharbia', shipping: 30 }
];

// Function to get shipping cost by governorate
export const getShippingCost = (governorateValue) => {
  const governorate = GOVERNORATES.find(gov => gov.value === governorateValue);
  return governorate ? governorate.shipping : 80; // Default shipping cost
};

// Function to get governorate name by value
export const getGovernorateName = (governorateValue) => {
  const governorate = GOVERNORATES.find(gov => gov.value === governorateValue);
  return governorate ? governorate.name : 'غير محدد';
};
