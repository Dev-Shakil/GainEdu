'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import axios from 'axios';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function FacultyPanel() {
  const dispatch = useDispatch();
  const { courses, students, enrollments, loading } = useSelector(state => state.dashboard);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignForm, setAssignForm] = useState({ studentId: '', courseId: '' });
  const [gradeUpdates, setGradeUpdates] = useState({});
  const [message, setMessage] = useState({ error: '', success: '' });

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const resetMessage = () => setMessage({ error: '', success: '' });

  const handleAssign = async (e) => {
    e.preventDefault();
    resetMessage();

    const { studentId, courseId } = assignForm;

    if (!studentId || !courseId) {
      return setMessage({ error: 'Please select both course and student.' });
    }

    const alreadyEnrolled = enrollments.some(
      en => en.courseId === Number(courseId) && en.studentId === Number(studentId)
    );

    if (alreadyEnrolled) {
      return setMessage({ error: 'Student already enrolled in this course.' });
    }

    try {
      await axios.post('http://localhost:4000/enrollments', {
        studentId: Number(studentId),
        courseId: Number(courseId),
        grade: ''
      });
      setAssignForm({ studentId: '', courseId: '' });
      setMessage({ success: 'Student assigned successfully!' });
      dispatch(fetchDashboardData());
    } catch {
      setMessage({ error: 'Failed to assign student.' });
    }
  };

  const handleGradeChange = (enrollmentId, newGrade) => {
    setGradeUpdates(prev => ({ ...prev, [enrollmentId]: newGrade }));
  };

  const handleGradeSubmit = async (enrollmentId) => {
    resetMessage();

    const newGrade = gradeUpdates[enrollmentId];
    if (!newGrade) return setMessage({ error: 'Please select a grade.' });

    try {
      await axios.patch(`http://localhost:4000/enrollments/${enrollmentId}`, {
        grade: newGrade
      });
      setMessage({ success: 'Grade updated successfully.' });
      dispatch(fetchDashboardData());
    } catch {
      setMessage({ error: 'Failed to update grade.' });
    }
  };

  const enrolledStudents = enrollments
    .filter(en => String(en.courseId) === String(selectedCourseId))
    .map(en => {
      const student = students.find(s => String(s.id) === String(en.studentId));
      return {
        ...en,
        studentName: student?.name || 'Unknown',
        studentEmail: student?.email || 'N/A'
      };
    });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedStudents,
    goToPage
  } = usePagination(enrolledStudents, 5); // 5 students per page

  const gradeOptions = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">👨‍🏫 Faculty Panel</h1>

      {/* Messages */}
      {message.error && <p className="text-red-600 font-medium">{message.error}</p>}
      {message.success && <p className="text-green-600 font-medium">{message.success}</p>}

      {/* Assign Student to Course */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📌 Assign Student to Course</h2>
        <form className="flex flex-col sm:flex-row gap-4 flex-wrap" onSubmit={handleAssign}>
          <select
            className="border rounded-lg p-3 w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            value={assignForm.courseId}
            onChange={(e) => setAssignForm({ ...assignForm, courseId: e.target.value })}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-3 w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            value={assignForm.studentId}
            onChange={(e) => setAssignForm({ ...assignForm, studentId: e.target.value })}
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Assign
          </button>
        </form>
      </div>

      {/* Manage Grades Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🎯 Manage Grades</h2>

        <select
          className="border rounded-lg p-3 mb-6 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">Select Course to View Enrolled Students</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        {selectedCourseId ? (
          enrolledStudents.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Grade</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map(en => (
                      <tr key={en.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium">{en.studentName}</td>
                        <td className="px-6 py-4">{en.studentEmail}</td>
                        <td className="px-6 py-4">
                          <select
                            value={gradeUpdates[en.id] ?? en.grade ?? ''}
                            onChange={(e) => handleGradeChange(en.id, e.target.value)}
                            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                          >
                            <option value="">Select</option>
                            {gradeOptions.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            onClick={() => handleGradeSubmit(en.id)}
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-500">No students enrolled in this course.</p>
          )
        ) : (
          <p className="text-gray-500">Select a course to manage grades.</p>
        )}
      </div>
    </div>
  );
}
