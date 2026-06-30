export interface Setting {
  _id?: string;
  siteName: string;
  siteNameZh: string;
  companyName: string;
  companyNameZh: string;
  email: string;
  adminEmail: string;
  phone: string;
  hotline: string;
  address: string;
  addressZh: string;
  zaloLink: string;
  googleMapEmbed: string;
  copyright: string;
  copyrightZh: string;
  logoUrl: string;
  updatedAt?: string;
}

export interface Section {
  _id?: string;
  sectionId: string;
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
  order: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface ServiceItem {
  _id?: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  iconUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface PriceField {
  _id?: string;
  sector: string;
  sectorZh?: string;
  price: string;
}

export interface PriceRow {
  _id?: string;
  invoiceRange: string;
  invoiceRangeZh?: string;
  fields: PriceField[];
}

export interface PriceTable {
  _id?: string;
  sectionId: string;
  tableName: string;
  tableNameZh: string;
  subHeader?: string;
  subHeaderZh?: string;
  rows: PriceRow[];
  contactRow: {
    label: string;
    labelZh?: string;
    contactInfo: string;
    contactInfoZh?: string;
  };
}

export interface SliderItem {
  _id?: string;
  imageUrl: string;
  altText: string;
  altTextZh?: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  address?: string;
  phone: string;
  email?: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}
