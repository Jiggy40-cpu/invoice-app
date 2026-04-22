import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';

const emptyItem = { description: '', quantity: 1, price: 1 };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { invoices, addInvoice, updateInvoice } = useInvoices();
  const editingInvoice = useMemo(() => invoices.find((invoice) => invoice.id === id), [id, invoices]);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(() => ({
    invoiceNumber: editingInvoice?.invoiceNumber || '',
    clientName: editingInvoice?.clientName || '',
    clientEmail: editingInvoice?.clientEmail || '',
    description: editingInvoice?.description || '',
    items:
      editingInvoice?.items?.map((item) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        price: item.price || 1,
      })) || [emptyItem],
  }));
  const [errors, setErrors] = useState({});

  const isReadOnly = isEdit && editingInvoice && editingInvoice.status !== 'draft';

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.invoiceNumber.trim()) nextErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.clientName.trim()) nextErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim() || !emailRegex.test(formData.clientEmail)) {
      nextErrors.clientEmail = 'Valid client email is required';
    }
    if (formData.items.length === 0) nextErrors.items = 'At least one item is required';

    const itemErrors = {};
    formData.items.forEach((item, index) => {
      const entryErrors = {};
      if (!item.description.trim()) entryErrors.description = 'Description is required';
      if (!Number(item.quantity) || Number(item.quantity) <= 0) {
        entryErrors.quantity = 'Quantity must be greater than 0';
      }
      if (!Number(item.price) || Number(item.price) <= 0) {
        entryErrors.price = 'Price must be greater than 0';
      }
      if (Object.keys(entryErrors).length > 0) itemErrors[index] = entryErrors;
    });

    if (Object.keys(itemErrors).length > 0) nextErrors.itemErrors = itemErrors;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (status) => {
    if (!validate() || isReadOnly) return;

    const normalizedItems = formData.items.map((item) => ({
      description: item.description.trim(),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));
    const total = normalizedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const payload = {
      invoiceNumber: formData.invoiceNumber.trim(),
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      description: formData.description.trim(),
      items: normalizedItems,
      status,
      total,
    };

    if (isEdit) {
      updateInvoice(id, payload);
      navigate(`/invoice/${id}`);
      return;
    }

    const newId = addInvoice(payload);
    navigate(`/invoice/${newId}`);
  };

  if (isEdit && !editingInvoice) {
    return (
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Invoice not found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          type="button"
        >
          Back to invoices
        </button>
      </section>
    );
  }

  if (isReadOnly) {
    return (
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invoice is read-only</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Only draft invoices can be edited.
        </p>
        <button
          onClick={() => navigate(`/invoice/${id}`)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          type="button"
        >
          Go to invoice
        </button>
      </section>
    );
  }

  return (
    <form
      className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-8 space-y-6"
      onSubmit={(event) => event.preventDefault()}
      noValidate
      aria-label={isEdit ? 'Edit invoice form' : 'Create invoice form'}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {isEdit ? 'Edit Draft Invoice' : 'New Invoice'}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Invoice Number
          </label>
          <input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(event) => updateField('invoiceNumber', event.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
            aria-invalid={Boolean(errors.invoiceNumber)}
          />
          {errors.invoiceNumber && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.invoiceNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Client Name
          </label>
          <input
            id="clientName"
            value={formData.clientName}
            onChange={(event) => updateField('clientName', event.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
            aria-invalid={Boolean(errors.clientName)}
          />
          {errors.clientName && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.clientName}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Client Email
          </label>
          <input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(event) => updateField('clientEmail', event.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
            aria-invalid={Boolean(errors.clientEmail)}
          />
          {errors.clientEmail && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.clientEmail}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            id="description"
            value={formData.description}
            onChange={(event) => updateField('description', event.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <section aria-label="Invoice items">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Add Item
          </button>
        </div>
        {errors.items && <p className="text-red-600 dark:text-red-400 text-sm mb-2">{errors.items}</p>}
        <div className="space-y-3">
          {formData.items.map((item, index) => {
            const itemError = errors.itemErrors?.[index] || {};
            return (
              <div
                key={`${index}-${item.description}`}
                className="grid gap-3 md:grid-cols-[1fr_120px_120px_auto] items-start"
              >
                <div>
                  <input
                    aria-label={`Item ${index + 1} description`}
                    value={item.description}
                    onChange={(event) => updateItem(index, 'description', event.target.value)}
                    placeholder="Description"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
                  />
                  {itemError.description && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{itemError.description}</p>
                  )}
                </div>
                <div>
                  <input
                    aria-label={`Item ${index + 1} quantity`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
                  />
                  {itemError.quantity && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{itemError.quantity}</p>
                  )}
                </div>
                <div>
                  <input
                    aria-label={`Item ${index + 1} price`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.price}
                    onChange={(event) => updateItem(index, 'price', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
                  />
                  {itemError.price && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{itemError.price}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition"
                  aria-label={`Remove item ${index + 1}`}
                  disabled={formData.items.length === 1}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => submit('draft')}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition font-semibold"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => submit('pending')}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
        >
          Save &amp; Send
        </button>
        <button
          type="button"
          onClick={() => navigate(isEdit ? `/invoice/${id}` : '/')}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
