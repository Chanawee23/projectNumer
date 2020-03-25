const Movie = require('../models/movie-model') //เอาไฟล์ movie model มาใช้ พวก text time

createMovie = (req, res) => {  //เรียกไปใช้อีกหน้า
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a movie',
        })
    }

    const movie = new Movie(body)

    if (!movie) {
        return res.status(400).json({ success: false, error: err })
    }

    movie   
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: movie._id,
                message: 'Movie created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Movie not created!',
            })
        })
}

updateMovie = async (req, res) => { 
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Movie.findOne({ _id: req.params.id }, (err, movie) => { //มาจาก put id ของ mongodb ตั้ง เปลี่ยนค่าตรงคำว่า id เป็นน name
        if (err) {
            return res.status(404).json({
                err,
                message: 'Movie not found!',
            })
        }
        movie.name = body.name   //ชื่อที่เราตั้งไว้ ตามด้วย. fx ตรงส่วนนี้คือเปลี่ยนอะไรได้บ้าง *อัพเดตค่าเข้ามองโก
        movie.time = body.time
        movie.rating = body.rating
        movie
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: movie._id,
                    message: 'Movie updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Movie not updated!',
                })
            })
    })
}

deleteMovie = async (req, res) => {
    await Movie.findOneAndDelete({ _id: req.params.id }, (err, movie) => {  //พบแล้วลบเลย 
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!movie) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }

        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getMovieById = async (req, res) => {  //ส่งพาท get ไปหา database เช็คเพื่อรีเทรินค่ากลับ
    await Movie.findOne({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!movie) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getMovies = async (req, res) => {  
    await Movie.find({}, (err, movies) => { //ชื่อต้องตรงกัน  ต้องชื่อเดียวกันกับตรงที่บอกว่าต้องมี s
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!movies.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: movies })
    }).catch(err => console.log(err))
}

module.exports = { //ชื่อฟังก์ชัน ข้างบนถ้าเปลี่ยน ตรงนี้ต้องเปลี่ยนด้วย ชื่อต้องเหมือนกัน
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    getMovies,
}