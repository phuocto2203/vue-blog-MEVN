const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const formidable = require("formidable");
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../storages/index");
const fs = require("fs");
const path = require("path");

// @route POST /post/create
// @desc post a new post
// @private access

router.post("/create", verifyToken, async (req, res) => {
  const userId = req.body.userId;

  // upload a new image
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false });
    try {
      const newPost = new Post({
        title: req.body?.title,
        author: req.body?.author,
        category: req.body?.category,
        description: req.body?.description,
        user: userId,
        image: {
          name: req.file?.filename || null,
        },
      });

      await newPost.save();

      return res.status(200).json({ success: true, newPost });
    } catch (error) {
      //Remove uploaded file from server since fail
      if (req.file?.filename) {
        const directoryPath = path.join("uploads") + `/${req.file?.filename}`;
        const isImageExisted = fs.existsSync(directoryPath);
        isImageExisted && fs.unlinkSync(directoryPath);
      }
      res
        .status(500)
        .json({ success: false, message: "Failed to create a post!" });
    }
  });
});

// @route GET /post/get-post-by-id
// @desc Get post by id
// @public access

router.get("/get-post-by-id/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    let postWithImageName = (
      await Post.findById(postId).populate("user", ["fullname", "username"])
    ).toObject();

    //get uploaded image name
    const imageName = postWithImageName.image?.name || null;

    //create a path to read the files on server
    const directoryPath = path.join("uploads");

    // read all uploaded image files, convert those to base64, and return a list of base64 files
    let base64Image = null;
    const isImageExisted = fs.existsSync(directoryPath + `/${imageName}`);
    if (isImageExisted) {
      base64Image = fs.readFileSync(directoryPath + `/${imageName}`, {
        encoding: "base64",
      });
    }

    //add base64 images to the json res
    const postWithBase64Image = {
      ...postWithImageName,
      image: {
        ...postWithImageName.image,
        file: base64Image,
      },
    };

    return res.status(200).json({ success: true, post: postWithBase64Image });
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route GET /post/
// @desc Get all posts
// @public access
// pagination ....?page=2&limit=3
router.get("/", async (req, res) => {
  try {
    let postsWithImageNames = await Post.find()
      .sort({ updatedAt: -1 })
      .populate("user", ["fullname", "username"]);

    //convert mongodb document to javascript object
    postsWithImageNames = postsWithImageNames.map((post) => {
      return post.toObject();
    });

    //get all uploaded image names
    const uploadedImageNames = postsWithImageNames.map((post) => {
      return post.image?.name || null;
    });

    //create a path to read the files on server
    const directoryPath = path.join("uploads");

    // read all uploaded image files, convert those to base64, and return a list of base64 files
    const uploadedBase64Images = uploadedImageNames.map((name, index) => {
      const isImageExisted = fs.existsSync(directoryPath + `/${name}`);
      if (isImageExisted) {
        return fs.readFileSync(directoryPath + `/${name}`, {
          encoding: "base64",
        });
      }
      return null;
    });

    //add base64 images to the json res
    let postsWithBase64Images = [];
    for (let i = 0; i < postsWithImageNames.length; i++) {
      postsWithBase64Images.push({
        ...postsWithImageNames[i],
        image: {
          ...postsWithImageNames[i].image,
          base64File: uploadedBase64Images[i],
        },
      });
    }

    //pagination, search queries and filters...
    let category = req.query?.category || null;
    let title = req.query?.title || null;

    let page = req.query?.page || 0;
    let limit = req.query?.limit || 0;

    let posts = [];
    if ((page <= 0 || limit <= 0) && !category && !title) {
      posts = [...postsWithBase64Images];
      return res.status(200).json({ success: true, posts, page, limit });
    }

    //filter by selecting category & searching title
    if (category && title) {
      let postsWithCategoryFilter = [];
      if (Array.isArray(category)) {
        postsWithBase64Images.forEach((post) =>
          category.forEach((item) => {
            if (
              post.category
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(item.toLowerCase())
            ) {
              postsWithCategoryFilter.push(post);
            }
          })
        );
      }
      if (!Array.isArray(category)) {
        postsWithCategoryFilter = postsWithBase64Images.filter((post) =>
          post.category
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(category.toLowerCase())
        );
      }

      const postsWithCategoryAndTitleFilter = postsWithCategoryFilter.filter(
        (post) => post.title.toLowerCase().includes(title.toLowerCase())
      );

      const totalPosts = postsWithCategoryAndTitleFilter.length;
      const totalPages = Math.ceil(totalPosts / limit);

      if (page > totalPages) {
        page = totalPages;
      }

      let startIndex = limit * (page - 1);
      let endIndex = startIndex + (limit - 1);

      if (endIndex > totalPosts - 1) {
        endIndex = totalPosts - 1;
      }

      for (let i = startIndex; i <= endIndex; i++) {
        posts.push(postsWithCategoryAndTitleFilter[i]);
      }

      return res
        .status(200)
        .json({ success: true, posts, page, limit, totalPages });
    }

    //filter by selecting category
    if (category) {
      let postsWithCategoryFilter = [];
      if (Array.isArray(category)) {
        postsWithBase64Images.forEach((post) =>
          category.forEach((item) => {
            if (
              post.category
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(item.toLowerCase())
            ) {
              postsWithCategoryFilter.push(post);
            }
          })
        );
      }
      if (!Array.isArray(category)) {
        postsWithCategoryFilter = postsWithBase64Images.filter((post) =>
          post.category
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(category.toLowerCase())
        );
      }

      const totalPosts = postsWithCategoryFilter.length;

      const totalPages = Math.ceil(totalPosts / limit);

      if (page > totalPages) {
        page = totalPages;
      }

      let startIndex = limit * (page - 1);
      let endIndex = startIndex + (limit - 1);
      if (endIndex > totalPosts - 1) {
        endIndex = totalPosts - 1;
      }

      for (let i = startIndex; i <= endIndex; i++) {
        posts.push(postsWithCategoryFilter[i]);
      }

      return res
        .status(200)
        .json({ success: true, posts, page, limit, totalPages });
    }

    //filter by searching title
    if (title) {
      const postsWithTitleFilter = postsWithBase64Images.filter((post) =>
        post.title.toLowerCase().includes(title.toLowerCase())
      );
      const totalPosts = postsWithTitleFilter.length;
      const totalPages = Math.ceil(totalPosts / limit);
      let startIndex = limit * (page - 1);
      let endIndex = startIndex + (limit - 1);

      if (endIndex > totalPosts - 1) {
        endIndex = totalPosts - 1;
      }
      for (let i = startIndex; i <= endIndex; i++) {
        posts.push(postsWithTitleFilter[i]);
      }
      return res
        .status(200)
        .json({ success: true, posts, page, limit, totalPages });
    }

    const totalPosts = postsWithBase64Images.length;

    const totalPages = Math.ceil(totalPosts / limit);

    if (page > totalPages) {
      page = totalPages;
    }

    let startIndex = limit * (page - 1);
    let endIndex = startIndex + (limit - 1);

    if (endIndex > totalPosts - 1) {
      endIndex = totalPosts - 1;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      posts.push(postsWithBase64Images[i]);
    }

    return res
      .status(200)
      .json({ success: true, posts, page, limit, totalPages });
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route GET /post/get-posts-by-user
// @desc get all posts that the user create
// @private access
router.get("/get-posts-by-user", verifyToken, async (req, res) => {
  const { userId } = req.body;
  try {
    let postsWithImageNames = await Post.find({ user: userId });
    if (!postsWithImageNames)
      return res.status(200).json({ success: true, posts: [] });

    //convert mongodb document to javascript object
    postsWithImageNames = postsWithImageNames.map((post) => {
      return post.toObject();
    });

    //get all uploaded image names
    const uploadedImageNames = postsWithImageNames.map((post) => {
      return post.image?.name || null;
    });

    //create a path to read the files on server
    const directoryPath = path.join("uploads");

    // read all uploaded image files, convert those to base64, and return a list of base64 files
    const uploadedBase64Images = uploadedImageNames.map((name, index) => {
      const isImageExisted = fs.existsSync(directoryPath + `/${name}`);
      if (isImageExisted) {
        return fs.readFileSync(directoryPath + `/${name}`, {
          encoding: "base64",
        });
      }
      return null;
    });

    //add base64 images to the json res
    let postsWithBase64Images = [];
    for (let i = 0; i < postsWithImageNames.length; i++) {
      postsWithBase64Images.push({
        ...postsWithImageNames[i],
        image: {
          ...postsWithImageNames[i].image,
          base64File: uploadedBase64Images[i],
        },
      });
    }

    //pagination, search queries and filters...
    let category = req.query?.category || null;
    let title = req.query?.title || null;

    let page = req.query?.page || 0;
    let limit = req.query?.limit || 0;

    let posts = [];
    if ((page <= 0 || limit <= 0) && !category && !title) {
      posts = [...postsWithBase64Images];
      return res.status(200).json({ success: true, posts, page, limit });
    }

    //filter by selecting category & searching title
    if (category && title) {
      let postsWithCategoryFilter = [];
      if (Array.isArray(category)) {
        postsWithBase64Images.forEach((post) =>
          category.forEach((item) => {
            if (
              post.category
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(item.toLowerCase())
            ) {
              postsWithCategoryFilter.push(post);
            }
          })
        );
      }
      if (!Array.isArray(category)) {
        postsWithCategoryFilter = postsWithBase64Images.filter((post) =>
          post.category
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(category.toLowerCase())
        );
      }

      const postsWithCategoryAndTitleFilter = postsWithCategoryFilter.filter(
        (post) => post.title.toLowerCase().includes(title.toLowerCase())
      );

      const totalPosts = postsWithCategoryAndTitleFilter.length;
      const totalPages = Math.ceil(totalPosts / limit);

      if (page > totalPages) {
        page = totalPages;
      }

      let startIndex = limit * (page - 1);
      let endIndex = startIndex + (limit - 1);

      if (endIndex > totalPosts - 1) {
        endIndex = totalPosts - 1;
      }

      for (let i = startIndex; i <= endIndex; i++) {
        posts.push(postsWithCategoryAndTitleFilter[i]);
      }

      return res
        .status(200)
        .json({ success: true, posts, page, limit, totalPages });
    }

    //filter by selecting category
    if (category) {
      let postsWithCategoryFilter = [];
      if (Array.isArray(category)) {
        postsWithBase64Images.forEach((post) =>
          category.forEach((item) => {
            if (
              post.category
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(item.toLowerCase())
            ) {
              postsWithCategoryFilter.push(post);
            }
          })
        );
      }
      if (!Array.isArray(category)) {
        postsWithCategoryFilter = postsWithBase64Images.filter((post) =>
          post.category
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(category.toLowerCase())
        );
      }

      const totalPosts = postsWithCategoryFilter.length;

      const totalPages = Math.ceil(totalPosts / limit);

      if (page > totalPages) {
        page = totalPages;
      }

      let startIndex = limit * (page - 1);
      let endIndex = startIndex + (limit - 1);
      if (endIndex > totalPosts - 1) {
        endIndex = totalPosts - 1;
      }

      for (let i = startIndex; i <= endIndex; i++) {
        posts.push(postsWithCategoryFilter[i]);
      }

      return res
        .status(200)
        .json({ success: true, posts, page, limit, totalPages });
    }

    //filter by searching title
    if (title) {
      const postsWithTitleFilter = postsWithBase64Images.filter((post) =>
        post.title.toLowerCase().includes(title.toLowerCase())
      );
      const totalPosts = postsWithTitleFilter.length;
      const totalPages = Math.ceil(totalPosts / limit);
      let startIndex = limit * (page - 1);
      let endIndex = startIndex + (limit - 1);

      if (endIndex > totalPosts - 1) {
        endIndex = totalPosts - 1;
      }
      for (let i = startIndex; i <= endIndex; i++) {
        posts.push(postsWithTitleFilter[i]);
      }
      return res
        .status(200)
        .json({ success: true, posts, page, limit, totalPages });
    }

    const totalPosts = postsWithBase64Images.length;

    const totalPages = Math.ceil(totalPosts / limit);

    if (page > totalPages) {
      page = totalPages;
    }

    let startIndex = limit * (page - 1);
    let endIndex = startIndex + (limit - 1);

    if (endIndex > totalPosts - 1) {
      endIndex = totalPosts - 1;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      posts.push(postsWithBase64Images[i]);
    }

    return res
      .status(200)
      .json({ success: true, posts, page, limit, totalPages });
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route PUT /post/update/:id
// desc update a post
// private access

router.put("/update/:id", verifyToken, async (req, res) => {
  const { userId } = req.body;

  //upload a new image
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false });
    const updatedPost = {
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      description: req.body.description,
      image: {
        name: req.file?.filename || null,
      },
    };

    const updateCondition = { user: userId, _id: req.params.id };
    try {
      //find current post that match the condition to update
      let post = await Post.findOne(updateCondition);
      //User not authorized to update post
      if (!post) {
        //Remove the image file on server storage since fail
        if (req.file) {
          const directoryPath = path.join("uploads") + `/${req.file.filename}`;
          const isImageExisted = fs.existsSync(directoryPath);
          isImageExisted && fs.unlinkSync(directoryPath);
        }

        return res.status(401).json({
          success: false,
          message: "Post not found or user not authorized",
        });
      }

      //Remove the old image file before update in server statorge
      if (post.image?.name) {
        const directoryPath = path.join("uploads") + `/${post.image.name}`;
        const isImageExisted = fs.existsSync(directoryPath);
        isImageExisted && fs.unlinkSync(directoryPath);
      }

      await post.updateOne(updatedPost);

      return res.status(200).json({
        success: true,
        updatedPost,
      });
    } catch (error) {
      //Remove the image file on server storage since fail
      if (req.file) {
        const directoryPath = path.join("uploads") + `/${req.file.filename}`;
        const isImageExisted = fs.existsSync(directoryPath);
        isImageExisted && fs.unlinkSync(directoryPath);
      }
      return res.json(error);
    }
  });
});

// @route DELETE /post/delete/:id
// @desc delete a post
// @private access

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const deleteCondition = { _id: req.params.id, user: req.body.userId };
    const deletedPost = await Post.findOneAndDelete(deleteCondition);

    //User not autorized or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized",
      });

    return res.status(200).json({ success: true, deletedPost });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete a post",
    });
  }
});

module.exports = router;
