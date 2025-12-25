import Link from 'next/link';
import { ExternalLink, Terminal, Code, Database, Book, BookOpen, Clipboard, Cpu, Lock, Rocket, Zap, Key, Keyboard, Palette, Newspaper, CheckSquare, StickyNote, BarChart } from 'lucide-react';

const icons = {
  Terminal,
  Code,
  Database,
  Book,
  BookOpen,
  Clipboard,
  Cpu,
  ExternalLink,
  Lock,
  Rocket,
  Zap,
  Key,
  Keyboard,
  Palette,
  Newspaper,
  CheckSquare,
  StickyNote,
  BarChart
};

export default function ServiceCard({ title, url, icon = "ExternalLink", description }) {
  const Icon = icons[icon] || icons.ExternalLink;

  return (
    <Link href={url} className="block group h-full">
      <div className="h-full bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
        <div className="p-4 bg-primary/10 text-primary rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </Link>
  );
}
