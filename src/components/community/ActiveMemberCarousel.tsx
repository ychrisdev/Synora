import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { paginateMembers, getTotalPages, paginationLabel } from "@/lib/community/type";
import type { Member } from "@/lib/community/data";

type ActiveMembersCarouselProps = {
  members: Member[];
  page: number;
  onPrev: () => void;
  onNext: () => void;
  onGoToPage: (page: number) => void;
};

export function ActiveMembersCarousel({
  members,
  page,
  onPrev,
  onNext,
  onGoToPage,
}: ActiveMembersCarouselProps) {
  const totalPages = getTotalPages(members);
  const visible = paginateMembers(members, page);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-text-primary">Thành viên tích cực</h2>
          <span className="text-[11px] text-text-muted">
            {paginationLabel(page, members.length)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Page dots */}
          <div className="flex gap-1 mr-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onGoToPage(i)}
                aria-label={`Trang ${i + 1}`}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  i === page ? "w-4 bg-primary" : "w-1.5 bg-surface-200 hover:bg-primary/30"
                )}
              />
            ))}
          </div>

          <button
            onClick={onPrev}
            disabled={page === 0}
            aria-label="Trang trước"
            className={clsx(
              "p-1.5 border border-surface-200 rounded-[7px] transition-colors",
              page === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-surface-100 text-text-secondary cursor-pointer"
            )}
          >
            <ChevronLeft size={14} />
          </button>

          <button
            onClick={onNext}
            disabled={page === totalPages - 1}
            aria-label="Trang sau"
            className={clsx(
              "p-1.5 border border-surface-200 rounded-[7px] transition-colors",
              page === totalPages - 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-surface-100 text-text-secondary cursor-pointer"
            )}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {visible.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-xl border border-surface-200 shadow-card px-3 py-4 flex flex-col items-center text-center gap-1.5 card-hover"
          >
            <Avatar initials={member.initials} color={member.color} size="lg" shape="circle" />
            <p className="text-xs font-bold text-text-primary w-full truncate">{member.name}</p>
            <p className="text-[10px] font-semibold text-primary">{member.role}</p>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span>{member.docs} tài liệu</span>
              <span className="w-px h-2.5 bg-surface-200" />
              <span>{member.followers} theo dõi</span>
            </div>
            <button className="w-full mt-1 py-1.5 text-[11px] font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary-50 transition-colors hover:cursor-pointer">
              Theo dõi
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}