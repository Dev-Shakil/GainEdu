export default function TopStudents({ students }) {
  const topStudents = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);

  return (
    <div className="w-full md:w-[48%] bg-white shadow rounded-xl p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">🎓 Top Students by GPA</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">GPA</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2 text-blue-700 font-bold">{s.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
