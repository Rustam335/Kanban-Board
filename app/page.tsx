import Header from "@/components/Header";
import Board from "@/components/Board";

export default function Home() {
  return (
    <div className="app-backdrop flex h-dvh flex-col overflow-hidden">
      <Header />
      <main className="min-h-0 flex-1">
        <Board />
      </main>
    </div>
  );
}
