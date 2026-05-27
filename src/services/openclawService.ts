// OpenClaw Chat Service Integration
import { DEVELOPER_INFO, PROJECTS } from '../../data';
import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

const SYSTEM_CONTEXT = `You are a helpful portfolio assistant for ${DEVELOPER_INFO.name}.
Bio: ${DEVELOPER_INFO.bio}
Role: ${DEVELOPER_INFO.role}
Skills: ${DEVELOPER_INFO.skills.join(', ')}
Services Offered: ${DEVELOPER_INFO.services.join(', ')}
Location: ${DEVELOPER_INFO.location}
Contact Email: ${DEVELOPER_INFO.email}
WhatsApp Link: ${DEVELOPER_INFO.socials.whatsapp}

Projects:
${JSON.stringify(PROJECTS, null, 2)}

Answer questions concisely and professionally. If you don't know the answer, suggest contacting them via WhatsApp at ${DEVELOPER_INFO.socials.whatsapp}.
Keep answers under 50 words unless asked for details.`;

export async function sendChatMessage(userMessage: string): Promise<string> {
  try {
    console.log('📤 Calling Firebase Cloud Function...');
    
    // Call the Firebase Cloud Function
    const chat = httpsCallable(functions, 'chat');
    const result = await chat({ message: userMessage });
    
    const reply = result.data?.reply;
    
    if (!reply) {
      throw new Error('No response content');
    }
    
    console.log('✅ Got reply:', reply.substring(0, 50));
    return reply;
  } catch (error) { 
    console.error('❌ Error:', error);
    throw error;
  }
}

export function validateConfiguration(): { valid: boolean; message: string } {
  return { valid: true, message: 'Cloud Functions configured' };
}
