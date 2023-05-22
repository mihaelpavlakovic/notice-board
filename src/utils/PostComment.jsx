import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectUserData } from "../store/user/userSlice";
import Modal from "./Modal";

const PostComment = ({ index, itemId, comment, handleCommentDelete }) => {
  const user = useSelector(selectUserData);
  const [display, setDisplay] = useState(false);

  return (
    <div className="w-full bg-gray-100 p-2 sm:px-4 flex gap-3 mb-2">
      {display && (
        <Modal
          type={"comment"}
          isOpen={display}
          index={index}
          itemId={itemId}
          data={comment}
          onClose={() => setDisplay(false)}
        />
      )}
      <img
        className="w-8 h-8 rounded-md mt-1"
        src={comment.user?.photoURL}
        alt="Profilna slika korisnika"
      />
      <div className="w-full">
        <div className="flex items-start flex-nowrap">
          <h3 className="flex-auto font-semibold">
            {comment.user?.displayName}
          </h3>
          <div className="text-xs text-gray-500 text-right">
            <div>{comment.createdAt}</div>
            {user?.uid === comment.user?.uid && (
              <div className="flex gap-2">
                <PencilSquareIcon
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={() => setDisplay(true)}
                />
                <TrashIcon
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={handleCommentDelete}
                />
              </div>
            )}
            {user?.uid !== comment.user?.uid && user?.isAdmin && (
              <div className="flex gap-2">
                <TrashIcon
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={handleCommentDelete}
                />
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-500 mt-1">{comment.value}</p>
      </div>
    </div>
  );
};

export default PostComment;
