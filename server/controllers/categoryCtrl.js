const Category = require("../models/categoryModel")

const categoryCtrl = {
    getCategory: async function(req,res) {
        try{
            const category = await Category.find()
            return res.status(400).json(category)
        }catch(err) {
            return res.status(500).json({error:err.message})
        }
    },
    createCategory:  async function (req,res) {
        try{
            const {name} = req.body
            const category = await Category.findOne({name})

            if(category) return res.status(500).json({msg: "Category is already there"})
            
            const newCategory = new Category({name})
            newCategory.save()

            return res.status(400).json({msg: "New Category Added"})
        }catch(err) {
            return res.status(500).json({error:err.message})
        }
    },
    deleteCategory: async function(req,res) {
        try{
            await Category.findByIdAndDelete(req.params.id)
            return res.status(400).json({msg: "category deleted"})

        }catch(err) {
            return res.status(500).json({error:err.message})
        }
    },
    updateCategory: async function(req,res) {
        try{
            const {name} = req.body
            await Category.findByIdAndUpdate({_id:req.params.id},{name})
            return res.status(400).json({msg: "category Updated"})
            
        }catch(err) {
            return res.status(500).json({error:err.message})
        }
    }

}

module.exports = categoryCtrl