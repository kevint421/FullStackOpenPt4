const dummy = (blogs) => {
    return 1;
  };
  
  const totalLikes = (blogs) => {
    const likes = blogs.reduce((sum, blog) => {
      return sum + blog.likes;
    }, 0);
    return likes;
  };
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
    const topBlog = blogs.find((blog) => blog.likes === maxLikes);
  
    return {
      title: topBlog.title,
      author: topBlog.author,
      likes: topBlog.likes,
    };
  };
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    const blogCountByAuthor = blogs.reduce((countMap, blog) => {
      countMap[blog.author] = countMap[blog.author] ? countMap[blog.author] + 1 : 1;
      return countMap;
    }, {});
  
    const maxBlogs = Math.max(...Object.values(blogCountByAuthor));
    const topAuthor = Object.keys(blogCountByAuthor).find(
      (author) => blogCountByAuthor[author] === maxBlogs
    );
  
    return {
      author: topAuthor,
      blogs: maxBlogs,
    };
  };

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    const likesByAuthor = blogs.reduce((likesMap, blog) => {
      likesMap[blog.author] = likesMap[blog.author] ? likesMap[blog.author] + blog.likes : blog.likes;
      return likesMap;
    }, {});
  
    const maxLikes = Math.max(...Object.values(likesByAuthor));
    const topAuthor = Object.keys(likesByAuthor).find(
      (author) => likesByAuthor[author] === maxLikes
    );
  
    return {
      author: topAuthor,
      likes: maxLikes,
    };
  };
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  };
  
  
  
  
  
  
  