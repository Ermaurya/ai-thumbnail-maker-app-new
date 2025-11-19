
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

export const generateThumbnail = async (
    title: string, 
    imageBase64: string, 
    mimeType: string, 
    aspectRatio: string, 
    style: string,
    textEffect: string,
    borderEnabled: boolean,
    borderColor: string,
    borderThickness: string
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const stylePrompts: Record<string, string> = {
        'Vibrant': 'Use high saturation, bright neon colors, and energetic lighting. Ensure high contrast between the subject and background to make it pop. Typical high-click YouTube style.',
        'Minimalist': 'Use a clean, uncluttered design with plenty of whitespace. Focus on bold typography and a single clear subject. Use a limited color palette and soft lighting. Sophisticated and modern.',
        'Cinematic': 'Use dramatic lighting, high contrast, and a film-like color grade (e.g., teal and orange). Emphasize depth of field and atmospheric perspective. Make it look like a high-budget movie poster.',
        'Retro': 'Apply a vintage 80s or 90s aesthetic. Use film grain, synthwave colors (neon pink, cyan, purple), and retro typography. Create a nostalgic, lo-fi feel.',
    };

    const selectedStyleInstruction = stylePrompts[style] || stylePrompts['Vibrant'];

    const textEffectPrompts: Record<string, string> = {
        'None': 'Ensure the text is highly readable with good contrast against the background.',
        'Outline': 'Apply a thick, high-contrast outline (stroke) around the text characters to maximize readability against any background.',
        'Glow': 'Add a strong, vibrant outer glow or neon light effect to the text to make it stand out and look energetic.',
        'Distortion': 'Apply a glitch or distortion effect to the text, giving it an edgy, modern, or chaotic vibe.',
        '3D': 'Render the text with a 3D effect, adding depth, extrusion, and shadows to make it pop off the screen.',
        'Gradient': 'Apply a smooth color gradient to the text fill, using colors that complement the overall palette.'
    };

    const textEffectInstruction = textEffectPrompts[textEffect] || textEffectPrompts['None'];

    let borderInstruction = '';
    if (borderEnabled) {
        borderInstruction = `8. **Subject Border:** Create a visible ${borderThickness} border/outline around the main subject (the YouTuber) in this color: ${borderColor}. The border should be clean, defined, and help separate the subject from the background, a style commonly used in YouTube thumbnails.`;
    }

    const prompt = `
    Create a professional, scroll-stopping YouTube video thumbnail based on the provided video title and headshot.

    **Video Title:** "${title}"
    **Visual Style:** ${style}
    **Target Aspect Ratio:** ${aspectRatio}

    **Instructions:**
    1.  **Style Application:** ${selectedStyleInstruction}
    2.  **Composition:** The final image will be cropped to a ${aspectRatio} aspect ratio. IMPORTANT: Keep the main subject (the YouTuber) and the title text CENTERED and within the safe zone to ensure they are not cut off when cropped.
    3.  Use the provided headshot image as the central subject. Modify the facial expression to realistically match the tone of the video title.
    4.  Design a visually stunning background that complements the title and style.
    5.  Add glowing highlights and dramatic lighting to the subject.
    6.  Incorporate the video title text: "${title}". Use a bold, modern font. **${textEffectInstruction}**
    7.  Ensure high contrast and click-through optimization.
    ${borderInstruction}
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];

        if (!candidate) {
            throw new Error("No candidates returned from the API.");
        }

        // Prioritize checking for image content over finishReason
        for (const part of candidate.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }

        // If no image found, check finishReason for error reporting
        if (candidate.finishReason && candidate.finishReason !== 'STOP') {
            throw new Error(`Generation stopped due to: ${candidate.finishReason}`);
        }

        throw new Error("No image was generated by the API.");
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
