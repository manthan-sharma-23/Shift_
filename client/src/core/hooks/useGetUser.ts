import { useRecoilState } from "recoil";
import { UserAtom } from "../store/atoms/user.atom";
import { useEffect, useState } from "react";
import Server from "../api/api";

const useGetUser = () => {
  const [user, setUser] = useRecoilState(UserAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    new Server().user.get_user().then((meta) => {
      setLoading(false);

      if (meta.id) {
        setUser(meta);
      }
    });
  }, []);

  return { loading, user };
};

export default useGetUser;
