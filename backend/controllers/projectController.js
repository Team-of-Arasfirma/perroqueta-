import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

const uploadImageToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "perroqueta/projects",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const getProjects = async (req, res) => {
  try {
    const filter = {};

    if (req.query.published === "true") {
      filter.published = true;
    }

    if (req.query.published === "false") {
      filter.published = false;
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      message: "Unable to load projects.",
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    ).lean();

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      message: "Unable to load project.",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      location,
      category,
      status,
      description,
      published,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Project title is required.",
      });
    }

    if (!location?.trim()) {
      return res.status(400).json({
        message: "Project location is required.",
      });
    }

    let image = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      const uploadResult =
        await uploadImageToCloudinary(req.file);

      image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const project = await Project.create({
      title: title.trim(),
      location: location.trim(),
      category: category?.trim() || "",
      status: status || "Completed",
      description: description?.trim() || "",
      published:
        published === undefined
          ? true
          : published === true ||
            published === "true",
      image,
    });

    return res.status(201).json({
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      message: "Unable to create project.",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const {
      title,
      location,
      category,
      status,
      description,
      published,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Project title is required.",
        });
      }

      project.title = title.trim();
    }

    if (location !== undefined) {
      if (!location.trim()) {
        return res.status(400).json({
          message: "Project location is required.",
        });
      }

      project.location = location.trim();
    }

    if (category !== undefined) {
      project.category =
        category?.trim() || "";
    }

    if (status !== undefined) {
      project.status = status;
    }

    if (description !== undefined) {
      project.description =
        description?.trim() || "";
    }

    if (published !== undefined) {
      project.published =
        published === true ||
        published === "true";
    }

    if (req.file) {
      if (project.image?.publicId) {
        try {
          await cloudinary.uploader.destroy(
            project.image.publicId
          );
        } catch (cloudinaryError) {
          console.error(
            "Old project image delete error:",
            cloudinaryError
          );
        }
      }

      const uploadResult =
        await uploadImageToCloudinary(req.file);

      project.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    await project.save();

    return res.status(200).json({
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      message: "Unable to update project.",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (project.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(
          project.image.publicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Project image delete error:",
          cloudinaryError
        );
      }
    }

    await project.deleteOne();

    return res.status(200).json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      message: "Unable to delete project.",
    });
  }
};