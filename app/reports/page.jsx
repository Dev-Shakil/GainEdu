'use client';

import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function ReportsPage() {
  const dispatch = useDispatch();
  const { students, courses, faculty, enrollments } = useSelector(state => state.dashboard);

  const [studentYearFilter, setStudentYearFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const enrichedReportData = useMemo(() => {
    let filtered = students.map(student => {
      const enrolledCourses = enrollments
        .filter(e => Number(e.studentId) === Number(student.id))
        .map(e => {
          const course = courses.find(c => Number(c.id) === Number(e.courseId));
          const facultyName = faculty.find(f => Number(f.id) === Number(course?.facultyId))?.name || 'Unknown';
          return {
            courseTitle: course?.title || 'N/A',
            faculty: facultyName
          };
        });

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        gpa: student.gpa,
        year: student.year,
        enrolledCourses,
      };
    });

    if (studentYearFilter) {
      filtered = filtered.filter(s => s.year === studentYearFilter);
    }

    if (selectedCourseId) {
      filtered = filtered.filter(s =>
        s.enrolledCourses.some(ec =>
          Number(courses.find(c => c.title === ec.courseTitle)?.id) === Number(selectedCourseId)
        )
      );
    }

    if (facultyFilter) {
      filtered = filtered.filter(s =>
        s.enrolledCourses.some(ec => {
          const course = courses.find(c => c.title === ec.courseTitle);
          return course && String(course.facultyId) === String(facultyFilter);
        })
      );
    }

    return filtered.sort((a, b) => b.gpa - a.gpa);
  }, [students, enrollments, courses, faculty, studentYearFilter, selectedCourseId, facultyFilter]);

  const {
    paginatedData: paginatedReport,
    currentPage,
    totalPages,
    goToPage
  } = usePagination(enrichedReportData, 10);

  const handleExportCombined = () => {
    const rows = enrichedReportData.map(s => ({
      Name: s.name,
      Email: s.email,
      GPA: s.gpa,
      Year: s.year,
      Courses: s.enrolledCourses.map(c => `${c.courseTitle} (${c.faculty})`).join('; ')
    }));
    exportCSV('student_report.csv', rows);
  };
  const clearFilters = () => {
  setStudentYearFilter('');
  setSelectedCourseId('');
  setFacultyFilter('');
};
  const exportCSV = (filename, rows) => {
    if (!rows?.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(f => `"${row[f] ?? ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Student Report</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-3">
          <select
            value={studentYearFilter}
            onChange={(e) => setStudentYearFilter(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="">📆 All Years</option>
            {[...new Set(students.map(s => s.year))].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="">📘 All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="">👩‍🏫 All Faculty</option>
            {faculty.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button
    onClick={clearFilters}
    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
  >
    Clear Filters
  </button>
        </div>

        <button
          onClick={handleExportCombined}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">GPA</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">Courses (Faculty)</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReport.map((s, i) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-2 border">{(currentPage - 1) * 10 + i + 1}</td>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.email}</td>
              <td className="p-2 border font-bold">{s.gpa}</td>
              <td className="p-2 border">{s.year}</td>
              <td className="p-2 border text-xs">{s.enrolledCourses.map(c => `${c.courseTitle} (${c.faculty})`).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
    </div>
  );
}