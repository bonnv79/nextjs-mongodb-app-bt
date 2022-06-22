import { format } from '@lukeed/ms';
import { useMemo } from 'react';

export const checkPermission = (roles, role) => {
  return !!roles?.[role];
}

export const StripHTMLTags = (value) => {
  return `${value}`.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
}

export const getTimestamp = (value) => {
  return useMemo(() => {
    const diff = Date.now() - new Date(value).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [value]);
}

export const parseDataPage = (data, key = 'data') => {
  return Array.isArray(data) ? data.reduce((acc, val) => [...acc, ...val[key]], []) : [];
}

export default {};