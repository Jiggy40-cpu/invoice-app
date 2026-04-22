import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from './StatusBadge';

const InvoiceList = () => {
  const navigate = useNavigate();
  const { getFilteredInvoices } = useInvoices();
  const invoices = getFilteredInvoices();

  if (invoices.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No invoices</h2>
        <p className="text-gray-600 dark:text-gray-400">Create one to get started.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4" aria-label="Invoice list">
      {invoices.map((invoice) => (
        <button
          key={invoice.id}
          onClick={() => navigate(`/invoice/${invoice.id}`)}
          className="w-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition border border-transparent hover:border-blue-400 dark:hover:border-blue-600"
          type="button"
          aria-label={`Open invoice ${invoice.invoiceNumber}`}
        >
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  #{invoice.invoiceNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(invoice.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{invoice.clientName}</p>
              <p className="font-semibold text-gray-900 dark:text-white">${invoice.total.toFixed(2)}</p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>
        </button>
      ))}
    </section>
  );
};

export default InvoiceList;
