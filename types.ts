
export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface Preset {
  id: string;
  name: string;
  aspectRatio: string;
  style: string;
  borderEnabled: boolean;
  borderColor: string;
  borderThickness: string;
  textEffect: string;
}
