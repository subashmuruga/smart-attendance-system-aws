🚀 Smart Attendance System (AWS Serverless)

A cloud-based face recognition attendance system built using AWS Serverless Architecture.
This system automates attendance using face capture, stores records securely, provides role-based dashboards, analytics, report downloads, and sends real-time email notifications.
________________________________________
📌 Project Overview

The Smart Attendance System removes manual attendance and proxy issues by using face-based verification and a serverless cloud backend.
Users register, capture their face, and mark attendance through a modern web interface.
Attendance is recorded securely and can be viewed, analyzed, and exported by authorized roles.
________________________________________
✨ Key Features

👤 User Registration & Login

    •Role-based registration:

            o Admin

            o Staff

            o Student

  •	Secure login
  
  •	Face registration using webcam

📸 Face-Based Attendance

 •	Live camera capture
 
 •	Attendance marked only after face capture
 
 •	Prevents fake/proxy attendance
 
 •	Real-time success confirmation

🧑‍💼 Role-Based Dashboards

 •	Admin Dashboard – Full system access
 
 •	Staff Dashboard – Attendance & reports
 
 •	Student Dashboard – Personal attendance & analytics

📊 Attendance Management
 
 •	Date range filter
 
 •	Role-based filter
 
 •	Search by name / register number
 
 •	Clear PRESENT / ABSENT status

 •	Time-stamped entries

📥 Attendance Download
 
 •	Export reports as:
       o	CSV
       o	Excel (.xlsx)
       o	PDF

 •	Filter by date, role, and status

📈 Attendance Percentage & Analytics
 
 •	Total working days
 
 •	Present / Absent count
 
 •	Attendance percentage

 •	Visual donut chart
 
 •	Performance feedback message

📧 Email Notification (AWS SES)

 •	Automatic email after attendance marking
 
 •	Includes date, time, role, and status

•	Delivered using Amazon SES
________________________________________

🖼️ Application Screenshots

All major features are implemented and demonstrated below:

📝 User Registration – Account & Role Creation


<img width="1920" height="1020" alt="User Registration" src="https://github.com/user-attachments/assets/c0af6f6b-eb40-444c-8449-825d206217f5" />


📸 Face Registration – Live Camera Capture


<img width="1920" height="1020" alt="Face Registration" src="https://github.com/user-attachments/assets/0ab55b20-04c5-49a9-ae1d-3b957e1c2269" />


🔐 Login Page – Secure User Authentication


<img width="1920" height="1020" alt="Login Page" src="https://github.com/user-attachments/assets/ae09bcfb-f4bd-4a2b-b931-d8e505dd3bec" />


🔐 Admin Dashboard – Profile & System Modules

<img width="1920" height="1020" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/548bc1a4-f27e-405b-8b7b-2393425a3746" />


🧑‍🏫 Staff Dashboard – Attendance & Management Access


<img width="1920" height="1020" alt="Staff Dashboard" src="https://github.com/user-attachments/assets/927eb8e0-f0cc-4d3d-a3cb-93e858b54f81" />


🎓 Student Dashboard – Personal Attendance Overview


<img width="1920" height="1020" alt="Student Dashboard" src="https://github.com/user-attachments/assets/0d7b0089-27af-4693-9602-136129a5a51a" />


📸 Mark Attendance – Live Face Capture & Verification


<img width="1920" height="1020" alt="Mark Attendance" src="https://github.com/user-attachments/assets/529aef2e-9c90-4e5c-9446-d40fc26b2e39" />


📋 Attendance Records – Date & Role Filtering


<img width="1920" height="1020" alt="Attendance Records1" src="https://github.com/user-attachments/assets/886c874e-717f-45a9-a560-fdb7dc7e957c" />

<img width="1920" height="1020" alt="Attendance Records2" src="https://github.com/user-attachments/assets/964a1d24-a9bc-43a0-bb18-43fac06b154e" />


👥 User Management – Admin Control Panel


<img width="1920" height="1020" alt="User Management" src="https://github.com/user-attachments/assets/f054e6a1-1e28-4bd1-a208-62f3cb8b4940" />


📥 Attendance Download – CSV, Excel & PDF Reports


<img width="1920" height="1020" alt="Attendance Download" src="https://github.com/user-attachments/assets/207a893a-98f8-4984-987a-2d09b3f8b50a" />

<img width="1920" height="1020" alt="Attendance Download1" src="https://github.com/user-attachments/assets/76f5b428-3c45-4bb3-bf62-e594c039b021" />


📈 Attendance Percentage – Analytics & Visual Chart


<img width="1920" height="1020" alt="Attendance Percentage" src="https://github.com/user-attachments/assets/899a04b9-5aa0-459e-a888-39d028548304" />


📧 Email Notification – Attendance Confirmation


<img width="1917" height="874" alt="Email Notification" src="https://github.com/user-attachments/assets/a9b5f91b-fbae-4816-9228-f62cd6ff3ed1" />

________________________________________

☁️ AWS Architecture Diagram

The system follows a fully serverless AWS architecture, ensuring scalability, security, and low operational cost.

![AWS Architecture](architecture/aws-architecture.png)

Architecture Flow:

1.	User accesses frontend (browser)

2.	Requests sent via API Gateway

3.	AWS Lambda processes logic

4.	Attendance & user data stored in DynamoDB

5.	Face images stored in S3

6.	Email notification sent via SES
________________________________________

🛠️ Technology Stack

Frontend

•	HTML5

•	CSS3 (modern card-based UI)

•	JavaScript

•	Web Camera API

Backend (AWS Serverless)

•	AWS Lambda

•	Amazon API Gateway

•	Amazon DynamoDB

•	Amazon S3

•	Amazon SES (Email Service)
________________________________________

🗂️ Project Structure
smart-attendance-system-aws/

│

├── frontend/

│   ├── register.html

│   ├── register-face.html

│   ├── login.html

│   ├── admin-dashboard.html

│   ├── staff-dashboard.html

│   ├── student-dashboard.html

│   ├── mark-attendance.html

│   ├── attendance-records.html

│   ├── attendance-download.html

│   ├── attendance-percentage.html

│   └── user-management.html

│

├── lambda/

│   ├── registerUser.py

│   ├── markAttendance.py

│   ├── getAttendanceRecords.py

│   ├── sendEmailNotification.py

│   └── utils.py

│

├── screenshots/

│   ├── admin-dashboard.png

│   ├── staff-dashboard.png

│   ├── student-dashboard.png

│   ├── attendance-mark.png

│   └── attendance-percentage.png

│

├── architecture/

│   └── aws-architecture.png

│

├── README.md

├── LICENSE

└── .gitignore

________________________________________

🔄 Application Workflow

1.	User registers and selects role

2.	Face image captured and stored

3.	User logs in

4.	Face captured during attendance marking

5.	Attendance saved in DynamoDB

6.	Email notification sent via AWS SES

7.	Attendance available for analytics and download
________________________________________

🚀 Run Frontend Locally

cd frontend

python -m http.server 5500

Open in browser:

http://127.0.0.1:5500/frontend/login.html
________________________________________

🌟 Future Enhancements

•	AWS Rekognition integration

•	Mobile application

•	Admin approval workflow

•	OTP / MFA login

•	Advanced attendance analytics
________________________________________

👨‍💻 Author

Subash M

📧 mailtomsubash@gmail.com

🔗 GitHub: https://github.com/subashmuruga

Built with ❤️ using AWS Serverless Architecture


