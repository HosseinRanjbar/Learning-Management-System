import Image from "next/image";

export const Logo = () => {
  return (
    <div>
      <Image alt="log" src={"/logo.svg"} height={130} width={130} />
    </div>
  );
};
