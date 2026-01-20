# Testing Plan - BMI Web Application

เอกสารนี้ระบุแผนการทดสอบ (Testing Plan) สำหรับ BMI Web Application เพื่อให้มั่นใจว่าระบบทำงานถูกต้องตาม Software Requirements Specification (SRS) และมีคุณภาพตามมาตรฐาน

## 1. วัตถุประสงค์ (Objectives)
*   เพื่อตรวจสอบความถูกต้องของฟังก์ชันการทำงานหลัก (Functional Requirements)
*   เพื่อตรวจสอบความปลอดภัยของข้อมูลและการเข้าถึงระบบ (Security)
*   เพื่อตรวจสอบประสิทธิภาพการทำงานของระบบ (Performance)
*   เพื่อลดข้อผิดพลาด (Bugs) ก่อนนำไปใช้งานจริง

## 2. ขอบเขตการทดสอบ (Scope)
การทดสอบจะครอบคลุมส่วนต่างๆ ดังนี้:
*   **Frontend UI**: การแสดงผล, การตอบสนองต่อผู้ใช้, ความถูกต้องของฟอร์ม
*   **Backend API**: ความถูกต้องของข้อมูล, HTTP Status Codes, Error Handling
*   **Database**: การบันทึก, การดึงข้อมูล, ความถูกต้องของความสัมพันธ์ข้อมูล
*   **Authentication**: กระบวนการสมัครสมาชิก, เข้าสู่ระบบ, และการจัดการ Session

## 3. เครื่องมือที่ใช้ (Tools)
*   **Playwright**: สำหรับ End-to-End (E2E) Testing และ Functional Testing
*   **Manual Testing**: สำหรับ UX/UI Polish และ Edge Cases ที่ซับซ้อน
*   **(Optional) Jest**: สำหรับ Unit Testing (หากมีการเพิ่ม Logic ที่ซับซ้อนในอนาคต)

## 4. แผนการทดสอบ (Test Strategy)

### 4.1 End-to-End (E2E) Testing
เน้นการทดสอบเสมือนผู้ใช้งานจริงผ่าน Browser โดยใช้ Playwright
**คำสั่งรัน:** `npm test` หรือ `npx playwright test`

#### Test Scenarios หลัก:

**A. Authentication (ระบบยืนยันตัวตน)**
| Case ID | Test Case Name | Description | Expected Result |
| :--- | :--- | :--- | :--- |
| AUTH-01 | Register Success | สมัครสมาชิกด้วยข้อมูลที่ถูกต้อง | Redirect ไปหน้า Login หรือ Dashboard |
| AUTH-02 | Login Success | เข้าสู่ระบบด้วย Email/Password ที่ถูกต้อง | Redirect ไปหน้า Dashboard |
| AUTH-03 | Login Fail | เข้าสู่ระบบด้วยรหัสผ่านผิด | แสดงข้อความ Error แจ้งเตือน |
| AUTH-04 | Logout | กดปุ่ม Logout | Redirect กลับหน้า Login/Home และเคลียร์ Session |
| AUTH-05 | Protected Route | เข้า URL `/dashboard` โดยไม่ Login | Redirect ไปหน้า Login ทันที |

**B. BMI Management (การจัดการ BMI)**
| Case ID | Test Case Name | Description | Expected Result |
| :--- | :--- | :--- | :--- |
| BMI-01 | Calculate BMI | กรอกน้ำหนัก/ส่วนสูง และกดคำนวณ | แสดงค่า BMI และแปลผลถูกต้อง |
| BMI-02 | Save Record | ตรวจสอบการบันทึกหลังคำนวณ | ข้อมูลปรากฏใน History Table |
| BMI-03 | Input Validation | กรอกค่าติดลบ หรือ 0 | ระบบไม่บันทึก และแจ้งเตือนให้แก้ไข |
| BMI-04 | View History | ดูประวัติย้อนหลัง | แสดงรายการเรียงลำดับวันที่ถูกต้อง |

**C. Reports & Dashboard (รายงาน)**
| Case ID | Test Case Name | Description | Expected Result |
| :--- | :--- | :--- | :--- |
| REP-01 | Dashboard Load | โหลดหน้า Dashboard | แสดงกราฟและสถิติภายใน 3 วินาที |
| REP-02 | Filter Period | เปลี่ยนช่วงเวลา (Daily/Weekly) | กราฟและข้อมูลอัปเดตตามช่วงเวลาที่เลือก |

### 4.2 Security Testing (ความปลอดภัย)
*   **Data Isolation**: ตรวจสอบว่า User A ไม่สามารถเห็นประวัติ BMI ของ User B ได้ (ผ่าน API และ UI)
*   **Input Sanitization**: ทดสอบกรอก Script ในช่อง Input (XSS Testing)
*   **API Security**: ทดสอบยิง API Endpoints โดยไม่มี Token (ต้องได้ 401 Unauthorized)

### 4.3 Performance Testing (ประสิทธิภาพ)
*   **Page Load Speed**: หน้า Dashboard ต้องโหลดเสร็จสิ้น < 3 วินาที (ภายใต้ Network ปกติ)
*   **API Response Time**: API หลัก (Calculate, Get History) ควรตอบสนอง < 500ms

## 5. การรายงานผล (Reporting)
*   ใช้ HTML Report ของ Playwright เพื่อดูรายละเอียด Pass/Fail
*   คำสั่งดูรายงาน: `npx playwright show-report`
*   หากพบ Bug ให้บันทึกรายละเอียด: ขั้นตอนการทำซ้ำ (Steps to reproduce), สิ่งที่คาดหวัง vs สิ่งที่เกิดจริง

## 6. สิ่งที่ต้องทำต่อไป (Future Plan)
*   [ ] เพิ่ม Test Cases สำหรับหน้า Admin Dashboard
*   [ ] เพิ่ม Unit Test สำหรับ Helper Functions (เช่น สูตรคำนวณ BMI)
*   [ ] ตั้งค่า CI/CD Pipeline (GitHub Actions) ให้รัน Test อัตโนมัติเมื่อมีการ Push Code

---
*Created by: Trae AI Assistant*
*Date: 2026-01-20*
