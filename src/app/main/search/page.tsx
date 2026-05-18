import { Suspense } from "react";
import { SearchContent } from "@/components/search/SearchContent";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}