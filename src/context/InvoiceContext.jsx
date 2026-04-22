import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext(undefined);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setInvoices([newInvoice, ...invoices]);
    return newInvoice.id;
  };

  const updateInvoice = (id, updates) => {
    setInvoices(invoices.map(inv => (inv.id === id ? { ...inv, ...updates } : inv)));
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const getFilteredInvoices = () => {
    if (filter === 'all') return invoices;
    return invoices.filter(inv => inv.status === filter);
  };

  const value = {
    invoices,
    filter,
    setFilter,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getFilteredInvoices,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};