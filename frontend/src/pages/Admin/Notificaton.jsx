import { useState } from 'react';
import { 
  FiMail, FiBell, FiSend, FiTrash2, 
  FiAlertCircle, FiCheckCircle, FiInfo 
} from 'react-icons/fi';

const NotificationsPage = () => {
  // Notification types
  const notificationTypes = [
    { id: 'offer', name: 'Special Offer', icon: <FiMail className="text-purple-500" /> },
    { id: 'order', name: 'Order Update', icon: <FiBell className="text-blue-500" /> },
    { id: 'system', name: 'System Alert', icon: <FiAlertCircle className="text-red-500" /> }
  ];

  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #KA-1024 has been placed by Priya Nair',
      date: '2023-06-15T10:30:00',
      read: false
    },
    {
      id: 2,
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #KA-1021 has been shipped to Anitha Menon',
      date: '2023-06-14T15:45:00',
      read: true
    },
    {
      id: 3,
      type: 'system',
      title: 'Inventory Alert',
      message: 'Kasavu Saree (Gold Border) is running low on stock',
      date: '2023-06-14T09:15:00',
      read: false
    },
    {
      id: 4,
      type: 'offer',
      title: 'Festival Offer Sent',
      message: 'Special Onam offer email sent to 324 customers',
      date: '2023-06-13T16:20:00',
      read: true
    },
    {
      id: 5,
      type: 'order',
      title: 'Payment Received',
      message: 'Payment for Order #KA-1019 has been confirmed',
      date: '2023-06-12T11:10:00',
      read: true
    }
  ]);

  // Email offer form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    customerGroup: 'all',
    schedule: 'now'
  });

  // Filter state
  const [filter, setFilter] = useState('all');
  const [composeOpen, setComposeOpen] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    return filter === 'all' || notification.type === filter;
  });

  // Mark as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Handle email form change
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({ ...emailForm, [name]: value });
  };

  // Send email offer
  const sendEmailOffer = (e) => {
    e.preventDefault();
    // In a real app, this would connect to your email service
    const newNotification = {
      id: notifications.length + 1,
      type: 'offer',
      title: `Offer Sent: ${emailForm.subject}`,
      message: `Email sent to ${emailForm.customerGroup === 'all' ? 'all' : 'selected'} customers`,
      date: new Date().toISOString(),
      read: false
    };
    
    setNotifications([newNotification, ...notifications]);
    setEmailForm({
      subject: '',
      message: '',
      customerGroup: 'all',
      schedule: 'now'
    });
    setComposeOpen(false);
    alert('Email offer has been scheduled for sending!');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <button 
          onClick={() => setComposeOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiSend className="mr-2" />
          Send Offer
        </button>
      </div>

      {/* Compose Email Offer Modal */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiMail className="mr-2 text-purple-500" />
                Compose Special Offer
              </h3>
              
              <form onSubmit={sendEmailOffer}>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={emailForm.subject}
                    onChange={handleEmailChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="E.g., Special Onam Discount!"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={emailForm.message}
                    onChange={handleEmailChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Write your offer details here..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="customerGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Group
                    </label>
                    <select
                      id="customerGroup"
                      name="customerGroup"
                      value={emailForm.customerGroup}
                      onChange={handleEmailChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Customers</option>
                      <option value="repeat">Repeat Customers</option>
                      <option value="inactive">Inactive Customers (30+ days)</option>
                      <option value="highvalue">High Value Customers</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule
                    </label>
                    <select
                      id="schedule"
                      name="schedule"
                      value={emailForm.schedule}
                      onChange={handleEmailChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="now">Send Now</option>
                      <option value="morning">Tomorrow Morning (9 AM)</option>
                      <option value="evening">Tomorrow Evening (6 PM)</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <FiSend className="mr-2" />
                    Send Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md flex items-center ${
              filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiBell className="mr-2" />
            All Notifications
          </button>
          
          {notificationTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`px-4 py-2 rounded-md flex items-center ${
                filter === type.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.icon}
              <span className="ml-2">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => {
              const notificationType = notificationTypes.find(t => t.id === notification.type);
              return (
                <li 
                  key={notification.id} 
                  className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {notificationType?.icon || <FiInfo className="text-gray-500" />}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-blue-800' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                          title="Mark as read"
                        >
                          <FiCheckCircle />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
              <FiMail size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Offers Sent</p>
              <p className="text-xl font-semibold">24</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <FiBell size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread Notifications</p>
              <p className="text-xl font-semibold">{notifications.filter(n => !n.read).length}</p>
              <p className="text-sm text-gray-500 mt-1">Need attention</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Offer Response Rate</p>
              <p className="text-xl font-semibold">18%</p>
              <p className="text-sm text-gray-500 mt-1">From last campaign</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;