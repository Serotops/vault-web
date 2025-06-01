'use client';

import { ImageUploader } from '@/components/ui/image-uploader';

export function ImageUploaderDemo() {
  const handleImagesChange = (images: any[]) => {
    console.log('Demo: Images changed:', images.length, 'files');
  };

  return (
    <div>
      <h4 className="font-medium mb-4">Try Our Upload Tool</h4>
      <p className="text-sm text-gray-600 mb-4">
        This is a demo of our image uploader. Try dragging and dropping files to see how it works!
      </p>
      <ImageUploader
        onImagesChange={handleImagesChange}
        maxImages={8}
        maxSizePerImage={5}
        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
      />
    </div>
  );
}
