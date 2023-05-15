import React, { useEffect } from "react";

// component imports
import Nav from "../layouts/Nav";
import { useDispatch, useSelector } from "react-redux";
import {
  selectError,
  selectPosts,
  selectStatus,
} from "../store/post/postSlice";
import { fetchPosts } from "../store/post/postActions";
import Card from "../utils/Card";
import { selectUserData } from "../store/user/userSlice";
import Post from "../utils/Post";

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const user = useSelector(selectUserData);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Ucitavanje objava...</div>;
  }

  if (status === "failed") {
    return <div>Greska: {error}</div>;
  }

  return (
    <>
      <Nav />
      <div className="xl:max-w-7xl xl:mx-auto max-w-full px-5 sm:px-[8%]">
        <h1 className="text-3xl my-5 font-semibold">
          Pozdrav {user?.displayName}
        </h1>
        {posts?.map(post => (
          <Card key={post.id}>
            <Post postData={post} />
          </Card>
        ))}
      </div>
    </>
  );
};

export default Feed;
