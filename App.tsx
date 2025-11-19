import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ThumbnailDisplay } from './components/ThumbnailDisplay';
import { generateThumbnail } from './services/geminiService';
import type { ImageData } from './types';

const loadingMessages = [
    "Warming up the AI's creative circuits...",
    "Designing a scroll-stopping masterpiece...",
    "Optimizing for maximum clicks...",
    "Adding a touch of viral magic...",
    "Finalizing the pixels...",
];

const processImage = (file: File, aspectRatio: string): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = 1280;
                let height = 720;

                if (aspectRatio === '4:3') {
                    width = 1024;
                    height = 768;
                } else if (aspectRatio === '1:1') {
                    width = 1024;
                    height = 1024;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                // Calculate scaling to fit the image within the canvas (contain)
                const scale = Math.min(width / img.width, height / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                
                // Center the image
                const x = (width - w) / 2;
                const y = (height - h) / 2;

                // Draw image centered on the canvas
                ctx.drawImage(img, x, y, w, h);

                // Use PNG to preserve quality and transparency (if any)
                const mimeType = 'image/png';
                const base64Full = canvas.toDataURL(mimeType);
                const base64 = base64Full.split(',')[1];

                resolve({
                    base64,
                    mimeType,
                    previewUrl: base64Full,
                });
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
};

export default function App() {
    const [videoTitle, setVideoTitle] = useState<string>('');
    const [headshot, setHeadshot] = useState<ImageData | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState<string>(loadingMessages[0]);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            setCurrentLoadingMessage(loadingMessages[0]);
            interval = window.setInterval(() => {
                setCurrentLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 2500);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isLoading]);

    const handleImageChange = async (file: File) => {
        setOriginalFile(file);
        try {
            const processedImage = await processImage(file, aspectRatio);
            setHeadshot(processedImage);
        } catch (err) {
            console.error("Error processing image:", err);
            setError("Failed to process image. Please try another file.");
        }
    };

    const handleAspectRatioChange = async (ratio: string) => {
        setAspectRatio(ratio);
        setGeneratedThumbnail(null); // Reset generated thumbnail as dimensions change
        if (originalFile) {
            try {
                const processedImage = await processImage(originalFile, ratio);
                setHeadshot(processedImage);
            } catch (err) {
                console.error("Error re-processing image:", err);
                setError("Failed to update image dimensions.");
            }
        }
    };

    const handleGenerate = useCallback(async () => {
        if (!videoTitle || !headshot) {
            setError('Please provide both a video title and a headshot.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedThumbnail(null);

        try {
            const thumbnailBase64 = await generateThumbnail(videoTitle, headshot.base64, headshot.mimeType, aspectRatio);
            setGeneratedThumbnail(thumbnailBase64);
        } catch (err: any) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'Failed to generate thumbnail. Please check your API key and try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [videoTitle, headshot, aspectRatio]);

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-white">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <Header />
                <main className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="animate-fade-in">
                        <InputForm
                            videoTitle={videoTitle}
                            onTitleChange={setVideoTitle}
                            headshot={headshot}
                            onImageChange={handleImageChange}
                            aspectRatio={aspectRatio}
                            onAspectRatioChange={handleAspectRatioChange}
                            onSubmit={handleGenerate}
                            isLoading={isLoading}
                        />
                    </div>
                     <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <ThumbnailDisplay
                            isLoading={isLoading}
                            generatedThumbnail={generatedThumbnail}
                            error={error}
                            loadingMessage={currentLoadingMessage}
                            aspectRatio={aspectRatio}
                        />
                    </div>
                </main>
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Powered by Gemini API. Designed for content creators.</p>
                </footer>
            </div>
        </div>
    );
}