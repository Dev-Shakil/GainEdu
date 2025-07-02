'use client';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function StudentListPage() {
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const dispatch = useDispatch();
  const { students, courses, enrollments, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const isInCourse = filterCourse
        ? enrollments.some(en =>
            Number(en.studentId) === Number(student.id) &&
            Number(en.courseId) === Number(filterCourse)
          )
        : true;

      const matchesYear = filterYear ? student.year === filterYear : true;

      return matchesSearch && isInCourse && matchesYear;
    });
  }, [students, search, filterCourse, filterYear, enrollments]);

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedStudents,
    goToPage,
  } = usePagination(filteredStudents, 5);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🎓 Student List</h1>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-400"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="">📚 All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <select
          className="border rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-400"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">📆 All Years</option>
          {[...new Set(students.map(s => s.year))].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map(student => (
                    <tr
                      key={student.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium">{student.name}</td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4">{student.year}</td>
                      <td className="p-4">
                        <a
                          href={`/students/${student.id}`}
                          className="text-blue-600 hover:underline hover:text-blue-800 transition"
                        >
                          View Profile
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      ❌ No matching students found.
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
