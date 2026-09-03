const APPLICATION_STATUS_STYLES = {
  New: 'bg-[#F0EAFB] text-[#6030C6] border-[#DFD2F5]',
  Reviewed: 'bg-slate-100 text-slate-700 border-slate-200',
  Shortlisted: 'bg-[#FFF1E6] text-[#C45F13] border-[#FFD8B7]',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Hired: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const APPLICATION_STATUS_LABELS = {
  New: 'New',
  Reviewed: 'Reviewed',
  Shortlisted: 'Shortlisted',
  Rejected: 'Rejected',
  Hired: 'Hired',
};

export const APPLICATION_STATUSES = Object.keys(APPLICATION_STATUS_LABELS);

export const getApplicationStatusStyles = (status = '') =>
  APPLICATION_STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200';

export const getApplicationStatusLabel = (status = '') =>
  APPLICATION_STATUS_LABELS[status] || status || 'New';

export const formatApplicationDate = (value) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const isCareerAcceptingApplications = (career) => {
  if (!career) return false;

  if (career.status !== 'Open') {
    return false;
  }

  if (career.published === false) {
    return false;
  }

  if (!career.applicationDeadline) {
    return true;
  }

  const deadline = new Date(career.applicationDeadline);
  return !Number.isNaN(deadline.getTime()) && deadline.getTime() >= Date.now();
};

export const formatCareerDeadline = (value) => {
  if (!value) return 'Open until filled';
  const formatted = formatApplicationDate(value);
  return formatted || 'Open until filled';
};
