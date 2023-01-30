'use strict';


// Create Issue Schema
const issueSchema = new mongoose.Schema({
  project_title: {
    type: String
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: String
  },
  updated_on: {
    type: String
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
  }
});

// Create Issue Model
const Issue = mongoose.model("Issue", issueSchema);
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_on = new Date().toISOString();
      let updated_on = new Date().toISOString();
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let open = true;
      let status_text = req.body.status_text;

      // Return error if required fields aren't provided
      if (!issue_title || !issue_text || !created_by) {
        res.json ({ error: 'required field(s) missing' })
      }

      // Set optional fields to empty string if no information is given
      if (!assigned_to) {
        assigned_to = ""
      }

      if (!status_text) {
        status_text = ""
      }
      // Create new Issue with provided data
      let newIssue = new Issue({
        project_title: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: created_on,
        updated_on: updated_on,
        created_by: created_by,
        assigned_to: assigned_to,
        open: open,
        status_text: status_text
      });

      // Save new Issue into the database
      newIssue.save((err, savedIssue) => {
        if (err) console.error(err);
        return res.json({
          assigned_to: savedIssue.assigned_to,
          status_text: savedIssue.status_text,
          open: savedIssue.open,
          _id: savedIssue.id,
          issue_title: savedIssue.issue_title,
          issue_text: savedIssue.issue_text,
          created_by: savedIssue.created_by,
          created_on: savedIssue.created_on,
          updated_on: savedIssue.updated_on
        });
      });
    });
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
