import React, { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import DeleteModal from './DeleteModal';
import { formatDistanceToNow } from 'date-fns';

function InvoiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { invoices, updateInvoice, deleteInvoice } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to invoices
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(id);
    navigate('/');
  };

  const handleMarkPaid = () => {
    if (invoice.status === 'pending') {
      updateInvoice(id, { status: 'paid' });
    }
  };

  const total = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
      >
        ← Back
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              #{invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 md:p-8 mb-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Bill To
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {invoice.clientName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{invoice.clientEmail}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Invoice Details
            </h3>
            <p className="text-gray-900 dark:text-white">
              <span className="font-semibold">Number:</span> {invoice.invoiceNumber}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-semibold">Date:</span>{' '}
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {invoice.description && (
          <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Description
            </h3>
            <p className="text-gray-900 dark:text-white">{invoice.description}</p>
          </div>
        )}

        {/* Items Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Description
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Qty
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Price
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{item.description}</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-semibold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-64">
            <div className="flex justify-between py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded text-lg font-bold text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        {invoice.status === 'draft' && (
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Edit Invoice
          </button>
        )}
        {invoice.status === 'pending' && (
          <button
            onClick={handleMarkPaid}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Mark as Paid
          </button>
        )}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Delete Invoice
        </button>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        invoiceNumber={invoice.invoiceNumber}
      />
    </div>
  );
}

export default InvoiceDetail;
