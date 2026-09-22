const PLACEHOLDER_URL = 'https://placehold.co/400x300/e2e8f0/0f766e';

const getDriveFileId = (value: string): string => {
  const trimmedValue = value.trim().replace(/^['"]|['"]$/g, '');
  const urlMatch = trimmedValue.match(/(?:\/d\/|[?&]id=|file%3D)([a-zA-Z0-9_-]+)/i);
  if (urlMatch) return urlMatch[1];
  return /^[a-zA-Z0-9_-]{20,}$/.test(trimmedValue) ? trimmedValue : '';
};

export const getImageUrl = (
  filename: string,
  name: string,
  customBaseUrl = ''
): string => {
  if (!filename) {
    return `${PLACEHOLDER_URL}?text=${encodeURIComponent(name || 'FoodHills')}`;
  }

  const driveFileId = getDriveFileId(filename);
  if (driveFileId || filename.includes('drive.google.com') || filename.includes('docs.google.com')) {
    return driveFileId
      ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1000`
      : filename;
  }

  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;

  if (customBaseUrl) {
    if (customBaseUrl.includes('{filename}')) {
      return customBaseUrl.replace('{filename}', encodeURIComponent(filename));
    }
    return `${customBaseUrl.replace(/\/$/, '')}/${filename}`;
  }

  return `${PLACEHOLDER_URL}?text=${encodeURIComponent(name || 'FoodHills')}`;
};
