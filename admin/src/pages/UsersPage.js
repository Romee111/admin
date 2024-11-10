// src/pages/UsersPage.js
import { useEffect, useState } from 'react';
import { TrashIcon, PlusIcon, PencilIcon, XIcon } from '@heroicons/react/outline';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    addresses: [
      {
        street: '',
        city: '',
        phone: ''
      }
    ]
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/v1/users/getAllUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Filter out only users with role "user"
        const filteredUsers = data.data ? data.data.filter(user => user.role === 'user') : [];
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('addresses.')) {
      const field = name.split('.')[1];
      setNewUser((prevUser) => ({
        ...prevUser,
        addresses: [{ ...prevUser.addresses[0], [field]: value }],
      }));
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  // Submit the add user form
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, createdUser]);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'user',
          addresses: [
            {
              street: '',
              city: '',
              phone: ''
            }
          ]
        });
        setShowModal(false);
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId)); // Remove deleted user from list
        console.log("User deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete user:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        <button
      style={{ backgroundColor: '#001f3f', color: '#fff' }}
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Usyer
        </button>
      </div>
      <div className="overflow-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr style={{ backgroundColor: '#001f3f', color: '#fff' }} > 
            <th className="py-3 px-6 text-left">No.</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {users.map((user,index) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td> 
                <td className="py-3 px-6 text-left">{user.name}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.addresses[0]?.phone || 'N/A'}</td> {/* Phone number */}
                <td className="py-3 px-6 text-center">
                  {/* <button className="text-blue-500 hover:text-blue-700 mr-2">
                    <PencilIcon className="h-5 w-5 inline" />
                  </button> */}
                  <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#001f3f', fontWeight: 'bold' }}>Add New User</h3>
              <button onClick={() => setShowModal(false)}>
                <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Street</label>
                <input
                  type="text"
                  name="addresses.street"
                  value={newUser.addresses[0].street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="addresses.city"
                  value={newUser.addresses[0].city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="addresses.phone"
                  value={newUser.addresses[0].phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ backgroundColor: '#001f3f', color: 'white' }}
 
                  className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#001f3f', color: 'white' }}
 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;


// import { useEffect, useState } from 'react';
// import { TrashIcon, PlusIcon, XIcon } from '@heroicons/react/outline';

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'user',
//     addresses: [
//       {
//         street: '',
//         city: '',
//         phone: ''
//       }
//     ]
//   });

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 5; // Set how many users you want to display per page

//   // Fetch users from API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch('http://localhost:3000/api/v1/users/getAllUsers', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();

//         // Filter out only users with role "user"
//         const filteredUsers = data.data ? data.data.filter(user => user.role === 'user') : [];
//         setUsers(filteredUsers);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Calculate summary data
//   const totalUsers = users.length;
//   const activeUsers = users.filter(user => user.status === 'active').length; // Assuming `status` field for activity status

//   // Find the newest user
//   const newestUser = users.reduce((latest, user) =>
//     new Date(user.createdAt) > new Date(latest.createdAt) ? user : latest, users[0]);

//   // Find the highest user (e.g., by highest role level or criteria)
//   const highestUser = users.reduce((highest, user) =>
//     user.orders?.length > (highest.orders?.length || 0) ? user : highest, users[0]);

//   // Get current users based on pagination
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

//   // Handle pagination page change
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Handle delete user
//   const handleDelete = async (userId) => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         setUsers(users.filter(user => user._id !== userId));
//       } else {
//         alert("Failed to delete user");
//       }
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//     }
//   };

//   // Handle form input changes for new user
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   // Handle address input change
//   const handleAddressChange = (e, index) => {
//     const { name, value } = e.target;
//     const newAddresses = [...newUser.addresses];
//     newAddresses[index] = { ...newAddresses[index], [name]: value };
//     setNewUser((prevUser) => ({
//       ...prevUser,
//       addresses: newAddresses,
//     }));
//   };

//   // Handle form submission to add a new user
//   const handleAddUserSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newUser),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setUsers([data.user, ...users]); // Add the new user to the front of the users list
//         setShowModal(false); // Close the modal after submission
//       } else {
//         alert("Failed to add user");
//       }
//     } catch (error) {
//       console.error("Failed to add user:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Summary Boxes */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="p-4 bg-green-500 text-white rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Total Users</h3>
//           <p className="text-2xl">{totalUsers}</p>
//         </div>
//         <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Active Users</h3>
//           <p className="text-2xl">{activeUsers}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="p-4 bg-yellow-500 text-white rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Newest User</h3>
//           <p className="text-lg">{newestUser ? newestUser.name : 'N/A'}</p>
//           <p>Email: {newestUser ? newestUser.email : 'N/A'}</p>
//         </div>
//         <div className="p-4 bg-purple-500 text-white rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Highest User</h3>
//           <p className="text-lg">{highestUser ? highestUser.name : 'N/A'}</p>
//           <p>Orders: {highestUser?.orders?.length || 0}</p>
//         </div>
//       </div>

//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Users</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add New User
//         </button>
//       </div>

//       <div className="overflow-auto rounded-lg shadow-md">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//             <tr>
//               <th className="py-3 px-6 text-left">No.</th>
//               <th className="py-3 px-6 text-left">Name</th>
//               <th className="py-3 px-6 text-left">Email</th>
//               <th className="py-3 px-6 text-left">Phone</th>
//               <th className="py-3 px-6 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700 text-sm font-light">
//             {currentUsers.map((user, index) => (
//               <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">{indexOfFirstUser + index + 1}</td>
//                 <td className="py-3 px-6 text-left">{user.name}</td>
//                 <td className="py-3 px-6 text-left">{user.email}</td>
//                 <td className="py-3 px-6 text-left">{user.addresses[0]?.phone || 'N/A'}</td>
//                 <td className="py-3 px-6 text-center">
//                   <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
//                     <TrashIcon className="h-5 w-5 inline" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-6">
//         <nav className="flex items-center">
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 text-white bg-blue-500 rounded-l hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             Previous
//           </button>
//           {[...Array(Math.ceil(totalUsers / usersPerPage))].map((_, index) => (
//             <button
//               key={index}
//               onClick={() => paginate(index + 1)}
//               className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:bg-blue-300`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
//             className="px-4 py-2 text-white bg-blue-500 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             Next
//           </button>
//         </nav>
//       </div>

//       {/* Modal for Adding New User */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">Add New User</h3>
//               <button onClick={() => setShowModal(false)}>
//                 <XIcon className="h-6 w-6 text-gray-500" />
//               </button>
//             </div>
//             <form onSubmit={handleAddUserSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={newUser.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={newUser.email}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={newUser.password}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   required
//                 />
//               </div>
//               {/* Address Form Fields */}
//               {newUser.addresses.map((address, index) => (
//                 <div key={index} className="mb-4">
//                   <h4 className="font-semibold">Address {index + 1}</h4>
//                   <label className="block text-gray-700">Street</label>
//                   <input
//                     type="text"
//                     name="street"
//                     value={address.street}
//                     onChange={(e) => handleAddressChange(e, index)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                     required
//                   />
//                   <label className="block text-gray-700">City</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={address.city}
//                     onChange={(e) => handleAddressChange(e, index)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                     required
//                   />
//                   <label className="block text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     value={address.phone}
//                     onChange={(e) => handleAddressChange(e, index)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                     required
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => setNewUser((prevUser) => ({
//                     ...prevUser,
//                     addresses: [...prevUser.addresses, { street: '', city: '', phone: '' }]
//                   }))}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//                 >
//                   Add Address
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersPage;
