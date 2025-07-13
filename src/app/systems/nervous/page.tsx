import Link from "next/link";

export default function NervousSystemPage() {
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Nervous System</h1>
      <p className="mb-4">
        These herbs support the nervous system — calming, balancing, or toning neural pathways.
      </p>
      <ul className="list-disc ml-6">
        <li>
          <Link href="/herbs/lemon-balm" className="text-blue-600 underline">
            Lemon Balm
          </Link>
        </li>
      </ul>
    </main>
  );
}
