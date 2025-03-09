import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { productApi } from '../../services/api';
import { showToast } from '../../utils/toast';
import { 
  Package, 
  Images, 
  DollarSign, 
  Plus,
  Trash2,
  Loader2 
} from 'lucide-react';
import { CreateProductDTO, Product } from '../../types/product';

type SpecField = {
  key: string;
  value: string;
};

export default function CreateListingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<SpecField[]>([{ key: '', value: '' }]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'NEW',
    category: '',
    subcategory: '',
    quantity: '1'
  });

  // Redirect if not logged in
  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

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
        return [];
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

  // TODO: Implement image upload on cloud
  // This is only for local implementation
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
  
    try {
      // setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
  
      if (!response.ok) throw new Error('Upload failed');
  
      const data = await response.json();
      setImages(prev => [...prev, ...data.urls]);
    } catch (error) {
      showToast.error('Failed to upload images');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert specs array to object
      const specsObject = specs.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const productData: CreateProductDTO = {
        title: formData.title,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        condition: formData.condition,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        quantity: parseInt(formData.quantity),
        images: images,
        specs: specsObject
      };

      const createdProduct = await productApi.createProduct(productData);
      showToast.success('Listing created successfully!');
      router.push(`/products/${createdProduct.id}`);
    } catch (error) {
      showToast.error('Failed to create listing');
      console.error('Error creating listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
          <p className="mt-2 text-gray-600">
            Fill out the details below to list your item for sale
          </p>
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
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      required
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Select Condition</option>
                      <option value="NEW">New</option>
                      <option value="LIKE_NEW">Like New</option>
                      <option value="USED">Used</option>
                    </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {formData.category && (
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
                <Plus className="w-4 h-4 mr-1" />
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Images
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                  <Images className="w-8 h-8 text-blue-500" />
                  <span className="mt-2 text-base leading-normal text-gray-600">
                    Select Images
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}