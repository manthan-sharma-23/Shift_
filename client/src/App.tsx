import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthLayout from "./components/layouts/AuthLayout";
import Signin from "./views/auth/Signin";
import Signup from "./views/auth/Signup";
import { Toaster } from "@/components/ui/sonner";
import RootLayout from "./components/layouts/RootLayout";
import Home from "./views/app/Home";

const App = () => {
  return (
    <div>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/auth/signup" element={<Signup />} />
            </Route>
            <Route path="/app" element={<RootLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
};

export default App;
