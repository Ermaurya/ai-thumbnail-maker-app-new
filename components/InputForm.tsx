
import React, { useState } from 'react';
import type { ImageData, Preset } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface InputFormProps {
    videoTitle: string;
    onTitleChange: (title: string) => void;
    headshot: ImageData | null;
    onImageChange: (file: File) => void;
    aspectRatio: string;
    onAspectRatioChange: (ratio: string) => void;
    style: string;
    onStyleChange: (style: string) => void;
    textEffect: string;
    onTextEffectChange: (effect: string) => void;
    
    // Border Props
    borderEnabled: boolean;
    onBorderEnabledChange: (enabled: boolean) => void;
    borderColor: string;
    onBorderColorChange: (color: string) => void;
    borderThickness: string;
    onBorderThicknessChange: (thickness: string) => void;

    // Preset Props
    presets: Preset[];
    onSavePreset: (name: string) => void;
    onLoadPreset: (preset: Preset) => void;
    onDeletePreset: (id: string) => void;

    onSubmit: () => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
    videoTitle,
    onTitleChange,
    headshot,
    onImageChange,
    aspectRatio,
    onAspectRatioChange,
    style,
    onStyleChange,
    textEffect,
    onTextEffectChange,
    borderEnabled,
    onBorderEnabledChange,
    borderColor,
    onBorderColorChange,
    borderThickness,
    onBorderThicknessChange,
    presets,
    onSavePreset,
    onLoadPreset,
    onDeletePreset,
    onSubmit,
    isLoading,
}) => {
    const [isSavingPreset, setIsSavingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
    };

    const handleSaveClick = () => {
        if (newPresetName.trim()) {
            onSavePreset(newPresetName.trim());
            setNewPresetName('');
            setIsSavingPreset(false);
        }
    };

    const isFormValid = videoTitle.trim() !== '' && headshot !== null;
    const styles = ['Vibrant', 'Minimalist', 'Cinematic', 'Retro'];
    const textEffects = ['None', 'Outline', 'Glow', 'Distortion', '3D', 'Gradient'];
    
    const borderColors = [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#22C55E' },
        { name: 'Yellow', value: '#EAB308' },
        { name: 'Purple', value: '#A855F7' },
    ];

    const thicknesses = ['Thin', 'Medium', 'Thick', 'Heavy'];

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 space-y-6">
            
             {/* Presets Section */}
             <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Saved Presets</label>
                    {!isSavingPreset ? (
                        <button 
                            onClick={() => setIsSavingPreset(true)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors flex items-center"
                            disabled={isLoading}
                        >
                            <span className="mr-1">+</span> Save Current
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2 animate-fade-in">
                            <input
                                type="text"
                                value={newPresetName}
                                onChange={(e) => setNewPresetName(e.target.value)}
                                placeholder="Preset Name"
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                            <button 
                                onClick={handleSaveClick}
                                disabled={!newPresetName.trim()}
                                className="text-xs text-green-400 font-bold hover:text-green-300"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => setIsSavingPreset(false)}
                                className="text-xs text-gray-400 hover:text-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {presets.length === 0 ? (
                        <p className="text-gray-500 text-xs italic">No presets saved yet. Configure settings and click save.</p>
                    ) : (
                        presets.map(preset => (
                            <div 
                                key={preset.id} 
                                className="group relative bg-gray-800 border border-gray-600 hover:border-blue-500 rounded-full px-3 py-1 text-xs text-gray-300 transition-all cursor-pointer flex items-center"
                            >
                                <span onClick={() => onLoadPreset(preset)} className="mr-2 hover:text-white">
                                    {preset.name}
                                </span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePreset(preset.id);
                                    }}
                                    className="text-gray-500 hover:text-red-400 focus:outline-none"
                                    title="Delete preset"
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="video-title" className="block text-sm font-medium text-gray-300 mb-2">
                    1. Video Title
                </label>
                <input
                    type="text"
                    id="video-title"
                    value={videoTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="e.g., My Insane Trip to Japan"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    2. Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {['16:9', '4:3', '1:1'].map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => onAspectRatioChange(ratio)}
                            disabled={isLoading}
                            className={`py-2 px-4 rounded-lg font-semibold transition-colors border ${
                                aspectRatio === ratio
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    3. Visual Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {styles.map((s) => (
                        <button
                            key={s}
                            onClick={() => onStyleChange(s)}
                            disabled={isLoading}
                            className={`py-2 px-4 rounded-lg font-semibold transition-colors border ${
                                style === s
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    4. Text Effects
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {textEffects.map((effect) => (
                        <button
                            key={effect}
                            onClick={() => onTextEffectChange(effect)}
                            disabled={isLoading}
                            className={`py-2 px-2 text-sm rounded-lg font-semibold transition-colors border ${
                                textEffect === effect
                                    ? 'bg-pink-600 border-pink-500 text-white shadow-md'
                                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {effect}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                     <label className="block text-sm font-medium text-gray-300">
                        5. Headshot Border
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={borderEnabled}
                            onChange={(e) => onBorderEnabledChange(e.target.checked)}
                            disabled={isLoading}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {borderEnabled && (
                    <div className="space-y-4 mt-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600 animate-fade-in">
                         <div>
                            <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2 block">Color</label>
                            <div className="flex flex-wrap gap-3">
                                {borderColors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => onBorderColorChange(color.value)}
                                        disabled={isLoading}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none ${
                                            borderColor === color.value ? 'border-white ring-2 ring-blue-400 scale-110' : 'border-transparent ring-1 ring-gray-500'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-500 hover:scale-110 transition-transform cursor-pointer">
                                     <input
                                        type="color"
                                        value={borderColor}
                                        onChange={(e) => onBorderColorChange(e.target.value)}
                                        className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 opacity-0 cursor-pointer"
                                        disabled={isLoading}
                                     />
                                     <div className="w-full h-full" style={{ background: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #00FF00 120deg, #0000FF 240deg, #FF0000 360deg)' }}></div>
                                </div>
                            </div>
                        </div>

                        <div>
                             <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2 block">Thickness</label>
                             <div className="grid grid-cols-4 gap-2">
                                {thicknesses.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => onBorderThicknessChange(t)}
                                        disabled={isLoading}
                                        className={`py-1 px-2 text-xs rounded-md font-medium border transition-colors ${
                                            borderThickness === t
                                            ? 'bg-gray-600 border-gray-400 text-white'
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    6. Your Headshot
                </label>
                <div className="flex items-center space-x-4">
                    <label htmlFor="headshot-upload" className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <UploadIcon />
                        <span className="ml-2">Choose Image</span>
                    </label>
                    <input
                        id="headshot-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    {headshot && (
                         <div className="flex items-center space-x-3">
                            <img src={headshot.previewUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-blue-400" />
                            <span className="text-sm text-gray-400">Image selected.</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={onSubmit}
                disabled={!isFormValid || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isLoading ? 'Generating...' : '✨ Generate Thumbnail'}
            </button>
        </div>
    );
};
