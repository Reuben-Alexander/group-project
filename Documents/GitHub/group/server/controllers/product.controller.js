import Product from '../models/product.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import formidable from 'formidable';

const create = (req, res) => {
  let form = formidable({ keepExtensions: true });
  form.parse(req, async (err, fields, files) => {

    console.log('Fields:', fields);

    const name = Array.isArray(fields.name) ? fields.name.join('') : fields.name;
    const description = Array.isArray(fields.description) ? fields.description.join('') : fields.description;

    let product = new Product({
      name: name,
      description: description
    });
    console.log(req);
    product.owner = req.profile;
    try {
      let result = await product.save();
      res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
  });
};


const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id).populate('owner', '_id').exec()
    if (!product)
      return res.status('400').json({
        error: "Product not found"
      })
    req.product = product
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve product"
    })
  }
}

const read = (req, res) => {
  return res.json(req.product)
}

const update = (req, res) => {
  let form = formidable({ keepExtensions: true })
  form.parse(req, async (err, fields, files) => {
    Object.keys(fields).forEach(key => fields[key] = fields[key][0])
    Object.keys(files).forEach(key => files[key] = files[key][0])
    let product = req.product
    console.log(product)
    console.log('Fields:', fields);
    product = extend(product, fields)
    console.log(product)
    product.updated = Date.now()
    try {
      let result = await product.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let product = req.product
    let deletedProduct = await Product.deleteOne({ _id: product._id })
    res.json(deletedProduct)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByOwner = async (req, res) => {
  try {
    let products = await Product.find({ owner: req.profile._id }).populate('owner', '_id')
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isOwner = (req, res, next) => {
  const isOwner = req.product && req.auth && req.product.owner._id == req.auth._id
  if (!isOwner) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  create,
  productByID,
  listByOwner,
  read,
  update,
  isOwner,
  remove
}
