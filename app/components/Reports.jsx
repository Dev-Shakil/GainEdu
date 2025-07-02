'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import ReactApexChart from 'react-apexcharts';
import { exportToCsv } from '@/lib/exportToCsv';

export default function Reports() {
  const dispatch = useDispatch();
  const { students, courses, enrollments, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Enrollments per course (bar chart)
  const courseStats = courses.map(course => {
    const count = enrollments.filter(en => Number(en.courseId) === Number(course.id)).length;
    return { title: course.title, count };
  });

  // Top students per course
  const topStudentsByCourse = courses.map(course => {
    const courseEnrollments = enrollments.filter(en => en.courseId === course.id && en.grade);
    const withGrades = courseEnrollments.map(en => {
      const student = students.find(s => s.id == en.studentId);
      return student ? { name: student.name, grade: en.grade, course: course.title } : null;
    }).filter(Boolean);
    return {
      course: course.title,
      topStudents: withGrades.sort((a, b) => b.grade.localeCompare(a.grade)).slice(0, 3),
    };
  });

  const chartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: courseStats.map(c => c.title), title: { text: 'Courses' } },
    yaxis: { title: { text: 'Enrollments' }, min: 0 },
    dataLabels: { enabled: true },
  };

  const chartSeries = [{ name: 'Enrollments', data: courseStats.map(c => c.count) }];

  const handleExportCSV = () => {
    const data = courseStats.map(c => ({ Course: c.title, Enrollments: c.count }));
    exportToCsv('course-enrollments.csv', data);
  };

  return (
    <div className="space-y-10">
      {/* Course Enrollment Chart */}
      <div className="bg-white p-4 shadow rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">📈 Course Enrollments</h2>
          <button
            onClick={handleExportCSV}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ⬇️ Export CSV
          </button>
        </div>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
      </div>

      {/* Top Students per Course */}
      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-4">🏆 Top Performing Students per Course</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {topStudentsByCourse.map(course => (
            <div key={course.course}>
              <h3 className="font-semibold text-gray-800 mb-2">{course.course}</h3>
              <ul className="space-y-1">
                {course.topStudents.map((student, i) => (
                  <li key={i} className="text-gray-700">
                    {i + 1}. {student.name} – Grade: <strong>{student.grade}</strong>
                  </li>
                ))}
                {course.topStudents.length === 0 && (
                  <p className="text-sm text-gray-400">No grades submitted yet.</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
