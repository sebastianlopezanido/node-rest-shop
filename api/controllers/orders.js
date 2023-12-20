const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.order_get_all = (req,res,next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/orders/'+ doc._id
                    }
                }
            })
            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.order_create = (req,res,next) => {
    Product.findById(req.body.productId)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order
        .save()
    } )
    .then(result =>{
        res.status(201).json({
            message: 'Created order succesfully',
            createdOrder: {
                product: result.product,
                quantity: result.quantity,
                _id: result._id,
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/orders/'+result._id
                }
            }
        });
    } )
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    });
   
}

exports.order_get_one = (req,res,next)=>{
    const id = req.params.orderId;
    Order.findById(id)
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(doc=> {
        if(doc){
            res.status(200).json({
                order: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}) ;
    });
}

exports.order_update = (req,res,next)=>{
    res.status(200).json({
        message : 'Updated order!',
        orderId : req.params.orderId
    });
}

exports.order_delete = (req,res,next)=>{
    const id = req.params.orderId;
    Order.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {product: 'ID', quantity: 'Number'}
            }

        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}