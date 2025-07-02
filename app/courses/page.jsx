'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function CourseListPage() {
  const dispatch = useDispatch();
  const { courses, faculty, enrollments, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!courses.length || !faculty.length || !enrollments.length) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, courses.length, faculty.length, enrollments.length]);

  const enrichedCourses = courses.map(course => {
    const facultyMember = faculty.find(f => String(f.id) === String(course.facultyId));
    const enrollmentCount = enrollments.filter(en => String(en.courseId) === String(course.id)).length;

    return {
      ...course,
      facultyName: facultyMember?.name || 'N/A',
      enrollmentCount,
    };
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedCourses,
    goToPage
  } = usePagination(enrichedCourses, 5);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📘 Course List</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading courses...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Course Title</th>
                  <th className="px-6 py-3">Course Code</th>
                  <th className="px-6 py-3">Faculty Name</th>
                  <th className="px-6 py-3">Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map(course => (
                    <tr
                      key={course.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{course.title}</td>
                      <td className="px-6 py-4">{course.code}</td>
                      <td className="px-6 py-4">{course.facultyName}</td>
                      <td className="px-6 py-4">{course.enrollmentCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
