// Operations types (migrated from existing project)
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  address: string;
  email: string;
}

export interface JobCheck {
  index: number;
  checked: boolean;
  dateTime: string | null;
}

export interface InvoiceCheck {
  checked: boolean;
  date: string | null;
  invoiceId: string | null;
}

export interface WorkEntry {
  contactId: string;
  date: string;
  mowing: boolean;
  contracting: boolean;
  description?: string;
  jobChecks: JobCheck[];
  invoiceCheck: InvoiceCheck;
  smsSentForCycle: boolean;
}

export interface LineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  invoiceId: string;
  contactId: string;
  createdDate: string;
  headline?: string;
  lineItems: LineItem[];
  totalAmount: number;
  sent: boolean;
  sentAt: string | null;
  contractingNotes?: string;
}

export interface CalendarJob {
  id: number;
  contactId: string;
  date: string;
  description?: string;
  status: string;
}

export interface ZoneNote {
  contactId: string;
  notes: string;
}

export interface HistoryRecord {
  type: string;
  contactId: string;
  date: string;
  label: string;
  timestamp: string;
  invoiceId?: string;
}

// Website types (new)
export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  icon_name: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_location: string | null;
  content: string;
  rating: number | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  status: string;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_id: number | null;
  preferred_date: string | null;
  preferred_time: string | null;
  address: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface DashboardData {
  totalContacts: number;
  mowingClients: number;
  contractingClients: number;
  pendingBookings: number;
  unreadMessages: number;
  totalBlogPosts: number;
  todayEntries: WorkEntry[];
  contacts: Contact[];
}
