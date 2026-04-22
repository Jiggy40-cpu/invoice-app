import React from 'react';
import { useInvoices } from '../context/InvoiceContext';

const options = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
];

const FilterBar = () => {
  const { filter, setFilter } = useInvoices();

  return (
    <section
      className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-5"
      aria-label="Filter invoices by status"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Filter by status
        </legend>
        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <label
              key={option.value}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <input
                type="radio"
                name="invoice-status-filter"
                checked={filter === option.value}
                onChange={() => setFilter(option.value)}
                aria-label={`Filter ${option.label}`}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
};

export default FilterBar;
