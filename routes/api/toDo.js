const express = require('express');
const router = express.Router();
const Projects = require('../../models/Projects');
const ToDo = require('../../models/ToDo');

// Create a todo item
router.post('/:projectId/todo', async (req, res) =>{
    const projectId = req.params.projectId;
    const toDoItem = new ToDo({
        task: req.body.task,
        ownerProject: projectId,
    });
    try{
        const taskCreated = await ToDo.create(toDoItem);

        // Creating the reference in the Project
        const updatedProject = await Projects.findByIdAndUpdate(
            projectId,
            {$push: {toDo: taskCreated._id}}
        );
        // Returning the toDo task created
        res.json(taskCreated);
    }catch(err){
        res.json(err);
    }
});

// Get all the toDo tasks for a project
router.get('/:projectId/todo', async (req, res) => {
    const projectId = req.params.projectId;
    try{
        const toDoTasks = await ToDo.find({ownerProject: projectId});
        res.json(toDoTasks);
    }catch(err){
        res.json(err);
    }
});

// Get a particular toDo task for the project
router.get('/:projectId/todo/:toDoId', async (req, res)=>{
    const toDoId = req.params.toDoId;
    try{
        const toDoTask = await ToDo.findById(toDoId);
        res.json(toDoTask);
    }catch(err){
        res.json(err);
    }
});

// Delete a toDo task
router.delete('/:projectId/todo/:toDoId', async (req, res) =>{
    const projectId = req.params.projectId;
    const toDoId = req.params.toDoId;
    try{
        const deletedTask = await ToDo.findByIdAndDelete(toDoId);

        // Deleting the relation from the Projects
        await Projects.findByIdAndUpdate(
            projectId,
            {$pull: {toDo: deletedTask._id}}
        ); 
        res.json(deletedTask);
    }catch(err){
        res.json(err);
    }
});

// Update a toDo task
router.patch('/:projectId/todo/:toDoId', async (req, res)=>{
    const toDoId = req.params.toDoId;
    try{
        const updatedTask = await ToDo.findByIdAndUpdate({_id: toDoId}, req.body);
        res.json(updatedTask);
    }catch(err){
        res.json(err);
    }
});

module.exports = router;