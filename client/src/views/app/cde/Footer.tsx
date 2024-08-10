import { useSearchParams } from "react-router-dom";

const Footer = () => {
  const [path] = useSearchParams();
  if (!path) return;

  const file = path.get("path")?.split("/");
  return (
    <div className="flex items-center justify-start px-3 h-full w-full text-gray-400">
      <div className=" text-[.8rem] font-poppins flex items-center justify-start gap-1 text-blue-400">
        <p>{">>"}</p>
        {file &&
          file.map((name, index) => (
            <p className="h-full flex items-center " key={index}>
              {name} {">"}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Footer;
