const express = require('express')

const MovieCtrl = require('../controllers/movie-ctrl') //มันคือสั่งไฟล์นั้นๆมาใช้งาน

const router = express.Router()

router.post('/movie', MovieCtrl.createMovie)   //ทำกับดาต้าเบส cerat postคือส่งผ่านตัวโค้ด
router.put('/movie/:id', MovieCtrl.updateMovie)   //ใส่ค่า
router.delete('/movie/:id', MovieCtrl.deleteMovie)  //ลบค่า
router.get('/movie/:id', MovieCtrl.getMovieById)
router.get('/movies', MovieCtrl.getMovies)   //s อารม พาทในการเรียกใช้งาน

module.exports = router