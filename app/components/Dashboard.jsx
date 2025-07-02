'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';
import { SummaryCard } from './SummaryCard';
import TopStudents from './TopStudents';
import TopCourses from './TopCourses';
import CourseChart from './CourseChart';


export default function Dashboard() {
  const dispatch = useDispatch();
  const { students, courses, faculty, enrollments, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Students" value={students.length} />
        <SummaryCard title="Total Courses" value={courses.length} />
        <SummaryCard title="Faculty Members" value={faculty.length} />
      </div>

      {/* Chart */}
      <CourseChart courses={courses} enrollments={enrollments} />

      {/* Tables */}
      <div className="flex flex-wrap gap-6 w-full">
        <TopStudents students={students} />
        <TopCourses courses={courses} enrollments={enrollments} />
      </div>
    </>
  );
}
