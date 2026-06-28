import MainApp from '@/MainApp';

// Disable static generation for this dynamic catch-all route
export const dynamic = 'force-dynamic';

export default function CatchAllPage() {
  return <MainApp />;
}
