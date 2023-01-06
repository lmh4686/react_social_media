import { getDocs, collection } from "firebase/firestore"
import { db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Post } from "./post";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

const Main = () => {

  const [postsList, setPostsList] = useState<Post[] | null>(null)

  const postsRef = collection(db, "posts")

  const getPosts = async () => {
    const data = await getDocs(postsRef)
    //Get all only info of the docs in db
    setPostsList(data.docs.map(doc => ({...doc.data(), id: doc.id})) as Post[])
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div>
      {postsList?.map((post, k) => (
        <Post key = {k} post={post} />
      ))}
    </div>
  )
}

export default Main