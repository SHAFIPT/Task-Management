
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
      <div className={`${color} rounded-full p-3 mr-4 text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};
export default MetricCard
