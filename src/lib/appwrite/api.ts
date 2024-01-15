import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });
    return newUser;
  } catch (error) {
    console.log("Error Comes From CreateUser()", error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log("Error Comes From saveUserToDB()", error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log("Error Comes From sigInAccount()", error);
    return error;
  }
}

export async function getCurrentAccount() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log("Error Comes From getCurrentAccount()", error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log("Error Comes From SignOut()", error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadeFile(post.file[0]);
    console.log(uploadedFile);
    if (!uploadedFile) throw Error;
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //create Post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log("Error Comes From createPost()", error);
  }
}

export async function uploadeFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log("Error Comes From UpLoadeFile()", error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    if (!fileUrl) {
      throw Error;
    }
    return fileUrl;
  } catch (error) {
    console.log("Error Comes From getFilePreview()", error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log("Error Comes From deleteFile()", error);
  }
}

export function getRecentPosts() {
  try {
    const posts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log("Error Comes From getRecentPosts()", error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log("Error Comes From likePost()", error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log("Error Comes From savePost()", error);
  }
}

export async function deleteSavedPost(savedPostId: string) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedPostId
    );

    return { status: "Deleted" };
  } catch (error) {
    console.log("Error Comes From savePost()", error);
  }
}

export async function getPostById(postId?: string) {
  if (!postId) throw Error;
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );
    if (!post) throw Error;
    return post;
  } catch (error) {
    console.log("Error Comes From getPost()", error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadeFile(post.file[0]);
      if (!uploadedFile) throw Error;
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //Update Post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatePost) {
      await deleteFile(image.imageId);
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log("Error Comes From createPost()", error);
  }
}

export async function deleltePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;
  try {
    const deleted = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );
    if (!deleted) throw Error;
    return { status: "Ok" };
  } catch (error) {
    console.log("Error Comes From deletePost()", error);
  }
}

export async function getInfinitPosts({ pageParam }: { pageParam: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(20)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log("Error Comes From getInfinitPosts()", error);
  }
}
export async function getSearchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log("Error Comes From getSearchPosts()", error);
  }
}

export async function getSavedPosts() {
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    if (!savedPosts) throw Error;
    return savedPosts;
  } catch (error) {
    console.log("Error comes from getSavedPosts()", error);
  }
}

export async function getAllUsers() {
  try {
    const users = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    if (!users) throw Error;
    return users;
  } catch (error) {
    console.log("Error comes from getAllUser()", error);
  }
}

export async function getUserById(userId?: string) {
  if (!userId) throw Error;
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );
    if (!user) throw Error;
    return user;
  } catch (error) {
    console.log("Error Comes From getUserById()", error);
  }
}

export async function uploadProfileFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.usersAvatarsId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log("Error Comes From uploadProfileFile()", error);
  }
}

export function getProfileFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.usersAvatarsId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    if (!fileUrl) {
      throw Error;
    }
    return fileUrl;
  } catch (error) {
    console.log("Error Comes From getProfileFilePreview()", error);
  }
}

export async function deleteProfileFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.usersAvatarsId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log("Error Comes From deleteFile()", error);
  }
}

export async function updateProfile(profile: IUpdateUser) {
  const hasFileToUpdate = profile.file.length > 0;
  try {
    let image = {
      imageUrl: profile.imageUrl,
      imageId: profile.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadProfileFile(profile.file[0]);
      if (!uploadedFile) throw Error;
      const fileUrl = getProfileFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteProfileFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //Update Profile
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      profile.userId,
      {
        name: profile.name,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        bio: profile.bio,
      }
    );
    if (!updatePost) {
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log("Error Comes From updateProfile()", error);
  }
}
