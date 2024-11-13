const Product = require('../models/productsModel')

class APIFeatures{
    constructor(query,queryString){
        this.query = query
        this.queryString = queryString
    }

    filtering(){
        let queryObj = {...this.queryString}
        console.log(queryObj)
        const excludedFields = ['page','sort','limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);

        this.query.find(JSON.parse(queryStr))

        return this
    }

    sorting(){
        try {
            if(this.queryString.sort){
                const sortBy = this.queryString.sort.split(',').join(' ')
                this.query = this.query.sort(sortBy)
                console.log(sortBy)
            }
        }catch(err) {
            this.query = this.query.sort('-createdAt')
        }

        return this

    }

    pagination(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)

        return this

    }
}

const productCtrl = {
    getProduct:async (req,res) => {
        try{
            console.log(req.query)
            const features = new APIFeatures(Product.find(),req.query).filtering().sorting().pagination()
            const products = await features.query
            res.json(products) 

        }catch(err) {
            return res.status(500).json({mssg:err.message})
        }
    },
    createProduct:async (req,res) => {
        try{
            const {product_id,
            title,
            price,
            description,
            content,
            images,
            category} = req.body

            if(!images) return res.status(500).json({message:'No image uploaded'})

            const product = await Product.findOne({product_id})

            if(product) return res.status(500).json({message:'product already exists'})

            const newProduct = new Product({
                product_id,
                title:title.toLowerCase(),
                price,
                description,
                content,
                images,
                category  
            })

            await newProduct.save()

            res.json({msg:"Created a product"})

        }catch(err) {
            return res.status(500).json({mssg:err.message})
        }
    },
    deleteProduct:async (req,res) => {
        try{
            await Product.findByIdAndDelete(req.params.id)
            res.json({msg:"Deleted a product"})

        }catch(err) {
            return res.status(500).json({mssg:err.message})
        }
    },
    updateProduct:async (req,res) => {
        try{
            const {
                title,
                price,
                description,
                content,
                images,
                category} = req.body

                if(!images) return res.status(500).json({msg:"No image uploaded"})

                await Product.findByIdAndUpdate({_id:req.params.id}, {
                    title:title.toLowerCase(),price,description,content,category
                })

                res.json({msg:"Updated a product"})

        }catch(err) {
            return res.status(500).json({mssg:err.message})
        }
    }
}

module.exports = productCtrl