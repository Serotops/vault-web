// Help page for sellers with tips and image upload guidelines

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageUploaderDemo } from '@/components/ui/image-uploader-demo';
import {
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Star,
  Eye
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Help Guide - Vault',
  description: 'Tips and guidelines for selling collectibles successfully on Vault.',
};

export default function SellerHelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seller Help Guide</h1>
          <p className="text-gray-600">
            Everything you need to know to sell successfully on Vault
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Tips */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Quick Success Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">High-Quality Photos</h4>
                      <p className="text-sm text-gray-600">Clear, well-lit images increase sales by 40%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Detailed Descriptions</h4>
                      <p className="text-sm text-gray-600">Include condition, rarity, and provenance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Competitive Pricing</h4>
                      <p className="text-sm text-gray-600">Research similar items to set fair starting bids</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Fast Responses</h4>
                      <p className="text-sm text-gray-600">Answer questions quickly to build trust</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Photo Guidelines */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-500" />
                  Photo Guidelines & Upload Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Guidelines */}
                  <div>
                    <h4 className="font-medium mb-4">Photography Best Practices</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Use natural lighting or bright white LED lights</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Take photos from multiple angles (front, back, sides)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Show any flaws, damage, or wear clearly</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Include scale references (coins, rulers)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Use neutral backgrounds (white/gray)</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium mb-3 text-red-600">Avoid These Mistakes</h5>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Blurry or out-of-focus images</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Dark or poorly lit photos</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Watermarks or logos from other sites</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Stock photos or images from catalogs</span>
                        </div>
                      </div>
                    </div>
                  </div>                  {/* Upload Demo */}
                  <div>
                    <ImageUploaderDemo />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Pricing Strategy */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Pricing Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-blue-50 rounded-lg mb-3">
                      <Eye className="h-8 w-8 text-blue-600 mx-auto" />
                    </div>
                    <h4 className="font-medium mb-2">Research First</h4>
                    <p className="text-sm text-gray-600">
                      Check completed auctions for similar items to understand market value
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-green-50 rounded-lg mb-3">
                      <AlertTriangle className="h-8 w-8 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-medium mb-2">Start Conservative</h4>
                    <p className="text-sm text-gray-600">
                      Lower starting bids attract more bidders and can drive final prices higher
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-purple-50 rounded-lg mb-3">
                      <Lightbulb className="h-8 w-8 text-purple-600 mx-auto" />
                    </div>
                    <h4 className="font-medium mb-2">Buy It Now</h4>
                    <p className="text-sm text-gray-600">
                      Set a reasonable Buy It Now price for quick sales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Common Questions */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">How many photos should I upload?</h4>
                    <p className="text-sm text-gray-600">
                      We recommend at least 4-6 photos showing different angles. Include close-ups of any notable features, flaws, or signatures.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">What\'s the best auction duration?</h4>
                    <p className="text-sm text-gray-600">
                      7-10 days works well for most items. Rare or high-value items might benefit from longer auctions (14-21 days).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Should I grade my comics/cards?</h4>
                    <p className="text-sm text-gray-600">
                      Professional grading from CGC, PSA, or BGS typically increases value and buyer confidence, especially for valuable items.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">How do I handle international shipping?</h4>
                    <p className="text-sm text-gray-600">
                      Consider offering international shipping to increase your buyer pool. Use tracked services and factor in customs forms and potential delays.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" asChild>
              <a href="/sell">Start Selling Now</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/help">More Help Articles</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
