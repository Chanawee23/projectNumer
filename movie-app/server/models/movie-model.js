const mongoose = require('mongoose')  //แกดาต้าเบส หน้านี้
const Schema = mongoose.Schema

const Movie = new Schema(  
    {
        fx: { type: String, required: false },  //ชื่อ table อะไร  true บังคับ
        XL: { type: String, required: false }, // กล้ามปูสตริง ใส่ชื่อยาวๆได้
        XR: { type: String, required: false },
        N: { type: String, required: false }

    },
    { timestamps: true },
)

module.exports = mongoose.model('movies', Movie)  //movies คือ จะแก้ต้องใส่ s ทุกครั้ง