**LMS Portal**
This repository contains the source code for our Learning Management System (LMS).
The project has three major modules: Student Panel, Admin Panel and Instructor Panel.
Each module is developed by different team members but maintained in a single repository for better collaboration.

**Overview**

The LMS allows training institutes to manage students, courses, instructors and queries in one place.
Each user type has a separate panel with specific features.

**Modules**
**Student Panel**

This section is uploaded by Indra Teja.
Features include:

Student login and authentication

Access to assigned courses only

View lessons and materials

Track progress

Raise queries to admin or instructor

**Admin Panel**

To be developed by the admin team.
Admin responsibilities include:

Registering students (students cannot self-register)

Assigning courses based on fee/payment

Managing instructors and batches

Viewing student progress

Responding to student queries

**Instructor Panel**

To be developed by the instructor team.
Instructor features include:

Uploading lessons and materials

Managing enrolled students

Tracking student engagement

Handling queries

Branch Structure

Each panel is developed in its own branch to avoid conflicts.

student-panel

admin-panel

instructor-panel

Team members should commit only to their assigned branch.

Folder Structure
lms-portal/
   student/
   admin/
   instructor/
   shared-components/
   README.md


student/ – Student panel code

admin/ – Admin panel development

instructor/ – Instructor panel development

shared-components/ – Common components reusable across panels

**How to Contribute**
1. Clone the repository
git clone <repo-url>

2. Switch to your assigned branch

**Admin:**

git checkout admin-panel


**Instructor:**

git checkout instructor-panel

**3. Add your code**

Place your module inside the appropriate folder.

**4. Commit and push**
git add .
git commit -m "Added admin/instructor module update"
git push

**5. Create a Pull Request**

Once your update is ready, open a PR to merge your branch into main.

**Purpose**

This repo keeps all LMS panels organized in one place so our team can collaborate effectively and develop the complete system together.
