const express = require('express');
const router = express.Router();
const Project = require('../../models/Projects');
const ProjectFeatures = require('../../models/ProjectFeatures');


// Get a single feature
router.get('/:projectId/features/:id', async (req, res)=>{
    try{
        const feature = await ProjectFeatures.findById({_id:req.params.id});
        res.json(feature);
    }catch(err){
        res.json({msg: err});
    }
});

//Get All the project features

router.get('/:id/features', async (req, res) => {
    const projectId = req.params.id;
    try{
        const foundFeature = await ProjectFeatures.find({ownerProject: projectId});
        res.json(foundFeature);
    }catch(err){
        res.json({msg:err});
    }
});

// Delete a feature
router.delete('/:projectId/features/:featureId', async (req, res) => {
    try{
        const projectId= req.params.projectId;
        const featureId = req.params.featureId;
        
        const deletedFeature = await ProjectFeatures.findOneAndDelete({_id:featureId});
 
        // Deleting the feature link from the Project document
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: {projectFeatures: deletedFeature._id}
            }
        );
        


        res.json(updatedProject);
    }catch(err){
        res.json({msg:err});
    }
});

// Update any feature
router.patch('/:projectId/features/:featureId', async (req, res)=>{
    const featureId = req.params.featureId;
    var updatedFeature = req.body;
    try{
         const updated =await ProjectFeatures.findByIdAndUpdate({_id: featureId}, updatedFeature ); 
         res.json(updated);
    }catch(err){
        res.json({msg:err});
    }
 });
module.exports = router;