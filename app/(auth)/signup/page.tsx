import React from "react";
import SignUpCardCom from "../AuthComponents/SignUpCardCom";

const Page: React.FC = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>
        <SignUpCardCom />
      </div>
    </div>
  );
};

export default Page;
