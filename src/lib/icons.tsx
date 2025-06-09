import {
  LucideIcon,
  LineChart,
  Shield,
  PiggyBank,
  Landmark,
  TrendingUp,
  Activity,
  DollarSign,
  CreditCard,
  HeartHandshake,
  FileText,
  Briefcase,
  Home,
  LayoutGrid,
  UserCircle2,
  LogOut,
  LogIn,
  ShieldCheck,
  Sparkles,
  HelpCircle, // Default icon
  Settings,
  SlidersHorizontal,
  Coins
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LineChart,
  Shield,
  PiggyBank,
  Landmark,
  TrendingUp,
  Activity,
  DollarSign,
  CreditCard,
  HeartHandshake,
  FileText,
  Briefcase,
  Home,
  LayoutGrid,
  UserCircle2,
  LogOut,
  LogIn,
  ShieldCheck,
  Sparkles,
  Settings,
  SlidersHorizontal,
  Coins,
  HelpCircle,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || HelpCircle;
};
