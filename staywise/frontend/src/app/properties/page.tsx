'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyAPI } from '@/lib/api';
import type { PaginatedProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import useDebounce from '@/hooks/useDebounce';
import type { Property } from '@/types';

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [minBeds, setMinBeds] = useState<string>('');
  const [maxBeds, setMaxBeds] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const debouncedSearch = useDebounce(search, 400);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);

  const params = {
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
  ...(type ? { type } : {}),
  ...(bedrooms ? { bedrooms } : {}),
  ...(minBeds ? { minBeds } : {}),
  ...(maxBeds ? { maxBeds } : {}),
    ...(minPrice ? { minPrice } : {}),
    ...(maxPrice ? { maxPrice } : {}),
    page,
    limit,
  };

  const query = useQuery<PaginatedProperties, Error>(({ queryKey: ['properties', params], queryFn: () => propertyAPI.getAll(params), keepPreviousData: true } as any));
  const paginated = query.data as PaginatedProperties | undefined;
  const isLoading = query.isLoading;
  const error = query.error;

  const properties: Property[] = paginated?.data ?? [];

  function clearFilters() {
    setSearch('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setMinBeds('');
    setMaxBeds('');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore Properties</h1>
        <p className="text-gray-600">Find the perfect place for your next stay</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description"
              className="flex-1 w-full border rounded px-4 py-2 shadow-sm"
            />

            {/* Filter toggle for mobile */}
            <FilterToggle clearFilters={clearFilters} />
          </div>

          {/* Collapsible filters panel */}
          <div className="w-full">
            <div className="hidden md:flex md:items-end md:justify-between gap-4">
              <div className="flex gap-3 items-center">
                <div>
                  <label className="block text-sm text-gray-600">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-40 border rounded px-3 py-2"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5plus">5+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Min beds</label>
                  <input
                    type="number"
                    value={minBeds}
                    onChange={(e) => setMinBeds(e.target.value)}
                    placeholder="0"
                    className="w-24 border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Max beds</label>
                  <input
                    type="number"
                    value={maxBeds}
                    onChange={(e) => setMaxBeds(e.target.value)}
                    placeholder="10"
                    className="w-24 border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Min price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-24 border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Max price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="1000"
                    className="w-24 border rounded px-2 py-1"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={clearFilters}
                  className="bg-gray-100 text-sm px-3 py-2 rounded"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Mobile expanded filters (collapsible handled by FilterToggle) */}
            <div className="md:hidden">
              <MobileFilters
                bedrooms={bedrooms}
                setBedrooms={setBedrooms}
                minBeds={minBeds}
                setMinBeds={setMinBeds}
                maxBeds={maxBeds}
                setMaxBeds={setMaxBeds}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load properties. Please try again later.
        </div>
      ) : properties && properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No properties available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-white border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <div className="text-sm text-gray-600">
              Page {paginated?.page ?? page} of {paginated?.pages ?? 1} — {paginated?.total ?? 0} properties
            </div>

            <button
              onClick={() => setPage((p) => (paginated && p < paginated.pages ? p + 1 : p))}
              disabled={paginated ? page >= paginated.pages : true}
              className="px-3 py-2 bg-white border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FilterToggle({ clearFilters }: { clearFilters: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center px-3 py-2 border rounded bg-white text-sm"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 12h18M3 20h18" />
        </svg>
        Filters
      </button>

      {open && (
        <div className="absolute mt-12 bg-white border rounded shadow p-4 z-40 w-[90%] left-4">
          <MobileFiltersWrapper clearFilters={clearFilters} close={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function MobileFiltersWrapper({ clearFilters, close }: { clearFilters: () => void; close: () => void }) {
  // local state is managed by parent page via closures; here we just render slots and provide a close button
  return (
    <div>
      <div className="flex justify-end mb-2">
        <button onClick={close} className="text-sm text-gray-600">Close</button>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Use the filters panel below on mobile.</p>
        <div className="flex justify-end">
          <button onClick={clearFilters} className="bg-gray-100 px-3 py-1 rounded text-sm">Clear</button>
        </div>
      </div>
    </div>
  );
}

function MobileFilters(props: any) {
  // Render a simple stacked set of inputs for mobile (we use props to bind to parent state)
  return (
    <div className="space-y-3 p-3 border rounded bg-white">
      <div>
        <label className="block text-sm text-gray-600">Bedrooms</label>
        <select
          value={props.bedrooms}
          onChange={(e: any) => props.setBedrooms(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5plus">5+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600">Min beds</label>
        <input
          type="number"
          value={props.minBeds}
          onChange={(e: any) => props.setMinBeds(e.target.value)}
          placeholder="0"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Max beds</label>
        <input
          type="number"
          value={props.maxBeds}
          onChange={(e: any) => props.setMaxBeds(e.target.value)}
          placeholder="10"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Min price</label>
        <input
          type="number"
          value={props.minPrice}
          onChange={(e: any) => props.setMinPrice(e.target.value)}
          placeholder="0"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Max price</label>
        <input
          type="number"
          value={props.maxPrice}
          onChange={(e: any) => props.setMaxPrice(e.target.value)}
          placeholder="1000"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex justify-end">
        <button onClick={props.clearFilters} className="bg-gray-100 px-3 py-2 rounded">Clear</button>
      </div>
    </div>
  );
}