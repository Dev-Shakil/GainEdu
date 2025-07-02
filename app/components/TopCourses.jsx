export default function TopCourses({ courses, enrollments }) {
  const courseData = courses.map(course => ({
    name: course.title,
    count: enrollments.filter(en => Number(en.courseId) === Number(course.id)).length
  }));

  return (
    <div className="w-full md:w-[48%] bg-white shadow rounded-xl p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📚 Most Popular Courses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Course Title</th>
              <th className="px-4 py-2 border-b">Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {courseData
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((course, i) => (
                <tr key={course.name} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2 text-blue-600 font-bold">{course.count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
