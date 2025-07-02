import { FaUserGraduate, FaBook, FaChalkboardTeacher } from 'react-icons/fa';

const iconMap = {
  'Total Students': <FaUserGraduate className="text-blue-500 text-3xl" />,
  'Total Courses': <FaBook className="text-green-500 text-3xl" />,
  'Faculty Members': <FaChalkboardTeacher className="text-purple-500 text-3xl" />,
};

export function SummaryCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-all">
      <div className="flex justify-center mb-2">
        {iconMap[title] || <div className="text-gray-400 text-3xl">📊</div>}
      </div>
      <h3 className="text-gray-700 text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-1">{value}</p>
    </div>
  );
}
