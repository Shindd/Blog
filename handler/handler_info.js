console.log('Loading handler_info.js ...');

var handler_info = [
    {file:'./authUser', method:'login'},
    {file:'./addUser', method:'signup'},
    {file:'./addGroup', method:'makegroup'},
    {file:'./getGrouplist', method:'getGrouplist'},
    {file:'./getCategorylist', method:'getCategorylist'},
    {file:'./getArticles', method:'getArticles'},
    {file:'./addCategory', method:'makeCategory'}
]

module.exports = handler_info;