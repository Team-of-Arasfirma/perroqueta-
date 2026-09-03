import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import Career from "../models/Career.js";
import Application from "../models/Application.js";
import Inquiry from "../models/Inquiry.js";
import Admin from "../models/Admin.js";

const count = (Model, filter = {}) => Model.countDocuments(filter);

export const getDashboardSummary = async (req, res) => {
  try {
    const [
      projects, publishedProjects, completedProjects, ongoingProjects, upcomingProjects,
      blogs, publishedBlogs, draftBlogs,
      careers, openCareers, closedCareers, publishedCareers,
      applications, newApplications, reviewedApplications, shortlistedApplications, rejectedApplications, hiredApplications,
      inquiries, newInquiries, contactedInquiries, closedInquiries,
      admins, activeAdmins,
      recentApplications, recentInquiries,
    ] = await Promise.all([
      count(Project), count(Project, { published: true }), count(Project, { status: "Completed" }), count(Project, { status: "Ongoing" }), count(Project, { status: "Upcoming" }),
      count(Blog), count(Blog, { published: true }), count(Blog, { published: false }),
      count(Career), count(Career, { status: "Open" }), count(Career, { status: "Closed" }), count(Career, { published: true }),
      count(Application), count(Application, { status: "New" }), count(Application, { status: "Reviewed" }), count(Application, { status: "Shortlisted" }), count(Application, { status: "Rejected" }), count(Application, { status: "Hired" }),
      count(Inquiry), count(Inquiry, { status: "New" }), count(Inquiry, { status: "Contacted" }), count(Inquiry, { status: "Closed" }),
      count(Admin), count(Admin, { isActive: true }),
      Application.find().sort({ createdAt: -1 }).limit(5).select("fullName careerTitle status appliedAt createdAt").lean(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).select("fullName productInterest status createdAt").lean(),
    ]);

    return res.json({
      success: true,
      stats: {
        projects: { total: projects, published: publishedProjects, draft: projects - publishedProjects, completed: completedProjects, ongoing: ongoingProjects, upcoming: upcomingProjects },
        blogs: { total: blogs, published: publishedBlogs, draft: draftBlogs },
        careers: { total: careers, open: openCareers, closed: closedCareers, published: publishedCareers },
        applications: { total: applications, new: newApplications, reviewed: reviewedApplications, shortlisted: shortlistedApplications, rejected: rejectedApplications, hired: hiredApplications },
        inquiries: { total: inquiries, new: newInquiries, contacted: contactedInquiries, closed: closedInquiries },
        admins: { total: admins, active: activeAdmins, inactive: admins - activeAdmins },
      },
      recent: {
        applications: recentApplications,
        inquiries: recentInquiries,
      },
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    return res.status(500).json({ success: false, message: "Unable to load dashboard data." });
  }
};
