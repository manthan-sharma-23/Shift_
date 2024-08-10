import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthLayout from "./components/layouts/AuthLayout";
import Signin from "./views/auth/Signin";
import Signup from "./views/auth/Signup";
import RootLayout from "./components/layouts/RootLayout";
import Home from "./views/app/Home";
import Projects from "./views/app/Projects/Projects";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Editor from "./views/app/cde/Editor";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="/auth/signin" element={<Signin />} />
                <Route path="/auth/signup" element={<Signup />} />
              </Route>
              <Route path="/app" element={<RootLayout />}>
                <Route path="/app" element={<Home />}>
                  <Route path="/app/projects" element={<Projects />} />
                </Route>
                <Route path="/app/project/:projectId" element={<Editor />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </QueryClientProvider>
    </div>
  );
};

export default App;
