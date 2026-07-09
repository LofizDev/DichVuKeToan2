/**
 * Maps legacy hash anchor links from the database to the new React Router page paths.
 */
export const mapLink = (link: string | undefined | null): string => {
  if (!link) return '/';
  if (link.startsWith('#')) {
    switch (link) {
      case '#gioi-thieu':
        return '/gioi-thieu';
      case '#bang-gia':
        return '/ke-toan-tron-goi';
      case '#bao-cao-tai-chinh':
        return '/bao-cao-tai-chinh';
      case '#don-dep-so-sach':
        return '/don-dep-so-sach';
      case '#thanh-lap-cong-ty':
        return '/thanh-lap-cong-ty';
      case '#dich-vu':
        return '/dich-vu';
      case '#lien-he':
        return '/lien-he';
      default:
        return '/';
    }
  }
  return link;
};
