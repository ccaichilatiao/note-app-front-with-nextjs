import { Button } from "@/components/ui/button";

import { getInitials } from "@/lib/utils";

interface ProfileInfoProps {
  user: { name: string; email: string };
  logout: () => void;
}
export const Profile = ({ user, logout }: ProfileInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 ">
        {getInitials(user.name)}
      </div>
      <p className="text-sm font-medium">{user.name}</p>
      <Button className="" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};
