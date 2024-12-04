import Link from 'next/link'
import { Button } from '@/app/components/dashboard/common/button';
export function ViewCase({ id }: { id: string }) {

  return (
    <Link href={`/dashboard/inspect/${id}`} className="flex items-center mt-4 w-full">
        <Button className="w-full flex justify-center font-bold text-base sm:text-sm md:text-base text-justify">View</Button>
    </Link>
  );
}