import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchBar } from "@/components/search-bar";
import { Profile } from "@/components/profile";
import Image from "next/image";

type NavbarProps = {
  value?: string;
  user?: { name: string; email: string } | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch?: () => void;
  onClearSearch?: () => void;
  logout?: () => void;
};

export const Navbar = ({
  value,
  user,
  onChange,
  onClearSearch,
  handleSearch,
  logout,
}: NavbarProps) => {
  const pathname = usePathname();
  return (
    <div className="bg-white flex items-center justify-between px-32 py-2 drop-shadow shadow-slate-300">
      <Link
        href={user ? "/dashboard" : "/"}
        className="flex items-center space-x-2"
      >
        <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
        <h2 className="text-xl font-bold text-black py-2">Notes</h2>
      </Link>
      {pathname === "/dashboard" && (
        <>
          <SearchBar
            value={value!}
            onChange={onChange!}
            handleSearch={handleSearch!}
            onClearSearch={onClearSearch!}
          />
          <Profile logout={logout!} user={user!} />
        </>
      )}
    </div>
  );
};
