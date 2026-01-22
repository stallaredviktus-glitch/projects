export interface Project {
  id: string;
  title: string;
  emoji: string;
  gradient: string;
  year: number;
  category: 'backend' | 'ml' | 'frontend' | 'fullstack' | 'devops';
  role: string;
  description: string;
  highlights: string[];
  tags: string[];
  metrics?: {
    label: string;
    value: string;
  };
}

export interface Skill {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  percent: number;
  detail: string;
  color: string;
  years: number;
  tools: string[];
  highlights: string[];
  category: 'languages' | 'frameworks' | 'ml' | 'devops' | 'tools';
}

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
