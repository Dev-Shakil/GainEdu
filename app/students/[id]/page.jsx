
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = Number(params.id);

  const dispatch = useDispatch();
  const { students, courses, faculty, enrollments, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (students.length === 0 || courses.length === 0 || faculty.length === 0 || enrollments.length === 0) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, students.length, courses.length, faculty.length, enrollments.length]);

  const student = students.find(s => String(s.id) === String(studentId));

  if (loading) return <p className="p-6 text-center text-gray-600">Loading profile...</p>;
  if (!student) return <p className="p-6 text-center text-red-600">Student not found.</p>;

  const studentEnrollments = enrollments.filter(
    en => String(en.studentId) === String(studentId)
  );

  const enrolledCourses = studentEnrollments.map(enrollment => {
    const course = courses.find(c => String(c.id) === String(enrollment.courseId));
    const facultyMember = course ? faculty.find(f => String(f.id) === String(course.facultyId)) : null;

    return course ? {
      ...course,
      facultyName: facultyMember?.name || 'N/A',
      grade: enrollment.grade ?? 'N/A'
    } : null;
  }).filter(Boolean);


  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">{student.name}'s Profile</h1>

      {/* Student Info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">👤 Student Info</h2>
        <p><span className="font-medium text-gray-600">📧 Email:</span> {student.email}</p>
        <p><span className="font-medium text-gray-600">🎓 Year:</span> {student.year}</p>
        <p><span className="font-medium text-gray-600">📊 GPA:</span> {student.gpa}</p>
      </div>

      {/* Enrolled Courses */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📚 Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Faculty</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((course, index) => (
                  <tr key={`${course.id}-${index}`} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.code}</td>
                    <td className="p-3">{course.facultyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">This student is not enrolled in any courses.</p>
        )}
      </div>

      {/* Grades Placeholder */}
      {/* Grades & Progress */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📈 Grades & Progress</h2>

        {enrolledCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((course, index) => (
                  <tr key={`${course.id}-${index}`} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{course.title}</td>
                    <td className="p-3 font-medium">{course.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No course grades available yet.</p>
        )}
      </div>

    </div>
  );
}
