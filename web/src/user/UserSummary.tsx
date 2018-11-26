import React from "react";
import { UserType } from "../interfaces";
import Gravatar from "react-gravatar";

const UserSummary = ({ user }: { user: UserType }) => {
  console.log({ user });
  return (
    <div className="max-w w-full lg:flex p-1 border-r bg-blue-lightest border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light ">
      <Gravatar className="w-32 h-32 rounded" md5={user.gravatar} />
      <div className="lg:w-64 bg-blue-lightest p-4 flex flex-col justify-between leading-normal">
        <h1 className="text-black font-bold text-xl mb-2">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-grey-darker text-base">PUT STUFF</p>
      </div>
    </div>
  );
};

export default UserSummary;
