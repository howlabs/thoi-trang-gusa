import { useState } from "react"

const CLOUD_NAME = "dl0yhgl0h"
const UPLOAD_PRESET = "vi_products_preset"

interface UseImageUploadResult {
  uploading: boolean
  error: Error | null
  uploadImage: (file: File) => Promise<string | null>
}

export function useImageUpload(): UseImageUploadResult {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const compressToWebp = async (file: File, maxWidth = 1000): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let { width, height } = img

          if (width > maxWidth) {
            height = Math.round((maxWidth * height) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          // Nén WebP với chất lượng 0.8
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error("Canvas toBlob failed"))
            },
            "image/webp",
            0.8
          )
        }
        img.onerror = (e) => reject(e)
      }
      reader.onerror = (e) => reject(e)
    })
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setError(null)

      // 1. Nén ảnh thành WebP tại Client
      const webpBlob = await compressToWebp(file)

      // 2. Upload WebP lên Cloudinary
      const formData = new FormData()
      formData.append("file", webpBlob, "upload.webp")
      formData.append("upload_preset", UPLOAD_PRESET)
      formData.append("folder", "vi-products")

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload lên Cloudinary thất bại")
      
      const data = await res.json()
      return data.secure_url as string

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploading, error, uploadImage }
}
