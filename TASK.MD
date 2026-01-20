# BMI Web Application - Task List

รายการงาน (Task List) นี้อ้างอิงจากเอกสาร **Software Requirements Specification (SRS)** และ **TASK1.md** เพื่อให้สามารถติดตามสถานะการพัฒนาได้อย่างเป็นขั้นตอน

## Phase 1: การเตรียมโครงสร้างโปรเจกต์ (Project Setup)
> **Status: Completed**
- [x] **1.1 Initialize Project**
  - [x] สร้าง Next.js Project (App Router + TypeScript) (NFR-01)
  - [x] ตั้งค่า Tailwind CSS (NFR-09)
  - [x] ติดตั้ง Dependencies หลัก (Prisma, NextAuth, Recharts)
- [x] **1.2 Database Setup**
  - [x] ออกแบบ Database Schema เบื้องต้น (User, BMI_Record)
  - [x] ตั้งค่า Prisma ORM และ SQLite (NFR-01)
  - [x] Run Migration แรก

## Phase 2: ระบบจัดการผู้ใช้งาน (User Management)
> **Status: Completed**
- [x] **2.1 Authentication (FR-01 - FR-04)**
  - [x] สร้างหน้า Register (สมัครสมาชิก)
  - [x] สร้างหน้า Login (เข้าสู่ระบบ)
  - [x] เชื่อมต่อ NextAuth.js (Credentials Provider)
  - [x] ระบบ Hash Password (bcrypt) (NFR-06)
  - [x] สร้าง Logout Function
- [x] **2.2 Profile Management (FR-05)**
  - [x] เพิ่ม Table `profiles` หรือ Field ใน `users`:
    - [x] `gender` (เพศ)
    - [x] `age` (อายุ)
    - [x] `height_default` (ส่วนสูงเริ่มต้น)
    - [x] `unit_weight`, `unit_height` (หน่วยวัด)
  - [x] สร้าง API GET/PUT สำหรับ Profile
  - [x] สร้างหน้าแก้ไขโปรไฟล์ (Edit Profile)
- [x] **2.3 Admin Role (FR-18)**
  - [x] เพิ่ม Field `role` ใน User Table (admin/user)
  - [x] สร้างระบบตรวจสอบสิทธิ์ Admin (Middleware/Guard)

## Phase 3: การจัดการค่า BMI (BMI Core Features)
> **Status: Completed**
- [x] **3.1 BMI Calculator & Record (FR-06, FR-07)**
  - [x] สร้างฟอร์มบันทึกน้ำหนัก/ส่วนสูง
  - [x] Logic คำนวณ BMI และแปลผล (ผอม, ปกติ, อ้วน)
  - [x] บันทึกลง Database
- [x] **3.2 History View (FR-08)**
  - [x] แสดงรายการประวัติ BMI (Table/List)
  - [x] แสดงกราฟแนวโน้ม (Trend Chart) (FR-10)
- [x] **3.3 Manage Records (FR-09)**
  - [x] เพิ่มปุ่มลบรายการ (Delete)
  - [x] เพิ่มปุ่มแก้ไขรายการ (Edit)

## Phase 4: ระบบรายงาน (MIS Reports)
> **Status: Completed**
- [x] **4.1 User Reports (FR-12, FR-14 - FR-16)**
  - [x] สร้าง API สรุปข้อมูล (Daily, Weekly, Monthly, Yearly)
  - [x] สร้างหน้า Dashboard รายงาน (กราฟ/ตารางสรุป)
  - [x] ระบบเลือกช่วงเวลา (Period Selector)
- [x] **4.2 Admin Reports (FR-13)**
  - [x] สร้างหน้า Dashboard สำหรับ Admin (ดูภาพรวมระบบ)
  - [x] แสดงสถิติ: จำนวนผู้ใช้, BMI เฉลี่ยรวม, การกระจายตัว
- [x] **4.3 Filters (FR-17)**
  - [x] เพิ่มตัวกรอง (Filter) วันที่แบบกำหนดเอง
  - [x] (Admin) กรองตามกลุ่ม BMI

## Phase 5: การจัดการผู้ดูแลระบบ (Admin Features)
> **Status: Completed**
- [x] **5.1 User Management (FR-19)**
  - [x] หน้าแสดงรายชื่อผู้ใช้ทั้งหมด (User List)
  - [x] ดูรายละเอียดผู้ใช้ (User Detail & Stats)
  - [x] ระบบระงับ/แบนผู้ใช้ (Suspend/Ban)

## Phase 6: Non-Functional Requirements & Deployment
> **Status: Completed**
- [x] **6.1 Documentation**
  - [x] จัดทำ SRS (Software Requirements Specification)
- [x] **6.2 UI/UX Polish (NFR-09)**
  - [x] เพิ่มปุ่ม Back ในหน้า Login/Register
  - [x] เพิ่ม Footer ชื่อผู้จัดทำ
  - [x] ตรวจสอบ Responsive Design บนมือถือ
  - [x] ปรับปรุง Loading State / Error Handling
- [x] **6.3 Performance & Security (NFR-03 - NFR-06)**
  - [x] ทดสอบโหลดหน้า Dashboard < 3 วินาที
  - [x] ตรวจสอบ Data Isolation (User เห็นแค่ของตัวเอง)
  - [x] Review ความปลอดภัย (Password Hashing, API Protection)
- [x] **6.4 Reliability & Maintenance (NFR-07 - NFR-10)**
  - [x] แผนสำรองข้อมูล (Database Backup Strategy)
  - [x] ประเมินข้อจำกัด SQLite (Scalability Check)

---
*Last Updated: 2026-01-20*
