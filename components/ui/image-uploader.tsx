'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Loader2,
  Move,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImagesChange?: (images: UploadedImage[]) => void
  maxImages?: number
  maxSizePerImage?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export function ImageUploader({
  onImagesChange,
  maxImages = 10,
  maxSizePerImage = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const updateImages = useCallback((newImages: UploadedImage[]) => {
    setImages(newImages)
    onImagesChange?.(newImages)
  }, [onImagesChange])

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use JPG, PNG, or WebP.`
    }

    if (file.size > maxSizePerImage * 1024 * 1024) {
      return `File size exceeds ${maxSizePerImage}MB limit.`
    }

    return null
  }
  const simulateUpload = async (image: UploadedImage): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setImages((prevImages: UploadedImage[]) =>
            prevImages.map((img: UploadedImage) =>
              img.id === image.id
                ? { ...img, status: 'success', progress: 100 }
                : img
            )
          )
          resolve()
        } else {
          setImages((prevImages: UploadedImage[]) =>
            prevImages.map((img: UploadedImage) =>
              img.id === image.id
                ? { ...img, progress }
                : img
            )
          )
        }
      }, 200)
    })
  }

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remainingSlots = maxImages - images.length

    if (fileArray.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum is ${maxImages} images.`)
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      alert(`Some files were rejected:\n${errors.join('\n')}`)
    }

    if (validFiles.length === 0) return

    const newImages: UploadedImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: 'uploading' as const,
      progress: 0
    }))

    updateImages([...images, ...newImages])

    // Simulate upload for each image
    newImages.forEach(image => {
      simulateUpload(image)
    })
  }
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
  }

  const removeImage = (imageId: string) => {
    const newImages = images.filter(img => img.id !== imageId)
    updateImages(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    updateImages(newImages)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
            </p>

            <input
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
              id="image-upload"
            />

            <Button asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>

            <div className="mt-4 text-sm text-gray-500">
              <p>Maximum {maxImages} images • {maxSizePerImage}MB per image</p>
              <p>Supported formats: JPG, PNG, WebP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Constraints Info */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{images.length} of {maxImages} images</span>
          <span>
            {images.filter(img => img.status === 'success').length} uploaded
          </span>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <CardContent className="p-0">
                {/* Image Preview */}
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Status Overlay */}
                  {image.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <div className="text-sm">{Math.round(image.progress)}%</div>
                        <Progress
                          value={image.progress}
                          className="w-16 h-1 mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {image.status === 'success' && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                  )}

                  {image.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                  )}

                  {/* Primary Image Badge */}
                  {index === 0 && (
                    <Badge className="absolute top-2 right-2 bg-blue-500">
                      Primary
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {/* TODO: Implement preview */ }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveImage(index, index - 1)}
                        >
                          <Move className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>

                  {image.status === 'error' && image.error && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {image.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Tips */}
      {images.length === 0 && (
        <Alert>
          <ImageIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Tips for better photos:</strong> Use good lighting, show multiple angles,
            include close-ups of any defects, and ensure images are clear and in focus.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
