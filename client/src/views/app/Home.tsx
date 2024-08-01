import { UserAtom } from "@/core/store/atoms/user.atom";
import { useRecoilValue } from "recoil";

const Home = () => {
  const user = useRecoilValue(UserAtom);
  return <div>{JSON.stringify(user)}</div>;
};

export default Home;
