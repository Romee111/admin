import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  // State for each data type
  const [salesOverview, setSalesOverview] = useState([]);
  const [orderOverview, setOrderOverview] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [customerDemographics, setCustomerDemographics] = useState([]);
  const [inventoryLevels, setInventoryLevels] = useState([]);

  useEffect(() => {
    // Fetch data from each endpoint
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get('/api/dashboard/sales-overview');
        setSalesOverview(salesResponse.data.data.salesByProduct);

        const orderResponse = await axios.get('/api/dashboard/order-overview');
        setOrderOverview(orderResponse.data.data);

        const revenueResponse = await axios.get('/api/dashboard/revenue-breakdown');
        setRevenueBreakdown(revenueResponse.data.data);

        const customerResponse = await axios.get('/api/dashboard/customer-demographics');
        setCustomerDemographics(customerResponse.data.data);

        const inventoryResponse = await axios.get('/api/dashboard/inventory-level');
        setInventoryLevels(inventoryResponse.data.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Define colors for charts
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid md:grid-cols-3 gap-4 p-6">
      {/* Sales Overview Line Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Sales Overview</h3>
        <LineChart width={300} height={200} data={salesOverview}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>

      {/* Orders Overview Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Orders Overview</h3>
        <BarChart width={300} height={200} data={orderOverview}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Orders" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* Revenue Breakdown Pie Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Revenue Breakdown</h3>
        <PieChart width={200} height={200}>
          <Pie
            data={revenueBreakdown}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="totalRevenue"
          >
            {revenueBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Customer Demographics Pie Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Customer Demographics</h3>
        <PieChart width={200} height={200}>
          <Pie
            data={customerDemographics}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="totalCustomers"
          >
            {customerDemographics.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Inventory Levels Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Inventory Levels</h3>
        <BarChart width={300} height={200} data={inventoryLevels}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default Dashboard;
