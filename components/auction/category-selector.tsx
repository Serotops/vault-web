'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search,
  Grid,
  Gamepad2,
  Music,
  Film,
  Book,
  Palette,
  Star,
  Trophy,
  Heart,
  Zap,
  Users,
  Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategorySelectorProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  showSubcategories?: boolean
  className?: string
}

const categoryData = [
  {
    id: 'comics',
    name: 'Comics',
    icon: Book,
    description: 'Comic books, graphic novels, and manga',
    subcategories: [
      'Marvel Comics',
      'DC Comics',
      'Independent Comics',
      'Manga',
      'Graphic Novels',
      'Vintage Comics',
      'Comic Art',
      'Comic Memorabilia'
    ]
  },
  {
    id: 'action-figures',
    name: 'Action Figures',
    icon: Users,
    description: 'Action figures, dolls, and collectible toys',
    subcategories: [
      'Marvel Action Figures',
      'DC Action Figures',
      'Star Wars',
      'Anime Figures',
      'Movie Figures',
      'TV Show Figures',
      'Vintage Toys',
      'Custom Figures'
    ]
  },
  {
    id: 'trading-cards',
    name: 'Trading Cards',
    icon: Grid,
    description: 'Sports cards, gaming cards, and collectible cards',
    subcategories: [
      'Pokemon Cards',
      'Magic: The Gathering',
      'Sports Cards',
      'Yu-Gi-Oh!',
      'Marvel Cards',
      'DC Cards',
      'Non-Sport Cards',
      'Vintage Cards'
    ]
  },
  {
    id: 'video-games',
    name: 'Video Games',
    icon: Gamepad2,
    description: 'Video games, consoles, and gaming accessories',
    subcategories: [
      'Retro Games',
      'Modern Games',
      'Gaming Consoles',
      'Gaming Accessories',
      'Handheld Games',
      'PC Games',
      'Gaming Collectibles',
      'Limited Editions'
    ]
  },
  {
    id: 'movies-tv',
    name: 'Movies & TV',
    icon: Film,
    description: 'Movie memorabilia, posters, and TV collectibles',
    subcategories: [
      'Movie Props',
      'Movie Posters',
      'Autographs',
      'TV Memorabilia',
      'DVDs & Blu-rays',
      'Vintage Media',
      'Behind the Scenes',
      'Limited Editions'
    ]
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    description: 'Vinyl records, CDs, and music memorabilia',
    subcategories: [
      'Vinyl Records',
      'CDs',
      'Music Memorabilia',
      'Concert Posters',
      'Autographs',
      'Vintage Records',
      'Limited Editions',
      'Music Instruments'
    ]
  },
  {
    id: 'art',
    name: 'Art & Prints',
    icon: Palette,
    description: 'Original art, prints, and artistic collectibles',
    subcategories: [
      'Original Art',
      'Limited Prints',
      'Sketches',
      'Concept Art',
      'Fan Art',
      'Gallery Pieces',
      'Digital Art',
      'Art Books'
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Trophy,
    description: 'Sports memorabilia and collectibles',
    subcategories: [
      'Autographed Items',
      'Game-Used Items',
      'Sports Cards',
      'Jerseys',
      'Equipment',
      'Programs',
      'Tickets',
      'Vintage Sports'
    ]
  },
  {
    id: 'funko',
    name: 'Funko Pop',
    icon: Star,
    description: 'Funko Pop figures and related collectibles',
    subcategories: [
      'Marvel Funko',
      'DC Funko',
      'Disney Funko',
      'Anime Funko',
      'Movie Funko',
      'TV Funko',
      'Exclusive Funko',
      'Vintage Funko'
    ]
  },
  {
    id: 'anime-manga',
    name: 'Anime & Manga',
    icon: Zap,
    description: 'Anime figures, manga, and related collectibles',
    subcategories: [
      'Anime Figures',
      'Manga Books',
      'Anime DVDs',
      'Posters',
      'Keychains',
      'Plushies',
      'Model Kits',
      'Vintage Anime'
    ]
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    description: 'Vintage cameras, prints, and photography equipment',
    subcategories: [
      'Vintage Cameras',
      'Photography Books',
      'Darkroom Equipment',
      'Camera Accessories',
      'Film',
      'Photography Art',
      'Camera Bags',
      'Tripods & Stands'
    ]
  },
  {
    id: 'other',
    name: 'Other',
    icon: Heart,
    description: 'Other pop culture collectibles',
    subcategories: [
      'Pins & Badges',
      'Keychains',
      'Stickers',
      'Patches',
      'Jewelry',
      'Clothing',
      'Home Decor',
      'Miscellaneous'
    ]
  }
]

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
  showSubcategories = true,
  className
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('')

  const filteredCategories = categoryData.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub =>
      sub.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleCategorySelect = (categoryId: string) => {
    setSelectedMainCategory(categoryId)
    if (!showSubcategories) {
      onCategoryChange?.(categoryId)
    }
  }

  const handleSubcategorySelect = (subcategory: string) => {
    onCategoryChange?.(subcategory)
  }

  const selectedCategoryData = categoryData.find(cat => cat.id === selectedMainCategory)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Main Categories */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Select Category
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedMainCategory === category.id
            
            return (
              <Card
                key={category.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md border-2',
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Subcategories */}
      {showSubcategories && selectedCategoryData && (
        <div>
          <Label className="text-base font-semibold mb-4 block">
            Select Subcategory in {selectedCategoryData.name}
          </Label>
          <div className="space-y-2">
            {selectedCategoryData.subcategories.map((subcategory) => {
              const isSelected = selectedCategory === subcategory
              
              return (
                <div
                  key={subcategory}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  <span className="font-medium">{subcategory}</span>
                  {isSelected && (
                    <Badge className="bg-blue-500">
                      Selected
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Popular Categories Suggestion */}
      {searchTerm === '' && !selectedMainCategory && (
        <div>
          <Label className="text-base font-semibold mb-4 block">
            Popular Categories
          </Label>
          <div className="flex flex-wrap gap-2">
            {['comics', 'action-figures', 'trading-cards', 'funko', 'video-games'].map((categoryId) => {
              const category = categoryData.find(cat => cat.id === categoryId)
              if (!category) return null
              
              return (
                <Button
                  key={categoryId}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategorySelect(categoryId)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedCategory && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-green-800">Category Selected</p>
                <p className="text-sm text-green-700">{selectedCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
