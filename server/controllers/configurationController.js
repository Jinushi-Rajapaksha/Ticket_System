const Configuration = require('../models/configuration');

exports.createConfiguration = async(req,res) => {
    try {
        const config = await Configuration.create(req.body);
        res.status(201).json({success:true, data:config});
    } catch (error) {
        console.error('Error creating configuration:', err);
        res.status(500).json({ success: false, error: 'Server Error' });    }
}

exports.getConfiguration = async(req,res) => {
    try {
        const config = await Configuration.findOne(); 
        res.status(200).json({success:true, data:config})
    } catch (err) {
        console.error('Error retrieving configuration:', err);
        res.status(500).json({ success: false, error: 'Server Error' });    }
}

exports.updateConfiguration = async(req,res) => {
    try {
        const config = await Configuration.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).json({ success: true, data: config });
    } catch (err) {
        console.error('Error updating configuration:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}