'use client';

import { CategorySelector } from '@/components/auction/category-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CategoryNavigation() {
  const handleCategoryChange = (category: string) => {
    console.log('Selected:', category);
    // TODO: Navigate to search with category filter
    // window.location.href = `/search?category=${encodeURIComponent(category)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <CategorySelector
          onCategoryChange={handleCategoryChange}
          selectedCategory=""
          showSubcategories={true}
        />
      </CardContent>
    </Card>
  );
}
