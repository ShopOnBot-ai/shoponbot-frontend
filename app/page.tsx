"use client"

import { Footer } from "./_components/Footer";
import { Products } from "./_components/Products";

export default function Home() {
  
  return (
    <>
      <main className="flex flex-1 flex-col px-8 my-5">
        <Products />
      </main>
      <Footer />
    </>
  );
}
