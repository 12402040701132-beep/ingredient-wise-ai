import Tesseract from 'tesseract.js';
import type { OCRResult } from '@/types';

export async function performOCR(imageFile: File | string): Promise<OCRResult> {
  try {
    const imageSource = typeof imageFile === 'string' 
      ? imageFile 
      : URL.createObjectURL(imageFile);

    const result = await Tesseract.recognize(imageSource, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    // Clean up object URL if we created one
    if (typeof imageFile !== 'string') {
      URL.revokeObjectURL(imageSource);
    }

    const text = result.data.text.trim();
    const confidence = result.data.confidence;

    if (!text || confidence < 30) {
      return {
        text: '',
        confidence: 0,
        success: false,
        error: 'Could not read text clearly. Try better lighting or a clearer image.',
      };
    }

    return {
      text,
      confidence,
      success: true,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      text: '',
      confidence: 0,
      success: false,
      error: 'Failed to process image. Please try again.',
    };
  }
}

export function extractIngredients(ocrText: string): string[] {
  // Common patterns for ingredient lists
  const ingredientPatterns = [
    /ingredients?[:\s]+([^.]+)/i,
    /contains?[:\s]+([^.]+)/i,
  ];

  let ingredientText = ocrText;

  for (const pattern of ingredientPatterns) {
    const match = ocrText.match(pattern);
    if (match) {
      ingredientText = match[1];
      break;
    }
  }

  // Split by common delimiters and clean up
  const ingredients = ingredientText
    .split(/[,;]/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 1 && ing.length < 100)
    .map((ing) => {
      // Remove parenthetical content for cleaner display
      return ing.replace(/\([^)]*\)/g, '').trim();
    })
    .filter((ing) => ing.length > 0);

  return [...new Set(ingredients)]; // Remove duplicates
}
