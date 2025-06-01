'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X, Filter, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  searchParams: {
    q?: string
    category?: string
    condition?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }
  onFiltersChange?: (filters: Record<string, string | number>) => void
  className?: string
}

const categories = [
  'Comics',
  'Action Figures',
  'Trading Cards',
  'Posters',
  'Statues & Busts',
  'Vintage Toys',
  'Autographs',
  'Props & Replicas',
  'Funko Pop',
  'Video Games',
  'Movies & TV',
  'Anime & Manga'
]

const conditions = [
  'Mint',
  'Near Mint',
  'Very Fine',
  'Fine',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
]

const sellers = [
  'Individual',
  'Verified Store',
  'Power Seller',
  'Authorized Dealer'
]

const shippingOptions = [
  'Free Shipping',
  'Local Pickup',
  'International Shipping',
  'Express Delivery'
]

export function SearchFilters({ searchParams, onFiltersChange, className }: SearchFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.category ? [searchParams.category] : []
  )
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.condition ? [searchParams.condition] : []
  )
  const [selectedSellers, setSelectedSellers] = useState<string[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.minPrice || '0'),
    parseInt(searchParams.maxPrice || '10000')
  ])
  const [customMinPrice, setCustomMinPrice] = useState(searchParams.minPrice || '')
  const [customMaxPrice, setCustomMaxPrice] = useState(searchParams.maxPrice || '')

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category)
    setSelectedCategories(newCategories)
    onFiltersChange?.({ categories: newCategories.join(',') })
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...selectedConditions, condition]
      : selectedConditions.filter(c => c !== condition)
    setSelectedConditions(newConditions)
    onFiltersChange?.({ conditions: newConditions.join(',') })
  }

  const handleSellerChange = (seller: string, checked: boolean) => {
    const newSellers = checked
      ? [...selectedSellers, seller]
      : selectedSellers.filter(s => s !== seller)
    setSelectedSellers(newSellers)
    onFiltersChange?.({ sellers: newSellers.join(',') })
  }

  const handleShippingChange = (shipping: string, checked: boolean) => {
    const newShipping = checked
      ? [...selectedShipping, shipping]
      : selectedShipping.filter(s => s !== shipping)
    setSelectedShipping(newShipping)
    onFiltersChange?.({ shipping: newShipping.join(',') })
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
    onFiltersChange?.({ minPrice: range[0], maxPrice: range[1] })
  }

  const handleCustomPriceChange = () => {
    const min = parseInt(customMinPrice) || 0
    const max = parseInt(customMaxPrice) || 10000
    setPriceRange([min, max])
    onFiltersChange?.({ minPrice: min, maxPrice: max })
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedConditions([])
    setSelectedSellers([])
    setSelectedShipping([])
    setPriceRange([0, 10000])
    setCustomMinPrice('')
    setCustomMaxPrice('')
    onFiltersChange?.({})
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedConditions.length > 0 || 
    selectedSellers.length > 0 || selectedShipping.length > 0 || 
    priceRange[0] > 0 || priceRange[1] < 10000

  return (
    <Card className={cn('w-full max-w-sm', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm text-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Category</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
          <div className="space-y-4">
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={10000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="min-price" className="text-xs text-gray-600">Min</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  onBlur={handleCustomPriceChange}
                  className="h-8"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="max-price" className="text-xs text-gray-600">Max</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="10000"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  onBlur={handleCustomPriceChange}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Condition Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Condition</Label>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={(checked) => 
                    handleConditionChange(condition, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`condition-${condition}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Seller Type Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Seller Type</Label>
          <div className="space-y-2">
            {sellers.map((seller) => (
              <div key={seller} className="flex items-center space-x-2">
                <Checkbox
                  id={`seller-${seller}`}
                  checked={selectedSellers.includes(seller)}
                  onCheckedChange={(checked) => 
                    handleSellerChange(seller, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`seller-${seller}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {seller}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shipping Options Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Shipping</Label>
          <div className="space-y-2">
            {shippingOptions.map((shipping) => (
              <div key={shipping} className="flex items-center space-x-2">
                <Checkbox
                  id={`shipping-${shipping}`}
                  checked={selectedShipping.includes(shipping)}
                  onCheckedChange={(checked) => 
                    handleShippingChange(shipping, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`shipping-${shipping}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {shipping}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div>
              <Label className="text-sm font-semibold mb-3 block">Active Filters</Label>
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1"
                      onClick={() => handleCategoryChange(category, false)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
                {selectedConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-xs">
                    {condition}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1"
                      onClick={() => handleConditionChange(condition, false)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
