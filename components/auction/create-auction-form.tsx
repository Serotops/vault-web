'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Camera, DollarSign, Calendar, Shield, TrendingUp } from 'lucide-react'

export function CreateAuctionForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    startingBid: '',
    buyNowPrice: '',
    auctionDuration: '7',
    shippingCost: '',
    images: [] as File[]
  })

  const categories = [
    { value: 'comics', label: 'Comics' },
    { value: 'trading-cards', label: 'Trading Cards' },
    { value: 'action-figures', label: 'Action Figures' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'vintage-toys', label: 'Vintage Toys' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'movies-tv', label: 'Movies & TV' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ]

  const conditions = [
    { value: 'mint', label: 'Mint' },
    { value: 'near-mint', label: 'Near Mint' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'very-good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ]

  const durations = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '5', label: '5 Days' },
    { value: '7', label: '7 Days' },
    { value: '10', label: '10 Days' },
    { value: '14', label: '14 Days' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating auction:', formData)
    // TODO: Implement auction creation
  }

  const sellingTips = [
    {
      icon: Camera,
      title: 'Great Photos',
      description: 'Use high-quality images from multiple angles'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Research similar items to set the right starting bid'
    },
    {
      icon: TrendingUp,
      title: 'Detailed Descriptions',
      description: 'Include condition details and provenance information'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Collectible</h1>
        <p className="text-gray-600">
          Create an auction to reach thousands of collectors worldwide
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Provide detailed information about your collectible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Amazing Spider-Man #1 (1963) CGC 9.2"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail, including any flaws, provenance, or special features..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>
                  Upload high-quality images of your item (max 10 photos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="images" className="cursor-pointer text-blue-600 hover:text-blue-500">
                      Click to upload images
                    </Label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {formData.images.length} image(s) selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((file, index) => (
                        <Badge key={index} variant="secondary">
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing & Auction Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Auction Settings</CardTitle>
                <CardDescription>
                  Set your pricing and auction duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startingBid">Starting Bid ($) *</Label>
                    <Input
                      id="startingBid"
                      type="number"
                      placeholder="0.01"
                      min="0.01"
                      step="0.01"
                      value={formData.startingBid}
                      onChange={(e) => handleInputChange('startingBid', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="buyNowPrice">Buy It Now Price ($)</Label>
                    <Input
                      id="buyNowPrice"
                      type="number"
                      placeholder="Optional"
                      min="0.01"
                      step="0.01"
                      value={formData.buyNowPrice}
                      onChange={(e) => handleInputChange('buyNowPrice', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="auctionDuration">Auction Duration</Label>
                    <Select value={formData.auctionDuration} onValueChange={(value) => handleInputChange('auctionDuration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="shippingCost">Shipping Cost ($) *</Label>
                    <Input
                      id="shippingCost"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.shippingCost}
                      onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Create Auction
              </Button>
              <Button type="button" variant="outline" size="lg">
                Save Draft
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selling Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Selling Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sellingTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <tip.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Selling Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Listing Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Final Value Fee</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Processing</span>
                <span className="font-medium">2.9%</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-600">
                  Fees are only charged when your item sells
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
