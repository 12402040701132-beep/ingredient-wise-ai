export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  insights?: IngredientInsight[];
  isLoading?: boolean;
  healthScore?: number;
  concerns?: string[];
  recommendations?: string[];
  allergenAlerts?: string[];
  drugInteractions?: string[];
}

export interface IngredientInsight {
  name: string;
  explanation: string;
  healthImpact: 'positive' | 'neutral' | 'concern' | 'warning';
  impacts: string[];
  tradeoffs?: string;
  alternatives?: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface HealthProfile {
  concerns: string[];
  inferred: boolean;
}

export interface AnalysisResult {
  productName?: string;
  ingredients?: string[];
  insights: IngredientInsight[];
  summary: string;
  healthProfile?: HealthProfile;
  healthScore?: number;
  concerns?: string[];
  recommendations?: string[];
  allergenAlerts?: string[];
  drugInteractions?: string[];
  error?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  success: boolean;
  error?: string;
}
