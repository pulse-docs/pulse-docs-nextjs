import { BoltIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { roboto } from '@/styles/fonts';

export default function AcmeLogo() {
  return (
    <div
      //className={`${roboto.className} flex flex-row items-center leading-none text-white`}
      className={`${roboto.className} flex flex-row items-center leading-none text-white whitespace-nowrap`}
    >
      {/* <BoltIcon className="h-15 w-15 rotate-[15deg]" /> */}
      {/* <p className="text-[44px]">Pulse Docs</p> */}
      <p className="text-4xl">Pulse Docs</p>
    </div>
  );
}
