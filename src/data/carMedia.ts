import type { Car } from '../types'

const brandPhotos: Record<string, string[]> = {
  hyundai: [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx8WlD0yUstITMieTYfgKdmjUHr0Lwd1NnfBfNOxoVcw&s=10',
  ],
  toyota: [
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=85',
  ],
  volkswagen: [
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=85',
  ],
  bmw: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
  ],
  mercedes: [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
  ],
  audi: [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85',
  ],
  tesla: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85',
  ],
  ford: [
    'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
  ],
}

const categoryPhotos: Record<string, string[]> = {
  economy: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85',
  ],
  sedan: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
  ],
  suv: [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
  ],
  hatchback: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',
  ],
  electric: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
  ],
  comfort: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
  ],
  default: [
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=85',
  ],
}

export const fallbackCarImage =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=85'

export function getCarMedia(car: Car): { imageUrl: string; modelUrl: string | null } {
  const backendUrl = car.image_url ?? car.imageUrl ?? car.photo_url ?? car.photoUrl
  let imageUrl = typeof backendUrl === 'string' && backendUrl.trim() ? backendUrl : ''

  if (!imageUrl) {
    const brand = car.brand.trim().toLowerCase()
    const matchedBrandPhotos = Object.entries(brandPhotos).find(([key]) => brand.includes(key))?.[1]
    const category = car.category.trim().toLowerCase()
    const photos = matchedBrandPhotos ?? categoryPhotos[category] ?? categoryPhotos.default
    imageUrl = photos[car.id % photos.length]
  }

  const name = `${car.brand} ${car.model}`.trim().toLowerCase()
  const modelUrl = name.includes('hyundai') && name.includes('i10')
    ? `${import.meta.env.BASE_URL}hyundai_i10_aura.glb`
    : null

  return { imageUrl, modelUrl }
}

