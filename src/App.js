import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Header from './components/Header';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceDetail from './components/InvoiceDetail';
import FilterBar from './components/FilterBar';
import './index.css';

const App = () => {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-8">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="mb-8">
                        <FilterBar />
                      </div>
                      <InvoiceList />
                    </>
                  }
                />
                <Route path="/create" element={<InvoiceForm />} />
                <Route path="/edit/:id" element={<InvoiceForm />} />
                <Route path="/invoice/:id" element={<InvoiceDetail />} />
              </Routes>
            </main>
          </div>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
};

export default App;