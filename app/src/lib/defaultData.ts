import { OnePagerData } from "./types";

export const defaultData: OnePagerData = {
  template: "general",

  brand: {
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Company",
    tagline: "Your tagline here",
    email: process.env.NEXT_PUBLIC_DEFAULT_EMAIL || "hello@yourcompany.com",
    phone: process.env.NEXT_PUBLIC_DEFAULT_PHONE || "(555) 123-4567",
    website: process.env.NEXT_PUBLIC_DEFAULT_WEBSITE || "yourcompany.com",
    companyLogoUrl: null,
    customerName: "",
    customerLogoUrl: null,
    showPreparedFor: false,
    primaryColor: "#0A0A0A",
    accentColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
  },

  hero: {
    headline: "Your compelling headline goes here",
    subheadline:
      "A brief description of what you do and why it matters to your customer.",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
  },

  valueProps: {
    columns: [
      {
        icon: "📊",
        title: "Value Proposition 1",
        description: "Describe the key benefit you provide to customers.",
        badge: "Key differentiator",
      },
      {
        icon: "⚡",
        title: "Value Proposition 2",
        description: "Another compelling reason to choose your service.",
        badge: "Fast & reliable",
      },
      {
        icon: "🎯",
        title: "Value Proposition 3",
        description: "The third pillar of value you deliver.",
        badge: "Proven results",
      },
    ],
  },

  pricing: {
    sectionTitle: "Pricing",
    tiers: [
      {
        name: "Starter",
        price: "$99",
        unit: "/month",
        details: "Perfect for small teams",
      },
      {
        name: "Growth",
        price: "$249",
        unit: "/month",
        details: "For scaling businesses",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        unit: "",
        details: "Tailored to your needs",
      },
    ],
    footerNote: "All plans include onboarding and support.",
  },

  team: {
    sectionTitle: "Your Dedicated Team",
    roles: ["Project Lead", "Account Manager", "Technical Support"],
    highlights: [
      "Dedicated point of contact",
      "24/7 support available",
      "Industry expertise",
    ],
  },

  security: {
    sectionTitle: "Security & Trust",
    items: [
      { icon: "🔐", text: "End-to-end encryption" },
      { icon: "💾", text: "SOC 2 compliant" },
      { icon: "📋", text: "NDA included" },
    ],
  },

  cta: {
    text: "Ready to get started? Let's talk.",
    email: process.env.NEXT_PUBLIC_DEFAULT_EMAIL || "hello@yourcompany.com",
    phone: process.env.NEXT_PUBLIC_DEFAULT_PHONE || "(555) 123-4567",
    website: process.env.NEXT_PUBLIC_DEFAULT_WEBSITE || "yourcompany.com",
  },
};
