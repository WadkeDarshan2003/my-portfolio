// OpenClaw Chat Service Integration
import { DEVELOPER_INFO } from '../../data';
import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

type ChatRequest = {
  message: string;
};

type ChatResponse = {
  reply?: string;
};

const SYSTEM_CONTEXT = `You are a helpful portfolio assistant for ${DEVELOPER_INFO.name}.
Bio: ${DEVELOPER_INFO.bio}
Role: ${DEVELOPER_INFO.role}
Skills: ${DEVELOPER_INFO.skills.join(', ')}
Services Offered: ${DEVELOPER_INFO.services.join(', ')}
Location: ${DEVELOPER_INFO.location}
Contact Email: ${DEVELOPER_INFO.email}
WhatsApp Link: ${DEVELOPER_INFO.socials.whatsapp}

Answer questions concisely and professionally. If you don't know the answer, suggest contacting them via WhatsApp at ${DEVELOPER_INFO.socials.whatsapp}.
Keep answers under 50 words unless asked for details.`;

export async function sendChatMessage(userMessage: string): Promise<string> {
  const callLocalProxy = async () => {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error?.message || data?.error || `Local chat proxy failed with ${response.status}`);
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('No response content from local chat proxy');
    }

    return reply;
  };

  try {
    console.log('📤 Calling Firebase Cloud Function...');
    
    // Call the Firebase Cloud Function
    const chat = httpsCallable<ChatRequest, ChatResponse>(functions, 'chat');
    const result = await chat({ message: userMessage });
    
    const reply = result.data?.reply;
    
    if (typeof reply !== 'string' || !reply.trim()) {
      throw new Error('No response content');
    }
    
    console.log('✅ Got reply:', reply.substring(0, 50));
    return reply;
  } catch (error) { 
    console.error('❌ Firebase chat error:', error);

    if (import.meta.env.DEV) {
      console.log('↩️ Falling back to local chat proxy...');
      return callLocalProxy();
    }

    throw error;
  }
}

export function validateConfiguration(): { valid: boolean; message: string } {
  return { valid: true, message: 'Cloud Functions configured' };
}
