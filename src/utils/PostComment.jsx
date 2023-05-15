import React from "react";
import { formatDateTime } from "../helpers/functions";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectUserData } from "../store/user/userSlice";

const PostComment = ({ comments, handleCommentDelete, handleCommentEdit }) => {
  const user = useSelector(selectUserData);

  return (
    <div className="w-full bg-gray-100 p-2 sm:px-4 flex gap-3 mb-2">
      <img
        className="w-8 h-8 rounded-md mt-1"
        src={comments.user.photoURL}
        alt="Profilna slika korisnika"
      />
      <div className="w-full">
        <div className="flex items-start flex-nowrap">
          <h3 className="flex-auto font-semibold">
            {comments.user.displayName}
            {comments.user.isMentor && (
              <span className="text-xs font-normal ml-2 bg-gray-200 px-2 py-1 rounded-full">
                mentor
              </span>
            )}
          </h3>
          <div className="text-xs text-gray-500 text-right">
            <div>{formatDateTime(comments.createdAt)}</div>
            {user.uid === comments.user.uid && (
              <div className="flex gap-2">
                <PencilSquareIcon
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={handleCommentEdit}
                />
                <TrashIcon
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={handleCommentDelete}
                />
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-500 mt-1">{comments.value}</p>
      </div>
    </div>
  );
};

export default PostComment;
