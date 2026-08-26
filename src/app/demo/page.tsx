import type { Metadata } from "next";
import { CatalogClient } from "@/components/demo/catalog-client";

export const metadata: Metadata = {
  title: "Wedding Studio — Choose a Design",
  description: "Six switchable bilingual wedding design themes.",
};

export default function DemoCatalogPage() {
  return <CatalogClient />;
}
