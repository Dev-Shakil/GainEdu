'use client';

import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CourseChart({ courses, enrollments }) {
  const courseEnrollmentData = courses.map(course => ({
    name: course.title,
    count: enrollments.filter(en => Number(en.courseId) === Number(course.id)).length
  }));

  const chartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: courseEnrollmentData.map(c => c.name), title: { text: 'Courses' } },
    yaxis: { title: { text: 'Enrollments' }, min: 0 },
    dataLabels: { enabled: true }
  };

  const chartSeries = [{ name: 'Enrollments', data: courseEnrollmentData.map(c => c.count) }];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Course Enrollments</h2>
      {courseEnrollmentData.length > 0 ? (
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
      ) : (
        <p>No enrollment data available.</p>
      )}
    </div>
  );
}
