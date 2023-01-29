'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const mongoose    = require('mongoose');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const URI         = process.env.MONGO_URI;

// Connect to database
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
  open: {
    type: Boolean
  },
  status_text: {
    type: String,
  }
});

// Create Issue Model
const Issue = mongoose.model("Issue", issueSchema);


let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Submit issue on any project
app.post('api/issues/:project/', (req, res) => {
  // Create variables with the data for the new issue
  let myProject = req.params.project;
  let issueTitle = req.query.issue_title;
  let issueText = req.query.issue_text;
  let createdBy = req.query.created_by;
  let assignedTo = req.query.assigned_to;
  let statusText = req.query.status_text;

  // Adjust data according to input
  if (!issueTitle || !issueText || !createdBy) {
    return res.json({ error: 'required field(s) missing' })
  };

  if (!assignedTo) {
    assignedTo = "";
  };

  if (!statusText) {
    statusText = "";
  }

  // Set and format date
  let issueDate = new Date().toISOString();

  // Create issue bsed on issueSchema
  let newIssue = new Issue({
    project_title: myProject,
    issue_title: issueTitle,
    issue_text: issueText,
    created_on: issueDate,
    updated_on: issueDate,
    created_by: createdBy,
    assigned_to: assignedTo,
    open: true,
    status_next: statusNext,
  });

  newIssue.save((err, savedIssue) => {
    if (err) return console.error(err);
    return res.json({
      _id: savedIssue.id,
      issue_title: savedIssue.issue_title,
      issue_text: savedIssue.issue_text,
      created_on: savedIssue.created_on,
      updated_on: savedIssue.updated_on,
      created_by: savedIssue.created_by,
      assigned_to: savedIssue.assigned_to,
      open: savedIssue.open,
      status_text: savedIssue.status_text
    })
  });
});

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
