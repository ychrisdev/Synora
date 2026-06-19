import { useEffect, useRef } from "react";

export function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  cb: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

export function useOutsideClickRefs(
  refs: React.RefObject<HTMLElement | null>[],
  cb: () => void,
) {
  const refsRef = useRef(refs);
  refsRef.current = refs;
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInside = refsRef.current.some(
        (r) => r.current && r.current.contains(target),
      );
      if (!isInside) cbRef.current();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
}
