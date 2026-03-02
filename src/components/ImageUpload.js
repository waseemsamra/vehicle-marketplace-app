import React, { useState } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev';

export default function ImageUpload({ vehicleId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const response = await fetch(`${API_URL}/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          vehicleId: vehicleId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get upload URL');
      }
      
      if (data.uploadUrl) {
        const uploadResponse = await fetch(data.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload to S3');
        }
        
        toast.success('Image uploaded');
        onUploadComplete(data.publicUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Choose image</span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500 file:cursor-pointer disabled:opacity-50"
        />
      </label>
      {uploading && <p className="text-sm text-brand-500">Uploading...</p>}
      {preview && (
        <img src={preview} alt="Preview" className="max-w-xs rounded-lg border border-slate-700" />
      )}
    </div>
  );
}
