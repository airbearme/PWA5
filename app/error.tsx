"use client";

export const dynamic = "force-dynamic";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>Please try again later.</p>
      </div>
    </div>
  );
}


