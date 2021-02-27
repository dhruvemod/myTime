const express = require('express');
const router = express.Router();
const DailyTask = require('../../models/DailyTasks');
const Project = require('../../models/Projects');

// Create a dailyTask
router.post('/:projectId/tasks', async (req, res) => {
    const projectId = req.params.projectId;
    const task = new DailyTask({
        task: req.body.task,
        ownerProject: projectId,
    });
    const createdTask = await DailyTask.create(task);
    // now pushing the task reference in the project
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $push: {dailyTasks: createdTask._id}
        },
    );
    const project = await Project.find().populate('dailyTasks');
    res.json(project);
});

// Get all tasks for the given date
router.get('/:projectId/tasks', async (req, res)=>{
    const projectId= req.params.projectId;
    const dateTime = new Date();
    var month = dateTime.getMonth()+1;
    try{
        const tasks = await DailyTask.find({todaysDate: dateTime.getDate()+'/'+month+'/'+dateTime.getFullYear(), ownerProject: projectId});
        res.json(tasks);
    }catch(err){
        res.json({msg:err});
    }
});

// Get a single task
router.get('/:projectId/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await DailyTask.findById({_id: taskId});
        res.json(task);
    } catch (error) {
        res.json(error);
    }
});

// Delete a task 
router.delete('/:projectId/tasks/:taskId', async (req, res)=>{
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    try{
        const taskDelete = await DailyTask.findByIdAndDelete({_id: taskId,});

        // Now deleting the reference in the Project
        const deletedReference = await Project.findByIdAndUpdate(
            projectId,
            {$pull: {dailyTasks: taskDelete._id}}
        );
        res.json(deletedReference);
    }catch(err){
        res.json(err);
    }
});

// Update a task
router.patch('/:projectId/tasks/:tasksId', async (req, res)=>{
    const dailyTaskId = req.params.tasksId;
   
    var updatedTask = req.body;
    try{
         const updated =await DailyTask.findByIdAndUpdate({_id: dailyTaskId}, updatedTask ); 
         res.json(updated);
    }catch(err){
        res.json({msg:err});
    }
});
module.exports = router;