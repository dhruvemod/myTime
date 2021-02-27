const express = require('express');

const router = express.Router();
const Project = require('../../models/Projects');
const ProjectFeatures = require('../../models/ProjectFeatures');

// Get request to get all the requests
router.get('/',  async (req, res) => {
   try{
        const project = await Project.find().populate('projectFeatures');
        res.json(project);
   }catch(err){
       res.json({msg: err});
   }
});

// Get Request to fetch a single project
router.get('/:id', async (req, res) => {
    try{
        const project = await Project.findById(req.params.id).populate('projectFeatures');
        res.json(project);
    }catch(err){
        res.json({msg: err});
    }
});

// Post request
router.post('/', async (req, res) => {
    console.log(req.body);
    const project = new Project(
        {
            title: req.body.title,
            description: req.body.description
        }
    );
    
    try{
        const savedProject = await project.save();
        res.json(savedProject);
    }
    catch (err){
        res.json({msg: err});
    }
});

// Update a project
router.patch('/:id', async (req, res)=>{
   var updatedProject = req.body;
   try{
        const updated =await Project.findByIdAndUpdate({_id: req.params.id}, updatedProject ); 
        res.json(updated);
   }catch(err){
       res.json({msg:err});
   }
});


// Delete a project

router.delete('/:id', async (req, res) => {
    try{
        const removedProject = await Project.deleteOne({_id: req.params.id});
        res.json(removedProject);
    }catch(err){
        res.json({msg: err});
    }
});

// Create a feature for the project

router.post('/:id/features', async (req, res) => {
    const feature = req.body;
    const { id } = req.params;
    const newFeature = await ProjectFeatures.create(feature);

    const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
            $push: {projectFeatures: newFeature._id}
        }
    );
res.json(updatedProject);
});


//Get All the project features

router.get('/:id/features', async (req, res) => {
    try{
        const foundFeature = await Project.find({_id :req.params.id}).populate("projectFeatures");
        res.json(foundFeature);
    }catch(err){
        res.json({msg:err});
    }
});

module.exports = router;
