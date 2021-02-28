const express = require('express');
const router = express.Router();
const Projects = require('../../models/Projects');
const Ticket = require('../../models/Ticket');

// Create a ticket
router.post('/:projectId/ticket', async (req, res)=>{
    const projectId = req.params.projectId;
    const ticket = new Ticket({
        title: req.body.title,
        category: req.body.category,
        status: req.body.status,
        ownerProject: projectId
    });
    try{
        const createTicket = await Ticket.create(ticket);

        // pushing the reference in the Projects
        const p =await Projects.findByIdAndUpdate(
            projectId,
            {$push:{ticket: createTicket._id}}
        );
        const project = await Projects.find().populate('ticket');
        res.json(createTicket);
        
    }catch(err){
        res.json(err);
    }
});

// Get all the tickets in the project
router.get('/:projectId/ticket', async (req, res) => {
    const projectId = req.params.projectId;
    try{
        const tickets = await Ticket.find({ownerProject: projectId});
        res.json(tickets);
    }catch(err){
        res.json(err);
    }
});

// Get a single ticket based on id
router.get('/:projectId/ticket/:ticketId', async (req, res)=>{
    const ticketId = req.params.ticketId;
    try{
        const ticket = await Ticket.findById(ticketId);
        res.json(ticket);
    }catch(err){
        res.json(err);
    }
});

// Delete a ticket
router.delete('/:projectId/ticket/:ticketId', async (req, res)=>{
    const projectId = req.params.projectId;
    const ticketId = req.params.ticketId;
    try{
        const deletedTask = await Ticket.findByIdAndDelete(ticketId);

        // Deleting the reference from the project
        await Projects.findByIdAndUpdate(
            projectId,
            {$pull: {ownerProject: deletedTask._id}}
        );
        res.json(deletedTask);
    }catch(err){
        res.json(err);
    }
});

// Update a ticket
router.patch('/:projectId/ticket/:ticketId', async (req, res) =>{
    const ticketId = req.params.ticketId;
    try{
        const updatedTicket = await Ticket.findByIdAndUpdate({_id: ticketId}, req.body);   
        res.json(updatedTicket);
    }catch(err){
        res.json(err);
    }
});

module.exports = router;