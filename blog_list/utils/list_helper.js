const _ = require("lodash")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    likes = blogs.map(x => x.likes)
    const reducer = (sum, item) => {
        return sum + item
    }

    return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
    let mostIndex = 0
    likes = blogs.map(x => x.likes)
    const reducer = (most, item, index) => {
        if (item > most) {
            mostIndex = index
            return item
        }
        else return most
    }
    likes.reduce(reducer, 0)
    return blogs[mostIndex]
}

const mostBlog = (blogs) => {
    let grouped = _.reduce(blogs, (result, blog) => {

        (result[blog.author] || (result[blog.author] = [])).push(blog);
        return result;
    }, {});
    let keys = _.keys(grouped)
    let values = _.values(grouped)
    let mostBlogsIndex = 0
    let numberOfBlogs = 0 //this will contain the number of blogs of the author with most blogs
    for (let i = 0; i < values.length; i++) {
        if (values[i].length > mostBlogsIndex) {
            mostBlogsIndex = i
            numberOfBlogs = values[i].length
        }
    }
    return {
        'author': keys[mostBlogsIndex],
        'blogs': numberOfBlogs
    }
}

const mostLikes = (blogs) => {
    let grouped = _.reduce(blogs, (result, blog) => {

        (result[blog.author] || (result[blog.author] = [])).push(blog);
        return result;
    }, {});
    let keys = _.keys(grouped)
    let values = _.values(grouped)
    let mostLikedIndex=0
    let numberOfLikes=0
    for (let i = 0; i < values.length; i++) {
        let totalLikes = values[i].map(x=> x.likes).reduce((total,item)=>{
            return total+item
        },0) 
        if(totalLikes>numberOfLikes) {
            numberOfLikes=totalLikes
            mostLikedIndex=i
        }
    }

    return {
        'author': keys[mostLikedIndex],
        'likes': numberOfLikes
    }

}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlog,
    mostLikes
}