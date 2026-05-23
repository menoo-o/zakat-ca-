import { getMarketData } from "@/lib/getMarketData";

export default async function HomePage() {
  const data = await getMarketData();

  return (
    <main>
      <h1>Market Data</h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}