'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { isCareerAcceptingApplications } from '@/lib/applicationUtils';
import CareerApplicationModal from './CareerApplicationModal';

export default function CareerApplicationTrigger({ career }) {
  const [open, setOpen] = useState(false);
  const canApply = isCareerAcceptingApplications(career);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (canApply) {
            setOpen(true);
          }
        }}
        disabled={!canApply}
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
          canApply
            ? 'bg-[linear-gradient(135deg,#6030C6_0%,#7A45E5_55%,#FF8626_120%)] text-white shadow-[0_12px_25px_rgba(96,48,198,0.22)] hover:shadow-[0_16px_32px_rgba(96,48,198,0.28)]'
            : 'cursor-not-allowed border border-[#E5DAF8] bg-[#F5F1FC] text-[#8D83A2]'
        }`}
      >
        {canApply ? 'Apply Now' : 'Applications Closed'}
        {canApply ? <ArrowRight className="h-4 w-4" /> : null}
      </button>

      <CareerApplicationModal
        career={career}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
