const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes')



//ROUTE 1: saving a note to the database through POST: at http://http://localhost:5000/api/notes/getnotes .Login required
router.post('/getnotes',fetchuser, [
    body('title', 'Please enter a valid title').isLength({ min: 3 }),
    body('description', 'Please enter a valid description').isLength({ min: 5 })
], async (req, res)=>{
    try{

        // checking for any invalid field in user req
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {title, description, tag} = req.body;
        
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const saved = await note.save();
        res.send(saved)
    }
    catch(error){
        console.error(error)
        res.status(500).send("Some error occured in internal server.")
    }
    
});

//ROUTE 2: saving a note to the database through GET: at http://http://localhost:5000/api/notes/sendallnotes .Login required
router.get('/sendallnotes',fetchuser, async (req, res)=>{
    try{
        
        const notes = await Notes.find({user: req.user.id})

        res.send(notes)
    }
    catch(error){
        console.error(error)
        res.status(500).send("Some error occured in internal server.")
    }
    
});

//ROUTE 2: saving a note to the database through PUT: at http://http://localhost:5000/api/notes/sendallnotes .Login required
router.put('/updatenote/:id',fetchuser, async (req, res)=>{
    try{

        // extracting the update data provided
        const {title, description, tag} = req.body;
        const newNote = {};
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        // checking if a note with the given id is available
        let note = await Notes.findById(req.params.id)
        if(!note){return res.status(404).send("Not found")}

        // checking if the user is allowed to update given note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }

        // if everything is ok, then update the note
        const updated = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({updated})
        
    }
    catch(error){
        console.error(error)
        res.status(500).send("Some error occured in internal server.")
    }
    
});

//ROUTE 3: Deleting a note from the database through DELETE: at http://http://localhost:5000/api/notes/deletenote .Login required
router.delete('/deletenote/:id',fetchuser, async (req, res)=>{
    try{

        // checking if a note with the given id is available
        let note = await Notes.findById(req.params.id)
        if(!note){return res.status(404).send("Not found")}

        // checking if the user is allowed to update given note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }

        //If everything is ok, then delete the note
        const out = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Sucess":"Note is successfully deleted", note: out})
    }
    catch(error){
        console.error(error)
        res.status(500).send("Some error occured in internal server.")
    }
    
});

module.exports = router