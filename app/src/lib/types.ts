export interface OnePagerData {
  template: 'general' | 'saas' | 'agency' | 'consulting' | 'blank';

  brand: {
    companyName: string;
    tagline: string;
    email: string;
    phone: string;
    website: string;
    companyLogoUrl: string | null;
    customerName: string;
    customerLogoUrl: string | null;
    showPreparedFor: boolean;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };

  hero: {
    headline: string;
    subheadline: string;
    tags: string[];
  };

  valueProps: {
    columns: ValueProp[];
  };

  pricing: {
    sectionTitle: string;
    tiers: PricingTier[];
    footerNote: string;
  };

  team: {
    sectionTitle: string;
    roles: string[];
    highlights: string[];
  };

  security: {
    sectionTitle: string;
    items: SecurityItem[];
  };

  cta: {
    text: string;
    email: string;
    phone: string;
    website: string;
  };
}

export interface ValueProp {
  icon: string;
  title: string;
  description: string;
  badge: string;
}

export interface PricingTier {
  name: string;
  price: string;
  unit: string;
  details: string;
  highlighted?: boolean;
}

export interface SecurityItem {
  icon: string;
  text: string;
}

export interface SavedVersion {
  id: string;
  createdAt: string;
  customerName: string;
  template: string;
  hasPDF: boolean;
  hasHTML: boolean;
}
