const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const e = require('express');
const { default: mongoose } = require('mongoose');
//const studentSchema = require('../schemas/studentSchema');
router.use(express.json());
var mongo = require('mongodb').MongoClient;
var url = "mongodb+srv://CalebZhang:Zhangkeyuan333@cluster0.lb38qs6.mongodb.net/?retryWrites=true&w=majority";



router.post('/seeCourseRatings', bodyParser.json(), async (req, res) => {
    var key = req.body.course;
    var ids = [];
    var student;
    var name;
    var names = [];
    mongo.connect(url, async(err, db) => {
        if (err){
          res.json({ 'result': 0, 'message': 'Error.' });
          res.end();
          return;
        }
        var db1 = db.db("ShortCut");
        db1.collection('Rating').find({"course":{ $eq: key }}).toArray(async (err,ratings) =>{
            if (err){
                res.json({ 'result': 0, 'message': 'Error.' });
                res.end();
                return;
            }
            for(const rating of ratings){
                ids.push(mongoose.Types.ObjectId(rating.comment));
                student = await db1.collection('Student').findOne({"email.data": { $eq: rating.email}});
                if(student == null){
                    name = "deleted user";
                }
                else{
                    name = student.name.data;
                }
                names.push(name);
            }
            db1.collection('Comment').find({"_id":{ $in: ids }}).toArray((err,comments) =>{
                if (err){
                    res.json({ 'result': 0, 'message': 'Error.' });
                    res.end();
                    return;
                }
                res.json({ 'result': 1, 'ratings': ratings, 'comments': comments, 'names': names, 'message': 'returning course ratings.' });
                res.end(); 

                db.close();
                
            });

        });
        
    });

});
module.exports = router;