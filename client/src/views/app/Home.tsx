import AppBar from "@/components/components/appbar/AppBar";
import { UserAtom } from "@/core/store/atoms/user.atom";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";

const Home = () => {
  const user = useRecoilValue(UserAtom);

  if (!user?.email) {
    return <div>Please Login using email first /auth/signin</div>;
  }
  return (
    <div className="h-full w-full bg-dark flex">
      <div className="w-[20vw] h-full bg-primary-dark">
        <AppBar />
      </div>
      <div className=" w-[80vw] h-full bg-primary-light">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
