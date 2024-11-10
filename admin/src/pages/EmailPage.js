import { useEffect, useState } from 'react';

const EmailsPage = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const token = localStorage.getItem('token');
      try {
        // Check if token is available
        if (!token) {
          console.error("Token is missing!");
          return;
        }

        const response = await fetch('http://localhost:3000/restorex/queries/getAllQueries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data); // Log the data to check the structure

        if (data.message === "success") {
          setEmails(data.queries || []); // Ensure you're using the correct data property
        } else {
          console.error("Failed to fetch emails:", data.message || "No message");
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const handleReply = (email) => {
    setSelectedEmail(email);
    // Logic to open a modal or redirect to a reply page can go here
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Queries</h2>

      {/* Table to display emails */}
      <div className="overflow-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Sender</th>
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {emails.length > 0 ? (
              emails.map((email) => (
                <tr key={email._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{email.sender}</td>
                  <td className="py-3 px-6 text-left">{email.subject}</td>
                  <td className="py-3 px-6 text-left">{new Date(email.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">
                    <button 
                      onClick={() => handleReply(email)}
                      className="text-blue-500 hover:underline"
                    >
                      View/Reply
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3">No queries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing and replying to selected email */}
      {selectedEmail && (
        <div className="modal">
          <div className="modal-content bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-semibold">{selectedEmail.subject}</h3>
            <p className="mt-2">{selectedEmail.message}</p>
            <textarea 
              placeholder="Type your reply here..." 
              className="w-full p-2 border rounded mt-4" 
              rows="4"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Send Reply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailsPage;
