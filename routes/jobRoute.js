const express = require("express");
const { Job } = require("../model/jobModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const isAuth = require("../utils/isAuth");
const {validateRequest} = require("zod-express-middleware");
const { z } = require('zod');
// create the job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      logo,
      cnlogo,
      position,
      salary,
      jobType,
      remote,
      location,
      description,
      about,
      skills,
      information,
    } = req.body;

    const { user } = req; //get the user and decoded-id from authmiddleware
    // it get the sring from body and convert it array using split(',')
    const skill = skills.split(",").map((skill) => skill.trim());
    const jobs = new Job({
      name,
      logo,
      cnlogo,
      position,
      salary,
      jobType,
      remote,
      location,
      description,
      about,
      skills: skill,
      information,
      creator: user,
    });

    await jobs.save();
    res.status(201).json({ message: "job created successfully!!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "job not created !" });
  }
});

// get all the job
router.get("/", async (req, res) => {
  try {
    const isAuthenticated = isAuth(req);
    const allJobs = isAuthenticated
      ? await Job.find()
      : await Job.find().select("-_id -creator -__v");

    if (!allJobs) {
      return res.status(404).json({ message: "job not find" });
    }
    res.status(200).json(allJobs);
  } catch (err) {
    console.log("error: ", err);
  }
});

// Get specific job by ID (requires authentication)
router.get("/:id",validateRequest({
  params: z.object({
    id: z.string(),
  }),
}),authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    res.status(200).json(job);
  } catch (e) {
    res.status(404).json({ Error: e });
  }
});

// Delete a job (requires authentication)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    // Check if the logged-in user is the creator of the job
    // job.creator is the ObjectId of the user who created the job
    // req.user is the ID of the logged-in user (extracted from the JWT token by authMiddleware)
    // We use .toString() to convert both values to strings for comparison
    if (job.creator.toString() !== req.user.toString()) {
      return req
        .status(401)
        .json({ message: "You are not authorized to delete this job!" });
    }

    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: "job deleted successfully!" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
});

// Update a job (requires authentication)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      logo,
      cnlogo,
      position,
      salary,
      jobType,
      remote,
      location,
      description,
      about,
      skills,
      information,
    } = req.body;
    const skill = skills?.split(",").map((skill) => skill.trim());
    let job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    if (job.creator.toString() !== req.user.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this job!" });
    }
    job = await Job.findByIdAndUpdate(
      id,
      {
        name,
        logo,
        cnlogo,
        position,
        salary,
        jobType,
        remote,
        location,
        description,
        about,
        skills: skill,
        information,
      },
      { new: true }
    );
    res.status(200).json(job);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "job not updated!" });
  }
});

// get job by title
router.get("/search/:title", async (req, res) => {
  try {
    const { title } = req.params; //Assigns the entire req.params object

    // Create a regex to search jobs by title (case-insensitive)
    // "i" flag makes the regex case-insensitive
    const jobs = await Job.find({ name: new RegExp(title, "i") }).select(
      "-_id -creator -information"
    ); // Exclude certain fields from the result
    if (!jobs) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(jobs);
  } catch (err) {
    return res.status(404).json({ message: "job not found" });
  }
});

module.exports = router;
