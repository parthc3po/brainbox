import ServiceCard from '@/components/features/ServiceCard';
import SystemStatus from '@/components/features/SystemStatus';

// Internal Activity Modules
const tools = [
  { title: 'Knowledge', url: '/knowledge', description: 'The Library of the Universe.', icon: 'BookOpen' },
  { title: 'Speed Math', url: '/brain/math', description: 'High-velocity arithmetic training.', icon: 'Zap' },
  { title: 'Code Breaker', url: '/brain/code', description: 'Decrypt the 5-letter password.', icon: 'Key' },
  { title: 'Typing Racer', url: '/brain/type', description: 'Measure your data entry speed.', icon: 'Keyboard' },
  { title: 'Pixel Studio', url: '/creative/pixel', description: 'Create 8-bit masterpieces.', icon: 'Palette' },
  { title: 'Family Blog', url: '/creative/blog', description: 'Read and write the daily news.', icon: 'Newspaper' },
  { title: 'Cyber Canvas', url: '/canvas', description: 'Digital drafting table. Draw your bot.', icon: 'Cpu' },
  { title: 'Mind Match', url: '/memory', description: 'Hack the grid. Test your memory.', icon: 'Database' },
  { title: 'Cyber Duel', url: '/tictactoe', description: 'Logic battle against the System A.I.', icon: 'Terminal' },
  { title: 'Vault (Journal)', url: '/creative/journal', description: 'AES Encrypted Personal Logs.', icon: 'Lock' },
  { title: 'Missions', url: '/missions', description: 'Daily objectives and XP tracking.', icon: 'Rocket' },
  { title: 'Chores', url: '/family/chores', description: 'Earn XP by completing daily objectives.', icon: 'CheckSquare' },
  { title: 'The Refrigerator', url: '/family/fridge', description: 'Post notes for the family.', icon: 'StickyNote' },
  { title: 'Voting Booth', url: '/family/voting', description: 'Decide the weekend movie.', icon: 'BarChart' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12 text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">
          BrainBox
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          The central hub for creativity, logic, and family organization.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ServiceCard
            key={tool.title}
            {...tool}
          />
        ))}
      </div>

      <section className="mt-12">
        <div className="bg-muted/20 border border-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-bold font-mono text-primary mb-2">Message of the Day</h3>
          <p className="font-mono text-sm text-foreground">
            {">"} Remember to run your backup protocols today.<br />
            {">"} New mission available: "Operation Python Basics".
          </p>
        </div>
      </section>
    </div>
  );
}
