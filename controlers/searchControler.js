const Post = require('../models/post')
const Flash = require('../utils/Flash')

exports.searchGetResult = async function (req, res, next) {
    let term = req.query.term

    let itemPerPage = 1
    let currentPage = parseInt(req.query.page) || 1

    try {

        let posts = await Post.find(
            {
                $text:
                {
                    $search: term,
                }
            }
        )
            .skip((currentPage * itemPerPage) - itemPerPage)
            .limit(itemPerPage)


        let totalPost = await Post.countDocuments(
            {
                $text:
                {
                    $search: term,
                }
            }
        )

        let totalPage = totalPost / itemPerPage

        res.render('pages/explorer/search',{
            title:`Search for ${term}`,
            flashMessage: Flash.getFlashMessage(req),
            searchText: term,
            currentPage,
            totalPage,
            posts
        })



    } catch (e) {
        console.log(e);
        next(e)
    }
}