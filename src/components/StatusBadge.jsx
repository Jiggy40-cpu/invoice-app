import React from 'react';

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const DOT_STYLES = {
  draft: 'bg-gray-500',
  pending: 'bg-orange-500',
  paid: 'bg-green-500',
};

const StatusBadge = ({ status }) => {
  const normalized = typeof status === 'string' ? status.toLowerCase() : 'draft';
  const badgeStyles = STATUS_STYLES[normalized] || STATUS_STYLES.draft;
  const dotStyles = DOT_STYLES[normalized] || DOT_STYLES.draft;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badgeStyles}`}
      aria-label={`Status: ${normalized}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotStyles}`} aria-hidden="true" />
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
};

export default StatusBadge;
