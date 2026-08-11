import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function ImageUpload({ vehicleId, onUploadComplete, maxFiles = 5, existingImages = [] }) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const uploadedCountRef = useRef(0);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = maxFiles - existingImages.length - uploadedCountRef.current;
    const toUpload = files.slice(0, Math.max(0, remaining));
    if (toUpload.length < files.length) {
      toast.error(`Only ${maxFiles} images allowed`);
    }
    if (!toUpload.length) return;

    const newPreviews = toUpload.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setUploading(true);
    uploadedCountRef.current += toUpload.length;

    try {
      const uploadPromises = toUpload.map(async (file) => {
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
      });

      await Promise.allSettled(uploadPromises);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Upload failed');
      uploadedCountRef.current = Math.max(0, uploadedCountRef.current - toUpload.length);
      setPreviews(prev => prev.slice(0, -toUpload.length));
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Choose images</span>
        <input 
          type="file" 
          accept="image/*" 
          multiple
          onChange={handleFileSelect}
          disabled={uploading || previews.length >= maxFiles}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500 file:cursor-pointer disabled:opacity-50"
        />
      </label>
      {uploading && <p className="text-sm text-brand-500">Uploading...</p>}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative">
              <img src={src} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-slate-700" />
              <button 
                type="button" 
                onClick={() => removePreview(idx)} 
                disabled={uploading}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs disabled:opacity-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500">{previews.length}/{maxFiles} images selected</p>
    </div>
  );
}
