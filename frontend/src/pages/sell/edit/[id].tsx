import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import {
    Loader2,
    Images,
    Trash2,
    Save,
    ArrowLeft
} from 'lucide-react';
import { Product, UpdateProductDTO } from '../../../types/product';

type SpecField = {
    key: string;
    value: string;
};

export default function EditProductPage() {
    const router = useRouter();
    // const { id } = router.query;  // Removed: Direct destructuring of router.query
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string>();
    const [specs, setSpecs] = useState<SpecField>([{ key: '', value: '' }]);

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

    // Fetch product data
    // const { data: product, isLoading: isFetching } = useQuery<Product>({ // Removed: Moved inside useEffect
    //     queryKey: ['product', id],
    //     queryFn: () => productApi.getProduct(id as string),
    //     enabled: !!id,
    // });
    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            useQuery<Product>({  // Moved: useQuery inside useEffect
                queryKey: ['product', router.query.id as string],
                queryFn: () => productApi.getProduct(router.query.id as string),
                enabled: !!router.query.id,
                onSuccess: (product) => { // Added: onSuccess handler
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
    }, [router.isReady, router.query.id]); // Added: router.isReady and router.query.id as dependencies

    const mainCategories = [
        { value: 'GAMING_PCS', label: 'Gaming PCs' },
        { value: 'GPUS', label: 'Graphics Cards' },
        { value: 'CPUS', label: 'Processors' },
        { value: 'COMPONENTS', label: 'Components' },
        { value: 'PERIPHERALS', label: 'Peripherals' },
        { value: 'ACCESSORIES', label: 'Accessories' }
    ];

    const getSubcategories = (mainCategory: string) => {
        switch (mainCategory) {
            case 'GAMING_PCS':
                return [
                    { value: 'PREBUILT', label: 'Pre-built' },
                    { value: 'CUSTOM', label: 'Custom Built' },
                    { value: 'REFURBISHED', label: 'Refurbished' }
                ];
            case 'GPUS':
                return [
                    { value: 'NVIDIA', label: 'NVIDIA' },
                    { value: 'AMD', label: 'AMD' },
                    { value: 'WORKSTATION', label: 'Workstation' }
                ];
            case 'CPUS':
                return [
                    { value: 'INTEL', label: 'Intel Core' },
                    { value: 'AMD', label: 'AMD Ryzen' },
                ];
            case 'COMPONENTS':
                return [
                    { value: 'MOTHERBOARD', label: 'Motherboards' },
                    { value: 'MEMORY', label: 'Memory (RAM)' },
                    { value: 'STORAGE', label: 'Storage' },
                    { value: 'PSU', label: 'Power Supplies' },
                    { value: 'CASE', label: 'Cases' },
                    { value: 'COOLING', label: 'Cooling' }
                ];
            case 'PERIPHERALS':
                return [
                    { value: 'MONITOR', label: 'Monitors' },
                    { value: 'KEYBOARD', label: 'Keyboards' },
                    { value: 'MOUSE', label: 'Mice' },
                    { value: 'HEADSET', label: 'Headsets' },
                    { value: 'SPEAKERS', label: 'Speakers' },
                    { value: 'WEBCAM', label: 'Webcams' }
                ];
            case 'ACCESSORIES':
                return [
                    { value: 'CABLES', label: 'Cables & Adapters' },
                    { value: 'TOOLS', label: 'Tools & Equipment' },
                    { value: 'THERMAL_PASTE', label: 'Thermal Products' },
                    { value: 'FANS', label: 'Case Fans' },
                    { value: 'RGB', label: 'RGB & Lighting' },
                    { value: 'CLEANING', label: 'Cleaning Products' },
                    { value: 'STANDS', label: 'Stands & Mounts' }
                ];
            default:
                return;
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const addSpecField = () => {
        setSpecs([...specs, { key: '', value: '' }]);
    };

    const removeSpecField = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    // TODO: Implement actual image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // Temporary: using URLs directly. In production, implement proper image upload
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages([...images, ...newImages]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const specsObject = specs.reduce((acc: Record<string, string>, { key, value }) => {
                if (key && value) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const productData: UpdateProductDTO = {
                title: formData.title,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                condition: formData.condition,
                category: formData.category,
                subcategory: formData.subcategory || undefined,
                quantity: parseInt(formData.quantity),
                status: formData.status as 'ACTIVE' | 'SOLD' | 'RESERVED',
                images: images,
                specs: specsObject
            };

            await productApi.updateProduct(router.query.id as string, productData); // Modified: Access router.query.id here
            showToast.success('Product updated successfully!');
            router.push('/sell/listings');
        } catch (error) {
            showToast.error('Failed to update product');
            console.error('Error updating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                            <p className="mt-1 text-gray-600">Update your product listing</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        required
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="RESERVED">Reserved</option>
                                        <option value="SOLD">Sold</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Category
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Main Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    {mainCategories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.category && getSubcategories(formData.category).length > 0 && (
                                <div>
                                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                                        Subcategory
                                    </label>
                                    <select
                                        id="subcategory"
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Subcategory</option>
                                        {getSubcategories(formData.category).map(subcategory => (
                                            <option key={subcategory.value} value={subcategory.value}>
                                                {subcategory.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Specifications
                            </h2>
                            <button
                                type="button"
                                onClick={addSpecField}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                                Add Spec
                            </button>
                        </div>

                        <div className="space-y-3">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Specification"
                                        value={spec.key}
                                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={spec.value}
                                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpecField(index)}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg
