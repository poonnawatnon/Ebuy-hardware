import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../../services/api';
// ... other imports ...

export default function EditProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [specs, setSpecs] = useState<SpecField[]>([{ key: '', value: '' }]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        subcategory: '',
        quantity: '1',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            useQuery<Product>({
                queryKey: ['product', router.query.id as string],
                queryFn: () => productApi.getProduct(router.query.id as string),
                enabled: !!router.query.id,
                onSuccess: (product) => {
                    setFormData({
                        title: product.title,
                        description: product.description || '',
                        price: product.price.toString(),
                        condition: product.condition,
                        category: product.category,
                        subcategory: product.subcategory || '',
                        quantity: product.quantity.toString(),
                        status: product.status
                    });
                    setImages(product.images);

                    if (product.specs) {
                        const specArray = Object.entries(product.specs as Record<string, string>).map(([key, value]) => ({
                            key,
                            value: value.toString()
                        }));
                        setSpecs(specArray.length > 0 ? specArray : [{ key: '', value: '' }]);
                    }
                }
            });
        }
    }, [router.isReady, router.query.id]);

    // ... rest of the component ...
}
