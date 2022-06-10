import { format } from '@lukeed/ms';
import { useMemo } from 'react';

export const checkPermission = (data, role) => {
  return !!data?.user?.roles?.[role] || !!data?.roles?.[role];
}

export const StripHTMLTags = (value) => {
  return `${value}`.replace(/(<([^>]+)>)/gi, "")
}

export const getTimestamp = (value) => {
  return useMemo(() => {
    const diff = Date.now() - new Date(value).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [value]);
}

export default {};