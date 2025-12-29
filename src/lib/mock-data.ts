import type { AnalysisResult, IngredientInsight } from '@/types';

// Mock data for demo/fallback when APIs are unavailable
export const mockProducts: Record<string, AnalysisResult> = {
  chips: {
    productName: 'Classic Potato Chips',
    ingredients: ['Potatoes', 'Palm Oil', 'Salt', 'MSG', 'Sugar'],
    insights: [
      {
        name: 'Palm Oil',
        explanation: 'A vegetable oil derived from palm fruit, commonly used for frying.',
        healthImpact: 'concern',
        impacts: [
          'May raise LDL cholesterol levels',
          'Contains saturated fats',
          'Provides vitamin E and beta-carotene',
        ],
        tradeoffs: 'While it provides some vitamins, the saturated fat content may outweigh benefits for heart health. Moderate consumption suggested.',
        alternatives: ['Sunflower oil', 'Olive oil', 'Avocado oil'],
        confidence: 'high',
      },
      {
        name: 'MSG (Monosodium Glutamate)',
        explanation: 'A flavor enhancer that adds umami taste to foods.',
        healthImpact: 'neutral',
        impacts: [
          'Generally recognized as safe by FDA',
          'Some people report sensitivity',
          'Contains sodium',
        ],
        tradeoffs: 'Despite myths, MSG is considered safe for most people. However, if you experience headaches or flushing after eating MSG-containing foods, you may want to avoid it.',
        alternatives: ['Natural umami from tomatoes', 'Mushroom extracts', 'Yeast extracts'],
        confidence: 'high',
      },
      {
        name: 'Salt',
        explanation: 'Added for flavor and preservation.',
        healthImpact: 'concern',
        impacts: [
          'Excessive intake linked to high blood pressure',
          'Essential mineral in moderation',
          'May affect kidney function over time',
        ],
        tradeoffs: 'Your body needs some sodium, but processed foods often contain excess amounts. This product likely contributes significantly to daily sodium intake.',
        confidence: 'high',
      },
    ],
    summary: 'This snack contains several ingredients that warrant moderation, particularly for those watching sodium intake or heart health. The palm oil and added salt are the main concerns. Enjoy occasionally rather than daily.',
    healthProfile: {
      concerns: ['heart health', 'sodium intake'],
      inferred: true,
    },
  },
  soda: {
    productName: 'Cola Beverage',
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Caffeine'],
    insights: [
      {
        name: 'High Fructose Corn Syrup',
        explanation: 'A sweetener made from corn starch, commonly used in beverages.',
        healthImpact: 'warning',
        impacts: [
          'Linked to obesity when consumed in excess',
          'May contribute to insulin resistance',
          'No nutritional value beyond calories',
          'Associated with increased diabetes risk',
        ],
        tradeoffs: 'Provides sweetness at low cost but offers no nutritional benefits. For diabetics, this is a significant concern as it causes rapid blood sugar spikes.',
        alternatives: ['Stevia-sweetened drinks', 'Sparkling water with fruit', 'Unsweetened tea'],
        confidence: 'high',
      },
      {
        name: 'Phosphoric Acid',
        explanation: 'Adds tartness and acts as a preservative.',
        healthImpact: 'concern',
        impacts: [
          'May affect calcium absorption',
          'Linked to lower bone density in some studies',
          'Can erode tooth enamel',
        ],
        tradeoffs: 'While the amount in a single serving is small, regular consumption may affect bone health over time.',
        confidence: 'medium',
      },
      {
        name: 'Caffeine',
        explanation: 'A natural stimulant added for energy boost.',
        healthImpact: 'neutral',
        impacts: [
          'Can improve alertness and focus',
          'May cause sleep issues if consumed late',
          'Can be habit-forming',
        ],
        tradeoffs: 'Moderate caffeine intake is generally safe for healthy adults, but those sensitive to caffeine or with anxiety should limit intake.',
        confidence: 'high',
      },
    ],
    summary: 'This beverage is high in sugar and offers minimal nutritional value. For diabetics or those watching blood sugar, this is NOT recommended. The high fructose corn syrup will cause rapid glucose spikes.',
    healthProfile: {
      concerns: ['diabetes', 'weight management', 'dental health'],
      inferred: true,
    },
  },
  protein_bar: {
    productName: 'Protein Energy Bar',
    ingredients: ['Whey Protein', 'Almonds', 'Honey', 'Oats', 'Dark Chocolate', 'Sea Salt'],
    insights: [
      {
        name: 'Whey Protein',
        explanation: 'A complete protein derived from milk during cheese production.',
        healthImpact: 'positive',
        impacts: [
          'Excellent source of essential amino acids',
          'Supports muscle recovery and growth',
          'May help with satiety and weight management',
        ],
        tradeoffs: 'Great for most people, but those with dairy allergies or lactose intolerance should avoid. Plant-based alternatives exist.',
        alternatives: ['Pea protein', 'Hemp protein', 'Brown rice protein'],
        confidence: 'high',
      },
      {
        name: 'Almonds',
        explanation: 'Tree nuts rich in healthy fats and nutrients.',
        healthImpact: 'positive',
        impacts: [
          'Heart-healthy monounsaturated fats',
          'Good source of vitamin E and magnesium',
          'May help lower cholesterol',
        ],
        tradeoffs: 'Calorie-dense, so portion control matters. Avoid if you have tree nut allergies.',
        confidence: 'high',
      },
      {
        name: 'Honey',
        explanation: 'Natural sweetener with some beneficial compounds.',
        healthImpact: 'neutral',
        impacts: [
          'Contains antioxidants',
          'Still affects blood sugar',
          'Slightly better than refined sugar',
        ],
        tradeoffs: 'While more natural than refined sugar, honey still impacts blood sugar. Diabetics should account for this in their carb count.',
        confidence: 'high',
      },
    ],
    summary: 'This is a relatively healthy snack option with quality protein and nutrients. The honey adds natural sweetness but diabetics should monitor portions. Good choice for post-workout or healthy snacking.',
    healthProfile: {
      concerns: ['fitness', 'protein intake', 'healthy snacking'],
      inferred: true,
    },
  },
};

export function getMockAnalysis(query: string): AnalysisResult {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('chip') || lowerQuery.includes('crisp') || lowerQuery.includes('snack')) {
    return mockProducts.chips;
  }
  if (lowerQuery.includes('soda') || lowerQuery.includes('cola') || lowerQuery.includes('drink') || lowerQuery.includes('beverage')) {
    return mockProducts.soda;
  }
  if (lowerQuery.includes('protein') || lowerQuery.includes('bar') || lowerQuery.includes('energy')) {
    return mockProducts.protein_bar;
  }
  
  // Default fallback
  return mockProducts.chips;
}

export function inferHealthConcerns(query: string): string[] {
  const concerns: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  const concernPatterns: Record<string, string[]> = {
    diabetes: ['diabetic', 'diabetes', 'blood sugar', 'glucose', 'insulin'],
    allergies: ['allergy', 'allergic', 'allergen', 'intolerant', 'intolerance'],
    vegan: ['vegan', 'plant-based', 'animal-free', 'no meat'],
    vegetarian: ['vegetarian', 'no meat'],
    gluten: ['gluten', 'celiac', 'wheat-free'],
    heart: ['heart', 'cholesterol', 'blood pressure', 'cardiac'],
    weight: ['weight', 'diet', 'calories', 'low-cal', 'losing weight'],
    sodium: ['sodium', 'salt', 'low-sodium'],
  };
  
  for (const [concern, patterns] of Object.entries(concernPatterns)) {
    if (patterns.some(p => lowerQuery.includes(p))) {
      concerns.push(concern);
    }
  }
  
  return concerns;
}
