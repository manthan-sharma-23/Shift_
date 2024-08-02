import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAtom } from "@/core/store/atoms/user.atom";
import { useRecoilValue } from "recoil";

const ListWorkSpaces = () => {
  const user = useRecoilValue(UserAtom);
  return (
    <div className="w-full h-full">
      <Select defaultValue={user?.id}>
        <SelectTrigger className="w-full bg-primary-dark border-white/70 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent className="bg-primary-dark text-white">
          <SelectItem value={user?.id!} className="hover:bg-primary-light/70">
            {user?.name}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ListWorkSpaces;
