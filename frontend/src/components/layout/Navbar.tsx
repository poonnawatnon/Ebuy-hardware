import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, 
        Heart, 
        Bell, 
        Search,
        Plus,
        LayoutGrid,
        LogOut,
        Store,
        UserCircle,
        Package,
        ClipboardList , 
        } from 'lucide-react';
import Image from 'next/image';
import { Menu } from '@headlessui/react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const categories = [
    { name: 'NEW', href: '/products' },
    { name: 'GAMING PCS', href: '/products/pcs' },
    { name: 'GPUS', href: '/products/gpus' },
    { name: 'CPUS', href: '/products/cpus' },
    { name: 'COMPONENTS', href: '/products/components' },
    { name: 'PERIPHERALS', href: '/products/peripherals' },
    { name: 'ACCESSORIES', href: '/products/accessories' },
    { name: 'OTHER SYSTEMS', href: '/products/other-systems' },
  ];

  const rightLinks = [
    { name: 'Help', href: '/help' },
    { name: 'Blog', href: '/blog' },
    { name: 'Discord', href: '/discord' },
    { name: 'PC Finder', href: '/pc-finder' },
  ];

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold">Ebuy™</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search product listings"
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"/>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn && (
                <button 
                  onClick={() => router.push('/register')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  START SELLING
                </button>
              )}
              
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="h-6 w-6" />
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6" />
              </button>
              
              <button 
                onClick={() => router.push('/cart')}
                className="p-2 hover:bg-gray-100 rounded-full relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
  <Menu as="div" className="relative">
    <Menu.Button className="p-1 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
      <img
        src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
        alt="Profile"
        className="h-6 w-6 rounded-full"
      />
    </Menu.Button>

    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
      {/* User Section */}
      <div className="py-1">
        <Menu.Item>
          {({ active }) => (
            <Link href="/profile">
              <span className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}>
                <UserCircle className="h-4 w-4 mr-3" />
                Profile Settings
              </span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link href="/orders">
              <span className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}>
                <Package className="h-4 w-4 mr-3" />
                My Orders
              </span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link href="/wishlist">
              <span className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}>
                <Heart className="h-4 w-4 mr-3" />
                Wishlist
              </span>
            </Link>
          )}
        </Menu.Item>
      </div>

      {/* Store Section */}
      <div className="py-1">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center">
          <Store className="h-3 w-3 mr-1" />
            MY STORE
        </div>
        <Menu.Item>
          {({ active }) => (
            <Link href="/sell">
              <span className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}>
                <Plus className="h-4 w-4 mr-3" />
                Create Listing
              </span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link href="/sell/listings">
              <span className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}>
                <LayoutGrid className="h-4 w-4 mr-3" />
                My Listings
              </span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link href="/sell/orders">
              <span className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}>
                <ClipboardList className="h-4 w-4 mr-3" />
                My Sales
              </span>
            </Link>
          )}
        </Menu.Item>
      </div>
      {/* Logout Section */}
      <div className="py-1">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleLogout}
              className={`${active ? 'bg-gray-50' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700`}>
              <LogOut className="h-4 w-4 mr-3" />
              Log Out
            </button>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  </Menu>
) : (
  <Link href="/login">
    <span className="text-sm text-gray-600 hover:text-gray-900">Sign In</span>
  </Link>
)}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-8">
              {categories.map((category) => (
                <Link 
                  key={category.name} 
                  href={category.href}
                  className={`text-sm font-medium ${
                    router.pathname === category.href
                      ? 'text-purple-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-6">
              {rightLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}