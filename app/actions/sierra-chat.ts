// --- app/actions/sierra-chat.ts ---
"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const SIERRA_VAULT_CONTEXT = `
You are the official AI Assistant for SierraVault, a decentralized platform for secure document storage and verification in Sierra Leone.

Your knowledge base:
1. PURPOSE: SierraVault allows users to store critical documents (Land Deeds, Academic Certificates, Legal Contracts) on a secure, immutable blockchain.
2. SECURITY: We use cryptographic hashing to ensure documents cannot be tampered with.
3. FEATURES: 
   - "Upload": Users can digitize and encrypt documents.
   - "Verify": Third parties can check the authenticity of a document using its unique hash.
   - "Share": Secure, time-limited sharing of documents.
4. TONE: Professional, helpful, secure, and concise.

If a user asks about something unrelated to documents, security, or Sierra Leone, politely steer them back to SierraVault's services.
`

export async function getSierraAIResponse(history: any[], userMessage: string) {
    const apiKey = process.env.GOOGLE_API_KEY

    if (!apiKey) {
        return { error: "Configuration Error: API Key is missing." }
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        // We prepend the System Context to the history purely for the AI's understanding
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SIERRA_VAULT_CONTEXT }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist SierraVault users." }]
                },
                ...history.map(msg => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }]
                }))
            ]
        })

        const result = await chat.sendMessage(userMessage)
        const response = await result.response
        return { success: response.text() }

    } catch (error) {
        console.error("AI Error:", error)
        return { error: "I'm having trouble connecting to the secure node. Please try again in a moment." }
    }
}