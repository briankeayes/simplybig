import { TM_API_URL, TM_API_KEY } from "./constants";

export async function sendWebhook(eventType, sessionId, step, data) {
    try {
      console.log(`🔄 Testing ${eventType}...`);
      const response = await fetch(TM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': TM_API_KEY,
        },
        body: JSON.stringify({
          eventType,
          sessionId,
          step,
          timestamp: new Date().toISOString(),
          data,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`❌ ${eventType} (${response.status}):`, errorData);
        return null;
      }
  
      const result = await response.json();
      console.log(`✅ ${eventType}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ ${eventType}:`, error.message);
      return null;
    }
  }
  