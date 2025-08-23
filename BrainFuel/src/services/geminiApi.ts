const GEMINI_API_KEY = 'AIzaSyCQTRzlSSATXkDLrmDw0Vh028BNF9DYheA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Validate API key format
if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 30) {
  console.error('Invalid Gemini API Key format');
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

class GeminiApiService {
  private apiKey: string;
  private apiUrl: string;
  private fallbackUrl: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.apiUrl = GEMINI_API_URL;
    this.fallbackUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';
  }

  async sendMessage(message: string, chatHistory: GeminiMessage[] = []): Promise<string> {
    try {
      console.log('Sending message to Gemini API:', message);
      console.log('Chat history length:', chatHistory.length);

      // Create a request with system prompt and user message
      const requestBody: GeminiRequest = {
        contents: [
          {
            role: 'user' as const,
            parts: [{ 
                             text: `أنت مساعد ذكي لموقع BrainFuel، منصة مشاريع الطلاب الجامعيين. 
               
               مهمتك:
               - مساعدة الطلاب في مشاريعهم التقنية والأكاديمية
               - تقديم نصائح حول التطوير والبرمجة
               - الإجابة على أسئلة حول المشاريع والابتكار
               - دعم الطلاب في حل المشاكل التقنية
               
               أجب بنفس لغة المستخدم (العربية أو الإنجليزية) بطريقة ودية ومفيدة ومختصرة. اجعل ردودك قصيرة ومباشرة.
               
               رسالة المستخدم: ${message}` 
            }]
          }
        ],
                 generationConfig: {
           temperature: 0.7,
           topK: 40,
           topP: 0.95,
           maxOutputTokens: 200,
         }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      let response;
      let errorText = '';
      
      try {
        // Try primary URL first
        response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Primary URL Response status:', response.status);
        
        if (!response.ok) {
          errorText = await response.text();
          console.error('Primary URL error:', errorText);
          
          // Try fallback URL
          console.log('Trying fallback URL...');
          response = await fetch(`${this.fallbackUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
          
          console.log('Fallback URL Response status:', response.status);
          
          if (!response.ok) {
            errorText = await response.text();
            console.error('Fallback URL error:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text;
        console.log('AI Response:', responseText);
        return responseText;
      } else {
        console.error('No valid candidates in response:', data);
        throw new Error('No valid response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        return `عذراً، حدث خطأ في الاتصال: ${error.message}`;
      }
      return 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
    }
  }

     // Helper method to create a context-aware prompt for BrainFuel
   createBrainFuelPrompt(userMessage: string): string {
     return `أنت مساعد ذكي لموقع BrainFuel، منصة مشاريع الطلاب الجامعيين. 
     
     مهمتك:
     - مساعدة الطلاب في مشاريعهم التقنية والأكاديمية
     - تقديم نصائح حول التطوير والبرمجة
     - الإجابة على أسئلة حول المشاريع والابتكار
     - دعم الطلاب في حل المشاكل التقنية
     
     أجب بنفس لغة المستخدم (العربية أو الإنجليزية) بطريقة ودية ومفيدة ومختصرة. اجعل ردودك قصيرة ومباشرة.
     
     رسالة المستخدم: ${userMessage}`;
   }
}

export const geminiApiService = new GeminiApiService();
