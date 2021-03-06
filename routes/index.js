'use strict';

const express = require('express');
const router = express.Router();
const db = require("./model/db.js");
const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectID;



router.get("/", function (req, res, next) {
    db.getAllCount("liuyanben",function(count){
        res.render("index",{
            "pageamount" : Math.ceil(count / 20)
        });
    });
});

//读取所有留言，这个页面是供Ajax使用的
router.get("/du", function (req, res, next) {
    //可以接受一个参数
    var page = parseInt(req.query.page);

    db.find("liuyanben",{},{"sort":{"shijian":-1},"pageamount":20,"page":page},function(err,result){
        res.json({"result":result});
    });
});

//处理留言
router.post("/tijiao", function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {
        //写入数据库
        db.insertOne("liuyanben", {
            "xingming" : fields.xingming,
            "liuyan" : fields.liuyan,
            "shijian" : new Date()
        }, function (err, result) {
            if(err){
                res.send({"result":-1}); //-1是给Ajax看的
                return;
            }
            res.json({"result":1});
        });
    });
});


//删除
router.get("/shanchu",function(req,res,next){
    //得到参数
    var id = req.query.id;
    db.deleteMany("liuyanben",{"_id":ObjectId(id)},function(err,result){

        res.redirect("/");
    });
})



router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.all('/tunnel', require('./tunnel'));

module.exports = router;